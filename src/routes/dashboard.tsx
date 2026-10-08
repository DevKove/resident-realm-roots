import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, ArrowDownRight, ArrowUpRight, Bell, Building2, CalendarDays,
  ChevronRight, CircleDollarSign, ClipboardList, FileText, Home, LayoutDashboard,
  LogOut, Menu, MessageSquare, Plus, Search, Settings, ShieldCheck, Users, WalletCards, X
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

type ModuleKey =
  | "visao"
  | "unidades"
  | "moradores"
  | "financeiro"
  | "reservas"
  | "avisos"
  | "ocorrencias"
  | "manutencao"
  | "documentos"
  | "assembleias"
  | "portaria"
  | "relatorios";

type Resident = { id: number; name: string; unit: string; status: "Ativo" | "Pendente"; phone: string };
type Unit = { id: number; code: string; owner: string; residents: number; status: "Ocupada" | "Vazia" };
type Notice = { id: number; title: string; date: string; audience: string; status: "Publicado" | "Rascunho" };
type Expense = { id: number; description: string; category: string; amount: number; due: string; status: "Pago" | "Pendente" };
type Reservation = { id: number; area: string; resident: string; date: string; time: string; status: "Confirmada" | "Pendente" };
type Occurrence = { id: number; title: string; unit: string; date: string; status: "Aberta" | "Em análise" | "Resolvida" };

const initialResidents: Resident[] = [
  { id: 1, name: "Mariana Alves", unit: "101", status: "Ativo", phone: "(15) 99999-1001" },
  { id: 2, name: "Carlos Oliveira", unit: "202", status: "Ativo", phone: "(15) 99999-2002" },
  { id: 3, name: "Fernanda Souza", unit: "304", status: "Pendente", phone: "(15) 99999-3004" },
  { id: 4, name: "Rafael Santos", unit: "405", status: "Ativo", phone: "(15) 99999-4005" },
];

const initialUnits: Unit[] = [
  { id: 1, code: "101", owner: "Mariana Alves", residents: 3, status: "Ocupada" },
  { id: 2, code: "202", owner: "Carlos Oliveira", residents: 2, status: "Ocupada" },
  { id: 3, code: "304", owner: "Fernanda Souza", residents: 2, status: "Ocupada" },
  { id: 4, code: "405", owner: "Rafael Santos", residents: 0, status: "Vazia" },
];

const initialExpenses: Expense[] = [
  { id: 1, description: "Conta de energia", category: "Utilidades", amount: 1840, due: "10/10/2026", status: "Pendente" },
  { id: 2, description: "Limpeza e conservação", category: "Serviços", amount: 3200, due: "05/10/2026", status: "Pago" },
  { id: 3, description: "Manutenção do elevador", category: "Manutenção", amount: 950, due: "15/10/2026", status: "Pendente" },
];

const initialReservations: Reservation[] = [
  { id: 1, area: "Salão de festas", resident: "Mariana Alves", date: "12/10/2026", time: "19:00–23:00", status: "Confirmada" },
  { id: 2, area: "Churrasqueira", resident: "Carlos Oliveira", date: "18/10/2026", time: "12:00–16:00", status: "Pendente" },
];

const initialNotices: Notice[] = [
  { id: 1, title: "Limpeza da caixa d'água", date: "08/10/2026", audience: "Todos", status: "Publicado" },
  { id: 2, title: "Assembleia ordinária", date: "06/10/2026", audience: "Todos", status: "Publicado" },
];

const initialOccurrences: Occurrence[] = [
  { id: 1, title: "Vazamento no corredor", unit: "304", date: "08/10/2026", status: "Aberta" },
  { id: 2, title: "Lâmpada queimada", unit: "Área comum", date: "07/10/2026", status: "Em análise" },
];

const menu: { key: ModuleKey; label: string; icon: typeof Home }[] = [
  { key: "visao", label: "Visão geral", icon: LayoutDashboard },
  { key: "unidades", label: "Unidades", icon: Home },
  { key: "moradores", label: "Moradores", icon: Users },
  { key: "financeiro", label: "Financeiro", icon: WalletCards },
  { key: "reservas", label: "Reservas", icon: CalendarDays },
  { key: "avisos", label: "Avisos", icon: Bell },
  { key: "ocorrencias", label: "Ocorrências", icon: AlertTriangle },
  { key: "manutencao", label: "Manutenção", icon: ClipboardList },
  { key: "documentos", label: "Documentos", icon: FileText },
  { key: "assembleias", label: "Assembleias", icon: MessageSquare },
  { key: "portaria", label: "Portaria", icon: ShieldCheck },
  { key: "relatorios", label: "Relatórios", icon: CircleDollarSign },
];

