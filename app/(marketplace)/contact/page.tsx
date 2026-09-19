import type { Metadata } from "next";
import Link from "next/link";
import { LANDING_MEDIA } from "@/components/landing/media";
import { TextileBackdrop } from "@/components/landing/textile-backdrop";
import {
  PointerFabric,
  ScrollReveal,
} from "@/components/marketplace/landing-motion";
import { Container } from "@/components/ui/layout";
import { IconArrowRight } from "@/components/ui/icon";
import { CONTACT_EMAIL } from "@/lib/site-config";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";
import { SeoImage } from "@/components/seo/seo-image";
import { pillarReading } from "@/domain/seo/visible-reading";
import { PillarReadingBlock } from "@/components/seo/visible-reading";

export async function generateMetadata(): Promise<Metadata> {
  return registeredStorefrontMetadata("/contact/", {
    title: "Contact",
    image: LANDING_MEDIA.heroPoster,
  });
}

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-rule-2 bg-chrome">
        <TextileBackdrop
          src={LANDING_MEDIA.cotton}
          placement="left"
          opacity={0.055}
          objectPosition="left center"
        />
        <Container className="relative grid items-center gap-9 py-10 md:min-h-[38rem] md:grid-cols-12 md:py-14 lg:gap-12">
          <ScrollReveal className="md:col-span-6 lg:col-span-5">
            <p className="font-mono text-label tracking-[0.12em] text-gold-ink uppercase">
              Contact FabStitch
            </p>
            <h1 className="mt-4 max-w-[9ch] text-[clamp(3rem,6vw,6rem)] leading-[0.89] font-bold tracking-[-0.065em] text-balance text-ink">
              Let&rsquo;s talk fabrics.
            </h1>
            <p className="mt-5 max-w-[33rem] text-lead text-ink-2">
              Have a question about a fabric, the marketplace, an order or how
              FabStitch works? We&rsquo;ll help you find the right next step.
            </p>

            <div className="mt-7">
              {CONTACT_EMAIL ? (
                <>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-indigo px-5 py-3 text-sm font-semibold text-white transition-[background-color,transform] hover:bg-indigo-hover motion-safe:hover:-translate-y-0.5"
                  >
                    Email FabStitch
                    <IconArrowRight width={16} height={16} aria-hidden />
                  </a>
                  <p className="mt-3 text-sm text-ink-3">
                    <span className="sr-only">Email address: </span>
                    {CONTACT_EMAIL}
                  </p>
                </>
              ) : (
                <>
                  <Link
                    href="/support/"
                    className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-indigo px-5 py-3 text-sm font-semibold text-white transition-[background-color,transform] hover:bg-indigo-hover motion-safe:hover:-translate-y-0.5"
                  >
                    View support options
                    <IconArrowRight width={16} height={16} aria-hidden />
                  </Link>
                  <p className="mt-3 max-w-[32rem] text-sm text-ink-3">
                    A direct business inbox is not configured in this
                    environment. We do not display an unstaffed address.
                  </p>
                </>
              )}
            </div>
          </ScrollReveal>

          <PointerFabric className="relative min-h-[22rem] md:col-span-6 md:min-h-[32rem] lg:col-span-7">
            <div className="fs-pointer-fabric-layer absolute inset-0 overflow-hidden rounded-md bg-navy-surface shadow-[0_35px_90px_-45px_rgba(20,31,56,0.75)]">
              <SeoImage
                src={LANDING_MEDIA.heroPoster}
                alt="Deep navy jersey fabric folded into fluid contours"
                priority
                sizes="(min-width: 1024px) 52vw, (min-width: 768px) 48vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-navy-surface/28 via-transparent to-white/5"
              />
            </div>
            <div className="absolute right-4 bottom-4 border border-white/25 bg-navy-surface/82 px-3 py-2 text-on-ink backdrop-blur-sm">
              <p className="font-mono text-[0.62rem] tracking-[0.1em] uppercase">
                Material questions welcome
              </p>
            </div>
          </PointerFabric>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-navy-surface text-on-ink">
        <TextileBackdrop
          src={LANDING_MEDIA.linen}
          placement="right"
          opacity={0.07}
          objectPosition="right center"
        />
        <Container className="relative py-12 sm:py-16 lg:py-20">
          <ScrollReveal>
            <div className="max-w-[42rem]">
              <p className="font-mono text-label tracking-[0.12em] text-gold-on-navy uppercase">
                Choose the right route
              </p>
              <h2 className="mt-3 text-[clamp(2.1rem,4vw,4rem)] leading-[0.95] font-bold tracking-[-0.05em] text-balance">
                Answers when you need them.
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-8 grid gap-px overflow-hidden rounded-md border border-rule-on-navy bg-rule-on-navy md:grid-cols-2">
            <section className="bg-navy-surface-2 p-6 sm:p-8">
              <p className="font-mono text-label tracking-[0.1em] text-gold-on-navy uppercase">
                Looking for a quick answer?
              </p>
              <h3 className="mt-3 text-h2 font-semibold">
                Visit the FabStitch Help Center.
              </h3>
              <p className="mt-3 max-w-[44ch] text-body text-on-navy-2">
                Find guidance on discovery, filters, quantities, buying and
                account access.
              </p>
              <Link
                href="/help/"
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm bg-on-ink px-4 py-2 text-sm font-semibold text-navy-surface transition-colors hover:bg-on-navy-2"
              >
                Open Help Center
                <IconArrowRight width={15} height={15} aria-hidden />
              </Link>
            </section>

            <section className="bg-navy-surface p-6 sm:p-8">
              <p className="font-mono text-label tracking-[0.1em] text-gold-on-navy uppercase">
                Need more help?
              </p>
              <h3 className="mt-3 text-h2 font-semibold">
                Bring the question to Support.
              </h3>
              <p className="mt-3 max-w-[44ch] text-body text-on-navy-2">
                Use Support when an answer needs the context of your fabric,
                order or account.
              </p>
              <Link
                href="/support/"
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm border border-rule-on-navy px-4 py-2 text-sm font-semibold text-on-ink transition-colors hover:border-on-navy-2 hover:bg-white/5"
              >
                Get Support
                <IconArrowRight width={15} height={15} aria-hidden />
              </Link>
            </section>
          </div>
        </Container>
      </section>
      <Container className="py-10">
        <PillarReadingBlock
          reading={pillarReading("/contact/")!}
          id="contact-reading"
        />
      </Container>
    </>
  );
}
