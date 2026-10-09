-- Enforce input length limits at the database boundary (not only in the UI).
alter table public.profiles drop constraint if exists profiles_full_name_length;
alter table public.profiles add constraint profiles_full_name_length check (char_length(full_name) <= 150);
alter table public.profiles drop constraint if exists profiles_cpf_length;
alter table public.profiles add constraint profiles_cpf_length check (cpf is null or char_length(cpf) <= 14);
alter table public.profiles drop constraint if exists profiles_phone_length;
alter table public.profiles add constraint profiles_phone_length check (phone is null or char_length(phone) <= 20);

alter table public.condominios drop constraint if exists condominios_nome_length;
alter table public.condominios add constraint condominios_nome_length check (char_length(nome) <= 200);
alter table public.condominios drop constraint if exists condominios_descricao_length;
alter table public.condominios add constraint condominios_descricao_length check (descricao is null or char_length(descricao) <= 5000);

alter table public.unidades drop constraint if exists unidades_numero_length;
alter table public.unidades add constraint unidades_numero_length check (char_length(numero) <= 30);
alter table public.unidades drop constraint if exists unidades_observacoes_length;
alter table public.unidades add constraint unidades_observacoes_length check (observacoes is null or char_length(observacoes) <= 1000);

alter table public.moradores drop constraint if exists moradores_nome_length;
alter table public.moradores add constraint moradores_nome_length check (char_length(nome) <= 150);
alter table public.moradores drop constraint if exists moradores_cpf_length;
alter table public.moradores add constraint moradores_cpf_length check (cpf is null or char_length(cpf) <= 14);
alter table public.moradores drop constraint if exists moradores_email_length;
alter table public.moradores add constraint moradores_email_length check (email is null or char_length(email) <= 254);
alter table public.moradores drop constraint if exists moradores_telefone_length;
alter table public.moradores add constraint moradores_telefone_length check (telefone is null or char_length(telefone) <= 20);

alter table public.funcionarios drop constraint if exists funcionarios_nome_length;
alter table public.funcionarios add constraint funcionarios_nome_length check (char_length(nome) <= 150);
alter table public.funcionarios drop constraint if exists funcionarios_cpf_length;
alter table public.funcionarios add constraint funcionarios_cpf_length check (cpf is null or char_length(cpf) <= 14);
alter table public.funcionarios drop constraint if exists funcionarios_email_length;
alter table public.funcionarios add constraint funcionarios_email_length check (email is null or char_length(email) <= 254);
alter table public.funcionarios drop constraint if exists funcionarios_telefone_length;
alter table public.funcionarios add constraint funcionarios_telefone_length check (telefone is null or char_length(telefone) <= 20);
alter table public.funcionarios drop constraint if exists funcionarios_funcao_length;
alter table public.funcionarios add constraint funcionarios_funcao_length check (funcao is null or char_length(funcao) <= 100);
alter table public.funcionarios drop constraint if exists funcionarios_observacoes_length;
alter table public.funcionarios add constraint funcionarios_observacoes_length check (observacoes is null or char_length(observacoes) <= 1000);

alter table public.veiculos drop constraint if exists veiculos_placa_length;
alter table public.veiculos add constraint veiculos_placa_length check (char_length(placa) <= 10);
alter table public.veiculos drop constraint if exists veiculos_marca_modelo_length;
alter table public.veiculos add constraint veiculos_marca_modelo_length check (marca_modelo is null or char_length(marca_modelo) <= 100);
alter table public.veiculos drop constraint if exists veiculos_cor_length;
alter table public.veiculos add constraint veiculos_cor_length check (cor is null or char_length(cor) <= 50);
alter table public.veiculos drop constraint if exists veiculos_vaga_length;
alter table public.veiculos add constraint veiculos_vaga_length check (vaga is null or char_length(vaga) <= 50);
alter table public.veiculos drop constraint if exists veiculos_observacoes_length;
alter table public.veiculos add constraint veiculos_observacoes_length check (observacoes is null or char_length(observacoes) <= 1000);

