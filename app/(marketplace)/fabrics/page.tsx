import type { Metadata } from "next";
import Link from "next/link";
import { PersonalizedCatalogGrid } from "@/components/marketplace/personalized-catalog-grid";
import { PageHeader } from "@/components/marketplace/page-header";
import { Container } from "@/components/ui/layout";
import { IconArrowRight } from "@/components/ui/icon";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";
import {
  getCustomerBestFor,
  getCustomerCollections,
  listCustomerCatalog,
} from "@/repositories/customer-catalog";
import { CollectionPageJsonLd } from "@/components/seo/structured-data";
import { COLLECTIONS, FABRICS_2027 } from "@/catalog";
import { pillarReading } from "@/domain/seo/visible-reading";
import { PillarReadingBlock } from "@/components/seo/visible-reading";

export async function generateMetadata(): Promise<Metadata> {
  return registeredStorefrontMetadata("/fabrics/", {
    title: "Explore Fabrics",
    description:
      "Browse FabStitch fabrics and fabric materials by collection, Best For use, and searchable marketplace. Compare composition, weight, construction, and sources of fabric before you inquire.",
  });
}

export default async function FabricsHubPage() {
  const [collections, bestFor, featuredResult] = await Promise.all([
    getCustomerCollections(),
    getCustomerBestFor(),
    listCustomerCatalog({ limit: 12, sort: "featured" }).catch(() => null),
  ]);
  const featured = featuredResult ?? {
    items: [],
    total: 0,
    totalKnown: false,
  };
  const fabricCount = featured.totalKnown
    ? featured.total
    : featured.items.length;

  return (
    <>
      <CollectionPageJsonLd
        name="Explore Fabrics | FabStitch"
        description="Browse FabStitch fabrics and fabric materials by collection, Best For use, and searchable marketplace."
        path="/fabrics/"
        items={[
          ...collections.slice(0, 8).map((collection) => ({
            name: collection.name,
            path: `/collections/${collection.slug}/`,
            image: collection.imageUrl,
          })),
          ...bestFor.slice(0, 6).map((useCase) => ({
            name: useCase.name,
            path: `/fabrics/best-for/${useCase.slug}/`,
            image: useCase.imageUrl,
          })),
        ]}
      />
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Fabrics" }]}
        eyebrow="FabStitch catalog"
        title="Find the fabric, then read the detail."
        intro="Start with a material collection, a Best For use case, or the full marketplace search. Every fabric page leads with composition, construction, and documented uses — so you can compare cloth material and sources of fabric before you inquire."
        meta={[
          { label: "Fabrics", value: fabricCount },
          { label: "Collections", value: collections.length },
          { label: "Best For edits", value: bestFor.length },
        ]}
      />

      <Container className="border-b border-rule py-10">
        <PillarReadingBlock
          reading={pillarReading("/fabrics/")!}
          id="fabrics-reading"
        />
      </Container>

      <Container className="py-10 sm:py-14">
        <section aria-labelledby="intent-landings-heading">
          <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
            By programme
          </p>
          <h2
            id="intent-landings-heading"
            className="mt-2 text-h2 font-semibold text-ink"
          >
            Clothing, apparel and fashion paths
          </h2>
          <p className="mt-3 max-w-[42rem] text-sm leading-relaxed text-ink-3">
            Three intent pages keep garment selection, production sourcing and
            fashion aesthetics from competing for the same keywords.
          </p>
          <ul className="mt-5 grid gap-px border border-rule-2 bg-rule-2 sm:grid-cols-3">
            {[
              {
                href: "/fabrics/clothing/",
                title: "Clothing fabric",
                body: "Choose cloth for shirts, dresses, trousers, jackets and coats.",
              },
              {
                href: "/fabrics/apparel/",
                title: "Apparel fabric",
                body: "Source for brands and manufacturers with a production brief.",
              },
              {
                href: "/fabrics/fashion/",
                title: "Fashion fabrics",
                body: "Explore drape, texture and seasonal story for designers.",
              },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch={false}
                  className="group flex h-full flex-col justify-between gap-4 bg-paper-raised p-5 transition-colors hover:bg-indigo-wash"
                >
                  <span>
                    <span className="block font-semibold text-ink group-hover:text-indigo">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm text-ink-3">
                      {item.body}
                    </span>
                  </span>
                  <IconArrowRight
                    width={14}
                    height={14}
                    className="shrink-0 text-indigo"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="material-guides-heading">
          <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
            By material and garment
          </p>
          <h2
            id="material-guides-heading"
            className="mt-2 text-h2 font-semibold text-ink"
          >
            Shirt, dress, wool and fibre collections
          </h2>
          <ul className="mt-5 grid gap-px border border-rule-2 bg-rule-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: "/fabrics/shirt-fabric/",
                title: "Shirt fabric",
                body: "Types, weaves and dress-shirt materials.",
              },
              {
                href: "/fabrics/dress-fabric/",
                title: "Dress fabric",
                body: "Drape, opacity and dressmaking directions.",
              },
              {
                href: "/fabrics/wool-fabric/",
                title: "Wool fabric",
                body: "Tailoring, textures and outerwear wools.",
              },
              {
                href: "/collections/cotton/",
                title: "Cotton fabric",
                body: "Woven cottons for apparel programmes.",
              },
              {
                href: "/collections/linen-lightweight/",
                title: "Linen fabric",
                body: "Linen and lightweight blends.",
              },
              {
                href: "/collections/silk-sheer/",
                title: "Silk fabric",
                body: "Sheer and fluid silk constructions.",
              },
              {
                href: "/collections/denim/",
                title: "Denim fabric",
                body: "Denim for jeans and apparel.",
              },
              {
                href: "/guides/fabric-weight-and-gsm/",
                title: "Fabric GSM",
                body: "What GSM means for buyers.",
              },
              {
                href: "/guides/lightweight-fabric/",
                title: "Lightweight fabric",
                body: "Light programmes without invented thresholds.",
              },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch={false}
                  className="group flex h-full items-start justify-between gap-4 bg-paper-raised p-5 transition-colors hover:bg-indigo-wash"
                >
                  <span>
                    <span className="block font-semibold text-ink group-hover:text-indigo">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm text-ink-3">
                      {item.body}
                    </span>
                  </span>
                  <IconArrowRight
                    width={14}
                    height={14}
                    className="mt-1 shrink-0 text-indigo"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="commercial-paths-heading">
          <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
            Commercial paths
          </p>
          <h2
            id="commercial-paths-heading"
            className="mt-2 text-h2 font-semibold text-ink"
          >
            Fabric sourcing and wholesale
          </h2>
          <p className="mt-3 max-w-[42rem] text-sm leading-relaxed text-ink-3">
            Educational sourcing guidance and wholesale quantity language live
            on dedicated commercial pages — not duplicate marketplace URLs.
          </p>
          <ul className="mt-5 grid gap-px border border-rule-2 bg-rule-2 sm:grid-cols-2">
            {[
              {
                href: "/fabric-sourcing/",
                title: "Fabric sourcing",
                body: "Briefs, specs, sampling and inquiry for clothing lines and designers.",
              },
              {
                href: "/wholesale-fabric/",
                title: "Wholesale fabric",
                body: "Commercial quantity discovery for brands and bulk programmes.",
              },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch={false}
                  className="group flex h-full items-start justify-between gap-4 bg-paper-raised p-5 transition-colors hover:bg-indigo-wash"
                >
                  <span>
                    <span className="block font-semibold text-ink group-hover:text-indigo">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm text-ink-3">
                      {item.body}
                    </span>
                  </span>
                  <IconArrowRight
                    width={14}
                    height={14}
                    className="mt-1 shrink-0 text-indigo"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="fabric-collections-heading">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
                Material first
              </p>
              <h2
                id="fabric-collections-heading"
                className="mt-2 text-h2 font-semibold text-ink"
              >
                Browse fabric collections
              </h2>
            </div>
            <Link
              href="/collections/"
              className="hidden items-center gap-2 text-sm font-semibold text-indigo sm:inline-flex"
            >
              All collections
              <IconArrowRight width={14} height={14} aria-hidden />
            </Link>
          </div>
          {collections.length ? (
            <ul className="mt-5 grid gap-px border border-rule-2 bg-rule-2 sm:grid-cols-2 lg:grid-cols-3">
              {collections.slice(0, 6).map((collection) => (
                <li key={collection.slug}>
                  <Link
                    href={`/collections/${collection.slug}/`}
                    prefetch={false}
                    className="group flex h-full items-start justify-between gap-4 bg-paper-raised p-5 transition-colors hover:bg-indigo-wash"
                  >
                    <span>
                      <span className="block font-semibold text-ink group-hover:text-indigo">
                        {collection.name}
                      </span>
                      {collection.description ? (
                        <span className="mt-1 block text-sm text-ink-3">
                          {collection.description}
                        </span>
                      ) : null}
                    </span>
                    <IconArrowRight
                      width={14}
                      height={14}
                      className="mt-1 shrink-0 text-indigo"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-sm text-ink-3">
              No published collections are available yet.
            </p>
          )}
        </section>

        <section className="mt-14" aria-labelledby="best-for-heading">
          <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
            Product first
          </p>
          <h2
            id="best-for-heading"
            className="mt-2 text-h2 font-semibold text-ink"
          >
            Find fabrics for what you are making
          </h2>
          {bestFor.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {bestFor.map((useCase) => (
                <li key={useCase.slug}>
                  <Link
                    href={`/fabrics/best-for/${useCase.slug}/`}
                    prefetch={false}
                    className="inline-flex rounded-sm border border-rule-2 bg-paper-raised px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-indigo hover:text-indigo"
                  >
                    {useCase.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-sm text-ink-3">
              No Best For edits are published yet.
            </p>
          )}
        </section>

        <section className="mt-14" aria-labelledby="guides-heading">
          <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
            Learn first
          </p>
          <h2
            id="guides-heading"
            className="mt-2 text-h2 font-semibold text-ink"
          >
            Fabric guides for clearer sourcing
          </h2>
          <p className="mt-3 max-w-[40rem] text-sm leading-relaxed text-ink-3">
            Read practical notes on weight, composition, and construction, then
            return to collections or the marketplace with a clearer brief.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/guides/"
              className="inline-flex items-center gap-2 rounded-sm border border-rule-2 bg-paper-raised px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-indigo hover:text-indigo"
            >
              Browse fabric guides
              <IconArrowRight width={14} height={14} aria-hidden />
            </Link>
            <Link
              href="/guides/fabric-questions/"
              className="inline-flex items-center gap-2 rounded-sm border border-rule-2 bg-paper-raised px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-indigo hover:text-indigo"
            >
              Fabric questions
            </Link>
            <Link
              href="/guides/fabric-weight-and-gsm/"
              className="inline-flex items-center gap-2 rounded-sm border border-rule-2 bg-paper-raised px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-indigo hover:text-indigo"
            >
              Fabric weight and GSM
            </Link>
            <Link
              href="/marketplace/"
              className="inline-flex items-center gap-2 rounded-sm border border-indigo bg-indigo px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-hover"
            >
              Search the marketplace
            </Link>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="named-fabrics-heading">
          <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
            Catalog index
          </p>
          <h2
            id="named-fabrics-heading"
            className="mt-2 text-h2 font-semibold text-ink"
          >
            Named fabrics by collection
          </h2>
          <p className="mt-3 max-w-[42rem] text-sm leading-relaxed text-ink-3">
            Every documented FabStitch fabric has its own page. Open a name to
            read composition and construction, or start from the collection when
            you want the group first.
          </p>
          <div className="mt-6 space-y-6">
            {COLLECTIONS.map((collection) => {
              const fabrics = FABRICS_2027.filter(
                (fabric) => fabric.collection === collection.slug,
              );
              if (!fabrics.length) return null;
              return (
                <div key={collection.slug}>
                  <h3 className="text-sm font-semibold text-ink">
                    <Link
                      href={`/collections/${collection.slug}/`}
                      className="hover:text-indigo"
                    >
                      {collection.label}
                    </Link>
                  </h3>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {fabrics.map((fabric) => (
                      <li key={fabric.slug}>
                        <Link
                          href={`/fabrics/${fabric.slug}/`}
                          prefetch={false}
                          className="inline-flex rounded-sm border border-rule-2 bg-paper-raised px-3 py-1.5 text-sm text-ink transition-colors hover:border-indigo hover:text-indigo"
                        >
                          {fabric.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="featured-fabrics-heading">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
                From the catalog
              </p>
              <h2
                id="featured-fabrics-heading"
                className="mt-2 text-h2 font-semibold text-ink"
              >
                Explore named fabrics
              </h2>
            </div>
            <Link
              href="/marketplace/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo"
            >
              {!featured.totalKnown
                ? "Search the catalog"
                : `Search all ${featured.total}`}
              <IconArrowRight width={14} height={14} aria-hidden />
            </Link>
          </div>
          <div className="mt-5">
            {featured.items.length ? (
              <PersonalizedCatalogGrid
                fabrics={featured.items}
                columns="featured"
              />
            ) : (
              <p className="text-sm text-ink-3">
                No published fabrics are available yet.
              </p>
            )}
          </div>
        </section>
      </Container>
    </>
  );
}
