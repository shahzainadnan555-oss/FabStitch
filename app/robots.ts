import type { MetadataRoute } from "next";
import { absolute } from "@/lib/seo";
import { listSeoRouteClasses } from "@/repositories/seo";

/**
 * Private routes are crawl-blocked. Public query states remain crawlable long
 * enough for their page-level noindex/canonical directives to be read; robots
 * is not used as a substitute for deindexation.
 *
 * Obsolete public routes are also left crawlable so a crawler can receive
 * their permanent redirects and transfer signals to the final storefront URL.
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
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const routeClasses = await listSeoRouteClasses().catch(() => []);
  const disallow = [
    ...new Set([
      ...PRIVATE_PREFIXES,
      ...routeClasses
        .filter((route) => DISALLOWED_ROUTE_CLASSES.has(route.route_class))
        .map((route) =>
          route.path_prefix === "/"
            ? route.path_prefix
            : `${route.path_prefix.replace(/\/+$/, "")}/`,
        ),
    ]),
  ];

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: absolute("/sitemap.xml"),
    host: absolute("/"),
  };
}
