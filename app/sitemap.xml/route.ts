import {
  renderSitemapIndex,
  sitemapPageNumbers,
  xmlResponse,
} from "@/lib/sitemaps";
import { getSeoSitemapIndex } from "@/repositories/seo";

/**
 * Authoritative sitemap index.
 *
 * The current catalogue fits in one child sitemap. Keeping the index/batch
 * shape now means catalogue growth never turns into one oversized XML file.
 */
export async function GET() {
  try {
    const index = await getSeoSitemapIndex();
    return xmlResponse(renderSitemapIndex(sitemapPageNumbers(index)));
  } catch {
    return new Response("Sitemap is temporarily unavailable", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Retry-After": "60",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }
}
