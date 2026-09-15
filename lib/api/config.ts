const LIVE_API_BASE_URL = "https://fabstitch-backend.fastapicloud.dev/api/v1";

/** Same-origin browser proxy so session cookies stay first-party. */
export const BROWSER_API_PREFIX = "/api/fabstitch";

function normalizeBaseUrl(value: string, expectedProtocol: RegExp): string {
  const url = new URL(value);
  if (!expectedProtocol.test(url.protocol)) {
    throw new Error(`Unsupported API protocol: ${url.protocol}`);
  }
  return url.toString().replace(/\/$/, "");
}

function configuredUrl(
  value: string | undefined,
  expectedProtocol: RegExp,
  fallback: string,
): string {
  const configured = value?.trim();
  if (configured) {
    try {
      return normalizeBaseUrl(configured, expectedProtocol);
    } catch {
      // Empty or invalid Vercel values must not crash `next build`.
    }
  }
  return normalizeBaseUrl(fallback, expectedProtocol);
}

export const API_BASE_URL = configuredUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL,
  /^https?:$/,
  LIVE_API_BASE_URL,
);

const apiBase = new URL(API_BASE_URL);
const defaultWebSocketUrl = `${apiBase.protocol === "https:" ? "wss:" : "ws:"}//${apiBase.host}${apiBase.pathname}`;

export const WS_BASE_URL = configuredUrl(
  process.env.NEXT_PUBLIC_WS_BASE_URL,
  /^wss?:$/,
  defaultWebSocketUrl,
);

function browserOrigin(): string | null {
  if (typeof window === "undefined") return null;
  const origin = window.location?.origin;
  return origin && origin !== "null" ? origin : null;
}

export function apiUrl(path: string): URL {
  if (/^https?:\/\//i.test(path)) return new URL(path);
  const suffix = path.replace(/^\/+/, "");
  const origin = browserOrigin();
  if (origin) {
    return new URL(`${origin}${BROWSER_API_PREFIX}/${suffix}`);
  }
  return new URL(`${API_BASE_URL}/${suffix}`);
}

export function webSocketUrl(path: string): URL {
  if (/^wss?:\/\//i.test(path)) return new URL(path);
  return new URL(`${WS_BASE_URL}/${path.replace(/^\/+/, "")}`);
}
