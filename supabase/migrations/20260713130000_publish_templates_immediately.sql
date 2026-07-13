-- Templates now publish immediately on submission instead of entering a
-- 'pending' admin-review queue. Admin moderation (reject/feature/unfeature)
-- remains available for already-published listings.

drop policy "Users add their own listings" on public.templates;

create policy "Users add their own listings"
on public.templates for insert
to authenticated
with check (
  status = 'published'
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

drop policy "Owners and admins update listings" on public.templates;

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
    status in ('published', 'archived')
    and is_featured = false
    and exists (
      select 1
      from public.creators
      where creators.id = templates.creator_id
        and creators.profile_id = (select auth.uid())
    )
  )
);
