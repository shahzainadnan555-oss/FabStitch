import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LANDING_MEDIA } from "@/components/landing/media";
import { ScrollReveal } from "@/components/marketplace/landing-motion";
import { TextileBackdrop } from "@/components/landing/textile-backdrop";
import { Container } from "@/components/ui/layout";
import { IconArrowRight } from "@/components/ui/icon";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return registeredStorefrontMetadata("/how-it-works/");
}

const STEPS = [
  {
    title: "Discover",
    body: "Begin with a material collection, a direct search or the product you are making.",
  },
  {
    title: "Search",
    body: "Use familiar material and product language to find relevant fabrics quickly.",
  },
  {
    title: "Filter",
    body: "Narrow the catalogue by supported properties without losing sight of the full range.",
  },
  {
    title: "Choose fabric",
    body: "Review visual character, Best For guidance and structured specifications together.",
  },
  {
    title: "Choose quantity",
    body: "Enter the amount you need for the fabric you selected.",
  },
  {
    title: "Send inquiry",
    body: "Submit the quantity to FabStitch. The team confirms availability and commercial terms at your registered email address.",
  },
] as const;

export default function HowItWorksPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-surface text-on-ink">
        <TextileBackdrop
          src={LANDING_MEDIA.heroPoster}
          placement="right"
          opacity={0.15}
          objectPosition="62% center"
        />
        <Container className="relative grid min-h-[30rem] items-end gap-8 py-12 sm:py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-8">
            <p className="font-mono text-label tracking-[0.12em] text-gold-on-navy uppercase">
              How it works
            </p>
            <h1 className="mt-4 max-w-[11ch] text-[clamp(2.8rem,6vw,6rem)] leading-[0.9] font-bold tracking-[-0.06em] text-balance">
              From an idea to the right fabric.
            </h1>
            <p className="mt-5 max-w-[36rem] text-lead text-on-navy-2">
              FabStitch keeps discovery, specifications, quantity and inquiries
              in one clear customer journey.
            </p>
          </div>
          <div className="relative hidden min-h-60 lg:col-span-4 lg:block">
            <Image
              src={LANDING_MEDIA.linen}
              alt="Natural linen weave in close detail"
              fill
              priority
              sizes="28vw"
              className="rounded-md object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="border-b border-rule-2 bg-paper">
        <Container className="py-12 sm:py-16 lg:py-20">
          <ol className="grid gap-px overflow-hidden rounded-md border border-rule-2 bg-rule-2 md:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="bg-paper-raised p-6 sm:p-8">
                <ScrollReveal delay={index * 45}>
                  <span className="font-mono text-label text-gold-ink">
                    0{index + 1}
                  </span>
                  <h2 className="mt-8 text-h2 font-semibold text-ink">
                    {step.title}
                  </h2>
                  <p className="mt-3 max-w-[34ch] text-body text-ink-3">
                    {step.body}
                  </p>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-chrome">
        <Container className="flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-end sm:py-16">
          <div>
            <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
              Ready to begin
            </p>
            <h2 className="mt-3 max-w-[16ch] text-h1 font-semibold text-ink text-balance">
              Find material for what you are making.
            </h2>
          </div>
          <Link
            href="/marketplace/"
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-sm bg-indigo px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-hover"
          >
            Explore fabrics
            <IconArrowRight width={16} height={16} aria-hidden />
          </Link>
        </Container>
      </section>
    </>
  );
}
