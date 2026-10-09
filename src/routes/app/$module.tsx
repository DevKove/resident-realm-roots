import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import modeloUrl from "../../../IMG/modelo.png?url";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Car,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PawPrint,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import { getCondoContext, type CondoContext } from "@/lib/sindcoop-data";
import { canAccessModule, canCreateModule, canDeleteModule } from "@/lib/sindcoop-permissions";
import { supabase } from "@/integrations/supabase/client";
import { getDocumentStorageBucket } from "@/lib/sindcoop-document-storage";
import { validateCondoLogo, validateDocumentUpload } from "@/lib/sindcoop-upload-validation";

export const Route = createFileRoute("/app/$module")({ component: ModulePage });

type ModuleDefinition = {
  title: string;
  table: string;
  fields: string[];
  columns: string[];
};

const definitions: Record<string, ModuleDefinition> = {
  condominio: { title: "Meu Condomínio", table: "condominios", fields: ["nome", "cnpj", "endereco", "numero", "complemento", "bairro", "cep", "cidade", "estado", "telefone", "email", "quantidade_unidades", "blocos", "descricao"], columns: ["nome", "cnpj", "cidade", "estado", "email"] },
  unidades: { title: "Unidades", table: "unidades", fields: ["numero", "bloco", "andar", "tipo", "area", "fracao_ideal", "status", "observacoes"], columns: ["numero", "bloco", "andar", "tipo", "status"] },
  "areas-comuns": { title: "Áreas comuns", table: "areas_comuns", fields: ["nome", "descricao", "capacidade", "regras", "hora_inicio", "hora_fim", "intervalo_minutos", "antecedencia_minutos", "antecedencia_maxima_dias", "taxa", "ativo"], columns: ["nome", "capacidade", "taxa", "hora_inicio", "hora_fim", "ativo"] },
  moradores: { title: "Moradores", table: "moradores", fields: ["nome", "cpf", "email", "telefone", "data_nascimento", "tipo", "status"], columns: ["nome", "email", "telefone", "tipo", "status"] },
  funcionarios: { title: "Funcionários", table: "funcionarios", fields: ["nome", "cpf", "funcao", "telefone", "email", "data_admissao", "status", "observacoes"], columns: ["nome", "funcao", "telefone", "email", "status"] },
  veiculos: { title: "Veículos", table: "veiculos", fields: ["placa", "marca_modelo", "cor", "tipo", "vaga", "observacoes"], columns: ["placa", "marca_modelo", "cor", "tipo", "vaga"] },
  animais: { title: "Animais", table: "animais", fields: ["nome", "especie", "raca", "porte", "observacoes"], columns: ["nome", "especie", "raca", "porte"] },
  avisos: { title: "Avisos", table: "avisos", fields: ["titulo", "conteudo", "prioridade", "fixado"], columns: ["titulo", "prioridade", "publicado_em", "fixado"] },
  ocorrencias: { title: "Ocorrências", table: "ocorrencias", fields: ["titulo", "descricao", "categoria", "prioridade"], columns: ["titulo", "categoria", "prioridade", "status"] },
  reservas: { title: "Reservas", table: "reservas", fields: ["area_id", "inicio", "fim", "observacoes"], columns: ["inicio", "fim", "status", "observacoes"] },
  portaria: { title: "Portaria", table: "acessos_portaria", fields: ["pessoa", "tipo", "observacoes"], columns: ["pessoa", "tipo", "entrada", "saida"] },
  visitantes: { title: "Visitantes", table: "visitantes", fields: ["nome", "documento", "autorizado", "observacoes"], columns: ["nome", "documento", "autorizado", "entrada", "saida"] },
  entregas: { title: "Entregas", table: "entregas", fields: ["destinatario", "transportadora", "descricao"], columns: ["destinatario", "transportadora", "status", "recebido_em"] },
  documentos: { title: "Documentos", table: "documentos", fields: ["categoria", "titulo"], columns: ["categoria", "titulo", "mime_type", "tamanho_bytes", "created_at"] },
  financeiro: { title: "Financeiro", table: "despesas", fields: ["descricao", "fornecedor", "valor", "vencimento", "pagamento", "status", "observacoes"], columns: ["descricao", "fornecedor", "valor", "vencimento", "pagamento", "status"] },
  relatorios: { title: "Relatórios", table: "auditoria", fields: [], columns: ["acao", "recurso", "tabela", "created_at"] },
  configuracoes: { title: "Configurações", table: "configuracoes", fields: ["regras_reservas", "notificacoes", "financeiro"], columns: ["updated_at"] },
};

