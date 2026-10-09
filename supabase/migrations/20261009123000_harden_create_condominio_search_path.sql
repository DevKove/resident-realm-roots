-- Harden the SECURITY DEFINER onboarding function against search_path shadowing.
-- Keep authenticated execution because this RPC is part of condominium onboarding,
-- while resolving application objects explicitly in the public schema.
create or replace function public.create_condominio(
  p_nome text,
  p_cidade text default null::text,
  p_estado text default null::text,
  p_quantidade_unidades integer default 0
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
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
$function$;
