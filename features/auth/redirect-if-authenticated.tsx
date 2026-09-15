"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { postAuthDestination } from "./destination";
import { useSession } from "./session";

/** Sends an already-authenticated customer away from sign-in/sign-up. */
export function RedirectIfAuthenticated({ next }: { next: string }) {
  const router = useRouter();
  const { hydrated, authenticated, user } = useSession();

  useEffect(() => {
    if (!hydrated || !authenticated || !user) return;
    router.replace(postAuthDestination(user.onboarding_completed, next));
  }, [authenticated, hydrated, next, router, user]);

  return null;
}
