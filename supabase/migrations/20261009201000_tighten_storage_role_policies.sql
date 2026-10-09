-- Align object-level Storage permissions with application roles.
-- The resident-files bucket has no current objects and has no owner-id path scheme;
-- keep it management-only until per-resident ownership can be enforced reliably.
drop policy if exists storage_tenant_read on storage.objects;
create policy storage_tenant_read
on storage.objects
for select to authenticated
using (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and split_part(name,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and private.is_condo_member((split_part(name,'/',1))::uuid)
  and (
    (bucket_id <> 'financial-documents' and bucket_id <> 'resident-files')
    or private.has_condo_role((split_part(name,'/',1))::uuid, array['super_admin','administrador','sindico']::public.app_role[])
  )
);

drop policy if exists storage_tenant_insert on storage.objects;
create policy storage_tenant_insert
on storage.objects
for insert to authenticated
with check (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and split_part(name,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and octet_length(name) <= 500
  and (
    (bucket_id = 'condominium-assets' and private.has_condo_role((split_part(name,'/',1))::uuid, array['super_admin','administrador','sindico']::public.app_role[]))
    or (bucket_id = 'documents' and private.has_condo_role((split_part(name,'/',1))::uuid, array['super_admin','administrador','sindico','sub_sindico','funcionario']::public.app_role[]))
    or (bucket_id = 'financial-documents' and private.has_condo_role((split_part(name,'/',1))::uuid, array['super_admin','administrador','sindico']::public.app_role[]))
    or (bucket_id in ('occurrence-attachments','resident-files') and private.has_condo_role((split_part(name,'/',1))::uuid, array['super_admin','administrador','sindico']::public.app_role[]))
  )
);

drop policy if exists storage_tenant_update on storage.objects;
create policy storage_tenant_update
on storage.objects
for update to authenticated
using (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and split_part(name,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and (
    (bucket_id = 'condominium-assets' and private.has_condo_role((split_part(name,'/',1))::uuid, array['super_admin','administrador','sindico']::public.app_role[]))
    or (bucket_id = 'documents' and private.has_condo_role((split_part(name,'/',1))::uuid, array['super_admin','administrador','sindico','sub_sindico','funcionario']::public.app_role[]))
    or (bucket_id = 'financial-documents' and private.has_condo_role((split_part(name,'/',1))::uuid, array['super_admin','administrador','sindico']::public.app_role[]))
    or (bucket_id in ('occurrence-attachments','resident-files') and private.has_condo_role((split_part(name,'/',1))::uuid, array['super_admin','administrador','sindico']::public.app_role[]))
  )
)
with check (
  bucket_id in ('condominium-assets','documents','occurrence-attachments','resident-files','financial-documents')
  and split_part(name,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and octet_length(name) <= 500
  and (
    (bucket_id = 'condominium-assets' and private.has_condo_role((split_part(name,'/',1))::uuid, array['super_admin','administrador','sindico']::public.app_role[]))
    or (bucket_id = 'documents' and private.has_condo_role((split_part(name,'/',1))::uuid, array['super_admin','administrador','sindico','sub_sindico','funcionario']::public.app_role[]))
    or (bucket_id = 'financial-documents' and private.has_condo_role((split_part(name,'/',1))::uuid, array['super_admin','administrador','sindico']::public.app_role[]))
    or (bucket_id in ('occurrence-attachments','resident-files') and private.has_condo_role((split_part(name,'/',1))::uuid, array['super_admin','administrador','sindico']::public.app_role[]))
  )
);
