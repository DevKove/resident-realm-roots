import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, ShieldCheck, WalletCards, Users, CalendarDays, BellRing, FileText, AlertTriangle, MessageSquare, Wrench, Car, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

const modules = [
  { icon: Users, title: "Moradores e unidades", text: "Cadastre proprietários, moradores, dependentes, veículos e vínculos por unidade." },
  { icon: WalletCards, title: "Financeiro completo", text: "Controle receitas, despesas, cobranças, inadimplência, categorias e fluxo de caixa." },
  { icon: CalendarDays, title: "Reservas", text: "Gerencie áreas comuns, regras de uso, disponibilidade e conflitos de horários." },
  { icon: BellRing, title: "Comunicação", text: "Publique avisos, notificações, comunicados e acompanhe o que foi visualizado." },
  { icon: AlertTriangle, title: "Ocorrências", text: "Registre problemas, responsáveis, prazos, evidências e histórico de resolução." },
  { icon: Wrench, title: "Manutenção", text: "Controle chamados, prestadores, contratos, equipamentos e manutenção preventiva." },
  { icon: FileText, title: "Documentos", text: "Centralize atas, contratos, regulamentos, comprovantes e documentos do condomínio." },
  { icon: MessageSquare, title: "Assembleias", text: "Organize pautas, convocação, presença, votações e atas." },
  { icon: ShieldCheck, title: "Portaria", text: "Prepare o controle de visitantes, prestadores, encomendas e autorizações." },
  { icon: Car, title: "Veículos", text: "Mantenha vagas e veículos vinculados aos moradores e unidades." },
  { icon: BarChart3, title: "Relatórios", text: "Tenha indicadores operacionais e relatórios para prestação de contas." },
  { icon: Building2, title: "Multi-condomínio", text: "Estrutura preparada para administradoras com isolamento de dados por condomínio." },
];

function Index() {
  return <main className="min-h-screen bg-background">
    <section className="relative overflow-hidden bg-hero text-primary-foreground">
      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur"><Building2 className="h-4 w-4" /> Gestão condominial simplificada</div>
          <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">SindCoop</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">Uma plataforma completa para síndicos, administradores e moradores cuidarem do condomínio com organização, segurança e transparência.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/login" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-foreground shadow-lg transition hover:-translate-y-0.5">Entrar no SindCoop <ArrowRight className="h-4 w-4" /></Link>
            <a href="#recursos" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm backdrop-blur">Conhecer recursos</a>
          </div>
        </div>
      </div>
    </section>
    <section id="recursos" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Tudo em um só lugar</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Muito além de cadastro de moradores.</h2><p className="mt-4 text-slate-600">O SindCoop foi estruturado para acompanhar a operação real de um condomínio, do dia a dia à prestação de contas.</p></div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{modules.map(({icon:Icon,title,text})=><article key={title} className="rounded-2xl border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground"><Icon className="h-5 w-5"/></div><h3 className="mt-5 font-display text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div>
      <div className="mt-12 rounded-3xl border bg-slate-900 p-8 text-white sm:p-10"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-white/60">Primeiro acesso</p><h2 className="mt-2 text-3xl font-bold">Explore o painel do SindCoop.</h2><p className="mt-3 text-white/70">A plataforma utiliza autenticação e banco de dados por condomínio. Cada usuário acessa somente os dados autorizados pelas políticas de segurança do sistema.</p><Link to="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-900">Entrar no sistema <ArrowRight className="h-4 w-4"/></Link></div></div>
    </section>
    <footer className="border-t bg-card"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><div><span>© {new Date().getFullYear()} SindCoop</span><p className="mt-1 text-xs">Gestão condominial com segurança e transparência.</p></div><nav aria-label="Links institucionais" className="flex flex-wrap gap-x-5 gap-y-2"><Link to="/termos-de-uso" className="font-medium transition hover:text-foreground hover:underline">Termos de uso</Link><Link to="/politica-de-privacidade" className="font-medium transition hover:text-foreground hover:underline">Política de privacidade</Link><Link to="/login" className="font-medium transition hover:text-foreground hover:underline">Acessar sistema</Link></nav></div></footer>
  </main>;
}
