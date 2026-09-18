import type { SeoSitemapIndex, SeoSitemapPage } from "@/lib/api/types";
import { absolute, SITE_URL } from "@/lib/seo";
import type { SitemapChildFile } from "@/lib/sitemap-inventory";

const PRODUCTION_SITEMAP_ORIGIN = "https://fabstitch.net";

/**
 * Absolute public website URL for sitemap page entries.
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

/** Absolute HTTPS asset URL without a trailing slash. */
export function absoluteAssetUrl(assetPath: string): string {
  if (/^https?:\/\//i.test(assetPath)) {
    try {
      const parsed = new URL(assetPath);
      return `${PRODUCTION_SITEMAP_ORIGIN}${parsed.pathname}`;
    } catch {
      // Fall through.
    }
  }
  const path = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  return `${PRODUCTION_SITEMAP_ORIGIN}${path}`;
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

function isValidLastmod(value: string): boolean {
  // W3C Datetime subset commonly accepted by Google: YYYY-MM-DD or full ISO.
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) ||
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      value,
    )
  );
}

/**
 * Sitemap index listing every non-empty child sitemap.
 * Child locs use trailing-slash paths compatible with Next trailingSlash.
 */
export function renderSitemapIndexFromFiles(
  files: readonly SitemapChildFile[],
): string {
  const locations = files
    .map(
      (file) =>
        `  <sitemap>\n    <loc>${xml(absoluteSitemapUrl(file.path))}</loc>\n  </sitemap>`,
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

/** @deprecated Prefer renderSitemapIndexFromFiles with named partitions. */
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

function renderImageNodes(images: readonly string[]): string {
  return images
    .map(
      (image) =>
        `\n    <image:image>\n      <image:loc>${xml(image)}</image:loc>\n    </image:image>`,
    )
    .join("");
}

/**
 * Render a urlset. Uses Google image sitemap namespace when any URL has images.
 * Does not emit priority or changefreq — Google ignores them.
 */
export function renderInventoryUrlSet(
  entries: readonly {
    loc: string;
    lastmod: string | null;
    images: readonly string[];
  }[],
): string {
  const includeImages = entries.some((entry) => entry.images.length > 0);
  const urls = entries
    .map((entry) => {
      const lastmod =
        entry.lastmod && isValidLastmod(entry.lastmod)
          ? `\n    <lastmod>${xml(entry.lastmod)}</lastmod>`
          : "";
      const images = includeImages ? renderImageNodes(entry.images) : "";
      return [
        "  <url>",
        `    <loc>${xml(entry.loc)}</loc>${lastmod}${images}`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  const root = includeImages
    ? '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
    : '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    root,
    urls,
    "</urlset>",
    "",
  ].join("\n");
}

/**
 * Legacy API urlset renderer kept for sanitize/fallback callers.
 * Priority and changefreq are intentionally omitted.
 */
export function renderUrlSet(entries: SeoSitemapPage["urls"]): string {
  return renderInventoryUrlSet(
    entries.map((entry) => ({
      loc: absoluteSitemapUrl(entry.path || entry.loc),
      lastmod:
        entry.lastmod && isValidLastmod(entry.lastmod) ? entry.lastmod : null,
      images: [],
    })),
  );
}

export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      "CDN-Cache-Control": "public, max-age=300",
    },
  });
}

/** @deprecated Prefer absoluteSitemapUrl for sitemap documents. */
export function sitemapAbsolute(path: string): string {
  return absolute(path) || `${SITE_URL}${path}`;
}
