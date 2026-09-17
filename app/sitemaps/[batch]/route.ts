import { buildChildSitemapResponse } from "@/lib/sitemap-http";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Named child sitemap batches:
 * /sitemaps/sitemap-core/
 * /sitemaps/sitemap-fabrics/
 * /sitemaps/sitemap-collections/
 * /sitemaps/sitemap-best-for/
 * /sitemaps/sitemap-guides/
 * /sitemaps/sitemap-products/
 * /sitemaps/sitemap-discover-001/
 *
 * Numeric batches are no longer used; they 404 so crawlers follow the index.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ batch: string }> },
) {
  const { batch } = await params;
  return buildChildSitemapResponse(batch);
}
