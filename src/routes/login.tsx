import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Building2, Eye, EyeOff, Loader2, MailCheck, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { completePendingOnboarding } from "@/lib/sindcoop-data";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [show,setShow]=useState(false);
  const [busy,setBusy]=useState(false);
  const [resending,setResending]=useState(false);
  const [error,setError]=useState("");
  const [confirmationRequired,setConfirmationRequired]=useState(false);
  const [resendMessage,setResendMessage]=useState("");

  async function resendConfirmation() {
    const target=email.trim();
    if (!target) { setError("Informe seu e-mail para reenviar a confirmação."); return; }
    setResending(true); setError(""); setResendMessage("");
    try {
      const { error: resendError } = await supabase.auth.resend({ type:"signup", email:target });
      if (resendError) throw resendError;
      setResendMessage("E-mail de confirmação reenviado. Verifique sua caixa de entrada e também a pasta de spam.");
    } catch {
      setError("Não foi possível reenviar agora. Confira o e-mail e tente novamente em alguns instantes.");
    } finally { setResending(false); }
  }

  async function submit(e:FormEvent) {
    e.preventDefault(); setBusy(true); setError(""); setResendMessage(""); setConfirmationRequired(false);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({email:email.trim(),password});
      if (authError) {
        if (authError.code === "email_not_confirmed" || /email not confirmed|confirm.*email|not confirmed/i.test(authError.message)) {
          setConfirmationRequired(true);
          setError("Seu e-mail ainda não foi confirmado. Confirme o e-mail enviado para você antes de entrar.");
          return;
        }
        setError("E-mail ou senha inválidos.");
        return;
      }
      const onboarding = await completePendingOnboarding();
      if (onboarding === "needs_onboarding") {
        await navigate({to:"/onboarding"});
      } else {
        await navigate({to:"/dashboard"});
      }
    } catch {
      setError("Não foi possível concluir o acesso. Tente novamente.");
    } finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-slate-50 grid lg:grid-cols-2">
    <section className="hidden lg:flex flex-col justify-between bg-slate-950 p-12 text-white">
      <Link to="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10"><Building2/></span><strong className="text-xl">SindCoop</strong></Link>
      <div className="max-w-lg"><p className="text-sm font-semibold uppercase tracking-widest text-slate-400">Gestão condominial</p><h1 className="mt-4 text-5xl font-bold leading-tight">Seu condomínio organizado em um só lugar.</h1><p className="mt-6 text-lg text-slate-300">Operação, comunicação, portaria e financeiro com segurança por condomínio.</p></div>
      <p className="text-sm text-slate-500">Acesso protegido por autenticação Supabase.</p>
    </section>
    <section className="flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">
        <div className="mb-8 lg:hidden"><Link to="/" className="flex items-center gap-3 font-bold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white"><Building2 className="h-5 w-5"/></span>SindCoop</Link></div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100"><ShieldCheck className="h-6 w-6"/></div>
        <h2 className="mt-5 text-2xl font-bold">Entrar no SindCoop</h2><p className="mt-1 text-sm text-slate-500">Use as credenciais da sua conta.</p>
        <div className="mt-7 grid gap-4">
          <label className="grid gap-2 text-sm font-medium">E-mail<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="rounded-xl border px-3 py-3 outline-none focus:ring-2 focus:ring-slate-200"/></label>
          <label className="grid gap-2 text-sm font-medium">Senha<div className="relative"><input required type={show?"text":"password"} autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-xl border px-3 py-3 pr-11 outline-none focus:ring-2 focus:ring-slate-200"/><button type="button" aria-label={show?"Ocultar senha":"Mostrar senha"} onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">{show?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div></label>
        </div>
        {error && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {confirmationRequired && <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><div className="flex gap-3"><MailCheck className="mt-0.5 h-5 w-5 shrink-0"/><div><strong>Confirme seu e-mail para continuar.</strong><p className="mt-1">Abra a mensagem enviada ao seu e-mail e clique no botão/link de confirmação. Depois volte aqui para entrar.</p><button type="button" onClick={resendConfirmation} disabled={resending} className="mt-3 font-semibold underline disabled:opacity-60">{resending?"Reenviando...":"Reenviar e-mail de confirmação"}</button></div></div></div>}
        {resendMessage && <div role="status" className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{resendMessage}</div>}
        <button disabled={busy||resending} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white disabled:opacity-60">{busy&&<Loader2 className="h-4 w-4 animate-spin"/>}Entrar</button>
        <div className="mt-4 text-right"><Link to="/recuperar-senha" className="text-sm font-semibold hover:underline">Esqueci minha senha</Link></div><div className="mt-5 flex justify-between text-sm"><Link to="/" className="text-slate-500 hover:underline">Voltar</Link><Link to="/cadastro" className="font-semibold hover:underline">Criar conta</Link></div>
      </form>
    </section>
  </main>;
}
