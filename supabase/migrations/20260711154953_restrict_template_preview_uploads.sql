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
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role in ('creator', 'admin')
  )
);

create policy "Creators update their preview objects"
on storage.objects for update
to authenticated
using (
  bucket_id = 'template-previews'
  and owner_id = (select auth.uid()::text)
  and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role in ('creator', 'admin')
  )
)
with check (
  bucket_id = 'template-previews'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role in ('creator', 'admin')
  )
);

create policy "Creators delete their preview objects"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'template-previews'
  and owner_id = (select auth.uid()::text)
  and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role in ('creator', 'admin')
  )
);
