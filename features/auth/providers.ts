import "server-only";

import { API_BASE_URL, apiUrl } from "@/lib/api/config";
import { serverApi } from "@/lib/api/server";
import type { components } from "@/lib/api/schema";

export type AuthProvider = {
  provider: "google";
  configured: boolean;
  authorizeHref: string | null;
};

type OAuthProvidersResponse = components["schemas"]["OAuthProvidersResponse"];

function authorizeHref(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("/")) {
    return new URL(path, new URL(API_BASE_URL).origin).toString();
  }
  return apiUrl(path).toString();
}

export async function authProviders(): Promise<AuthProvider[]> {
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
            ? authorizeHref(provider.authorize_path)
            : null,
        },
      ];
    });
  } catch {
    return [];
  }
}
