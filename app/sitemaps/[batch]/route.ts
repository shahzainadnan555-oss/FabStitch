import { renderUrlSet, xmlResponse } from "@/lib/sitemaps";
import { getSeoSitemapIndex, getSeoSitemapPage } from "@/repositories/seo";

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
    if (page > index.page_count) {
      return new Response("Sitemap batch not found", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    const sitemap = await getSeoSitemapPage(page);
    return xmlResponse(renderUrlSet(sitemap.urls));
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
