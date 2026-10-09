export const MAX_CONDO_LOGO_BYTES = 5 * 1024 * 1024;
export const MAX_DOCUMENT_BYTES = 20 * 1024 * 1024;

const ALLOWED_LOGO_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const ALLOWED_DOCUMENT_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

type UploadFile = Pick<File, "size" | "type">;

export function validateCondoLogo(file: UploadFile): string | null {
  if (!ALLOWED_LOGO_TYPES.has(file.type)) {
    return "O logotipo deve ser um arquivo PNG, JPG ou WEBP.";
  }
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > MAX_CONDO_LOGO_BYTES) {
    return "O logotipo deve ter tamanho maior que zero e no máximo 5 MiB.";
  }
  return null;
}

export function validateDocumentUpload(file: UploadFile): string | null {
  if (!ALLOWED_DOCUMENT_TYPES.has(file.type)) {
    return "Formato não permitido. Envie PDF, PNG, JPG, WEBP, TXT, CSV, DOC, DOCX, XLS ou XLSX.";
  }
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > MAX_DOCUMENT_BYTES) {
    return "O documento deve ter tamanho maior que zero e no máximo 20 MiB.";
  }
  return null;
}
