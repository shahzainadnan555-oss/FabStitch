import type { MetadataRoute } from "next";
import { absolute } from "@/lib/seo";
import {
  ROBOTS_ALLOW_PREFIXES,
  ROBOTS_DISALLOW_PREFIXES,
  ROBOTS_USER_AGENTS,
  assertRobotsPolicy,
} from "@/lib/robots-policy";

/**
 * Deterministic frontend robots.txt.
 *
 * Root cause of prior GSC "Blocked by robots.txt":
 * robots.txt was force-dynamic and merged Disallow prefixes from the backend
 * SEO route-classes API. That feed could (and previously did) produce a root
 * or section Disallow that blocked public money pages for Googlebot.
 *
 * This file no longer calls the backend. Public SEO trees are explicitly
 * allowed for *, Googlebot, and Google-InspectionTool. Private surfaces stay
 * disallowed. Filter/query noindex remains a metadata/header concern.
 */
assertRobotsPolicy();

// Static document — never vary by flaky API responses.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const allow = [...ROBOTS_ALLOW_PREFIXES];
  const disallow = [...ROBOTS_DISALLOW_PREFIXES];

  return {
    rules: ROBOTS_USER_AGENTS.map((userAgent) => ({
      userAgent,
      allow,
      disallow,
    })),
    sitemap: absolute("/sitemap.xml"),
  };
}
