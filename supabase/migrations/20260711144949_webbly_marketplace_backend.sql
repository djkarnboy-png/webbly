create extension if not exists pgcrypto with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  role text not null default 'buyer' check (role in ('buyer', 'creator', 'admin')),
  avatar_url text,
  bio text,
  website text,
  location text,
  created_at timestamptz not null default now()
);

create table public.creators (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id) on delete cascade,
  display_name text not null,
  email text,
  role_title text,
  bio text,
  avatar_url text,
  rating numeric(2, 1) not null default 4.8 check (rating >= 0 and rating <= 5),
  response_time text not null default '1-2 days',
  completed_projects integer not null default 0 check (completed_projects >= 0),
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.creators(id) on delete set null,
  slug text unique not null,
  title text not null,
  category text not null check (
    category in (
      'Restaurants',
      'Cafes',
      'Salons',
      'Gyms',
      'Tutors',
      'Online Stores',
      'Agencies',
      'Real Estate'
    )
  ),
  price integer not null default 0 check (price >= 0),
  short_description text,
  full_description text,
  tools text[] not null default '{}',
  tags text[] not null default '{}',
  features text[] not null default '{}',
  pages_included text[] not null default '{}',
  best_for text[] not null default '{}',
  preview_type text,
  preview_image_url text,
  live_preview_url text,
  fit_score integer not null default 90 check (fit_score >= 0 and fit_score <= 100),
  rating numeric(2, 1) not null default 4.8 check (rating >= 0 and rating <= 5),
  status text not null default 'pending' check (
    status in ('pending', 'published', 'rejected', 'archived')
  ),
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.website_requests (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references public.templates(id) on delete set null,
  creator_id uuid references public.creators(id) on delete set null,
  buyer_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  business_type text,
  budget text,
  website_style text,
  message text not null,
  request_type text not null default 'general' check (
    request_type in ('general', 'contact', 'similar')
  ),
  status text not null default 'new' check (
    status in ('new', 'contacted', 'in_progress', 'completed', 'declined')
  ),
  created_at timestamptz not null default now()
);

create table public.saved_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  template_id uuid not null references public.templates(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, template_id)
);

create table public.template_reviews (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.templates(id) on delete cascade,
  reviewer_name text,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create index creators_profile_id_idx on public.creators(profile_id);
create index creators_verified_idx on public.creators(is_verified) where is_verified = true;
create index templates_creator_id_idx on public.templates(creator_id);
create index templates_public_catalog_idx on public.templates(status, is_featured, created_at desc);
create index templates_category_idx on public.templates(category) where status = 'published';
create index website_requests_buyer_id_idx on public.website_requests(buyer_id, created_at desc);
create index website_requests_creator_id_idx on public.website_requests(creator_id, status, created_at desc);
create index website_requests_template_id_idx on public.website_requests(template_id);
create index saved_templates_user_id_idx on public.saved_templates(user_id, created_at desc);
create index saved_templates_template_id_idx on public.saved_templates(template_id);
create index template_reviews_template_id_idx on public.template_reviews(template_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger templates_set_updated_at
before update on public.templates
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_role text;
  selected_name text;
begin
  selected_role := case
    when new.raw_user_meta_data ->> 'role' = 'creator' then 'creator'
    else 'buyer'
  end;
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
    selected_role,
    nullif(trim(new.raw_user_meta_data ->> 'avatar_url'), '')
  );

  if selected_role = 'creator' then
    insert into public.creators (
      profile_id,
      display_name,
      email,
      role_title,
      bio
    ) values (
      new.id,
      selected_name,
      new.email,
      'Website creator',
      'Independent creator on Webbly.'
    );
  end if;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.creators enable row level security;
alter table public.templates enable row level security;
alter table public.website_requests enable row level security;
alter table public.saved_templates enable row level security;
alter table public.template_reviews enable row level security;

create policy "Profiles are publicly readable"
on public.profiles for select
to anon, authenticated
using (true);

create policy "Users create their own profile"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id and role in ('buyer', 'creator'));

create policy "Users update their own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Verified creators are public"
on public.creators for select
to anon, authenticated
using (is_verified = true);

