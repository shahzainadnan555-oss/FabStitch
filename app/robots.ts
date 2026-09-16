import type { MetadataRoute } from "next";
import { absolute } from "@/lib/seo";
import { listSeoRouteClasses } from "@/repositories/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Private routes are crawl-blocked.
 *
 * Public money pages are never disallowed here — use page metadata /
 * X-Robots-Tag only for filter/query noindex states.
 *
 * Never emit `Disallow: /` even if the SEO API returns a root prefix.
 */
const DISALLOWED_ROUTE_CLASSES = new Set([
  "admin",
  "authentication",
  "private",
  "transactional",
]);

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
] as const;

/** Paths that must remain crawlable for SEO. */
const NEVER_DISALLOW = new Set([
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
  "/sitemap.xml",
  "/robots.txt",
]);

function toDisallowPrefix(pathPrefix: string): string | null {
  if (!pathPrefix || pathPrefix === "/") return null;
  const normalized = `${pathPrefix.replace(/\/+$/, "")}/`;
  if (NEVER_DISALLOW.has(normalized) || NEVER_DISALLOW.has(pathPrefix)) {
    return null;
  }
  return normalized;
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const routeClasses = await listSeoRouteClasses().catch(() => []);
  const fromApi = routeClasses
    .filter((route) => DISALLOWED_ROUTE_CLASSES.has(route.route_class))
    .map((route) => toDisallowPrefix(route.path_prefix))
    .filter((prefix): prefix is string => Boolean(prefix));

  const disallow = [...new Set([...PRIVATE_PREFIXES, ...fromApi])].filter(
    (prefix) => prefix !== "/" && !NEVER_DISALLOW.has(prefix),
  );

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/marketplace/",
          "/fabrics/",
          "/fabrics/best-for/",
          "/collections/",
          "/guides/",
        ],
        disallow,
      },
    ],
    sitemap: absolute("/sitemap.xml"),
    host: absolute("/"),
  };
}
