/**
 * Fabric question inventory audit.
 *
 * Run: node --import=./scripts/register-loader.mjs scripts/seo/fabric-questions-audit.mts
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  FABRIC_QUESTION_PAGES,
  FABRIC_QUESTION_SOURCES,
} from "@/domain/seo/fabric-questions";
import { seoPage } from "@/domain/seo/storefront-registry";
import { buildSitemapInventory } from "@/lib/sitemap-inventory";

const findings: string[] = [];
const fail = (message: string) => findings.push(message);

const questions = FABRIC_QUESTION_PAGES.filter(
  (page) => page.kind === "question",
);
const counts = {
  raw: FABRIC_QUESTION_SOURCES.length,
  unique: new Set(
    FABRIC_QUESTION_SOURCES.map((item) => item.normalizedQuestion),
  ).size,
  duplicate: FABRIC_QUESTION_SOURCES.filter(
    (item) => item.status === "DUPLICATE",
  ).length,
  published: FABRIC_QUESTION_SOURCES.filter(
    (item) => item.status === "PUBLISHED",
  ).length,
  merged: FABRIC_QUESTION_SOURCES.filter((item) => item.status === "MERGED")
    .length,
  rejected: FABRIC_QUESTION_SOURCES.filter(
    (item) => item.status === "REJECTED-OFF-TOPIC",
  ).length,
  pages: questions.length,
};

if (counts.published !== questions.length) {
  fail(
    `Published sources ${counts.published} do not match pages ${questions.length}`,
  );
}

const titles = new Map<string, string[]>();
const h1s = new Map<string, string[]>();
const descriptions = new Map<string, string[]>();
for (const page of FABRIC_QUESTION_PAGES) {
  const record = seoPage(page.path);
  if (!record) fail(`missing registry ${page.path}`);
  if (record && record.canonicalPath !== page.path)
    fail(`canonical ${page.path}`);
  if (record && !record.indexable) fail(`noindex ${page.path}`);
  if (!page.title.trim()) fail(`title ${page.path}`);
  if (!page.h1.trim()) fail(`h1 ${page.path}`);
  if (!page.description.trim()) fail(`description ${page.path}`);
  if (!page.imageAlt.trim()) fail(`alt ${page.path}`);
  if (page.imageAlt.trim().split(/\s+/).length > 18)
    fail(`alt length ${page.path}`);
  const image = path.join(process.cwd(), "public", page.imagePath);
  if (!existsSync(image)) fail(`image ${page.imagePath}`);
  for (const related of page.relatedPaths) {
    if (!seoPage(related)) fail(`link ${page.path} → ${related}`);
  }
  const add = (map: Map<string, string[]>, key: string) => {
    const list = map.get(key) ?? [];
    list.push(page.path);
    map.set(key, list);
  };
  add(titles, page.title.toLowerCase());
  add(h1s, page.h1.toLowerCase());
  add(descriptions, page.description.toLowerCase());
}

for (const [key, paths] of titles) {
  if (paths.length > 1) fail(`duplicate title ${key}`);
}
for (const [key, paths] of h1s) {
  if (paths.length > 1) fail(`duplicate h1 ${key}`);
}
for (const [key, paths] of descriptions) {
  if (paths.length > 1) fail(`duplicate description ${key}`);
}

const incoming = new Map<string, number>();
for (const page of FABRIC_QUESTION_PAGES) {
  for (const related of page.relatedPaths)
    incoming.set(related, (incoming.get(related) ?? 0) + 1);
}
for (const page of questions) {
  if (!incoming.get(page.path)) fail(`orphan ${page.path}`);
}

const locs = buildSitemapInventory().map((entry) => entry.loc);
const wanted = FABRIC_QUESTION_PAGES.map(
  (page) => `https://fabstitch.net${page.path}`,
);
const missing = wanted.filter((loc) => !locs.includes(loc));
const dupes = wanted.filter(
  (loc) => locs.filter((item) => item === loc).length > 1,
);
if (missing.length) fail(`sitemap missing ${missing.length}`);
if (dupes.length) fail(`sitemap duplicate ${dupes.length}`);

const report = FABRIC_QUESTION_SOURCES.map((source) => ({
  sourceQuestion: source.originalWording,
  normalizedQuestion: source.normalizedQuestion,
  pageUrl: source.destination?.startsWith("/")
    ? source.destination
    : source.destination
      ? `/guides/fabric-questions/${source.destination}/`
      : "",
  primaryKeyword: source.normalizedQuestion,
  category: source.destination?.startsWith("/")
    ? "existing"
    : (questions.find((page) => page.slug === source.destination)?.category ??
      ""),
  status: source.status,
  reason: source.reason,
  sourceReport: source.sourceReport,
}));

mkdirSync("docs/seo", { recursive: true });
writeFileSync(
  "docs/seo/FABRIC-QUESTIONS.json",
  `${JSON.stringify({ counts, findings, questions: report }, null, 2)}\n`,
);

console.log("Fabric question audit");
console.log("RAW QUESTIONS", counts.raw);
console.log("UNIQUE QUESTIONS", counts.unique);
console.log("DUPLICATE QUESTIONS", counts.duplicate);
console.log("PUBLISHED QUESTION PAGES", counts.pages);
console.log("MERGED QUESTIONS", counts.merged);
console.log("REJECTED QUESTIONS", counts.rejected);
console.log("SITEMAP MISSING", missing.length);
console.log("SITEMAP DUPLICATES", dupes.length);
console.log("FINDINGS", findings.length);
for (const finding of findings.slice(0, 30)) console.error(finding);
if (findings.length) process.exitCode = 1;
