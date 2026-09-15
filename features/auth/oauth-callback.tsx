"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthMessage } from "./controls";
import { googleAuthErrorMessage } from "./messages";
import { useSession } from "./session";
import { loginHref, safeReturnPath } from "./return-to";
import { onboardingHref } from "@/features/onboarding/profile";

function destination(completed: boolean, next: string) {
  const requested = safeReturnPath(next);
  if (!completed) return onboardingHref(requested);
  return requested === "/" ? "/marketplace/" : requested;
}

export function OAuthCallback({
  next,
  error,
}: {
  next: string;
  error?: string | null;
}) {
  const router = useRouter();
  const { hydrated, authenticated, user, refresh } = useSession();
  const failed =
    error || (hydrated && !authenticated)
      ? googleAuthErrorMessage(error)
      : null;

  useEffect(() => {
    if (error) return;
    void refresh().catch(() => {});
  }, [error, refresh]);

  useEffect(() => {
    if (error || !hydrated || !authenticated || !user) return;
    router.replace(destination(user.onboarding_completed, next));
    router.refresh();
  }, [authenticated, error, hydrated, next, router, user]);

  if (failed) {
    return (
      <div className="flex flex-col gap-5">
        <AuthMessage tone="error">{failed}</AuthMessage>
        <Link
          href={loginHref(next)}
          className="inline-flex h-11 items-center justify-center rounded-sm bg-indigo px-5 text-sm font-semibold text-white hover:bg-indigo-hover"
        >
          Continue to sign in
        </Link>
      </div>
    );
  }

  return (
    <p aria-busy="true" aria-live="polite" className="text-body text-ink-2">
      Signing you in…
    </p>
  );
}
