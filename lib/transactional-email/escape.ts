/** Escape customer-controlled strings for email-safe HTML. */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function escapeAttr(value: string): string {
  return escapeHtml(value);
}

/** Preserve line breaks as <br> after escaping. */
export function escapeHtmlMultiline(value: string): string {
  return escapeHtml(value).replace(/\r\n|\r|\n/g, "<br />");
}

export function present(value: string | null | undefined): string | null {
  const next = (value ?? "").trim();
  return next ? next : null;
}
