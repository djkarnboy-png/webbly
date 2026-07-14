-- Webbly has one normal account type. Listing work is a capability any
-- verified account can use; it is not a buyer/seller role distinction.
alter table public.profiles
drop constraint if exists profiles_role_check;

update public.profiles
set role = 'user'
where role in ('buyer', 'creator');

alter table public.profiles
alter column role set default 'user';

alter table public.profiles
add constraint profiles_role_check check (role in ('user', 'admin'));

create or replace function private.is_verified_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users
    where id = (select auth.uid())
      and email_confirmed_at is not null
  );
$$;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    join auth.users on auth.users.id = profiles.id
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
      and auth.users.email_confirmed_at is not null
  );
$$;

revoke all on function private.is_verified_user() from public;
revoke all on function private.is_admin() from public;
grant execute on function private.is_verified_user() to authenticated;
grant execute on function private.is_admin() to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_name text;
begin
  selected_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    split_part(coalesce(new.email, 'Webbly user'), '@', 1)
  );

  insert into public.profiles (
    id,
    full_name,
    username,
    role,
    avatar_url
  ) values (
    new.id,
    selected_name,
    nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
    'user',
    nullif(trim(new.raw_user_meta_data ->> 'avatar_url'), '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

-- Profiles ---------------------------------------------------------------

drop policy if exists "Users read their own profile" on public.profiles;
drop policy if exists "Users create their own profile" on public.profiles;
drop policy if exists "Users update their own profile" on public.profiles;

create policy "Verified users read their own profile"
on public.profiles for select
to authenticated
using (
  (select private.is_verified_user())
  and (
    id = (select auth.uid())
    or (select private.is_admin())
  )
);

create policy "Verified users create their own profile"
on public.profiles for insert
to authenticated
with check (
  (select private.is_verified_user())
  and id = (select auth.uid())
  and role = 'user'
);

create policy "Verified users update their own profile"
on public.profiles for update
to authenticated
using (
  (select private.is_verified_user())
  and id = (select auth.uid())
)
with check (
  (select private.is_verified_user())
  and id = (select auth.uid())
);

-- Public creator profiles remain readable. Private listing profile access
-- is limited to the verified owner or a verified administrator.
drop policy if exists "Users read allowed listing profiles" on public.creators;
drop policy if exists "Users create their own listing profile" on public.creators;
drop policy if exists "Users update their own listing profile" on public.creators;

create policy "Users read allowed listing profiles"
on public.creators for select
to authenticated
using (
  is_verified = true
  or private.creator_has_published_listing(id)
  or (
    (select private.is_verified_user())
    and (
      profile_id = (select auth.uid())
      or (select private.is_admin())
    )
  )
);

create policy "Verified users create their own listing profile"
on public.creators for insert
to authenticated
with check (
  (select private.is_verified_user())
  and profile_id = (select auth.uid())
  and is_verified = false
  and completed_projects = 0
  and rating = 4.8
);

create policy "Verified users update their own listing profile"
on public.creators for update
to authenticated
using (
  (select private.is_verified_user())
  and profile_id = (select auth.uid())
)
with check (
  (select private.is_verified_user())
  and profile_id = (select auth.uid())
);

-- Template listings ------------------------------------------------------

drop policy if exists "Users read allowed templates" on public.templates;
drop policy if exists "Users add their own listings" on public.templates;
drop policy if exists "Owners and admins update listings" on public.templates;
drop policy if exists "Users delete their own listings" on public.templates;

create policy "Users read allowed templates"
on public.templates for select
to authenticated
using (
  status = 'published'
  or (
    (select private.is_verified_user())
    and (
      (select private.is_admin())
      or exists (
        select 1
        from public.creators
        where creators.id = templates.creator_id
          and creators.profile_id = (select auth.uid())
      )
    )
  )
);

create policy "Verified users add their own listings"
on public.templates for insert
to authenticated
with check (
  (select private.is_verified_user())
  and status = 'published'
  and is_featured = false
  and fit_score = 90
  and rating = 4.8
  and exists (
    select 1
    from public.creators
    where creators.id = templates.creator_id
      and creators.profile_id = (select auth.uid())
  )
);

create policy "Verified owners and admins update listings"
on public.templates for update
to authenticated
using (
  (select private.is_verified_user())
  and (
    (select private.is_admin())
    or exists (
      select 1
      from public.creators
      where creators.id = templates.creator_id
        and creators.profile_id = (select auth.uid())
    )
  )
)
with check (
  (select private.is_verified_user())
  and (
    (select private.is_admin())
    or (
      status in ('published', 'archived')
      and is_featured = false
      and exists (
        select 1
        from public.creators
        where creators.id = templates.creator_id
          and creators.profile_id = (select auth.uid())
      )
    )
  )
);

create policy "Verified users delete their own listings"
on public.templates for delete
to authenticated
using (
  (select private.is_verified_user())
  and exists (
    select 1
    from public.creators
    where creators.id = templates.creator_id
      and creators.profile_id = (select auth.uid())
  )
);

-- Contact and website requests ------------------------------------------

drop policy if exists "Visitors submit website requests" on public.website_requests;
drop policy if exists "Users read connected requests" on public.website_requests;
drop policy if exists "Listing owners and admins update requests" on public.website_requests;

create policy "Verified users submit website requests"
on public.website_requests for insert
to authenticated
with check (
  (select private.is_verified_user())
  and buyer_id = (select auth.uid())
  and status = 'new'
  and (
    template_id is null
    or exists (
      select 1
      from public.templates
      where templates.id = website_requests.template_id
        and (
          website_requests.creator_id is null
          or website_requests.creator_id = templates.creator_id
        )
    )
  )
);

create policy "Verified users read connected requests"
on public.website_requests for select
to authenticated
using (
  (select private.is_verified_user())
  and (
    buyer_id = (select auth.uid())
    or exists (
      select 1
      from public.creators
      where creators.id = website_requests.creator_id
        and creators.profile_id = (select auth.uid())
    )
    or exists (
      select 1
      from public.templates
      join public.creators on creators.id = templates.creator_id
      where templates.id = website_requests.template_id
        and creators.profile_id = (select auth.uid())
    )
    or (select private.is_admin())
  )
);

create policy "Verified listing owners and admins update requests"
on public.website_requests for update
to authenticated
using (
  (select private.is_verified_user())
  and (
    (select private.is_admin())
    or exists (
      select 1
      from public.creators
      where creators.id = website_requests.creator_id
        and creators.profile_id = (select auth.uid())
    )
    or exists (
      select 1
      from public.templates
      join public.creators on creators.id = templates.creator_id
      where templates.id = website_requests.template_id
        and creators.profile_id = (select auth.uid())
    )
  )
)
with check (
  (select private.is_verified_user())
  and (
    (select private.is_admin())
    or exists (
      select 1
      from public.creators
      where creators.id = website_requests.creator_id
        and creators.profile_id = (select auth.uid())
    )
    or exists (
      select 1
      from public.templates
      join public.creators on creators.id = templates.creator_id
      where templates.id = website_requests.template_id
        and creators.profile_id = (select auth.uid())
    )
  )
);

revoke insert (
  template_id,
  creator_id,
  buyer_id,
  name,
  email,
  business_type,
  budget,
  website_style,
  message,
  request_type
) on public.website_requests from anon;

-- Saved templates --------------------------------------------------------

drop policy if exists "Users read saved templates" on public.saved_templates;
drop policy if exists "Users save templates" on public.saved_templates;
drop policy if exists "Users remove saved templates" on public.saved_templates;

create policy "Verified users read saved templates"
on public.saved_templates for select
to authenticated
using (
  (select private.is_verified_user())
  and user_id = (select auth.uid())
);

create policy "Verified users save templates"
on public.saved_templates for insert
to authenticated
with check (
  (select private.is_verified_user())
  and user_id = (select auth.uid())
);

create policy "Verified users remove saved templates"
on public.saved_templates for delete
to authenticated
using (
  (select private.is_verified_user())
  and user_id = (select auth.uid())
);

-- Uploaded website listings ---------------------------------------------

drop policy if exists "Users read allowed websites" on public.websites;
drop policy if exists "Owners create their own website" on public.websites;
drop policy if exists "Owners toggle their website status" on public.websites;
drop policy if exists "Owners delete their own website" on public.websites;

create policy "Users read allowed websites"
on public.websites for select
to authenticated
using (
  status = 'listed'
  or (
    (select private.is_verified_user())
    and (
      owner_id = (select auth.uid())
      or (select private.is_admin())
    )
  )
);

create policy "Verified owners create their own website"
on public.websites for insert
to authenticated
with check (
  (select private.is_verified_user())
  and owner_id = (select auth.uid())
  and status = 'draft'
);

create policy "Verified owners toggle their website status"
on public.websites for update
to authenticated
using (
  (select private.is_verified_user())
  and owner_id = (select auth.uid())
)
with check (
  (select private.is_verified_user())
  and owner_id = (select auth.uid())
  and status in ('draft', 'listed')
);

create policy "Verified owners delete their own website"
on public.websites for delete
to authenticated
using (
  (select private.is_verified_user())
  and owner_id = (select auth.uid())
);

drop policy if exists "Users read allowed website files" on public.website_files;
drop policy if exists "Owners add files to their draft website" on public.website_files;

create policy "Users read allowed website files"
on public.website_files for select
to authenticated
using (
  exists (
    select 1
    from public.websites
    where websites.id = website_files.website_id
      and (
        websites.status = 'listed'
        or (
          (select private.is_verified_user())
          and (
            websites.owner_id = (select auth.uid())
            or (select private.is_admin())
          )
        )
      )
  )
);

create policy "Verified owners add files to their draft website"
on public.website_files for insert
to authenticated
with check (
  (select private.is_verified_user())
  and exists (
    select 1
    from public.websites
    where websites.id = website_files.website_id
      and websites.owner_id = (select auth.uid())
      and websites.status = 'draft'
  )
);

-- Template preview storage is part of creating and managing a listing.
drop policy if exists "Creators read their preview objects" on storage.objects;
drop policy if exists "Creators upload template previews" on storage.objects;
drop policy if exists "Creators update their preview objects" on storage.objects;
drop policy if exists "Creators delete their preview objects" on storage.objects;
drop policy if exists "Users upload their template previews" on storage.objects;
drop policy if exists "Users update their template previews" on storage.objects;
drop policy if exists "Users delete their template previews" on storage.objects;

create policy "Verified users read their preview objects"
on storage.objects for select
to authenticated
using (
  (select private.is_verified_user())
  and bucket_id = 'template-previews'
  and owner_id = (select auth.uid()::text)
);

create policy "Verified users upload template previews"
on storage.objects for insert
to authenticated
with check (
  (select private.is_verified_user())
  and bucket_id = 'template-previews'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and exists (
    select 1
    from public.creators
    where creators.profile_id = (select auth.uid())
  )
);

create policy "Verified users update their preview objects"
on storage.objects for update
to authenticated
using (
  (select private.is_verified_user())
  and bucket_id = 'template-previews'
  and owner_id = (select auth.uid()::text)
)
with check (
  (select private.is_verified_user())
  and bucket_id = 'template-previews'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and exists (
    select 1
    from public.creators
    where creators.profile_id = (select auth.uid())
  )
);

create policy "Verified users delete their preview objects"
on storage.objects for delete
to authenticated
using (
  (select private.is_verified_user())
  and bucket_id = 'template-previews'
  and owner_id = (select auth.uid()::text)
);
