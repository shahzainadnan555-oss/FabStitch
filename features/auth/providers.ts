import "server-only";

import { API_BASE_URL, apiUrl } from "@/lib/api/config";
import { serverApi } from "@/lib/api/server";
import type { components } from "@/lib/api/schema";
import { safeReturnPath } from "./return-to";

export type AuthProvider = {
  provider: "google";
  configured: boolean;
  authorizeHref: string | null;
};

type OAuthProvidersResponse = components["schemas"]["OAuthProvidersResponse"];

function authorizeHref(
  path: string | null | undefined,
  next?: string,
): string | null {
  if (!path) return null;
  const href = path.startsWith("/")
    ? new URL(path, new URL(API_BASE_URL).origin)
    : apiUrl(path);
  const destination = safeReturnPath(next);
  const callback =
    destination === "/"
      ? "/auth/callback/"
      : `/auth/callback/?next=${encodeURIComponent(destination)}`;
  href.searchParams.set("next", callback);
  return href.toString();
}

export async function authProviders(next?: string): Promise<AuthProvider[]> {
  try {
    const response = await serverApi.get<OAuthProvidersResponse>(
      "/auth/oauth/providers",
      { cache: "no-store" },
    );
    return response.providers.flatMap((provider) => {
      const name = provider.name.toLowerCase();
      if (name !== "google") return [];
      return [
        {
          provider: name,
          configured: provider.configured,
          authorizeHref: provider.configured
            ? authorizeHref(provider.authorize_path, next)
            : null,
        },
      ];
    });
  } catch {
    return [];
  }
}
