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

/**
 * Finalize authentication once, then navigate once.
 * Never navigate before the shared session reflects the backend user.
 */
export async function finalizeAuthentication(
  user: UserPublic,
  session: SessionActions,
  router: RouterLike,
  next?: string | null,
): Promise<void> {
  session.adoptUser(user);
  await session.refresh({ persistOnUnauthorized: true }).catch(() => {});
  router.replace(postAuthDestination(user.onboarding_completed, next));
}
