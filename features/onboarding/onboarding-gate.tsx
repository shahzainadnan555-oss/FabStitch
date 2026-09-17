"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FabStitchLoader } from "@/components/brand/fabstitch-loader";
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

/**
 * Account-backed onboarding gate.
 *
 * loading → required | completed is driven by:
 * 1. Session hydration / authentication
 * 2. user.onboarding_completed from the account
 * 3. GET /account/onboarding as the source of truth when the session flag is false
 */
export function OnboardingGate({ next }: { next: string }) {
  const router = useRouter();
  const { hydrated, authenticated, user, setOnboarding } = useSession();
  const [isNavigating, startTransition] = useTransition();
  const [initial, setInitial] = useState<OnboardingState | null>(null);
  const [options, setOptions] = useState<OnboardingOptions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [accountConfirmedComplete, setAccountConfirmedComplete] =
    useState(false);
  const [accountLoadDone, setAccountLoadDone] = useState(false);

  const sessionComplete = Boolean(user?.onboarding_completed);
  const completed = sessionComplete || accountConfirmedComplete;
  const loading =
    !hydrated ||
    (authenticated && !completed && !accountLoadDone && !error) ||
    (hydrated && !authenticated);

  useEffect(() => {
    if (!hydrated) return;
    if (!authenticated) {
      startTransition(() => {
        router.replace(loginHref(onboardingHref(next)));
      });
      return;
    }
    if (sessionComplete) {
      startTransition(() => {
        router.replace(postAuthDestination(true, next));
      });
    }
  }, [authenticated, hydrated, next, router, sessionComplete]);

  useEffect(() => {
    if (!hydrated || !authenticated || sessionComplete) return;
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
          setOnboarding(state);
          setAccountConfirmedComplete(true);
          setAccountLoadDone(true);
          startTransition(() => {
            router.replace(postAuthDestination(true, next));
          });
          return;
        }
        setInitial(state);
        setOptions(nextOptions);
        setAccountLoadDone(true);
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;
        setError(
          apiErrorMessage(requestError, "We couldn't load your choices."),
        );
        setAccountLoadDone(true);
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
    sessionComplete,
    setOnboarding,
  ]);

  const showBrandedLoader = loading || completed || isNavigating;

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
        {showBrandedLoader ? (
          <div className="flex min-h-[min(22rem,55dvh)] items-center justify-center">
            <FabStitchLoader
              variant="content"
              label={
                completed || isNavigating
                  ? "Opening FabStitch"
                  : !hydrated || (authenticated && !accountLoadDone)
                    ? "Preparing your setup"
                    : "Taking you to sign in"
              }
            />
          </div>
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
                setAccountLoadDone(false);
                setAccountConfirmedComplete(false);
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
          <div className="flex min-h-[min(22rem,55dvh)] items-center justify-center">
            <FabStitchLoader variant="content" label="Preparing your setup" />
          </div>
        )}
      </Container>
    </main>
  );
}
