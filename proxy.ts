import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isIndexableSeoPath } from "@/domain/seo/storefront-registry";
import { storefrontRedirect } from "@/lib/storefront-redirects";
import { SITE_URL } from "@/lib/seo";
import { hasIndexAffectingSearchParams } from "@/lib/seo-query";
import { classifySeoRoute, getSeoPageByPath } from "@/repositories/seo";

/**
 * Frontend route migrations plus crawl directives.
 *
 * X-Robots-Tag is only applied for private/auth routes and real filter/query
 * states. Clean public money pages must remain crawlable and indexable even
 * when the SEO API has no page row or mis-labels a hub as "filter".
 */
const NON_FOLLOWABLE_ROUTE_CLASSES = new Set([
  "admin",
  "authentication",
  "private",
  "transactional",
]);

const PRIVATE_PATH_PREFIXES = [
  "/admin",
  "/buyer",
  "/account",
  "/inquiries",
  "/onboarding",
  "/supplier",
  "/rfq",
  "/compare",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/auth",
] as const;

/** Clean hubs the SEO API may still label as filter/search. */
const ALWAYS_INDEXABLE_CLEAN_PATHS = new Set([
  "/",
  "/marketplace/",
  "/fabrics/",
  "/collections/",
  "/fabrics/best-for/",
  "/guides/",
  "/about/",
  "/how-it-works/",
  "/contact/",
  "/support/",
  "/help/",
]);

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  const collapsed = pathname.replace(/\/{2,}/g, "/");
  return collapsed.endsWith("/") ? collapsed : `${collapsed}/`;
}

function hasPrivatePrefix(pathname: string): boolean {
  const raw =
    pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;
  return PRIVATE_PATH_PREFIXES.some(
    (prefix) => raw === prefix || raw.startsWith(`${prefix}/`),
  );
}

function isCleanPublicMoneyPath(pathname: string): boolean {
  const path = normalizePathname(pathname);
  if (ALWAYS_INDEXABLE_CLEAN_PATHS.has(path)) return true;
  if (isIndexableSeoPath(path)) return true;
  return false;
}

async function robotsDirective(request: NextRequest): Promise<string | null> {
  const pathname = normalizePathname(request.nextUrl.pathname);

  if (hasPrivatePrefix(pathname)) {
    return "noindex, nofollow";
  }

  // Faceted/query states stay noindex; clean URLs do not.
  if (hasIndexAffectingSearchParams(request.nextUrl.searchParams)) {
    return "noindex, follow";
  }

  // Known money/public pages: never emit X-Robots-Tag noindex on clean URLs.
  if (isCleanPublicMoneyPath(pathname)) {
    return null;
  }

  try {
    const [classification, page] = await Promise.all([
      classifySeoRoute(pathname),
      getSeoPageByPath(pathname),
    ]);

    if (NON_FOLLOWABLE_ROUTE_CLASSES.has(classification.route_class)) {
      return "noindex, nofollow";
    }

    // Explicit backend page row saying noindex.
    if (
      page &&
      (!page.is_indexable || /\bnoindex\b/i.test(page.robots_directives ?? ""))
    ) {
      return "noindex, follow";
    }

    // Explicit indexable page row.
    if (page?.is_indexable) {
      return null;
    }

    // public_seo without a row → allow (do not fail closed).
    if (
      classification.route_class === "public_seo" &&
      classification.allow_index
    ) {
      return null;
    }

    if (!classification.allow_index || classification.is_search_or_filter) {
      return "noindex, follow";
    }

    return null;
  } catch {
    // On SEO API failure, do not blanket-noindex the site.
    return null;
  }
}

function hostname(value: string): string {
  return value.split(":")[0]?.toLowerCase() ?? "";
}

function isVercelDeploymentHost(host: string): boolean {
  return host.endsWith(".vercel.app");
}

function isProductionSiteHost(host: string, canonicalHost: string): boolean {
  const apex = canonicalHost.replace(/^www\./, "");
  return host === canonicalHost || host === apex || host === `www.${apex}`;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Sitemap and robots must never receive X-Robots-Tag: noindex.
  const isSitemapOrRobots =
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/sitemap-index.xml" ||
    pathname.startsWith("/sitemaps/");

  const canonicalOrigin = new URL(SITE_URL);
  const canonicalHost = hostname(canonicalOrigin.host);
  const requestProtocol =
    request.headers.get("x-forwarded-proto") ??
    request.nextUrl.protocol.slice(0, -1);
  const requestHost = hostname(
    request.headers.get("x-forwarded-host") ??
      request.headers.get("host") ??
      request.nextUrl.host,
  );
  if (
    process.env.NODE_ENV === "production" &&
    canonicalOrigin.protocol === "https:" &&
    !isVercelDeploymentHost(requestHost) &&
    isProductionSiteHost(requestHost, canonicalHost) &&
    (requestProtocol !== "https" || requestHost !== canonicalHost)
  ) {
    return NextResponse.redirect(
      new URL(`${pathname}${search}`, canonicalOrigin),
      308,
    );
  }
  const destination = storefrontRedirect(pathname);
  if (destination) {
    return NextResponse.redirect(
      new URL(`${destination}${search}`, request.url),
      308,
    );
  }

  const response = NextResponse.next();
  if (!isSitemapOrRobots) {
    const robots = await robotsDirective(request);
    if (robots) response.headers.set("X-Robots-Tag", robots);
  }
  return response;
}

export const config = {
  matcher: [
    "/robots.txt",
    "/sitemap.xml",
    "/sitemap-index.xml",
    "/sitemaps/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
