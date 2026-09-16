/**
 * Google Analytics 4 helpers.
 * Measurement ID comes from NEXT_PUBLIC_GA_MEASUREMENT_ID (Vercel env).
 */

export type Ga4EventName =
  | "view_fabric"
  | "fabric_search"
  | "filter_used"
  | "signup_started"
  | "signup_completed"
  | "login_started"
  | "login_completed"
  | "inquiry_started"
  | "inquiry_submitted";

export type Ga4EventParams = Record<
  string,
  string | number | boolean | undefined
>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function gaMeasurementId(): string | undefined {
  const value = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (!value || !/^G-[A-Z0-9]+$/i.test(value)) return undefined;
  return value;
}

export function isGaEnabled(): boolean {
  return Boolean(gaMeasurementId());
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  if (typeof window.gtag === "function") {
    window.gtag(...args);
    return;
  }
  // Queue until the gtag.js script defines window.gtag.
  window.dataLayer.push(args);
}

export function trackPageView(url: string) {
  const id = gaMeasurementId();
  if (!id) return;
  gtag("config", id, {
    page_path: url,
  });
}

export function trackGaEvent(name: Ga4EventName, params: Ga4EventParams = {}) {
  if (!gaMeasurementId()) return;
  const cleaned: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    cleaned[key] = value;
  }
  gtag("event", name, cleaned);
}
