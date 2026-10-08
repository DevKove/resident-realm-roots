import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { getCondoContext } from "@/lib/sindcoop-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/$module")({ component: ModulePage });

const definitions: Record<string,{title:string;table:string;fields:string[];columns:string[]}> = {
  condominio:{title:"Meu Condomínio",table:"condominios",fields:["nome","cidade","estado","telefone","email"],columns:["nome","cidade","estado","email"]},
  unidades:{title:"Unidades",table:"unidades",fields:["numero","bloco","andar","tipo","status"],columns:["numero","bloco","andar","status"]},
  moradores:{title:"Moradores",table:"moradores",fields:["nome","cpf","email","telefone","tipo","status"],columns:["nome","email","telefone","tipo","status"]},
  funcionarios:{title:"Funcionários",table:"funcionarios",fields:["nome","cpf","funcao","telefone","email","status"],columns:["nome","funcao","telefone","status"]},
  veiculos:{title:"Veículos",table:"veiculos",fields:["placa","marca_modelo","cor","tipo","vaga"],columns:["placa","marca_modelo","cor","tipo","vaga"]},
  animais:{title:"Animais",table:"animais",fields:["nome","especie","raca","porte"],columns:["nome","especie","raca","porte"]},
  avisos:{title:"Avisos",table:"avisos",fields:["titulo","conteudo","prioridade"],columns:["titulo","prioridade","publicado_em"]},
  ocorrencias:{title:"Ocorrências",table:"ocorrencias",fields:["titulo","descricao","categoria","prioridade","status"],columns:["titulo","categoria","prioridade","status"]},
  reservas:{title:"Reservas",table:"reservas",fields:["inicio","fim","status","observacoes"],columns:["inicio","fim","status","observacoes"]},
  portaria:{title:"Portaria",table:"acessos_portaria",fields:["pessoa","tipo","observacoes"],columns:["pessoa","tipo","entrada","saida"]},
  visitantes:{title:"Visitantes",table:"visitantes",fields:["nome","documento","autorizado","observacoes"],columns:["nome","documento","autorizado","entrada","saida"]},
  entregas:{title:"Entregas",table:"entregas",fields:["destinatario","transportadora","descricao","status"],columns:["destinatario","transportadora","status","recebido_em"]},
  documentos:{title:"Documentos",table:"documentos",fields:["categoria","titulo","mime_type"],columns:["categoria","titulo","mime_type","created_at"]},
  financeiro:{title:"Financeiro",table:"despesas",fields:["descricao","fornecedor","valor","vencimento","status"],columns:["descricao","fornecedor","valor","vencimento","status"]},
  relatorios:{title:"Relatórios",table:"auditoria",fields:[],columns:["acao","recurso","tabela","created_at"]},
  configuracoes:{title:"Configurações",table:"configuracoes",fields:[],columns:["updated_at"]},
};

const label=(x:string)=>x.replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase());

