export const MODULE_ROLES: Record<string, readonly string[]> = {
  condominio: ["super_admin", "administrador", "sindico", "sub_sindico", "morador", "funcionario", "porteiro"],
  unidades: ["super_admin", "administrador", "sindico", "sub_sindico", "morador", "funcionario", "porteiro"],
  "areas-comuns": ["super_admin", "administrador", "sindico", "sub_sindico", "morador", "funcionario", "porteiro"],
  moradores: ["super_admin", "administrador", "sindico", "sub_sindico", "morador"],
  funcionarios: ["super_admin", "administrador", "sindico"],
  veiculos: ["super_admin", "administrador", "sindico", "sub_sindico", "morador", "porteiro"],
  animais: ["super_admin", "administrador", "sindico", "sub_sindico", "morador"],
  avisos: ["super_admin", "administrador", "sindico", "sub_sindico", "morador", "funcionario", "porteiro"],
  ocorrencias: ["super_admin", "administrador", "sindico", "sub_sindico", "morador", "funcionario", "porteiro"],
  reservas: ["super_admin", "administrador", "sindico", "sub_sindico", "morador"],
  portaria: ["super_admin", "administrador", "sindico", "sub_sindico", "porteiro"],
  visitantes: ["super_admin", "administrador", "sindico", "sub_sindico", "morador", "porteiro"],
  entregas: ["super_admin", "administrador", "sindico", "sub_sindico", "morador", "porteiro"],
  documentos: ["super_admin", "administrador", "sindico", "sub_sindico", "morador", "funcionario"],
  financeiro: ["super_admin", "administrador", "sindico"],
  relatorios: ["super_admin", "administrador"],
  configuracoes: ["super_admin", "administrador"],
};

const CREATE_ROLES: Record<string, readonly string[]> = {
  "areas-comuns": ["super_admin", "administrador", "sindico", "sub_sindico"],
  unidades: ["super_admin", "administrador", "sindico", "sub_sindico"],
  moradores: ["super_admin", "administrador", "sindico", "sub_sindico"],
  funcionarios: ["super_admin", "administrador", "sindico"],
  veiculos: ["super_admin", "administrador", "sindico", "sub_sindico"],
  animais: ["super_admin", "administrador", "sindico", "sub_sindico"],
  avisos: ["super_admin", "administrador", "sindico", "sub_sindico"],
  ocorrencias: ["super_admin", "administrador", "sindico", "sub_sindico", "morador", "funcionario", "porteiro"],
  reservas: ["super_admin", "administrador", "sindico", "sub_sindico", "morador"],
  portaria: ["super_admin", "administrador", "sindico", "sub_sindico", "porteiro"],
  visitantes: ["super_admin", "administrador", "sindico", "sub_sindico", "porteiro"],
  entregas: ["super_admin", "administrador", "sindico", "sub_sindico", "porteiro"],
  financeiro: ["super_admin", "administrador", "sindico"],
};

const DELETE_ROLES: Record<string, readonly string[]> = {
  "areas-comuns": ["super_admin", "administrador", "sindico", "sub_sindico"],
  unidades: ["super_admin", "administrador", "sindico", "sub_sindico"],
  moradores: ["super_admin", "administrador", "sindico", "sub_sindico"],
  funcionarios: ["super_admin", "administrador", "sindico"],
  veiculos: ["super_admin", "administrador", "sindico", "sub_sindico"],
  animais: ["super_admin", "administrador", "sindico", "sub_sindico"],
  avisos: ["super_admin", "administrador", "sindico", "sub_sindico"],
  ocorrencias: ["super_admin", "administrador"],
  reservas: ["super_admin", "administrador"],
  financeiro: ["super_admin", "administrador", "sindico"],
};

export function canAccessModule(role: string, module: string): boolean {
  return MODULE_ROLES[module]?.includes(role) ?? false;
}

export function canCreateModule(role: string, module: string): boolean {
  return CREATE_ROLES[module]?.includes(role) ?? false;
}

export function canDeleteModule(role: string, module: string): boolean {
  return DELETE_ROLES[module]?.includes(role) ?? false;
}
