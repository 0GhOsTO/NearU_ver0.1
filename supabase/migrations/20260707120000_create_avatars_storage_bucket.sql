begin;

-- Public-read avatars bucket. Reads are served via the public object endpoint
-- (getPublicUrl); writes are RLS-restricted to each user's own folder so a user
-- can only create/modify/delete objects under a path named after their uid.
-- The URL is stored in public.profiles.profile_photo_url.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152, -- 2 MiB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- RLS is already enabled on storage.objects by Supabase. Owner-scoping predicate:
-- the first path segment must equal the caller's uid, e.g. "<uid>/<file>.jpg".
drop policy if exists "Avatar upload own folder" on storage.objects;
create policy "Avatar upload own folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Avatar update own folder" on storage.objects;
create policy "Avatar update own folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Avatar delete own folder" on storage.objects;
create policy "Avatar delete own folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

commit;
