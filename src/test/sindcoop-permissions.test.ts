import { describe, expect, it } from "vitest";

import { canAccessModule, canCreateModule, canDeleteModule } from "@/lib/sindcoop-permissions";
import { getDocumentStorageBucket, isFinancialDocumentCategory } from "@/lib/sindcoop-document-storage";

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

describe("SindCoop document storage classification", () => {
  it("routes financial categories to the restricted bucket, including accented Portuguese", () => {
    expect(getDocumentStorageBucket("Financeiro")).toBe("financial-documents");
    expect(getDocumentStorageBucket("Prestação de contas")).toBe("financial-documents");
    expect(getDocumentStorageBucket("Comprovante de pagamento")).toBe("financial-documents");
    expect(getDocumentStorageBucket("Nota fiscal")).toBe("financial-documents");
  });

  it("keeps general condominium documents in the regular private bucket", () => {
    expect(getDocumentStorageBucket("Regimento interno")).toBe("documents");
    expect(getDocumentStorageBucket("Ata de reunião")).toBe("documents");
    expect(isFinancialDocumentCategory("Regulamento da piscina")).toBe(false);
  });
});
