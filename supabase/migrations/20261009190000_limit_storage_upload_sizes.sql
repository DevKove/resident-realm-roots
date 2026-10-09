-- Set explicit upload-size limits for every private application Storage bucket.
-- MIME allowlists are intentionally handled separately after confirming all supported upload flows.
update storage.buckets
set file_size_limit = case name
  when 'condominium-assets' then 5242880
  when 'documents' then 20971520
  when 'financial-documents' then 20971520
  when 'occurrence-attachments' then 10485760
  when 'resident-files' then 10485760
  else file_size_limit
end
where name in (
  'condominium-assets',
  'documents',
  'financial-documents',
  'occurrence-attachments',
  'resident-files'
);
