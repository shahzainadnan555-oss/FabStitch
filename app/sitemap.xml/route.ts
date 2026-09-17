import { buildSitemapIndexResponse } from "@/lib/sitemap-http";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Production sitemap index.
 *
 * /sitemap.xml is a sitemapindex pointing at partitioned child urlsets under
 * /sitemaps/sitemap-*. Empty partitions are omitted. URLs are eligibility-gated.
 */
export async function GET() {
  return buildSitemapIndexResponse();
}
