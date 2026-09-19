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
  getCustomerBestForDetail,
  isCustomerCatalogSort,
} from "@/repositories/customer-catalog";
import {
  hasSeoQueryState,
  registeredStorefrontMetadata,
} from "@/lib/storefront-metadata";
import { numericParam } from "@/lib/query-params";
import { CollectionPageJsonLd } from "@/components/seo/structured-data";
import { SEO_USE_CASE_BY_SLUG, fabricsForUseCase } from "@/catalog";
import { bestForNotes } from "@/domain/seo/visible-reading";
import { VisibleReading } from "@/components/seo/visible-reading";

type Props = {
  params: Promise<{ "use-case": string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const PAGE_SIZE = 24;

const single = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const [{ "use-case": slug }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  const useCase = await getCustomerBestForDetail(slug, { limit: 1 });
  if (!useCase) {
    return {
      title: "Best For page not found",
      robots: { index: false, follow: true },
    };
  }
  return registeredStorefrontMetadata(`/fabrics/best-for/${useCase.slug}/`, {
    title: `${useCase.name} fabrics`,
    description:
      useCase.description ??
      `Explore fabrics selected for ${useCase.name.toLowerCase()}.`,
    index: !hasSeoQueryState(query),
  });
}

export default async function BestForPage({ params, searchParams }: Props) {
  const [{ "use-case": slug }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  const requestedSort = single(query.sort);
  const sort = isCustomerCatalogSort(requestedSort)
    ? requestedSort
    : "editorial";
  const limit =
    numericParam(single(query.page_size), { min: 1, max: 48 }) ?? PAGE_SIZE;
  const useCase = await getCustomerBestForDetail(slug, {
    cursor: single(query.cursor),
    limit,
    sort,
  });
  if (!useCase) notFound();

  const description =
    useCase.description ??
    `Explore fabrics selected for ${useCase.name.toLowerCase()}.`;
  const editorial =
    SEO_USE_CASE_BY_SLUG[useCase.slug as keyof typeof SEO_USE_CASE_BY_SLUG];
  const products = editorial ? fabricsForUseCase(editorial) : [];
  const reading = editorial
    ? bestForNotes({
        label: editorial.label,
        introduction: editorial.introduction,
        products: products.map((product) => {
          const gsm =
            "measurements" in product
              ? product.measurements?.find((item) => item.unit === "gsm")
              : undefined;
          const gsmMax =
            gsm && "max" in gsm && typeof gsm.max === "number"
              ? gsm.max
              : undefined;
          return {
            name: product.name,
            composition:
              "composition" in product
                ? (product.composition ?? []).join("; ")
                : "",
            gsm:
              gsm && typeof gsm.min === "number"
                ? gsmMax !== undefined && gsmMax !== gsm.min
                  ? `${gsm.min}–${gsmMax} GSM`
                  : `${gsm.min} GSM`
                : null,
          };
        }),
      })
    : [
        `This Best For edit groups FabStitch fabrics whose documented applications include ${useCase.name.toLowerCase()}. Compare composition, construction, and stated weight on each fabric page before you inquire.`,
      ];

  return (
    <>
      <CollectionPageJsonLd
        name={`${useCase.name} fabrics`}
        description={description}
        path={`/fabrics/best-for/${useCase.slug}/`}
        items={useCase.fabrics.map((fabric) => ({
          name: fabric.name,
          path: `/fabrics/${fabric.slug}/`,
          image: fabric.media.src,
        }))}
      />
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Fabrics", href: "/fabrics/" },
          { label: "Best For", href: "/fabrics/best-for/" },
          { label: useCase.name },
        ]}
        eyebrow="Best For"
        title={`${useCase.name} fabrics`}
        intro={description}
        meta={[
          {
            label: "Documented fabrics",
            value: useCase.total ?? useCase.fabrics.length,
          },
        ]}
      />

      <Container className="py-10 sm:py-14">
        <section aria-labelledby="use-case-guide" className="max-w-[70ch]">
          <VisibleReading
            id="use-case-guide"
            heading={`Choosing for ${useCase.name.toLowerCase()}`}
            paragraphs={reading}
          />
        </section>

        <section className="mt-12" aria-labelledby="use-case-products">
          <div className="flex items-end justify-between gap-5">
            <h2
              id="use-case-products"
              className="text-h2 font-semibold text-ink"
            >
              Best-fit FabStitch fabrics
            </h2>
            <Link
              href={`/marketplace/?best_for=${encodeURIComponent(useCase.slug)}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo"
            >
              Refine in search
              <IconArrowRight width={14} height={14} aria-hidden />
            </Link>
          </div>
          {useCase.fabrics.length ? (
            <>
              <div className="mt-5 grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {useCase.fabrics.map((fabric, index) => (
                  <FabricCatalogueCard
                    key={fabric.id}
                    fabric={fabric}
                    priority={index === 0}
                  />
                ))}
              </div>
              <CatalogCursorPagination
                currentCursor={single(query.cursor)}
                nextCursor={useCase.nextCursor}
                hasMore={useCase.hasMore}
                pageSize={useCase.pageSize}
                defaultPageSize={PAGE_SIZE}
                basePath={`/fabrics/best-for/${useCase.slug}/`}
                searchParams={query}
              />
            </>
          ) : (
            <NoResults
              className="mt-5"
              title="No published fabrics for this use yet"
              description="This Best For edit exists, but it does not currently contain public fabric records."
              actions={[
                { label: "Browse every fabric", href: "/marketplace/" },
                {
                  label: "View all Best For edits",
                  href: "/fabrics/best-for/",
                },
              ]}
            />
          )}
        </section>

        <section className="mt-12 rounded-md border border-rule-2 bg-paper-sunk p-5">
          <h2 className="text-h3 font-semibold text-ink">
            Need a wider starting point?
          </h2>
          <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-ink-3">
            Search the full catalog by material and construction, browse
            collections, or read a guide before you inquire.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link
              href="/marketplace/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo"
            >
              Search all fabrics
              <IconArrowRight width={14} height={14} aria-hidden />
            </Link>
            <Link
              href="/collections/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo"
            >
              Browse collections
            </Link>
            {slug === "shirts" ? (
              <Link
                href="/fabrics/shirt-fabric/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo"
              >
                Shirt fabric types guide
              </Link>
            ) : null}
            {slug === "dresses" ? (
              <Link
                href="/fabrics/dress-fabric/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo"
              >
                Dress fabric types guide
              </Link>
            ) : null}
            <Link
              href="/guides/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo"
            >
              Read fabric guides
            </Link>
          </div>
        </section>
      </Container>
    </>
  );
}
