-- Websites marketplace: additive system for direct website uploads.
-- Entirely independent of templates/creators. File contents are stored as
-- TEXT rows in Postgres (not Supabase Storage), scoped to text-based web
-- assets only, per product requirements. No purchase/payment logic yet;
-- 'sold' exists in the status enum for a future feature but is unreachable
-- from any policy below.

create table public.websites (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  price integer not null default 0 check (price >= 0 and price <= 100000),
  short_description text,
  full_description text,
  tags text[] not null default '{}',
  file_count integer not null default 0 check (file_count >= 0),
  total_bytes bigint not null default 0 check (total_bytes >= 0),
  status text not null default 'draft' check (status in ('draft', 'listed', 'sold')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.website_files (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites(id) on delete cascade,
  path text not null check (
    path <> ''
    and length(path) <= 300
    and path !~ '(^/|(^|/)\.\.(/|$)|//)'
  ),
  content text not null,
  content_type text not null check (
    content_type in (
      'text/html',
      'text/css',
      'text/javascript',
      'application/json',
      'image/svg+xml',
      'text/plain',
      'text/markdown'
    )
  ),
  size_bytes integer not null check (size_bytes >= 0),
  created_at timestamptz not null default now(),
  unique (website_id, path)
);

create index websites_owner_id_idx on public.websites(owner_id);
create index websites_public_catalog_idx on public.websites(status, created_at desc);
create index website_files_website_id_idx on public.website_files(website_id);

create trigger websites_set_updated_at
before update on public.websites
for each row execute function public.set_updated_at();

alter table public.websites enable row level security;
alter table public.website_files enable row level security;

-- websites: select -------------------------------------------------------

create policy "Listed websites are public"
on public.websites for select
to anon
using (status = 'listed');

create policy "Users read allowed websites"
on public.websites for select
to authenticated
using (
  status = 'listed'
  or owner_id = (select auth.uid())
  or (select private.is_admin())
);

-- websites: insert (always created as a draft owned by the caller) ------

create policy "Owners create their own website"
on public.websites for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and status = 'draft'
);

-- websites: update (owner may only toggle draft <-> listed) -------------

create policy "Owners toggle their website status"
on public.websites for update
to authenticated
using (owner_id = (select auth.uid()))
with check (
  owner_id = (select auth.uid())
  and status in ('draft', 'listed')
);

-- websites: delete --------------------------------------------------------

create policy "Owners delete their own website"
on public.websites for delete
to authenticated
using (owner_id = (select auth.uid()));

-- website_files: select ----------------------------------------------------

create policy "Listed website files are public"
on public.website_files for select
to anon
using (
  exists (
    select 1 from public.websites
    where websites.id = website_files.website_id
      and websites.status = 'listed'
  )
);

create policy "Users read allowed website files"
on public.website_files for select
to authenticated
using (
  exists (
    select 1 from public.websites
    where websites.id = website_files.website_id
      and (
        websites.status = 'listed'
        or websites.owner_id = (select auth.uid())
        or (select private.is_admin())
      )
  )
);

-- website_files: insert (only while the parent website is still a draft) --

create policy "Owners add files to their draft website"
on public.website_files for insert
to authenticated
with check (
  exists (
    select 1 from public.websites
    where websites.id = website_files.website_id
      and websites.owner_id = (select auth.uid())
      and websites.status = 'draft'
  )
);

-- explicit revoke / narrow grant, matching the app's established pattern --

revoke all privileges on table public.websites, public.website_files
from anon, authenticated;

grant select on public.websites, public.website_files to anon;
grant select on public.websites, public.website_files to authenticated;

grant insert (
  owner_id,
  title,
  price,
  short_description,
  full_description,
  tags,
  file_count,
  total_bytes,
  status
) on public.websites to authenticated;

grant update (status) on public.websites to authenticated;
grant delete on public.websites to authenticated;

grant insert (website_id, path, content, content_type, size_bytes)
on public.website_files to authenticated;
