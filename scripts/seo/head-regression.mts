/**
 * Static SEO regression checks that fail loudly before a crawl.
 * These do not start a server. Runtime HTML checks live in qa:seo-runtime.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { storefrontMetadata } from "@/lib/storefront-metadata";
import {
  INDEXABLE_SEO_PAGES,
  assertStorefrontSeoRegistry,
  seoPage,
} from "@/domain/seo/storefront-registry";
import { localCatalogFabricDetail } from "@/lib/local-catalog-fabric";
import { localCustomerCollectionDetail } from "@/lib/local-catalog-collection";
import { storefrontRedirect } from "@/lib/storefront-redirects";
import { getMarketplaceTopic } from "@/domain/seo/marketplace-thousand";
import { SITE_URL } from "@/lib/seo";

const failures: string[] = [];
function fail(reason: string) {
  failures.push(reason);
}

assertStorefrontSeoRegistry();

const layout = readFileSync(path.join(process.cwd(), "app/layout.tsx"), "utf8");
if (!layout.includes("<head>") || !layout.includes("OrganizationJsonLd")) {
  fail("root layout must emit Organization JSON-LD inside <head>");
}
if (
  /<body[\s\S]*OrganizationJsonLd/.test(layout) &&
  !layout.includes("<head>")
) {
  fail("Organization JSON-LD must not live only in <body>");
}

const icon = readFileSync(
  path.join(process.cwd(), "components/ui/icon.tsx"),
  "utf8",
);
if (/<title>\{title\}<\/title>/.test(icon)) {
  fail(
    "SVG icons must not emit HTML <title> (crawlers count it as title-in-body)",
  );
}

const proxy = readFileSync(path.join(process.cwd(), "proxy.ts"), "utf8");
if (proxy.includes('"index, follow"')) {
  fail(
    "proxy must not send X-Robots-Tag: index, follow; meta robots is the allow signal",
  );
}

const nextConfig = readFileSync(
  path.join(process.cwd(), "next.config.ts"),
  "utf8",
);
for (const header of [
  "Content-Security-Policy",
  "X-Frame-Options",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "Strict-Transport-Security",
]) {
  if (!nextConfig.includes(header)) {
    fail(`next.config.ts missing security header ${header}`);
  }
}

const home = storefrontMetadata({
  title: "FabStitch | B2B Fabric Marketplace & Fabric Sourcing",
  description: "Discover apparel fabrics on FabStitch.",
  path: "/",
  index: true,
});
const homeCanonical = String(
  typeof home.alternates?.canonical === "string"
    ? home.alternates.canonical
    : "",
);
if (homeCanonical !== `${SITE_URL}/`) {
  fail(`homepage canonical is not absolute production URL: ${homeCanonical}`);
}

const fabricMeta = storefrontMetadata({
  title: "Silk Chiffon",
  description: "Explore Silk Chiffon in the FabStitch 2027 collection.",
  path: "/fabrics/silk-chiffon/",
  index: true,
});
const fabricCanonical = String(
  typeof fabricMeta.alternates?.canonical === "string"
    ? fabricMeta.alternates.canonical
    : "",
);
if (fabricCanonical !== `${SITE_URL}/fabrics/silk-chiffon/`) {
  fail(`fabric canonical is not absolute: ${fabricCanonical}`);
}
if (fabricMeta.robots && typeof fabricMeta.robots === "object") {
  const robots = fabricMeta.robots as { index?: boolean };
  if (robots.index !== true) fail("populated fabric metadata is not indexable");
}

const missing = localCatalogFabricDetail("not-a-real-fabric");
if (missing) fail("unknown fabric slug must not resolve from local catalog");

const silk = localCatalogFabricDetail("silk-chiffon");
if (!silk?.fabric.name) fail("silk-chiffon local catalog fallback is empty");

const silkPage = seoPage("/fabrics/silk-chiffon/");
if (!silkPage?.indexable) fail("silk-chiffon must be an indexable fabric PDP");

const indexableFabrics = INDEXABLE_SEO_PAGES.filter(
  (page) => page.type === "fabric",
);
if (indexableFabrics.length < 100) {
  fail(
    `expected populated catalog PDPs to be indexable, found ${indexableFabrics.length}`,
  );
}

// Audit soft-empty fabric URLs must resolve from the local 2027 catalog.
for (const slug of [
  "wool-hemp-canvas",
  "silk-chiffon-crepe",
  "tencel-denim",
  "french-terry-classic",
  "silk-organza",
]) {
  if (!localCatalogFabricDetail(slug)?.fabric.name) {
    fail(`audit soft-empty fabric missing local fallback: ${slug}`);
  }
}

const cottonCollection = localCustomerCollectionDetail("cotton");
if (!cottonCollection?.fabrics.length) {
  fail("cotton collection local fallback must include fabrics");
}

const redirectCases: Array<[string, string]> = [
  ["/fabrics/best-for/shirting/", "/fabrics/best-for/shirts/"],
  ["/fabrics/best-for/curtains/", "/fabrics/best-for/home-textiles/"],
  ["/fabrics/best-for/swimwear/", "/fabrics/best-for/activewear/"],
  ["/fabrics/best-for/bottoms/", "/fabrics/best-for/trousers/"],
  ["/fabrics/best-for/statement-knits/", "/fabrics/best-for/knitwear/"],
];
for (const [from, to] of redirectCases) {
  const got = storefrontRedirect(from);
  if (got !== to) fail(`expected redirect ${from} → ${to}, got ${got}`);
}

const sampleTopic = getMarketplaceTopic("source-cotton-for-shirts");
if (!sampleTopic || sampleTopic.sections.length < 3) {
  fail("marketplace topics must render deepened sections (≥3)");
} else if (sampleTopic.wordCount < 200) {
  fail(`marketplace topic wordCount below 200: ${sampleTopic.slug}`);
}

if (failures.length) {
  console.error("SEO head/indexability regression failed:");
  for (const reason of failures) console.error(`- ${reason}`);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      indexablePages: INDEXABLE_SEO_PAGES.length,
      indexableFabrics: indexableFabrics.length,
      homeCanonical,
      fabricCanonical,
    },
    null,
    2,
  ),
);
