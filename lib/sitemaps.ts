import type { SeoSitemapIndex, SeoSitemapPage } from "@/lib/api/types";
import { absolute, SITE_URL } from "@/lib/seo";

const PRODUCTION_SITEMAP_ORIGIN = "https://fabstitch.net";

/**
 * Absolute public website URL for sitemap entries.
 * Always uses the production storefront host — never API / preview hosts.
 */
export function absoluteSitemapUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    try {
      const parsed = new URL(pathOrUrl);
      const pathname = parsed.pathname.endsWith("/")
        ? parsed.pathname
        : `${parsed.pathname}/`;
      if (pathname === "//") {
        return `${PRODUCTION_SITEMAP_ORIGIN}/`;
      }
      return `${PRODUCTION_SITEMAP_ORIGIN}${pathname === "/" ? "/" : pathname}`;
    } catch {
      // Fall through to path handling.
    }
  }
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  const normalized =
    path === "/" ? "/" : path.endsWith("/") ? path : `${path}/`;
  return `${PRODUCTION_SITEMAP_ORIGIN}${normalized}`;
}

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
        `  <sitemap><loc>${xml(absoluteSitemapUrl(`/sitemaps/${page}/`))}</loc></sitemap>`,
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
      const loc = absoluteSitemapUrl(entry.path || entry.loc);
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
        `    <loc>${xml(loc)}</loc>${lastmod}${priority}`,
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
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      // Ensure intermediary caches do not keep an empty index forever.
      "CDN-Cache-Control": "public, max-age=300",
    },
  });
}

/** @deprecated Prefer absoluteSitemapUrl for sitemap documents. */
export function sitemapAbsolute(path: string): string {
  return absolute(path) || `${SITE_URL}${path}`;
}
