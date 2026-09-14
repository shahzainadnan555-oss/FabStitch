const DEFAULT_API_BASE_URL = "http://localhost:8000/api/v1";

function normalizeBaseUrl(value: string, expectedProtocol: RegExp): string {
  const url = new URL(value);
  if (!expectedProtocol.test(url.protocol)) {
    throw new Error(`Unsupported API protocol: ${url.protocol}`);
  }
  return url.toString().replace(/\/$/, "");
}

export const API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  /^https?:$/,
);

const apiBase = new URL(API_BASE_URL);
const defaultWebSocketUrl = `${apiBase.protocol === "https:" ? "wss:" : "ws:"}//${apiBase.host}${apiBase.pathname}`;

export const WS_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_WS_BASE_URL ?? defaultWebSocketUrl,
  /^wss?:$/,
);

export function apiUrl(path: string): URL {
  if (/^https?:\/\//i.test(path)) return new URL(path);
  return new URL(
    `${API_BASE_URL}/${path.replace(/^\/+/, "")}`,
  );
}

export function webSocketUrl(path: string): URL {
  if (/^wss?:\/\//i.test(path)) return new URL(path);
  return new URL(
    `${WS_BASE_URL}/${path.replace(/^\/+/, "")}`,
  );
}
