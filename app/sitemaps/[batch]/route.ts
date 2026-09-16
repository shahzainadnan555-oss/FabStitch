import { renderUrlSet, xmlResponse } from "@/lib/sitemaps";
import { localSitemapPage } from "@/lib/sitemap-fallback";
import { getSeoSitemapIndex, getSeoSitemapPage } from "@/repositories/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Optional child sitemap batch.
 * Primary discovery uses /sitemap.xml as a single urlset. This route remains
 * for compatibility and for a future multi-file split if the catalogue grows.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ batch: string }> },
) {
  const { batch: id } = await params;
  const page = Number(id);
  if (!Number.isInteger(page) || page < 1) {
    return new Response("Sitemap batch not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  try {
    const index = await getSeoSitemapIndex();
    if (
      index.page_count > 0 &&
      index.total_urls > 0 &&
      page <= index.page_count
    ) {
      const sitemap = await getSeoSitemapPage(page);
      if (sitemap.urls.length > 0) {
        return xmlResponse(renderUrlSet(sitemap.urls));
      }
    }
  } catch {
    // Fall through to the local registry.
  }

  if (page === 1) {
    const local = localSitemapPage();
    if (local.urls.length > 0) {
      return xmlResponse(renderUrlSet(local.urls));
    }
  }

  return new Response("Sitemap batch not found", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