alter table public.animais drop constraint if exists animais_nome_length;
alter table public.animais add constraint animais_nome_length check (char_length(nome) <= 100);
alter table public.animais drop constraint if exists animais_especie_length;
alter table public.animais add constraint animais_especie_length check (char_length(especie) <= 100);
alter table public.animais drop constraint if exists animais_raca_length;
alter table public.animais add constraint animais_raca_length check (raca is null or char_length(raca) <= 100);
alter table public.animais drop constraint if exists animais_observacoes_length;
alter table public.animais add constraint animais_observacoes_length check (observacoes is null or char_length(observacoes) <= 1000);

alter table public.avisos drop constraint if exists avisos_titulo_length;
alter table public.avisos add constraint avisos_titulo_length check (char_length(titulo) <= 200);
alter table public.avisos drop constraint if exists avisos_conteudo_length;
alter table public.avisos add constraint avisos_conteudo_length check (char_length(conteudo) <= 5000);

alter table public.ocorrencias drop constraint if exists ocorrencias_titulo_length;
alter table public.ocorrencias add constraint ocorrencias_titulo_length check (char_length(titulo) <= 200);
alter table public.ocorrencias drop constraint if exists ocorrencias_descricao_length;
alter table public.ocorrencias add constraint ocorrencias_descricao_length check (char_length(descricao) <= 5000);
alter table public.ocorrencias drop constraint if exists ocorrencias_categoria_length;
alter table public.ocorrencias add constraint ocorrencias_categoria_length check (char_length(categoria) <= 100);

alter table public.reservas drop constraint if exists reservas_observacoes_length;
alter table public.reservas add constraint reservas_observacoes_length check (observacoes is null or char_length(observacoes) <= 1000);

alter table public.visitantes drop constraint if exists visitantes_nome_length;
alter table public.visitantes add constraint visitantes_nome_length check (char_length(nome) <= 150);
alter table public.visitantes drop constraint if exists visitantes_documento_length;
alter table public.visitantes add constraint visitantes_documento_length check (documento is null or char_length(documento) <= 50);
alter table public.visitantes drop constraint if exists visitantes_observacoes_length;
alter table public.visitantes add constraint visitantes_observacoes_length check (observacoes is null or char_length(observacoes) <= 1000);

alter table public.entregas drop constraint if exists entregas_destinatario_length;
alter table public.entregas add constraint entregas_destinatario_length check (char_length(destinatario) <= 150);
alter table public.entregas drop constraint if exists entregas_transportadora_length;
alter table public.entregas add constraint entregas_transportadora_length check (transportadora is null or char_length(transportadora) <= 150);
alter table public.entregas drop constraint if exists entregas_descricao_length;
alter table public.entregas add constraint entregas_descricao_length check (descricao is null or char_length(descricao) <= 1000);

alter table public.documentos drop constraint if exists documentos_titulo_length;
alter table public.documentos add constraint documentos_titulo_length check (char_length(titulo) <= 200);
alter table public.documentos drop constraint if exists documentos_categoria_length;
alter table public.documentos add constraint documentos_categoria_length check (char_length(categoria) <= 100);
alter table public.documentos drop constraint if exists documentos_mime_type_length;
alter table public.documentos add constraint documentos_mime_type_length check (mime_type is null or char_length(mime_type) <= 150);
alter table public.documentos drop constraint if exists documentos_storage_path_length;
alter table public.documentos add constraint documentos_storage_path_length check (storage_path is null or char_length(storage_path) <= 500);
alter table public.documentos drop constraint if exists documentos_size_limit;
alter table public.documentos add constraint documentos_size_limit check (tamanho_bytes >= 0 and tamanho_bytes <= 20971520);

alter table public.despesas drop constraint if exists despesas_descricao_length;
alter table public.despesas add constraint despesas_descricao_length check (char_length(descricao) <= 300);
alter table public.despesas drop constraint if exists despesas_fornecedor_length;
alter table public.despesas add constraint despesas_fornecedor_length check (fornecedor is null or char_length(fornecedor) <= 200);
alter table public.despesas drop constraint if exists despesas_observacoes_length;
alter table public.despesas add constraint despesas_observacoes_length check (observacoes is null or char_length(observacoes) <= 1000);
