-- SindCoop hardening: protect public configuration and enforce condominium limits.

revoke all on table public.configuracoes from anon;

create or replace function public.check_limite_condominios()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _max int;
  _qtd int;
begin
  if new.created_by is null then
    raise exception 'Não foi possível identificar o usuário criador do condomínio.';
  end if;

  select max_condominios into _max
  from public.planos
  where slug = 'profissional' and ativo = true
  limit 1;

  _max := coalesce(_max, 1);

  select count(*) into _qtd
  from public.condominios
  where created_by = new.created_by;

  if _qtd >= _max then
    raise exception 'Limite de % condomínio(s) do seu plano atingido. Faça upgrade para cadastrar outro.', _max;
  end if;

  return new;
end;
$$;

revoke execute on function public.check_limite_condominios() from public;
grant execute on function public.check_limite_condominios() to authenticated;

drop trigger if exists trg_limite_condominios on public.condominios;
create trigger trg_limite_condominios
before insert on public.condominios
for each row execute function public.check_limite_condominios();

revoke execute on function public.is_super_admin(uuid) from public;
revoke execute on function public.is_member(uuid) from public;
revoke execute on function public.has_cond_role(uuid, public.cond_role[]) from public;
revoke execute on function public.is_gestor(uuid) from public;
revoke execute on function public.is_operacional(uuid) from public;
revoke execute on function public.minhas_unidades(uuid) from public;
revoke execute on function public.recursos_do_condominio(uuid) from public;

grant execute on function public.is_super_admin(uuid) to authenticated;
grant execute on function public.is_member(uuid) to authenticated;
grant execute on function public.has_cond_role(uuid, public.cond_role[]) to authenticated;
grant execute on function public.is_gestor(uuid) to authenticated;
grant execute on function public.is_operacional(uuid) to authenticated;
grant execute on function public.minhas_unidades(uuid) to authenticated;
grant execute on function public.recursos_do_condominio(uuid) to authenticated;
