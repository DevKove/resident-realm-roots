-- SECURITY DEFINER functions must not inherit object resolution from writable schemas.
-- Their bodies already qualify application/auth objects, so an empty search_path is safe.
alter function private.has_condo_role(uuid, public.app_role[]) set search_path = '';
alter function private.is_condo_member(uuid) set search_path = '';
alter function private.is_platform_admin() set search_path = '';
alter function public.handle_new_user() set search_path = '';
alter function public.touch_updated_at() set search_path = '';
