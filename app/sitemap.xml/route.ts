import {
  renderSitemapIndex,
  sitemapPageNumbers,
  xmlResponse,
} from "@/lib/sitemaps";
import { localSitemapPage } from "@/lib/sitemap-fallback";
import { getSeoSitemapIndex } from "@/repositories/seo";

/**
 * Authoritative sitemap index.
 *
 * Prefer the live SEO API. When it is empty or unavailable, fall back to the
 * curated storefront registry so Google always receives indexable public URLs.
 */
export async function GET() {
  try {
    const index = await getSeoSitemapIndex();
    if (index.page_count > 0 && index.total_urls > 0) {
      return xmlResponse(renderSitemapIndex(sitemapPageNumbers(index)));
    }
  } catch {
    // Fall through to the local registry.
  }

  const local = localSitemapPage();
  if (local.total_urls === 0) {
    return new Response("Sitemap is temporarily unavailable", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Retry-After": "60",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  return xmlResponse(renderSitemapIndex([1]));
}
