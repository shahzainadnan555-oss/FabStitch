import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Container } from "@/components/ui/layout";
import { ButtonLink } from "@/components/ui/button";
import { FabricMedia } from "@/components/marketplace/fabric-media";
import { SilkVideo } from "@/components/marketplace/silk-band";
import { IconArrowRight, IconSearch } from "@/components/ui/icon";
import {
  PointerFabric,
  ScrollReveal,
} from "@/components/marketplace/landing-motion";
import {
  getCustomerCollections,
  getHomepageDiscovery,
  type CustomerCatalogFabric,
  type CustomerCollectionCard,
} from "@/repositories/customer-catalog";
import { WebSiteJsonLd } from "@/components/seo/structured-data";
import { LANDING_MEDIA } from "@/components/landing/media";
import { TextileBackdrop } from "@/components/landing/textile-backdrop";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return registeredStorefrontMetadata("/", {
    title: "FabStitch",
    description:
      "Discover FabStitch fabrics by material, construction, and use. Browse the 2027 collection, compare properties, and inquire about the cloth that fits your next make.",
    image: LANDING_MEDIA.heroPoster,
    index: true,
  });
}

function fabricHref(fabric: CustomerCatalogFabric): string {
  return `/fabrics/${fabric.slug}/`;
}

export default function LandingPage() {
  return (
    <>
      <WebSiteJsonLd />
      <Hero />
      <MaterialManifesto />
      <Suspense fallback={<Collections items={[]} loading />}>
        <LandingCollections />
      </Suspense>
      <Suspense fallback={<FabricDiscovery items={[]} loading />}>
        <LandingFabricDiscovery />
      </Suspense>
      <EditorialFeature />
      <CampaignStatement />
      <HowItWorks />
      <WhyFabStitch />
      <TrustByDesign />
      <SourcingStory />
      <ClosingCta />
    </>
  );
}

async function LandingFabricDiscovery() {
  let catalogue: CustomerCatalogFabric[] = [];
  try {
    const discovery = await getHomepageDiscovery();
    const candidates = discovery.recommended.length
      ? discovery.recommended
      : discovery.sections.flatMap((section) => section.items);
    catalogue = [
      ...new Map(candidates.map((fabric) => [fabric.slug, fabric])).values(),
    ].slice(0, 5);
  } catch {
    // Optional homepage widget — never take down the landing page.
    catalogue = [];
  }
  return <FabricDiscovery items={catalogue} />;
}

