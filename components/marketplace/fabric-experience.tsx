import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/layout";
import { IconArrowRight } from "@/components/ui/icon";
import type { RelatedLink } from "@/domain/taxonomy/relations";
import { seoPage } from "@/domain/seo/storefront-registry";
import { Swatch } from "./swatch";
import type { MediaSubject } from "./fabric-media";
import { ResilientFabricImage } from "./resilient-fabric-image";

/** Prefer SEO-eligible destinations; keep unknown browse paths. */
function eligibleRelatedLinks(items: RelatedLink[]): RelatedLink[] {
  return items.filter((item) => {
    const page = seoPage(item.href);
    if (!page) return true;
    return page.internalLinkEligible;
  });
}

export function FabricExperienceHero({
  crumbs,
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  mediaSubject,
  attributes,
  action,
  actionHref,
  actionLabel,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  imageAlt: string;
  mediaSubject?: MediaSubject;
  attributes: { label: string; value: string | number }[];
  action?: ReactNode;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <section className="overflow-hidden border-b border-rule-2 bg-chrome">
      <Container className="py-6 sm:py-8">
        <Breadcrumbs items={crumbs} />
        <div className="mt-5 grid overflow-hidden rounded-md border border-rule-2 bg-paper-raised lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center px-5 py-9 sm:px-8 lg:px-10 lg:py-12">
            <p className="font-mono text-label tracking-[0.11em] text-gold-ink uppercase">
              {eyebrow}
            </p>
            <h1 className="mt-3 max-w-[12ch] text-[clamp(2.5rem,5vw,4.8rem)] leading-[0.92] font-bold tracking-[-0.055em] text-balance text-ink">
              {title}
            </h1>
            <p className="mt-5 max-w-[38rem] text-lead text-ink-2 text-pretty">
              {description}
            </p>

            {attributes.length ? (
              <dl className="mt-7 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-rule pt-4 sm:grid-cols-3">
                {attributes.map((attribute) => (
                  <div key={attribute.label}>
                    <dt className="font-mono text-label tracking-[0.08em] text-ink-4 uppercase">
                      {attribute.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-ink">
                      {attribute.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {action || (actionHref && actionLabel) ? (
              <div className="mt-7">
                {action ?? (
                  <Link
                    href={actionHref!}
                    className="inline-flex h-11 items-center gap-2 rounded-sm bg-indigo px-5 text-sm font-semibold text-white transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-indigo-hover"
                  >
                    {actionLabel}
                    <IconArrowRight width={14} height={14} aria-hidden />
                  </Link>
                )}
              </div>
            ) : null}
          </div>

          <div className="relative min-h-[20rem] overflow-hidden sm:min-h-[27rem] lg:min-h-[34rem]">
            {image ? (
              <ResilientFabricImage
                src={image}
                alt={imageAlt}
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="fs-textile-drift object-cover"
                fallback={
                  <Swatch
                    listing={mediaSubject ?? { slug: title }}
                    className="absolute inset-0"
                  />
                }
              />
            ) : (
              <Swatch
                listing={mediaSubject ?? { slug: title }}
                className="absolute inset-0"
              />
            )}
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-ink-surface/25 via-transparent to-transparent"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

export function BestFor({
  items,
  className,
}: {
  items: RelatedLink[];
  className?: string;
}) {
  const eligibleItems = eligibleRelatedLinks(items);
  if (!eligibleItems.length) return null;

  return (
    <section className={className} aria-labelledby="best-for-heading">
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
            Product fit
          </p>
          <h2
            id="best-for-heading"
            className="mt-2 text-[clamp(2rem,3.4vw,3.5rem)] leading-[0.96] font-bold tracking-[-0.045em] text-ink"
          >
            Best for
          </h2>
        </div>
        <p className="hidden max-w-[31rem] text-sm text-ink-3 text-pretty sm:block">
          Uses documented for this material in the FabStitch 2027 reference.
        </p>
      </div>

      <ul className="mt-6 grid gap-px overflow-hidden rounded-md border border-rule-2 bg-rule-2 sm:grid-cols-2 lg:grid-cols-4">
        {eligibleItems.map((item, index) => (
          <li key={item.href}>
            <Link
              href={item.href}
              prefetch={false}
              className="group flex h-full min-h-36 flex-col justify-between bg-paper-raised p-4 transition-colors hover:bg-indigo-wash"
            >
              <span className="font-mono text-label tabular-nums text-ink-4">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-8 flex items-end justify-between gap-3">
                <span>
                  <span className="block text-body font-semibold text-ink group-hover:text-indigo">
                    {item.label}
                  </span>
                  {item.hint ? (
                    <span className="mt-1 line-clamp-2 block text-xs text-ink-3">
                      {item.hint}
                    </span>
                  ) : null}
                </span>
                <IconArrowRight
                  width={14}
                  height={14}
                  className="mb-1 shrink-0 text-indigo transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RelatedFabricTiles({
  items,
  className,
}: {
  items: RelatedLink[];
  className?: string;
}) {
  const eligibleItems = eligibleRelatedLinks(items);
  if (!eligibleItems.length) return null;

  return (
    <section className={className} aria-labelledby="related-fabrics-heading">
      <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
        Continue exploring
      </p>
      <h2
        id="related-fabrics-heading"
        className="mt-2 text-h2 font-semibold text-ink"
      >
        Similar fabrics
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {eligibleItems.map((item) => (
          <li key={item.href} data-related-fabric-slug={item.fabricSlug}>
            <Link
              href={item.href}
              prefetch={false}
              className="group flex h-full items-center justify-between gap-4 rounded-sm border border-rule-2 bg-paper-raised px-4 py-4 transition-colors hover:border-indigo hover:bg-indigo-wash"
            >
              <span>
                <span className="block text-sm font-semibold text-ink group-hover:text-indigo">
                  {item.label}
                </span>
                {item.hint ? (
                  <span className="mt-1 line-clamp-2 block text-xs text-ink-3">
                    {item.hint}
                  </span>
                ) : null}
              </span>
              <IconArrowRight
                width={13}
                height={13}
                className="shrink-0 text-indigo transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FabricAvailabilityNotice() {
  return (
    <div
      role="status"
      className="rounded-md border border-rule-2 bg-paper-sunk px-5 py-5"
    >
      <p className="font-semibold text-ink">Availability is taking longer</p>
      <p className="mt-1 max-w-[62ch] text-sm text-ink-3 text-pretty">
        The material guide is ready, but live availability could not be loaded.
        Refresh this page in a moment or continue into the marketplace.
      </p>
    </div>
  );
}
