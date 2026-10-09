-- Restrict financial document objects at the Storage layer, not only in the UI.
-- Members may still access ordinary condominium files according to membership,
-- but only financial managers can read, upload, or update financial documents.

drop policy if exists storage_tenant_read on storage.objects;
create policy storage_tenant_read
on storage.objects
for select
to authenticated
using (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and split_part(name,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and private.is_condo_member((split_part(name,'/',1))::uuid)
  and (
    bucket_id <> 'financial-documents'
    or private.has_condo_role(
      (split_part(name,'/',1))::uuid,
      array['super_admin','administrador','sindico']::public.app_role[]
    )
  )
);

drop policy if exists storage_tenant_insert on storage.objects;
create policy storage_tenant_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and split_part(name,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and private.is_condo_member((split_part(name,'/',1))::uuid)
  and octet_length(name) <= 500
  and (
    bucket_id <> 'financial-documents'
    or private.has_condo_role(
      (split_part(name,'/',1))::uuid,
      array['super_admin','administrador','sindico']::public.app_role[]
    )
  )
);

drop policy if exists storage_tenant_update on storage.objects;
create policy storage_tenant_update
on storage.objects
for update
to authenticated
using (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and split_part(name,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and private.is_condo_member((split_part(name,'/',1))::uuid)
  and (
    bucket_id <> 'financial-documents'
    or private.has_condo_role(
      (split_part(name,'/',1))::uuid,
      array['super_admin','administrador','sindico']::public.app_role[]
    )
  )
)
with check (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and split_part(name,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and private.is_condo_member((split_part(name,'/',1))::uuid)
  and octet_length(name) <= 500
  and (
    bucket_id <> 'financial-documents'
    or private.has_condo_role(
      (split_part(name,'/',1))::uuid,
      array['super_admin','administrador','sindico']::public.app_role[]
    )
  )
);

-- Keep deletion limited to condominium/platform managers for every bucket.
drop policy if exists storage_tenant_delete on storage.objects;
create policy storage_tenant_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and split_part(name,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and private.has_condo_role(
    (split_part(name,'/',1))::uuid,
    array['super_admin','administrador','sindico']::public.app_role[]
  )
);
