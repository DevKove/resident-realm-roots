import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import modeloUrl from "../../IMG/modelo.png?url";
import {
  AlertTriangle,
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
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import { getCondoContext, dashboardStats, signOut, type CondoContext } from "@/lib/sindcoop-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
  component: Dashboard,
});

const modules = [
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

function Dashboard() {
  const navigate = useNavigate();
  const [ctx, setCtx] = useState<CondoContext | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState("");
  const [mobile, setMobile] = useState(false);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const c = await getCondoContext();
        setCtx(c);
        if (c) setStats(await dashboardStats(c.id));
      } catch {
        setError("Não foi possível carregar os dados do condomínio.");
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  async function logout() {
    await signOut();
    await navigate({ to: "/" });
  }

  if (busy) return <div className="min-h-screen grid place-items-center bg-slate-50"><div className="flex items-center gap-3 text-sm text-slate-500"><span className="sindcoop-skeleton h-9 w-9 rounded-full" /><span>Carregando dashboard…</span></div></div>;
  if (!ctx) return <main className="min-h-screen grid place-items-center bg-slate-50 p-6"><section className="max-w-md rounded-3xl border bg-white p-8 text-center shadow-sm"><Building2 className="mx-auto h-10 w-10 text-slate-400" /><h1 className="mt-4 text-xl font-semibold">Nenhum condomínio encontrado</h1><p className="mt-2 text-sm text-slate-500">Entre com uma conta vinculada a um condomínio para continuar.</p></section></main>;

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
            <p className="mt-1 truncate text-sm font-semibold text-slate-900">{ctx.name}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {modules.map(([key, label, Icon]) => {
            const isActive = key === "dashboard";
            const destination = key === "dashboard" ? "/dashboard" : `/app/${key}`;
            return (
              <Link key={key} to={destination} className={`sindcoop-nav-item mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 ${isActive ? "bg-slate-100 text-slate-900 shadow-sm" : "hover:bg-slate-100"}`}>
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3">
          <button onClick={logout} className="sindcoop-nav-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      <main className="sindcoop-main">
        <header className="sticky top-0 z-20 flex h-20 items-center border-b bg-white/95 px-4 backdrop-blur sm:px-6">
          <button className="sindcoop-icon-button lg:hidden rounded-xl border bg-white p-2.5" onClick={() => setMobile(true)} aria-label="Abrir menu">
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex w-full items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">SindCoop / Dashboard</p>
              <h1 className="text-xl font-bold text-slate-900">Visão geral</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void navigate({ to: "/app/avisos" })}
                className="sindcoop-icon-button rounded-xl border bg-white p-2.5 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                aria-label="Abrir avisos e notificações"
                title="Avisos e notificações"
              >
                <Bell className="h-4 w-4" />
              </button>
              <Link
                to="/app/condominio"
                className="flex max-w-56 items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                aria-label={`Abrir dados do condomínio: ${ctx.name}`}
                title="Ver dados do condomínio"
              >
                <Building2 className="h-4 w-4 shrink-0" />
                <span className="truncate max-w-40">{ctx.name}</span>
              </Link>
            </div>
          </div>
        </header>

        <div className="sindcoop-dashboard-content p-4 sm:p-6 lg:p-8">
          {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          <section className="sindcoop-dashboard-hero overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-sm">
            <div className="relative px-6 py-7 sm:px-8 sm:py-8">
              <div className="sindcoop-dashboard-hero-copy max-w-2xl">
                <p className="sindcoop-eyebrow">Central de gestão</p>
                <p className="mt-3 text-sm text-slate-200">Bem-vindo ao ambiente do condomínio</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Painel operacional</h2>
                <p className="mt-3 max-w-xl text-sm text-slate-200 sm:text-base">Acompanhe indicadores, ações pendentes e o funcionamento geral do seu condomínio em um único painel.</p>
              </div>
            </div>
          </section>

          <section className="sindcoop-stagger mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Unidades", stats?.units ?? 0, Home],
              ["Moradores ativos", stats?.residents ?? 0, Users],
              ["Ocorrências abertas", stats?.openOccurrences ?? 0, AlertTriangle],
              ["Reservas futuras", stats?.reservations ?? 0, CalendarDays],
            ].map(([label, value, Icon]) => (
              <div key={String(label)} className="sindcoop-stat-card rounded-2xl border bg-white p-5 shadow-sm">
                <div className="sindcoop-stat-topline">
                  <span className="sindcoop-stat-icon inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-slate-100"><Icon className="h-4 w-4" /></span>
                  <span className="sindcoop-stat-dot" />
                </div>
                <div className="mt-6">
                  <p className="text-sm text-slate-500">{String(label)}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{Number(value)}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-slate-600" />
              <div>
                <h3 className="font-semibold text-slate-900">Arquitetura do condomínio</h3>
                <p className="text-sm text-slate-500">Os dados do painel são carregados diretamente do ambiente autorizado do condomínio.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