create policy "Creators read their own profile"
on public.creators for select
to authenticated
using (profile_id = (select auth.uid()));

create policy "Admins read all creators"
on public.creators for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);

create policy "Users create their creator profile"
on public.creators for insert
to authenticated
with check (
  profile_id = (select auth.uid())
  and is_verified = false
  and completed_projects = 0
  and exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role in ('creator', 'admin')
  )
);

create policy "Creators update their own profile"
on public.creators for update
to authenticated
using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()));

create policy "Published templates are public"
on public.templates for select
to anon, authenticated
using (status = 'published');

create policy "Creators read their templates"
on public.templates for select
to authenticated
using (
  exists (
    select 1 from public.creators
    where creators.id = templates.creator_id
      and creators.profile_id = (select auth.uid())
  )
);

create policy "Admins read all templates"
on public.templates for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);

create policy "Creators add their templates"
on public.templates for insert
to authenticated
with check (
  status = 'pending'
  and is_featured = false
  and exists (
    select 1 from public.creators
    where creators.id = templates.creator_id
      and creators.profile_id = (select auth.uid())
  )
);

create policy "Creators update their templates"
on public.templates for update
to authenticated
using (
  exists (
    select 1 from public.creators
    where creators.id = templates.creator_id
      and creators.profile_id = (select auth.uid())
  )
)
with check (
  status in ('pending', 'archived')
  and is_featured = false
  and exists (
    select 1 from public.creators
    where creators.id = templates.creator_id
      and creators.profile_id = (select auth.uid())
  )
);

create policy "Creators delete their templates"
on public.templates for delete
to authenticated
using (
  exists (
    select 1 from public.creators
    where creators.id = templates.creator_id
      and creators.profile_id = (select auth.uid())
  )
);

create policy "Admins moderate templates"
on public.templates for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);

create policy "Anyone submits website requests"
on public.website_requests for insert
to anon, authenticated
with check (
  buyer_id is null or buyer_id = (select auth.uid())
);

create policy "Buyers read their requests"
on public.website_requests for select
to authenticated
using (buyer_id = (select auth.uid()));

create policy "Creators read assigned requests"
on public.website_requests for select
to authenticated
using (
  exists (
    select 1 from public.creators
    where creators.id = website_requests.creator_id
      and creators.profile_id = (select auth.uid())
  )
);

create policy "Creators update assigned requests"
on public.website_requests for update
to authenticated
using (
  exists (
    select 1 from public.creators
    where creators.id = website_requests.creator_id
      and creators.profile_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.creators
    where creators.id = website_requests.creator_id
      and creators.profile_id = (select auth.uid())
  )
);

create policy "Admins read all requests"
on public.website_requests for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  )
);

create policy "Users read saved templates"
on public.saved_templates for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Users save templates"
on public.saved_templates for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy "Users remove saved templates"
on public.saved_templates for delete
to authenticated
using (user_id = (select auth.uid()));

create policy "Reviews are public"
on public.template_reviews for select
to anon, authenticated
using (true);

create policy "Logged in users add reviews"
on public.template_reviews for insert
to authenticated
with check ((select auth.uid()) is not null);

grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.creators, public.templates, public.template_reviews to anon, authenticated;
grant insert on public.profiles to authenticated;
grant update (full_name, username, avatar_url, bio, website, location) on public.profiles to authenticated;
grant insert on public.creators to authenticated;
grant update (display_name, email, role_title, bio, avatar_url, response_time) on public.creators to authenticated;
grant insert, update, delete on public.templates to authenticated;
grant insert on public.website_requests to anon, authenticated;
grant select on public.website_requests to authenticated;
grant update (status) on public.website_requests to authenticated;
grant select, insert, delete on public.saved_templates to authenticated;
grant insert on public.template_reviews to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) values (
  'template-previews',
  'template-previews',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Creators upload template previews"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'template-previews'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Creators read their preview objects"
on storage.objects for select
to authenticated
using (
  bucket_id = 'template-previews'
  and owner_id = (select auth.uid()::text)
);

create policy "Creators update their preview objects"
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

create policy "Creators delete their preview objects"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'template-previews'
  and owner_id = (select auth.uid()::text)
);
