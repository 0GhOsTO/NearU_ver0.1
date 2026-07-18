begin;

-- Supabase grants EXECUTE to anon/authenticated via default privileges, so the
-- create_messaging migration's `revoke ... from public` left anon still able to
-- call these functions. Remove anon explicitly. authenticated keeps EXECUTE
-- because the app calls these RPCs while signed in.
revoke execute on function public.is_conversation_participant(uuid) from anon;
revoke execute on function public.start_conversation(uuid) from anon;
revoke execute on function public.mark_conversation_read(uuid) from anon;
revoke execute on function public.list_my_conversations() from anon;

-- Trigger function is never meant to be invoked directly as an RPC; triggers
-- still fire regardless of EXECUTE grants.
revoke execute on function public.messages_bump_conversation() from public, anon, authenticated;

commit;
