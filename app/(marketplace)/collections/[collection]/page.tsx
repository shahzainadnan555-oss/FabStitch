import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FabricCatalogueCard } from "@/components/marketplace/fabric-card";
import {
  CatalogCursorPagination,
  NoResults,
} from "@/components/marketplace/results";
import { PageHeader } from "@/components/marketplace/page-header";
import { Container } from "@/components/ui/layout";
import { IconArrowRight } from "@/components/ui/icon";
import {
  hasSeoQueryState,
  registeredStorefrontMetadata,
} from "@/lib/storefront-metadata";
import {
  getCustomerCollection,
  isCustomerCatalogSort,
} from "@/repositories/customer-catalog";
import { numericParam } from "@/lib/query-params";
import { CollectionPageJsonLd } from "@/components/seo/structured-data";

type Props = {
  params: Promise<{ collection: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const PAGE_SIZE = 24;

const single = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const [{ collection: slug }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  const collection = await getCustomerCollection(slug, { limit: 1 });
  if (!collection) {
    return {
      title: "Collection not found",
      robots: { index: false, follow: true },
    };
  }
  return registeredStorefrontMetadata(`/collections/${collection.slug}/`, {
    title: collection.seoTitle ?? `${collection.name} fabrics`,
    description:
      collection.seoDescription ??
      collection.description ??
      `Explore ${collection.name} fabrics on FabStitch — compare composition, construction, and documented uses before you inquire.`,
    index: !hasSeoQueryState(query),
  });
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const [{ collection: slug }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  const requestedSort = single(query.sort);
  const sort = isCustomerCatalogSort(requestedSort)
    ? requestedSort
    : "editorial";
  const limit =
    numericParam(single(query.page_size), { min: 1, max: 48 }) ?? PAGE_SIZE;
  const collection = await getCustomerCollection(slug, {
    cursor: single(query.cursor),
    limit,
    sort,
  });
  if (!collection) notFound();

  const description =
    collection.description ??
    `Explore the published fabrics in the ${collection.name} collection.`;
  const bestFor = [
    ...new Map(
      collection.fabrics
        .flatMap((fabric) => fabric.bestFor)
        .map((item) => [item.slug, item]),
    ).values(),
  ];

  return (
    <>
      <CollectionPageJsonLd
        name={collection.seoTitle ?? collection.name}
        description={collection.seoDescription ?? description}
        path={`/collections/${collection.slug}/`}
        items={collection.fabrics.map((fabric) => ({
          name: fabric.name,
          path: `/fabrics/${fabric.slug}/`,
          image: fabric.media.src,
        }))}
      />
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Collections", href: "/collections/" },
          { label: collection.name },
        ]}
        eyebrow="Fabric collection"
        title={
          /\bfabrics?\b/i.test(collection.name)
            ? collection.name
            : `${collection.name} fabrics`
        }
        intro={description}
        meta={[
          {
            label: "Published fabrics",
            value: collection.total ?? collection.fabrics.length,
          },
        ]}
      />

      <Container className="py-10 sm:py-14">
        <section
          aria-labelledby="collection-introduction"
          className="max-w-[70ch]"
        >
          <h2
            id="collection-introduction"
            className="text-h2 font-semibold text-ink"
          >
            Inside this collection
          </h2>
          <p className="mt-4 text-body leading-relaxed text-ink-2 text-pretty">
            {description}
          </p>
        </section>

        <section className="mt-12" aria-labelledby="collection-products">
          <div className="flex items-end justify-between gap-5">
            <h2
              id="collection-products"
              className="text-h2 font-semibold text-ink"
            >
              {collection.total === null
                ? "Fabrics in this collection"
                : `${collection.total} fabrics to compare`}
            </h2>
            <Link
              href={`/marketplace/?collection=${encodeURIComponent(collection.slug)}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo"
            >
              Refine in search
              <IconArrowRight width={14} height={14} aria-hidden />
            </Link>
          </div>
          {collection.fabrics.length ? (
            <>
              <div className="mt-5 grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {collection.fabrics.map((fabric) => (
                  <FabricCatalogueCard key={fabric.id} fabric={fabric} />
                ))}
              </div>
              <CatalogCursorPagination
                currentCursor={single(query.cursor)}
                nextCursor={collection.nextCursor}
                hasMore={collection.hasMore}
                pageSize={collection.pageSize}
                defaultPageSize={PAGE_SIZE}
                basePath={`/collections/${collection.slug}/`}
                searchParams={query}
              />
            </>
          ) : (
            <NoResults
              className="mt-5"
              title="No published fabrics in this collection"
              description="The collection exists, but it does not currently contain any public fabric records."
              actions={[
                { label: "Browse every fabric", href: "/marketplace/" },
                { label: "View all collections", href: "/collections/" },
              ]}
            />
          )}
        </section>

        {bestFor.length ? (
          <section className="mt-14 border-t border-rule pt-10">
            <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
              Continue by product
            </p>
            <h2 className="mt-2 text-h2 font-semibold text-ink">
              Best For uses in this collection
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {bestFor.map((useCase) => (
                <li key={useCase.slug}>
                  <Link
                    href={`/fabrics/best-for/${useCase.slug}/`}
                    className="inline-flex rounded-sm border border-rule-2 bg-paper-raised px-3 py-2 text-sm font-medium text-ink hover:border-indigo hover:text-indigo"
                  >
                    {useCase.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-14 border-t border-rule pt-10">
          <h2 className="text-h3 font-semibold text-ink">Keep exploring</h2>
          <p className="mt-2 max-w-[48ch] text-sm text-ink-3">
            Search the full marketplace, or read a guide before you inquire.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link
              href="/marketplace/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo"
            >
              Open marketplace
              <IconArrowRight width={14} height={14} aria-hidden />
            </Link>
            <Link
              href="/guides/how-to-buy-fabric-online/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo"
            >
              How to buy fabric online
            </Link>
            <Link
              href="/guides/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo"
            >
              All fabric guides
            </Link>
          </div>
        </section>
      </Container>
    </>
  );
}
