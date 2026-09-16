import { renderUrlSet, xmlResponse } from "@/lib/sitemaps";
import { localSitemapUrls } from "@/lib/sitemap-fallback";
import { sanitizeSitemapUrls } from "@/lib/sitemap-sanitize";
import { getSeoSitemapIndex, getSeoSitemapPage } from "@/repositories/seo";
import type { SeoSitemapPage } from "@/lib/api/types";

// Never bake an empty build-time sitemap into the deployment artifact.
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Production sitemap.
 *
 * Prefer the live SEO API when it returns real URLs, then sanitize obsolete
 * paths (e.g. /best-for/ → /fabrics/best-for/) and merge the curated local
 * registry. Never return an empty <sitemapindex>.
 */
async function resolveSitemapUrls(): Promise<SeoSitemapPage["urls"]> {
  try {
    const index = await getSeoSitemapIndex();
    if (index.page_count > 0 && index.total_urls > 0) {
      const pages = await Promise.all(
        Array.from({ length: index.page_count }, (_, offset) =>
          getSeoSitemapPage(offset + 1),
        ),
      );
      const urls = pages
        .flatMap((page) => page.urls)
        .filter((entry) => entry.loc);
      if (urls.length > 0) {
        return sanitizeSitemapUrls(urls);
      }
    }
  } catch {
    // Fall through to the local registry.
  }

  return localSitemapUrls();
}

export async function GET() {
  const urls = await resolveSitemapUrls();

  if (urls.length === 0) {
    return new Response("Sitemap is temporarily unavailable", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Retry-After": "60",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  return xmlResponse(renderUrlSet(urls));
}
