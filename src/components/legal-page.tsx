import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Building2, FileText, LockKeyhole, ShieldCheck } from "lucide-react";

type LegalPageProps = {
  title: string;
  subtitle: string;
  icon: "terms" | "privacy";
  children: ReactNode;
};

export function LegalPage({ title, subtitle, icon, children }: LegalPageProps) {
  const Icon = icon === "privacy" ? LockKeyhole : FileText;
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white shadow-sm"><Building2 className="h-5 w-5" /></span>
            <span><strong className="block text-lg tracking-tight text-slate-950">SindCoop</strong><span className="block text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Gestão condominial</span></span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"><ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Voltar ao início</span><span className="sm:hidden">Voltar</span></Link>
        </div>
      </header>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(214,168,75,.2),transparent_45%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-amber-300"><ShieldCheck className="h-4 w-4" /> Transparência e confiança</div>
          <div className="mt-5 flex items-start gap-4">
            <span className="hidden h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 sm:grid"><Icon className="h-7 w-7 text-amber-300" /></span>
            <div className="max-w-3xl"><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">{subtitle}</p><p className="mt-4 text-xs text-slate-400">Última atualização: 9 de outubro de 2026</p></div>
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-9 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_250px]">
        <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <div className="legal-document space-y-8">{children}</div>
          <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Informação importante:</strong> antes da disponibilização comercial, o responsável legal pela operação do SindCoop deve revisar este documento, informar sua razão social/CNPJ e disponibilizar um canal oficial para solicitações de privacidade. O texto é uma base informativa e não substitui assessoria jurídica.</div>
        </article>
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Documentos legais</p>
          <nav className="mt-4 grid gap-2" aria-label="Documentos legais">
            <Link to="/termos-de-uso" className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"><FileText className="h-4 w-4 text-slate-500" /> Termos de uso</Link>
            <Link to="/politica-de-privacidade" className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"><LockKeyhole className="h-4 w-4 text-slate-500" /> Política de privacidade</Link>
          </nav>
          <div className="mt-5 border-t border-slate-100 pt-4"><p className="text-xs leading-5 text-slate-500">Precisa de ajuda com sua conta?</p><Link to="/login" className="mt-2 inline-flex text-sm font-semibold text-blue-800 hover:underline">Acessar o SindCoop</Link></div>
        </aside>
      </div>
      <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8"><span>© {new Date().getFullYear()} SindCoop. Todos os direitos reservados.</span><div className="flex flex-wrap gap-x-5 gap-y-2"><Link to="/termos-de-uso" className="hover:text-slate-900 hover:underline">Termos de uso</Link><Link to="/politica-de-privacidade" className="hover:text-slate-900 hover:underline">Privacidade</Link><Link to="/" className="hover:text-slate-900 hover:underline">Início</Link></div></div></footer>
    </main>
  );
}
