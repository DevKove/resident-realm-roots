-- SindCoop core SaaS schema
-- Multi-tenant PostgreSQL foundation. All tenant-owned data is scoped by condominio_id.
create extension if not exists pgcrypto;

create type public.app_role as enum ('super_admin','administrador','sindico','sub_sindico','morador','funcionario','porteiro');
create type public.member_status as enum ('active','inactive','pending');
create type public.unit_status as enum ('occupied','empty','rented','maintenance');
create type public.occurrence_status as enum ('open','analyzing','in_progress','resolved','canceled');
create type public.priority_level as enum ('low','medium','high','critical');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  cpf text,
  phone text,
  avatar_path text,
  role public.app_role not null default 'morador',
  is_platform_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.planos (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null,
  nome text not null,
  preco_mensal numeric(12,2) not null default 0 check (preco_mensal >= 0),
  limite_unidades integer check (limite_unidades is null or limite_unidades > 0),
  limite_usuarios integer check (limite_usuarios is null or limite_usuarios > 0),
  limite_condominios integer check (limite_condominios is null or limite_condominios > 0),
  recursos jsonb not null default '{}'::jsonb,
  trial_dias integer not null default 14 check (trial_dias >= 0),
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.condominios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cnpj text,
  endereco text,
  numero text,
  complemento text,
  bairro text,
  cep text,
  cidade text,
  estado text,
  telefone text,
  email text,
  logo_path text,
  quantidade_unidades integer not null default 0 check (quantidade_unidades >= 0),
  blocos integer not null default 1 check (blocos > 0),
  descricao text,
  configuracoes jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.membros_condominio (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null default 'morador',
  status public.member_status not null default 'active',
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(condominio_id,user_id)
);

create table if not exists public.unidades (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  bloco text,
  numero text not null,
  andar text,
  tipo text,
  area numeric(12,2),
  fracao_ideal numeric(12,6),
  status public.unit_status not null default 'occupied',
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(condominio_id,bloco,numero)
);

create table if not exists public.moradores (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  unidade_id uuid references public.unidades(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  nome text not null,
  cpf text,
  email text,
  telefone text,
  data_nascimento date,
  tipo text not null default 'other',
  status public.member_status not null default 'active',
  foto_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.funcionarios (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  nome text not null,
  cpf text,
  funcao text not null,
  telefone text,
  email text,
  data_admissao date,
  status public.member_status not null default 'active',
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.veiculos (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  unidade_id uuid references public.unidades(id) on delete set null,
  morador_id uuid references public.moradores(id) on delete set null,
  placa text,
  marca_modelo text,
  cor text,
  tipo text,
  vaga text,
  observacoes text,
  created_at timestamptz not null default now()
);

create table if not exists public.animais (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  unidade_id uuid references public.unidades(id) on delete set null,
  responsavel_id uuid references public.moradores(id) on delete set null,
  nome text not null,
  especie text,
  raca text,
  porte text,
  observacoes text,
  created_at timestamptz not null default now()
);

create table if not exists public.avisos (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  autor_id uuid references public.profiles(id) on delete set null,
  titulo text not null,
  conteudo text not null,
  prioridade public.priority_level not null default 'low',
  publicado_em timestamptz,
  arquivado_em timestamptz,
  publico jsonb not null default '{"todos":true}'::jsonb,
  anexos jsonb not null default '[]'::jsonb,
  fixado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notificacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  condominio_id uuid references public.condominios(id) on delete cascade,
  tipo text not null,
  titulo text not null,
  mensagem text not null,
  lida_em timestamptz,
  referencia_tipo text,
  referencia_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.enquetes (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  autor_id uuid references public.profiles(id) on delete set null,
  pergunta text not null,
  inicio timestamptz not null,
  fim timestamptz not null,
  publico jsonb not null default '{"todos":true}'::jsonb,
  resultado_publico boolean not null default false,
  created_at timestamptz not null default now(),
  check (fim > inicio)
);

create table if not exists public.enquete_opcoes (
  id uuid primary key default gen_random_uuid(),
  enquete_id uuid not null references public.enquetes(id) on delete cascade,
  texto text not null,
  ordem integer not null default 0
);

create table if not exists public.enquete_votos (
  id uuid primary key default gen_random_uuid(),
  enquete_id uuid not null references public.enquetes(id) on delete cascade,
  opcao_id uuid not null references public.enquete_opcoes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  criado_em timestamptz not null default now(),
  unique(enquete_id,user_id)
);

create table if not exists public.ocorrencias (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  autor_id uuid references public.profiles(id) on delete set null,
  responsavel_id uuid references public.profiles(id) on delete set null,
  unidade_id uuid references public.unidades(id) on delete set null,
  titulo text not null,
  descricao text not null,
  categoria text not null,
  prioridade public.priority_level not null default 'medium',
  status public.occurrence_status not null default 'open',
  criado_em timestamptz not null default now(),
  resolvido_em timestamptz,
  anexos jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.ocorrencia_historico (
  id uuid primary key default gen_random_uuid(),
  ocorrencia_id uuid not null references public.ocorrencias(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  acao text not null,
  dados jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ocorrencia_comentarios (
  id uuid primary key default gen_random_uuid(),
  ocorrencia_id uuid not null references public.ocorrencias(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  comentario text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.areas_comuns (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  nome text not null,
  descricao text,
  capacidade integer check (capacidade is null or capacidade > 0),
  regras text,
  hora_inicio time,
  hora_fim time,
  intervalo_minutos integer not null default 0 check (intervalo_minutos >= 0),
  antecedencia_minutos integer not null default 0 check (antecedencia_minutos >= 0),
  antecedencia_maxima_dias integer check (antecedencia_maxima_dias is null or antecedencia_maxima_dias >= 0),
  taxa numeric(12,2) not null default 0 check (taxa >= 0),
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.reservas (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  area_id uuid not null references public.areas_comuns(id) on delete cascade,
  morador_id uuid references public.moradores(id) on delete set null,
  solicitante_id uuid references public.profiles(id) on delete set null,
  inicio timestamptz not null,
  fim timestamptz not null,
  status text not null default 'pending',
  observacoes text,
  created_at timestamptz not null default now(),
  check (fim > inicio)
);

create table if not exists public.visitantes (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  unidade_id uuid references public.unidades(id) on delete set null,
  morador_id uuid references public.moradores(id) on delete set null,
  nome text not null,
  documento text,
  autorizado boolean not null default false,
  entrada timestamptz,
  saida timestamptz,
  observacoes text,
  created_at timestamptz not null default now()
);

create table if not exists public.entregas (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  unidade_id uuid references public.unidades(id) on delete set null,
  destinatario text not null,
  transportadora text,
  descricao text,
  recebido_em timestamptz not null default now(),
  responsavel_id uuid references public.profiles(id) on delete set null,
  status text not null default 'waiting_pickup',
  retirado_em timestamptz
);

create table if not exists public.acessos_portaria (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  unidade_id uuid references public.unidades(id) on delete set null,
  pessoa text not null,
  tipo text not null,
  entrada timestamptz not null default now(),
  saida timestamptz,
  operador_id uuid references public.profiles(id) on delete set null,
  observacoes text
);

create table if not exists public.documentos (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  autor_id uuid references public.profiles(id) on delete set null,
  categoria text not null,
  titulo text not null,
  storage_path text not null,
  mime_type text not null,
  tamanho_bytes bigint not null check (tamanho_bytes >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.categorias_financeiras (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  nome text not null,
  tipo text not null check (tipo in ('receita','despesa')),
  ativo boolean not null default true,
  unique(condominio_id,nome,tipo)
);

create table if not exists public.receitas (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  unidade_id uuid references public.unidades(id) on delete set null,
  categoria_id uuid references public.categorias_financeiras(id) on delete set null,
  descricao text not null,
  valor numeric(12,2) not null check (valor >= 0),
  data date not null,
  status text not null default 'pending',
  observacoes text,
  created_at timestamptz not null default now()
);

create table if not exists public.despesas (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  categoria_id uuid references public.categorias_financeiras(id) on delete set null,
  descricao text not null,
  fornecedor text,
  valor numeric(12,2) not null check (valor >= 0),
  vencimento date,
  pagamento date,
  status text not null default 'pending',
  comprovante_path text,
  observacoes text,
  created_at timestamptz not null default now()
);

create table if not exists public.cobrancas (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null references public.condominios(id) on delete cascade,
  unidade_id uuid not null references public.unidades(id) on delete cascade,
  competencia date not null,
  valor numeric(12,2) not null check (valor >= 0),
  vencimento date not null,
  status text not null default 'pending',
  pagamento date,
  juros numeric(12,2) not null default 0 check (juros >= 0),
  multa numeric(12,2) not null default 0 check (multa >= 0),
  observacoes text,
  created_at timestamptz not null default now()
);

create table if not exists public.auditoria (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  condominio_id uuid references public.condominios(id) on delete cascade,
  acao text not null,
  recurso text,
  tabela text,
  registro_id uuid,
  ip inet,
  informacoes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.assinaturas (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null unique references public.condominios(id) on delete cascade,
  plano_id uuid references public.planos(id) on delete set null,
  status text not null default 'trial',
  trial_inicio timestamptz,
  trial_fim timestamptz,
  periodo_inicio timestamptz,
  periodo_fim timestamptz,
  payment_provider text,
  customer_id text,
  subscription_id text,
  external_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.configuracoes (
  id uuid primary key default gen_random_uuid(),
  condominio_id uuid not null unique references public.condominios(id) on delete cascade,
  regras_reservas jsonb not null default '{}'::jsonb,
  notificacoes jsonb not null default '{}'::jsonb,
  financeiro jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.planos (codigo,nome,preco_mensal,limite_unidades,limite_usuarios,limite_condominios,trial_dias,recursos)
values
('essencial','Essencial',49,30,5,1,14,'{"avisos":true,"ocorrencias":true,"reservas":true,"documentos":true}'),
('profissional','Profissional',99,100,20,1,14,'{"financeiro":true,"portaria":true,"visitantes":true,"entregas":true,"auditoria":true}'),
('empresa','Empresa',199,null,null,null,14,'{"multi_condominio":true,"permissoes_avancadas":true,"relatorios_avancados":true}')
on conflict (codigo) do update set nome=excluded.nome,preco_mensal=excluded.preco_mensal,limite_unidades=excluded.limite_unidades,limite_usuarios=excluded.limite_usuarios,limite_condominios=excluded.limite_condominios,trial_dias=excluded.trial_dias,recursos=excluded.recursos;

create or replace function public.is_platform_admin()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles where id=auth.uid() and is_platform_admin=true); $$;

create or replace function public.is_condo_member(p_condominio uuid)
returns boolean language sql stable security definer set search_path=public
as $$ select public.is_platform_admin() or exists(select 1 from public.membros_condominio where condominio_id=p_condominio and user_id=auth.uid() and status='active'); $$;

create or replace function public.has_condo_role(p_condominio uuid, p_roles public.app_role[])
returns boolean language sql stable security definer set search_path=public
as $$ select public.is_platform_admin() or exists(select 1 from public.membros_condominio where condominio_id=p_condominio and user_id=auth.uid() and status='active' and role=any(p_roles)); $$;

grant execute on function public.is_platform_admin() to authenticated;
grant execute on function public.is_condo_member(uuid) to authenticated;
grant execute on function public.has_condo_role(uuid,public.app_role[]) to authenticated;

alter table public.profiles enable row level security;
alter table public.planos enable row level security;
alter table public.condominios enable row level security;
alter table public.membros_condominio enable row level security;
alter table public.unidades enable row level security;
alter table public.moradores enable row level security;
alter table public.funcionarios enable row level security;
alter table public.veiculos enable row level security;
alter table public.animais enable row level security;
alter table public.avisos enable row level security;
alter table public.notificacoes enable row level security;
alter table public.enquetes enable row level security;
alter table public.enquete_opcoes enable row level security;
alter table public.enquete_votos enable row level security;
alter table public.ocorrencias enable row level security;
alter table public.ocorrencia_historico enable row level security;
alter table public.ocorrencia_comentarios enable row level security;
alter table public.areas_comuns enable row level security;
alter table public.reservas enable row level security;
alter table public.visitantes enable row level security;
alter table public.entregas enable row level security;
alter table public.acessos_portaria enable row level security;
alter table public.documentos enable row level security;
alter table public.categorias_financeiras enable row level security;
alter table public.receitas enable row level security;
alter table public.despesas enable row level security;
alter table public.cobrancas enable row level security;
alter table public.auditoria enable row level security;
alter table public.assinaturas enable row level security;
alter table public.configuracoes enable row level security;

create policy profiles_self on public.profiles for select to authenticated using (id=auth.uid() or public.is_platform_admin());
create policy profiles_update_self on public.profiles for update to authenticated using (id=auth.uid() or public.is_platform_admin());
create policy plans_read on public.planos for select to authenticated using (ativo or public.is_platform_admin());

-- Tenant-owned tables expose only rows from an authorized condominium.
do $$
declare t text;
begin
  foreach t in array array['condominios','membros_condominio','unidades','moradores','funcionarios','veiculos','animais','avisos','enquetes','ocorrencias','areas_comuns','reservas','visitantes','entregas','acessos_portaria','documentos','categorias_financeiras','receitas','despesas','cobrancas','auditoria','assinaturas','configuracoes']
  loop
    execute format('create policy %I_select on public.%I for select to authenticated using (public.is_condo_member(condominio_id))',t,t);
  end loop;
end $$;

-- Child tables derive tenant authorization from their parent row.
create policy enquete_opcoes_select on public.enquete_opcoes for select to authenticated
using (exists (select 1 from public.enquetes e where e.id=enquete_id and public.is_condo_member(e.condominio_id)));
create policy enquete_votos_self on public.enquete_votos for all to authenticated
using (user_id=auth.uid() and exists (select 1 from public.enquetes e where e.id=enquete_id and public.is_condo_member(e.condominio_id)))
with check (user_id=auth.uid() and exists (select 1 from public.enquetes e where e.id=enquete_id and public.is_condo_member(e.condominio_id)));
create policy ocorrencia_historico_select on public.ocorrencia_historico for select to authenticated
using (exists (select 1 from public.ocorrencias o where o.id=ocorrencia_id and public.is_condo_member(o.condominio_id)));
create policy ocorrencia_comentarios_select on public.ocorrencia_comentarios for select to authenticated
using (exists (select 1 from public.ocorrencias o where o.id=ocorrencia_id and public.is_condo_member(o.condominio_id)));
create policy notificacao_self on public.notificacoes for all to authenticated
using (user_id=auth.uid() or public.is_platform_admin())
with check (user_id=auth.uid() or public.is_platform_admin());

revoke insert on public.condominios from authenticated;
create policy condo_insert on public.condominios for insert to authenticated with check (public.is_platform_admin());
create policy condo_update on public.condominios for update to authenticated using (public.has_condo_role(id,array['super_admin','administrador','sindico']::public.app_role[])) with check (public.has_condo_role(id,array['super_admin','administrador','sindico']::public.app_role[]));
create policy condo_delete on public.condominios for delete to authenticated using (public.is_platform_admin());

create policy member_manage on public.membros_condominio for all to authenticated
using (public.has_condo_role(condominio_id,array['super_admin','administrador']::public.app_role[]))
with check (public.has_condo_role(condominio_id,array['super_admin','administrador']::public.app_role[]) and role <> 'super_admin');
create policy tenant_manage on public.unidades for all to authenticated using (public.has_condo_role(condominio_id,array['super_admin','administrador','sindico','sub_sindico']::public.app_role[])) with check (public.has_condo_role(condominio_id,array['super_admin','administrador','sindico','sub_sindico']::public.app_role[]));
create policy resident_manage on public.moradores for all to authenticated using (public.has_condo_role(condominio_id,array['super_admin','administrador','sindico','sub_sindico']::public.app_role[])) with check (public.has_condo_role(condominio_id,array['super_admin','administrador','sindico','sub_sindico']::public.app_role[]));
create policy employee_manage on public.funcionarios for all to authenticated using (public.has_condo_role(condominio_id,array['super_admin','administrador','sindico']::public.app_role[])) with check (public.has_condo_role(condominio_id,array['super_admin','administrador','sindico']::public.app_role[]));
create policy occurrence_insert on public.ocorrencias for insert to authenticated
with check (public.is_condo_member(condominio_id) and autor_id=auth.uid());
create policy occurrence_update on public.ocorrencias for update to authenticated
using (public.has_condo_role(condominio_id,array['super_admin','administrador','sindico','sub_sindico']::public.app_role[]) or autor_id=auth.uid())
with check (public.is_condo_member(condominio_id));
create policy occurrence_delete on public.ocorrencias for delete to authenticated
using (public.has_condo_role(condominio_id,array['super_admin','administrador']::public.app_role[]));
create policy reservation_insert on public.reservas for insert to authenticated
with check (public.is_condo_member(condominio_id) and solicitante_id=auth.uid());
create policy reservation_update on public.reservas for update to authenticated
using (solicitante_id=auth.uid() or public.has_condo_role(condominio_id,array['super_admin','administrador','sindico','sub_sindico']::public.app_role[]))
with check (public.is_condo_member(condominio_id));
create policy reservation_delete on public.reservas for delete to authenticated
using (solicitante_id=auth.uid() or public.has_condo_role(condominio_id,array['super_admin','administrador']::public.app_role[]));
create policy notice_manage on public.avisos for all to authenticated using (public.has_condo_role(condominio_id,array['super_admin','administrador','sindico','sub_sindico']::public.app_role[])) with check (public.has_condo_role(condominio_id,array['super_admin','administrador','sindico','sub_sindico']::public.app_role[]));

create policy financial_manage on public.receitas for all to authenticated using (public.has_condo_role(condominio_id,array['super_admin','administrador','sindico']::public.app_role[])) with check (public.has_condo_role(condominio_id,array['super_admin','administrador','sindico']::public.app_role[]));
create policy financial_expense_manage on public.despesas for all to authenticated using (public.has_condo_role(condominio_id,array['super_admin','administrador','sindico']::public.app_role[])) with check (public.has_condo_role(condominio_id,array['super_admin','administrador','sindico']::public.app_role[]));
create policy billing_manage on public.cobrancas for all to authenticated using (public.has_condo_role(condominio_id,array['super_admin','administrador','sindico']::public.app_role[])) with check (public.has_condo_role(condominio_id,array['super_admin','administrador','sindico']::public.app_role[]));
create policy audit_admin on public.auditoria for all to authenticated using (public.has_condo_role(condominio_id,array['super_admin','administrador']::public.app_role[])) with check (public.has_condo_role(condominio_id,array['super_admin','administrador']::public.app_role[]));
create policy subscription_admin on public.assinaturas for all to authenticated using (public.has_condo_role(condominio_id,array['super_admin','administrador']::public.app_role[])) with check (public.has_condo_role(condominio_id,array['super_admin','administrador']::public.app_role[]));
create policy config_admin on public.configuracoes for all to authenticated using (public.has_condo_role(condominio_id,array['super_admin','administrador']::public.app_role[])) with check (public.has_condo_role(condominio_id,array['super_admin','administrador']::public.app_role[]));

create index if not exists idx_members_user on public.membros_condominio(user_id);
create index if not exists idx_members_condo on public.membros_condominio(condominio_id);
create index if not exists idx_units_condo on public.unidades(condominio_id);
create index if not exists idx_residents_condo on public.moradores(condominio_id);
create index if not exists idx_occurrences_condo_status on public.ocorrencias(condominio_id,status);
create index if not exists idx_reservations_area_time on public.reservas(area_id,inicio,fim);
create index if not exists idx_notifications_user_unread on public.notificacoes(user_id,lida_em);
create index if not exists idx_audit_condo_time on public.auditoria(condominio_id,created_at desc);
create index if not exists idx_billing_condo_status on public.cobrancas(condominio_id,status);

create unique index if not exists ux_reservas_sem_conflito on public.reservas(area_id,inicio,fim) where status in ('pending','approved');
