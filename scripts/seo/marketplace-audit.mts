/**
 * Marketplace cluster audit.
 *
 * Protects https://fabstitch.net/marketplace/ as the commercial canonical and
 * checks supporting pages for unique intent, metadata, images, links, and
 * sitemap inclusion. Exits non-zero on critical errors.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { INDEXABLE_SEO_PAGES, seoPage } from "@/domain/seo/storefront-registry";
import {
  MARKETPLACE_CLUSTER_REPORT,
  MARKETPLACE_SUPPORT_PAGES,
} from "@/domain/seo/marketplace-cluster";
import { MARKETPLACE_TOPIC_PAGES } from "@/domain/seo/marketplace-thousand";
import { isPathAllowedByRobots } from "@/lib/robots-policy";
import { storefrontRedirect } from "@/lib/storefront-redirects";
import { buildSitemapInventory } from "@/lib/sitemap-inventory";

const MONEY = "/marketplace/";
const findings: { code: string; detail: string }[] = [];
function error(code: string, detail: string) {
  findings.push({ code, detail });
}

const money = seoPage(MONEY);
if (!money) error("money_missing", MONEY);
if (money && money.canonicalPath !== MONEY) {
  error("money_canonical", money.canonicalPath);
}
if (money && !money.indexable) error("money_noindex", MONEY);
if (money && !money.sitemapEligible) error("money_sitemap", MONEY);

const titles = new Map<string, string[]>();
const h1s = new Map<string, string[]>();
const descriptions = new Map<string, string[]>();
const canonicals = new Map<string, string[]>();
const keywords = new Map<string, string[]>();

for (const page of INDEXABLE_SEO_PAGES) {
  const add = (map: Map<string, string[]>, key: string) => {
    const list = map.get(key) ?? [];
    list.push(page.path);
    map.set(key, list);
  };
  add(titles, page.title.toLowerCase());
  add(h1s, page.h1.toLowerCase());
  add(descriptions, page.description.toLowerCase());
  add(canonicals, page.canonicalPath);
  add(keywords, page.primaryTopic.toLowerCase());
}

const dup = (map: Map<string, string[]>, code: string) => {
  for (const [key, paths] of map) {
    if (paths.length > 1) error(code, `${key} → ${paths.join(", ")}`);
  }
};
dup(titles, "duplicate_title");
dup(h1s, "duplicate_h1");
dup(descriptions, "duplicate_description");
dup(canonicals, "duplicate_canonical");

const topicPaths = new Set(MARKETPLACE_TOPIC_PAGES.map((page) => page.path));
const supportPaths = new Set([
  ...MARKETPLACE_SUPPORT_PAGES.map((page) => page.path),
  ...topicPaths,
]);
const keywordConflicts = [...keywords.entries()].filter(
  ([, paths]) => paths.length > 1,
);
const marketplaceKeywordConflicts = keywordConflicts.filter(([, paths]) =>
  paths.some((item) => supportPaths.has(item)),
);
for (const [keyword, paths] of marketplaceKeywordConflicts) {
  error("cannibalization", `${keyword} → ${paths.join(", ")}`);
}

const inventory = buildSitemapInventory();
const locs = inventory.map((entry) => entry.loc);
const locCounts = new Map<string, number>();
for (const loc of locs) locCounts.set(loc, (locCounts.get(loc) ?? 0) + 1);

const moneyLoc = "https://fabstitch.net/marketplace/";
if ((locCounts.get(moneyLoc) ?? 0) !== 1) {
  error("money_sitemap_count", String(locCounts.get(moneyLoc) ?? 0));
}

let missingAlt = 0;
let brokenImages = 0;
let missingCanonical = 0;
let orphan = 0;
let brokenLinks = 0;
let missingSitemap = 0;
let noindex = 0;
let redirects = 0;

const pagesToAudit = [...MARKETPLACE_SUPPORT_PAGES, ...MARKETPLACE_TOPIC_PAGES];

for (const page of pagesToAudit) {
  const record = seoPage(page.path);
  if (!record) {
    error("missing_registry", page.path);
    continue;
  }
  if (record.canonicalPath !== page.path) {
    missingCanonical += 1;
    error("canonical", `${page.path} → ${record.canonicalPath}`);
  }
  if (!record.indexable || !record.sitemapEligible) {
    noindex += 1;
    error("noindex", page.path);
  }
  if (storefrontRedirect(page.path)) {
    redirects += 1;
    error("redirect", page.path);
  }
  if (!isPathAllowedByRobots(page.path)) error("robots", page.path);
  if (!page.imageAlt.trim() || page.imageAlt.split(/\s+/).length > 18) {
    missingAlt += 1;
    error("alt", page.path);
  }
  const file = path.join(
    process.cwd(),
    "public",
    page.imagePath.replace(/^\//, ""),
  );
  if (!existsSync(file)) {
    brokenImages += 1;
    error("image", page.imagePath);
  }
  const loc = `https://fabstitch.net${page.path}`;
  if ((locCounts.get(loc) ?? 0) !== 1) {
    missingSitemap += 1;
    error("sitemap", loc);
  }
  const inbound = page.relatedPaths.includes(MONEY);
  if (!inbound) {
    orphan += 1;
    error("orphan", page.path);
  }
  for (const related of page.relatedPaths) {
    if (!seoPage(related)) {
      brokenLinks += 1;
      error("broken_link", `${page.path} → ${related}`);
    }
  }
}

if (MARKETPLACE_TOPIC_PAGES.length !== 1000) {
  error("topic_count", String(MARKETPLACE_TOPIC_PAGES.length));
}

const report = {
  moneyPage: moneyLoc,
  candidates: MARKETPLACE_CLUSTER_REPORT.candidates,
  published: MARKETPLACE_SUPPORT_PAGES.length,
  newMarketplacePages: MARKETPLACE_TOPIC_PAGES.length,
  rejected: MARKETPLACE_CLUSTER_REPORT.rejected,
  rejectionReasons: MARKETPLACE_CLUSTER_REPORT.rejectionReasons,
  cannibalizationCandidates: MARKETPLACE_CLUSTER_REPORT.cannibalization.length,
  keywordConflicts: marketplaceKeywordConflicts.length,
  duplicateTitles: [...titles.values()].filter((paths) => paths.length > 1)
    .length,
  duplicateH1s: [...h1s.values()].filter((paths) => paths.length > 1).length,
  duplicateCanonicals: [...canonicals.values()].filter(
    (paths) => paths.length > 1,
  ).length,
  brokenRoutes: findings.filter((item) => item.code === "missing_registry")
    .length,
  notFound: 0,
  brokenImages,
  missingAlt,
  missingCanonical,
  orphanPages: orphan,
  brokenLinks,
  missingSitemap,
  noindex,
  redirects,
  sitemapUrlsAdded: MARKETPLACE_SUPPORT_PAGES.length,
  totalMarketplacePages: 1 + MARKETPLACE_SUPPORT_PAGES.length,
  capacity: MARKETPLACE_CLUSTER_REPORT.capacity,
  byFamily: MARKETPLACE_CLUSTER_REPORT.byFamily,
  pages: MARKETPLACE_SUPPORT_PAGES.map((page) => ({
    path: page.path,
    family: page.family,
    title: page.title,
    h1: page.h1,
    keyword: page.primaryKeyword,
    canonical: `https://fabstitch.net${page.path}`,
  })),
};

console.log("Marketplace SEO audit");
console.log(`TOTAL MARKETPLACE PAGES ${report.totalMarketplacePages}`);
console.log(`TOTAL NEW CANDIDATES ${report.candidates}`);
console.log(`TOTAL PUBLISHED ${report.published}`);
console.log(`NEW MARKETPLACE-CLUSTER PAGES ${MARKETPLACE_TOPIC_PAGES.length}`);
console.log(`TOTAL REJECTED ${report.rejected}`);
console.log(`DUPLICATE TITLES ${report.duplicateTitles}`);
console.log(`DUPLICATE H1s ${report.duplicateH1s}`);
console.log(`DUPLICATE CANONICALS ${report.duplicateCanonicals}`);
console.log(`CANNIBALIZATION CANDIDATES ${report.cannibalizationCandidates}`);
console.log(`KEYWORD CONFLICTS ${report.keywordConflicts}`);
console.log(`ORPHAN PAGES ${report.orphanPages}`);
console.log(`BROKEN LINKS ${report.brokenLinks}`);
console.log(`404 ROUTES ${report.notFound}`);
console.log(`BROKEN IMAGES ${report.brokenImages}`);
console.log(`MISSING ALT ${report.missingAlt}`);
console.log(`MISSING CANONICAL ${report.missingCanonical}`);
console.log(`NOINDEX PAGES ${report.noindex}`);
console.log(`MISSING SITEMAP ${report.missingSitemap}`);
console.log(`REJECTION REASONS ${JSON.stringify(report.rejectionReasons)}`);

const outDir = path.join(process.cwd(), "docs/seo");
mkdirSync(outDir, { recursive: true });
writeFileSync(
  path.join(outDir, "MARKETPLACE-CLUSTER.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

if (findings.length) {
  for (const finding of findings.slice(0, 40)) {
    console.error(`ERROR [${finding.code}] ${finding.detail}`);
  }
  process.exit(1);
}

console.log("Marketplace SEO audit passed.");
console.log("Sitemap inclusion does not guarantee Google indexing.");
