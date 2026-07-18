begin;

-- Replace the public profile view with a real table containing only safe
-- display fields. This lets public discovery avoid broad direct reads from
-- public.profiles, which also contains private/account fields.
drop view if exists public.profiles_public;

create table if not exists public.profiles_public (
  id uuid primary key references public.profiles(id) on delete cascade,
  display_name text,
  profile_photo_url text,
  trust_score numeric,
  number_of_reviews integer,
  completed_deals_count integer,
  bio text,
  school_name text,
  approximate_location extensions.geography
);

alter table public.profiles_public enable row level security;

revoke all on public.profiles_public from anon;
revoke all on public.profiles_public from authenticated;
grant select on public.profiles_public to authenticated;

drop policy if exists "Authenticated can view public profiles" on public.profiles_public;
create policy "Authenticated can view public profiles"
on public.profiles_public
for select
to authenticated
using (true);

insert into public.profiles_public (
  id,
  display_name,
  profile_photo_url,
  trust_score,
  number_of_reviews,
  completed_deals_count,
  bio,
  school_name,
  approximate_location
)
select
  id,
  display_name,
  profile_photo_url,
  trust_score,
  number_of_reviews,
  completed_deals_count,
  bio,
  school_name,
  (extensions.st_snaptogrid((general_coordinate)::extensions.geometry, 0.008))::extensions.geography
from public.profiles
where account_status = 'active'
on conflict (id) do update set
  display_name = excluded.display_name,
  profile_photo_url = excluded.profile_photo_url,
  trust_score = excluded.trust_score,
  number_of_reviews = excluded.number_of_reviews,
  completed_deals_count = excluded.completed_deals_count,
  bio = excluded.bio,
  school_name = excluded.school_name,
  approximate_location = excluded.approximate_location;

create or replace function public.sync_profiles_public()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if tg_op = 'DELETE' then
    delete from public.profiles_public where id = old.id;
    return old;
  end if;

  if new.account_status = 'active' then
    insert into public.profiles_public (
      id,
      display_name,
      profile_photo_url,
      trust_score,
      number_of_reviews,
      completed_deals_count,
      bio,
      school_name,
      approximate_location
    )
    values (
      new.id,
      new.display_name,
      new.profile_photo_url,
      new.trust_score,
      new.number_of_reviews,
      new.completed_deals_count,
      new.bio,
      new.school_name,
      (extensions.st_snaptogrid((new.general_coordinate)::extensions.geometry, 0.008))::extensions.geography
    )
    on conflict (id) do update set
      display_name = excluded.display_name,
      profile_photo_url = excluded.profile_photo_url,
      trust_score = excluded.trust_score,
      number_of_reviews = excluded.number_of_reviews,
      completed_deals_count = excluded.completed_deals_count,
      bio = excluded.bio,
      school_name = excluded.school_name,
      approximate_location = excluded.approximate_location;
  else
    delete from public.profiles_public where id = new.id;
  end if;

  return new;
end;
$$;

revoke all on function public.sync_profiles_public() from public;
revoke all on function public.sync_profiles_public() from anon;
revoke all on function public.sync_profiles_public() from authenticated;

drop trigger if exists profiles_sync_public on public.profiles;
create trigger profiles_sync_public
after insert or update or delete on public.profiles
for each row execute function public.sync_profiles_public();

-- Remove broad direct access to private/account columns on profiles. Users can
-- still read their own full profile via the existing "Own row select" policy.
drop policy if exists "Active profiles viewable by authenticated" on public.profiles;

commit;
