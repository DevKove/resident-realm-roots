-- Reduce RPC exposure for SECURITY DEFINER authorization helpers and enforce
-- column-level profile permissions. These functions remain usable by RLS policies.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

revoke all on function public.is_platform_admin() from public, anon;
revoke all on function public.is_condo_member(uuid) from public, anon;
revoke all on function public.has_condo_role(uuid, public.app_role[]) from public, anon;

alter function public.is_platform_admin() set schema private;
alter function public.is_condo_member(uuid) set schema private;
alter function public.has_condo_role(uuid, public.app_role[]) set schema private;

grant execute on function private.is_platform_admin() to authenticated;
grant execute on function private.is_condo_member(uuid) to authenticated;
grant execute on function private.has_condo_role(uuid, public.app_role[]) to authenticated;

-- Column-level REVOKE does not override a table-level UPDATE grant.
-- Replace the broad table grant with an allow-list of self-service profile fields.
revoke update on table public.profiles from authenticated;
grant update (full_name, cpf, phone, avatar_path) on table public.profiles to authenticated;
