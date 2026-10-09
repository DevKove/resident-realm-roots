-- Keep financial document metadata as private as the corresponding Storage objects.
-- The UI is not an authorization boundary: enforce tenant and role checks in RLS.
-- Classification by category is defense-in-depth; Storage policies must remain the
-- authoritative protection for objects stored in the financial-documents bucket.

drop policy if exists documentos_select on public.documentos;
create policy documentos_select
on public.documentos
for select
to authenticated
using (
  public.is_condo_member(condominio_id)
  and (
    lower(categoria) !~ '(finance|prestação de contas|prestacao de contas|comprovante|pagamento|nota fiscal|receita|despesa|boleto|balancete|orçamento|orcamento|cobrança|cobranca|fatura)'
    or public.has_condo_role(
      condominio_id,
      array['super_admin','administrador','sindico']::public.app_role[]
    )
  )
);

drop policy if exists documentos_insert_management on public.documentos;
create policy documentos_insert_management
on public.documentos
for insert
to authenticated
with check (
  public.has_condo_role(
    condominio_id,
    array['super_admin','administrador','sindico','sub_sindico','funcionario']::public.app_role[]
  )
  and (
    lower(categoria) !~ '(finance|prestação de contas|prestacao de contas|comprovante|pagamento|nota fiscal|receita|despesa|boleto|balancete|orçamento|orcamento|cobrança|cobranca|fatura)'
    or public.has_condo_role(
      condominio_id,
      array['super_admin','administrador','sindico']::public.app_role[]
    )
  )
);

drop policy if exists documentos_update_management on public.documentos;
create policy documentos_update_management
on public.documentos
for update
to authenticated
using (
  public.has_condo_role(
    condominio_id,
    array['super_admin','administrador','sindico','sub_sindico','funcionario']::public.app_role[]
  )
  and (
    lower(categoria) !~ '(finance|prestação de contas|prestacao de contas|comprovante|pagamento|nota fiscal|receita|despesa|boleto|balancete|orçamento|orcamento|cobrança|cobranca|fatura)'
    or public.has_condo_role(
      condominio_id,
      array['super_admin','administrador','sindico']::public.app_role[]
    )
  )
)
with check (
  public.has_condo_role(
    condominio_id,
    array['super_admin','administrador','sindico','sub_sindico','funcionario']::public.app_role[]
  )
  and (
    lower(categoria) !~ '(finance|prestação de contas|prestacao de contas|comprovante|pagamento|nota fiscal|receita|despesa|boleto|balancete|orçamento|orcamento|cobrança|cobranca|fatura)'
    or public.has_condo_role(
      condominio_id,
      array['super_admin','administrador','sindico']::public.app_role[]
    )
  )
);

drop policy if exists documentos_delete_management on public.documentos;
create policy documentos_delete_management
on public.documentos
for delete
to authenticated
using (
  public.has_condo_role(
    condominio_id,
    array['super_admin','administrador','sindico']::public.app_role[]
  )
);
