import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, Bell, Building2, CalendarDays, FileText, Home, LayoutDashboard, LogOut, Menu, Users, WalletCards, X, UserRound, Car, PawPrint, BriefcaseBusiness, ShieldCheck, Package, ClipboardList, Settings } from "lucide-react";
import { getCondoContext, dashboardStats, signOut, type CondoContext } from "@/lib/sindcoop-data";
import { supabase } from "@/integrations/supabase/client";
import { canAccessModule } from "@/lib/sindcoop-permissions";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
  component: Dashboard,
});

const modules = [
  ["condominio","Meu Condomínio",Building2],["unidades","Unidades",Home],["moradores","Moradores",Users],["funcionarios","Funcionários",BriefcaseBusiness],
  ["veiculos","Veículos",Car],["animais","Animais",PawPrint],["avisos","Avisos",Bell],["ocorrencias","Ocorrências",AlertTriangle],
  ["reservas","Reservas",CalendarDays],["portaria","Portaria",ShieldCheck],["visitantes","Visitantes",UserRound],["entregas","Entregas",Package],
  ["documentos","Documentos",FileText],["financeiro","Financeiro",WalletCards],["relatorios","Relatórios",ClipboardList],["configuracoes","Configurações",Settings],
] as const;

function Dashboard() {
  const navigate=useNavigate(); const [ctx,setCtx]=useState<CondoContext|null>(null); const [stats,setStats]=useState<any>(null); const [error,setError]=useState(""); const [mobile,setMobile]=useState(false); const [busy,setBusy]=useState(true);
  useEffect(()=>{(async()=>{try{const c=await getCondoContext();setCtx(c);if(c)setStats(await dashboardStats(c.id));}catch(e){setError("Não foi possível carregar os dados do condomínio.");}finally{setBusy(false)}})()},[]);
  async function logout(){await signOut();await navigate({to:"/"});}
  if(busy)return <div className="min-h-screen grid place-items-center bg-slate-50"><div className="flex items-center gap-3 text-sm text-slate-500"><span className="sindcoop-skeleton h-9 w-9 rounded-xl" aria-hidden="true"/><span>Carregando SindCoop…</span></div></div>;
  if(!ctx)return <main className="min-h-screen grid place-items-center bg-slate-50 p-6"><section className="max-w-md rounded-3xl border bg-white p-8 text-center shadow-sm"><Building2 className="mx-auto h-10 w-10"/><h1 className="mt-4 text-xl font-bold">Nenhum condomínio vinculado</h1><p className="mt-2 text-sm text-slate-500">Sua conta precisa estar vinculada a um condomínio para acessar a operação.</p><Link to="/cadastro" className="mt-6 inline-flex rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Criar condomínio</Link></section></main>;
  return <div className="min-h-screen bg-slate-50 text-slate-900 sindcoop-page-enter">
    {mobile&&<button aria-label="Fechar menu" onClick={()=>setMobile(false)} className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"/>}
    <aside className={"fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-white transition-transform lg:translate-x-0 "+(mobile?"translate-x-0":"-translate-x-full")}>
      <div className="flex h-20 items-center gap-3 border-b px-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white"><Building2 className="h-5 w-5"/></span><div><strong>SindCoop</strong><p className="text-xs text-slate-500">Gestão condominial</p></div><button className="ml-auto lg:hidden" onClick={()=>setMobile(false)}><X className="h-5 w-5"/></button></div>
      <div className="border-b p-4"><div className="rounded-xl bg-slate-100 p-3"><p className="text-[11px] uppercase tracking-wide text-slate-500">Condomínio ativo</p><p className="mt-1 truncate font-semibold">{ctx.nome}</p><p className="mt-1 text-xs capitalize text-slate-500">{ctx.role.replace("_"," ")}</p></div></div>
      <nav className="flex-1 overflow-y-auto p-3"><button onClick={()=>navigate({to:"/dashboard"})} className="mb-2 flex w-full items-center gap-3 rounded-xl bg-slate-950 px-3 py-2.5 text-sm font-semibold text-white"><LayoutDashboard className="h-4 w-4"/>Dashboard</button>{modules.filter(([key])=>canAccessModule(ctx.role,key)).map(([key,label,Icon])=><Link key={key} to={"/app/"+key} onClick={()=>setMobile(false)} className="sindcoop-nav-item mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"><Icon className="h-4 w-4"/>{label}</Link>)}</nav>
      <div className="border-t p-3"><button onClick={logout} className="sindcoop-nav-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100"><LogOut className="h-4 w-4"/>Sair</button></div>
    </aside>
    <main className="min-h-screen lg:pl-72"><header className="sticky top-0 z-20 flex h-20 items-center border-b bg-white/95 px-4 backdrop-blur sm:px-6"><button className="sindcoop-icon-button rounded-lg p-2 lg:hidden" onClick={()=>setMobile(true)}><Menu/></button><div className="ml-2 flex-1"><p className="text-xs text-slate-400">SindCoop / Dashboard</p><h1 className="text-xl font-bold">Visão geral</h1></div><div className="hidden text-right sm:block"><p className="text-sm font-semibold">{ctx.nome}</p><p className="text-xs capitalize text-slate-500">{ctx.role.replace("_"," ")}</p></div></header>
      <div className="p-4 sm:p-6 lg:p-8">{error&&<div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}<div className="mb-7"><p className="text-sm text-slate-500">Dados em tempo real do seu condomínio</p><h2 className="mt-1 text-3xl font-bold">Painel operacional</h2></div>
      <div className="sindcoop-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
        ["Unidades",stats?.units??0,Home],["Moradores ativos",stats?.residents??0,Users],["Ocorrências abertas",stats?.openOccurrences??0,AlertTriangle],["Reservas futuras",stats?.reservations??0,CalendarDays],
        ["Funcionários",stats?.employees??0,BriefcaseBusiness],["Visitantes",stats?.visitors??0,UserRound],["Entregas pendentes",stats?.deliveries??0,Package],
      ].map(([label,value,Icon])=><div key={String(label)} className="sindcoop-stat-card rounded-2xl border bg-white p-5 shadow-sm"><div className="sindcoop-stat-icon grid h-10 w-10 place-items-center rounded-xl bg-slate-100"><Icon className="h-5 w-5"/></div><p className="mt-4 text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-bold">{String(value)}</p></div>)}</div>
      <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5"/><div><h3 className="font-semibold">Arquitetura segura por condomínio</h3><p className="mt-1 text-sm text-slate-500">Os dados desta área são filtrados pelo vínculo do usuário e protegidos por RLS no PostgreSQL. Nenhum dado demonstrativo é usado no painel.</p></div></div></section>
      <section className="mt-6"><h3 className="mb-3 font-semibold">Acesso rápido</h3><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{modules.slice(0,8).map(([key,label,Icon])=><Link key={key} to={"/app/"+key} className="sindcoop-action-card flex items-center gap-3 rounded-2xl border bg-white p-4 text-sm font-semibold shadow-sm hover:border-slate-300"><span className="sindcoop-action-icon grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100"><Icon className="h-5 w-5"/></span>{label}<span className="ml-auto text-slate-300">→</span></Link>)}</div></section>
      </div></main>
  </div>;
}
