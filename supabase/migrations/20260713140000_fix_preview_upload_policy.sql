-- The template-previews storage policies required profiles.role in
-- ('creator', 'admin'), but nothing in the app ever promotes a user to
-- that role -- new accounts default to 'buyer' forever (see
-- public.handle_new_user()). Meanwhile templates.insert is actually
-- gated by having a row in public.creators (auto-created for any
-- verified user via ensureCreatorByProfile), so preview image uploads
-- were blocked for every real user. Align the storage policies with the
-- same "has a creators row" check templates already use.

drop policy "Creators upload template previews" on storage.objects;
drop policy "Creators update their preview objects" on storage.objects;
drop policy "Creators delete their preview objects" on storage.objects;

create policy "Creators upload template previews"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'template-previews'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and exists (
    select 1 from public.creators
    where creators.profile_id = (select auth.uid())
  )
);

create policy "Creators update their preview objects"
on storage.objects for update
to authenticated
using (
  bucket_id = 'template-previews'
  and owner_id = (select auth.uid()::text)
  and exists (
    select 1 from public.creators
    where creators.profile_id = (select auth.uid())
  )
)
with check (
  bucket_id = 'template-previews'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and exists (
    select 1 from public.creators
    where creators.profile_id = (select auth.uid())
  )
);

create policy "Creators delete their preview objects"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'template-previews'
  and owner_id = (select auth.uid()::text)
  and exists (
    select 1 from public.creators
    where creators.profile_id = (select auth.uid())
  )
);
