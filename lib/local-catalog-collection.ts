import {
  COLLECTION_BY_SLUG,
  COLLECTIONS,
  FABRICS_2027,
  type CollectionSlug,
} from "@/catalog";
import { COLLECTION_SEO_BY_SLUG } from "@/content/collection-seo";
import { localCustomerFabric } from "@/lib/local-catalog-fabric";
import type {
  CustomerCollectionCard,
  CustomerCollectionDetail,
  CustomerCatalogFabric,
  CustomerCatalogQuery,
} from "@/repositories/customer-catalog";

function isCollectionSlug(slug: string): slug is CollectionSlug {
  return Object.prototype.hasOwnProperty.call(COLLECTION_BY_SLUG, slug);
}

/**
 * Local 2027 collection as a customer collection record.
 *
 * Collection hubs must remain legitimate public pages when the catalog API
 * times out or returns an error — otherwise crawlers see missing titles and
 * canonicals on /collections/{slug}/.
 */
export function localCustomerCollectionCard(
  slug: string,
): CustomerCollectionCard | null {
  if (!isCollectionSlug(slug)) return null;
  const definition = COLLECTION_BY_SLUG[slug];
  const enrichment = COLLECTION_SEO_BY_SLUG[slug];
  const fabricCount = FABRICS_2027.filter(
    (fabric) => fabric.collection === slug,
  ).length;
  return {
    slug: definition.slug,
    name: definition.label,
    description:
      enrichment?.seoDescription ??
      `Explore ${definition.label} fabrics in the FabStitch 2027 collection.`,
    fabricCount,
  };
}

export function localCustomerCollections(): CustomerCollectionCard[] {
  return COLLECTIONS.map((collection) =>
    localCustomerCollectionCard(collection.slug),
  ).filter((card): card is CustomerCollectionCard => card !== null);
}

export function localCustomerCollectionDetail(
  slug: string,
  query: Pick<CustomerCatalogQuery, "cursor" | "limit" | "sort"> = {},
): CustomerCollectionDetail | null {
  const card = localCustomerCollectionCard(slug);
  if (!card) return null;

  const enrichment = COLLECTION_SEO_BY_SLUG[slug];
  const all = FABRICS_2027.filter((fabric) => fabric.collection === slug)
    .map((fabric) => localCustomerFabric(fabric.slug))
    .filter((fabric): fabric is CustomerCatalogFabric => fabric !== null);

  const limit = Math.min(Math.max(query.limit ?? 24, 1), 48);
  let start = 0;
  if (query.cursor) {
    const cursorIndex = all.findIndex((fabric) => fabric.slug === query.cursor);
    start = cursorIndex >= 0 ? cursorIndex + 1 : 0;
  }
  const page = all.slice(start, start + limit);
  const next = all[start + limit];

  return {
    ...card,
    seoTitle: enrichment?.seoTitle,
    seoDescription: enrichment?.seoDescription,
    fabrics: page,
    total: all.length,
    pageSize: limit,
    hasMore: Boolean(next),
    nextCursor: next?.slug ?? null,
  };
}
