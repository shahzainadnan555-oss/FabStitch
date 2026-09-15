"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { postAuthDestination } from "./destination";
import { useSession } from "./session";

/** Sends an already-authenticated customer away from sign-in/sign-up. */
export function RedirectIfAuthenticated({
  next,
  disabled = false,
}: {
  next: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const { hydrated, authenticated, user } = useSession();

  useEffect(() => {
    if (disabled || !hydrated || !authenticated || !user) return;
    router.replace(postAuthDestination(user.onboarding_completed, next));
  }, [authenticated, disabled, hydrated, next, router, user]);

  return null;
}
