-- SindCoop security and transactional onboarding hardening
create extension if not exists btree_gist;

alter table public.reservas drop constraint if exists reservas_no_overlap;
alter table public.reservas add constraint reservas_no_overlap
exclude using gist (area_id with =, tstzrange(inicio,fim,'[)') with &&)
where (status in ('pending','approved'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public
as $$ begin
  insert into public.profiles(id,full_name) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.create_condominio(
  p_nome text,
  p_cidade text default null,
  p_estado text default null,
  p_quantidade_unidades integer default 0
) returns uuid
language plpgsql security definer set search_path=public
as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'Não autenticado'; end if;
  insert into public.condominios(nome,cidade,estado,quantidade_unidades,created_by)
  values(trim(p_nome),p_cidade,p_estado,greatest(p_quantidade_unidades,0),auth.uid())
  returning id into v_id;
  insert into public.membros_condominio(condominio_id,user_id,role,status)
  values(v_id,auth.uid(),'administrador','active');
  insert into public.assinaturas(condominio_id,status,trial_inicio,trial_fim)
  values(v_id,'trial',now(),now()+interval '14 days');
  insert into public.configuracoes(condominio_id) values(v_id);
  return v_id;
end $$;

revoke all on function public.create_condominio(text,text,text,integer) from public;
grant execute on function public.create_condominio(text,text,text,integer) to authenticated;

insert into storage.buckets (id,name,public)
values
('condominium-assets','condominium-assets',false),
('documents','documents',false),
('occurrence-attachments','occurrence-attachments',false),
('resident-files','resident-files',false),
('financial-documents','financial-documents',false)
on conflict (id) do update set public=false;

drop policy if exists storage_tenant_read on storage.objects;
create policy storage_tenant_read on storage.objects for select to authenticated
using (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and split_part(name,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}

drop policy if exists storage_tenant_insert on storage.objects;
create policy storage_tenant_insert on storage.objects for insert to authenticated
with check (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and split_part(name,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}

drop policy if exists storage_tenant_delete on storage.objects;
create policy storage_tenant_delete on storage.objects for delete to authenticated
using (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and split_part(name,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;

do $$
declare t text;
begin
 foreach t in array array['profiles','condominios','membros_condominio','unidades','moradores','funcionarios','avisos','ocorrencias','assinaturas']
 loop
   execute format('drop trigger if exists %I on public.%I', 'touch_'||t,t);
   execute format('create trigger %I before update on public.%I for each row execute function public.touch_updated_at()', 'touch_'||t,t);
 end loop;
end $$;

  and public.is_condo_member((split_part(name,'/',1))::uuid)
);

drop policy if exists storage_tenant_insert on storage.objects;
create policy storage_tenant_insert on storage.objects for insert to authenticated
with check (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and public.is_condo_member((split_part(name,'/',1))::uuid)
  and octet_length(name) < 500
);

drop policy if exists storage_tenant_delete on storage.objects;
create policy storage_tenant_delete on storage.objects for delete to authenticated
using (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and public.has_condo_role((split_part(name,'/',1))::uuid,array['super_admin','administrador','sindico']::public.app_role[])
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;

do $$
declare t text;
begin
 foreach t in array array['profiles','condominios','membros_condominio','unidades','moradores','funcionarios','avisos','ocorrencias','assinaturas']
 loop
   execute format('drop trigger if exists %I on public.%I', 'touch_'||t,t);
   execute format('create trigger %I before update on public.%I for each row execute function public.touch_updated_at()', 'touch_'||t,t);
 end loop;
end $$;

  and public.is_condo_member((split_part(name,'/',1))::uuid)
  and octet_length(name) < 500
);

drop policy if exists storage_tenant_delete on storage.objects;
create policy storage_tenant_delete on storage.objects for delete to authenticated
using (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and public.has_condo_role((split_part(name,'/',1))::uuid,array['super_admin','administrador','sindico']::public.app_role[])
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;

do $$
declare t text;
begin
 foreach t in array array['profiles','condominios','membros_condominio','unidades','moradores','funcionarios','avisos','ocorrencias','assinaturas']
 loop
   execute format('drop trigger if exists %I on public.%I', 'touch_'||t,t);
   execute format('create trigger %I before update on public.%I for each row execute function public.touch_updated_at()', 'touch_'||t,t);
 end loop;
end $$;

  and public.is_condo_member((split_part(name,'/',1))::uuid)
);

drop policy if exists storage_tenant_insert on storage.objects;
create policy storage_tenant_insert on storage.objects for insert to authenticated
with check (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and public.is_condo_member((split_part(name,'/',1))::uuid)
  and octet_length(name) < 500
);

drop policy if exists storage_tenant_delete on storage.objects;
create policy storage_tenant_delete on storage.objects for delete to authenticated
using (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and public.has_condo_role((split_part(name,'/',1))::uuid,array['super_admin','administrador','sindico']::public.app_role[])
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;

do $$
declare t text;
begin
 foreach t in array array['profiles','condominios','membros_condominio','unidades','moradores','funcionarios','avisos','ocorrencias','assinaturas']
 loop
   execute format('drop trigger if exists %I on public.%I', 'touch_'||t,t);
   execute format('create trigger %I before update on public.%I for each row execute function public.touch_updated_at()', 'touch_'||t,t);
 end loop;
end $$;

  and public.has_condo_role((split_part(name,'/',1))::uuid,array['super_admin','administrador','sindico']::public.app_role[])
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;

do $$
declare t text;
begin
 foreach t in array array['profiles','condominios','membros_condominio','unidades','moradores','funcionarios','avisos','ocorrencias','assinaturas']
 loop
   execute format('drop trigger if exists %I on public.%I', 'touch_'||t,t);
   execute format('create trigger %I before update on public.%I for each row execute function public.touch_updated_at()', 'touch_'||t,t);
 end loop;
end $$;

  and public.is_condo_member((split_part(name,'/',1))::uuid)
);

drop policy if exists storage_tenant_insert on storage.objects;
create policy storage_tenant_insert on storage.objects for insert to authenticated
with check (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and public.is_condo_member((split_part(name,'/',1))::uuid)
  and octet_length(name) < 500
);

drop policy if exists storage_tenant_delete on storage.objects;
create policy storage_tenant_delete on storage.objects for delete to authenticated
using (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and public.has_condo_role((split_part(name,'/',1))::uuid,array['super_admin','administrador','sindico']::public.app_role[])
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;

do $$
declare t text;
begin
 foreach t in array array['profiles','condominios','membros_condominio','unidades','moradores','funcionarios','avisos','ocorrencias','assinaturas']
 loop
   execute format('drop trigger if exists %I on public.%I', 'touch_'||t,t);
   execute format('create trigger %I before update on public.%I for each row execute function public.touch_updated_at()', 'touch_'||t,t);
 end loop;
end $$;

  and public.is_condo_member((split_part(name,'/',1))::uuid)
  and octet_length(name) < 500
);

drop policy if exists storage_tenant_delete on storage.objects;
create policy storage_tenant_delete on storage.objects for delete to authenticated
using (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and public.has_condo_role((split_part(name,'/',1))::uuid,array['super_admin','administrador','sindico']::public.app_role[])
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;

do $$
declare t text;
begin
 foreach t in array array['profiles','condominios','membros_condominio','unidades','moradores','funcionarios','avisos','ocorrencias','assinaturas']
 loop
   execute format('drop trigger if exists %I on public.%I', 'touch_'||t,t);
   execute format('create trigger %I before update on public.%I for each row execute function public.touch_updated_at()', 'touch_'||t,t);
 end loop;
end $$;

  and public.is_condo_member((split_part(name,'/',1))::uuid)
);

drop policy if exists storage_tenant_insert on storage.objects;
create policy storage_tenant_insert on storage.objects for insert to authenticated
with check (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and public.is_condo_member((split_part(name,'/',1))::uuid)
  and octet_length(name) < 500
);

drop policy if exists storage_tenant_delete on storage.objects;
create policy storage_tenant_delete on storage.objects for delete to authenticated
using (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and public.has_condo_role((split_part(name,'/',1))::uuid,array['super_admin','administrador','sindico']::public.app_role[])
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;

do $$
declare t text;
begin
 foreach t in array array['profiles','condominios','membros_condominio','unidades','moradores','funcionarios','avisos','ocorrencias','assinaturas']
 loop
   execute format('drop trigger if exists %I on public.%I', 'touch_'||t,t);
   execute format('create trigger %I before update on public.%I for each row execute function public.touch_updated_at()', 'touch_'||t,t);
 end loop;
end $$;
