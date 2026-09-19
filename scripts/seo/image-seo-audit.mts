/**
 * Rendered-image SEO audit.
 * Walks public page templates and the shared image catalog.
 * Does not score Core Web Vitals. Does not call the backend.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { MEDIA_BY_FABRIC_SLUG } from "@/catalog";
import { LANDING_MEDIA } from "@/components/landing/media";
import { COMMERCIAL_LANDING_PAGES } from "@/content/commercial-landing-pages";
import { MATERIAL_LANDING_PAGES } from "@/content/material-landing-pages";
import { SEO_LANDING_PAGES } from "@/content/seo-landing-pages";
import { IMAGE_ASSETS, imageAsset, imageCopy } from "@/domain/seo/image-assets";
import { PUBLIC_SEO_PAGES } from "@/domain/seo/storefront-registry";

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

const RENDER_ONE = new Set([
  "semantic_landing",
  "marketplace_topic",
  "marketplace_support",
  "fabric_question",
  "guide",
  "fabric",
  "commercial_landing",
  "intent_hub",
]);

type Role = "content" | "decorative";

type Rendered = {
  page: string;
  src: string;
  role: Role;
  topic: string;
};

const rendered: Rendered[] = [];

function add(page: string, src: string | undefined, role: Role, topic = "") {
  if (!src) return;
  rendered.push({ page, src, role, topic });
}

for (const page of PUBLIC_SEO_PAGES) {
  if (page.path === "/") continue;
  if (!RENDER_ONE.has(page.type) || !page.image) continue;
  add(page.path, page.image, "content", `${page.primaryTopic} ${page.h1}`);
}

function cardImages(
  pagePath: string,
  hero: string,
  slugs: readonly string[],
  topic: string,
) {
  add(pagePath, hero, "content", topic);
  for (const slug of slugs) {
    const media = MEDIA_BY_FABRIC_SLUG[slug];
    add(pagePath, media?.src ?? hero, "content", `${topic} ${slug}`);
  }
}

for (const page of COMMERCIAL_LANDING_PAGES) {
  const existing = rendered.findIndex(
    (item) => item.page === page.path && item.role === "content",
  );
  if (existing >= 0) rendered.splice(existing, 1);
  cardImages(page.path, page.image, page.fabricSlugs, page.h1);
  add(page.path, page.image, "decorative", page.h1);
}

for (const page of [...SEO_LANDING_PAGES, ...MATERIAL_LANDING_PAGES]) {
  const existing = rendered.findIndex(
    (item) => item.page === page.path && item.role === "content",
  );
  if (existing >= 0) rendered.splice(existing, 1);
  cardImages(page.path, page.image, page.fabricSlugs, page.h1);
}

const home = "/";
const homeContent = [
  LANDING_MEDIA.linen,
  LANDING_MEDIA.cotton,
  LANDING_MEDIA.denim,
  LANDING_MEDIA.performance,
  LANDING_MEDIA.twill,
  LANDING_MEDIA.poplin,
  LANDING_MEDIA.knit,
  LANDING_MEDIA.fleece,
  "/media/fabrics/canvas.jpg",
  LANDING_MEDIA.knit,
  LANDING_MEDIA.jersey,
  "/media/fabrics/denim.jpg",
  LANDING_MEDIA.heroPoster,
];
for (const src of homeContent) add(home, src, "content", "homepage fabric");
for (const src of [
  LANDING_MEDIA.heroPoster,
  LANDING_MEDIA.cotton,
  LANDING_MEDIA.twill,
  LANDING_MEDIA.linen,
  LANDING_MEDIA.heroPoster,
  LANDING_MEDIA.canvas,
  LANDING_MEDIA.twill,
]) {
  add(home, src, "decorative", "homepage backdrop");
}

add("/contact/", LANDING_MEDIA.heroPoster, "content", "contact");
add("/contact/", LANDING_MEDIA.heroPoster, "decorative", "contact backdrop");
add("/contact/", LANDING_MEDIA.linen, "decorative", "contact backdrop");
add("/how-it-works/", LANDING_MEDIA.linen, "content", "how it works");
add(
  "/how-it-works/",
  LANDING_MEDIA.linen,
  "decorative",
  "how it works backdrop",
);
add("site-header", "/media/fabstitch-mark.png", "decorative", "wordmark");
add("site-loader", "/media/fabstitch-mark.png", "decorative", "loader");
add("/login/", LANDING_MEDIA.heroPoster, "decorative", "auth panel");

const publicRoot = path.join(process.cwd(), "public");
let altPresent = 0;
let altMissing = 0;
let titlePresent = 0;
let titleMissing = 0;
let broken = 0;
let missingDimensions = 0;
let invalidUrl = 0;
let irrelevant = 0;
let decorative = 0;
const samples: string[] = [];
const pages = new Set<string>();

function note(kind: string, detail: string) {
  if (samples.length < 30) samples.push(`${kind}: ${detail}`);
}

function stuffed(value: string): boolean {
  const counts = new Map<string, number>();
  for (const word of value.toLowerCase().split(/\s+/)) {
    if (word.length < 5) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.values()].some((count) => count >= 3);
}

function fibersIn(value: string): string[] {
  const text = value.toLowerCase();
  return FIBERS.filter((fiber) => text.includes(fiber));
}

const rayonFamily = new Set(["rayon", "viscose", "lyocell", "tencel"]);
const silkFamily = new Set(["silk", "chiffon", "georgette", "satin", "crepe"]);

function sameCloth(left: string, right: string): boolean {
  if (left === right) return true;
  if (rayonFamily.has(left) && rayonFamily.has(right)) return true;
  if (silkFamily.has(left) && silkFamily.has(right)) return true;
  return false;
}

for (const item of rendered) {
  if (item.page.startsWith("/")) pages.add(item.page);
  if (item.role === "decorative") {
    decorative += 1;
    continue;
  }
  if (!item.src.startsWith("/") && !/^https?:\/\//i.test(item.src)) {
    invalidUrl += 1;
    altMissing += 1;
    titleMissing += 1;
    note("invalid_url", `${item.page} ${item.src}`);
    continue;
  }
  if (
    item.src.startsWith("/") &&
    !existsSync(path.join(publicRoot, item.src))
  ) {
    broken += 1;
    note("broken", `${item.page} ${item.src}`);
  }
  const known = item.src.startsWith("/") ? imageAsset(item.src) : undefined;
  if (item.src.startsWith("/") && !known) {
    missingDimensions += 1;
    note("dimensions", `${item.page} ${item.src}`);
  }
  const copy = imageCopy(item.src);
  if (
    !copy.alt.trim() ||
    stuffed(copy.alt) ||
    /^fabric$/i.test(copy.alt.trim())
  ) {
    altMissing += 1;
    note("alt", `${item.page} ${copy.alt}`);
  } else {
    altPresent += 1;
  }
  if (!copy.title.trim() || stuffed(copy.title)) {
    titleMissing += 1;
    note("title", `${item.page} ${copy.title}`);
  } else {
    titlePresent += 1;
  }
  const topicFibers = fibersIn(item.topic);
  const imageFibers = fibersIn(`${item.src} ${copy.alt}`);
  const stem =
    item.src
      .split("/")
      .pop()
      ?.toLowerCase()
      .replace(/\.[a-z0-9]+$/, "") ?? "";
  const named = stem
    .replace(/-primary$/, "")
    .split("-")
    .filter((token) => token.length > 3)
    .some((token) => item.topic.toLowerCase().includes(token));
  if (
    topicFibers.length &&
    imageFibers.length &&
    !named &&
    !topicFibers.some((fiber) =>
      imageFibers.some((imageFiber) => sameCloth(fiber, imageFiber)),
    )
  ) {
    irrelevant += 1;
    note("irrelevant", `${item.page} ${item.src}`);
  }
}

let catalogBroken = 0;
let catalogMissingAlt = 0;
let catalogMissingTitle = 0;
let catalogMissingDimensions = 0;
for (const asset of IMAGE_ASSETS) {
  if (!existsSync(path.join(publicRoot, asset.src))) {
    catalogBroken += 1;
    note("catalog_broken", asset.src);
  }
  if (!asset.alt.trim() || stuffed(asset.alt)) catalogMissingAlt += 1;
  if (!asset.title.trim() || stuffed(asset.title)) catalogMissingTitle += 1;
  if (!asset.width || !asset.height) catalogMissingDimensions += 1;
}

const componentRoots = ["app", "components", "features"];
const allowedImageFiles = new Set([
  "components/seo/seo-image.tsx",
  "components/marketplace/resilient-fabric-image.tsx",
]);
let strayImages = 0;

function walk(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full);
      continue;
    }
    if (!entry.name.endsWith(".tsx")) continue;
    const rel = path.relative(process.cwd(), full);
    if (allowedImageFiles.has(rel)) continue;
    const source = readFileSync(full, "utf8");
    if (
      !source.includes('from "next/image"') &&
      !source.includes("from 'next/image'")
    ) {
      continue;
    }
    const tags = source.match(/<Image\b[\s\S]*?\/>/g) ?? [];
    for (const tag of tags) {
      if (!/alt=""/.test(tag)) {
        strayImages += 1;
        note("stray_image", rel);
      }
    }
  }
}

for (const root of componentRoots) walk(path.join(process.cwd(), root));

const meaningful = altPresent + altMissing;
const report = {
  totalImages: meaningful + decorative,
  meaningful,
  decorativeEmptyAlt: decorative,
  alt: { present: altPresent, missing: altMissing },
  title: { present: titlePresent, missing: titleMissing },
  brokenImages: broken + catalogBroken,
  missingDimensions: missingDimensions + catalogMissingDimensions,
  invalidImageUrls: invalidUrl,
  irrelevantOrMissing: irrelevant,
  pagesAffected: pages.size,
  catalogImages: IMAGE_ASSETS.length,
  catalogMissingAlt,
  catalogMissingTitle,
  strayImages,
  before: {
    missingAlt: 0,
    missingTitle: meaningful,
    brokenImages: 0,
    note: "The previous image pass set alt text and dimensions, and did not emit title attributes.",
  },
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
  altMissing +
  titleMissing +
  broken +
  catalogBroken +
  missingDimensions +
  catalogMissingDimensions +
  catalogMissingAlt +
  catalogMissingTitle +
  invalidUrl +
  irrelevant +
  strayImages;
if (failed) {
  console.error(`image seo audit failed (${failed})`);
  process.exit(1);
}
