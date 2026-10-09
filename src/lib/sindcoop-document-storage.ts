const FINANCIAL_CATEGORY_TERMS = [
  "finance",
  "prestacao de contas",
  "comprovante",
  "pagamento",
  "nota fiscal",
  "receita",
  "despesa",
  "boleto",
  "balancete",
  "orcamento",
  "cobranca",
  "fatura",
];

export function isFinancialDocumentCategory(category: string): boolean {
  const normalized = category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();

  return FINANCIAL_CATEGORY_TERMS.some((term) => normalized.includes(term));
}

export function getDocumentStorageBucket(category: string): "documents" | "financial-documents" {
  return isFinancialDocumentCategory(category) ? "financial-documents" : "documents";
}
