-- Fix authorization helpers after moving them into the private schema.
-- The previous definitions still referenced public.is_platform_admin(), which
-- no longer exists and caused member lookups (and post-login onboarding) to fail.
create or replace function private.is_condo_member(p_condominio uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $function$
  select private.is_platform_admin()
    or exists (
      select 1
      from public.membros_condominio
      where condominio_id = p_condominio
        and user_id = auth.uid()
        and status = 'active'
    );
$function$;

create or replace function private.has_condo_role(p_condominio uuid, p_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public, private
as $function$
  select private.is_platform_admin()
    or exists (
      select 1
      from public.membros_condominio
      where condominio_id = p_condominio
        and user_id = auth.uid()
        and status = 'active'
        and role = any(p_roles)
    );
$function$;

revoke all on function private.is_condo_member(uuid) from public, anon;
revoke all on function private.has_condo_role(uuid, public.app_role[]) from public, anon;
grant execute on function private.is_condo_member(uuid) to authenticated;
grant execute on function private.has_condo_role(uuid, public.app_role[]) to authenticated;
