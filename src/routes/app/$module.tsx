import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { getCondoContext, type CondoContext } from "@/lib/sindcoop-data";
import { canAccessModule, canCreateModule, canDeleteModule } from "@/lib/sindcoop-permissions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/$module")({ component: ModulePage });

type ModuleDefinition = {
  title: string;
  table: string;
  fields: string[];
  columns: string[];
};

const definitions: Record<string, ModuleDefinition> = {
  condominio: { title: "Meu Condomínio", table: "condominios", fields: [], columns: ["nome", "cidade", "estado", "email"] },
  unidades: { title: "Unidades", table: "unidades", fields: ["numero", "bloco", "andar", "tipo", "status"], columns: ["numero", "bloco", "andar", "status"] },
  moradores: { title: "Moradores", table: "moradores", fields: ["nome", "cpf", "email", "telefone", "tipo", "status"], columns: ["nome", "email", "telefone", "tipo", "status"] },
  funcionarios: { title: "Funcionários", table: "funcionarios", fields: ["nome", "cpf", "funcao", "telefone", "email", "status"], columns: ["nome", "funcao", "telefone", "status"] },
  veiculos: { title: "Veículos", table: "veiculos", fields: ["placa", "marca_modelo", "cor", "tipo", "vaga"], columns: ["placa", "marca_modelo", "cor", "tipo", "vaga"] },
  animais: { title: "Animais", table: "animais", fields: ["nome", "especie", "raca", "porte"], columns: ["nome", "especie", "raca", "porte"] },
  avisos: { title: "Avisos", table: "avisos", fields: ["titulo", "conteudo", "prioridade"], columns: ["titulo", "prioridade", "publicado_em"] },
  ocorrencias: { title: "Ocorrências", table: "ocorrencias", fields: ["titulo", "descricao", "categoria", "prioridade"], columns: ["titulo", "categoria", "prioridade", "status"] },
  reservas: { title: "Reservas", table: "reservas", fields: ["area_id", "inicio", "fim", "observacoes"], columns: ["inicio", "fim", "status", "observacoes"] },
  portaria: { title: "Portaria", table: "acessos_portaria", fields: ["pessoa", "tipo", "observacoes"], columns: ["pessoa", "tipo", "entrada", "saida"] },
  visitantes: { title: "Visitantes", table: "visitantes", fields: ["nome", "documento", "autorizado", "observacoes"], columns: ["nome", "documento", "autorizado", "entrada", "saida"] },
  entregas: { title: "Entregas", table: "entregas", fields: ["destinatario", "transportadora", "descricao"], columns: ["destinatario", "transportadora", "status", "recebido_em"] },
  documentos: { title: "Documentos", table: "documentos", fields: [], columns: ["categoria", "titulo", "mime_type", "created_at"] },
  financeiro: { title: "Financeiro", table: "despesas", fields: ["descricao", "fornecedor", "valor", "vencimento", "status"], columns: ["descricao", "fornecedor", "valor", "vencimento", "status"] },
  relatorios: { title: "Relatórios", table: "auditoria", fields: [], columns: ["acao", "recurso", "tabela", "created_at"] },
  configuracoes: { title: "Configurações", table: "configuracoes", fields: [], columns: ["updated_at"] },
};

const label = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

