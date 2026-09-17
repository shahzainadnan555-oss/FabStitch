import type { SeoSitemapPage } from "@/lib/api/types";
import { absoluteSitemapUrl } from "@/lib/sitemaps";
import { SITEMAP_ELIGIBLE_SEO_PAGES } from "@/domain/seo/storefront-registry";

/**
 * Local sitemap from the curated storefront SEO registry.
 * Only sitemap-eligible (indexable, public, canonical) pages are included.
 * Priority/changefreq are intentionally omitted (Google ignores them).
 */
export function localSitemapUrls(): SeoSitemapPage["urls"] {
  return SITEMAP_ELIGIBLE_SEO_PAGES.map((page) => ({
    loc: absoluteSitemapUrl(page.canonicalPath),
    path: page.canonicalPath,
    lastmod: null,
    page_type: page.type,
    priority_hint: null,
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
