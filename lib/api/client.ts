import { apiUrl } from "@/lib/api/config";
import { ApiError, normalizeApiError } from "@/lib/api/errors";
import { appendQuery, type ApiQuery } from "@/lib/api/query";
import { isRetryableReadError, withReadRetries } from "@/lib/api/read-retry";

type NextFetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

export type ApiRequestOptions<TBody = unknown> = Omit<
  RequestInit,
  "body" | "method"
> & {
  body?: TBody;
  query?: ApiQuery;
  retryAuth?: boolean;
  /** When false, skip automatic GET retries (default: retry safe GET failures). */
  retryReads?: boolean;
  next?: NextFetchOptions;
};

let refreshFlight: Promise<void> | null = null;
const inflightGets = new Map<string, Promise<unknown>>();

function dispatchSessionExpired() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fabstitch:session-expired"));
  }
}

async function responseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json().catch(() => undefined);
  }
  const text = await response.text();
  return text || undefined;
}

async function refreshSession(): Promise<void> {
  if (!refreshFlight) {
    refreshFlight = (async () => {
      const response = await fetch(apiUrl("/auth/session/refresh"), {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const body = await responseBody(response);
      if (!response.ok) {
        throw normalizeApiError(
          response.status,
          body,
          response.headers.get("x-request-id"),
          response.headers.get("retry-after"),
        );
      }
    })().finally(() => {
      refreshFlight = null;
    });
  }
  return refreshFlight;
}

function requestUrl(path: string, query?: ApiQuery): URL {
  const url = apiUrl(path);
  if (query) appendQuery(url.searchParams, query);
  return url;
}

async function performRequest<TResponse, TBody>(
  method: string,
  path: string,
  options: ApiRequestOptions<TBody>,
): Promise<TResponse> {
  const {
    body: requestBody,
    query,
    retryAuth: _retryAuth,
    retryReads: _retryReads,
    ...requestInit
  } = options;
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  let body: BodyInit | undefined;
  if (requestBody !== undefined) {
    if (
      requestBody instanceof FormData ||
      requestBody instanceof URLSearchParams ||
      typeof requestBody === "string" ||
      requestBody instanceof Blob ||
      requestBody instanceof ArrayBuffer
    ) {
      body = requestBody;
    } else {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(requestBody);
    }
  }

  const url = requestUrl(path, query).toString();
  const execute = async () => {
    const response = await fetch(url, {
      ...requestInit,
      method,
      headers,
      body,
      credentials: options.credentials ?? "include",
    });
    const parsed = await responseBody(response);
    if (!response.ok) {
      throw normalizeApiError(
        response.status,
        parsed,
        response.headers.get("x-request-id"),
        response.headers.get("retry-after"),
      );
    }
    return parsed as TResponse;
  };

  if (method === "GET") {
    const existing = inflightGets.get(url);
    if (existing) return existing as Promise<TResponse>;
    const promise = execute().finally(() => {
      inflightGets.delete(url);
    });
    inflightGets.set(url, promise);
    return promise;
  }

  return execute();
}

export async function apiRequest<TResponse, TBody = unknown>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  options: ApiRequestOptions<TBody> = {},
): Promise<TResponse> {
  const runOnce = async () => {
    try {
      return await performRequest<TResponse, TBody>(method, path, options);
    } catch (error) {
      const mayRefresh =
        error instanceof ApiError &&
        error.status === 401 &&
        options.retryAuth !== false &&
        typeof window !== "undefined" &&
        !path.startsWith("/auth/");
      if (!mayRefresh) throw error;

      try {
        await refreshSession();
        return await performRequest<TResponse, TBody>(method, path, {
          ...options,
          retryAuth: false,
        });
      } catch (refreshError) {
        dispatchSessionExpired();
        throw refreshError;
      }
    }
  };

  const shouldRetryReads = method === "GET" && options.retryReads !== false;

  if (!shouldRetryReads) return runOnce();

  try {
    return await withReadRetries(runOnce);
  } catch (error) {
    if (isRetryableReadError(error) || error instanceof ApiError) throw error;
    throw error;
  }
}

export const api = {
  get<TResponse>(
    path: string,
    options?: ApiRequestOptions<never>,
  ): Promise<TResponse> {
    return apiRequest<TResponse>("GET", path, options);
  },
  post<TResponse, TBody = unknown>(
    path: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse> {
    return apiRequest<TResponse, TBody>("POST", path, options);
  },
  put<TResponse, TBody = unknown>(
    path: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse> {
    return apiRequest<TResponse, TBody>("PUT", path, options);
  },
  patch<TResponse, TBody = unknown>(
    path: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse> {
    return apiRequest<TResponse, TBody>("PATCH", path, options);
  },
  delete<TResponse>(
    path: string,
    options?: ApiRequestOptions<never>,
  ): Promise<TResponse> {
    return apiRequest<TResponse>("DELETE", path, options);
  },
};
