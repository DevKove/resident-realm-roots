-- Enforce server-side MIME allowlists in Supabase Storage.
-- SVG is deliberately excluded from logos to reduce active-content risk.
update storage.buckets
set allowed_mime_types = array['image/png','image/jpeg','image/webp']::text[]
where name = 'condominium-assets';

update storage.buckets
set allowed_mime_types = array[
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'text/plain',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]::text[]
where name in ('documents','financial-documents','occurrence-attachments','resident-files');
