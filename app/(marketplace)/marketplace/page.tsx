import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/layout";
import { CatalogResultsToolbar } from "@/components/marketplace/catalog-filters";
import { CatalogLoadError } from "@/components/marketplace/catalog-load-error";
import {
  CatalogCursorPagination,
  NoResults,
} from "@/components/marketplace/results";
import { PersonalizedCatalogGrid } from "@/components/marketplace/personalized-catalog-grid";
import { MarketplaceIntro } from "@/components/marketplace/marketplace-intro";
import { ResultsSkeleton } from "@/components/marketplace/route-states";
import {
  getCustomerCollections,
  isCustomerCatalogSort,
  searchCustomerCatalog,
} from "@/repositories/customer-catalog";
import { GSM_BOUNDS, numericParam } from "@/lib/query-params";
import {
  hasSeoQueryState,
  registeredStorefrontMetadata,
} from "@/lib/storefront-metadata";
import { CollectionPageJsonLd } from "@/components/seo/structured-data";

const PAGE_SIZE = 24;

const single = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const values = (value: string | string[] | undefined): string[] | undefined => {
  const items = (Array.isArray(value) ? value : value ? [value] : []).flatMap(
    (item) => item.split(","),
  );
  const normalized = items.map((item) => item.trim()).filter(Boolean);
  return normalized.length ? normalized : undefined;
};

const mergeValues = (
  ...groups: (string[] | undefined)[]
): string[] | undefined => {
  const merged = [...new Set(groups.flatMap((group) => group ?? []))];
  return merged.length ? merged : undefined;
};

export async function generateMetadata({
  searchParams,
}: PageProps<"/marketplace">): Promise<Metadata> {
  const query = await searchParams;
  const filtered = hasSeoQueryState(query);
  return registeredStorefrontMetadata("/marketplace/", {
    title: filtered ? "Fabric search results" : "Fabric Marketplace",
    description: filtered
      ? "Search and filter the FabStitch 2027 fabric catalog. Filtered result views canonicalize to the main marketplace."
      : "Buy fabric online through the FabStitch marketplace. Search fabrics by material, construction, season, weight, and Best For use, then inquire on the cloth that fits.",
    index: !filtered,
  });
}

/**
 * The marketplace.
 *
 * One authenticated surface over the curated catalogue: search across the top,
 * filters down the left, fabric cards in the middle, options on the right.
 *
 * The unit is a **fabric**, not a listing. A fabric is the record FabStitch
 * curates: the cloth, its specification and its image. Supplier listings are
 * outside this customer catalog.
 *
 * Filters and sort are applied by the server-side approved-catalog facade,
 * never to a page of records in the browser.
 */
export default async function MarketplacePage({
  searchParams,
}: PageProps<"/marketplace">) {
  const [query, collections] = await Promise.all([
    searchParams,
    getCustomerCollections(),
  ]);
  return (
    <>
      <MarketplaceIntro
        query={single(query.q)}
        collections={collections.slice(0, 8)}
      />
      <Suspense fallback={<ResultsSkeleton cards={6} />}>
        <MarketplaceResults query={query} />
      </Suspense>
    </>
  );
}

type MarketplaceQuery = Awaited<PageProps<"/marketplace">["searchParams"]>;

async function MarketplaceResults({ query }: { query: MarketplaceQuery }) {
  const q = single(query.q);
  const defaultSort = q?.trim() ? "relevance" : "featured";
  const requestedSort = single(query.sort);
  const sort = isCustomerCatalogSort(requestedSort) ? requestedSort : undefined;
  const requestedLimit = numericParam(single(query.page_size), {
    min: 1,
    max: 48,
  });

  let results;
  let catalogFailed = false;
  try {
    results = await searchCustomerCatalog({
      q,
      cursor: single(query.cursor),
      limit: requestedLimit ?? PAGE_SIZE,
      sort,
      family: values(query.family),
      fiber: mergeValues(values(query.fiber), values(query.material)),
      fiberPure: values(query.fiber_pure),
      construction: values(query.construction),
      color: values(query.color),
      pattern: values(query.pattern),
      finish: values(query.finish),
      texture: values(query.texture),
      season: values(query.season),
      application: mergeValues(
        values(query.application),
        values(query.use_case),
      ),
      bestFor: values(query.best_for),
      collection: values(query.collection),
      stretch: values(query.stretch),
      weightClass: values(query.weight_class),
      weightMin: numericParam(
        single(query.weight_min) ?? single(query.gsm_min),
        GSM_BOUNDS,
      ),
      weightMax: numericParam(
        single(query.weight_max) ?? single(query.gsm_max),
        GSM_BOUNDS,
      ),
      widthMin: numericParam(single(query.width_min), { min: 1, max: 1000 }),
      widthMax: numericParam(single(query.width_max), { min: 1, max: 1000 }),
    });
  } catch {
    catalogFailed = true;
  }

  if (catalogFailed || !results) {
    return <CatalogLoadError title="Unable to load fabrics right now." />;
  }

  const filtered = Object.keys(query).some(
    (key) => !["cursor", "page", "page_size", "sort"].includes(key),
  );
  const fabrics = results.items;

  return (
    <>
      <CollectionPageJsonLd
        name="Fabric Marketplace | FabStitch"
        description="Search and filter FabStitch fabrics by material, construction, season, weight, and Best For use."
        path="/marketplace/"
        items={
          filtered
            ? []
            : fabrics.slice(0, 24).map((fabric) => ({
                name: fabric.name,
                path: `/fabrics/${fabric.slug}/`,
                image: fabric.media.src,
              }))
        }
      />
      <Container className="py-8 sm:py-10">
        <div className="min-w-0">
          <CatalogResultsToolbar
            total={results.totalKnown ? results.total : null}
            visible={fabrics.length}
            facets={results.facets}
            defaultSort={defaultSort}
          />

          <div className="mt-5">
            {fabrics.length ? (
              <>
                <PersonalizedCatalogGrid fabrics={fabrics} />

                <CatalogCursorPagination
                  currentCursor={single(query.cursor)}
                  nextCursor={results.nextCursor}
                  hasMore={results.hasMore}
                  pageSize={results.pageSize}
                  defaultPageSize={PAGE_SIZE}
                  basePath="/marketplace/"
                  searchParams={query}
                />
              </>
            ) : (
              <NoResults
                title={
                  filtered
                    ? "No fabric matches those filters"
                    : "No fabrics in this collection"
                }
                description={
                  filtered
                    ? "Remove a filter to widen the set. Every option is computed from the current catalog."
                    : "There are no published fabrics in the catalog yet."
                }
              />
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
