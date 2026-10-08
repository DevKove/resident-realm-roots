
create policy "docs storage read" on storage.objects for select to authenticated
  using (bucket_id = 'documentos' and public.is_member(((storage.foldername(name))[1])::uuid));
create policy "docs storage insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'documentos' and public.is_gestor(((storage.foldername(name))[1])::uuid));
create policy "docs storage delete" on storage.objects for delete to authenticated
  using (bucket_id = 'documentos' and public.is_gestor(((storage.foldername(name))[1])::uuid));
