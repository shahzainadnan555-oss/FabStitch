/**
 * Frontend-owned robots.txt policy.
 *
 * IMPORTANT: Do not derive Disallow rules from the backend SEO route-classes
 * API. That API historically contributed to crawl blocks (including a root
 * Disallow) and still mis-labels /marketplace as a filter surface. Crawl
 * policy for Googlebot must be deterministic frontend configuration.
 *
 * Indexation of thin/filter states is handled by meta robots + X-Robots-Tag,
 * never by blocking public SEO directories in robots.txt.
 */

/** Private / authenticated prefixes Googlebot must not crawl. */
export const ROBOTS_DISALLOW_PREFIXES = [
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

/**
 * Public SEO prefixes that must remain crawlable.
 * `Allow: /` already covers these; explicit entries make Googlebot / GSC
 * intent unambiguous and protect against accidental future Disallows.
 */
export const ROBOTS_ALLOW_PREFIXES = [
  "/",
  "/marketplace/",
  "/fabrics/",
  "/fabrics/best-for/",
  "/collections/",
  "/guides/",
  "/discover/",
  "/fabric-sourcing/",
  "/wholesale-fabric/",
  "/help/",
  "/about/",
  "/how-it-works/",
  "/contact/",
  "/support/",
  "/media/",
  "/sitemap.xml",
  "/sitemaps/",
  "/llms.txt",
] as const;

/** Representative public URLs that must never be robots-blocked. */
export const ROBOTS_MUST_ALLOW_URLS = [
  "/",
  "/marketplace/",
  "/fabrics/",
  "/collections/",
  "/collections/cotton/",
  "/fabrics/best-for/",
  "/fabrics/best-for/shirts/",
  "/guides/",
  "/guides/fabric-weight-and-gsm/",
  "/fabric-sourcing/",
  "/wholesale-fabric/",
  "/discover/",
  "/discover/breathable-cotton-shirts/",
  "/discover/cotton-shirts/",
  "/discover/fabric-for-shirts/",
  "/discover/topics/material/",
  "/sitemap.xml",
  "/sitemaps/sitemap-core/",
  "/sitemaps/sitemap-discover-001/",
  "/media/hero-navy-jersey.jpg",
  "/llms.txt",
] as const;

/** Private URLs that must remain disallowed. */
export const ROBOTS_MUST_DISALLOW_URLS = [
  "/admin/",
  "/auth/",
  "/account/",
  "/login/",
  "/signup/",
  "/inquiries/",
  "/checkout/",
  "/cart/",
  "/api/",
] as const;

export const ROBOTS_USER_AGENTS = [
  "*",
  "Googlebot",
  "Googlebot-Image",
  "Googlebot-News",
  "Googlebot-Video",
  "Storebot-Google",
  "Google-InspectionTool",
] as const;

function normalizePath(path: string): string {
  if (!path) return "/";
  if (/^https?:\/\//i.test(path)) {
    try {
      path = new URL(path).pathname;
    } catch {
      return "/";
    }
  }
  if (!path.startsWith("/")) path = `/${path}`;
  return path.replace(/\/{2,}/g, "/");
}

/**
 * Google-compatible longest-match evaluation.
 * Longer rule wins; equal length prefers Allow.
 * @see https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt
 */
export function isPathAllowedByRobots(
  pathOrUrl: string,
  allow: readonly string[] = ROBOTS_ALLOW_PREFIXES,
  disallow: readonly string[] = ROBOTS_DISALLOW_PREFIXES,
): boolean {
  const path = normalizePath(pathOrUrl);
  let bestLength = -1;
  let bestAllowed = true;

  const consider = (rule: string, allowed: boolean) => {
    if (!rule) return;
    const matches =
      rule === "/"
        ? true
        : path === rule ||
          path.startsWith(rule) ||
          // Allow "/discover" style rules without requiring trailing slash input
          (rule.endsWith("/") === false &&
            (path === `${rule}/` || path.startsWith(`${rule}/`)));
    if (!matches) return;
    const length = rule.length;
    if (
      length > bestLength ||
      (length === bestLength && allowed && !bestAllowed)
    ) {
      bestLength = length;
      bestAllowed = allowed;
    }
  };

  for (const rule of allow) consider(rule, true);
  for (const rule of disallow) consider(rule, false);

  // Default allow when no rule matches (Google behavior).
  if (bestLength < 0) return true;
  return bestAllowed;
}

export function assertRobotsPolicy(): void {
  const disallows: readonly string[] = ROBOTS_DISALLOW_PREFIXES;
  if (disallows.some((prefix) => prefix === "/" || prefix === "")) {
    throw new Error("robots policy must never Disallow: /");
  }
  for (const path of ROBOTS_MUST_ALLOW_URLS) {
    if (!isPathAllowedByRobots(path)) {
      throw new Error(`robots policy blocks public SEO path: ${path}`);
    }
  }
  for (const path of ROBOTS_MUST_DISALLOW_URLS) {
    if (isPathAllowedByRobots(path)) {
      throw new Error(`robots policy allows private path: ${path}`);
    }
  }
}

assertRobotsPolicy();
