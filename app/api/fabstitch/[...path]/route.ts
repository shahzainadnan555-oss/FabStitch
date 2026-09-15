import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/config";

const HOP_BY_HOP = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
]);

function backendUrl(path: string[], search: string): string {
  return `${API_BASE_URL}/${path.join("/")}${search}`;
}

function rewriteSetCookie(value: string): string {
  let cookie = value.replace(/;\s*Domain=[^;]*/gi, "");
  if (process.env.NODE_ENV !== "production") {
    cookie = cookie.replace(/;\s*Secure/gi, "");
  }
  return cookie;
}

async function proxy(
  request: NextRequest,
  path: string[],
): Promise<NextResponse> {
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    const name = key.toLowerCase();
    if (HOP_BY_HOP.has(name)) return;
    if (name === "accept-encoding") return;
    headers.set(key, value);
  });

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  const upstream = await fetch(backendUrl(path, request.nextUrl.search), {
    method: request.method,
    headers,
    body,
    redirect: "manual",
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") return;
    if (HOP_BY_HOP.has(key.toLowerCase())) return;
    responseHeaders.set(key, value);
  });

  const cookies =
    typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : [];
  for (const cookie of cookies) {
    responseHeaders.append("set-cookie", rewriteSetCookie(cookie));
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

async function handle(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { path } = await context.params;
  return proxy(request, path);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const OPTIONS = handle;
