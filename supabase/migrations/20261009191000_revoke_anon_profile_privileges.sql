-- Remove all direct access grants from anonymous clients to profiles.
-- Authenticated profile access remains governed by existing grants and RLS.
revoke all privileges on table public.profiles from anon;
revoke select (id, full_name, cpf, phone, avatar_path, role, is_platform_admin, created_at, updated_at)
  on table public.profiles from anon;
revoke insert (id, full_name, cpf, phone, avatar_path, role, is_platform_admin, created_at, updated_at)
  on table public.profiles from anon;
revoke update (id, full_name, cpf, phone, avatar_path, role, is_platform_admin, created_at, updated_at)
  on table public.profiles from anon;
revoke references (id, full_name, cpf, phone, avatar_path, role, is_platform_admin, created_at, updated_at)
  on table public.profiles from anon;
