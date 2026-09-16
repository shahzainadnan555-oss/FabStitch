import type { SeoSitemapPage } from "@/lib/api/types";
import { absoluteSitemapUrl } from "@/lib/sitemaps";
import { storefrontRedirect } from "@/lib/storefront-redirects";
import { seoPage } from "@/domain/seo/storefront-registry";
import { localSitemapUrls } from "@/lib/sitemap-fallback";

const PRIVATE_PREFIXES = [
  "/admin/",
  "/buyer/",
  "/account/",
  "/inquiries/",
  "/onboarding/",
  "/supplier/",
  "/rfq/",
  "/compare/",
  "/login/",
  "/signup/",
  "/forgot-password/",
  "/reset-password/",
  "/auth/",
  "/checkout/",
  "/orders/",
  "/cart/",
  "/api/",
] as const;

/** Paths the SEO API may still emit after route migrations. */
function rewriteObsoletePath(pathname: string): string {
  if (pathname === "/best-for/") return "/fabrics/best-for/";
  const bestFor = pathname.match(/^\/best-for\/([^/]+)\/$/);
  if (bestFor) return `/fabrics/best-for/${bestFor[1]}/`;
  if (pathname === "/search/") return "/marketplace/";
  if (pathname === "/applications/") return "/fabrics/best-for/";
  const application = pathname.match(/^\/applications\/([^/]+)\/$/);
  if (application) return `/fabrics/best-for/${application[1]}/`;
  return pathname;
}

function normalizePathname(pathOrUrl: string): string | null {
  let pathname = pathOrUrl;
  if (/^https?:\/\//i.test(pathOrUrl)) {
    try {
      pathname = new URL(pathOrUrl).pathname;
    } catch {
      return null;
    }
  }
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  pathname = pathname.replace(/\/{2,}/g, "/").toLowerCase();
  if (pathname !== "/" && !pathname.endsWith("/")) pathname = `${pathname}/`;

  pathname = rewriteObsoletePath(pathname);

  // Resolve known storefront redirects until stable (max 3 hops).
  for (let hop = 0; hop < 3; hop += 1) {
    const next = storefrontRedirect(pathname);
    if (!next || next === pathname) break;
    pathname = next;
  }

  if (PRIVATE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return pathname;
}

function isPublicSitemapCandidate(pathname: string): boolean {
  const record = seoPage(pathname);
  if (record) return Boolean(record.sitemapEligible);

  // Unknown to the local registry: allow only clear public hub/detail surfaces.
  // Never admit arbitrary /fabrics/:slug/ PDPs — those may be published_noindex.
  if (
    pathname === "/" ||
    pathname === "/marketplace/" ||
    pathname === "/fabrics/" ||
    pathname === "/collections/" ||
    pathname === "/fabrics/best-for/" ||
    pathname === "/guides/" ||
    pathname === "/about/" ||
    pathname === "/how-it-works/" ||
    pathname === "/contact/" ||
    pathname === "/support/" ||
    pathname === "/help/"
  ) {
    return true;
  }

  if (/^\/collections\/[^/]+\/$/.test(pathname)) return true;
  if (/^\/fabrics\/best-for\/[^/]+\/$/.test(pathname)) return true;
  if (/^\/guides\/[^/]+\/$/.test(pathname)) return true;
  if (/^\/help\/[^/]+\/$/.test(pathname)) return true;

  return false;
}

/**
 * Normalize backend sitemap URLs onto live storefront paths, drop private /
 * obsolete locs, dedupe, and merge the curated local registry so money pages
 * are never missing when the API is stale.
 */
export function sanitizeSitemapUrls(
  apiUrls: SeoSitemapPage["urls"],
): SeoSitemapPage["urls"] {
  const byPath = new Map<string, SeoSitemapPage["urls"][number]>();

  for (const entry of apiUrls) {
    const pathname = normalizePathname(entry.path || entry.loc);
    if (!pathname || !isPublicSitemapCandidate(pathname)) continue;
    const loc = absoluteSitemapUrl(pathname);
    const existing = byPath.get(pathname);
    byPath.set(pathname, {
      ...entry,
      ...existing,
      loc,
      path: pathname,
      lastmod: entry.lastmod ?? existing?.lastmod ?? null,
      priority_hint: existing?.priority_hint ?? entry.priority_hint ?? null,
    });
  }

  // Always union curated local registry URLs (correct canonical paths).
  for (const entry of localSitemapUrls()) {
    const pathname = normalizePathname(entry.path || entry.loc);
    if (!pathname) continue;
    if (!byPath.has(pathname)) {
      byPath.set(pathname, entry);
    }
  }

  const urls = [...byPath.values()].sort((a, b) =>
    (a.path || a.loc).localeCompare(b.path || b.loc),
  );

  // If the API feed was dominated by obsolete paths and left us thin after
  // rewrite, prefer the deterministic local registry alone.
  const local = localSitemapUrls();
  if (urls.length < Math.max(20, Math.floor(local.length * 0.5))) {
    return local;
  }

  return urls;
}
