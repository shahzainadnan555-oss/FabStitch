/**
 * Finalize authentication once, then navigate once.
 *
 * Email OTP and password login both call this. Google OAuth converges on the
 * same destination helper after /auth/me refresh in OAuthCallback.
 *
 * Onboarding routing always uses the authenticated account flag from the
 * backend user payload — never a browser-local first-visit flag.
 */
import type { components } from "@/lib/api/schema";
import { postAuthDestination } from "./destination";

type UserPublic = components["schemas"]["UserPublic"];

type SessionActions = {
  adoptUser: (user: UserPublic) => void;
  refresh: (options?: { persistOnUnauthorized?: boolean }) => Promise<void>;
};

type RouterLike = {
  replace: (href: string) => void;
};

export async function finalizeAuthentication(
  user: UserPublic,
  session: SessionActions,
  router: RouterLike,
  next?: string | null,
): Promise<void> {
  session.adoptUser(user);
  // Refresh reconciles cookies/session with /auth/me. The login/signup user
  // payload remains the authoritative onboarding flag for this navigation.
  await session.refresh({ persistOnUnauthorized: true }).catch(() => {});
  router.replace(postAuthDestination(Boolean(user.onboarding_completed), next));
}
