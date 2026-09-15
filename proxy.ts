import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { storefrontRedirect } from "@/lib/storefront-redirects";
import { SITE_URL } from "@/lib/seo";
import { classifySeoRoute, getSeoPageByPath } from "@/repositories/seo";

/**
 * Frontend route migrations plus backend-authoritative crawl directives.
 *
 * This is not an authentication boundary. The SEO API only decides whether
 * crawlers may index or follow a public request.
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

function hasPrivatePrefix(pathname: string): boolean {
  return PRIVATE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

async function robotsDirective(request: NextRequest): Promise<string | null> {
  if (hasPrivatePrefix(request.nextUrl.pathname)) {
    return "noindex, nofollow";
  }
  if (request.nextUrl.search) {
    return "noindex, follow";
  }
  const requestPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  try {
    const [classification, page] = await Promise.all([
      classifySeoRoute(requestPath),
      getSeoPageByPath(requestPath),
    ]);
    if (NON_FOLLOWABLE_ROUTE_CLASSES.has(classification.route_class)) {
      return "noindex, nofollow";
    }
    if (!classification.allow_index || classification.is_search_or_filter) {
      return "noindex, follow";
    }

    if (
      !page?.is_indexable ||
      /\bnoindex\b/i.test(page.robots_directives ?? "")
    ) {
      return "noindex, follow";
    }
    return null;
  } catch {
    return "noindex, follow";
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
  const robots = await robotsDirective(request);
  if (robots) response.headers.set("X-Robots-Tag", robots);
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