function Dashboard() {
  const [module, setModule] = useState<ModuleKey>("visao");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [residents, setResidents] = usePersisted<Resident[]>("sindcoop-residents", initialResidents);
  const [units, setUnits] = usePersisted<Unit[]>("sindcoop-units", initialUnits);
  const [expenses, setExpenses] = usePersisted<Expense[]>("sindcoop-expenses", initialExpenses);
  const [reservations, setReservations] = usePersisted<Reservation[]>("sindcoop-reservations", initialReservations);
  const [notices, setNotices] = usePersisted<Notice[]>("sindcoop-notices", initialNotices);
  const [occurrences, setOccurrences] = usePersisted<Occurrence[]>("sindcoop-occurrences", initialOccurrences);
  const [modal, setModal] = useState<"resident" | "unit" | "notice" | "expense" | "reservation" | "occurrence" | null>(null);

  const filteredResidents = useMemo(
    () => residents.filter((r) => (r.name + r.unit + r.phone).toLowerCase().includes(search.toLowerCase())),
    [residents, search],
  );

  const openNew = () => {
    if (module === "moradores") setModal("resident");
    else if (module === "unidades") setModal("unit");
    else if (module === "financeiro") setModal("expense");
    else if (module === "reservas") setModal("reservation");
    else if (module === "avisos") setModal("notice");
    else if (module === "ocorrencias") setModal("occurrence");
    else setModal("notice");
  };

  const selectModule = (key: ModuleKey) => {
    setModule(key);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {mobileOpen && <button aria-label="Fechar menu" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" />}
      <aside className={"fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-white transition-transform lg:translate-x-0 " + (mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-20 items-center justify-between border-b px-5">
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white"><Building2 className="h-5 w-5" /></div><div><div className="font-bold">SindCoop</div><div className="text-xs text-slate-500">Gestão condominial</div></div></div>
          <button className="lg:hidden" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <div className="border-b px-4 py-4"><div className="rounded-xl bg-slate-100 p-3"><div className="text-xs text-slate-500">Condomínio ativo</div><div className="mt-1 font-semibold">Residencial SindCoop</div><div className="text-xs text-slate-500">48 unidades · Plano Profissional</div></div></div>
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Operação</div>
          {menu.map(({ key, label, icon: Icon }) => <button key={key} onClick={() => selectModule(key)} className={"mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition " + (module === key ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100")}><Icon className="h-4 w-4" />{label}</button>)}
        </nav>
        <div className="border-t p-3">
          <button onClick={() => selectModule("visao")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100"><Settings className="h-4 w-4" />Configurações</button>
          <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100"><LogOut className="h-4 w-4" />Sair</Link>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-20 flex h-20 items-center gap-3 border-b bg-white/95 px-4 backdrop-blur sm:px-6">
          <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="min-w-0 flex-1"><div className="text-xs font-medium text-slate-400">SindCoop / {menu.find((m) => m.key === module)?.label}</div><h1 className="truncate text-xl font-bold">{moduleTitle(module)}</h1></div>
          <div className="relative hidden w-64 md:block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="w-full rounded-xl border bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-slate-400" /></div>
          <button className="relative rounded-xl border p-2.5 hover:bg-slate-50"><Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" /></button>
          <div className="hidden items-center gap-2 border-l pl-3 sm:flex"><div className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 text-sm font-bold">SV</div><div className="text-right"><div className="text-sm font-semibold">Síndico</div><div className="text-xs text-slate-500">Administrador</div></div></div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {module === "visao" && <Overview residents={residents} units={units} expenses={expenses} reservations={reservations} notices={notices} occurrences={occurrences} onModule={selectModule} />}
          {module === "moradores" && <DataPage title="Moradores" subtitle="Cadastre e acompanhe moradores, proprietários e contatos." action="Novo morador" onAction={openNew} search={search}><Table headers={["Morador","Unidade","Telefone","Situação",""]}>{filteredResidents.map((r) => <tr key={r.id} className="border-t"><td className="px-4 py-3 font-medium">{r.name}</td><td className="px-4 py-3">{r.unit}</td><td className="px-4 py-3">{r.phone}</td><td className="px-4 py-3"><Status value={r.status} /></td><td className="px-4 py-3 text-right"><button onClick={() => setResidents(residents.filter(x => x.id !== r.id))} className="text-xs text-red-600 hover:underline">Excluir</button></td></tr>)}</Table></DataPage>}
          {module === "unidades" && <DataPage title="Unidades" subtitle="Controle apartamentos, proprietários, ocupação e vínculos." action="Nova unidade" onAction={openNew}><Table headers={["Unidade","Responsável","Moradores","Ocupação",""]}>{units.map((u) => <tr key={u.id} className="border-t"><td className="px-4 py-3 font-semibold">{u.code}</td><td className="px-4 py-3">{u.owner}</td><td className="px-4 py-3">{u.residents}</td><td className="px-4 py-3"><Status value={u.status} /></td><td className="px-4 py-3 text-right"><button onClick={() => setUnits(units.filter(x => x.id !== u.id))} className="text-xs text-red-600 hover:underline">Excluir</button></td></tr>)}</Table></DataPage>}
          {module === "financeiro" && <DataPage title="Financeiro" subtitle="Receitas, despesas, cobranças e visão da inadimplência." action="Lançar despesa" onAction={openNew}><div className="mb-5 grid gap-4 sm:grid-cols-3"><Metric label="Saldo atual" value="R$ 84.260,00" icon={CircleDollarSign} /><Metric label="A receber" value="R$ 12.480,00" icon={ArrowUpRight} /><Metric label="A pagar" value="R$ 5.990,00" icon={ArrowDownRight} /></div><Table headers={["Descrição","Categoria","Vencimento","Valor","Status",""]}>{expenses.map((e) => <tr key={e.id} className="border-t"><td className="px-4 py-3 font-medium">{e.description}</td><td className="px-4 py-3">{e.category}</td><td className="px-4 py-3">{e.due}</td><td className="px-4 py-3 font-semibold">R$ {e.amount.toLocaleString("pt-BR",{minimumFractionDigits:2})}</td><td className="px-4 py-3"><Status value={e.status} /></td><td className="px-4 py-3 text-right"><button onClick={() => setExpenses(expenses.filter(x => x.id !== e.id))} className="text-xs text-red-600 hover:underline">Excluir</button></td></tr>)}</Table></DataPage>}
          {module === "reservas" && <DataPage title="Reservas" subtitle="Gerencie áreas comuns, horários e conflitos de agenda." action="Nova reserva" onAction={openNew}><Table headers={["Área","Morador","Data","Horário","Status",""]}>{reservations.map((r) => <tr key={r.id} className="border-t"><td className="px-4 py-3 font-medium">{r.area}</td><td className="px-4 py-3">{r.resident}</td><td className="px-4 py-3">{r.date}</td><td className="px-4 py-3">{r.time}</td><td className="px-4 py-3"><Status value={r.status} /></td><td className="px-4 py-3 text-right"><button onClick={() => setReservations(reservations.filter(x => x.id !== r.id))} className="text-xs text-red-600 hover:underline">Excluir</button></td></tr>)}</Table></DataPage>}
          {module === "avisos" && <DataPage title="Avisos e comunicação" subtitle="Publique comunicados e mantenha os moradores informados." action="Novo aviso" onAction={openNew}><Table headers={["Título","Público","Data","Status",""]}>{notices.map((n) => <tr key={n.id} className="border-t"><td className="px-4 py-3 font-medium">{n.title}</td><td className="px-4 py-3">{n.audience}</td><td className="px-4 py-3">{n.date}</td><td className="px-4 py-3"><Status value={n.status} /></td><td className="px-4 py-3 text-right"><button onClick={() => setNotices(notices.filter(x => x.id !== n.id))} className="text-xs text-red-600 hover:underline">Excluir</button></td></tr>)}</Table></DataPage>}
          {module === "ocorrencias" && <DataPage title="Ocorrências" subtitle="Registre problemas, responsáveis, prazos e resolução." action="Nova ocorrência" onAction={openNew}><Table headers={["Ocorrência","Local","Data","Status",""]}>{occurrences.map((o) => <tr key={o.id} className="border-t"><td className="px-4 py-3 font-medium">{o.title}</td><td className="px-4 py-3">{o.unit}</td><td className="px-4 py-3">{o.date}</td><td className="px-4 py-3"><Status value={o.status} /></td><td className="px-4 py-3 text-right"><button onClick={() => setOccurrences(occurrences.filter(x => x.id !== o.id))} className="text-xs text-red-600 hover:underline">Excluir</button></td></tr>)}</Table></DataPage>}
          {module !== "visao" && !["moradores","unidades","financeiro","reservas","avisos","ocorrencias"].includes(module) && <Placeholder title={moduleTitle(module)} onAction={openNew} />}
        </div>
      </main>

      {modal && <Modal type={modal} onClose={() => setModal(null)} onSubmit={(data) => {
        const id = Date.now();
        if (modal === "resident") setResidents([...residents, { id, name: data.name, unit: data.unit, phone: data.phone, status: "Ativo" }]);
        if (modal === "unit") setUnits([...units, { id, code: data.code, owner: data.owner, residents: Number(data.residents || 0), status: "Ocupada" }]);
        if (modal === "expense") setExpenses([...expenses, { id, description: data.description, category: data.category, amount: Number(data.amount), due: data.due, status: "Pendente" }]);
        if (modal === "reservation") setReservations([...reservations, { id, area: data.area, resident: data.resident, date: data.date, time: data.time, status: "Pendente" }]);
        if (modal === "notice") setNotices([...notices, { id, title: data.title, audience: data.audience, date: new Date().toLocaleDateString("pt-BR"), status: "Rascunho" }]);
        if (modal === "occurrence") setOccurrences([...occurrences, { id, title: data.title, unit: data.unit, date: new Date().toLocaleDateString("pt-BR"), status: "Aberta" }]);
        setModal(null);
      }} />}
    </div>
  );
}

function usePersisted<T>(key: string, initial: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial; } catch { return initial; } });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage may be unavailable */ } }, [key, value]);
  return [value, setValue];
}

function moduleTitle(module: ModuleKey) {
  return menu.find((m) => m.key === module)?.label ?? "Visão geral";
}

function Overview({ residents, units, expenses, reservations, notices, occurrences, onModule }: { residents: Resident[]; units: Unit[]; expenses: Expense[]; reservations: Reservation[]; notices: Notice[]; occurrences: Occurrence[]; onModule: (m: ModuleKey) => void }) {
  const occupied = units.filter(u => u.status === "Ocupada").length;
  const pending = expenses.filter(e => e.status === "Pendente").reduce((s,e)=>s+e.amount,0);
  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-slate-500">Quinta-feira, 8 de outubro de 2026</p><h2 className="mt-1 text-3xl font-bold tracking-tight">Bom dia, síndico.</h2><p className="mt-1 text-slate-500">Aqui está o resumo do Residencial SindCoop.</p></div><button onClick={() => onModule("avisos")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"><Plus className="h-4 w-4" />Novo lançamento</button></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Unidades ocupadas" value={occupied + " / " + units.length} icon={Home} note="ocupação atual" />
      <Metric label="Moradores ativos" value={String(residents.length)} icon={Users} note="cadastros ativos" />
      <Metric label="A pagar" value={"R$ " + pending.toLocaleString("pt-BR",{minimumFractionDigits:2})} icon={WalletCards} note="despesas pendentes" />
      <Metric label="Reservas futuras" value={String(reservations.length)} icon={CalendarDays} note="na agenda" />
    </div>
    <div className="grid gap-5 xl:grid-cols-3">
      <Panel title="Atividade recente" className="xl:col-span-2"><div className="divide-y">{[...notices.map(n=>({icon:Bell,text:n.title,meta:"Aviso publicado"})),...occurrences.map(o=>({icon:AlertTriangle,text:o.title,meta:"Ocorrência registrada"}))].slice(0,5).map((item,i)=><div key={i} className="flex items-center gap-3 py-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100"><item.icon className="h-4 w-4 text-slate-600"/></div><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{item.text}</div><div className="text-xs text-slate-500">{item.meta}</div></div><ChevronRight className="h-4 w-4 text-slate-300"/></div>)}</div></Panel>
      <Panel title="Ações rápidas"><div className="grid gap-2">{[["Moradores","moradores",Users],["Financeiro","financeiro",WalletCards],["Reservas","reservas",CalendarDays],["Avisos","avisos",Bell]].map(([label,key,Icon])=><button key={String(key)} onClick={()=>onModule(key as ModuleKey)} className="flex items-center gap-3 rounded-xl border p-3 text-left text-sm font-medium hover:bg-slate-50"><div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100"><Icon className="h-4 w-4"/></div>{label}<ChevronRight className="ml-auto h-4 w-4 text-slate-300"/></button>)}</div></Panel>
    </div>
    <Panel title="Próximos compromissos"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><div className="rounded-xl bg-slate-50 p-4"><div className="text-xs font-semibold text-slate-500">12 OUT · 19:00</div><div className="mt-1 font-semibold">Salão de festas</div><div className="text-sm text-slate-500">Mariana Alves</div></div><div className="rounded-xl bg-slate-50 p-4"><div className="text-xs font-semibold text-slate-500">15 OUT · 18:30</div><div className="mt-1 font-semibold">Assembleia ordinária</div><div className="text-sm text-slate-500">Salão de festas</div></div><div className="rounded-xl bg-slate-50 p-4"><div className="text-xs font-semibold text-slate-500">18 OUT · 12:00</div><div className="mt-1 font-semibold">Churrasqueira</div><div className="text-sm text-slate-500">Carlos Oliveira</div></div></div></Panel>
  </div>;
}

function Metric({ label, value, icon: Icon, note }: { label: string; value: string; icon: typeof Home; note?: string }) { return <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100"><Icon className="h-5 w-5 text-slate-700"/></div><ArrowUpRight className="h-4 w-4 text-slate-300"/></div><div className="mt-4 text-sm text-slate-500">{label}</div><div className="mt-1 text-2xl font-bold">{value}</div>{note&&<div className="mt-1 text-xs text-slate-400">{note}</div>}</div>; }
function Panel({ title, children, className="" }: { title: string; children: React.ReactNode; className?: string }) { return <section className={"rounded-2xl border bg-white p-5 shadow-sm " + className}><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">{title}</h3></div>{children}</section>; }
function DataPage({ title, subtitle, action, onAction, children }: { title: string; subtitle: string; action: string; onAction: ()=>void; children: React.ReactNode }) { return <div className="space-y-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="text-2xl font-bold">{title}</h2><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div><button onClick={onAction} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4"/>{action}</button></div>{children}</div>; }
function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) { return <div className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{headers.map(h=><th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div></div>; }
function Status({ value }: { value: string }) { const good=["Ativo","Pago","Confirmada","Publicado","Ocupada","Resolvida"].includes(value); const warn=["Pendente","Em análise"].includes(value); return <span className={"inline-flex rounded-full px-2.5 py-1 text-xs font-semibold " + (good ? "bg-emerald-50 text-emerald-700" : warn ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600")}>{value}</span>; }
function Placeholder({ title, onAction }: { title: string; onAction: ()=>void }) { return <div className="rounded-2xl border bg-white p-10 text-center shadow-sm"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100"><FileText className="h-6 w-6 text-slate-500"/></div><h2 className="mt-4 text-xl font-bold">{title}</h2><p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">Módulo estruturado para receber cadastros, filtros, permissões, relatórios e histórico. A interface já está preparada para a integração com o banco de dados.</p><button onClick={onAction} className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Adicionar registro</button></div>; }

function Modal({ type, onClose, onSubmit }: { type: NonNullable<"resident" | "unit" | "notice" | "expense" | "reservation" | "occurrence" | null>; onClose: ()=>void; onSubmit: (data: Record<string,string>)=>void }) {
  const configs: Record<string,{title:string;fields:{name:string;label:string;type?:string}[]}> = {
    resident:{title:"Novo morador",fields:[{name:"name",label:"Nome completo"},{name:"unit",label:"Unidade"},{name:"phone",label:"Telefone"}]},
    unit:{title:"Nova unidade",fields:[{name:"code",label:"Número da unidade"},{name:"owner",label:"Responsável"},{name:"residents",label:"Quantidade de moradores",type:"number"}]},
    expense:{title:"Nova despesa",fields:[{name:"description",label:"Descrição"},{name:"category",label:"Categoria"},{name:"amount",label:"Valor",type:"number"},{name:"due",label:"Vencimento"}]},
    reservation:{title:"Nova reserva",fields:[{name:"area",label:"Área comum"},{name:"resident",label:"Morador"},{name:"date",label:"Data"},{name:"time",label:"Horário"}]},
    notice:{title:"Novo aviso",fields:[{name:"title",label:"Título"},{name:"audience",label:"Público"}]},
    occurrence:{title:"Nova ocorrência",fields:[{name:"title",label:"Descrição da ocorrência"},{name:"unit",label:"Local / unidade"}]},
  };
  const config=configs[type];
  const [form,setForm]=useState<Record<string,string>>({});
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"><form onSubmit={(e)=>{e.preventDefault();onSubmit(form)}} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">{config.title}</h2><button type="button" onClick={onClose}><X className="h-5 w-5"/></button></div><div className="mt-5 grid gap-4">{config.fields.map(f=><label key={f.name} className="grid gap-1.5 text-sm font-medium">{f.label}<input required type={f.type||"text"} value={form[f.name]||""} onChange={e=>setForm({...form,[f.name]:e.target.value})} className="rounded-xl border px-3 py-2.5 font-normal outline-none focus:border-slate-500" /></label>)}</div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">Cancelar</button><button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Salvar</button></div></form></div>;
}
