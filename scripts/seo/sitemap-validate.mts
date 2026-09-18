/**
 * Bidirectional sitemap audit.
 *
 * Compares the eligible public canonical registry with the generated sitemap
 * corpus. Exits non-zero when any eligible URL is missing, duplicated, or
 * invalid. Does not claim Google will index every URL.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  INDEXABLE_SEO_PAGES,
  NOINDEX_SEO_PAGES,
  assertStorefrontSeoRegistry,
  seoPage,
} from "@/domain/seo/storefront-registry";
import { INDEXABLE_SEMANTIC_PAGES } from "@/domain/seo/semantic";
import { isPathAllowedByRobots } from "@/lib/robots-policy";
import { storefrontRedirect } from "@/lib/storefront-redirects";
import {
  buildSitemapInventory,
  childSitemapById,
  eligibleSitemapPages,
  partitionSitemapInventory,
  passesSitemapEligibilityGate,
  sitemapInventorySummary,
} from "@/lib/sitemap-inventory";
import {
  buildChildSitemapResponse,
  buildSitemapIndexResponse,
} from "@/lib/sitemap-http";
import {
  renderInventoryUrlSet,
  renderSitemapIndexFromFiles,
} from "@/lib/sitemaps";

const REQUIRED_URLS = [
  "https://fabstitch.net/",
  "https://fabstitch.net/fabrics/",
  "https://fabstitch.net/marketplace/",
  "https://fabstitch.net/discover/breathable-cotton-shirts/",
] as const;

const PRIVATE_PREFIXES = [
  "/admin/",
  "/auth/",
  "/account/",
  "/login/",
  "/signup/",
  "/checkout/",
  "/cart/",
  "/inquiries/",
];

type Finding = { severity: "error" | "warning"; code: string; detail: string };
const findings: Finding[] = [];
function error(code: string, detail: string) {
  findings.push({ severity: "error", code, detail });
}

assertStorefrontSeoRegistry();

const eligible = eligibleSitemapPages();
const inventory = buildSitemapInventory();
const files = partitionSitemapInventory(inventory);
const summary = sitemapInventorySummary(inventory);
const indexXml = renderSitemapIndexFromFiles(files);

if (!indexXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
  error("xml_declaration", "sitemap index missing UTF-8 declaration");
}
if (
  !indexXml.includes(
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  )
) {
  error("sitemap_index_root", "sitemap index missing sitemapindex namespace");
}
if (indexXml.includes("<urlset") || indexXml.includes("<url>")) {
  error("nested_or_urlset", "sitemap index must not contain url entries");
}
if (indexXml.includes("<priority>") || indexXml.includes("<changefreq>")) {
  error("useless_fields", "sitemap index contains priority/changefreq");
}

const indexLocs = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1] ?? "",
);
if (indexLocs.length !== files.length) {
  error(
    "index_count",
    `index lists ${indexLocs.length} children, generator has ${files.length}`,
  );
}

const seenLoc = new Map<string, number>();
const seenPath = new Map<string, number>();
const childStatuses: { id: string; status: number; contentType: string }[] = [];

const indexResponse = await buildSitemapIndexResponse();
if (indexResponse.status !== 200) {
  error("index_http", `sitemap index status ${indexResponse.status}`);
}
const indexType = indexResponse.headers.get("content-type") ?? "";
if (!indexType.includes("xml")) {
  error("index_content_type", `sitemap index content-type ${indexType}`);
}

for (const file of files) {
  if (file.urls.length === 0) error("empty_child", file.id);
  if (file.urls.length > 50_000) error("sitemap_size", file.id);
  const xml = renderInventoryUrlSet(file.urls);
  if (!xml.includes("<urlset")) error("urlset_root", file.id);
  if (xml.includes("<sitemapindex")) {
    error("nested_index", `${file.id} must not be a sitemap index`);
  }
  if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
    error("urlset_namespace", file.id);
  }
  if (xml.includes("<priority>") || xml.includes("<changefreq>")) {
    error("useless_fields", file.id);
  }
  if (Buffer.byteLength(xml, "utf8") > 50 * 1024 * 1024) {
    error("sitemap_bytes", file.id);
  }

  const response = await buildChildSitemapResponse(file.id);
  childStatuses.push({
    id: file.id,
    status: response.status,
    contentType: response.headers.get("content-type") ?? "",
  });
  if (response.status !== 200) {
    error("child_http", `${file.id} status ${response.status}`);
  }
  const body = await response.text();
  if (!body.includes("<urlset") || body.includes("<html")) {
    error("child_body", `${file.id} is not a urlset`);
  }
  const parsedLocs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1] ?? "",
  );
  const pageLocs = parsedLocs.filter((loc) => !loc.includes("/media/"));
  if (pageLocs.length !== file.urls.length) {
    error(
      "child_loc_count",
      `${file.id} parsed ${pageLocs.length} page locs, expected ${file.urls.length}`,
    );
  }

  const unknown = childSitemapById(files, file.id);
  if (!unknown) error("child_missing", file.id);

  for (const entry of file.urls) {
    seenLoc.set(entry.loc, (seenLoc.get(entry.loc) ?? 0) + 1);
    seenPath.set(entry.path, (seenPath.get(entry.path) ?? 0) + 1);

    if (!entry.loc.startsWith("https://fabstitch.net/")) {
      error("invalid_url", entry.loc);
    }
    if (entry.loc.includes("?") || entry.path.includes("?")) {
      error("invalid_url", `query URL ${entry.loc}`);
    }
    if (entry.loc !== `https://fabstitch.net${entry.path}`) {
      error("non_canonical", `${entry.loc} does not match ${entry.path}`);
    }
    if (storefrontRedirect(entry.path)) {
      error("redirect_url", entry.path);
    }
    if (PRIVATE_PREFIXES.some((prefix) => entry.path.startsWith(prefix))) {
      error("private_url", entry.path);
    }
    if (!isPathAllowedByRobots(entry.path)) {
      error("robots_blocked", entry.path);
    }
    const record = seoPage(entry.path);
    if (!record) {
      error("unexpected_url", entry.path);
      continue;
    }
    if (record.canonicalPath !== entry.path) {
      error("non_canonical", entry.path);
    }
    if (!record.indexable || !record.isPublic) {
      error("noindex_url", entry.path);
    }
    if (!passesSitemapEligibilityGate(record)) {
      error("unexpected_url", `${entry.path} failed eligibility gate`);
    }
    if (entry.lastmod && !/^\d{4}-\d{2}-\d{2}/.test(entry.lastmod)) {
      error("invalid_lastmod", entry.path);
    }
  }
}

const duplicates = [...seenLoc.entries()].filter(([, count]) => count > 1);
for (const [loc, count] of duplicates) {
  error("duplicate", `${loc} appears ${count} times`);
}

const eligiblePaths = new Set(eligible.map((page) => page.canonicalPath));
const missing = eligible.filter((page) => !seenPath.has(page.canonicalPath));
for (const page of missing) error("missing", page.canonicalPath);

const unexpected = [...seenPath.keys()].filter(
  (pathname) => !eligiblePaths.has(pathname),
);
for (const pathname of unexpected) error("unexpected", pathname);

for (const loc of REQUIRED_URLS) {
  const count = seenLoc.get(loc) ?? 0;
  if (count !== 1) error("required_url", `${loc} count=${count}`);
}

const discoverInSitemap = [...seenPath.keys()].filter((pathname) =>
  pathname.startsWith("/discover/"),
).length;
if (discoverInSitemap < INDEXABLE_SEMANTIC_PAGES.length + 1) {
  error(
    "discover_coverage",
    `discover sitemap urls ${discoverInSitemap}, semantic indexable ${INDEXABLE_SEMANTIC_PAGES.length}`,
  );
}

const counts = {
  eligible: eligible.length,
  sitemap: inventory.length,
  missing: missing.length,
  unexpected: unexpected.length,
  duplicates: duplicates.length,
  redirects: findings.filter((item) => item.code === "redirect_url").length,
  noindex: findings.filter((item) => item.code === "noindex_url").length,
  private: findings.filter((item) => item.code === "private_url").length,
  invalid: findings.filter((item) => item.code === "invalid_url").length,
  nonCanonical: findings.filter((item) => item.code === "non_canonical").length,
  childErrors: findings.filter((item) => item.code.startsWith("child_")).length,
};

console.log("SEO sitemap audit");
console.log(`TOTAL ELIGIBLE PUBLIC URLS ${counts.eligible}`);
console.log(`TOTAL SITEMAP URLS ${counts.sitemap}`);
console.log(`CHILD SITEMAPS ${files.length}`);
console.log(`MISSING FROM SITEMAP ${counts.missing}`);
console.log(`UNEXPECTED IN SITEMAP ${counts.unexpected}`);
console.log(`DUPLICATES ${counts.duplicates}`);
console.log(`REDIRECT URLS ${counts.redirects}`);
console.log(`NOINDEX URLS ${counts.noindex}`);
console.log(`PRIVATE URLS ${counts.private}`);
console.log(`INVALID URLS ${counts.invalid}`);
console.log(`NON-CANONICAL URLS ${counts.nonCanonical}`);
console.log(`CHILD SITEMAPS WITH ERRORS ${counts.childErrors}`);
for (const child of childStatuses) {
  console.log(`  ${child.id} HTTP ${child.status} ${child.contentType}`);
}
console.log(
  `indexable registry ${INDEXABLE_SEO_PAGES.length}; noindex registry ${NOINDEX_SEO_PAGES.length}; discover semantic ${INDEXABLE_SEMANTIC_PAGES.length}`,
);

const report = {
  eligible: counts.eligible,
  sitemap: counts.sitemap,
  childSitemaps: files.map((file) => ({
    id: file.id,
    path: file.path,
    urls: file.urls.length,
    status: childStatuses.find((item) => item.id === file.id)?.status ?? 0,
  })),
  summary,
  counts,
  findings,
};

const outDir = path.join(process.cwd(), "docs/seo");
mkdirSync(outDir, { recursive: true });
writeFileSync(
  path.join(outDir, "SITEMAP-VALIDATION.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

const errors = findings.filter((item) => item.severity === "error");
if (errors.length || counts.missing || counts.duplicates || counts.invalid) {
  for (const finding of errors.slice(0, 40)) {
    console.error(`ERROR [${finding.code}] ${finding.detail}`);
  }
  process.exit(1);
}

console.log("SEO sitemap audit passed.");
console.log("Sitemap inclusion does not guarantee Google indexing.");
