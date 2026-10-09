import { describe, expect, it } from "vitest";

import { canAccessModule, canCreateModule, canDeleteModule } from "@/lib/sindcoop-permissions";

describe("SindCoop role permissions", () => {
  it("allows sub-síndicos to access documents but not finance", () => {
    expect(canAccessModule("sub_sindico", "documentos")).toBe(true);
    expect(canAccessModule("sub_sindico", "financeiro")).toBe(false);
  });

  it("limits financial write and delete permissions to management roles", () => {
    expect(canCreateModule("sindico", "financeiro")).toBe(true);
    expect(canCreateModule("morador", "financeiro")).toBe(false);
    expect(canDeleteModule("administrador", "financeiro")).toBe(true);
    expect(canDeleteModule("morador", "financeiro")).toBe(false);
  });

  it("denies unknown roles and modules by default", () => {
    expect(canAccessModule("role_desconhecida", "moradores")).toBe(false);
    expect(canCreateModule("administrador", "modulo_inexistente")).toBe(false);
    expect(canDeleteModule("administrador", "modulo_inexistente")).toBe(false);
  });
});
