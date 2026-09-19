/**
 * Frontend technical SEO audit.
 *
 * Uses the storefront registry as the source of truth. Does not call the
 * backend SEO API and does not claim measured Core Web Vitals.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  CATALOG_COLLECTION_CARDS,
  FABRICS_2027,
  MEDIA_BY_FABRIC_SLUG,
  SEASONAL_COLLECTIONS,
  SEO_USE_CASES,
  fabricsForSeason,
} from "@/catalog";
import { COLLECTION_SEO_BY_SLUG } from "@/content/collection-seo";
import {
  INDEXABLE_SEO_PAGES,
  NOINDEX_SEO_PAGES,
  PUBLIC_SEO_PAGES,
  SEO_PAGE_REGISTRY,
  assertStorefrontSeoRegistry,
  seoPage,
} from "@/domain/seo/storefront-registry";
import { FABRIC_QUESTION_PAGES } from "@/domain/seo/fabric-questions";
import { MARKETPLACE_SUPPORT_PAGES } from "@/domain/seo/marketplace-cluster";
import {
  MARKETPLACE_TOPIC_HUBS,
  MARKETPLACE_TOPIC_PAGES,
} from "@/domain/seo/marketplace-thousand";
import { INDEXABLE_SEMANTIC_PAGES } from "@/domain/seo/semantic";
import { imageAsset } from "@/domain/seo/image-assets";
import { HELP_ARTICLES } from "@/features/help/content";
import {
  FOOTER_LINK_GROUPS,
  NAV_SECTIONS,
} from "@/components/layout/nav-model";
import {
  DISCOVER_CLUSTER_META,
  discoverClusterPath,
  paginateDiscoverCluster,
} from "@/lib/discover-directory";
import { isPathAllowedByRobots } from "@/lib/robots-policy";
import { storefrontRedirect } from "@/lib/storefront-redirects";
import { buildSitemapInventory } from "@/lib/sitemap-inventory";
import { guideLinks, listGuides } from "@/repositories/guides";

assertStorefrontSeoRegistry();

const findings: { code: string; detail: string }[] = [];
function fail(code: string, detail: string) {
  findings.push({ code, detail });
}

const registered = new Set(SEO_PAGE_REGISTRY.map((page) => page.path));
const indexable = INDEXABLE_SEO_PAGES;
const indexablePaths = new Set(indexable.map((page) => page.path));

function addEdge(
  graph: Map<string, Set<string>>,
  from: string,
  to: string | undefined,
) {
  if (!to || !to.startsWith("/") || to.includes("?")) return;
  const target = to.endsWith("/") || to === "/" ? to : `${to}/`;
  if (from === target) return;
  const list = graph.get(from) ?? new Set<string>();
  list.add(target);
  graph.set(from, list);
}

const outgoing = new Map<string, Set<string>>();
const chrome = [
  ...NAV_SECTIONS.map((item) => item.href),
  ...FOOTER_LINK_GROUPS.flatMap((group) =>
    group.links.map((item) => item.href),
  ),
];
for (const page of indexable) {
  for (const href of chrome) addEdge(outgoing, page.path, href);
}

const homepage = [
  "/marketplace/",
  "/fabrics/",
  "/collections/",
  "/fabrics/best-for/shirts/",
  "/fabrics/best-for/dresses/",
  "/guides/",
  "/guides/fabric-questions/",
  "/wholesale-fabric/",
  "/fabric-sourcing/",
  "/discover/",
  "/about/",
];
for (const href of homepage) addEdge(outgoing, "/", href);

for (const fabric of FABRICS_2027) {
  addEdge(outgoing, "/fabrics/", `/fabrics/${fabric.slug}/`);
  addEdge(
    outgoing,
    `/collections/${fabric.collection}/`,
    `/fabrics/${fabric.slug}/`,
  );
}
for (const card of CATALOG_COLLECTION_CARDS) {
  addEdge(outgoing, "/collections/", `/collections/${card.slug}/`);
  addEdge(outgoing, "/fabrics/", `/collections/${card.slug}/`);
}
for (const theme of SEASONAL_COLLECTIONS) {
  addEdge(outgoing, "/collections/", `/collections/${theme.slug}/`);
  for (const fabric of fabricsForSeason(theme)) {
    addEdge(
      outgoing,
      `/collections/${theme.slug}/`,
      `/fabrics/${fabric.slug}/`,
    );
  }
}
for (const useCase of SEO_USE_CASES) {
  addEdge(outgoing, "/fabrics/best-for/", `/fabrics/best-for/${useCase.slug}/`);
  addEdge(outgoing, "/fabrics/", `/fabrics/best-for/${useCase.slug}/`);
}
for (const href of [
  "/fabrics/clothing/",
  "/fabrics/apparel/",
  "/fabrics/fashion/",
  "/fabrics/shirt-fabric/",
  "/fabrics/dress-fabric/",
  "/fabrics/wool-fabric/",
  "/collections/cotton/",
  "/collections/linen-lightweight/",
  "/collections/silk-sheer/",
  "/collections/denim/",
  "/guides/fabric-weight-and-gsm/",
  "/guides/lightweight-fabric/",
  "/fabric-sourcing/",
  "/wholesale-fabric/",
  "/guides/",
  "/guides/fabric-questions/",
  "/marketplace/",
]) {
  addEdge(outgoing, "/fabrics/", href);
}

for (const page of MARKETPLACE_SUPPORT_PAGES) {
  addEdge(outgoing, "/marketplace/", page.path);
  for (const href of page.relatedPaths) addEdge(outgoing, page.path, href);
}
for (const hub of MARKETPLACE_TOPIC_HUBS) {
  addEdge(outgoing, "/marketplace/", hub.path);
}
for (const page of MARKETPLACE_TOPIC_PAGES) {
  for (const href of page.relatedPaths) addEdge(outgoing, page.path, href);
  if (page.kind === "hub") {
    for (const child of MARKETPLACE_TOPIC_PAGES) {
      if (child.family === page.family && child.kind !== "hub") {
        addEdge(outgoing, page.path, child.path);
      }
    }
  }
}
for (const href of [
  "/guides/fabric-questions/",
  "/guides/fabric-weight-and-gsm/",
  "/guides/cotton-vs-linen/",
  "/guides/woven-vs-knit-fabrics/",
  "/fabric-sourcing/",
  "/wholesale-fabric/",
  "/discover/",
  "/collections/",
]) {
  addEdge(outgoing, "/marketplace/", href);
}

const guides = await listGuides();
for (const guide of guides) {
  addEdge(outgoing, "/guides/", guide.path);
  addEdge(outgoing, guide.path, "/guides/");
  addEdge(outgoing, guide.path, "/marketplace/");
  for (const link of guideLinks(guide))
    addEdge(outgoing, guide.path, link.href);
  for (const slug of guide.relatedGuides ?? []) {
    addEdge(outgoing, guide.path, `/guides/${slug}/`);
  }
}
addEdge(outgoing, "/guides/", "/guides/fabric-questions/");
addEdge(outgoing, "/guides/", "/marketplace/");

for (const page of FABRIC_QUESTION_PAGES) {
  for (const href of page.relatedPaths) addEdge(outgoing, page.path, href);
}
for (const page of INDEXABLE_SEMANTIC_PAGES) {
  for (const href of page.relatedPaths) addEdge(outgoing, page.path, href);
  addEdge(outgoing, page.path, "/discover/");
  addEdge(outgoing, page.path, "/marketplace/");
}
for (const article of HELP_ARTICLES) {
  addEdge(outgoing, "/help/", `/help/${article.slug}/`);
}
for (const meta of DISCOVER_CLUSTER_META) {
  const first = discoverClusterPath(meta.cluster, 1);
  addEdge(outgoing, "/discover/", first);
  const total = paginateDiscoverCluster(meta.cluster, 1)?.totalPages ?? 1;
  for (let pageNumber = 1; pageNumber <= total; pageNumber += 1) {
    const page = paginateDiscoverCluster(meta.cluster, pageNumber);
    if (!page) continue;
    addEdge(outgoing, page.path, "/discover/");
    for (const item of page.items) addEdge(outgoing, page.path, item.path);
    for (let sibling = 1; sibling <= total; sibling += 1) {
      addEdge(outgoing, page.path, discoverClusterPath(meta.cluster, sibling));
    }
  }
}
for (const [slug, enrichment] of Object.entries(COLLECTION_SEO_BY_SLUG)) {
  if (!enrichment) continue;
  const from = `/collections/${slug}/`;
  for (const item of enrichment.relatedPaths ?? []) {
    addEdge(outgoing, from, item.href);
  }
}

const incoming = new Map<string, number>();
for (const page of indexable) incoming.set(page.path, 0);
let brokenInternal = 0;
let linksToRedirects = 0;
for (const [from, targets] of outgoing) {
  if (!indexablePaths.has(from) && from !== "/") continue;
  for (const target of targets) {
    if (storefrontRedirect(target)) {
      linksToRedirects += 1;
      if (linksToRedirects <= 20) {
        fail("internal_redirect", `${from} → ${target}`);
      }
    }
    if (!registered.has(target)) {
      if (target === "/inquiries/" || target.startsWith("/account/")) continue;
      brokenInternal += 1;
      if (brokenInternal <= 20) fail("broken_link", `${from} → ${target}`);
      continue;
    }
    if (indexablePaths.has(target)) {
      incoming.set(target, (incoming.get(target) ?? 0) + 1);
    }
  }
}

const orphans = indexable.filter(
  (page) => page.path !== "/" && (incoming.get(page.path) ?? 0) === 0,
);
for (const page of orphans.slice(0, 30)) fail("orphan", page.path);

const depth = new Map<string, number>([["/", 0]]);
const queue = ["/"];
while (queue.length) {
  const current = queue.shift()!;
  const nextDepth = (depth.get(current) ?? 0) + 1;
  for (const target of outgoing.get(current) ?? []) {
    if (!indexablePaths.has(target) || depth.has(target)) continue;
    depth.set(target, nextDepth);
    queue.push(target);
  }
}
const deep = indexable.filter((page) => (depth.get(page.path) ?? 99) > 4);
for (const page of deep.slice(0, 20)) {
  fail(
    "deep_crawl",
    `${page.path} depth ${depth.get(page.path) ?? "unreachable"}`,
  );
}
const unreachable = indexable.filter((page) => !depth.has(page.path));
for (const page of unreachable.slice(0, 20)) fail("unreachable", page.path);

function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

const titles = duplicates(indexable.map((page) => page.title.toLowerCase()));
const descriptions = duplicates(
  indexable.map((page) => page.description.toLowerCase()),
);
const canonicals = duplicates(
  SEO_PAGE_REGISTRY.map((page) => page.canonicalPath),
);
for (const title of titles) fail("duplicate_title", title);
for (const description of descriptions)
  fail("duplicate_description", description);
for (const canonical of canonicals) fail("duplicate_canonical", canonical);

let missingTitles = 0;
let missingDescriptions = 0;
let missingCanonicals = 0;
let invalidCanonicals = 0;
let redirectRoutes = 0;
for (const page of indexable) {
  if (!page.title.trim()) {
    missingTitles += 1;
    fail("missing_title", page.path);
  }
  if (!page.description.trim()) {
    missingDescriptions += 1;
    fail("missing_description", page.path);
  }
  if (!page.canonicalPath) {
    missingCanonicals += 1;
    fail("missing_canonical", page.path);
  }
  if (page.canonicalPath !== page.path) {
    invalidCanonicals += 1;
    fail("canonical_mismatch", page.path);
  }
  if (storefrontRedirect(page.path)) {
    redirectRoutes += 1;
    fail("indexable_redirect", page.path);
  }
  if (!isPathAllowedByRobots(page.path)) fail("robots_blocked", page.path);
  if (page.canonicalPath.startsWith("http://")) {
    invalidCanonicals += 1;
    fail("http_canonical", page.path);
  }
}

const legacy = [
  "/search/",
  "/best-for/",
  "/best-for/shirts/",
  "/applications/",
  "/applications/shirts/",
  "/fabrics/cotton-fabric/",
  "/fabrics/linen-fabric/",
  "/fabrics/marketplace/",
  "/guides/fabric-gsm/",
  "/guides/woven-fabric/",
  "/marketplace/fabrics/cotton-poplin/",
  "/SEARCH/",
  "/Guides/Fabric-GSM/",
];
let redirectChains = 0;
let redirectLoops = 0;
for (const start of [...legacy, ...indexable.map((page) => page.path)]) {
  const seen = new Set<string>();
  let current = start;
  const hops = [start];
  let loop = false;
  for (let step = 0; step < 6; step += 1) {
    const next = storefrontRedirect(current);
    if (!next) break;
    if (seen.has(next)) {
      loop = true;
      break;
    }
    seen.add(next);
    hops.push(next);
    current = next;
  }
  if (loop) {
    redirectLoops += 1;
    fail("redirect_loop", hops.join(" → "));
  } else if (hops.length > 2) {
    redirectChains += 1;
    fail("redirect_chain", hops.join(" → "));
  }
}

const inventory = buildSitemapInventory();
const locCounts = new Map<string, number>();
for (const entry of inventory) {
  locCounts.set(entry.loc, (locCounts.get(entry.loc) ?? 0) + 1);
}
const sitemapPaths = new Set(inventory.map((entry) => entry.path));
let sitemapMissing = 0;
let sitemapDuplicates = 0;
let sitemapRedirects = 0;
let sitemapNoindex = 0;
for (const page of indexable) {
  if (!sitemapPaths.has(page.path)) {
    sitemapMissing += 1;
    fail("sitemap_missing", page.path);
  }
}
for (const [loc, count] of locCounts) {
  if (count > 1) {
    sitemapDuplicates += 1;
    fail("sitemap_duplicate", loc);
  }
}
for (const entry of inventory) {
  if (storefrontRedirect(entry.path)) {
    sitemapRedirects += 1;
    fail("sitemap_redirect", entry.path);
  }
  const page = seoPage(entry.path);
  if (!page?.indexable) {
    sitemapNoindex += 1;
    fail("sitemap_noindex", entry.path);
  }
}

const publicRoot = path.join(process.cwd(), "public");
const altByPath = new Map<string, string>();
for (const fabric of FABRICS_2027) {
  const media = MEDIA_BY_FABRIC_SLUG[fabric.slug];
  if (media?.status === "final" && "alt" in media && media.alt) {
    altByPath.set(`/fabrics/${fabric.slug}/`, media.alt);
  }
}
for (const page of [
  ...MARKETPLACE_TOPIC_PAGES,
  ...MARKETPLACE_SUPPORT_PAGES,
  ...FABRIC_QUESTION_PAGES,
  ...INDEXABLE_SEMANTIC_PAGES,
]) {
  if ("imageAlt" in page && page.imageAlt) {
    altByPath.set(page.path, page.imageAlt);
  }
}
let brokenImages = 0;
let missingAlt = 0;
for (const page of indexable) {
  if (!page.image) continue;
  if (
    page.image.startsWith("/") &&
    !existsSync(path.join(publicRoot, page.image))
  ) {
    brokenImages += 1;
    fail("broken_image", `${page.path} ${page.image}`);
  }
  const alt = imageAsset(page.image)?.alt ?? altByPath.get(page.path);
  if (
    page.type === "fabric" ||
    page.type === "marketplace_topic" ||
    page.type === "marketplace_support" ||
    page.type === "fabric_question" ||
    page.type === "semantic_landing"
  ) {
    if (!alt?.trim() || alt.trim().split(/\s+/).length > 18) {
      missingAlt += 1;
      if (missingAlt <= 20) fail("missing_alt", page.path);
    }
  }
}

const schemaSource = readFileSync(
  path.join(process.cwd(), "components/seo/structured-data.tsx"),
  "utf8",
);
let structuredDataErrors = 0;
for (const token of ['"@type": "AggregateRating"', '"@type": "Review"']) {
  if (schemaSource.includes(token)) {
    structuredDataErrors += 1;
    fail("structured_data", token);
  }
}
for (const page of indexable) {
  if (!page.expectedSchemas.length) {
    structuredDataErrors += 1;
    fail("missing_schema", page.path);
  }
  if (page.expectsBreadcrumbs && !page.parentPath && page.path !== "/") {
    structuredDataErrors += 1;
    fail("breadcrumb_parent", page.path);
  }
}

const thin = indexable.filter(
  (page) => typeof page.wordCount === "number" && page.wordCount < 120,
);
const thinCritical = thin.filter(
  (page) =>
    (page.wordCount ?? 0) < 80 &&
    page.qualityGatePassed &&
    (page.type === "guide" ||
      page.type === "semantic_landing" ||
      page.type === "marketplace_topic" ||
      page.type === "marketplace_support"),
);
for (const page of thinCritical.slice(0, 20)) {
  fail("thin_content", `${page.path} ${page.wordCount}`);
}

const entities = [
  "fabric",
  "marketplace",
  "cotton",
  "linen",
  "silk",
  "wool",
  "denim",
  "gsm",
  "sourcing",
  "wholesale",
];
const entityCoverage = Object.fromEntries(
  entities.map((entity) => [
    entity,
    indexable.filter((page) =>
      `${page.title} ${page.h1} ${page.description} ${page.primaryTopic}`
        .toLowerCase()
        .includes(entity),
    ).length,
  ]),
);

const pillars = [
  "/",
  "/marketplace/",
  "/fabrics/",
  "/collections/",
  "/guides/",
  "/discover/",
  "/wholesale-fabric/",
  "/fabric-sourcing/",
  "/guides/fabric-questions/",
];
for (const pillar of pillars) {
  const page = seoPage(pillar);
  if (!page?.indexable) fail("pillar_indexable", pillar);
  if ((incoming.get(pillar) ?? 0) === 0 && pillar !== "/") {
    fail("pillar_orphan", pillar);
  }
  if ((depth.get(pillar) ?? 99) > 2 && pillar !== "/") {
    fail("pillar_depth", `${pillar} depth ${depth.get(pillar)}`);
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  pagesAudited: SEO_PAGE_REGISTRY.length,
  publicPages: PUBLIC_SEO_PAGES.length,
  indexable: indexable.length,
  noindex: NOINDEX_SEO_PAGES.length,
  canonicalRoutes: indexable.filter((page) => page.canonicalPath === page.path)
    .length,
  sitemapUrls: inventory.length,
  missingTitles,
  duplicateTitles: titles.length,
  missingDescriptions,
  duplicateDescriptions: descriptions.length,
  missingCanonicals,
  duplicateCanonicals: canonicals.length,
  invalidCanonicals,
  redirectChains,
  redirectLoops,
  redirectRoutes,
  duplicateContent: {
    exactDescriptions: descriptions.length,
    thinCandidates: thin.length,
    classification:
      "Template families with unique titles, descriptions, and entities are KEEP. Pages under 80 words fail.",
  },
  thinContent: thin.length,
  orphanPages: orphans.length,
  deepCrawlPages: deep.length + unreachable.length,
  brokenInternalLinks: brokenInternal,
  linksToRedirects,
  notFoundRoutes: redirectRoutes,
  brokenImages,
  missingAlt,
  structuredDataErrors,
  sitemapMissing,
  sitemapDuplicates,
  sitemapRedirects,
  sitemapNoindex,
  entityCoverage,
  pillarDepth: Object.fromEntries(
    pillars.map((pillar) => [pillar, depth.get(pillar) ?? null]),
  ),
  performance: {
    coreWebVitalsMeasured: false,
    note: "This command does not run Lighthouse. Fonts use display:swap. Public pages use next/image, not raw img tags. No Core Web Vitals score is claimed.",
  },
  findings: findings.slice(0, 80),
};

const docs = path.join(process.cwd(), "docs/seo");
mkdirSync(docs, { recursive: true });
writeFileSync(
  path.join(docs, "TECHNICAL-AUDIT.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

const lines = [
  "Technical SEO audit",
  `PUBLIC ${report.publicPages}`,
  `INDEXABLE ${report.indexable}`,
  `NOINDEX ${report.noindex}`,
  `SITEMAP ${report.sitemapUrls}`,
  `MISSING TITLES ${missingTitles}`,
  `DUPLICATE TITLES ${titles.length}`,
  `MISSING DESCRIPTIONS ${missingDescriptions}`,
  `DUPLICATE DESCRIPTIONS ${descriptions.length}`,
  `MISSING CANONICALS ${missingCanonicals}`,
  `DUPLICATE CANONICALS ${canonicals.length}`,
  `INVALID CANONICALS ${invalidCanonicals}`,
  `REDIRECT CHAINS ${redirectChains}`,
  `REDIRECT LOOPS ${redirectLoops}`,
  `THIN CONTENT ${thin.length}`,
  `ORPHANS ${orphans.length}`,
  `DEEP CRAWL ${report.deepCrawlPages}`,
  `BROKEN LINKS ${brokenInternal}`,
  `404 ROUTES ${redirectRoutes}`,
  `BROKEN IMAGES ${brokenImages}`,
  `MISSING ALT ${missingAlt}`,
  `STRUCTURED DATA ${structuredDataErrors}`,
  `SITEMAP MISSING ${sitemapMissing}`,
  `SITEMAP DUPLICATES ${sitemapDuplicates}`,
  `FINDINGS ${findings.length}`,
];
console.log(lines.join("\n"));
for (const finding of findings.slice(0, 40)) {
  console.error(`${finding.code} ${finding.detail}`);
}
if (findings.length) process.exitCode = 1;
