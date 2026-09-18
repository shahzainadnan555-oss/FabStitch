import type { SeoSitemapPage } from "@/lib/api/types";
import { absoluteSitemapUrl } from "@/lib/sitemaps";
import { eligibleSitemapPages } from "@/lib/sitemap-inventory";

/**
 * Local sitemap URLs from the same eligibility gate as the live sitemap index.
 * Priority/changefreq are intentionally omitted.
 */
export function localSitemapUrls(): SeoSitemapPage["urls"] {
  return eligibleSitemapPages().map((page) => ({
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
