"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/marketplace/page-header";
import { Container } from "@/components/ui/layout";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Alert, EmptyState } from "@/components/ui/state";
import {
  inquiryDateTime,
  inquiryStatus,
} from "@/features/inquiries/presentation";
import { useSession } from "@/features/auth/session";
import { api } from "@/lib/api/client";
import { ApiError, apiErrorMessage } from "@/lib/api/errors";
import type { Inquiry } from "@/lib/api/types";
import type { components } from "@/lib/api/schema";
import { marketForCountry, isCountryCode } from "@/features/preferences/market";

type UserPublic = components["schemas"]["UserPublic"];

export function InquiryDetailPage({ id }: { id: string }) {
  const { hydrated, authenticated, user, profile } = useSession();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [contact, setContact] = useState<UserPublic | null>(
    profile ?? user ?? null,
  );
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated || !authenticated) return;
    let cancelled = false;
    Promise.all([
      api.get<Inquiry>(`/me/inquiries/${encodeURIComponent(id)}`, {
        cache: "no-store",
      }),
      api
        .get<UserPublic>("/account/profile", { cache: "no-store" })
        .catch(() => profile ?? user ?? null),
    ])
      .then(([nextInquiry, nextContact]) => {
        if (cancelled) return;
        setMissing(false);
        setError(null);
        setInquiry(nextInquiry);
        if (nextContact) setContact(nextContact);
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;
        if (
          requestError instanceof ApiError &&
          (requestError.status === 404 || requestError.status === 403)
        ) {
          setMissing(true);
          return;
        }
        setError(
          apiErrorMessage(
            requestError,
            "FabStitch could not load this inquiry.",
          ),
        );
      });
    return () => {
      cancelled = true;
    };
  }, [authenticated, hydrated, id, profile, user]);

  if (missing) {
    return (
      <>
        <PageHeader
          crumbs={[
            { label: "Account", href: "/account/" },
            { label: "Inquiries", href: "/inquiries/" },
            { label: "Not found" },
          ]}
          title="Inquiry not found"
        />
        <Container className="py-8 sm:py-10">
          <EmptyState
            eyebrow="Inquiries"
            title="Inquiry not found"
            description="This inquiry is not available on your account."
            action={
              <ButtonLink href="/inquiries/" variant="primary">
                My Inquiries
              </ButtonLink>
            }
          />
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader
          crumbs={[
            { label: "Account", href: "/account/" },
            { label: "Inquiries", href: "/inquiries/" },
            { label: "Inquiry" },
          ]}
          title="Inquiry"
        />
        <Container className="py-8 sm:py-10">
          <Alert tone="alert" title="We couldn't load this inquiry">
            <p>{error}</p>
          </Alert>
          <ButtonLink
            href={`/inquiries/${id}/`}
            variant="secondary"
            className="mt-5"
          >
            Try again
          </ButtonLink>
        </Container>
      </>
    );
  }

  if (!inquiry || !contact) {
    return (
      <>
        <PageHeader
          crumbs={[
            { label: "Account", href: "/account/" },
            { label: "Inquiries", href: "/inquiries/" },
            { label: "Inquiry" },
          ]}
          title="Inquiry"
        />
        <Container className="py-8 sm:py-10">
          <p
            aria-busy="true"
            aria-live="polite"
            className="text-body text-ink-2"
          >
            Loading this inquiry…
          </p>
        </Container>
      </>
    );
  }

  const status = inquiryStatus(inquiry.status);
  const country =
    contact.country && isCountryCode(contact.country)
      ? marketForCountry(contact.country).countryName
      : contact.country;

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Account", href: "/account/" },
          { label: "Inquiries", href: "/inquiries/" },
          { label: inquiry.inquiry_number },
        ]}
        title={inquiry.inquiry_number}
        intro="Your submitted fabric inquiry."
        action={
          <ButtonLink href="/inquiries/" variant="secondary">
            All inquiries
          </ButtonLink>
        }
      />
      <Container className="py-8 sm:py-10">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={status.tone}>{status.label}</Badge>
          <p className="text-sm text-ink-3">
            Submitted {inquiryDateTime(inquiry.created_at)}
          </p>
        </div>

        <section className="mt-8 border-t border-rule pt-8">
          <h2 className="font-mono text-label tracking-[0.1em] text-ink-4 uppercase">
            Inquiry
          </h2>
          <dl className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-label tracking-[0.1em] text-ink-4 uppercase">
                Fabric
              </dt>
              <dd className="mt-2 text-h3 font-semibold text-ink">
                {inquiry.fabric.name}
              </dd>
              {inquiry.fabric.variant_id ? (
                <p className="mt-1 text-sm text-ink-3">
                  Variant {inquiry.fabric.variant_id}
                </p>
              ) : null}
              {inquiry.fabric.slug ? (
                <Link
                  href={`/fabrics/${inquiry.fabric.slug}/`}
                  className="mt-3 inline-flex text-sm font-semibold text-indigo hover:underline"
                >
                  View fabric
                </Link>
              ) : null}
            </div>
            <div>
              <dt className="font-mono text-label tracking-[0.1em] text-ink-4 uppercase">
                Quantity
              </dt>
              <dd className="mt-2 text-h3 font-semibold text-ink">
                {inquiry.quantity} {inquiry.quantity_unit}
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-10 border-t border-rule pt-8">
          <h2 className="font-mono text-label tracking-[0.1em] text-ink-4 uppercase">
            Contact
          </h2>
          <dl className="mt-4 grid gap-6 sm:grid-cols-2">
            {contact.full_name ? (
              <div>
                <dt className="font-mono text-label text-ink-4 uppercase">
                  Customer name
                </dt>
                <dd className="mt-2 text-sm text-ink">{contact.full_name}</dd>
              </div>
            ) : null}
            <div>
              <dt className="font-mono text-label text-ink-4 uppercase">
                Email
              </dt>
              <dd className="mt-2 text-sm text-ink">{contact.email}</dd>
            </div>
            {country ? (
              <div>
                <dt className="font-mono text-label text-ink-4 uppercase">
                  Country
                </dt>
                <dd className="mt-2 text-sm text-ink">{country}</dd>
              </div>
            ) : null}
            {contact.phone ? (
              <div>
                <dt className="font-mono text-label text-ink-4 uppercase">
                  Phone
                </dt>
                <dd className="mt-2 text-sm text-ink">{contact.phone}</dd>
              </div>
            ) : null}
          </dl>
          <p className="mt-6 max-w-[62ch] text-body leading-relaxed text-ink-2">
            FabStitch will contact you at your registered email address as soon
            as possible.
          </p>
        </section>
      </Container>
    </>
  );
}
