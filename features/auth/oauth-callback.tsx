"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthMessage } from "./controls";
import { postAuthDestination } from "./destination";
import { googleAuthErrorMessage } from "./messages";
import { useSession } from "./session";
import { loginHref } from "./return-to";

export function OAuthCallback({
  next,
  error,
}: {
  next: string;
  error?: string | null;
}) {
  const router = useRouter();
  const { hydrated, authenticated, user, refresh } = useSession();
  const [checked, setChecked] = useState(Boolean(error));
  const failed =
    error || (checked && hydrated && !authenticated)
      ? googleAuthErrorMessage(error)
      : null;

  useEffect(() => {
    if (error) return;
    let cancelled = false;
    void refresh()
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, [error, refresh]);

  useEffect(() => {
    if (error || !checked || !hydrated || !authenticated || !user) return;
    router.replace(postAuthDestination(user.onboarding_completed, next));
  }, [authenticated, checked, error, hydrated, next, router, user]);

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
