-- Complete the minimum write policies for operational modules exposed in the UI.
-- Append-only access logs deliberately have no UPDATE/DELETE policy.
create policy veiculos_manage
on public.veiculos
for all to authenticated
using (private.has_condo_role(condominio_id, array['super_admin','administrador','sindico','sub_sindico']::public.app_role[]))
with check (private.has_condo_role(condominio_id, array['super_admin','administrador','sindico','sub_sindico']::public.app_role[]));

create policy animais_manage
on public.animais
for all to authenticated
using (private.has_condo_role(condominio_id, array['super_admin','administrador','sindico','sub_sindico']::public.app_role[]))
with check (private.has_condo_role(condominio_id, array['super_admin','administrador','sindico','sub_sindico']::public.app_role[]));

create policy visitantes_insert
on public.visitantes
for insert to authenticated
with check (private.has_condo_role(condominio_id, array['super_admin','administrador','sindico','sub_sindico','porteiro']::public.app_role[]));

create policy visitantes_update
on public.visitantes
for update to authenticated
using (private.has_condo_role(condominio_id, array['super_admin','administrador','sindico','sub_sindico','porteiro']::public.app_role[]))
with check (private.has_condo_role(condominio_id, array['super_admin','administrador','sindico','sub_sindico','porteiro']::public.app_role[]));

create policy entregas_insert
on public.entregas
for insert to authenticated
with check (private.has_condo_role(condominio_id, array['super_admin','administrador','sindico','sub_sindico','porteiro']::public.app_role[]));

create policy entregas_update
on public.entregas
for update to authenticated
using (private.has_condo_role(condominio_id, array['super_admin','administrador','sindico','sub_sindico','porteiro']::public.app_role[]))
with check (private.has_condo_role(condominio_id, array['super_admin','administrador','sindico','sub_sindico','porteiro']::public.app_role[]));

create policy acessos_portaria_insert
on public.acessos_portaria
for insert to authenticated
with check (
  private.has_condo_role(condominio_id, array['super_admin','administrador','sindico','sub_sindico','porteiro']::public.app_role[])
  and operador_id = (select auth.uid())
);
