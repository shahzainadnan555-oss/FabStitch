import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { IconArrowRight } from "@/components/ui/icon";
import { ResourceNav } from "@/components/resources/resource-nav";
import { GUIDE_CATEGORIES } from "@/content/guide-taxonomy";
import { listGuides } from "@/repositories/guides";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";
import { CollectionPageJsonLd } from "@/components/seo/structured-data";

const single = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const query = await searchParams;
  const category = single(query.category);
  const label = GUIDE_CATEGORIES.find((item) => item.slug === category)?.label;
  return registeredStorefrontMetadata("/guides/", {
    title: label ? `${label} fabric guides` : "FabStitch Guides",
    description:
      "Practical guides on fabrics, materials, applications and sourcing, written to help you choose the right textile.",
    index: !category,
  });
}

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const selected = single(query.category);
  const guides = await listGuides();
  const visible = selected
    ? guides.filter((guide) => guide.category === selected)
    : guides;

  return (
    <>
      <CollectionPageJsonLd
        name="Fabric guides"
        description="Practical FabStitch guides to fabrics, materials, applications and sourcing."
        path="/guides/"
        items={guides.map((guide) => ({
          name: guide.title,
          path: guide.path,
        }))}
      />
      <section className="border-b border-rule-2 bg-paper-sunk">
        <Container className="py-10 sm:py-14 lg:py-16">
          <ResourceNav current="guides" />
          <p className="mt-8 font-mono text-label tracking-[0.14em] text-gold-ink uppercase">
            FabStitch Guides
          </p>
          <h1 className="mt-4 max-w-[14ch] text-[clamp(2.2rem,4.4vw,4.25rem)] leading-[0.92] font-bold tracking-[-0.055em] text-balance text-ink">
            Fabric knowledge for better sourcing.
          </h1>
          <p className="mt-5 max-w-[38rem] text-lead text-ink-2">
            Practical guides on fabric weight, composition, weaves, and choosing
            materials for shirts, dresses, activewear, and home textiles —
            written to support better FabStitch sourcing decisions.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/marketplace/"
              className="inline-flex items-center gap-2 rounded-sm border border-indigo bg-indigo px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-hover"
            >
              Open marketplace
              <IconArrowRight width={14} height={14} aria-hidden />
            </Link>
            <Link
              href="/fabrics/best-for/"
              className="inline-flex items-center gap-2 rounded-sm border border-rule-2 bg-paper-raised px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-indigo hover:text-indigo"
            >
              Fabrics by use
            </Link>
            <Link
              href="/collections/"
              className="inline-flex items-center gap-2 rounded-sm border border-rule-2 bg-paper-raised px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-indigo hover:text-indigo"
            >
              Browse collections
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-8 sm:py-10 lg:py-12">
        <nav aria-label="Guide categories" className="overflow-x-auto">
          <ul className="flex min-w-min flex-wrap gap-2">
            <li>
              <Link
                href="/guides/"
                aria-current={!selected ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-sm border px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo ${
                  !selected
                    ? "border-ink bg-ink text-white"
                    : "border-rule-2 bg-paper-raised text-ink-2 hover:border-ink-3 hover:text-ink"
                }`}
              >
                All guides
              </Link>
            </li>
            {GUIDE_CATEGORIES.map((category) => {
              const active = selected === category.slug;
              return (
                <li key={category.slug}>
                  <Link
                    href={`/guides/?category=${category.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-10 items-center rounded-sm border px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo ${
                      active
                        ? "border-ink bg-ink text-white"
                        : "border-rule-2 bg-paper-raised text-ink-2 hover:border-ink-3 hover:text-ink"
                    }`}
                  >
                    {category.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {visible.length ? (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={guide.path}
                  prefetch={false}
                  className="group flex h-full flex-col border border-rule bg-paper-raised p-5 transition-colors hover:border-rule-2"
                >
                  <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
                    {guide.categoryLabel}
                  </p>
                  <h2 className="mt-3 text-h3 font-semibold tracking-[-0.02em] text-ink group-hover:text-indigo">
                    {guide.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-3">
                    {guide.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-ink-3 transition-colors group-hover:text-indigo">
                    Read guide
                    <IconArrowRight
                      width={13}
                      height={13}
                      className="transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 max-w-[42ch] text-body text-ink-3">
            No guides are published in this category yet. Browse all guides or
            explore fabrics instead.
          </p>
        )}

        <div className="mt-12 flex flex-col gap-3 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[42ch] text-sm text-ink-3">
            Ready to compare cloth? Open the catalog, or get a quick answer in
            Help.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/marketplace/"
              className="inline-flex h-11 items-center rounded-sm bg-indigo px-4 text-sm font-semibold text-white hover:bg-indigo-hover"
            >
              Explore fabrics
            </Link>
            <Link
              href="/help/"
              className="inline-flex h-11 items-center rounded-sm border border-rule-2 px-4 text-sm font-semibold text-ink hover:border-ink-3"
            >
              Visit Help
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
