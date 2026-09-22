/**
 * Best For SEO pages use SEO_USE_CASES slugs (shirts, activewear, …).
 * The customer catalog API often uses application slugs (shirting,
 * performance-apparel, …). Resolve a crawlable page from the local catalog
 * when the API slug differs or the API is unavailable.
 */
import type { SeoUseCase } from "@/catalog";
import {
  getCustomerBestForDetail,
  type CustomerBestForDetail,
  type CustomerCatalogFabric,
  type CustomerCatalogQuery,
} from "@/repositories/customer-catalog";
import {
  bestForApiCandidates,
  localBestForDetail,
} from "@/lib/best-for-resolve";

export type ResolvedBestForPage = {
  /** Canonical SEO slug from the URL / registry. */
  slug: string;
  name: string;
  description: string;
  editorial: SeoUseCase | null;
  /** API slug used for marketplace filters when different from SEO slug. */
  marketplaceBestForSlug: string;
  fabrics: CustomerCatalogFabric[];
  total: number | null;
  pageSize: number;
  hasMore: boolean;
  nextCursor: string | null;
  source: "api" | "local";
};

export { bestForApiCandidates, localBestForDetail };

async function fetchFirstApiDetail(
  candidates: readonly string[],
  query: Pick<CustomerCatalogQuery, "cursor" | "limit" | "sort">,
): Promise<{ detail: CustomerBestForDetail; apiSlug: string } | null> {
  for (const candidate of candidates) {
    try {
      const detail = await getCustomerBestForDetail(candidate, query);
      if (detail) return { detail, apiSlug: candidate };
    } catch {
      // Try the next candidate. Do not leave the route on a hung loader.
    }
  }
  return null;
}

/**
 * Resolve a Best For page for SSR. Known SEO use cases always resolve, even
 * when the backend has no matching slug.
 */
export async function resolveBestForPage(
  seoSlug: string,
  query: Pick<CustomerCatalogQuery, "cursor" | "limit" | "sort"> = {},
): Promise<ResolvedBestForPage | null> {
  const local = localBestForDetail(seoSlug);
  const candidates = bestForApiCandidates(seoSlug);
  const api = await fetchFirstApiDetail(candidates, query);

  if (api) {
    return {
      slug: seoSlug,
      name: local?.name ?? api.detail.name,
      description: local?.description ?? api.detail.description ?? "",
      editorial: local?.editorial ?? null,
      marketplaceBestForSlug: api.apiSlug,
      fabrics: api.detail.fabrics,
      total: api.detail.total,
      pageSize: api.detail.pageSize,
      hasMore: api.detail.hasMore,
      nextCursor: api.detail.nextCursor,
      source: "api",
    };
  }

  if (!local) return null;

  return {
    slug: seoSlug,
    name: local.name,
    description: local.description,
    editorial: local.editorial,
    marketplaceBestForSlug: local.marketplaceBestForSlug,
    fabrics: local.fabrics as CustomerCatalogFabric[],
    total: local.total,
    pageSize: local.pageSize,
    hasMore: false,
    nextCursor: null,
    source: "local",
  };
}