function ModulePage() {
  const { module } = Route.useParams();
  const def = definitions[module] ?? { title: "Módulo", table: "", fields: [], columns: [] };
  const [ctx, setCtx] = useState<CondoContext | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const load = async () => {
    if (!ctx || !def.table) return;
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

      let request = db.from(def.table).select("*");
      if (def.table === "condominios") {
        request = request.eq("id", ctx.id).limit(1);
      } else {
        request = request.eq("condominio_id", ctx.id);
        request = request.order(def.table === "configuracoes" ? "updated_at" : "created_at", { ascending: false }).limit(100);
      }

      const { data, error: loadError } = await request;
      if (loadError) throw loadError;
      setRows(data ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar os dados.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void (async () => {
      try {
        setCtx(await getCondoContext());
      } catch {
        setError("Sessão inválida. Entre novamente para continuar.");
        setBusy(false);
      }
    })();
  }, []);

  useEffect(() => {
    void load();
  }, [ctx, module]);

  const filtered = useMemo(
    () => rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase())),
    [rows, query],
  );

  async function save() {
    if (!ctx || !def.fields.length || !canCreateModule(ctx.role, module)) return;
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

      const payload: Record<string, any> = { condominio_id: ctx.id };
      for (const field of def.fields) {
        const value = form[field]?.trim();
        if (!value) continue;
        payload[field] = field === "inicio" || field === "fim" ? new Date(value).toISOString() : value;
      }

      if (def.table === "avisos") {
        payload.autor_id = userId;
        payload.conteudo = payload.conteudo || payload.titulo || "";
      }
      if (def.table === "ocorrencias") {
        payload.autor_id = userId;
        payload.status = "open";
      }
      if (def.table === "reservas") {
        payload.solicitante_id = userId;
        payload.status = "pending";
      }
      if (def.table === "acessos_portaria") {
        payload.operador_id = userId;
        payload.entrada = new Date().toISOString();
      }
      if (def.table === "entregas") {
        payload.responsavel_id = userId;
        payload.recebido_em = new Date().toISOString();
        payload.status = "waiting_pickup";
      }

      const { error: saveError } = await db.from(def.table).insert(payload);
      if (saveError) throw saveError;
      setForm({});
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

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 sindcoop-page-enter">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/dashboard" className="sindcoop-icon-button rounded-xl border bg-white p-2.5">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <p className="text-xs text-slate-400">SindCoop / Operação</p>
            <h1 className="text-2xl font-bold">{def.title}</h1>
          </div>
          {ctx && canCreateModule(ctx.role, module) && def.fields.length > 0 && (
            <button
              onClick={() => setOpen(true)}
              className="sindcoop-icon-button inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Novo
            </button>
          )}
          <button
            onClick={() => void load()}
            className="sindcoop-icon-button rounded-xl border bg-white p-2.5"
            aria-label="Atualizar"
          >
            <RefreshCw className={"h-4 w-4 " + (busy ? "sindcoop-spin" : "")} />
          </button>
        </div>

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

        <section className="sindcoop-fade-in mt-5 overflow-hidden rounded-2xl border bg-white shadow-sm">
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
                    {ctx && canDeleteModule(ctx.role, module) && (
                      <th className="px-4 py-3" aria-label="Ações" />
                    )}
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
                      {ctx && canDeleteModule(ctx.role, module) && (
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => void remove(row.id)} className="text-xs font-semibold text-red-600 hover:underline">
                            Excluir
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {open && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 sindcoop-fade-in">
            <form
              onSubmit={(event) => { event.preventDefault(); void save(); }}
              className="sindcoop-modal-enter w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold">Novo registro — {def.title}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {def.fields.map((field) => (
                  <label key={field} className="grid gap-2 text-sm font-medium">
                    {label(field)}
                    {field === "area_id" ? (
                      <select
                        required
                        value={form[field] ?? ""}
                        onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                        className="rounded-xl border px-3 py-2.5"
                      >
                        <option value="">Selecione uma área comum</option>
                        {areas.map((area) => <option key={area.id} value={area.id}>{area.nome}</option>)}
                      </select>
                    ) : (
                      <input
                        required={["nome", "numero", "titulo", "descricao", "categoria", "pessoa", "tipo", "destinatario", "area_id", "inicio", "fim", "valor"].includes(field)}
                        type={field === "inicio" || field === "fim" ? "datetime-local" : field.includes("valor") ? "number" : field.includes("email") ? "email" : "text"}
                        step={field === "valor" ? "0.01" : undefined}
                        value={form[field] ?? ""}
                        onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                        className="rounded-xl border px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-200"
                      />
                    )}
                  </label>
                ))}
              </div>
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
                  {saving ? "Salvando…" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