const sideModules = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["condominio", "Meu Condomínio", Building2],
  ["unidades", "Unidades", Home],
  ["areas-comuns", "Áreas comuns", CalendarDays],
  ["moradores", "Moradores", Users],
  ["funcionarios", "Funcionários", BriefcaseBusiness],
  ["veiculos", "Veículos", Car],
  ["animais", "Animais", PawPrint],
  ["avisos", "Avisos", Bell],
  ["ocorrencias", "Ocorrências", AlertTriangle],
  ["reservas", "Reservas", CalendarDays],
  ["portaria", "Portaria", ShieldCheck],
  ["visitantes", "Visitantes", UserRound],
  ["entregas", "Entregas", Package],
  ["documentos", "Documentos", FileText],
  ["financeiro", "Financeiro", WalletCards],
  ["relatorios", "Relatórios", ClipboardList],
  ["configuracoes", "Configurações", Settings],
] as const;

const label = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

const FIELD_MAX_LENGTHS: Record<string, number> = {
  "condominio.nome": 200, "condominio.cnpj": 18, "condominio.endereco": 250,
  "condominio.numero": 30, "condominio.complemento": 100, "condominio.bairro": 100,
  "condominio.cep": 9, "condominio.cidade": 100, "condominio.telefone": 20,
  "condominio.email": 254, "condominio.descricao": 5000,
  "unidades.numero": 30, "unidades.bloco": 50, "unidades.andar": 30,
  "unidades.tipo": 50, "unidades.observacoes": 1000,
  "moradores.nome": 150, "moradores.cpf": 14, "moradores.email": 254, "moradores.telefone": 20,
  "funcionarios.nome": 150, "funcionarios.cpf": 14, "funcionarios.funcao": 100,
  "funcionarios.telefone": 20, "funcionarios.email": 254, "funcionarios.observacoes": 1000,
  "veiculos.placa": 10, "veiculos.marca_modelo": 100, "veiculos.cor": 50,
  "veiculos.vaga": 50, "veiculos.observacoes": 1000,
  "animais.nome": 100, "animais.especie": 100, "animais.raca": 100,
  "animais.porte": 20, "animais.observacoes": 1000,
  "avisos.titulo": 200, "avisos.conteudo": 5000,
  "ocorrencias.titulo": 200, "ocorrencias.descricao": 5000, "ocorrencias.categoria": 100,
  "reservas.observacoes": 1000,
  "portaria.pessoa": 150, "portaria.tipo": 50, "portaria.observacoes": 1000,
  "visitantes.nome": 150, "visitantes.documento": 50, "visitantes.observacoes": 1000,
  "entregas.destinatario": 150, "entregas.transportadora": 150, "entregas.descricao": 1000,
  "documentos.categoria": 100, "documentos.titulo": 200,
  "financeiro.descricao": 300, "financeiro.fornecedor": 200, "financeiro.observacoes": 1000,
};

function fieldMaxLength(module: string, field: string): number | undefined {
  return FIELD_MAX_LENGTHS[`${module}.${field}`];
}

