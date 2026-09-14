import "server-only";

import { cookies } from "next/headers";
import {
  api,
  type ApiRequestOptions,
} from "@/lib/api/client";

async function withRequestCookies<TBody>(
  options: ApiRequestOptions<TBody> = {},
): Promise<ApiRequestOptions<TBody>> {
  const cookieStore = await cookies();
  const headers = new Headers(options.headers);
  const cookie = cookieStore.toString();
  if (cookie) headers.set("Cookie", cookie);
  return {
    cache: "no-store",
    ...options,
    headers,
    retryAuth: false,
  };
}

export const serverApi = {
  async get<TResponse>(
    path: string,
    options?: ApiRequestOptions<never>,
  ): Promise<TResponse> {
    return api.get<TResponse>(path, await withRequestCookies(options));
  },
  async post<TResponse, TBody = unknown>(
    path: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse> {
    return api.post<TResponse, TBody>(
      path,
      await withRequestCookies(options),
    );
  },
  async put<TResponse, TBody = unknown>(
    path: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse> {
    return api.put<TResponse, TBody>(
      path,
      await withRequestCookies(options),
    );
  },
  async patch<TResponse, TBody = unknown>(
    path: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse> {
    return api.patch<TResponse, TBody>(
      path,
      await withRequestCookies(options),
    );
  },
  async delete<TResponse>(
    path: string,
    options?: ApiRequestOptions<never>,
  ): Promise<TResponse> {
    return api.delete<TResponse>(path, await withRequestCookies(options));
  },
};
