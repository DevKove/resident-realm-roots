import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import modeloUrl from "../../IMG/modelo.png?url";
import {
  AlertTriangle,
  ArrowUpRight,
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
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { getCondoContext, dashboardStats, signOut, type CondoContext } from "@/lib/sindcoop-data";
import { canAccessModule } from "@/lib/sindcoop-permissions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
  component: Dashboard,
});

const modules = [
  ["dashboard", "Dashboard", LayoutDashboard, "Resumo e indicadores"],
  ["condominio", "Meu Condomínio", Building2, "Dados e informações gerais"],
  ["unidades", "Unidades", Home, "Cadastro e situação das unidades"],
  ["areas-comuns", "Áreas comuns", CalendarDays, "Espaços e regras de uso"],
  ["moradores", "Moradores", Users, "Cadastro de residentes"],
  ["funcionarios", "Funcionários", BriefcaseBusiness, "Equipe do condomínio"],
  ["veiculos", "Veículos", Car, "Veículos e vagas"],
  ["animais", "Animais", PawPrint, "Animais cadastrados"],
  ["avisos", "Avisos", Bell, "Comunicados do condomínio"],
  ["ocorrencias", "Ocorrências", AlertTriangle, "Registros e acompanhamento"],
  ["reservas", "Reservas", CalendarDays, "Agendamentos de áreas comuns"],
  ["portaria", "Portaria", ShieldCheck, "Controle de acesso"],
  ["visitantes", "Visitantes", UserRound, "Entradas e autorizações"],
  ["entregas", "Entregas", Package, "Pacotes aguardando retirada"],
  ["documentos", "Documentos", FileText, "Arquivos e documentos"],
  ["financeiro", "Financeiro", WalletCards, "Despesas e vencimentos"],
  ["relatorios", "Relatórios", ClipboardList, "Históricos e auditoria"],
  ["configuracoes", "Configurações", Settings, "Preferências do sistema"],
] as const;

