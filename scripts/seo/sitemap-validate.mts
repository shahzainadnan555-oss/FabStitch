/**
 * Build-time SEO sitemap validation.
 *
 * Fails when the inventory contains duplicate locs, invalid URLs, non-HTTPS
 * hosts, relative locs, or malformed XML. Does not claim Google will index
 * every URL — it only asserts technical eligibility/discoverability hygiene.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import {
  INDEXABLE_SEO_PAGES,
  NOINDEX_SEO_PAGES,
  PUBLIC_SEO_PAGES,
  SITEMAP_ELIGIBLE_SEO_PAGES,
  SEO_PAGE_REGISTRY,
  assertStorefrontSeoRegistry,
} from "@/domain/seo/storefront-registry";
import { INDEXABLE_SEMANTIC_PAGES } from "@/domain/seo/semantic";
import { STOREFRONT_REDIRECT_FAMILIES } from "@/lib/storefront-redirects";
import {
  buildSitemapInventory,
  partitionSitemapInventory,
  passesSitemapEligibilityGate,
  resolveSitemapImage,
  sitemapInventorySummary,
} from "@/lib/sitemap-inventory";
import {
  renderInventoryUrlSet,
  renderSitemapIndexFromFiles,
} from "@/lib/sitemaps";
import { listDiscoverDirectoryPaths } from "@/lib/discover-directory";

type Finding = { severity: "error" | "warning"; code: string; detail: string };

const findings: Finding[] = [];

function error(code: string, detail: string) {
  findings.push({ severity: "error", code, detail });
}
function warn(code: string, detail: string) {
  findings.push({ severity: "warning", code, detail });
}

assertStorefrontSeoRegistry();

const inventory = buildSitemapInventory();
const files = partitionSitemapInventory(inventory);
const summary = sitemapInventorySummary(inventory);
const indexXml = renderSitemapIndexFromFiles(files);

function assertValidXml(label: string, xml: string) {
  if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    error("xml_declaration", `${label} missing UTF-8 XML declaration`);
  }
  if (xml.includes("<priority>") || xml.includes("<changefreq>")) {
    error("useless_fields", `${label} contains priority/changefreq`);
  }
  if (/[^\x09\x0A\x0D\x20-\x7E\u0080-\uFFFF]/.test(xml)) {
    warn(
      "xml_control_chars",
      `${label} may contain unusual control characters`,
    );
  }
}

assertValidXml("sitemap-index", indexXml);
if (!indexXml.includes("<sitemapindex")) {
  error("sitemap_index_root", "sitemap index missing sitemapindex root");
}

const seenLoc = new Set<string>();
const seenPath = new Set<string>();

for (const file of files) {
  if (file.urls.length === 0) {
    error("empty_child", `Empty child sitemap emitted: ${file.id}`);
  }
  if (file.urls.length > 50_000) {
    error("sitemap_size", `${file.id} exceeds 50,000 URLs`);
  }
  const xml = renderInventoryUrlSet(file.urls);
  assertValidXml(file.id, xml);
  if (!xml.includes("<urlset")) {
    error("urlset_root", `${file.id} missing urlset root`);
  }
  if (Buffer.byteLength(xml, "utf8") > 50 * 1024 * 1024) {
    error("sitemap_bytes", `${file.id} exceeds 50MB uncompressed`);
  }

  for (const entry of file.urls) {
    if (!entry.loc.startsWith("https://fabstitch.net/")) {
      error("invalid_loc", `${entry.path} loc is not production HTTPS`);
    }
    if (entry.loc.includes("?")) {
      error("query_loc", `${entry.path} contains query parameters`);
    }
    if (seenLoc.has(entry.loc)) {
      error("duplicate_loc", `Duplicate loc: ${entry.loc}`);
    }
    if (seenPath.has(entry.path)) {
      error("duplicate_path", `Duplicate path: ${entry.path}`);
    }
    seenLoc.add(entry.loc);
    seenPath.add(entry.path);

    const record = SEO_PAGE_REGISTRY.find((page) => page.path === entry.path);
    if (record) {
      if (!passesSitemapEligibilityGate(record)) {
        error(
          "gate_fail",
          `${entry.path} is in sitemap but fails eligibility gate`,
        );
      }
      if (record.canonicalPath !== entry.path) {
        error("non_self_canonical", `${entry.path} is not self-canonical`);
      }
      if (!record.indexable) {
        error("noindex_in_sitemap", `${entry.path} is noindex but in sitemap`);
      }
    }

    if (entry.lastmod) {
      const ok =
        /^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod) ||
        /^\d{4}-\d{2}-\d{2}T/.test(entry.lastmod);
      if (!ok)
        error("invalid_lastmod", `${entry.path} lastmod=${entry.lastmod}`);
    }

    for (const image of entry.images) {
      if (!image.startsWith("https://fabstitch.net/media/")) {
        error("invalid_image", `${entry.path} image is not a public media URL`);
      }
      const relative = image.replace("https://fabstitch.net", "");
      if (!resolveSitemapImage(relative)) {
        error(
          "broken_image",
          `${entry.path} image missing on disk: ${relative}`,
        );
      }
    }
  }
}

// Orphan heuristic: indexable pages whose parent is missing or unrelated paths empty.
let orphanCandidates = 0;
for (const page of INDEXABLE_SEO_PAGES) {
  if (page.path === "/") continue;
  if (!page.parentPath) {
    orphanCandidates += 1;
    error("orphan_parent", `${page.path} has no parent hub`);
    continue;
  }
  const parent = SEO_PAGE_REGISTRY.find(
    (item) => item.path === page.parentPath,
  );
  if (!parent || !parent.isPublic) {
    orphanCandidates += 1;
    error("orphan_parent", `${page.path} parent is unavailable`);
  }
}

// Soft-404 style registry pages (indexable but tiny content).
let soft404 = 0;
for (const page of INDEXABLE_SEO_PAGES) {
  if ((page.wordCount ?? 0) > 0 && (page.wordCount ?? 0) < 40) {
    soft404 += 1;
    warn("soft_404_risk", `${page.path} wordCount=${page.wordCount}`);
  }
}

// Duplicate metadata among indexable pages.
function dupes(values: string[]): string[] {
  const seen = new Set<string>();
  const out = new Set<string>();
  for (const value of values) {
    const key = value.toLowerCase().trim();
    if (seen.has(key)) out.add(key);
    seen.add(key);
  }
  return [...out];
}
const duplicateTitles = dupes(INDEXABLE_SEO_PAGES.map((page) => page.title));
const duplicateDescriptions = dupes(
  INDEXABLE_SEO_PAGES.map((page) => page.description),
);
const duplicateH1s = dupes(INDEXABLE_SEO_PAGES.map((page) => page.h1));
if (duplicateTitles.length) {
  error("duplicate_title", `${duplicateTitles.length} duplicate titles`);
}
if (duplicateDescriptions.length) {
  error(
    "duplicate_description",
    `${duplicateDescriptions.length} duplicate descriptions`,
  );
}
if (duplicateH1s.length) {
  warn("duplicate_h1", `${duplicateH1s.length} duplicate H1 values`);
}

const directoryPaths = listDiscoverDirectoryPaths();
for (const dirPath of directoryPaths) {
  if (!seenPath.has(dirPath)) {
    warn("directory_missing_sitemap", `Directory not in sitemap: ${dirPath}`);
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  registry: {
    total: SEO_PAGE_REGISTRY.length,
    public: PUBLIC_SEO_PAGES.length,
    indexable: INDEXABLE_SEO_PAGES.length,
    noindex: NOINDEX_SEO_PAGES.length,
    sitemapEligibleRegistry: SITEMAP_ELIGIBLE_SEO_PAGES.length,
    discoverIndexable: INDEXABLE_SEMANTIC_PAGES.length,
    discoverDirectories: directoryPaths.length,
    redirectFamilies: STOREFRONT_REDIRECT_FAMILIES.length,
  },
  sitemap: {
    ...summary,
    childSitemaps: files.map((file) => ({
      id: file.id,
      path: file.path,
      urls: file.urls.length,
      withImages: file.urls.filter((entry) => entry.images.length > 0).length,
    })),
  },
  quality: {
    orphanCandidates,
    soft404Risks: soft404,
    duplicateTitles: duplicateTitles.length,
    duplicateDescriptions: duplicateDescriptions.length,
    duplicateH1s: duplicateH1s.length,
    videoSitemap: "not_applicable_no_public_video_pages",
    hreflang: "not_applicable_no_localized_alternates",
  },
  findings,
};

const outDir = path.join(process.cwd(), "docs/seo");
mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "SITEMAP-VALIDATION.json");
writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");

const errors = findings.filter((finding) => finding.severity === "error");
const warnings = findings.filter((finding) => finding.severity === "warning");

console.log("SEO sitemap validation");
console.log(`  registry indexable: ${INDEXABLE_SEO_PAGES.length}`);
console.log(`  sitemap URLs: ${summary.total}`);
console.log(`  child sitemaps: ${files.length}`);
console.log(`  discover pages: ${INDEXABLE_SEMANTIC_PAGES.length}`);
console.log(`  with images: ${summary.withImages}`);
console.log(`  with lastmod: ${summary.withLastmod}`);
console.log(`  findings: ${errors.length} errors, ${warnings.length} warnings`);
console.log(`  report: ${outFile}`);

if (errors.length) {
  for (const finding of errors.slice(0, 40)) {
    console.error(`ERROR [${finding.code}] ${finding.detail}`);
  }
  process.exit(1);
}

console.log("SEO sitemap validation passed.");
