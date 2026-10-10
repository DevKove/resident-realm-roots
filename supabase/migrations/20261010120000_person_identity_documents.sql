-- Documentos de identificação vinculados a cadastros de pessoas.
-- O bucket é privado; os objetos são sempre armazenados sob o UUID do condomínio.
alter table public.moradores
  add column if not exists documento_path text,
  add column if not exists documento_nome text,
  add column if not exists documento_mime_type text,
  add column if not exists documento_tamanho_bytes bigint;

alter table public.funcionarios
  add column if not exists documento_path text,
  add column if not exists documento_nome text,
  add column if not exists documento_mime_type text,
  add column if not exists documento_tamanho_bytes bigint;

alter table public.visitantes
  add column if not exists documento_path text,
  add column if not exists documento_nome text,
  add column if not exists documento_mime_type text,
  add column if not exists documento_tamanho_bytes bigint;

alter table public.acessos_portaria
  add column if not exists documento_path text,
  add column if not exists documento_nome text,
  add column if not exists documento_mime_type text,
  add column if not exists documento_tamanho_bytes bigint;

alter table public.moradores
  drop constraint if exists moradores_documento_tamanho_bytes_check;
alter table public.moradores
  add constraint moradores_documento_tamanho_bytes_check
  check (documento_tamanho_bytes is null or documento_tamanho_bytes between 1 and 20971520);

alter table public.funcionarios
  drop constraint if exists funcionarios_documento_tamanho_bytes_check;
alter table public.funcionarios
  add constraint funcionarios_documento_tamanho_bytes_check
  check (documento_tamanho_bytes is null or documento_tamanho_bytes between 1 and 20971520);

alter table public.visitantes
  drop constraint if exists visitantes_documento_tamanho_bytes_check;
alter table public.visitantes
  add constraint visitantes_documento_tamanho_bytes_check
  check (documento_tamanho_bytes is null or documento_tamanho_bytes between 1 and 20971520);

alter table public.acessos_portaria
  drop constraint if exists acessos_portaria_documento_tamanho_bytes_check;
alter table public.acessos_portaria
  add constraint acessos_portaria_documento_tamanho_bytes_check
  check (documento_tamanho_bytes is null or documento_tamanho_bytes between 1 and 20971520);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'identity-documents',
  'identity-documents',
  false,
  20971520,
  array['application/pdf','image/jpeg','image/png','image/webp']::text[]
)
on conflict (id) do update
set public = false,
    file_size_limit = 20971520,
    allowed_mime_types = array['application/pdf','image/jpeg','image/png','image/webp']::text[];

drop policy if exists identity_documents_read on storage.objects;
create policy identity_documents_read
on storage.objects
for select
to authenticated
using (
  bucket_id = 'identity-documents'
  and split_part(name, '/', 1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and public.has_condo_role(
    (split_part(name, '/', 1))::uuid,
    array['super_admin','administrador','sindico','sub_sindico','porteiro','funcionario']::public.app_role[]
  )
);

drop policy if exists identity_documents_insert on storage.objects;
create policy identity_documents_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'identity-documents'
  and split_part(name, '/', 1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and octet_length(name) <= 500
  and public.has_condo_role(
    (split_part(name, '/', 1))::uuid,
    array['super_admin','administrador','sindico','sub_sindico','porteiro','funcionario']::public.app_role[]
  )
);

drop policy if exists identity_documents_update on storage.objects;
create policy identity_documents_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'identity-documents'
  and split_part(name, '/', 1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and public.has_condo_role(
    (split_part(name, '/', 1))::uuid,
    array['super_admin','administrador','sindico','sub_sindico']::public.app_role[]
  )
)
with check (
  bucket_id = 'identity-documents'
  and split_part(name, '/', 1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and octet_length(name) <= 500
  and public.has_condo_role(
    (split_part(name, '/', 1))::uuid,
    array['super_admin','administrador','sindico','sub_sindico']::public.app_role[]
  )
);

drop policy if exists identity_documents_delete on storage.objects;
create policy identity_documents_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'identity-documents'
  and split_part(name, '/', 1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and public.has_condo_role(
    (split_part(name, '/', 1))::uuid,
    array['super_admin','administrador','sindico']::public.app_role[]
  )
);
