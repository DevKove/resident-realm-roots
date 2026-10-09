-- Security and onboarding hardening from the 2026-10-09 audit.
-- Keep the live database changes represented in source control.

-- SECURITY DEFINER helpers must not inherit EXECUTE from PUBLIC.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.create_condominio(text, text, text, integer) from public, anon;
revoke all on function public.is_platform_admin() from public, anon;
revoke all on function public.is_condo_member(uuid) from public, anon;
revoke all on function public.has_condo_role(uuid, public.app_role[]) from public, anon;

grant execute on function public.create_condominio(text, text, text, integer) to authenticated;
grant execute on function public.is_platform_admin() to authenticated;
grant execute on function public.is_condo_member(uuid) to authenticated;
grant execute on function public.has_condo_role(uuid, public.app_role[]) to authenticated;

-- Make onboarding idempotent and safe under concurrent submissions.
create or replace function public.create_condominio(
  p_nome text,
  p_cidade text default null,
  p_estado text default null,
  p_quantidade_unidades integer default 0
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Não autenticado';
  end if;

  if nullif(trim(p_nome), '') is null then
    raise exception 'Nome do condomínio é obrigatório';
  end if;

  -- Serialize onboarding calls by user so double-clicks/retries cannot create
  -- duplicate condominiums for the same account.
  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text, 0));

  select mc.condominio_id
    into v_id
    from public.membros_condominio mc
   where mc.user_id = v_user_id
     and mc.status = 'active'
   order by mc.created_at asc
   limit 1;

  if v_id is not null then
    return v_id;
  end if;

  insert into public.condominios(nome, cidade, estado, quantidade_unidades, created_by)
  values (
    trim(p_nome),
    nullif(trim(p_cidade), ''),
    nullif(trim(p_estado), ''),
    greatest(coalesce(p_quantidade_unidades, 0), 0),
    v_user_id
  )
  returning id into v_id;

  insert into public.membros_condominio(condominio_id, user_id, role, status)
  values (v_id, v_user_id, 'administrador', 'active');

  insert into public.assinaturas(condominio_id, status, trial_inicio, trial_fim)
  values (v_id, 'trial', now(), now() + interval '14 days');

  insert into public.configuracoes(condominio_id)
  values (v_id);

  return v_id;
end;
$$;

-- Remove broad tenant-wide reads of personally identifiable or administrative
-- records. Existing role-based ALL policies continue to authorize managers.
drop policy if exists membros_condominio_select on public.membros_condominio;
create policy membros_condominio_select_scoped
on public.membros_condominio
for select to authenticated
using (
  user_id = (select auth.uid())
  or public.has_condo_role(
    condominio_id,
    array['super_admin','administrador']::public.app_role[]
  )
);

drop policy if exists moradores_select on public.moradores;
create policy moradores_select_scoped
on public.moradores
for select to authenticated
using (
  user_id = (select auth.uid())
  or public.has_condo_role(
    condominio_id,
    array['super_admin','administrador','sindico','sub_sindico']::public.app_role[]
  )
);

drop policy if exists funcionarios_select on public.funcionarios;

drop policy if exists assinaturas_select on public.assinaturas;
drop policy if exists auditoria_select on public.auditoria;
drop policy if exists configuracoes_select on public.configuracoes;
drop policy if exists despesas_select on public.despesas;
drop policy if exists receitas_select on public.receitas;

drop policy if exists cobrancas_select on public.cobrancas;
create policy cobrancas_select_scoped
on public.cobrancas
for select to authenticated
using (
  public.has_condo_role(
    condominio_id,
    array['super_admin','administrador','sindico']::public.app_role[]
  )
  or exists (
    select 1
      from public.moradores m
     where m.condominio_id = cobrancas.condominio_id
       and m.unidade_id = cobrancas.unidade_id
       and m.user_id = (select auth.uid())
  )
);

-- Restrict operational records containing visitor, delivery, vehicle and access
-- details to authorized operational roles or a resident's own unit.
drop policy if exists visitantes_select on public.visitantes;
create policy visitantes_select_scoped
on public.visitantes
for select to authenticated
using (
  public.has_condo_role(
    condominio_id,
    array['super_admin','administrador','sindico','sub_sindico','porteiro']::public.app_role[]
  )
  or exists (
    select 1 from public.moradores m
     where m.condominio_id = visitantes.condominio_id
       and m.unidade_id = visitantes.unidade_id
       and m.user_id = (select auth.uid())
  )
);

drop policy if exists entregas_select on public.entregas;
create policy entregas_select_scoped
on public.entregas
for select to authenticated
using (
  public.has_condo_role(
    condominio_id,
    array['super_admin','administrador','sindico','sub_sindico','porteiro']::public.app_role[]
  )
  or exists (
    select 1 from public.moradores m
     where m.condominio_id = entregas.condominio_id
       and m.unidade_id = entregas.unidade_id
       and m.user_id = (select auth.uid())
  )
);

drop policy if exists acessos_portaria_select on public.acessos_portaria;
create policy acessos_portaria_select_scoped
on public.acessos_portaria
for select to authenticated
using (
  public.has_condo_role(
    condominio_id,
    array['super_admin','administrador','sindico','sub_sindico','porteiro']::public.app_role[]
  )
  or exists (
    select 1 from public.moradores m
     where m.condominio_id = acessos_portaria.condominio_id
       and m.unidade_id = acessos_portaria.unidade_id
       and m.user_id = (select auth.uid())
  )
);

drop policy if exists veiculos_select on public.veiculos;
create policy veiculos_select_scoped
on public.veiculos
for select to authenticated
using (
  public.has_condo_role(
    condominio_id,
    array['super_admin','administrador','sindico','sub_sindico','porteiro']::public.app_role[]
  )
  or exists (
    select 1 from public.moradores m
     where m.condominio_id = veiculos.condominio_id
       and m.unidade_id = veiculos.unidade_id
       and m.user_id = (select auth.uid())
  )
);

drop policy if exists animais_select on public.animais;
create policy animais_select_scoped
on public.animais
for select to authenticated
using (
  public.has_condo_role(
    condominio_id,
    array['super_admin','administrador','sindico','sub_sindico']::public.app_role[]
  )
  or exists (
    select 1 from public.moradores m
     where m.condominio_id = animais.condominio_id
       and m.unidade_id = animais.unidade_id
       and m.user_id = (select auth.uid())
  )
);

-- Tighten profile updates so a user cannot reassign the row to another identity.
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self
on public.profiles
for update to authenticated
using (id = (select auth.uid()) or public.is_platform_admin())
with check (id = (select auth.uid()) or public.is_platform_admin());
