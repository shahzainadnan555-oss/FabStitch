/**
 * Image SEO audit for indexable pages and the public image catalog.
 * Does not score Core Web Vitals. Does not call the backend.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { INDEXABLE_SEO_PAGES } from "@/domain/seo/storefront-registry";
import { IMAGE_ASSETS, imageAsset } from "@/domain/seo/image-assets";

const FIBERS = [
  "cotton",
  "linen",
  "silk",
  "wool",
  "denim",
  "polyester",
  "viscose",
  "rayon",
  "jersey",
  "velvet",
  "chiffon",
  "georgette",
] as const;

const SHOULD_HAVE_IMAGE = new Set([
  "home",
  "marketplace",
  "fabric",
  "fabric_hub",
  "collection",
  "collection_hub",
  "seasonal_collection",
  "best_for",
  "guide",
  "semantic_landing",
  "marketplace_topic",
  "marketplace_support",
  "fabric_question",
  "commercial_landing",
  "intent_hub",
]);

function fibersIn(value: string): string[] {
  const text = value.toLowerCase();
  return FIBERS.filter((fiber) => text.includes(fiber));
}

function stuffed(alt: string): boolean {
  const words = alt.toLowerCase().split(/\s+/);
  const counts = new Map<string, number>();
  for (const word of words) {
    if (word.length < 5) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.values()].some((count) => count >= 3);
}

const publicRoot = process.cwd() + "/public";
let broken = 0;
let missingAlt = 0;
let missingDimensions = 0;
let invalidUrl = 0;
let irrelevant = 0;
let missingImage = 0;
let withImage = 0;
const samples: string[] = [];

function note(kind: string, detail: string) {
  if (samples.length < 25) samples.push(`${kind}: ${detail}`);
}

for (const page of INDEXABLE_SEO_PAGES) {
  const src = page.image;
  if (!src) {
    if (SHOULD_HAVE_IMAGE.has(page.type)) {
      missingImage += 1;
      note("missing_image", `${page.path} (${page.type})`);
    }
    continue;
  }
  withImage += 1;
  if (!src.startsWith("/") && !/^https?:\/\//i.test(src)) {
    invalidUrl += 1;
    note("invalid_url", `${page.path} ${src}`);
    continue;
  }
  if (src.startsWith("/") && !existsSync(path.join(publicRoot, src))) {
    broken += 1;
    note("broken", `${page.path} ${src}`);
  }
  const asset = imageAsset(src);
  if (!asset) {
    missingDimensions += 1;
    missingAlt += 1;
    note("unregistered", `${page.path} ${src}`);
    continue;
  }
  if (!asset.alt.trim() || stuffed(asset.alt)) {
    missingAlt += 1;
    note("alt", `${page.path} ${asset.alt}`);
  }
  if (!asset.width || !asset.height) {
    missingDimensions += 1;
    note("dimensions", page.path);
  }
  const topicFibers = fibersIn(`${page.primaryTopic} ${page.h1} ${page.path}`);
  const imageFibers = fibersIn(`${src} ${asset.alt}`);
  const stem = src
    .split("/")
    .pop()
    ?.toLowerCase()
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/-primary$/, "");
  const stemTokens = (stem ?? "")
    .split("-")
    .filter((token) => token.length > 3);
  const pageText = `${page.path} ${page.h1} ${page.primaryTopic}`.toLowerCase();
  const namedInFile = stemTokens.some((token) => pageText.includes(token));
  const rayonFamily = new Set(["rayon", "viscose", "lyocell", "tencel"]);
  const silkFamily = new Set([
    "silk",
    "chiffon",
    "georgette",
    "satin",
    "crepe",
  ]);
  function sameCloth(left: string, right: string): boolean {
    if (left === right) return true;
    if (rayonFamily.has(left) && rayonFamily.has(right)) return true;
    if (silkFamily.has(left) && silkFamily.has(right)) return true;
    return false;
  }
  if (
    topicFibers.length &&
    imageFibers.length &&
    !namedInFile &&
    !topicFibers.some((fiber) =>
      imageFibers.some((imageFiber) => sameCloth(fiber, imageFiber)),
    )
  ) {
    irrelevant += 1;
    note(
      "irrelevant",
      `${page.path} topic=${topicFibers.join(",")} image=${imageFibers.join(",")}`,
    );
  }
}

const report = {
  catalogImages: IMAGE_ASSETS.length,
  indexablePages: INDEXABLE_SEO_PAGES.length,
  pagesWithImage: withImage,
  missingAlt,
  brokenImages: broken,
  missingDimensions,
  invalidImageUrls: invalidUrl,
  irrelevantOrMissing: irrelevant + missingImage,
  irrelevant,
  missingImage,
  samples,
};

const outDir = path.join(process.cwd(), "docs/seo");
mkdirSync(outDir, { recursive: true });
writeFileSync(
  path.join(outDir, "IMAGE-SEO-AUDIT.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));

const failed =
  missingAlt +
  broken +
  missingDimensions +
  invalidUrl +
  irrelevant +
  missingImage;
if (failed) {
  console.error(`image seo audit failed (${failed})`);
  process.exit(1);
}
