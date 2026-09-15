const LIVE_API_BASE_URL = "https://api.fabstitch.net/api/v1";

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

export function apiUrl(path: string): URL {
  if (/^https?:\/\//i.test(path)) return new URL(path);
  return new URL(`${API_BASE_URL}/${path.replace(/^\/+/, "")}`);
}

export function webSocketUrl(path: string): URL {
  if (/^wss?:\/\//i.test(path)) return new URL(path);
  return new URL(`${WS_BASE_URL}/${path.replace(/^\/+/, "")}`);
}