function fieldOptions(module: string, field: string): Array<[string, string]> | null {
  if (["ativo", "fixado", "autorizado"].includes(field)) return [["true", "Sim"], ["false", "Não"]];
  if (field === "prioridade") return [["low", "Baixa"], ["medium", "Média"], ["high", "Alta"], ["critical", "Crítica"]];
  if (field === "status") {
    if (module === "unidades") return [["occupied", "Ocupada"], ["empty", "Vazia"], ["rented", "Alugada"], ["maintenance", "Em manutenção"]];
    if (["moradores", "funcionarios"].includes(module)) return [["active", "Ativo"], ["inactive", "Inativo"], ["pending", "Pendente"]];
    if (module === "ocorrencias") return [["open", "Aberta"], ["analyzing", "Em análise"], ["in_progress", "Em andamento"], ["resolved", "Resolvida"], ["canceled", "Cancelada"]];
    if (module === "reservas") return [["pending", "Pendente"], ["approved", "Aprovada"], ["rejected", "Recusada"], ["canceled", "Cancelada"]];
    if (module === "entregas") return [["waiting_pickup", "Aguardando retirada"], ["delivered", "Entregue"], ["returned", "Devolvida"]];
    if (module === "financeiro") return [["pending", "Pendente"], ["paid", "Pago"], ["overdue", "Vencido"], ["canceled", "Cancelado"]];
  }
  if (field === "tipo") {
    if (module === "moradores") return [["owner", "Proprietário"], ["tenant", "Inquilino"], ["family", "Familiar"], ["other", "Outro"]];
    if (module === "portaria") return [["visitante", "Visitante"], ["prestador", "Prestador de serviço"], ["funcionario", "Funcionário"], ["morador", "Morador"], ["entrega", "Entrega"]];
    if (module === "veiculos") return [["carro", "Carro"], ["moto", "Moto"], ["bicicleta", "Bicicleta"], ["outro", "Outro"]];
  }
  if (field === "porte") return [["pequeno", "Pequeno"], ["medio", "Médio"], ["grande", "Grande"]];
  return null;
}

