-- Match the security hardening already applied to the connected Supabase project.
create schema if not exists extensions;
alter extension btree_gist set schema extensions;
alter function public.touch_updated_at() set search_path = public;
revoke execute on function public.create_condominio(text,text,text,integer) from anon;
revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.is_platform_admin() from anon;
revoke execute on function public.is_condo_member(uuid) from anon;
revoke execute on function public.has_condo_role(uuid,public.app_role[]) from anon;
