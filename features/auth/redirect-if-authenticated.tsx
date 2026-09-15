"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "./session";
import { onboardingHref } from "@/features/onboarding/profile";
import { safeReturnPath } from "./return-to";

function destination(completed: boolean, next: string) {
  const requested = safeReturnPath(next);
  if (!completed) return onboardingHref(requested);
  return requested === "/" ? "/marketplace/" : requested;
}

/** Sends an already-authenticated customer away from sign-in/sign-up. */
export function RedirectIfAuthenticated({ next }: { next: string }) {
  const router = useRouter();
  const { hydrated, authenticated, user } = useSession();

  useEffect(() => {
    if (!hydrated || !authenticated || !user) return;
    router.replace(destination(user.onboarding_completed, next));
  }, [authenticated, hydrated, next, router, user]);

  return null;
}