async function LandingCollections() {
  let items: CustomerCollectionCard[] = [];
  try {
    const collections = await getCustomerCollections();
    items = collections.slice(0, 7);
  } catch {
    items = [];
  }
  return <Collections items={items} />;
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-rule-2 bg-chrome">
      <Container className="grid grid-cols-1 items-center gap-7 py-7 md:min-h-[36rem] md:grid-cols-12 md:py-8 lg:min-h-[min(40rem,calc(100dvh-4.25rem))] lg:gap-5 lg:py-9">
        <div className="fs-hero-copy relative z-10 md:col-span-7 lg:col-span-6">
          <p className="font-mono text-label font-medium tracking-[0.13em] text-gold-ink uppercase">
            Fabrics, materials, possibilities
          </p>
          <h1 className="mt-4 max-w-[11.5ch] text-[clamp(2.7rem,5.3vw,5.35rem)] leading-[0.9] font-bold tracking-[-0.06em] text-balance text-ink">
            Find fabric that fits your vision.
          </h1>
          <p className="mt-5 max-w-[32rem] text-lead text-ink-2">
            Explore FabStitch fabrics by material and use, compare source-backed
            specs, and inquire when the cloth fits your next make.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/marketplace/"
              className="inline-flex h-12 items-center gap-2 rounded-sm border border-indigo bg-indigo px-6 text-sm font-semibold whitespace-nowrap text-white transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-indigo-hover active:translate-y-0"
            >
              Open marketplace
              <IconArrowRight width={15} height={15} aria-hidden />
            </Link>
            <Link
              href="/collections/"
              className="inline-flex h-12 items-center gap-2 rounded-sm border border-border bg-paper/50 px-6 text-sm font-semibold whitespace-nowrap text-ink transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-paper-raised active:translate-y-0"
            >
              Browse collections
            </Link>
            <Link
              href="/fabrics/best-for/"
              className="inline-flex h-12 items-center gap-2 rounded-sm border border-border bg-paper/50 px-6 text-sm font-semibold whitespace-nowrap text-ink transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-paper-raised active:translate-y-0"
            >
              <IconSearch width={15} height={15} aria-hidden />
              Fabrics by use
            </Link>
          </div>
          <dl className="mt-7 grid max-w-[32rem] grid-cols-2 gap-x-5 gap-y-3 border-t border-rule-2 pt-3.5 sm:grid-cols-4">
            {[
              ["01", "Material"],
              ["02", "Application"],
              ["03", "Quantity"],
              ["04", "Origin"],
            ].map(([number, label]) => (
              <div key={label}>
                <dt className="font-mono text-label text-gold-ink">{number}</dt>
                <dd className="mt-1 text-xs font-medium text-ink-2">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <PointerFabric className="relative min-h-[18rem] self-stretch md:col-span-5 md:min-h-[29rem] lg:col-span-6 lg:min-h-[34rem]">
          <div className="fs-pointer-fabric-layer absolute inset-0 overflow-hidden rounded-md bg-navy-surface shadow-[0_35px_90px_-45px_rgba(20,31,56,0.75)] md:-right-8 lg:-right-14">
            <SilkVideo className="object-[62%_center]" />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-navy-surface/35 via-transparent to-white/5"
            />
          </div>
          <div className="absolute -bottom-2 -left-1 w-[34%] overflow-hidden rounded-md border-[5px] border-chrome bg-paper-raised shadow-[0_24px_55px_-30px_rgba(20,31,56,0.8)] sm:-left-5 md:-left-7">
            <div className="relative aspect-[4/5]">
              <Image
                src={LANDING_MEDIA.linen}
                alt="Natural linen texture in close detail"
                fill
                priority
                sizes="(min-width: 1024px) 16rem, 34vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute top-4 right-4 border border-white/25 bg-navy-surface/82 px-3 py-2 text-right text-on-ink backdrop-blur-sm">
            <p className="font-mono text-[0.62rem] tracking-[0.1em] uppercase">
              Movement in every fibre
            </p>
          </div>
        </PointerFabric>
      </Container>
    </section>
  );
}

function MaterialManifesto() {
  return (
    <section className="relative overflow-hidden bg-navy-surface text-on-ink">
      <TextileBackdrop
        src={LANDING_MEDIA.heroPoster}
        placement="full"
        opacity={0.09}
        objectPosition="70% center"
      />
      <Container className="relative grid items-center gap-8 py-12 sm:py-14 lg:grid-cols-12 lg:py-18">
        <ScrollReveal className="lg:col-span-7">
          <p className="font-mono text-label tracking-[0.12em] text-gold-on-navy uppercase">
            Start with the material
          </p>
          <h2 className="mt-4 max-w-[10ch] text-[clamp(2.35rem,5.1vw,5.1rem)] leading-[0.91] font-bold tracking-[-0.06em] text-balance">
            Cloth moves every idea forward.
          </h2>
          <p className="mt-5 max-w-[32rem] text-lead text-on-navy-2">
            Drape, weight, structure and finish shape the product before the
            first pattern is cut.
          </p>
        </ScrollReveal>

        <div className="relative min-h-[24rem] lg:col-span-5 lg:min-h-[30rem]">
          <div className="absolute top-0 right-0 w-[72%] overflow-hidden rounded-md">
            <div className="relative aspect-[4/5]">
              <Image
                src={LANDING_MEDIA.cotton}
                alt="Cotton fabric gathered into sculptural folds"
                fill
                sizes="(min-width: 1024px) 28rem, 70vw"
                className="fs-textile-drift object-cover"
              />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-[58%] overflow-hidden rounded-md border-[6px] border-navy-surface">
            <div className="relative aspect-square">
              <Image
                src={LANDING_MEDIA.denim}
                alt="Dense denim texture showing a diagonal twill"
                fill
                sizes="(min-width: 1024px) 22rem, 58vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute right-[7%] bottom-[7%] w-[35%] overflow-hidden rounded-md border-[5px] border-navy-surface">
            <div className="relative aspect-[3/4]">
              <Image
                src={LANDING_MEDIA.performance}
                alt="Performance textile with a smooth technical surface"
                fill
                sizes="14rem"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function FabricDiscovery({
  items,
  loading = false,
}: {
  items: CustomerCatalogFabric[];
  loading?: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-b border-rule-2 bg-paper">
      <TextileBackdrop
        src={LANDING_MEDIA.cotton}
        placement="left"
        opacity={0.065}
        objectPosition="left center"
      />
      <Container className="relative py-12 sm:py-14 lg:py-18">
        <ScrollReveal>
          <div className="max-w-[42rem]">
            <h2 className="text-[clamp(2.05rem,3.8vw,3.85rem)] leading-[0.96] font-bold tracking-[-0.05em] text-balance text-ink">
              Fabric discovery, made tangible.
            </h2>
            <p className="mt-4 max-w-[34rem] text-lead text-ink-2">
              A focused edit of the catalogue, where visual character and
              technical detail stay together.
            </p>
          </div>
        </ScrollReveal>

        {items.length ? (
          <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-12 md:gap-x-4">
            {items.map((fabric, index) => (
              <li
                key={fabric.id}
                data-fabric-slug={fabric.slug}
                className={
                  index === 0
                    ? "col-span-2 md:col-span-6 md:row-span-2"
                    : "col-span-1 md:col-span-3"
                }
              >
                <Link
                  href={fabricHref(fabric)}
                  prefetch={false}
                  className="group block h-full rounded-sm focus-visible:outline-offset-4"
                >
                  <FabricMedia
                    listing={{
                      material: fabric.composition[0] ?? fabric.family.label,
                      fabricType: fabric.name,
                      construction: fabric.construction[0],
                      gsm: {
                        value:
                          fabric.measurements.find(
                            (measurement) => measurement.unit === "gsm",
                          )?.exact ??
                          fabric.measurements.find(
                            (measurement) => measurement.unit === "gsm",
                          )?.min,
                      },
                      slug: fabric.slug,
                    }}
                    asset={
                      fabric.media.src
                        ? {
                            src: fabric.media.src,
                            alt: fabric.media.alt ?? fabric.name,
                          }
                        : undefined
                    }
                    aspect={index === 0 ? "1/1" : "4/3"}
                    showLabel={false}
                    sizes={
                      index === 0
                        ? "(min-width: 1024px) 39rem, 92vw"
                        : "(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 92vw"
                    }
                    className="landing-tile overflow-hidden group-hover:[&_img]:scale-[1.035] [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-[var(--ease-out-quart)]"
                  />
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-ink transition-colors group-hover:text-indigo sm:text-h3">
                        {fabric.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-ink-3 sm:text-sm">
                        {fabric.characteristics.slice(0, 2).join(" · ") ||
                          fabric.composition.join(" / ") ||
                          fabric.collection.label}
                      </p>
                    </div>
                    <IconArrowRight
                      width={14}
                      height={14}
                      className="mt-1 shrink-0 text-ink-4 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo"
                      aria-hidden
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : loading ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-10 border-t border-rule pt-6"
          >
            <p className="text-sm text-ink-3">
              Preparing the curated fabric edit…
            </p>
          </div>
        ) : (
          <div className="mt-10 border-t border-rule pt-6">
            <p className="text-body text-ink-2">
              The catalogue is being prepared. Published fabrics will appear
              here as they become available.
            </p>
          </div>
        )}

        <div className="mt-8">
          <ButtonLink href="/marketplace/" variant="secondary" size="lg">
            Explore the marketplace
            <IconArrowRight width={14} height={14} aria-hidden />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

function EditorialFeature() {
  return (
    <section className="grid min-h-[34rem] overflow-hidden border-b border-rule-2 bg-chrome lg:grid-cols-2">
      <div className="relative min-h-[23rem] lg:min-h-full">
        <Image
          src={LANDING_MEDIA.twill}
          alt="Twill fabric shaped into architectural folds"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="fs-textile-drift object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink-surface/25 via-transparent to-transparent" />
        <div className="absolute right-5 bottom-5 bg-paper-raised px-4 py-3 shadow-card">
          <p className="font-mono text-label text-gold-ink uppercase">
            Structure, weight, movement
          </p>
        </div>
      </div>
      <div className="flex items-center px-5 py-12 sm:px-9 lg:px-[clamp(2.5rem,5vw,5.5rem)]">
        <ScrollReveal className="max-w-[36rem]">
          <h2 className="max-w-[12ch] text-[clamp(2.25rem,4.2vw,4.4rem)] leading-[0.92] font-bold tracking-[-0.055em] text-balance text-ink">
            The right material changes everything.
          </h2>
          <p className="mt-5 max-w-[29rem] text-lead text-ink-2">
            Choose by how a fabric behaves, what it is made from, and whether it
            works at your quantity.
          </p>
          <Link
            href="/marketplace/"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-sm bg-indigo px-5 text-sm font-semibold text-white transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-indigo-hover"
          >
            Explore fabrics
            <IconArrowRight width={15} height={15} aria-hidden />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

function CampaignStatement() {
  return (
    <section className="relative overflow-hidden bg-paper-raised">
      <TextileBackdrop
        src={LANDING_MEDIA.twill}
        placement="full"
        opacity={0.055}
        objectPosition="80% center"
      />
      <Container className="relative py-10 sm:py-14 lg:py-18">
        <ScrollReveal>
          <p className="max-w-[12ch] text-[clamp(3rem,7.5vw,7.2rem)] leading-[0.84] font-[750] tracking-[-0.075em] text-ink uppercase">
            Better fabric.
          </p>
          <div className="my-3 grid grid-cols-[0.8fr_1.3fr_0.7fr] gap-2 sm:my-5 sm:gap-3">
            {[
              LANDING_MEDIA.poplin,
              LANDING_MEDIA.knit,
              LANDING_MEDIA.fleece,
            ].map((src, index) => (
              <div
                key={src}
                className="relative h-[clamp(4rem,9vw,8rem)] overflow-hidden rounded-sm"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="45vw"
                  className={
                    index === 1
                      ? "fs-textile-drift object-cover"
                      : "object-cover"
                  }
                />
              </div>
            ))}
          </div>
          <p className="ml-auto max-w-[13ch] text-right text-[clamp(3rem,7.5vw,7.2rem)] leading-[0.84] font-[750] tracking-[-0.075em] text-indigo uppercase">
            Better possibility.
          </p>
        </ScrollReveal>
      </Container>
    </section>
  );
}

function Collections({
  items,
  loading = false,
}: {
  items: CustomerCollectionCard[];
  loading?: boolean;
}) {
  const featured =
    items.find((item) => item.slug === "linen-lightweight") ?? items[0];
  const supporting = featured
    ? items.filter((item) => item.slug !== featured.slug)
    : [];
  const supportingLead = supporting.slice(0, 2);
  const supportingRow = supporting.slice(2);

  return (
    <section
      id="collections"
      className="relative scroll-mt-20 overflow-hidden border-b border-rule-2 bg-paper-sunk"
    >
      <TextileBackdrop
        src={LANDING_MEDIA.linen}
        placement="right"
        opacity={0.08}
        objectPosition="right center"
      />
      <Container className="relative py-14 sm:py-16 lg:py-20">
        <ScrollReveal className="max-w-[38rem]">
          <p className="font-mono text-label tracking-[0.14em] text-gold-ink uppercase">
            Curated collections
          </p>
          <h2 className="mt-4 max-w-[13ch] text-[clamp(2.15rem,4vw,4rem)] leading-[0.92] font-bold tracking-[-0.055em] text-balance text-ink">
            Explore Fabrics by Character.
          </h2>
          <p className="mt-5 max-w-[34rem] text-lead text-ink-2">
            Discover curated fabric collections designed to help you find the
            right material for every idea, application, and finish.
          </p>
        </ScrollReveal>

        {items.length && featured ? (
          <ul className="landing-collections mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-12">
            <li className="min-w-0 h-full sm:col-span-2 lg:col-span-7 lg:row-span-2">
              <CollectionCard collection={featured} featured />
            </li>
            {supportingLead.map((collection) => (
              <li key={collection.slug} className="min-w-0 lg:col-span-5">
                <CollectionCard collection={collection} compact />
              </li>
            ))}
            {supportingRow.map((collection) => (
              <li key={collection.slug} className="min-w-0 lg:col-span-3">
                <CollectionCard collection={collection} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 border-t border-rule pt-6">
            <p className="text-sm text-ink-3">
              {loading
                ? "Loading collections…"
                : "No collections are available yet."}
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}

function CollectionCard({
  collection,
  featured = false,
  compact = false,
}: {
  collection: CustomerCollectionCard;
  featured?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/collections/${collection.slug}/`}
      prefetch={false}
      className="landing-collections-card group flex h-full min-h-0 flex-col bg-paper-raised"
    >
      <div
        className={
          featured
            ? "landing-collections-media relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[28rem] lg:flex-1"
            : compact
              ? "landing-collections-media relative aspect-[16/10] overflow-hidden lg:aspect-[5/3] lg:min-h-[11.5rem]"
              : "landing-collections-media relative aspect-[4/3] overflow-hidden"
        }
      >
        <FabricMedia
          listing={{
            material: collection.name,
            fabricType: collection.name,
            slug: collection.slug,
          }}
          asset={
            collection.imageUrl
              ? {
                  src: collection.imageUrl,
                  alt: `${collection.name} fabric collection`,
                }
              : undefined
          }
          showLabel={false}
          aspect={featured ? "1/1" : "4/3"}
          sizes={
            featured
              ? "(min-width: 1024px) 52vw, 92vw"
              : compact
                ? "(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 92vw"
                : "(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw"
          }
          className="absolute inset-0"
        />
      </div>
      <div
        className={
          featured
            ? "flex items-end justify-between gap-6 px-5 py-5 sm:px-6"
            : "flex items-end justify-between gap-4 px-4 py-4"
        }
      >
        <div>
          <h3
            className={
              featured
                ? "text-[1.35rem] leading-tight font-semibold tracking-[-0.03em] text-ink sm:text-[1.55rem]"
                : "text-h3 font-semibold tracking-[-0.02em] text-ink"
            }
          >
            {collection.name}
          </h3>
          <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-3 transition-colors duration-300 group-hover:text-indigo">
            Explore collection
            <IconArrowRight
              width={13}
              height={13}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

function WhyFabStitch() {
  const benefits = [
    [
      "Curated discovery",
      "Start with material, construction or what you are making.",
    ],
    [
      "Professional sourcing",
      "Specifications, quantities and commercial terms stay attached to the fabric.",
    ],
    [
      "Clear purchasing path",
      "Move from discovery to an informed request without rebuilding the brief.",
    ],
    [
      "Global market focus",
      "Evaluate fabric by origin and production needs through one marketplace.",
    ],
  ] as const;

  return (
    <section className="relative grid overflow-hidden border-b border-rule bg-navy-surface text-on-ink lg:grid-cols-2">
      <TextileBackdrop
        src={LANDING_MEDIA.heroPoster}
        placement="full"
        opacity={0.075}
        objectPosition="80% center"
      />
      <div className="relative min-h-[20rem] lg:min-h-[32rem]">
        <Image
          src="/media/fabrics/canvas.jpg"
          alt="Canvas fabric in a close structured weave"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="fs-textile-drift object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-navy-surface/15 to-navy-surface/55"
        />
      </div>
      <div className="relative flex items-center px-5 py-11 sm:px-9 sm:py-14 lg:px-12">
        <ScrollReveal className="max-w-[35rem]">
          <h2 className="text-[clamp(2rem,3.4vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance">
            Material decisions deserve better context.
          </h2>
          <p className="mt-5 max-w-[31rem] text-lead text-on-navy-2">
            FabStitch keeps the visual and technical sides of fabric discovery
            together.
          </p>
          <dl className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {benefits.map(([title, body]) => (
              <div key={title} className="border-t border-rule-on-navy pt-4">
                <dt className="text-body font-semibold text-on-ink">{title}</dt>
                <dd className="mt-2 text-sm text-on-navy-2">{body}</dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>
      </div>
    </section>
  );
}

function TrustByDesign() {
  const principles = [
    [
      "Structured material records",
      "Composition, construction, weight and width remain attached to the fabric.",
    ],
    [
      "Commercial context in view",
      "Quantity, availability and the next sourcing step are presented without artificial claims.",
    ],
    [
      "One focused customer experience",
      "FabStitch keeps discovery centred on the material and what you intend to make.",
    ],
  ] as const;

  return (
    <section className="relative overflow-hidden border-b border-rule-2 bg-chrome">
      <TextileBackdrop
        src={LANDING_MEDIA.canvas}
        placement="left"
        opacity={0.065}
        objectPosition="left center"
      />
      <Container className="relative py-12 sm:py-14 lg:py-18">
        <ScrollReveal>
          <h2 className="max-w-[15ch] text-[clamp(2.2rem,4.1vw,4.2rem)] leading-[0.94] font-bold tracking-[-0.055em] text-balance text-ink">
            Trust is built into the details.
          </h2>
          <p className="mt-5 max-w-[37rem] text-lead text-ink-2">
            No invented logos, ratings or promises. The sourcing experience is
            credible because the information stays clear.
          </p>
        </ScrollReveal>

        <dl className="mt-8 grid border-y border-rule-2 md:grid-cols-3">
          {principles.map(([title, body], index) => (
            <div
              key={title}
              className="border-b border-rule-2 px-1 py-7 last:border-b-0 md:border-r md:border-b-0 md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <dt className="flex items-baseline gap-3">
                <span className="font-mono text-label text-gold-ink">
                  0{index + 1}
                </span>
                <span className="text-h3 font-semibold text-ink">{title}</span>
              </dt>
              <dd className="mt-3 max-w-[32ch] text-sm text-ink-3">{body}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

function SourcingStory() {
  return (
    <section className="overflow-hidden border-b border-rule-2 bg-paper">
      <Container className="grid items-center gap-8 py-12 sm:py-14 lg:grid-cols-12 lg:py-18">
        <div className="relative min-h-[28rem] lg:col-span-7 lg:min-h-[35rem]">
          <div className="absolute inset-y-0 left-0 w-[78%] overflow-hidden rounded-md">
            <Image
              src={LANDING_MEDIA.knit}
              alt="Knitted fabric production shown through the material itself"
              fill
              sizes="(min-width: 1024px) 55vw, 80vw"
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 bottom-[8%] w-[42%] overflow-hidden rounded-md border-[6px] border-paper">
            <div className="relative aspect-[4/5]">
              <Image
                src={LANDING_MEDIA.jersey}
                alt="Jersey fabric close-up showing soft construction"
                fill
                sizes="20rem"
                className="fs-textile-drift object-cover"
              />
            </div>
          </div>
        </div>

        <ScrollReveal className="lg:col-span-5 lg:pl-8">
          <p className="font-mono text-label tracking-[0.12em] text-gold-ink uppercase">
            Why FabStitch
          </p>
          <h2 className="mt-4 max-w-[11ch] text-[clamp(2.25rem,4.1vw,4.25rem)] leading-[0.93] font-bold tracking-[-0.055em] text-balance text-ink">
            Sourcing should begin with what you are making.
          </h2>
          <p className="mt-6 max-w-[33rem] text-lead text-ink-2">
            FabStitch connects the visual language of cloth with the
            specifications production teams need, so discovery becomes a usable
            brief.
          </p>
          <p className="mt-4 max-w-[33rem] text-body text-ink-3">
            Begin with a fabric, an application or a requirement. The platform
            carries that context into the marketplace without exposing the
            complexity behind fulfilment.
          </p>
          <Link
            href="/about/"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo underline decoration-gold underline-offset-4 transition-[gap] hover:gap-3"
          >
            Read the FabStitch story
            <IconArrowRight width={14} height={14} aria-hidden />
          </Link>
        </ScrollReveal>
      </Container>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    ["Discover", "Start with a collection or the product you are making."],
    ["Search", "Describe a material, construction, use or specification."],
    ["Filter", "Narrow the catalogue with supported fabric properties."],
    ["Choose", "Review one FabStitch fabric and what it is best for."],
    ["Quantity", "Enter the amount of fabric you need."],
    ["Inquire", "Send the quantity to FabStitch for commercial follow-up."],
  ] as const;

  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-20 overflow-hidden border-b border-rule bg-paper-raised"
    >
      <TextileBackdrop
        src={LANDING_MEDIA.poplin}
        placement="right"
        opacity={0.07}
        objectPosition="right center"
      />
      <Container className="relative py-12 sm:py-14 lg:py-18">
        <ScrollReveal>
          <h2 className="max-w-[16ch] text-[clamp(1.9rem,3vw,3rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance text-ink">
            From first touch to a clear next step.
          </h2>
        </ScrollReveal>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <ol className="grid overflow-hidden rounded-md border border-rule-2 bg-paper">
            {steps.map(([title, body], index) => (
              <li
                key={title}
                className="group grid grid-cols-[2.5rem_1fr] gap-3 border-b border-rule px-4 py-5 last:border-b-0 sm:grid-cols-[3rem_9rem_1fr] sm:items-center"
              >
                <span className="font-mono text-label text-gold-ink">
                  0{index + 1}
                </span>
                <h3 className="text-h3 font-semibold text-ink transition-transform duration-300 group-hover:translate-x-1">
                  {title}
                </h3>
                <p className="col-start-2 max-w-[34ch] text-sm text-ink-3 sm:col-start-auto">
                  {body}
                </p>
              </li>
            ))}
          </ol>
          <div className="relative min-h-[20rem] overflow-hidden rounded-md">
            <Image
              src="/media/fabrics/denim.jpg"
              alt="Denim textile folds showing structure and depth"
              fill
              sizes="(min-width: 1024px) 38vw, 92vw"
              className="fs-textile-drift object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-navy-surface/50 via-transparent to-transparent" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="relative flex min-h-[31rem] items-end overflow-hidden bg-navy-surface text-on-ink sm:min-h-[36rem]">
      <Image
        src={LANDING_MEDIA.heroPoster}
        alt=""
        fill
        sizes="100vw"
        className="fs-textile-drift object-cover object-[65%_center] opacity-55"
      />
      <div className="absolute inset-0 bg-linear-to-r from-navy-surface via-navy-surface/84 to-navy-surface/20" />
      <Container className="relative py-12 sm:py-16 lg:py-18">
        <ScrollReveal className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="font-mono text-label tracking-[0.12em] text-gold-on-navy uppercase">
              Your next material
            </p>
            <h2 className="mt-4 max-w-[11ch] text-[clamp(2.55rem,5.2vw,5.2rem)] leading-[0.91] font-bold tracking-[-0.06em] text-balance">
              Find what your vision needs.
            </h2>
            <p className="mt-5 max-w-[35rem] text-lead text-on-navy-2">
              Explore the catalogue openly. Join FabStitch when you are ready to
              choose a quantity and buy.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/marketplace/"
              className="inline-flex h-12 items-center gap-2 rounded-sm bg-on-ink px-6 text-sm font-semibold whitespace-nowrap text-navy-surface transition-transform hover:-translate-y-0.5"
            >
              Start exploring
              <IconArrowRight width={15} height={15} aria-hidden />
            </Link>
            <Link
              href="/fabrics/"
              className="inline-flex h-12 items-center rounded-sm border border-white/35 bg-navy-surface/30 px-6 text-sm font-semibold whitespace-nowrap text-on-ink transition-colors hover:bg-navy-surface/55"
            >
              Discover fabrics
            </Link>
            <Link
              href="/guides/"
              className="inline-flex h-12 items-center rounded-sm border border-white/35 bg-navy-surface/30 px-6 text-sm font-semibold whitespace-nowrap text-on-ink transition-colors hover:bg-navy-surface/55"
            >
              Read fabric guides
            </Link>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
