import type { SeoSitemapPage } from "@/lib/api/types";
import { absoluteSitemapUrl } from "@/lib/sitemaps";
import {
  SITEMAP_ELIGIBLE_SEO_PAGES,
  type StorefrontPageType,
} from "@/domain/seo/storefront-registry";

const PRIORITY_BY_TYPE: Partial<Record<StorefrontPageType, string>> = {
  home: "1.0",
  marketplace: "0.9",
  fabric_hub: "0.9",
  collection_hub: "0.8",
  best_for_hub: "0.8",
  fabric: "0.8",
  collection: "0.7",
  seasonal_collection: "0.7",
  best_for: "0.7",
  guide_hub: "0.6",
  guide: "0.6",
  help_hub: "0.5",
  help: "0.4",
  brand: "0.5",
  support: "0.4",
  legal: "0.3",
};

/**
 * Local sitemap from the curated storefront SEO registry.
 * Only sitemap-eligible (indexable, public, canonical) pages are included.
 */
export function localSitemapUrls(): SeoSitemapPage["urls"] {
  return SITEMAP_ELIGIBLE_SEO_PAGES.map((page) => ({
    loc: absoluteSitemapUrl(page.canonicalPath),
    path: page.canonicalPath,
    lastmod: null,
    page_type: page.type,
    priority_hint: PRIORITY_BY_TYPE[page.type] ?? "0.5",
  }));
}

export function localSitemapPage(): SeoSitemapPage {
  const urls = localSitemapUrls();
  return {
    page: 1,
    page_size: urls.length,
    total_urls: urls.length,
    urls,
  };
}
