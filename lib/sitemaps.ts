import type { SeoSitemapIndex, SeoSitemapPage } from "@/lib/api/types";
import { absolute } from "@/lib/seo";

export function sitemapPageNumbers(index: SeoSitemapIndex): number[] {
  return Array.from({ length: index.page_count }, (_, offset) => offset + 1);
}

function xml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function renderSitemapIndex(pages: readonly number[]): string {
  const locations = pages
    .map(
      (page) =>
        `  <sitemap><loc>${xml(absolute(`/sitemaps/${page}/`))}</loc></sitemap>`,
    )
    .join("\n");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    locations,
    "</sitemapindex>",
    "",
  ].join("\n");
}

export function renderUrlSet(entries: SeoSitemapPage["urls"]): string {
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastmod
        ? `\n    <lastmod>${xml(entry.lastmod)}</lastmod>`
        : "";
      const numericPriority = Number(entry.priority_hint);
      const priority =
        entry.priority_hint &&
        Number.isFinite(numericPriority) &&
        numericPriority >= 0 &&
        numericPriority <= 1
          ? `\n    <priority>${xml(entry.priority_hint)}</priority>`
          : "";
      return [
        "  <url>",
        `    <loc>${xml(entry.loc)}</loc>${lastmod}${priority}`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}

export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
