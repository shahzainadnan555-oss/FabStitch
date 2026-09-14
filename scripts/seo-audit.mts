import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  classifySeoRoute,
  getSeoPageByPath,
  getSeoSitemapIndex,
  listSeoRouteClasses,
  listSeoSitemapPages,
} from "@/repositories/seo";

const metadataLimit = Math.max(
  0,
  Number(process.env.SEO_AUDIT_METADATA_LIMIT ?? 100) || 0,
);

function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

const [index, sitemapPages, routeClasses] = await Promise.all([
  getSeoSitemapIndex(),
  listSeoSitemapPages(),
  listSeoRouteClasses(),
]);
const urls = sitemapPages.flatMap((page) => page.urls);
const sampledUrls = urls.slice(0, metadataLimit);
const [metadataPages, classifications] = await Promise.all([
  Promise.all(
    sampledUrls.map((entry) =>
      getSeoPageByPath(entry.path).then((page) => ({
        entry,
        page,
      })),
    ),
  ),
  Promise.all(
    routeClasses.map((route) =>
      classifySeoRoute(route.path_prefix).then((classification) => ({
        route,
        classification,
      })),
    ),
  ),
]);

const malformedUrls = urls.flatMap((entry) => {
  try {
    const url = new URL(entry.loc);
    return url.pathname === entry.path
      ? []
      : [{ path: entry.path, loc: entry.loc, reason: "path_loc_mismatch" }];
  } catch {
    return [{ path: entry.path, loc: entry.loc, reason: "invalid_loc" }];
  }
});
const metadataFindings = metadataPages.flatMap(({ entry, page }) => {
  if (!page) return [{ path: entry.path, issue: "missing_public_seo_page" }];
  const findings: { path: string; issue: string }[] = [];
  if (!page.is_public) findings.push({ path: entry.path, issue: "not_public" });
  if (!page.is_indexable)
    findings.push({ path: entry.path, issue: "not_indexable" });
  if (!page.sitemap_eligible)
    findings.push({ path: entry.path, issue: "not_sitemap_eligible" });
  if (page.canonical_path !== entry.path)
    findings.push({ path: entry.path, issue: "canonical_path_mismatch" });
  if (!page.seo_title?.trim())
    findings.push({ path: entry.path, issue: "missing_seo_title" });
  if (!page.meta_description?.trim())
    findings.push({ path: entry.path, issue: "missing_meta_description" });
  if (/\bnoindex\b/i.test(page.robots_directives ?? ""))
    findings.push({ path: entry.path, issue: "sitemap_page_is_noindex" });
  return findings;
});
const classificationFindings = classifications.flatMap(
  ({ route, classification }) => {
    const findings: {
      pathPrefix: string;
      expected: string;
      actual: string;
    }[] = [];
    if (classification.route_class !== route.route_class) {
      findings.push({
        pathPrefix: route.path_prefix,
        expected: route.route_class,
        actual: classification.route_class,
      });
    }
    return findings;
  },
);

const countedUrls = sitemapPages.reduce(
  (total, page) => total + page.urls.length,
  0,
);
const failures = [
  ...(sitemapPages.length === index.page_count
    ? []
    : [
        `sitemap page count: index=${index.page_count}, fetched=${sitemapPages.length}`,
      ]),
  ...(countedUrls === index.total_urls
    ? []
    : [`sitemap URL count: index=${index.total_urls}, fetched=${countedUrls}`]),
  ...duplicates(urls.map((entry) => entry.path)).map(
    (value) => `duplicate sitemap path: ${value}`,
  ),
  ...duplicates(urls.map((entry) => entry.loc)).map(
    (value) => `duplicate sitemap loc: ${value}`,
  ),
  ...malformedUrls.map(
    (finding) =>
      `${finding.reason}: ${finding.path} resolves through ${finding.loc}`,
  ),
  ...metadataFindings.map((finding) => `${finding.issue}: ${finding.path}`),
  ...classificationFindings.map(
    (finding) =>
      `route classification mismatch: ${finding.pathPrefix} expected ${finding.expected}, received ${finding.actual}`,
  ),
  ...(!routeClasses.some((route) => route.path_prefix === "/")
    ? ["route classes have no root fallback"]
    : []),
];

const report = {
  generatedAt: new Date().toISOString(),
  authority: {
    publication: "/api/v1/seo/pages/by-path",
    sitemapIndex: "/api/v1/seo/sitemap/index",
    sitemapPage: "/api/v1/seo/sitemap?page=",
    routeClasses: "/api/v1/seo/route-classes",
    classification: "/api/v1/seo/classify",
  },
  sitemap: {
    ...index,
    fetchedPages: sitemapPages.length,
    fetchedUrls: countedUrls,
    empty: index.total_urls === 0,
  },
  routeClasses,
  metadataAudit: {
    limit: metadataLimit,
    checked: metadataPages.length,
    totalSitemapUrls: urls.length,
    findings: metadataFindings,
  },
  findings: {
    duplicatePaths: duplicates(urls.map((entry) => entry.path)),
    duplicateLocations: duplicates(urls.map((entry) => entry.loc)),
    malformedUrls,
    classificationMismatches: classificationFindings,
  },
  failures,
};

const artifacts = path.join(process.cwd(), "artifacts");
mkdirSync(artifacts, { recursive: true });
writeFileSync(
  path.join(artifacts, "seo-audit.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
console.log(
  `\nSEO API audit passed: ${countedUrls} sitemap URLs, ${routeClasses.length} route classes, ${metadataPages.length} metadata records checked.`,
);
