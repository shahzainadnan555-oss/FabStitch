/**
 * Google Search Central alignment audit for the public frontend.
 * Aggregates the technical and image audits, then checks people-first
 * quality signals those commands do not score. Does not call the backend
 * and does not claim a measured Core Web Vitals result.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  INDEXABLE_SEO_PAGES,
  NOINDEX_SEO_PAGES,
  PUBLIC_SEO_PAGES,
  SEO_PAGE_REGISTRY,
  seoPage,
} from "@/domain/seo/storefront-registry";
import { renderedDocumentTitle } from "@/domain/seo/snippet-length";
import { isPathAllowedByRobots } from "@/lib/robots-policy";

type Finding = { code: string; detail: string };

const findings: Finding[] = [];
function fail(code: string, detail: string) {
  findings.push({ code, detail });
}

const TOPIC_WORDS = new Set([
  "fabric",
  "fabrics",
  "cotton",
  "linen",
  "silk",
  "wool",
  "denim",
  "viscose",
  "rayon",
  "jersey",
  "chiffon",
  "georgette",
  "polyester",
  "marketplace",
  "sourcing",
  "wholesale",
  "cloth",
  "cloths",
  "textile",
  "apparel",
  "garment",
]);

function stuffed(value: string, context = ""): boolean {
  const allowed = new Set(TOPIC_WORDS);
  for (const word of context.toLowerCase().split(/[^a-z0-9]+/)) {
    if (word.length >= 4) allowed.add(word);
  }
  const counts = new Map<string, number>();
  for (const word of value.toLowerCase().split(/[^a-z0-9]+/)) {
    if (word.length < 5 || allowed.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.values()].some((count) => count >= 3);
}

function keywordList(value: string): boolean {
  const parts = value
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length >= 4;
}

const titleByText = new Map<string, string>();
const descriptionByText = new Map<string, string>();
const h1ByText = new Map<string, string>();
const topicByText = new Map<string, string>();
let missingTitles = 0;
let duplicateTitles = 0;
let poorTitles = 0;
let missingDescriptions = 0;
let duplicateDescriptions = 0;
let poorDescriptions = 0;
let missingCanonicals = 0;
let duplicateCanonicals = 0;
let invalidCanonicals = 0;
let lowValue = 0;
let duplicateContent = 0;
let overlappingIntent = 0;

const canonicalOwners = new Map<string, string>();
const noindex = new Set(NOINDEX_SEO_PAGES.map((page) => page.path));

for (const page of INDEXABLE_SEO_PAGES) {
  const title = renderedDocumentTitle(page.path, page.title);
  if (!page.title.trim() || !title.trim()) {
    missingTitles += 1;
    fail("missing_title", page.path);
  } else {
    const previous = titleByText.get(title.toLowerCase());
    if (previous) {
      duplicateTitles += 1;
      fail("duplicate_title", `${page.path} = ${previous}`);
    } else titleByText.set(title.toLowerCase(), page.path);
    if (
      stuffed(title, `${page.h1} ${page.primaryTopic}`) ||
      keywordList(title) ||
      !/fabstitch/i.test(title)
    ) {
      poorTitles += 1;
      fail("poor_title", `${page.path} ${title}`);
    }
  }

  const description = page.description.trim();
  if (!description) {
    missingDescriptions += 1;
    fail("missing_description", page.path);
  } else {
    const previous = descriptionByText.get(description);
    if (previous) {
      duplicateDescriptions += 1;
      duplicateContent += 1;
      fail("duplicate_description", `${page.path} = ${previous}`);
    } else descriptionByText.set(description, page.path);
    if (
      stuffed(description, `${page.h1} ${page.primaryTopic}`) ||
      keywordList(description) ||
      description.length < 40
    ) {
      poorDescriptions += 1;
      fail("poor_description", page.path);
    }
  }

  const h1 = page.h1.trim().toLowerCase();
  if (h1) {
    const previous = h1ByText.get(h1);
    if (previous) {
      overlappingIntent += 1;
      fail("duplicate_h1", `${page.path} = ${previous}`);
    } else h1ByText.set(h1, page.path);
  }

  const topic = page.primaryTopic.trim().toLowerCase();
  if (topic) {
    const previous = topicByText.get(topic);
    if (
      previous &&
      page.h1.trim().toLowerCase() ===
        seoPage(previous)?.h1.trim().toLowerCase()
    ) {
      overlappingIntent += 1;
      fail("overlapping_intent", `${page.path} = ${previous}`);
    } else if (!previous) topicByText.set(topic, page.path);
  }

  if (!page.canonicalPath) {
    missingCanonicals += 1;
    fail("missing_canonical", page.path);
  } else {
    const owner = canonicalOwners.get(page.canonicalPath);
    if (owner) {
      duplicateCanonicals += 1;
      fail("duplicate_canonical", page.canonicalPath);
    } else canonicalOwners.set(page.canonicalPath, page.path);
    const target = seoPage(page.canonicalPath);
    if (
      page.canonicalPath !== page.path ||
      !target ||
      !target.indexable ||
      page.canonicalPath.startsWith("http://") ||
      !page.canonicalPath.startsWith("/")
    ) {
      invalidCanonicals += 1;
      fail("invalid_canonical", `${page.path} -> ${page.canonicalPath}`);
    }
  }

  const utility = new Set(["help", "help_hub", "support", "private"]);
  if (
    !utility.has(page.type) &&
    typeof page.wordCount === "number" &&
    page.wordCount < 80 &&
    page.qualityGatePassed
  ) {
    lowValue += 1;
    fail("low_value", `${page.path} ${page.wordCount}`);
  }
}

const descriptionStem = new Map<string, string>();
for (const page of INDEXABLE_SEO_PAGES) {
  if (page.path.includes("/page/")) continue;
  const stem = page.description.trim().slice(0, 120);
  if (stem.length < 80) continue;
  const previous = descriptionStem.get(stem);
  if (previous) {
    duplicateContent += 1;
    fail("near_duplicate", `${page.path} = ${previous}`);
  } else descriptionStem.set(stem, page.path);
}

const marketplace = seoPage("/marketplace/");
if (!marketplace?.indexable) fail("marketplace_indexable", "/marketplace/");
if (marketplace?.canonicalPath !== "/marketplace/") {
  fail("marketplace_canonical", marketplace?.canonicalPath ?? "missing");
}
if (noindex.has("/marketplace/")) fail("marketplace_noindex", "/marketplace/");
if (!isPathAllowedByRobots("/marketplace/")) {
  fail("marketplace_robots", "/marketplace/");
}

let metaKeywords = 0;
function walk(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full);
      continue;
    }
    if (!/\.(tsx|ts|jsx|html)$/.test(entry.name)) continue;
    const source = readFileSync(full, "utf8");
    if (/name=["']keywords["']/.test(source)) {
      metaKeywords += 1;
      fail("meta_keywords", path.relative(process.cwd(), full));
    }
  }
}
walk(path.join(process.cwd(), "app"));
walk(path.join(process.cwd(), "components"));

function run(script: string): number {
  const result = spawnSync(
    process.execPath,
    ["--import=./scripts/register-loader.mjs", script],
    { cwd: process.cwd(), encoding: "utf8" },
  );
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  return result.status ?? 1;
}

const technicalStatus = run("scripts/seo/technical-audit.mts");
const imageStatus = run("scripts/seo/image-seo-audit.mts");

const docs = path.join(process.cwd(), "docs/seo");
const technical = JSON.parse(
  readFileSync(path.join(docs, "TECHNICAL-AUDIT.json"), "utf8"),
) as {
  orphanPages: number;
  deepCrawlPages: number;
  brokenInternalLinks: number;
  brokenImages: number;
  missingAlt: number;
  structuredDataErrors: number;
  sitemapMissing: number;
  sitemapDuplicates: number;
  sitemapUrls: number;
  redirectChains: number;
  redirectLoops: number;
  notFoundRoutes: number;
  thinContent: number;
  findings: { code: string; detail: string }[];
};
const images = JSON.parse(
  readFileSync(path.join(docs, "IMAGE-SEO-AUDIT.json"), "utf8"),
) as {
  brokenImages: number;
  alt: { missing: number };
  title: { missing: number };
  invalidImageUrls: number;
  irrelevantOrMissing: number;
  missingDimensions: number;
};

if (technicalStatus !== 0) fail("technical_audit", `exit ${technicalStatus}`);
if (imageStatus !== 0) fail("image_audit", `exit ${imageStatus}`);

const report = {
  generatedAt: new Date().toISOString(),
  pagesAudited: SEO_PAGE_REGISTRY.length,
  publicPages: PUBLIC_SEO_PAGES.length,
  indexable: INDEXABLE_SEO_PAGES.length,
  noindex: NOINDEX_SEO_PAGES.length,
  sitemapUrls: technical.sitemapUrls,
  titles: {
    missing: missingTitles,
    duplicate: duplicateTitles,
    poor: poorTitles,
  },
  descriptions: {
    missing: missingDescriptions,
    duplicate: duplicateDescriptions,
    poor: poorDescriptions,
  },
  canonicals: {
    missing: missingCanonicals,
    duplicate: duplicateCanonicals,
    invalid: invalidCanonicals,
  },
  content: {
    lowValue,
    duplicate: duplicateContent,
    overlappingIntent,
    thinUtilityNoted: technical.thinContent,
    note: "Low-value means a non-utility page under 80 words. Word count is not a ranking target. Help articles under 120 words are noted, not padded.",
  },
  links: {
    broken: technical.brokenInternalLinks,
    orphan: technical.orphanPages,
    deep: technical.deepCrawlPages,
  },
  images: {
    broken: images.brokenImages + technical.brokenImages,
    missingAlt: images.alt.missing + technical.missingAlt,
    missingTitle: images.title.missing,
    missingDimensions: images.missingDimensions,
    invalidUrls: images.invalidImageUrls,
    irrelevantOrMissing: images.irrelevantOrMissing,
  },
  structuredData: {
    invalid: technical.structuredDataErrors,
    conflicting: technical.findings.filter((item) =>
      item.code.includes("structured"),
    ).length,
  },
  sitemap: {
    missing: technical.sitemapMissing,
    duplicates: technical.sitemapDuplicates,
    invalid: technical.notFoundRoutes,
  },
  redirects: {
    chains: technical.redirectChains,
    loops: technical.redirectLoops,
  },
  metaKeywords,
  coreWebVitalsMeasured: false,
  findings: findings.slice(0, 40),
};

mkdirSync(docs, { recursive: true });
writeFileSync(
  path.join(docs, "FULL-AUDIT.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

const lines = [
  "Full SEO audit",
  `PAGES AUDITED ${report.pagesAudited}`,
  `INDEXABLE ${report.indexable}`,
  `NOINDEX ${report.noindex}`,
  `TITLES missing ${report.titles.missing} duplicate ${report.titles.duplicate} poor ${report.titles.poor}`,
  `DESCRIPTIONS missing ${report.descriptions.missing} duplicate ${report.descriptions.duplicate} poor ${report.descriptions.poor}`,
  `CANONICALS missing ${report.canonicals.missing} duplicate ${report.canonicals.duplicate} invalid ${report.canonicals.invalid}`,
  `CONTENT low-value ${report.content.lowValue} duplicate ${report.content.duplicate} overlapping ${report.content.overlappingIntent}`,
  `LINKS broken ${report.links.broken} orphan ${report.links.orphan} deep ${report.links.deep}`,
  `IMAGES broken ${report.images.broken} missing-alt ${report.images.missingAlt}`,
  `STRUCTURED DATA invalid ${report.structuredData.invalid} conflicting ${report.structuredData.conflicting}`,
  `SITEMAP missing ${report.sitemap.missing} duplicates ${report.sitemap.duplicates} invalid ${report.sitemap.invalid}`,
  `REDIRECTS chains ${report.redirects.chains} loops ${report.redirects.loops}`,
  `META KEYWORDS ${metaKeywords}`,
  `FINDINGS ${findings.length}`,
];
console.log(lines.join("\n"));
for (const finding of findings.slice(0, 30)) {
  console.error(`${finding.code} ${finding.detail}`);
}
if (findings.length) process.exit(1);
