begin;

-- Messaging: 1:1 direct messages (next_step.txt #11).
--
-- The Postgres tables are the durable source of truth for chat history. Supabase
-- Realtime is only a live push layer on top of public.messages; a missed realtime
-- event never loses data because the initial load and pagination read the table.
--
-- A conversation is one row per unordered pair of users, kept canonical by storing
-- the smaller uuid in user_a and the larger in user_b. That makes /messages/[userId]
-- resolve to exactly one conversation via start_conversation().

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  -- Denormalized latest-activity time, maintained by trigger; drives list ordering.
  last_message_at timestamptz not null default now(),
  -- Per-participant read cursor. Unread = messages after my cursor sent by the other.
  user_a_last_read_at timestamptz not null default now(),
  user_b_last_read_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint conversations_canonical_order check (user_a < user_b),
  constraint conversations_pair_unique unique (user_a, user_b)
);

create index if not exists conversations_user_a_idx on public.conversations (user_a);
create index if not exists conversations_user_b_idx on public.conversations (user_b);
create index if not exists conversations_last_message_at_idx
  on public.conversations (last_message_at desc);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  constraint messages_body_length check (char_length(btrim(body)) between 1 and 4000)
);

-- History pagination (created_at < before) and latest-message lookup.
create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at desc);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- SECURITY DEFINER so the messages policies can check participation without
-- recursing into the conversations RLS (and without needing conversations SELECT
-- on the message author path).
create or replace function public.is_conversation_participant(p_conversation uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.conversations c
    where c.id = p_conversation
      and auth.uid() in (c.user_a, c.user_b)
  );
$$;

-- Keep conversations.last_message_at in step with the newest message.
create or replace function public.messages_bump_conversation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
    set last_message_at = new.created_at
    where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists messages_bump_last_message_at on public.messages;
create trigger messages_bump_last_message_at
after insert on public.messages
for each row execute function public.messages_bump_conversation();

-- Resolve the /messages/[userId] counterpart to a conversation, creating it once.
-- Rejects self-conversations and either-direction blocks. Idempotent on the pair.
create or replace function public.start_conversation(p_other uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_a uuid;
  v_b uuid;
  v_id uuid;
begin
  if v_me is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;
  if p_other is null or p_other = v_me then
    raise exception 'Invalid conversation target' using errcode = '22023';
  end if;
  if not exists (select 1 from public.profiles where id = p_other) then
    raise exception 'User not found' using errcode = '22023';
  end if;
  if exists (
    select 1 from public.user_blocks
    where (user_id = v_me and blocked_user_id = p_other)
       or (user_id = p_other and blocked_user_id = v_me)
  ) then
    raise exception 'Cannot message this user' using errcode = '42501';
  end if;

  v_a := least(v_me, p_other);
  v_b := greatest(v_me, p_other);

  insert into public.conversations (user_a, user_b)
  values (v_a, v_b)
  on conflict (user_a, user_b) do nothing;

  select id into v_id
  from public.conversations
  where user_a = v_a and user_b = v_b;

  return v_id;
end;
$$;

-- Move only the caller's own read cursor. Column-scoped so no broad UPDATE policy
-- on conversations is needed.
create or replace function public.mark_conversation_read(p_conversation uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me uuid := auth.uid();
begin
  update public.conversations
    set user_a_last_read_at =
          case when user_a = v_me then now() else user_a_last_read_at end,
        user_b_last_read_at =
          case when user_b = v_me then now() else user_b_last_read_at end
    where id = p_conversation
      and v_me in (user_a, user_b);
end;
$$;

-- One-shot conversation list for the inbox: newest first, with the other user's id,
-- the last message preview, and the caller's unread count. The server action stitches
-- profiles_public for display name / avatar. Only conversations with a message show.
create or replace function public.list_my_conversations()
returns table (
  conversation_id uuid,
  other_user_id uuid,
  last_message_body text,
  last_message_at timestamptz,
  unread_count integer
)
language sql
security definer
set search_path = public
stable
as $$
  select
    c.id as conversation_id,
    case when c.user_a = auth.uid() then c.user_b else c.user_a end as other_user_id,
    lm.body as last_message_body,
    c.last_message_at,
    coalesce(uc.cnt, 0)::int as unread_count
  from public.conversations c
  left join lateral (
    select m.body
    from public.messages m
    where m.conversation_id = c.id
    order by m.created_at desc
    limit 1
  ) lm on true
  left join lateral (
    select count(*) as cnt
    from public.messages m
    where m.conversation_id = c.id
      and m.sender_id <> auth.uid()
      and m.created_at > case
        when c.user_a = auth.uid() then c.user_a_last_read_at
        else c.user_b_last_read_at
      end
  ) uc on true
  where auth.uid() in (c.user_a, c.user_b)
    and lm.body is not null
  order by c.last_message_at desc;
$$;

-- Grants. Table writes to conversations happen only through SECURITY DEFINER RPCs.
revoke all on public.conversations from anon, authenticated;
revoke all on public.messages from anon, authenticated;
grant select on public.conversations to authenticated;
grant select, insert on public.messages to authenticated;

drop policy if exists "Participants read conversations" on public.conversations;
create policy "Participants read conversations"
on public.conversations
for select
to authenticated
using ((select auth.uid()) in (user_a, user_b));

drop policy if exists "Participants read messages" on public.messages;
create policy "Participants read messages"
on public.messages
for select
to authenticated
using (public.is_conversation_participant(conversation_id));

-- sender_id is pinned to the caller and participation is re-checked, so a user
-- cannot post as someone else or into a conversation they are not part of.
-- No update/delete policies: message history is immutable.
drop policy if exists "Participants send messages" on public.messages;
create policy "Participants send messages"
on public.messages
for insert
to authenticated
with check (
  sender_id = (select auth.uid())
  and public.is_conversation_participant(conversation_id)
);

revoke all on function public.is_conversation_participant(uuid) from public;
revoke all on function public.start_conversation(uuid) from public;
revoke all on function public.mark_conversation_read(uuid) from public;
revoke all on function public.list_my_conversations() from public;
grant execute on function public.is_conversation_participant(uuid) to authenticated;
grant execute on function public.start_conversation(uuid) to authenticated;
grant execute on function public.mark_conversation_read(uuid) to authenticated;
grant execute on function public.list_my_conversations() to authenticated;

-- Enable Realtime Postgres Changes for live message delivery. The publication was
-- previously empty; RLS on public.messages scopes which rows each client receives.
alter publication supabase_realtime add table public.messages;

commit;
