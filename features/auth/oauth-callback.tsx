"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FabStitchPageLoader } from "@/components/brand/fabstitch-loader";
import { postAuthDestination } from "./destination";
import { googleAuthErrorMessage } from "./messages";
import { useSession } from "./session";
import { loginHref } from "./return-to";
import { AuthMessage } from "./ui";

export function OAuthCallback({
  next,
  error,
}: {
  next: string;
  error?: string | null;
}) {
  const router = useRouter();
  const { hydrated, authenticated, user, refresh } = useSession();
  const [, startTransition] = useTransition();
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
    startTransition(() => {
      router.replace(postAuthDestination(user.onboarding_completed, next));
    });
  }, [authenticated, checked, error, hydrated, next, router, user]);

  if (failed) {
    return (
      <div className="flex flex-col gap-5">
        <AuthMessage tone="error">{failed}</AuthMessage>
        <Link
          href={loginHref(next)}
          className="inline-flex h-12 items-center justify-center rounded-md bg-indigo px-5 text-sm font-semibold text-white hover:bg-indigo-hover"
        >
          Continue to sign in
        </Link>
      </div>
    );
  }

  return <FabStitchPageLoader label="Signing you in" />;
}
