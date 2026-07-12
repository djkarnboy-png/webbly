create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

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
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

create or replace function private.creator_has_published_listing(target_creator_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.templates
    where creator_id = target_creator_id
      and status = 'published'
  );
$$;

revoke all on function private.is_admin() from public;
revoke all on function private.creator_has_published_listing(uuid) from public;
grant execute on function private.is_admin() to authenticated;
grant execute on function private.creator_has_published_listing(uuid) to anon, authenticated;

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
    'buyer',
    nullif(trim(new.raw_user_meta_data ->> 'avatar_url'), '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

drop policy if exists "Profiles are publicly readable" on public.profiles;
drop policy if exists "Users create their own profile" on public.profiles;
drop policy if exists "Users update their own profile" on public.profiles;

create policy "Users read their own profile"
on public.profiles for select
to authenticated
using (
  id = (select auth.uid())
  or (select private.is_admin())
);

create policy "Users create their own profile"
on public.profiles for insert
to authenticated
with check (
  id = (select auth.uid())
  and role = 'buyer'
);

create policy "Users update their own profile"
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

drop policy if exists "Verified creators are public" on public.creators;
drop policy if exists "Authenticated users read allowed creators" on public.creators;
drop policy if exists "Users create their creator profile" on public.creators;
drop policy if exists "Creators update their own profile" on public.creators;

create policy "Public listing profiles are readable"
on public.creators for select
to anon
using (
  is_verified = true
  or private.creator_has_published_listing(id)
);

create policy "Users read allowed listing profiles"
on public.creators for select
to authenticated
using (
  is_verified = true
  or profile_id = (select auth.uid())
  or private.creator_has_published_listing(id)
  or (select private.is_admin())
);

create policy "Users create their own listing profile"
on public.creators for insert
to authenticated
with check (
  profile_id = (select auth.uid())
  and is_verified = false
  and completed_projects = 0
  and rating = 4.8
);

create policy "Users update their own listing profile"
on public.creators for update
to authenticated
using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()));

drop policy if exists "Published templates are public" on public.templates;
drop policy if exists "Authenticated users read allowed templates" on public.templates;
drop policy if exists "Creators add their templates" on public.templates;
drop policy if exists "Authorized users update templates" on public.templates;
drop policy if exists "Creators delete their templates" on public.templates;

create policy "Published templates are public"
on public.templates for select
to anon
using (status = 'published');

create policy "Users read allowed templates"
on public.templates for select
to authenticated
using (
  status = 'published'
  or exists (
    select 1
    from public.creators
    where creators.id = templates.creator_id
      and creators.profile_id = (select auth.uid())
  )
  or (select private.is_admin())
);

create policy "Users add their own listings"
on public.templates for insert
to authenticated
with check (
  status = 'pending'
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

create policy "Owners and admins update listings"
on public.templates for update
to authenticated
using (
  (select private.is_admin())
  or exists (
    select 1
    from public.creators
    where creators.id = templates.creator_id
      and creators.profile_id = (select auth.uid())
  )
)
with check (
  (select private.is_admin())
  or (
    status in ('pending', 'archived')
    and is_featured = false
    and exists (
      select 1
      from public.creators
      where creators.id = templates.creator_id
        and creators.profile_id = (select auth.uid())
    )
  )
);

create policy "Users delete their own listings"
on public.templates for delete
to authenticated
using (
  exists (
    select 1
    from public.creators
    where creators.id = templates.creator_id
      and creators.profile_id = (select auth.uid())
  )
);

drop policy if exists "Anyone submits website requests" on public.website_requests;
drop policy if exists "Authenticated users read allowed requests" on public.website_requests;
drop policy if exists "Creators update assigned requests" on public.website_requests;

create policy "Visitors submit website requests"
on public.website_requests for insert
to anon, authenticated
with check (
  status = 'new'
  and (buyer_id is null or buyer_id = (select auth.uid()))
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

create policy "Users read connected requests"
on public.website_requests for select
to authenticated
using (
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
);

create policy "Listing owners and admins update requests"
on public.website_requests for update
to authenticated
using (
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
with check (
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
);

drop policy if exists "Creators upload template previews" on storage.objects;
drop policy if exists "Creators update their preview objects" on storage.objects;
drop policy if exists "Creators delete their preview objects" on storage.objects;

create policy "Users upload their template previews"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'template-previews'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Users update their template previews"
on storage.objects for update
to authenticated
using (
  bucket_id = 'template-previews'
  and owner_id = (select auth.uid()::text)
)
with check (
  bucket_id = 'template-previews'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Users delete their template previews"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'template-previews'
  and owner_id = (select auth.uid()::text)
);

revoke all privileges on table
  public.profiles,
  public.creators,
  public.templates,
  public.website_requests,
  public.saved_templates,
  public.template_reviews
from anon, authenticated;

grant select on public.creators, public.templates, public.template_reviews
to anon;

grant insert (
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
) on public.website_requests to anon;

grant select on
  public.profiles,
  public.creators,
  public.templates,
  public.website_requests,
  public.saved_templates,
  public.template_reviews
to authenticated;

grant insert (id, full_name, username, avatar_url, bio, location)
on public.profiles to authenticated;
grant update (full_name, username, avatar_url, bio, location)
on public.profiles to authenticated;

grant insert (profile_id, display_name, email, role_title, bio, avatar_url)
on public.creators to authenticated;
grant update (display_name, email, role_title, bio, avatar_url, response_time)
on public.creators to authenticated;

grant insert (
  creator_id,
  slug,
  title,
  category,
  price,
  short_description,
  full_description,
  tools,
  tags,
  features,
  pages_included,
  best_for,
  preview_type,
  preview_image_url,
  live_preview_url,
  status,
  is_featured
) on public.templates to authenticated;

grant update (
  title,
  category,
  price,
  short_description,
  full_description,
  tools,
  tags,
  features,
  pages_included,
  best_for,
  preview_type,
  preview_image_url,
  live_preview_url,
  status,
  is_featured
) on public.templates to authenticated;
grant delete on public.templates to authenticated;

grant insert (
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
) on public.website_requests to authenticated;
grant update (status) on public.website_requests to authenticated;

grant insert (user_id, template_id) on public.saved_templates to authenticated;
grant delete on public.saved_templates to authenticated;

grant insert (template_id, reviewer_name, rating, comment)
on public.template_reviews to authenticated;
