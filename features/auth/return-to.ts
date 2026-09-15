/**
 * Return-to routing.
 *
 * The brief is explicit (§27): a buyer who hits the sign-in wall part-way
 * through a sample request or an RFQ must land back on exactly the action they
 * started, not on a dashboard. So every gated action carries where it came
 * from, and auth hands it back.
 *
 * Security note: the destination is validated as a same-origin **path** before
 * use. An unvalidated `?next=` is an open-redirect, which is how phishing links
 * borrow a real domain's credibility.
 */

export const RETURN_PARAM = "next";

/** Default landing when there is nothing to return to. */
const FALLBACK = "/";

/**
 * Whitespace and C0/C7F control characters.
 *
 * Browsers **remove** tab, newline and carriage return while parsing a URL, so
 * `/\t/evil.example` passes a naive "starts with a single slash" check and then
 * loads as `//evil.example` - protocol-relative, and an open redirect. Nothing
 * legitimate on this site has one of these in its path, so a value carrying one
 * was constructed rather than typed, and is refused rather than sanitised.
 */
const UNSAFE_CHARACTERS = /[\s\u0000-\u001f\u007f]/;

/**
 * Accepts only root-relative paths. Rejects absolute URLs, protocol-relative
 * URLs (`//evil.com`), and anything with a scheme or backslash trickery.
 */
export function safeReturnPath(raw: string | null | undefined): string {
  if (!raw) return FALLBACK;

  const value = raw.trim();
  if (UNSAFE_CHARACTERS.test(value)) return FALLBACK;
  if (!value.startsWith("/")) return FALLBACK;
  if (value.startsWith("//") || value.startsWith("/\\")) return FALLBACK;
  if (/^\/+[a-z][a-z0-9+.-]*:/i.test(value)) return FALLBACK;

  // Normalise away any encoded traversal before it reaches the router, then
  // re-run every check: `%2f%2fevil.example` and `%09` are only dangerous once
  // they stop being percent-encoded, and a single pass would miss both.
  let decoded: string;
  try {
    decoded = decodeURI(value);
  } catch {
    return FALLBACK;
  }
  if (UNSAFE_CHARACTERS.test(decoded)) return FALLBACK;
  if (decoded.startsWith("//") || decoded.startsWith("/\\")) return FALLBACK;
  if (decoded.includes("\\") || decoded.includes("://")) return FALLBACK;
  if (/^\/+[a-z][a-z0-9+.-]*:/i.test(decoded)) return FALLBACK;

  return decoded;
}

/** Builds the sign-in URL for a gated action. */
export function loginHref(returnTo: string): string {
  const safe = safeReturnPath(returnTo);
  return safe === FALLBACK
    ? "/login/"
    : `/login/?${RETURN_PARAM}=${encodeURIComponent(safe)}`;
}

/** Builds the join URL for a gated action, carrying the same destination. */
export function signupHref(returnTo: string): string {
  const safe = safeReturnPath(returnTo);
  return safe === FALLBACK
    ? "/signup/"
    : `/signup/?${RETURN_PARAM}=${encodeURIComponent(safe)}`;
}

/** Human description of the interrupted action, shown on the auth screen. */
export function describeReturn(path: string): string | null {
  const safe = safeReturnPath(path);
  if (safe.startsWith("/rfq/")) {
    if (safe.includes("intent=sample")) return "your sample request";
    if (safe.includes("intent=quote")) return "your quote request";
    return "your sourcing request";
  }
  if (safe.startsWith("/compare/")) return "your comparison";
  if (safe.includes("/request-sample")) return "your sample request";
  if (safe.includes("/request-quote")) return "your quote request";
  if (safe.includes("/contact")) return "your message";
  if (safe.startsWith("/inquiries")) return "your inquiries";
  if (safe.startsWith("/fabrics/")) return "the fabric you were viewing";
  if (safe.startsWith("/listings/")) return "the listing you were viewing";
  if (safe.startsWith("/suppliers/")) return "the page you were viewing";
  return null;
}
