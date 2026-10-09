import { describe, expect, it } from "vitest";
import {
  MAX_CONDO_LOGO_BYTES,
  MAX_DOCUMENT_BYTES,
  validateCondoLogo,
  validateDocumentUpload,
} from "../lib/sindcoop-upload-validation";

describe("upload validation", () => {
  it("accepts supported condo logo formats under 5 MiB", () => {
    expect(validateCondoLogo({ type: "image/png", size: 1024 })).toBeNull();
    expect(validateCondoLogo({ type: "image/webp", size: MAX_CONDO_LOGO_BYTES })).toBeNull();
  });

  it("rejects SVG and oversized condo logos", () => {
    expect(validateCondoLogo({ type: "image/svg+xml", size: 1024 })).toMatch(/PNG, JPG ou WEBP/);
    expect(validateCondoLogo({ type: "image/png", size: MAX_CONDO_LOGO_BYTES + 1 })).toMatch(/5 MiB/);
  });

  it("accepts common document formats under 20 MiB", () => {
    expect(validateDocumentUpload({ type: "application/pdf", size: 1024 })).toBeNull();
    expect(validateDocumentUpload({
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: MAX_DOCUMENT_BYTES,
    })).toBeNull();
  });

  it("rejects unsupported types and oversized documents", () => {
    expect(validateDocumentUpload({ type: "application/x-msdownload", size: 1024 })).toMatch(/Formato não permitido/);
    expect(validateDocumentUpload({ type: "application/pdf", size: MAX_DOCUMENT_BYTES + 1 })).toMatch(/20 MiB/);
  });

  it("rejects empty files", () => {
    expect(validateDocumentUpload({ type: "application/pdf", size: 0 })).toMatch(/maior que zero/);
  });
});
