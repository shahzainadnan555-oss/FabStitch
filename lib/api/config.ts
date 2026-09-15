const LIVE_API_BASE_URL = "https://fabstitch-backend.fastapicloud.dev/api/v1";

function configuredApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
    process.env.VITE_API_BASE_URL?.trim() ||
    LIVE_API_BASE_URL
  );
}

function normalizeBaseUrl(value: string, expectedProtocol: RegExp): string {
  const url = new URL(value);
  if (!expectedProtocol.test(url.protocol)) {
    throw new Error(`Unsupported API protocol: ${url.protocol}`);
  }
  return url.toString().replace(/\/$/, "");
}

export const API_BASE_URL = normalizeBaseUrl(
  configuredApiBaseUrl(),
  /^https?:$/,
);

const apiBase = new URL(API_BASE_URL);
const defaultWebSocketUrl = `${apiBase.protocol === "https:" ? "wss:" : "ws:"}//${apiBase.host}${apiBase.pathname}`;

export const WS_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_WS_BASE_URL?.trim() || defaultWebSocketUrl,
  /^wss?:$/,
);

export function apiUrl(path: string): URL {
  if (/^https?:\/\//i.test(path)) return new URL(path);
  return new URL(`${API_BASE_URL}/${path.replace(/^\/+/, "")}`);
}

export function webSocketUrl(path: string): URL {
  if (/^wss?:\/\//i.test(path)) return new URL(path);
  return new URL(`${WS_BASE_URL}/${path.replace(/^\/+/, "")}`);
}