function ModulePage(){
  const {module}=Route.useParams(); const def=definitions[module]??{title:"Módulo",table:"",fields:[],columns:[]};
  const [ctx,setCtx]=useState<any>(null); const [rows,setRows]=useState<any[]>([]); const [form,setForm]=useState<Record<string,string>>({}); const [query,setQuery]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(true); const [saving,setSaving]=useState(false); const [open,setOpen]=useState(false);
  const load=async()=>{if(!ctx||!def.table)return;setBusy(true);setError("");try{let q=(supabase as any).from(def.table).select("*").eq("condominio_id",ctx.id).order("created_at",{ascending:false}).limit(100);const {data,error:e}=await q;if(e)throw e;setRows(data??[]);}catch(e){setError(e instanceof Error?e.message:"Não foi possível carregar os dados.");}finally{setBusy(false)}};
  useEffect(()=>{(async()=>{try{const c=await getCondoContext();setCtx(c);}catch(e){setError("Sessão inválida.")}})()},[]);
  useEffect(()=>{load()},[ctx,module]);
  const filtered=useMemo(()=>rows.filter(r=>JSON.stringify(r).toLowerCase().includes(query.toLowerCase())),[rows,query]);
  async function save(){if(!ctx||!def.fields.length)return;setSaving(true);setError("");try{const payload:any={condominio_id:ctx.id};for(const f of def.fields)if(form[f]?.trim())payload[f]=form[f].trim();if(def.table==="avisos"){payload.autor_id=(await (supabase as any).auth.getUser()).data.user?.id;payload.conteudo=payload.conteudo||payload.titulo||""}const {error:e}=await (supabase as any).from(def.table).insert(payload);if(e)throw e;setForm({});setOpen(false);await load();}catch(e){setError(e instanceof Error?e.message:"Não foi possível salvar.")}finally{setSaving(false)}}
  async function remove(id:string){if(!confirm("Excluir este registro? Esta ação não pode ser desfeita."))return;const {error:e}=await (supabase as any).from(def.table).delete().eq("id",id).eq("condominio_id",ctx.id);if(e)setError(e.message);else load();}
  return <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 sindcoop-page-enter"><div className="mx-auto max-w-7xl">
    <div className="flex flex-wrap items-center gap-3"><Link to="/dashboard" className="sindcoop-icon-button rounded-xl border bg-white p-2.5"><ArrowLeft className="h-4 w-4"/></Link><div className="flex-1"><p className="text-xs text-slate-400">SindCoop / Operação</p><h1 className="text-2xl font-bold">{def.title}</h1></div>{def.fields.length>0&&<button onClick={()=>setOpen(true)} className="sindcoop-icon-button inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4"/>Novo</button>}<button onClick={load} className="sindcoop-icon-button rounded-xl border bg-white p-2.5" aria-label="Atualizar"><RefreshCw className={"h-4 w-4 "+(busy?"sindcoop-spin":"")}/></button></div>
    <div className="sindcoop-fade-in mt-6 flex items-center gap-3 rounded-2xl border bg-white p-3"><Search className="h-4 w-4 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar neste módulo…" className="w-full bg-transparent text-sm outline-none"/></div>
    {error&&<div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <section className="sindcoop-fade-in mt-5 overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="overflow-x-auto">{busy?<div className="p-10 text-center text-sm text-slate-500"><span className="sindcoop-skeleton mx-auto block h-3 w-36 rounded-full"/><span className="mt-3 block">Carregando…</span></div>:filtered.length===0?<div className="p-12 text-center"><ShieldCheck className="mx-auto h-8 w-8 text-slate-300"/><p className="mt-3 font-semibold">Nenhum registro encontrado</p><p className="mt-1 text-sm text-slate-500">Os dados exibidos são exclusivamente do condomínio autorizado.</p></div>:<table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50"><tr>{def.columns.map(c=><th key={c} className="px-4 py-3 font-semibold">{label(c)}</th>)}{def.fields.length>0&&<th className="px-4 py-3"/>}</tr></thead><tbody>{filtered.map(r=><tr key={r.id} className="border-t">{def.columns.map(c=><td key={c} className="px-4 py-3">{typeof r[c]==="boolean"?(r[c]?"Sim":"Não"):r[c]??"—"}</td>)}{def.fields.length>0&&<td className="px-4 py-3 text-right"><button onClick={()=>remove(r.id)} className="text-xs font-semibold text-red-600 hover:underline">Excluir</button></td>}</tr>)}</tbody></table>}</div></section>
    {open&&<div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 sindcoop-fade-in"><form onSubmit={e=>{e.preventDefault();save()}} className="sindcoop-modal-enter w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"><h2 className="text-xl font-bold">Novo registro — {def.title}</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{def.fields.map(f=><label key={f} className="grid gap-2 text-sm font-medium">{label(f)}<input required={f==="nome"||f==="numero"||f==="titulo"||f==="descricao"} type={f.includes("valor")?"number":f.includes("email")?"email":"text"} value={form[f]??""} onChange={e=>setForm({...form,[f]:e.target.value})} className="rounded-xl border px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-200"/></label>)}</div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={()=>setOpen(false)} className="rounded-xl border px-4 py-2.5 font-semibold">Cancelar</button><button disabled={saving} className="rounded-xl bg-slate-950 px-4 py-2.5 font-semibold text-white">{saving?"Salvando…":"Salvar"}</button></div></form></div>}
  </div></main>;
}
