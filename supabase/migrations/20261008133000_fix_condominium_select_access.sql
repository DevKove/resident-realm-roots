-- Fix condominium read access after onboarding.
-- The membership row is created by create_condominio(), but getCondoContext()
-- also needs SELECT access to the parent condominios row.
drop policy if exists condo_select on public.condominios;
create policy condo_select
on public.condominios
for select
to authenticated
using (public.is_condo_member(id));
