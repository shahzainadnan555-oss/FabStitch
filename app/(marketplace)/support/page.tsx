import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { ResourceNav } from "@/components/resources/resource-nav";
import { CONTACT_EMAIL, SUPPORT_EMAIL } from "@/lib/site-config";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return registeredStorefrontMetadata("/support/", {
    title: "Need help with something specific?",
    description:
      "Contact FabStitch for fabric inquiries, sourcing questions, account issues, and help using the platform.",
  });
}

const OPTIONS = [
  {
    title: "Fabric & Sourcing",
    body: "Questions about a named fabric, a collection, or which cloth suits the product you are making.",
    href: "/guides/",
    linkLabel: "Read fabric guides",
  },
  {
    title: "Account & Access",
    body: "Sign-in, profile details, or the country and currency attached to your customer account.",
    href: "/help/account/",
    linkLabel: "Account help",
  },
  {
    title: "Inquiry Assistance",
    body: "A submitted inquiry, a quantity, or what happens after you send a request.",
    href: "/help/how-to-submit-an-inquiry/",
    linkLabel: "Inquiry help",
  },
  {
    title: "Website Support",
    body: "Search, filters, or finding a page on FabStitch.",
    href: "/help/",
    linkLabel: "Browse Help",
  },
] as const;

export default function SupportPage() {
  const email = SUPPORT_EMAIL || CONTACT_EMAIL;

  return (
    <>
      <section className="border-b border-rule-2 bg-paper-sunk">
        <Container className="py-10 sm:py-14">
          <ResourceNav current="support" />
          <p className="mt-8 font-mono text-label tracking-[0.14em] text-gold-ink uppercase">
            Support
          </p>
          <h1 className="mt-4 max-w-[16ch] text-[clamp(2.1rem,4.2vw,4rem)] leading-[0.92] font-bold tracking-[-0.055em] text-balance text-ink">
            Need help with something specific?
          </h1>
          <p className="mt-5 max-w-[40rem] text-lead text-ink-2">
            Our team is here to help with fabric inquiries, sourcing questions,
            account issues, and using the FabStitch platform.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/contact/"
              className="inline-flex h-11 items-center rounded-sm bg-indigo px-5 text-sm font-semibold text-white hover:bg-indigo-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
            >
              Contact FabStitch
            </Link>
            <Link
              href="/help/"
              className="inline-flex h-11 items-center rounded-sm border border-rule-2 px-5 text-sm font-semibold text-ink hover:border-ink-3"
            >
              Search Help first
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-8 sm:py-10 lg:py-12">
        <ul className="grid gap-4 md:grid-cols-2">
          {OPTIONS.map((option) => (
            <li
              key={option.title}
              className="flex h-full flex-col border border-rule bg-paper-raised p-5 sm:p-6"
            >
              <h2 className="text-h3 font-semibold text-ink">{option.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-3">
                {option.body}
              </p>
              <Link
                href={option.href}
                className="mt-5 inline-flex text-sm font-semibold text-indigo hover:underline"
              >
                {option.linkLabel}
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-10 border border-rule bg-navy-surface p-6 text-on-ink sm:p-8">
          <p className="font-mono text-label tracking-[0.09em] text-gold-on-navy uppercase">
            Contact
          </p>
          <h2 className="mt-2 text-h2 font-semibold">Talk to FabStitch</h2>
          <p className="mt-3 max-w-[48ch] text-body text-on-navy-2">
            Use the contact page for fabric, inquiry, account or website
            questions. Include the fabric URL or inquiry number when you have
            one.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact/"
              className="inline-flex h-11 items-center rounded-sm bg-on-ink px-5 text-sm font-semibold text-navy-surface hover:bg-on-navy-2"
            >
              Contact FabStitch
            </Link>
            {email ? (
              <a
                href={`mailto:${email}`}
                className="inline-flex h-11 items-center rounded-sm border border-rule-on-navy px-5 text-sm font-semibold text-on-ink hover:border-on-navy-2"
              >
                Email FabStitch
              </a>
            ) : null}
          </div>
        </section>
      </Container>
    </>
  );
}
