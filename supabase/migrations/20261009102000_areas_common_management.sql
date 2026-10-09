create policy areas_comuns_manage
on public.areas_comuns
for all to authenticated
using (private.has_condo_role(condominio_id, array['super_admin','administrador','sindico','sub_sindico']::public.app_role[]))
with check (private.has_condo_role(condominio_id, array['super_admin','administrador','sindico','sub_sindico']::public.app_role[]));
