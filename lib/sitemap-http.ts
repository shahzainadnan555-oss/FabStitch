import {
  renderInventoryUrlSet,
  renderSitemapIndexFromFiles,
  xmlResponse,
} from "@/lib/sitemaps";
import {
  childSitemapById,
  partitionSitemapInventory,
  resolveSitemapInventory,
} from "@/lib/sitemap-inventory";

export async function buildSitemapIndexResponse(): Promise<Response> {
  const inventory = await resolveSitemapInventory();
  const files = partitionSitemapInventory(inventory);

  if (files.length === 0) {
    return new Response("Sitemap is temporarily unavailable", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Retry-After": "60",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  return xmlResponse(renderSitemapIndexFromFiles(files));
}

export async function buildChildSitemapResponse(
  batch: string,
): Promise<Response> {
  const inventory = await resolveSitemapInventory();
  const files = partitionSitemapInventory(inventory);
  const child = childSitemapById(files, batch);
  if (!child || child.urls.length === 0) {
    return new Response("Sitemap batch not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return xmlResponse(renderInventoryUrlSet(child.urls));
}
