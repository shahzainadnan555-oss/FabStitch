"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FabStitchLoader } from "@/components/brand/fabstitch-loader";
import { Container } from "@/components/ui/layout";
import { PageHeader } from "@/components/marketplace/page-header";
import { AccountSummary } from "@/features/account/account-summary";
import { AccountMarketPreferences } from "@/features/preferences/account-market-preferences";
import { OnboardingExperience } from "@/features/onboarding/onboarding-experience";
import { SavedPreferences } from "@/features/onboarding/saved-preferences";
import { useSession } from "@/features/auth/session";
import { api } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";
import type { components } from "@/lib/api/schema";

type Schema = components["schemas"];
type UserPublic = Schema["UserPublic"];
type OnboardingState = Schema["OnboardingStateResponse"];
type OnboardingOptions = Schema["OnboardingOptionsResponse"];

export function AccountPreferencesPage() {
  const searchParams = useSearchParams();
  const editing = searchParams.get("edit") === "1";
  const saved = searchParams.get("saved") === "1";
  const { hydrated, authenticated, user, profile } = useSession();
  const [account, setAccount] = useState<UserPublic | null>(
    profile ?? user ?? null,
  );
  const [initial, setInitial] = useState<OnboardingState | null>(null);
  const [options, setOptions] = useState<OnboardingOptions | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated || !authenticated) return;
    let cancelled = false;
    Promise.all([
      api.get<UserPublic>("/account/profile", { cache: "no-store" }),
      api.get<OnboardingState>("/account/onboarding", { cache: "no-store" }),
      api.get<OnboardingOptions>("/account/onboarding/options", {
        cache: "no-store",
      }),
    ])
      .then(([nextProfile, nextInitial, nextOptions]) => {
        if (cancelled) return;
        setAccount(nextProfile);
        setInitial(nextInitial);
        setOptions(nextOptions);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;
        setError(
          apiErrorMessage(
            requestError,
            "Your preferences could not be loaded. Try again.",
          ),
        );
      });
    return () => {
      cancelled = true;
    };
  }, [authenticated, hydrated]);

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Account", href: "/account/" },
          { label: "Preferences" },
        ]}
        eyebrow="Account"
        title={editing ? "Edit your fabric preferences" : "Your preferences"}
        intro={
          editing
            ? "Update the starting points FabStitch uses for personalised discovery. The full catalogue remains available."
            : "Review the choices saved to your account and the market settings used across FabStitch."
        }
      />
      <Container className="py-8 sm:py-10">
        {error && !account ? (
          <p role="alert" className="text-body text-ink-2">
            {error}
          </p>
        ) : account && initial && options ? (
          <>
            <AccountSummary profile={account} />
            {saved && !editing ? (
              <p
                role="status"
                className="mb-6 rounded-sm border border-verified/30 bg-verified-wash px-4 py-3 text-sm text-verified"
              >
                Preferences saved to your account.
              </p>
            ) : null}
            <div className="grid gap-9">
              {editing ? (
                <>
                  <AccountMarketPreferences />
                  <OnboardingExperience
                    initial={initial}
                    options={options}
                    editing
                  />
                </>
              ) : (
                <>
                  <SavedPreferences preferences={initial} />
                  <AccountMarketPreferences />
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex min-h-[12rem] items-center justify-center py-10">
            <FabStitchLoader
              variant="content"
              label="Preparing your preferences"
            />
          </div>
        )}
      </Container>
    </>
  );
}
