-- The websites marketplace query joins websites.owner -> profiles to show
-- the seller's display name. Anonymous visitors previously had no SELECT
-- grant on public.profiles at all, so this join failed outright (permission
-- denied) instead of resolving. This grant alone does not expose any
-- profile data to anon -- Row Level Security on public.profiles still only
-- allows a user to read their own row (or an admin to read any row), per
-- 20260712153434_unify_webbly_accounts.sql. For every other viewer the
-- join now safely resolves to null instead of erroring, and the app
-- already falls back to a generic "Webbly seller" label in that case.

grant select on public.profiles to anon;
