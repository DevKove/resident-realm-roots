-- Validate tenant ownership of related records at the database boundary.
-- RLS policies alone do not ensure a referenced unit/area belongs to the same condo.
create or replace function private.validate_sindcoop_tenant_relations()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_related_condo uuid;
begin
  if tg_table_name = 'reservas' then
    select a.condominio_id into v_related_condo
      from public.areas_comuns a
     where a.id = new.area_id;
    if not found or v_related_condo is distinct from new.condominio_id then
      raise exception 'A área comum deve pertencer ao mesmo condomínio da reserva.'
        using errcode = '23514';
    end if;
  elsif tg_table_name in (
    'ocorrencias','moradores','veiculos','visitantes',
    'entregas','acessos_portaria','animais','cobrancas'
  ) and new.unidade_id is not null then
    select u.condominio_id into v_related_condo
      from public.unidades u
     where u.id = new.unidade_id;
    if not found or v_related_condo is distinct from new.condominio_id then
      raise exception 'A unidade deve pertencer ao mesmo condomínio do registro.'
        using errcode = '23514';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function private.validate_sindcoop_tenant_relations() from public, anon, authenticated;

drop trigger if exists validate_reservas_tenant_relation on public.reservas;
create trigger validate_reservas_tenant_relation
before insert or update of condominio_id, area_id on public.reservas
for each row execute function private.validate_sindcoop_tenant_relations();

drop trigger if exists validate_ocorrencias_tenant_relation on public.ocorrencias;
create trigger validate_ocorrencias_tenant_relation
before insert or update of condominio_id, unidade_id on public.ocorrencias
for each row execute function private.validate_sindcoop_tenant_relations();

drop trigger if exists validate_moradores_tenant_relation on public.moradores;
create trigger validate_moradores_tenant_relation
before insert or update of condominio_id, unidade_id on public.moradores
for each row execute function private.validate_sindcoop_tenant_relations();

drop trigger if exists validate_veiculos_tenant_relation on public.veiculos;
create trigger validate_veiculos_tenant_relation
before insert or update of condominio_id, unidade_id on public.veiculos
for each row execute function private.validate_sindcoop_tenant_relations();

drop trigger if exists validate_visitantes_tenant_relation on public.visitantes;
create trigger validate_visitantes_tenant_relation
before insert or update of condominio_id, unidade_id on public.visitantes
for each row execute function private.validate_sindcoop_tenant_relations();

drop trigger if exists validate_entregas_tenant_relation on public.entregas;
create trigger validate_entregas_tenant_relation
before insert or update of condominio_id, unidade_id on public.entregas
for each row execute function private.validate_sindcoop_tenant_relations();

drop trigger if exists validate_acessos_portaria_tenant_relation on public.acessos_portaria;
create trigger validate_acessos_portaria_tenant_relation
before insert or update of condominio_id, unidade_id on public.acessos_portaria
for each row execute function private.validate_sindcoop_tenant_relations();

drop trigger if exists validate_animais_tenant_relation on public.animais;
create trigger validate_animais_tenant_relation
before insert or update of condominio_id, unidade_id on public.animais
for each row execute function private.validate_sindcoop_tenant_relations();

drop trigger if exists validate_cobrancas_tenant_relation on public.cobrancas;
create trigger validate_cobrancas_tenant_relation
before insert or update of condominio_id, unidade_id on public.cobrancas
for each row execute function private.validate_sindcoop_tenant_relations();

alter table public.reservas drop constraint if exists reservas_valid_interval;
alter table public.reservas
  add constraint reservas_valid_interval check (fim > inicio);
