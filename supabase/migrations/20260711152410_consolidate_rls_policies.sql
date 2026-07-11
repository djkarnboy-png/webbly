drop policy "Verified creators are public" on public.creators;
drop policy "Creators read their own profile" on public.creators;
drop policy "Admins read all creators" on public.creators;

create policy "Verified creators are public"
on public.creators for select
to anon
using (is_verified = true);

create policy "Authenticated users read allowed creators"
on public.creators for select
to authenticated
using (
  is_verified = true
  or profile_id = (select auth.uid())
  or exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);

drop policy "Published templates are public" on public.templates;
drop policy "Creators read their templates" on public.templates;
drop policy "Admins read all templates" on public.templates;

create policy "Published templates are public"
on public.templates for select
to anon
using (status = 'published');

create policy "Authenticated users read allowed templates"
on public.templates for select
to authenticated
using (
  status = 'published'
  or exists (
    select 1 from public.creators
    where creators.id = templates.creator_id
      and creators.profile_id = (select auth.uid())
  )
  or exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);

drop policy "Creators update their templates" on public.templates;
drop policy "Admins moderate templates" on public.templates;

create policy "Authorized users update templates"
on public.templates for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
  or exists (
    select 1 from public.creators
    where creators.id = templates.creator_id
      and creators.profile_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
  or (
    status in ('pending', 'archived')
    and is_featured = false
    and exists (
      select 1 from public.creators
      where creators.id = templates.creator_id
        and creators.profile_id = (select auth.uid())
    )
  )
);

drop policy "Buyers read their requests" on public.website_requests;
drop policy "Creators read assigned requests" on public.website_requests;
drop policy "Admins read all requests" on public.website_requests;

create policy "Authenticated users read allowed requests"
on public.website_requests for select
to authenticated
using (
  buyer_id = (select auth.uid())
  or exists (
    select 1 from public.creators
    where creators.id = website_requests.creator_id
      and creators.profile_id = (select auth.uid())
  )
  or exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);
