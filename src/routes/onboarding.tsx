import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { createCondominio, getCondoContext } from "@/lib/sindcoop-data";

export const Route = createFileRoute("/onboarding")({ component: OnboardingPage });

function OnboardingPage() {
  const navigate = useNavigate();
  const [nome,setNome]=useState("");
  const [busy,setBusy]=useState(false);
  const [checking,setChecking]=useState(true);
  const [error,setError]=useState("");

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) { await navigate({to:"/login"}); return; }
        const condo = await getCondoContext();
        if (condo) await navigate({to:"/dashboard"});
      } catch { setError("Não foi possível carregar o onboarding."); }
      finally { setChecking(false); }
    })();
  }, [navigate]);

  async function submit(e:FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      if (!nome.trim()) { setError("Informe o nome do condomínio."); return; }
      await createCondominio({nome:nome.trim()});
      await navigate({to:"/dashboard"});
    } catch(err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar o condomínio.");
    } finally { setBusy(false); }
  }

  if (checking) return <main className="min-h-screen grid place-items-center bg-slate-50"><Loader2 className="animate-spin"/></main>;

  return <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
    <form onSubmit={submit} className="w-full max-w-lg rounded-3xl border bg-white p-8 shadow-sm">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white"><Building2/></div>
      <h1 className="mt-6 text-2xl font-bold">Finalize seu cadastro</h1>
      <p className="mt-2 text-sm text-slate-500">Seu e-mail foi confirmado. Falta apenas informar o nome do condomínio para liberar seu ambiente.</p>
      <label className="mt-6 grid gap-2 text-sm font-medium">Nome do condomínio<input required autoFocus value={nome} onChange={e=>setNome(e.target.value)} className="rounded-xl border px-3 py-3" placeholder="Ex.: Residencial Jardim das Flores"/></label>
      {error&&<div role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <button disabled={busy} className="mt-6 flex w-full justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white disabled:opacity-60">{busy&&<Loader2 className="animate-spin"/>}Continuar para o SindCoop</button>
    </form>
  </main>;
}
