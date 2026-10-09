-- Prevent cross-tenant reassignment and resident-side state/ownership tampering.
create or replace function private.guard_sindcoop_record_ownership()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.condominio_id is distinct from old.condominio_id then
    raise exception 'O condomínio do registro não pode ser alterado.'
      using errcode = '42501';
  end if;

  if tg_table_name = 'ocorrencias' then
    if new.autor_id is distinct from old.autor_id then
      raise exception 'O autor da ocorrência não pode ser alterado.'
        using errcode = '42501';
    end if;

    if (
      new.status is distinct from old.status
      or new.responsavel_id is distinct from old.responsavel_id
      or new.resolvido_em is distinct from old.resolvido_em
    ) and not private.has_condo_role(
      old.condominio_id,
      array['super_admin','administrador','sindico','sub_sindico']::public.app_role[]
    ) then
      raise exception 'Somente a gestão pode alterar o estado ou responsável da ocorrência.'
        using errcode = '42501';
    end if;
  elsif tg_table_name = 'reservas' then
    if new.solicitante_id is distinct from old.solicitante_id then
      raise exception 'O solicitante da reserva não pode ser alterado.'
        using errcode = '42501';
    end if;

    if new.status is distinct from old.status and not private.has_condo_role(
      old.condominio_id,
      array['super_admin','administrador','sindico','sub_sindico']::public.app_role[]
    ) then
      raise exception 'Somente a gestão pode alterar o estado da reserva.'
        using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function private.guard_sindcoop_record_ownership() from public, anon, authenticated;

drop trigger if exists guard_ocorrencias_ownership on public.ocorrencias;
create trigger guard_ocorrencias_ownership
before update on public.ocorrencias
for each row execute function private.guard_sindcoop_record_ownership();

drop trigger if exists guard_reservas_ownership on public.reservas;
create trigger guard_reservas_ownership
before update on public.reservas
for each row execute function private.guard_sindcoop_record_ownership();

drop policy if exists occurrence_update on public.ocorrencias;
create policy occurrence_update
on public.ocorrencias
for update to authenticated
using (
  private.has_condo_role(condominio_id, array['super_admin','administrador','sindico','sub_sindico']::public.app_role[])
  or autor_id = (select auth.uid())
)
with check (
  private.is_condo_member(condominio_id)
  and (
    private.has_condo_role(condominio_id, array['super_admin','administrador','sindico','sub_sindico']::public.app_role[])
    or autor_id = (select auth.uid())
  )
);

drop policy if exists reservation_update on public.reservas;
create policy reservation_update
on public.reservas
for update to authenticated
using (
  solicitante_id = (select auth.uid())
  or private.has_condo_role(condominio_id, array['super_admin','administrador','sindico','sub_sindico']::public.app_role[])
)
with check (
  private.is_condo_member(condominio_id)
  and (
    solicitante_id = (select auth.uid())
    or private.has_condo_role(condominio_id, array['super_admin','administrador','sindico','sub_sindico']::public.app_role[])
  )
);
