import type { Metadata } from "next";
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
import {
  getCustomerProfile,
  requireCustomer,
} from "@/features/auth/server-session";
import { getCustomerInquiry } from "@/repositories/customer-commerce";
import { marketForCountry, isCountryCode } from "@/features/preferences/market";

export const metadata: Metadata = {
  title: "Inquiry",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireCustomer(`/inquiries/${id}/`);
  const [result, profile] = await Promise.all([
    getCustomerInquiry(id),
    getCustomerProfile(),
  ]);
  const contact = profile ?? user;

  if (!result.ok) {
    if (result.error.status === 404 || result.error.status === 403) {
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
            <p>{result.error.message}</p>
            {result.error.requestId ? (
              <p className="mt-2 font-mono text-label">
                Request {result.error.requestId}
              </p>
            ) : null}
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

  const inquiry = result.data;
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
