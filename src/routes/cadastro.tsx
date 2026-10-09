import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Building2, Loader2, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { createCondominio } from "@/lib/sindcoop-data";

export const Route = createFileRoute("/cadastro")({ component: CadastroPage });

function CadastroPage() {
  const navigate=useNavigate();
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [condo,setCondo]=useState("");
  const [acceptedPolicies,setAcceptedPolicies]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [ok,setOk]=useState("");

  async function submit(e:FormEvent){
    e.preventDefault(); setBusy(true); setError(""); setOk("");
    try {
      const {data,error:a}=await supabase.auth.signUp({
        email:email.trim(),
        password,
        options:{
          data:{full_name:name.trim(), condo_name:condo.trim(), terms_accepted:acceptedPolicies, terms_version:"2026-10-09", privacy_notice_version:"2026-10-09", legal_consent_recorded_at:new Date().toISOString()},
          emailRedirectTo: new URL(import.meta.env.BASE_URL + "login", window.location.origin).toString(),
        },
      });
      if(a) throw a;
      if(data.session){
        await createCondominio({nome:condo.trim()});
        await navigate({to:"/dashboard"});
      } else {
        setOk("Conta criada com sucesso. Confirme seu e-mail para ativar o acesso. Enviamos uma mensagem para o endereço informado. Depois de confirmar, volte ao SindCoop e faça login.");
      }
    } catch(err){
      setError(err instanceof Error ? err.message : "Não foi possível criar a conta.");
    } finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    <form onSubmit={submit} className="w-full max-w-lg rounded-3xl border bg-white p-8 shadow-sm">
      <Link to="/" className="flex items-center gap-3 font-bold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white"><Building2/></span>SindCoop</Link>
      <h1 className="mt-8 text-2xl font-bold">Comece seu condomínio</h1>
      <p className="mt-1 text-sm text-slate-500">Crie sua conta e inicie o período de teste.</p>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-medium">Nome<input required value={name} onChange={e=>setName(e.target.value)} className="rounded-xl border px-3 py-3"/></label>
        <label className="grid gap-2 text-sm font-medium">E-mail<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="rounded-xl border px-3 py-3"/></label>
        <label className="grid gap-2 text-sm font-medium">Senha<input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} className="rounded-xl border px-3 py-3"/></label>
        <label className="grid gap-2 text-sm font-medium">Nome do condomínio<input required value={condo} onChange={e=>setCondo(e.target.value)} className="rounded-xl border px-3 py-3"/></label>
      </div>
      {error&&<div role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {ok&&<div role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><div className="flex gap-3"><MailCheck className="mt-0.5 h-5 w-5 shrink-0"/><div><strong>Quase tudo pronto!</strong><p className="mt-1">{ok}</p><p className="mt-2 font-medium">Não recebeu? Verifique também Spam, Lixo eletrônico e Promoções.</p><Link to="/login" className="mt-3 inline-block font-semibold underline">Ir para o login</Link></div></div></div>}
      <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-slate-600"><input required type="checkbox" checked={acceptedPolicies} onChange={e=>setAcceptedPolicies(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-slate-900" /><span>Li e aceito os <Link to="/termos-de-uso" className="font-semibold text-slate-900 underline underline-offset-2">Termos de Uso</Link> e declaro que estou ciente da <Link to="/politica-de-privacidade" className="font-semibold text-slate-900 underline underline-offset-2">Política de Privacidade</Link>.</span></label>
      <button disabled={busy||!acceptedPolicies} className="mt-5 flex w-full justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">{busy&&<Loader2 className="h-4 w-4"/>}Criar conta</button>
      <p className="mt-5 text-center text-sm text-slate-500">Já possui conta? <Link to="/login" className="font-semibold text-slate-900">Entrar</Link></p>
    </form>
  </main>;
}
