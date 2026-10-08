
create type public.app_role as enum ('super_admin');
create type public.cond_role as enum ('admin','sindico','subsindico','morador','funcionario','porteiro');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text, email text, telefone text, avatar_url text,
  tema text not null default 'system',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null, unique(user_id, role)
);
create table public.planos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, nome text not null, descricao text,
  preco numeric(10,2) not null default 0 check (preco >= 0),
  max_unidades int, max_condominios int not null default 1,
  recursos text[] not null default '{}', ativo boolean not null default true, ordem int not null default 0,
  created_at timestamptz not null default now()
);
create table public.configuracoes (chave text primary key, valor jsonb not null, updated_at timestamptz not null default now());
create table public.condominios (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (length(nome) between 2 and 160),
  cnpj text, endereco text, cidade text, estado text, cep text, telefone text, email text, logo_url text,
  regras_reserva text, bloqueado boolean not null default false,
  created_by uuid not null default auth.uid(),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.unidades (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  bloco text not null default '', numero text not null, tipo text not null default 'apartamento',
  area numeric(10,2), vagas int not null default 0, situacao text not null default 'ocupada' check (situacao in ('ocupada','vaga','alugada','em_obra')),
  observacoes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(condominio_id, bloco, numero)
);
create table public.membros_condominio (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  user_id uuid not null, papel public.cond_role not null,
  unidade_id uuid references public.unidades(id) on delete set null,
  ativo boolean not null default true, created_at timestamptz not null default now(),
  unique(condominio_id, user_id)
);
create table public.convites (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  email text not null, papel public.cond_role not null default 'morador',
  unidade_id uuid references public.unidades(id) on delete set null,
  aceito_em timestamptz, created_by uuid default auth.uid(), created_at timestamptz not null default now(),
  unique(condominio_id, email)
);
create table public.assinaturas (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null unique references public.condominios(id) on delete cascade,
  plano_id uuid not null references public.planos(id),
  status text not null default 'trial' check (status in ('trial','active','past_due','canceled','suspended')),
  inicio timestamptz not null default now(), trial_fim timestamptz, renovacao timestamptz, cancelado_em timestamptz,
  provider text, external_id text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.moradores (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  unidade_id uuid references public.unidades(id) on delete set null,
  user_id uuid, nome text not null, email text, telefone text, cpf text,
  tipo text not null default 'proprietario' check (tipo in ('proprietario','inquilino','dependente','outro')),
  principal boolean not null default false, ativo boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.funcionarios (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  nome text not null, cargo text, telefone text, email text, turno text, admissao date,
  ativo boolean not null default true, created_at timestamptz not null default now()
);
create table public.veiculos (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  unidade_id uuid references public.unidades(id) on delete cascade,
  placa text not null, modelo text, cor text, tipo text not null default 'carro',
  created_at timestamptz not null default now()
);
create table public.animais (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  unidade_id uuid references public.unidades(id) on delete cascade,
  nome text not null, especie text, raca text, porte text, observacoes text,
  created_at timestamptz not null default now()
);
create table public.avisos (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  titulo text not null, conteudo text not null,
  prioridade text not null default 'normal' check (prioridade in ('baixa','normal','alta','urgente')),
  fixado boolean not null default false, expira_em date,
  created_by uuid default auth.uid(), created_at timestamptz not null default now()
);
create table public.notificacoes (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid references public.condominios(id) on delete cascade,
  user_id uuid not null, titulo text not null, mensagem text, link text,
  lida boolean not null default false, created_at timestamptz not null default now()
);
create table public.enquetes (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  titulo text not null, descricao text, encerra_em timestamptz,
  status text not null default 'aberta' check (status in ('aberta','encerrada')),
  created_by uuid default auth.uid(), created_at timestamptz not null default now()
);
create table public.enquete_opcoes (
  id uuid primary key default gen_random_uuid(),
  enquete_id uuid not null references public.enquetes(id) on delete cascade,
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  texto text not null, ordem int not null default 0
);
create table public.enquete_votos (
  id uuid primary key default gen_random_uuid(),
  enquete_id uuid not null references public.enquetes(id) on delete cascade,
  opcao_id uuid not null references public.enquete_opcoes(id) on delete cascade,
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  user_id uuid not null default auth.uid(), created_at timestamptz not null default now(),
  unique(enquete_id, user_id)
);
create table public.ocorrencias (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  unidade_id uuid references public.unidades(id) on delete set null,
  titulo text not null, descricao text, categoria text not null default 'geral',
  prioridade text not null default 'media' check (prioridade in ('baixa','media','alta','urgente')),
  status text not null default 'aberta' check (status in ('aberta','em_analise','em_andamento','resolvida','cancelada')),
  created_by uuid not null default auth.uid(), responsavel text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.ocorrencia_historico (
  id uuid primary key default gen_random_uuid(),
  ocorrencia_id uuid not null references public.ocorrencias(id) on delete cascade,
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  status text not null, user_id uuid, created_at timestamptz not null default now()
);
create table public.ocorrencia_comentarios (
  id uuid primary key default gen_random_uuid(),
  ocorrencia_id uuid not null references public.ocorrencias(id) on delete cascade,
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  user_id uuid not null default auth.uid(), texto text not null, created_at timestamptz not null default now()
);
create table public.areas_comuns (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  nome text not null, descricao text, capacidade int, taxa numeric(10,2) not null default 0,
  requer_aprovacao boolean not null default true, ativa boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.reservas (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  area_id uuid not null references public.areas_comuns(id) on delete cascade,
  unidade_id uuid references public.unidades(id) on delete set null,
  data date not null, inicio time not null default '08:00', fim time not null default '22:00',
  status text not null default 'pendente' check (status in ('pendente','aprovada','recusada','cancelada')),
  observacoes text, created_by uuid not null default auth.uid(), created_at timestamptz not null default now(),
  check (fim > inicio)
);
create table public.visitantes (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  unidade_id uuid references public.unidades(id) on delete set null,
  nome text not null, documento text, telefone text,
  tipo text not null default 'visitante' check (tipo in ('visitante','prestador','fornecedor','outro')),
  entrada timestamptz not null default now(), saida timestamptz, observacoes text,
  registrado_por uuid default auth.uid(), created_at timestamptz not null default now()
);
create table public.entregas (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  unidade_id uuid references public.unidades(id) on delete set null,
  descricao text not null, remetente text, transportadora text, codigo_rastreio text,
  status text not null default 'aguardando' check (status in ('aguardando','retirada','devolvida')),
  recebido_em timestamptz not null default now(), retirado_em timestamptz, retirado_por text,
  registrado_por uuid default auth.uid(), created_at timestamptz not null default now()
);
create table public.acessos_portaria (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  unidade_id uuid references public.unidades(id) on delete set null,
  pessoa text not null, tipo text not null default 'entrada' check (tipo in ('entrada','saida')),
  categoria text not null default 'morador', placa text, observacoes text,
  registrado_em timestamptz not null default now(), registrado_por uuid default auth.uid(),
  created_at timestamptz not null default now()
);
create table public.documentos (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  titulo text not null, categoria text not null default 'geral', descricao text,
  arquivo_path text not null, tamanho bigint, mime text,
  visibilidade text not null default 'todos' check (visibilidade in ('todos','gestao')),
  created_by uuid default auth.uid(), created_at timestamptz not null default now()
);
create table public.categorias_financeiras (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  nome text not null, tipo text not null check (tipo in ('receita','despesa')),
  created_at timestamptz not null default now()
);
create table public.receitas (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  categoria_id uuid references public.categorias_financeiras(id) on delete set null,
  unidade_id uuid references public.unidades(id) on delete set null,
  descricao text not null, valor numeric(12,2) not null check (valor >= 0), data date not null default current_date,
  forma_pagamento text, created_by uuid default auth.uid(), created_at timestamptz not null default now()
);
create table public.despesas (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  categoria_id uuid references public.categorias_financeiras(id) on delete set null,
  descricao text not null, valor numeric(12,2) not null check (valor >= 0), data date not null default current_date,
  fornecedor text, vencimento date, status text not null default 'paga' check (status in ('pendente','paga','cancelada')),
  created_by uuid default auth.uid(), created_at timestamptz not null default now()
);
create table public.cobrancas (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  unidade_id uuid not null references public.unidades(id) on delete cascade,
  descricao text not null, valor numeric(12,2) not null check (valor >= 0), vencimento date not null,
  status text not null default 'pendente' check (status in ('pendente','paga','atrasada','cancelada')),
  pago_em date, created_at timestamptz not null default now()
);
create table public.auditoria (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid references public.condominios(id) on delete cascade,
  user_id uuid, tabela text not null, acao text not null, registro_id uuid, dados jsonb,
  created_at timestamptz not null default now()
);

-- indexes
do $$ declare t text; begin
  foreach t in array array['unidades','membros_condominio','convites','moradores','funcionarios','veiculos','animais','avisos','notificacoes','enquetes','enquete_opcoes','enquete_votos','ocorrencias','ocorrencia_historico','ocorrencia_comentarios','areas_comuns','reservas','visitantes','entregas','acessos_portaria','documentos','categorias_financeiras','receitas','despesas','cobrancas','auditoria'] loop
    execute format('create index on public.%I (condominio_id)', t);
  end loop; end $$;
create index on public.membros_condominio(user_id);
create index on public.notificacoes(user_id, lida);

-- grants
grant select on public.planos, public.configuracoes to anon;
do $$ declare t text; begin
  foreach t in array array['profiles','user_roles','planos','configuracoes','condominios','unidades','membros_condominio','convites','assinaturas','moradores','funcionarios','veiculos','animais','avisos','notificacoes','enquetes','enquete_opcoes','enquete_votos','ocorrencias','ocorrencia_historico','ocorrencia_comentarios','areas_comuns','reservas','visitantes','entregas','acessos_portaria','documentos','categorias_financeiras','receitas','despesas','cobrancas','auditoria'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
  end loop; end $$;

-- helper functions
create or replace function public.is_super_admin(_uid uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id = _uid and role = 'super_admin') $$;
create or replace function public.is_member(_cid uuid) returns boolean language sql stable security definer set search_path = public as $$
  select public.is_super_admin(auth.uid()) or exists(select 1 from public.membros_condominio m join public.condominios c on c.id = m.condominio_id
    where m.condominio_id = _cid and m.user_id = auth.uid() and m.ativo and not c.bloqueado) $$;
create or replace function public.has_cond_role(_cid uuid, _roles public.cond_role[]) returns boolean language sql stable security definer set search_path = public as $$
  select public.is_super_admin(auth.uid()) or exists(select 1 from public.membros_condominio m join public.condominios c on c.id = m.condominio_id
    where m.condominio_id = _cid and m.user_id = auth.uid() and m.ativo and not c.bloqueado and m.papel = any(_roles)) $$;
create or replace function public.is_gestor(_cid uuid) returns boolean language sql stable security definer set search_path = public as $$
  select public.has_cond_role(_cid, array['admin','sindico','subsindico']::public.cond_role[]) $$;
create or replace function public.is_operacional(_cid uuid) returns boolean language sql stable security definer set search_path = public as $$
  select public.has_cond_role(_cid, array['admin','sindico','subsindico','porteiro']::public.cond_role[]) $$;
create or replace function public.minhas_unidades(_cid uuid) returns setof uuid language sql stable security definer set search_path = public as $$
  select unidade_id from public.membros_condominio where condominio_id = _cid and user_id = auth.uid() and unidade_id is not null
  union select unidade_id from public.moradores where condominio_id = _cid and user_id = auth.uid() and unidade_id is not null $$;

-- policies: profiles / roles / planos / config
create policy "own profile read" on public.profiles for select to authenticated using (
  id = auth.uid() or public.is_super_admin(auth.uid()) or exists(
    select 1 from public.membros_condominio a join public.membros_condominio b on a.condominio_id = b.condominio_id
    where a.user_id = auth.uid() and b.user_id = profiles.id));
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "own profile insert" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "roles read" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.is_super_admin(auth.uid()));
create policy "roles manage" on public.user_roles for all to authenticated using (public.is_super_admin(auth.uid())) with check (public.is_super_admin(auth.uid()));
create policy "planos read" on public.planos for select to anon, authenticated using (ativo or public.is_super_admin(auth.uid()));
create policy "planos manage" on public.planos for all to authenticated using (public.is_super_admin(auth.uid())) with check (public.is_super_admin(auth.uid()));
create policy "config read" on public.configuracoes for select to anon, authenticated using (true);
create policy "config manage" on public.configuracoes for all to authenticated using (public.is_super_admin(auth.uid())) with check (public.is_super_admin(auth.uid()));

-- condominios
create policy "cond read" on public.condominios for select to authenticated using (public.is_member(id) or created_by = auth.uid());
create policy "cond insert" on public.condominios for insert to authenticated with check (created_by = auth.uid());
create policy "cond update" on public.condominios for update to authenticated using (public.has_cond_role(id, array['admin','sindico']::public.cond_role[])) with check (public.has_cond_role(id, array['admin','sindico']::public.cond_role[]));
create policy "cond delete" on public.condominios for delete to authenticated using (public.is_super_admin(auth.uid()));
create policy "membros read" on public.membros_condominio for select to authenticated using (user_id = auth.uid() or public.is_member(condominio_id));
create policy "membros manage" on public.membros_condominio for all to authenticated using (public.has_cond_role(condominio_id, array['admin','sindico']::public.cond_role[])) with check (public.has_cond_role(condominio_id, array['admin','sindico']::public.cond_role[]));
create policy "assin read" on public.assinaturas for select to authenticated using (public.is_member(condominio_id));
create policy "assin manage" on public.assinaturas for all to authenticated using (public.is_super_admin(auth.uid())) with check (public.is_super_admin(auth.uid()));

-- group: members read, gestor write
do $$ declare t text; begin
  foreach t in array array['unidades','funcionarios','veiculos','animais','avisos','enquetes','enquete_opcoes','areas_comuns'] loop
    execute format('create policy "membro le" on public.%I for select to authenticated using (public.is_member(condominio_id))', t);
    execute format('create policy "gestor ins" on public.%I for insert to authenticated with check (public.is_gestor(condominio_id))', t);
    execute format('create policy "gestor upd" on public.%I for update to authenticated using (public.is_gestor(condominio_id)) with check (public.is_gestor(condominio_id))', t);
    execute format('create policy "gestor del" on public.%I for delete to authenticated using (public.is_gestor(condominio_id))', t);
  end loop;
  -- gestor only
  foreach t in array array['categorias_financeiras','receitas','despesas','convites'] loop
    execute format('create policy "gestor all" on public.%I for all to authenticated using (public.is_gestor(condominio_id)) with check (public.is_gestor(condominio_id))', t);
  end loop;
  -- portaria: operacional all, morador reads own unit
  foreach t in array array['visitantes','entregas','acessos_portaria'] loop
    execute format('create policy "oper all" on public.%I for all to authenticated using (public.is_operacional(condominio_id)) with check (public.is_operacional(condominio_id))', t);
    execute format('create policy "morador le" on public.%I for select to authenticated using (public.is_member(condominio_id) and unidade_id in (select public.minhas_unidades(condominio_id)))', t);
  end loop;
end $$;

create policy "moradores le" on public.moradores for select to authenticated using (
  public.has_cond_role(condominio_id, array['admin','sindico','subsindico','porteiro','funcionario']::public.cond_role[])
  or user_id = auth.uid() or (public.is_member(condominio_id) and unidade_id in (select public.minhas_unidades(condominio_id))));
create policy "moradores gestor" on public.moradores for all to authenticated using (public.is_gestor(condominio_id)) with check (public.is_gestor(condominio_id));

create policy "cobr gestor" on public.cobrancas for all to authenticated using (public.is_gestor(condominio_id)) with check (public.is_gestor(condominio_id));
create policy "cobr morador" on public.cobrancas for select to authenticated using (public.is_member(condominio_id) and unidade_id in (select public.minhas_unidades(condominio_id)));

create policy "oc le" on public.ocorrencias for select to authenticated using (
  public.is_operacional(condominio_id) or (public.is_member(condominio_id) and (created_by = auth.uid() or unidade_id in (select public.minhas_unidades(condominio_id)))));
create policy "oc ins" on public.ocorrencias for insert to authenticated with check (public.is_member(condominio_id) and created_by = auth.uid());
create policy "oc upd" on public.ocorrencias for update to authenticated using (public.is_gestor(condominio_id)) with check (public.is_gestor(condominio_id));
create policy "oc del" on public.ocorrencias for delete to authenticated using (public.is_gestor(condominio_id));
create policy "och le" on public.ocorrencia_historico for select to authenticated using (exists(select 1 from public.ocorrencias o where o.id = ocorrencia_id));
create policy "occ le" on public.ocorrencia_comentarios for select to authenticated using (exists(select 1 from public.ocorrencias o where o.id = ocorrencia_id));
create policy "occ ins" on public.ocorrencia_comentarios for insert to authenticated with check (user_id = auth.uid() and exists(select 1 from public.ocorrencias o where o.id = ocorrencia_id and o.condominio_id = ocorrencia_comentarios.condominio_id));
create policy "occ del" on public.ocorrencia_comentarios for delete to authenticated using (user_id = auth.uid() or public.is_gestor(condominio_id));

create policy "res le" on public.reservas for select to authenticated using (public.is_member(condominio_id));
create policy "res ins" on public.reservas for insert to authenticated with check (public.is_member(condominio_id) and created_by = auth.uid());
create policy "res upd" on public.reservas for update to authenticated using (public.is_gestor(condominio_id) or created_by = auth.uid()) with check (public.is_member(condominio_id));
create policy "res del" on public.reservas for delete to authenticated using (public.is_gestor(condominio_id) or created_by = auth.uid());

create policy "votos le" on public.enquete_votos for select to authenticated using (public.is_member(condominio_id));
create policy "votos ins" on public.enquete_votos for insert to authenticated with check (public.is_member(condominio_id) and user_id = auth.uid());

create policy "doc le" on public.documentos for select to authenticated using (public.is_member(condominio_id) and (visibilidade = 'todos' or public.is_gestor(condominio_id)));
create policy "doc gestor" on public.documentos for all to authenticated using (public.is_gestor(condominio_id)) with check (public.is_gestor(condominio_id));

create policy "notif own" on public.notificacoes for select to authenticated using (user_id = auth.uid());
create policy "notif upd" on public.notificacoes for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notif del" on public.notificacoes for delete to authenticated using (user_id = auth.uid());

create policy "audit le" on public.auditoria for select to authenticated using (
  public.is_super_admin(auth.uid()) or (condominio_id is not null and public.has_cond_role(condominio_id, array['admin','sindico']::public.cond_role[])));

-- triggers
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nome, email) values (new.id, coalesce(new.raw_user_meta_data->>'nome', split_part(new.email,'@',1)), new.email)
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.handle_new_condominio() returns trigger language plpgsql security definer set search_path = public as $$
declare _plano uuid; _dias int;
begin
  insert into public.membros_condominio (condominio_id, user_id, papel) values (new.id, new.created_by, 'admin') on conflict do nothing;
  select id into _plano from public.planos where slug = 'profissional';
  if _plano is null then select id into _plano from public.planos order by ordem limit 1; end if;
  select coalesce((valor)::text::int, 14) into _dias from public.configuracoes where chave = 'trial_dias';
  _dias := coalesce(_dias, 14);
  if _plano is not null then
    insert into public.assinaturas (condominio_id, plano_id, status, trial_fim) values (new.id, _plano, 'trial', now() + make_interval(days => _dias));
  end if;
  insert into public.categorias_financeiras (condominio_id, nome, tipo) values
    (new.id,'Taxa condominial','receita'),(new.id,'Multas','receita'),(new.id,'Reservas','receita'),
    (new.id,'Manutenção','despesa'),(new.id,'Limpeza','despesa'),(new.id,'Água e energia','despesa'),(new.id,'Funcionários','despesa');
  return new;
end $$;
create trigger on_condominio_created after insert on public.condominios for each row execute function public.handle_new_condominio();

create or replace function public.recursos_do_condominio(_cid uuid) returns text[] language sql stable security definer set search_path = public as $$
  select case
    when a.status = 'active' then p.recursos
    when a.status = 'trial' and a.trial_fim > now() then p.recursos
    else coalesce((select recursos from public.planos where slug = 'essencial'), '{}') end
  from public.assinaturas a join public.planos p on p.id = a.plano_id where a.condominio_id = _cid and public.is_member(_cid) $$;

create or replace function public.check_limite_unidades() returns trigger language plpgsql security definer set search_path = public as $$
declare _max int; _qtd int;
begin
  select p.max_unidades into _max from public.assinaturas a join public.planos p on p.id = a.plano_id where a.condominio_id = new.condominio_id;
  if _max is not null then
    select count(*) into _qtd from public.unidades where condominio_id = new.condominio_id;
    if _qtd >= _max then raise exception 'Limite de % unidades do seu plano atingido. Faça upgrade para cadastrar mais.', _max; end if;
  end if;
  return new;
end $$;
create trigger trg_limite_unidades before insert on public.unidades for each row execute function public.check_limite_unidades();

create or replace function public.check_reserva_conflito() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status in ('pendente','aprovada') and exists(select 1 from public.reservas r where r.area_id = new.area_id and r.data = new.data
     and r.id <> new.id and r.status in ('pendente','aprovada') and r.inicio < new.fim and new.inicio < r.fim) then
    raise exception 'Já existe uma reserva para este espaço neste horário.';
  end if;
  if tg_op = 'INSERT' and new.data < current_date then raise exception 'Não é possível reservar datas passadas.'; end if;
  if tg_op = 'INSERT' and not public.is_gestor(new.condominio_id) then
    if exists(select 1 from public.areas_comuns where id = new.area_id and not requer_aprovacao) then new.status := 'aprovada'; else new.status := 'pendente'; end if;
  end if;
  return new;
end $$;
create trigger trg_reserva before insert or update on public.reservas for each row execute function public.check_reserva_conflito();

create or replace function public.ocorrencia_status() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.ocorrencia_historico (ocorrencia_id, condominio_id, status, user_id) values (new.id, new.condominio_id, new.status, auth.uid());
  elsif new.status is distinct from old.status then
    new.updated_at := now();
    insert into public.ocorrencia_historico (ocorrencia_id, condominio_id, status, user_id) values (new.id, new.condominio_id, new.status, auth.uid());
    insert into public.notificacoes (condominio_id, user_id, titulo, mensagem, link)
      values (new.condominio_id, new.created_by, 'Ocorrência atualizada', new.titulo || ': ' || replace(new.status,'_',' '), '/app/ocorrencias');
  end if;
  return new;
end $$;
create trigger trg_oc_ins after insert on public.ocorrencias for each row execute function public.ocorrencia_status();
create trigger trg_oc_upd before update on public.ocorrencias for each row execute function public.ocorrencia_status();

create or replace function public.notificar_aviso() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.notificacoes (condominio_id, user_id, titulo, mensagem, link)
  select new.condominio_id, m.user_id, 'Novo aviso: ' || new.titulo, left(new.conteudo, 140), '/app/avisos'
  from public.membros_condominio m where m.condominio_id = new.condominio_id and m.ativo and m.user_id <> coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000');
  return new;
end $$;
create trigger trg_aviso after insert on public.avisos for each row execute function public.notificar_aviso();

create or replace function public.notificar_entrega() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.unidade_id is not null then
    insert into public.notificacoes (condominio_id, user_id, titulo, mensagem, link)
    select distinct new.condominio_id, u, 'Você tem uma entrega na portaria', new.descricao, '/app/entregas' from (
      select user_id u from public.membros_condominio where condominio_id = new.condominio_id and unidade_id = new.unidade_id
      union select user_id from public.moradores where condominio_id = new.condominio_id and unidade_id = new.unidade_id and user_id is not null) s;
  end if;
  return new;
end $$;
create trigger trg_entrega after insert on public.entregas for each row execute function public.notificar_entrega();

create or replace function public.audit_log() returns trigger language plpgsql security definer set search_path = public as $$
declare _row jsonb; _cid uuid;
begin
  _row := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  _cid := case when tg_table_name = 'condominios' then (_row->>'id')::uuid else (_row->>'condominio_id')::uuid end;
  insert into public.auditoria (condominio_id, user_id, tabela, acao, registro_id, dados)
  values (case when tg_op = 'DELETE' and tg_table_name = 'condominios' then null else _cid end, auth.uid(), tg_table_name, tg_op, (_row->>'id')::uuid, _row);
  return coalesce(new, old);
end $$;
do $$ declare t text; begin
  foreach t in array array['condominios','unidades','membros_condominio','convites','moradores','funcionarios','avisos','ocorrencias','reservas','documentos','receitas','despesas','cobrancas','assinaturas','areas_comuns'] loop
    execute format('create trigger trg_audit after insert or update or delete on public.%I for each row execute function public.audit_log()', t);
  end loop; end $$;

create or replace function public.aceitar_convites() returns int language plpgsql security definer set search_path = public as $$
declare _email text := lower(auth.jwt()->>'email'); _n int := 0; c record;
begin
  if auth.uid() is null or _email is null then return 0; end if;
  for c in select * from public.convites where lower(email) = _email and aceito_em is null loop
    insert into public.membros_condominio (condominio_id, user_id, papel, unidade_id) values (c.condominio_id, auth.uid(), c.papel, c.unidade_id)
      on conflict (condominio_id, user_id) do update set papel = excluded.papel, unidade_id = coalesce(excluded.unidade_id, membros_condominio.unidade_id), ativo = true;
    update public.moradores set user_id = auth.uid() where condominio_id = c.condominio_id and lower(email) = _email and user_id is null;
    update public.convites set aceito_em = now() where id = c.id;
    _n := _n + 1;
  end loop;
  return _n;
end $$;

-- seed
insert into public.planos (slug, nome, descricao, preco, max_unidades, max_condominios, recursos, ordem) values
 ('essencial','SindCoop Essencial','Para condomínios pequenos que querem sair da planilha.',49,30,1, array['avisos','enquetes','ocorrencias','reservas','documentos','moradores','unidades'],1),
 ('profissional','SindCoop Profissional','Gestão completa com financeiro e portaria.',99,100,1, array['avisos','enquetes','ocorrencias','reservas','documentos','moradores','unidades','financeiro','relatorios','portaria','visitantes','entregas','auditoria'],2),
 ('empresa','SindCoop Empresa','Para administradoras com vários condomínios.',199,null,10, array['avisos','enquetes','ocorrencias','reservas','documentos','moradores','unidades','financeiro','relatorios','portaria','visitantes','entregas','auditoria','multicondominio','permissoes_avancadas','suporte_prioritario'],3);
insert into public.configuracoes (chave, valor) values ('trial_dias', '14'::jsonb), ('suporte_email', '"suporte@sindcoop.com.br"'::jsonb);
