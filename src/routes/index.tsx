import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Building2, ShieldCheck, WalletCards, Users, CalendarDays, BellRing } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

const modules = [
  { icon: Users, title: "Moradores e unidades", text: "Cadastre unidades, moradores, veículos e vínculos com controle por condomínio." },
  { icon: WalletCards, title: "Gestão financeira", text: "Organize receitas, despesas, cobranças e categorias financeiras." },
  { icon: CalendarDays, title: "Reservas e áreas comuns", text: "Controle disponibilidade e evite conflitos de horários." },
  { icon: BellRing, title: "Avisos e notificações", text: "Comunique moradores e acompanhe eventos em tempo real." },
];

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-hero text-primary-foreground">
        <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <Building2 className="h-4 w-4" /> Gestão condominial simplificada
            </div>
            <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">SindCoop</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
              Uma plataforma central para síndicos, administradores e moradores cuidarem do condomínio com organização, segurança e transparência.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#recursos" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-foreground shadow-lg transition hover:-translate-y-0.5">
                Conhecer o sistema <ArrowRight className="h-4 w-4" />
              </a>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm backdrop-blur">
                <ShieldCheck className="h-4 w-4" /> Segurança por condomínio
              </span>
            </div>
          </div>
        </div>
      </section>
      <section id="recursos" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Tudo em um só lugar</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Estrutura preparada para crescer com o condomínio.</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground"><Icon className="h-5 w-5" /></div>
              <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© {new Date().getFullYear()} SindCoop</span><span>Gestão condominial com segurança e transparência.</span>
        </div>
      </footer>
    </main>
  );
}
