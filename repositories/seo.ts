import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type {
  SeoPage,
  SeoRouteClass,
  SeoRouteClassification,
  SeoSitemapIndex,
  SeoSitemapPage,
} from "@/lib/api/types";

export type PublishedSeoPage = {
  path: string;
  title: string;
  metaDescription?: string;
  canonicalPath?: string;
  isIndexable: boolean;
  lastmod?: string | null;
  pageType?: string;
};

export async function getSeoPageByPath(path: string): Promise<SeoPage | null> {
  try {
    return await api.get<SeoPage>("/seo/pages/by-path", {
      next: { revalidate: 60, tags: [`seo-page:${path}`] },
      query: { path },
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function getSeoSitemapIndex(): Promise<SeoSitemapIndex> {
  return api.get<SeoSitemapIndex>("/seo/sitemap/index", {
    next: { revalidate: 300, tags: ["seo-sitemap"] },
  });
}

export function getSeoSitemapPage(page: number): Promise<SeoSitemapPage> {
  return api.get<SeoSitemapPage>("/seo/sitemap", {
    next: { revalidate: 300, tags: ["seo-sitemap"] },
    query: { page },
  });
}

export async function listSeoSitemapPages(): Promise<SeoSitemapPage[]> {
  const index = await getSeoSitemapIndex();
  if (index.page_count === 0) return [];
  return Promise.all(
    Array.from({ length: index.page_count }, (_, offset) =>
      getSeoSitemapPage(offset + 1),
    ),
  );
}

export function listSeoRouteClasses(): Promise<SeoRouteClass[]> {
  return api.get<SeoRouteClass[]>("/seo/route-classes", {
    next: { revalidate: 300, tags: ["seo-route-classes"] },
  });
}

export function classifySeoRoute(
  path: string,
): Promise<SeoRouteClassification> {
  return api.get<SeoRouteClassification>("/seo/classify", {
    next: { revalidate: 300 },
    query: { path },
  });
}

export async function listIndexablePages(
  _options: { timeoutMs?: number } = {},
): Promise<PublishedSeoPage[]> {
  const pages = await listSeoSitemapPages();
  return pages.flatMap((page) =>
    page.urls.map((entry) => ({
      path: entry.path,
      title: entry.path,
      canonicalPath: entry.loc,
      lastmod: entry.lastmod,
      pageType: entry.page_type,
      isIndexable: true,
    })),
  );
}

export type TopCategory = {
  path: string;
  title: string;
  pageType: string;
  listingCount: number;
  supplierCount: number;
  rank: number;
  demandStatus: string;
  keyword?: string | null;
  intent?: string | null;
  canonicalPath?: string | null;
  searchVolume?: number | null;
};

export async function listTopCategories(_limit = 24): Promise<TopCategory[]> {
  return [];
}

export function orderByRanking<T extends { href: string }>(
  tiles: T[],
  ranking: TopCategory[],
): T[] {
  if (!ranking.length) return tiles;
  const rank = new Map(ranking.map((row) => [row.path, row.rank]));
  return [...tiles].sort((a, b) => {
    const left = rank.get(a.href) ?? Number.MAX_SAFE_INTEGER;
    const right = rank.get(b.href) ?? Number.MAX_SAFE_INTEGER;
    return left - right;
  });
}
