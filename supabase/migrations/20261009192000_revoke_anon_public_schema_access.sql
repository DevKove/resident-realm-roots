-- The application has no public/anonymous RLS policies for public tables.
-- Remove the anon role's direct API privileges as defense in depth; authenticated
-- users continue to be governed by existing table grants and RLS policies.
revoke all privileges on all tables in schema public from anon;
revoke all privileges on all sequences in schema public from anon;

-- Trigger functions are invoked by PostgreSQL triggers and do not need to be
-- callable directly through PostgREST by anonymous or authenticated clients.
revoke all privileges on function public.touch_updated_at() from public, anon, authenticated;

-- Prevent future tables/sequences created by the migration owner from receiving
-- default privileges for anonymous clients.
alter default privileges for role postgres in schema public revoke all on tables from anon;
alter default privileges for role postgres in schema public revoke all on sequences from anon;