function Dashboard() {
  const navigate = useNavigate();
  const [ctx, setCtx] = useState<CondoContext | null>(null);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof dashboardStats>> | null>(null);
  const [error, setError] = useState("");
  const [mobile, setMobile] = useState(false);
  const [busy, setBusy] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const context = await getCondoContext();
        if (!active) return;
        setCtx(context);
        if (context) setStats(await dashboardStats(context.id));
      } catch {
        if (active) setError("Não foi possível carregar os dados. Verifique sua conexão e tente atualizar o painel.");
      } finally {
        if (active) setBusy(false);
      }
    })();
    return () => { active = false; };
  }, []);

  async function refreshDashboard() {
    setRefreshing(true);
    setError("");
    try {
      const context = await getCondoContext();
      setCtx(context);
      if (!context) {
        setStats(null);
        setError("Nenhum condomínio está vinculado a esta conta.");
        return;
      }
      setStats(await dashboardStats(context.id));
    } catch {
      setError("A atualização falhou. Confira sua conexão e tente novamente.");
    } finally {
      setRefreshing(false);
    }
  }

  async function logout() {
    try {
      await signOut();
      await navigate({ to: "/" });
    } catch {
      setError("Não foi possível encerrar a sessão. Tente novamente.");
    }
  }

  const allowedModules = useMemo(
    () => modules.filter(([key]) => key === "dashboard" || (ctx ? canAccessModule(ctx.role, key) : false)),
    [ctx],
  );
  const filteredModules = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalized) return allowedModules.filter(([key]) => key !== "dashboard");
    return allowedModules.filter(([key, title, , description]) =>
      key !== "dashboard" && `${title} ${description} ${key}`.toLocaleLowerCase("pt-BR").includes(normalized),
    );
  }, [allowedModules, query]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const today = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());

  if (busy) return <div className="min-h-screen grid place-items-center bg-slate-50"><div className="flex items-center gap-3 text-sm text-slate-500"><span className="sindcoop-skeleton h-9 w-9 rounded-full" /><span>Carregando seu painel…</span></div></div>;
  if (!ctx) return <main className="min-h-screen grid place-items-center bg-slate-50 p-6"><section className="max-w-md rounded-3xl border bg-white p-8 text-center shadow-sm"><Building2 className="mx-auto h-10 w-10 text-slate-400" /><h1 className="mt-4 text-xl font-semibold">Nenhum condomínio encontrado</h1><p className="mt-2 text-sm text-slate-500">Entre com uma conta vinculada a um condomínio para continuar.</p><button onClick={() => void refreshDashboard()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"><RefreshCw className={`h-4 w-4 ${refreshing ? "sindcoop-spin" : ""}`} /> Tentar novamente</button></section></main>;

  const metricCards = [
    { label: "Unidades", value: stats?.units ?? 0, Icon: Home, module: "unidades", hint: "Total cadastrado" },
    { label: "Moradores ativos", value: stats?.residents ?? 0, Icon: Users, module: "moradores", hint: "Cadastros ativos" },
    { label: "Ocorrências abertas", value: stats?.openOccurrences ?? 0, Icon: AlertTriangle, module: "ocorrencias", hint: "Precisam de atenção" },
    { label: "Reservas futuras", value: stats?.reservations ?? 0, Icon: CalendarDays, module: "reservas", hint: "Pendentes ou aprovadas" },
    { label: "Funcionários ativos", value: stats?.employees ?? 0, Icon: BriefcaseBusiness, module: "funcionarios", hint: "Equipe cadastrada" },
    { label: "Visitantes hoje", value: stats?.visitors ?? 0, Icon: UserRound, module: "visitantes", hint: "Registros de entrada" },
    { label: "Entregas aguardando", value: stats?.deliveries ?? 0, Icon: Package, module: "entregas", hint: "Aguardando retirada" },
  ].filter((metric) => canAccessModule(ctx.role, metric.module));

  return (
    <div className="sindcoop-shell">
      {mobile && <button aria-label="Fechar menu" onClick={() => setMobile(false)} className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" />}

      <aside className={`sindcoop-sidebar ${mobile ? "is-open" : ""}`}>
        <div className="sindcoop-brand flex min-h-24 items-center gap-3 border-b px-5">
          <span className="sindcoop-brand-mark"><img src={modeloUrl} alt="Identidade visual SindCoop" /></span>
          <div className="min-w-0">
            <span className="sindcoop-brand-name block truncate">SindCoop</span>
            <span className="sindcoop-brand-caption block uppercase">Gestão condominial</span>
          </div>
        </div>

        <div className="border-b p-4">
          <div className="rounded-xl bg-slate-100 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Condomínio ativo</p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-900">{ctx.nome}</p>
          </div>
        </div>

        <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto p-3">
          {allowedModules.map(([key, label, Icon]) => {
            const isActive = key === "dashboard";
            const destination = key === "dashboard" ? "/dashboard" : `/app/${key}`;
            return (
              <Link key={key} to={destination} onClick={() => setMobile(false)} aria-current={isActive ? "page" : undefined} className={`sindcoop-nav-item mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 ${isActive ? "bg-slate-100 text-slate-900 shadow-sm" : "hover:bg-slate-100"}`}>
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3">
          <button onClick={() => void logout()} className="sindcoop-nav-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      <main className="sindcoop-main min-w-0">
        <header className="sticky top-0 z-20 flex h-20 items-center border-b bg-white/95 px-4 backdrop-blur sm:px-6">
          <button className="sindcoop-icon-button mr-2 rounded-xl border bg-white p-2.5 lg:hidden" onClick={() => setMobile(true)} aria-label="Abrir menu">
            <Menu className="h-4 w-4" />
          </button>
          <div className="flex min-w-0 w-full items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="hidden text-xs uppercase tracking-[0.18em] text-slate-400 sm:block">SindCoop / Dashboard</p>
              <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">Visão geral</h1>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={() => void refreshDashboard()} disabled={refreshing} className="sindcoop-icon-button rounded-xl border bg-white p-2.5 transition hover:bg-slate-50 disabled:opacity-60" aria-label="Atualizar indicadores" title="Atualizar indicadores">
                <RefreshCw className={`h-4 w-4 ${refreshing ? "sindcoop-spin" : ""}`} />
              </button>
              <Link to="/app/avisos" className="sindcoop-icon-button rounded-xl border bg-white p-2.5 transition hover:bg-slate-50" aria-label="Abrir avisos" title="Avisos">
                <Bell className="h-4 w-4" />
              </Link>
              <Link to="/app/condominio" className="hidden max-w-56 items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:flex" aria-label={`Abrir dados do condomínio: ${ctx.nome}`} title="Ver dados do condomínio">
                <Building2 className="h-4 w-4 shrink-0" />
                <span className="max-w-40 truncate">{ctx.nome}</span>
              </Link>
            </div>
          </div>
        </header>

        <div className="sindcoop-dashboard-content p-4 sm:p-6 lg:p-8">
          {error && <div role="alert" className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><span>{error}</span><button onClick={() => setError("")} aria-label="Fechar mensagem" className="shrink-0 rounded-md p-1 hover:bg-red-100"><X className="h-4 w-4" /></button></div>}

          <section className="sindcoop-dashboard-hero overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-sm">
            <div className="relative px-6 py-7 sm:px-8 sm:py-8">
              <div className="sindcoop-dashboard-hero-copy max-w-2xl">
                <p className="sindcoop-eyebrow">CENTRAL DE GESTÃO</p>
                <p className="mt-3 text-sm text-slate-200">{greeting}, bem-vindo ao SindCoop</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Seu condomínio, em foco.</h2>
                <p className="mt-3 max-w-xl text-sm text-slate-200 sm:text-base">Acompanhe indicadores e acesse rapidamente as principais áreas da administração.</p>
                <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-200">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5"><Building2 className="h-3.5 w-3.5" />{ctx.nome}</span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 capitalize">{today}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-7" aria-labelledby="overview-title">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="overview-title" className="text-lg font-bold text-slate-900">Resumo operacional</h2>
                <p className="mt-1 text-sm text-slate-500">Indicadores atualizados a partir dos dados disponíveis.</p>
              </div>
              <button onClick={() => void refreshDashboard()} disabled={refreshing} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white disabled:opacity-60">
                <RefreshCw className={`h-4 w-4 ${refreshing ? "sindcoop-spin" : ""}`} /> Atualizar
              </button>
            </div>
            <div className="sindcoop-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metricCards.map(({ label, value, Icon, module, hint }) => (
                <Link key={label} to={`/app/${module}`} className="sindcoop-stat-card group rounded-2xl border bg-white p-5 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
                  <div className="sindcoop-stat-topline">
                    <span className="sindcoop-stat-icon inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-slate-100"><Icon className="h-4 w-4" /></span>
                    <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-600" />
                  </div>
                  <div className="mt-5">
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{Number(value).toLocaleString("pt-BR")}</p>
                    <p className="sindcoop-stat-caption">{hint}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8" aria-labelledby="modules-title">
            <div className="mb-4">
              <h2 id="modules-title" className="text-lg font-bold text-slate-900">Acesso rápido aos módulos</h2>
              <p className="mt-1 text-sm text-slate-500">Pesquise e abra somente as áreas disponíveis para seu perfil.</p>
            </div>
            <label className="mb-4 flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-slate-200">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar módulo, por exemplo: moradores, reservas…" className="min-w-0 flex-1 bg-transparent text-sm outline-none" aria-label="Buscar módulos" />
              {query && <button type="button" onClick={() => setQuery("")} className="rounded-md p-1 text-slate-400 hover:bg-slate-100" aria-label="Limpar busca"><X className="h-4 w-4" /></button>}
            </label>
            {filteredModules.length ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredModules.map(([key, title, Icon, description]) => (
                  <Link key={key} to={`/app/${key}`} className="sindcoop-action-card group flex min-w-0 items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
                    <span className="sindcoop-action-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><Icon className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-900">{title}</span><span className="mt-1 block text-xs text-slate-500">{description}</span></span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-700" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed bg-white p-8 text-center">
                <Search className="mx-auto h-7 w-7 text-slate-300" />
                <p className="mt-3 font-semibold text-slate-800">Nenhum módulo encontrado</p>
                <p className="mt-1 text-sm text-slate-500">Tente outro termo de busca.</p>
                <button onClick={() => setQuery("")} className="mt-3 text-sm font-semibold text-slate-700 underline underline-offset-4">Limpar busca</button>
              </div>
            )}
          </section>

          <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><ShieldCheck className="h-5 w-5" /></span>
              <div>
                <h3 className="font-semibold text-slate-900">Acesso e privacidade</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">Os atalhos exibidos respeitam o perfil de acesso da sua conta. Os registros continuam limitados ao condomínio vinculado à sessão.</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <Link to="/politica-de-privacidade" className="font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950">Como seus dados são tratados</Link>
                  <Link to="/termos-de-uso" className="font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950">Termos de uso</Link>
                </div>
              </div>
            </div>
          </section>

          <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} SindCoop · Gestão condominial</p>
            <p>Condomínio ativo: <span className="font-semibold text-slate-700">{ctx.nome}</span></p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
