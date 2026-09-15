"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/layout";
import { PageHeader } from "@/components/marketplace/page-header";
import { useSession } from "@/features/auth/session";
import { ProfileForm } from "@/features/account/profile-form";
import { api } from "@/lib/api/client";
import { apiErrorMessage } from "@/lib/api/errors";
import type { components } from "@/lib/api/schema";

type UserPublic = components["schemas"]["UserPublic"];

export function AccountProfilePage() {
  const { hydrated, authenticated, user, profile, setProfile } = useSession();
  const [initial, setInitial] = useState<UserPublic | null>(
    profile ?? user ?? null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated || !authenticated) return;
    let cancelled = false;
    api
      .get<UserPublic>("/account/profile", { cache: "no-store" })
      .then((next) => {
        if (cancelled) return;
        setInitial(next);
        setProfile(next);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;
        setError(
          apiErrorMessage(
            requestError,
            "Your account details could not be loaded. Try again.",
          ),
        );
      });
    return () => {
      cancelled = true;
    };
  }, [authenticated, hydrated, setProfile]);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Account" }]}
        eyebrow="Account"
        title="Your account"
        intro="Manage the contact details and sourcing preferences attached to your FabStitch session."
      />
      <Container className="py-8 sm:py-10">
        {error && !initial ? (
          <p role="alert" className="text-body text-ink-2">
            {error}
          </p>
        ) : initial ? (
          <ProfileForm key={initial.id} initial={initial} />
        ) : (
          <p
            aria-busy="true"
            aria-live="polite"
            className="text-body text-ink-2"
          >
            Preparing your account…
          </p>
        )}
      </Container>
    </>
  );
}