function ModulePage() {
  const { module } = Route.useParams();
  const navigate = useNavigate();
  const def = definitions[module] ?? { title: "Módulo", table: "", fields: [], columns: [] };
  const [ctx, setCtx] = useState<CondoContext | null>(null);
  const [contextReady, setContextReady] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [mobile, setMobile] = useState(false);

  const load = async () => {
    if (!contextReady) return;
    if (!def.table) {
      setRows([]);
      setError("Módulo não encontrado.");
      setBusy(false);
      return;
    }
    if (!ctx) {
      setBusy(false);
      return;
    }
    if (!canAccessModule(ctx.role, module)) {
      setRows([]);
      setError("Seu perfil não possui permissão para acessar este módulo.");
      setBusy(false);
      return;
    }

    setBusy(true);
    setError("");
    try {
      const db = supabase as any;
      if (def.table === "reservas") {
        const { data: areaData, error: areaError } = await db
          .from("areas_comuns")
          .select("id,nome")
          .eq("condominio_id", ctx.id)
          .order("nome", { ascending: true });
        if (areaError) throw areaError;
        setAreas(areaData ?? []);
      }

      const selectedFields = def.table === "condominios"
        ? Array.from(new Set(["id", ...def.columns, "logo_path"]))
        : Array.from(new Set(["id", "condominio_id", ...def.columns]));
      let request = db.from(def.table).select(selectedFields.join(","));
      if (def.table === "condominios") {
        request = request.eq("id", ctx.id).limit(1);
      } else {
        request = request.eq("condominio_id", ctx.id);
        const orderColumn = def.table === "configuracoes" ? "updated_at" : def.table === "ocorrencias" ? "criado_em" : def.table === "acessos_portaria" ? "entrada" : def.table === "entregas" ? "recebido_em" : "created_at";
        request = request.order(orderColumn, { ascending: false }).limit(100);
      }

      const { data, error: loadError } = await request;
      if (loadError) throw loadError;
      const loadedRows = data ?? [];
      setRows(loadedRows);
      if (def.table === "condominios" && loadedRows[0]?.logo_path) {
        const { data: signedLogo } = await db.storage.from("condominium-assets").createSignedUrl(loadedRows[0].logo_path, 3600);
        setLogoUrl(signedLogo?.signedUrl ?? "");
      } else if (def.table === "condominios") {
        setLogoUrl("");
      }
    } catch (loadError) {
      const message = loadError && typeof loadError === "object" && "message" in loadError
        ? String(loadError.message)
        : loadError instanceof Error ? loadError.message : "";
      console.error(`[SindCoop] Falha ao carregar módulo "${module}":`, loadError);
      setError(message && !message.toLowerCase().includes("does not exist")
        ? `Não foi possível carregar os dados. ${message}`
        : "Não foi possível carregar os dados. Verifique a configuração do módulo e tente novamente.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void (async () => {
      try {
        const context = await getCondoContext();
        setCtx(context);
        if (!context) setError("Nenhum condomínio vinculado a esta conta.");
      } catch {
        setError("Sessão inválida. Entre novamente para continuar.");
      } finally {
        setContextReady(true);
        setBusy(false);
      }
    })();
  }, []);

  useEffect(() => {
    void load();
  }, [ctx, module, contextReady]);

  const filtered = useMemo(
    () => rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase())),
    [rows, query],
  );

  async function editRow(row: any) {
    const canEditModule = module === "condominio"
      ? ["super_admin", "administrador", "sindico"].includes(ctx?.role ?? "")
      : module === "configuracoes"
        ? ["super_admin", "administrador"].includes(ctx?.role ?? "")
        : canCreateModule(ctx?.role ?? "", module);
    if (!ctx || !def.fields.length || !canEditModule) return;
    setError("");
    try {
      const db = supabase as any;
      const selectedFields = Array.from(new Set([
        "id",
        ...(def.table === "condominios" ? [] : ["condominio_id"]),
        ...def.fields,
      ]));
      let request = db.from(def.table).select(selectedFields.join(",")).eq("id", row.id);
      if (def.table === "condominios") request = request.eq("id", ctx.id);
      else request = request.eq("condominio_id", ctx.id);
      const { data, error: editError } = await request.single();
      if (editError || !data) throw editError ?? new Error("Registro não encontrado.");
      setEditingId(def.table === "condominios" || module === "configuracoes" ? null : row.id);
      setForm(Object.fromEntries(def.fields.map((field) => [
        field,
        data[field] == null ? "" : module === "configuracoes"
          ? JSON.stringify(data[field], null, 2)
          : String(data[field]),
      ])));
      setLogoFile(null);
      setDocumentFile(null);
      setOpen(true);
    } catch {
      setError("Não foi possível carregar os dados para edição.");
    }
  }

  async function save() {
    const isCondoProfile = module === "condominio";
    const isSettings = module === "configuracoes";
    const isDocuments = module === "documentos";
    const canManageProfile = ["super_admin", "administrador", "sindico"].includes(ctx?.role ?? "");
    const canManageSettings = ["super_admin", "administrador"].includes(ctx?.role ?? "");
    const canManageDocuments = ["super_admin", "administrador", "sindico", "sub_sindico", "funcionario"].includes(ctx?.role ?? "");
    if (!ctx || (!def.fields.length && !isCondoProfile) || (isCondoProfile ? !canManageProfile : isSettings ? !canManageSettings : isDocuments ? !canManageDocuments : !canCreateModule(ctx.role, module))) return;
    if (module === "reservas" && areas.length === 0) {
      setError("Cadastre uma área comum antes de solicitar uma reserva.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const db = supabase as any;
      const { data: userData, error: userError } = await db.auth.getUser();
      if (userError) throw userError;
      const userId = userData.user?.id;
      if (!userId) throw new Error("Sessão expirada. Entre novamente.");

      const payload: Record<string, any> = isCondoProfile ? {} : { condominio_id: ctx.id };
      for (const field of def.fields) {
        const rawValue = form[field];
        if (rawValue === undefined || rawValue.trim() === "") continue;
        if (["inicio", "fim"].includes(field)) payload[field] = new Date(rawValue).toISOString();
        else if (["quantidade_unidades", "blocos", "capacidade", "intervalo_minutos", "antecedencia_minutos", "antecedencia_maxima_dias"].includes(field)) payload[field] = Number(rawValue);
        else if (["area", "fracao_ideal", "taxa", "valor"].includes(field)) payload[field] = Number(rawValue);
        else if (["ativo", "fixado", "autorizado"].includes(field)) payload[field] = rawValue === "true";
        else if (isSettings && ["regras_reservas", "notificacoes", "financeiro"].includes(field)) {
          try { payload[field] = JSON.parse(rawValue); }
          catch { throw new Error("O campo " + label(field) + " precisa conter um JSON válido."); }
        } else payload[field] = rawValue.trim();
      }

      if (isCondoProfile && logoFile) {
        const validationError = validateCondoLogo(logoFile);
        if (validationError) throw new Error(validationError);
        const safeName = logoFile.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-");
        const storagePath = ctx.id + "/logo-" + Date.now() + "-" + safeName;
        const { error: uploadError } = await db.storage.from("condominium-assets").upload(storagePath, logoFile, { upsert: true, contentType: logoFile.type });
        if (uploadError) throw uploadError;
        payload.logo_path = storagePath;
      }

      if (isDocuments) {
        if (!editingId && !documentFile) throw new Error("Selecione um arquivo para anexar ao documento.");
        if (documentFile) {
          const validationError = validateDocumentUpload(documentFile);
          if (validationError) throw new Error(validationError);
          const safeName = documentFile.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-");
          const storageBucket = getDocumentStorageBucket(String(payload.categoria ?? form.categoria ?? ""));
          const storagePath = ctx.id + "/documentos/" + Date.now() + "-" + safeName;
          const { error: uploadError } = await db.storage.from(storageBucket).upload(storagePath, documentFile, { upsert: false, contentType: documentFile.type });
          if (uploadError) throw uploadError;
          payload.storage_path = storagePath;
          payload.mime_type = documentFile.type || "application/octet-stream";
          payload.tamanho_bytes = documentFile.size;
        }
        payload.autor_id = userId;
      }
      if (def.table === "avisos") {
        payload.autor_id = userId;
        payload.conteudo = payload.conteudo || payload.titulo || "";
      }
      if (def.table === "ocorrencias") {
        if (!editingId) {
          payload.autor_id = userId;
          payload.status = "open";
        }
      }
      if (def.table === "reservas" && !editingId) {
        payload.solicitante_id = userId;
        payload.status = "pending";
      }
      if (def.table === "acessos_portaria" && !editingId) {
        payload.operador_id = userId;
        payload.entrada = new Date().toISOString();
      }
      if (def.table === "entregas" && !editingId) {
        payload.responsavel_id = userId;
        payload.recebido_em = new Date().toISOString();
        payload.status = "waiting_pickup";
      }

      if (isCondoProfile) {
        const { error: saveError } = await db.from("condominios").update(payload).eq("id", ctx.id);
        if (saveError) throw saveError;
      } else if (isSettings) {
        const { error: saveError } = await db.from("configuracoes").upsert({ condominio_id: ctx.id, ...payload }, { onConflict: "condominio_id" });
        if (saveError) throw saveError;
      } else if (editingId) {
        const { error: saveError } = await db.from(def.table).update(payload).eq("id", editingId).eq("condominio_id", ctx.id);
        if (saveError) throw saveError;
      } else {
        const { error: saveError } = await db.from(def.table).insert(payload);
        if (saveError) throw saveError;
      }
      setForm({});
      setEditingId(null);
      setLogoFile(null);
      setDocumentFile(null);
      setOpen(false);
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Não foi possível salvar o registro.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!ctx || !canDeleteModule(ctx.role, module)) return;
    if (!confirm("Excluir este registro? Esta ação não pode ser desfeita.")) return;
    const { error: deleteError } = await (supabase as any)
      .from(def.table)
      .delete()
      .eq("id", id)
      .eq(def.table === "condominios" ? "id" : "condominio_id", ctx.id);
    if (deleteError) setError(deleteError.message);
    else await load();
  }

  async function logout() {
    const { signOut } = await import("@/lib/sindcoop-data");
    await signOut();
    await navigate({ to: "/" });
  }

  const activeSidebar = module;

  return (
    <div className="sindcoop-shell">
      {mobile && <button aria-label="Fechar menu" onClick={() => setMobile(false)} className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" />}

      <aside className={`sindcoop-sidebar ${mobile ? "is-open" : ""}`}>
        <div className="sindcoop-brand flex min-h-24 items-center gap-3 border-b px-5">
          <span className="sindcoop-brand-mark">
            <img src={modeloUrl} alt="Identidade visual SindCoop" />
          </span>
          <div className="min-w-0">
            <span className="sindcoop-brand-name block truncate">SindCoop</span>
            <span className="sindcoop-brand-caption block uppercase">Gestão condominial</span>
          </div>
        </div>

        <div className="border-b p-4">
          <div className="rounded-xl bg-slate-100 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Condomínio ativo</p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-900">{ctx?.nome ?? "Carregando..."}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {sideModules.filter(([key]) => key === "dashboard" || (ctx ? canAccessModule(ctx.role, key) : false)).map(([key, labelText, Icon]) => {
            const isActive = key === activeSidebar;
            const destination = key === "dashboard" ? "/dashboard" : `/app/${key}`;

            return (
              <Link
                key={key}
                to={destination}
                className={`sindcoop-nav-item mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 ${isActive ? "bg-slate-100 text-slate-900 shadow-sm" : "hover:bg-slate-100"}`}
              >
                <Icon className="h-4 w-4" />
                <span>{labelText}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3">
          <button
            onClick={logout}
            className="sindcoop-nav-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      <main className="sindcoop-main">
        <header className="sticky top-0 z-20 flex h-20 items-center border-b bg-white/95 px-4 backdrop-blur sm:px-6">
          <button className="sindcoop-icon-button lg:hidden rounded-xl border bg-white p-2.5" onClick={() => setMobile(true)} aria-label="Abrir menu">
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="sindcoop-icon-button rounded-xl border bg-white p-2.5">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">SindCoop / Operação</p>
                <h1 className="text-xl font-bold text-slate-900">{def.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {ctx && (module === "condominio" ? ["super_admin", "administrador", "sindico"].includes(ctx.role) : module === "configuracoes" ? ["super_admin", "administrador"].includes(ctx.role) : module === "documentos" ? ["super_admin", "administrador", "sindico", "sub_sindico", "funcionario"].includes(ctx.role) : canCreateModule(ctx.role, module)) && (def.fields.length > 0 || module === "condominio") && (
                <button
                  onClick={() => {
                    if ((module === "condominio" || module === "configuracoes") && rows[0]) {
                      void editRow(rows[0]);
                      return;
                    }
                    setEditingId(null);
                    setLogoFile(null);
                    setDocumentFile(null);
                    setForm({});
                    setOpen(true);
                  }}
                  className="sindcoop-icon-button inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5 text-sm font-semibold text-white sm:px-4"
                >
                  <Plus className="h-4 w-4" />
                  {module === "condominio" ? "Editar cadastro" : module === "configuracoes" ? "Editar preferências" : "Novo registro"}
                </button>
              )}
              <button
                onClick={() => void load()}
                className="sindcoop-icon-button rounded-xl border bg-white p-2.5"
                aria-label="Atualizar"
              >
                <RefreshCw className={`h-4 w-4 ${busy ? "sindcoop-spin" : ""}`} />
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <div className="sindcoop-fade-in mt-6 flex items-center gap-3 rounded-2xl border bg-white p-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar neste módulo…"
              className="w-full bg-transparent text-sm outline-none"
              aria-label="Buscar neste módulo"
            />
          </div>

          {error && (
            <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {module === "condominio" && rows[0] && (
            <section className="mt-5 overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="bg-gradient-to-r from-slate-950 to-slate-700 p-6 text-white sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10">
                    {logoUrl ? <img src={logoUrl} alt="Logotipo do condomínio" className="h-full w-full object-cover" /> : <Building2 className="h-10 w-10 text-white/80" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Perfil do condomínio</p>
                    <h2 className="mt-2 text-2xl font-bold">{rows[0].nome}</h2>
                    <p className="mt-1 text-sm text-slate-300">{[rows[0].endereco, rows[0].numero, rows[0].bairro, rows[0].cidade, rows[0].estado].filter(Boolean).join(", ") || "Endereço ainda não informado"}</p>
                  </div>
                  <div className="rounded-xl bg-white/10 px-4 py-3"><p className="text-xs text-slate-300">Unidades</p><p className="mt-1 text-2xl font-bold">{rows[0].quantidade_unidades ?? 0}</p></div>
                </div>
              </div>
              <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
                {[["CNPJ", rows[0].cnpj], ["Telefone", rows[0].telefone], ["E-mail", rows[0].email], ["CEP", rows[0].cep], ["Blocos", rows[0].blocos], ["Complemento", rows[0].complemento], ["Descrição", rows[0].descricao]].map(([title, value]) => (
                  <div key={title} className="border-b p-5 sm:border-r"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p><p className="mt-2 break-words text-sm font-medium text-slate-800">{value || "Não informado"}</p></div>
                ))}
              </div>
            </section>
          )}
          {module !== "condominio" && !busy && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Registros totais", value: rows.length },
                { label: "Resultados da busca", value: filtered.length },
                { label: "Ativos / em andamento", value: rows.filter((row) => ["active", "open", "analyzing", "in_progress", "pending", "waiting_pickup", "approved"].includes(String(row.status ?? "").toLowerCase())).length },
                { label: "Último registro", value: rows[0]?.updated_at ? new Date(rows[0].updated_at).toLocaleDateString("pt-BR") : rows[0]?.created_at ? new Date(rows[0].created_at).toLocaleDateString("pt-BR") : "—" },
              ].map((item) => <div key={item.label} className="rounded-2xl border bg-white p-4 shadow-sm"><p className="text-xs font-medium text-slate-500">{item.label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p></div>)}
            </div>
          )}
          {module !== "condominio" && <section className="sindcoop-fade-in mt-5 overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              {busy ? (
                <div className="p-10 text-center text-sm text-slate-500">
                  <span className="sindcoop-skeleton mx-auto block h-3 w-36 rounded-full" />
                  <span className="mt-3 block">Carregando…</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center">
                  <ShieldCheck className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-3 font-semibold">Nenhum registro encontrado</p>
                  <p className="mt-1 text-sm text-slate-500">Os dados exibidos são exclusivamente do condomínio autorizado.</p>
                </div>
              ) : (
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {def.columns.map((column) => (
                        <th key={column} className="px-4 py-3 font-semibold">{label(column)}</th>
                      ))}
                      {ctx && (canDeleteModule(ctx.role, module) || canCreateModule(ctx.role, module)) && <th className="px-4 py-3 text-right" aria-label="Ações">Ações</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => (
                      <tr key={row.id} className="border-t">
                        {def.columns.map((column) => (
                          <td key={column} className="px-4 py-3">
                            {typeof row[column] === "boolean" ? (row[column] ? "Sim" : "Não") : row[column] ?? "—"}
                          </td>
                        ))}
                        {ctx && (canDeleteModule(ctx.role, module) || canCreateModule(ctx.role, module)) && (
                          <td className="space-x-3 whitespace-nowrap px-4 py-3 text-right">
                            {canCreateModule(ctx.role, module) && def.fields.length > 0 && <button onClick={() => void editRow(row)} className="text-xs font-semibold text-slate-700 hover:underline">Editar</button>}
                            {canDeleteModule(ctx.role, module) && <button onClick={() => void remove(row.id)} className="text-xs font-semibold text-red-600 hover:underline">Excluir</button>}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>}

          {module === "condominio" && !busy && !rows[0] && (
            <section className="mt-5 rounded-2xl border border-dashed bg-white p-8 text-center shadow-sm">
              <Building2 className="mx-auto h-10 w-10 text-slate-400" />
              <h2 className="mt-3 text-lg font-bold text-slate-900">Complete o cadastro do condomínio</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">Adicione endereço, CNPJ, contatos, quantidade de unidades e a identificação visual para deixar o perfil completo.</p>
              {ctx && ["super_admin", "administrador", "sindico"].includes(ctx.role) && (
                <button onClick={() => { setEditingId(null); setLogoFile(null); setForm(Object.fromEntries(def.fields.map((field) => [field, ""]))); setOpen(true); }} className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Cadastrar dados do condomínio</button>
              )}
            </section>
          )}

          {open && (
            <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 sindcoop-fade-in">
              <form
                onSubmit={(event) => { event.preventDefault(); void save(); }}
                className="sindcoop-modal-enter w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
              >
                <h2 className="text-xl font-bold">{module === "condominio" ? "Editar cadastro do condomínio" : editingId ? `Editar registro — ${def.title}` : `Novo registro — ${def.title}`}</h2>
                {module === "condominio" && <p className="mt-2 text-sm text-slate-500">Atualize os dados cadastrais, contatos e a identificação visual do condomínio.</p>}
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {def.fields.map((field) => (
                    <label key={field} className="grid gap-2 text-sm font-medium">
                      {label(field)}
                      {field === "area_id" ? (
                        <select required value={form[field] ?? ""} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="rounded-xl border px-3 py-2.5">
                          <option value="">Selecione uma área comum</option>
                          {areas.map((area) => <option key={area.id} value={area.id}>{area.nome}</option>)}
                        </select>
                      ) : fieldOptions(module, field) ? (
                        <select value={form[field] ?? ""} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="rounded-xl border px-3 py-2.5">
                          <option value="">Selecione...</option>
                          {fieldOptions(module, field)!.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
                        </select>
                      ) : ["conteudo", "descricao", "observacoes", "regras", "regras_reservas", "notificacoes", "financeiro"].includes(field) ? (
                        <textarea rows={["regras_reservas", "notificacoes", "financeiro"].includes(field) ? 7 : 3} maxLength={fieldMaxLength(module, field)} value={form[field] ?? ""} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="rounded-xl border px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-200" />
                      ) : (
                        <input
                          required={[
                            "nome",
                            "numero",
                            "titulo",
                            "descricao",
                            "categoria",
                            "pessoa",
                            "tipo",
                            "destinatario",
                            "area_id",
                            "inicio",
                            "fim",
                            "valor",
                          ].includes(field)}
                          type={field === "inicio" || field === "fim" ? "datetime-local" : ["data_nascimento", "data_admissao", "vencimento", "pagamento"].includes(field) ? "date" : ["valor", "taxa", "capacidade", "area", "fracao_ideal", "quantidade_unidades", "blocos", "intervalo_minutos", "antecedencia_minutos", "antecedencia_maxima_dias"].includes(field) ? "number" : field.includes("email") ? "email" : "text"}
                          step={field === "capacidade" ? "1" : ["valor", "taxa", "area", "fracao_ideal"].includes(field) ? "0.01" : undefined}
                          min={["blocos", "capacidade"].includes(field) ? "1" : ["valor", "taxa", "area", "fracao_ideal", "quantidade_unidades", "intervalo_minutos", "antecedencia_minutos", "antecedencia_maxima_dias"].includes(field) ? "0" : undefined}
                          maxLength={fieldMaxLength(module, field)}
                          value={form[field] ?? ""}
                          onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                          className="rounded-xl border px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-200"
                        />
                      )}
                    </label>
                  ))}
                </div>
                {module === "configuracoes" && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">Edite as regras de reservas, notificações e parâmetros financeiros em JSON válido. Exemplo: {"{\"ativado\": true}"}.</p>}
                {module === "documentos" && (
                  <div className="mt-4 grid gap-2 text-sm font-medium">
                    Arquivo para anexar
                    <input type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.csv,.doc,.docx,.xls,.xlsx" onChange={(event) => setDocumentFile(event.target.files?.[0] ?? null)} className="rounded-xl border p-3" />
                    <span className="text-xs font-normal text-slate-500">O arquivo será armazenado de forma privada e vinculado ao condomínio ativo. Para arquivos financeiros, use uma categoria como “Financeiro”, “Prestação de contas”, “Comprovante”, “Boleto” ou “Nota fiscal”; esses arquivos ficam em um espaço restrito à gestão.</span>
                  </div>
                )}
                {module === "condominio" && (
                  <div className="mt-4 grid gap-2 text-sm font-medium">
                    Logotipo / foto do condomínio
                    {logoUrl && <img src={logoUrl} alt="Prévia do logotipo atual" className="h-24 w-24 rounded-xl border object-cover" />}
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)} className="rounded-xl border p-3" />
                    <span className="text-xs font-normal text-slate-500">Formatos: PNG, JPG ou WEBP. O arquivo será armazenado no espaço privado do condomínio.</span>
                  </div>
                )}
                {module === "reservas" && areas.length === 0 && (
                  <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                    Nenhuma área comum cadastrada. Cadastre uma área antes de criar reservas.
                  </p>
                )}
                <div className="mt-6 flex justify-end gap-2">
                  <button type="button" onClick={() => setOpen(false)} className="rounded-xl border px-4 py-2.5 font-semibold">
                    Cancelar
                  </button>
                  <button disabled={saving} className="rounded-xl bg-slate-950 px-4 py-2.5 font-semibold text-white disabled:opacity-60">
                    {saving ? "Salvando…" : module === "condominio" || module === "configuracoes" || editingId ? "Salvar alterações" : "Salvar registro"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export { label };

export default ModulePage;
