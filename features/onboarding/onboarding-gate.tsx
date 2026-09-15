"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { Wordmark } from "@/components/layout/logo";
import { AccountMenu } from "@/features/account/account-menu";
import { useSession } from "@/features/auth/session";
import { loginHref } from "@/features/auth/return-to";
import { postAuthDestination } from "@/features/auth/destination";
import { api } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";
import type { components } from "@/lib/api/schema";
import { OnboardingExperience } from "./onboarding-experience";
import { onboardingHref } from "./profile";

type OnboardingState = components["schemas"]["OnboardingStateResponse"];
type OnboardingOptions = components["schemas"]["OnboardingOptionsResponse"];

export function OnboardingGate({ next }: { next: string }) {
  const router = useRouter();
  const { hydrated, authenticated, user } = useSession();
  const [initial, setInitial] = useState<OnboardingState | null>(null);
  const [options, setOptions] = useState<OnboardingOptions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    if (!hydrated) return;
    if (!authenticated) {
      router.replace(loginHref(onboardingHref(next)));
      return;
    }
    if (user?.onboarding_completed) {
      router.replace(postAuthDestination(true, next));
    }
  }, [authenticated, hydrated, next, router, user]);

  useEffect(() => {
    if (!hydrated || !authenticated || user?.onboarding_completed) return;
    let cancelled = false;
    Promise.all([
      api.get<OnboardingState>("/account/onboarding", { cache: "no-store" }),
      api.get<OnboardingOptions>("/account/onboarding/options", {
        cache: "no-store",
      }),
    ])
      .then(([state, nextOptions]) => {
        if (cancelled) return;
        if (state.onboarding_completed) {
          router.replace(postAuthDestination(true, next));
          return;
        }
        setInitial(state);
        setOptions(nextOptions);
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;
        setError(
          apiErrorMessage(requestError, "We couldn't load your choices."),
        );
      });
    return () => {
      cancelled = true;
    };
  }, [
    authenticated,
    hydrated,
    loadAttempt,
    next,
    router,
    user?.onboarding_completed,
  ]);

  return (
    <main className="min-h-dvh bg-chrome">
      <div className="border-b border-rule-2 bg-paper-raised">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" aria-label="FabStitch home">
            <Wordmark />
          </Link>
          <AccountMenu />
        </Container>
      </div>
      <Container className="py-6 sm:py-9">
        {!hydrated ? (
          <p
            aria-busy="true"
            aria-live="polite"
            className="text-body text-ink-2"
          >
            Preparing your setup…
          </p>
        ) : !authenticated ? (
          <p
            aria-busy="true"
            aria-live="polite"
            className="text-body text-ink-2"
          >
            Taking you to sign in…
          </p>
        ) : user?.onboarding_completed ? (
          <p
            aria-busy="true"
            aria-live="polite"
            className="text-body text-ink-2"
          >
            Opening FabStitch…
          </p>
        ) : error ? (
          <div className="flex flex-col gap-4">
            <p role="alert" className="text-body text-ink-2">
              {error}
            </p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setInitial(null);
                setOptions(null);
                setLoadAttempt((attempt) => attempt + 1);
              }}
              className="inline-flex h-11 w-fit items-center rounded-sm bg-indigo px-5 text-sm font-semibold text-white hover:bg-indigo-hover"
            >
              Try again
            </button>
          </div>
        ) : initial && options ? (
          <OnboardingExperience
            initial={initial}
            options={options}
            next={next}
          />
        ) : (
          <p
            aria-busy="true"
            aria-live="polite"
            className="text-body text-ink-2"
          >
            Preparing your setup…
          </p>
        )}
      </Container>
    </main>
  );
}
