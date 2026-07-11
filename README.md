# Webbly

Webbly is a working marketplace MVP where small businesses browse website templates, save ideas, and contact the creators behind them. Creators can publish template submissions, upload preview images, and manage incoming project requests from a private dashboard.

## Features

- Supabase-backed public template catalog, creator profiles, and reviews
- Search, category, price, and sort filters
- Template detail pages and category-specific CSS previews
- Email/password authentication for buyers and creators
- Account profiles and role-aware navigation
- Website request forms that persist for signed-in and guest visitors
- Saved templates with user-scoped access
- Creator dashboard with template CRUD, request statuses, and basic stats
- Preview uploads through Supabase Storage
- Admin moderation for approving, rejecting, and featuring templates
- Responsive desktop, tablet, and mobile layouts

Payments and automatic template delivery are intentionally marked as coming soon. No Stripe integration is active.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth, Postgres, Row Level Security, and Storage
- Vercel deployment

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Webbly prefers Supabase's current publishable-key naming. Legacy projects can instead set `NEXT_PUBLIC_SUPABASE_ANON_KEY`; the client supports either name, but only one key is required.

Never expose a Supabase `service_role` or secret key in this application. `.env.local` and other local environment files are ignored by Git.

## Supabase Setup

1. Create a Supabase project.
2. Add the environment variables above.
3. Apply the migration in `supabase/migrations/20260711144421_webbly_marketplace_backend.sql`.
4. Run `supabase/seed.sql` to add the 12 sample creators, templates, and reviews.
5. Add the same public environment variables to the Vercel project.

With the Supabase CLI linked to your project, the migration can be applied with:

```bash
supabase db push
```

Seed data can be run from the Supabase SQL Editor or your preferred Postgres client. The migration creates the public `template-previews` storage bucket and its owner-scoped policies.

## Database and RLS

The schema contains:

- `profiles`
- `creators`
- `templates`
- `website_requests`
- `saved_templates`
- `template_reviews`

RLS is enabled on every public table. Public visitors can only read published templates, verified creators, public profiles, and reviews. Authenticated users can only manage their own profile and saved templates. Creators can only manage templates tied to their creator profile and requests assigned to them. Admin moderation checks `profiles.role = 'admin'` in the database.

To promote an existing account in the Supabase SQL Editor:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'admin@example.com'
);
```

Do not add admin role controls to the public client.

## Run Locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
pnpm lint
pnpm build
pnpm start
```

## Main Routes

- `/` marketplace homepage
- `/templates` searchable template catalog
- `/templates/[slug]` template details
- `/request` general website request
- `/login`, `/signup`, `/account` authentication and profile
- `/saved` saved templates
- `/dashboard` creator workspace and request inbox
- `/dashboard/templates/new` template submission
- `/dashboard/templates/[id]/edit` creator-owned template editing
- `/admin` role-protected moderation
- `/creators` creator information
- `/pricing` current marketplace plan preview

## Project Structure

```text
src/app                         App Router pages and server actions
src/components                  Reusable marketplace and form components
src/data/templates.ts           Visual fallback data for CSS previews
src/lib/supabase                Typed browser/server Supabase clients
src/lib/marketplace-server.ts   Public and saved catalog queries
src/lib/dashboard.ts            Creator-owned dashboard queries
supabase/migrations             Versioned schema, policies, and storage setup
supabase/seed.sql               Sample marketplace catalog
proxy.ts                        Supabase session refresh for Next.js
```

The public catalog uses Supabase as its source of truth. Local template data remains only as a visual fallback when environment variables are missing and to preserve the seeded CSS preview themes.

## Deploy to Vercel

1. Import the GitHub repository into Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for Production, Preview, and Development.
3. Deploy with the standard Next.js build command.
4. Add the production Vercel URL to the Supabase Auth URL configuration and allowed redirect URLs, including `/auth/callback`.

The repository does not require a server secret for its current feature set. Authorization is enforced by Supabase RLS and authenticated user sessions.
