import { supabase } from "@/integrations/supabase/client";

export type CondoContext = { id: string; nome: string; role: string };

const db = supabase as any;

export async function getSessionUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

export async function getCondoContext(): Promise<CondoContext | null> {
  const user = await getSessionUser();
  if (!user) return null;
  const { data, error } = await db
    .from("membros_condominio")
    .select("condominio_id,role,condominios(id,nome)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data?.condominios) return null;
  return { id: data.condominios.id, nome: data.condominios.nome, role: data.role };
}

export async function dashboardStats(condominioId: string) {
  const count = async (table: string, extra?: (q: any) => any) => {
    let q = db.from(table).select("*", { count: "exact", head: true }).eq("condominio_id", condominioId);
    if (extra) q = extra(q);
    const { count: n, error } = await q;
    if (error) throw error;
    return n ?? 0;
  };
  const [units, residents, employees, openOccurrences, reservations, visitors, deliveries] = await Promise.all([
    count("unidades"),
    count("moradores", q => q.eq("status","active")),
    count("funcionarios", q => q.eq("status","active")),
    count("ocorrencias", q => q.in("status",["open","analyzing","in_progress"])),
    count("reservas", q => q.in("status",["pending","approved"]).gte("inicio",new Date().toISOString())),
    count("visitantes", q => q.gte("entrada",new Date().toISOString().slice(0,10))),
    count("entregas", q => q.eq("status","waiting_pickup")),
  ]);
  return { units, residents, employees, openOccurrences, reservations, visitors, deliveries };
}

export async function createCondominio(input: {nome:string; cidade?:string; estado?:string; quantidadeUnidades?:number}) {
  const { data, error } = await db.rpc("create_condominio", {
    p_nome: input.nome,
    p_cidade: input.cidade ?? null,
    p_estado: input.estado ?? null,
    p_quantidade_unidades: input.quantidadeUnidades ?? 0,
  });
  if (error) throw error;
  return data as string;
}

export async function completePendingOnboarding(): Promise<"completed" | "needs_onboarding" | "none"> {
  const user = await getSessionUser();
  if (!user) return "none";

  const existing = await getCondoContext();
  if (existing) return "completed";

  const condoName = String(user.user_metadata?.condo_name ?? "").trim();
  if (!condoName) return "needs_onboarding";

  await createCondominio({ nome: condoName });
  return "completed";
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
