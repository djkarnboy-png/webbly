# Webbly

Webbly is a clean Next.js MVP for a SaaS marketplace where small business owners browse business website templates and contact the creators behind them.

## What is included

- Responsive homepage with marketplace positioning, featured templates, categories, benefits, and calls to action
- Browse templates page with mock data, search, category filter, price filter, and sorting
- Template detail pages with preview, creator card, price, features, pages, tools, and similar templates
- Working request modal from template cards and detail pages, with client-side validation and a success state
- Creator page with benefits and a polished template upload form UI
- Pricing page with Free, Pro, and Commission plans
- Request form page for customers who want a similar custom website
- Reusable components for navigation, footer, buttons, cards, pricing, marketplace browsing, and forms

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Mock data only, no backend required yet

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Useful scripts

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
```

## Project structure

```text
src/app                 Route pages and global layout
src/components          Reusable UI components
src/data/templates.ts   Mock marketplace data
public                  Static assets from the Next.js scaffold
```

## Notes

The marketplace uses mock data through `src/lib/marketplace.ts`, which is structured so a future Supabase connection can replace the in-memory catalog and mock request creation. Buying templates, login, creator accounts, billing, and live uploads are marked as MVP/coming-soon features.
