/**
 * Map the existing keyword corpus onto published pages.
 *
 * A keyword may support one canonical URL. Country rows may repeat that URL.
 * This script does not create pages and does not invent search volumes.
 *
 * Run: node --import=./scripts/register-loader.mjs scripts/seo/keyword-coverage-audit.mts
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  INDEXABLE_SEO_PAGES,
  SEO_PAGE_REGISTRY,
  seoPage,
} from "@/domain/seo/storefront-registry";

type Row = {
  keyword: string;
  country: string;
  targetUrl: string;
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let cell = "";
  let row: string[] = [];
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]!;
    if (quoted && char === '"' && text[index + 1] === '"') {
      cell += '"';
      index += 1;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (!quoted && char === ",") {
      row.push(cell);
      cell = "";
      continue;
    }
    if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += char;
  }
  if (cell || row.length) {
    row.push(cell);
    if (row.some((value) => value.trim())) rows.push(row);
  }
  return rows;
}

function normalizePath(value: string): string {
  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) return trimmed;
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

const file = path.resolve("docs/seo/fabstitch-keyword-map.csv");
const [header, ...records] = parseCsv(readFileSync(file, "utf8"));
const columns = new Map(header!.map((name, index) => [name.trim(), index]));
const keywordIndex = columns.get("Keyword");
const countryIndex = columns.get("Country");
const targetIndex = columns.get("Target URL");
if (
  keywordIndex === undefined ||
  countryIndex === undefined ||
  targetIndex === undefined
) {
  throw new Error("Keyword map is missing Keyword, Country, or Target URL");
}

const rows: Row[] = records.map((record) => ({
  keyword: record[keywordIndex]!.trim().toLowerCase(),
  country: record[countryIndex]!.trim(),
  targetUrl: normalizePath(record[targetIndex]!.trim()),
}));

const byKeyword = new Map<string, Set<string>>();
for (const row of rows) {
  const targets = byKeyword.get(row.keyword) ?? new Set<string>();
  targets.add(row.targetUrl);
  byKeyword.set(row.keyword, targets);
}

const competing = [...byKeyword.entries()].filter(
  ([, targets]) => targets.size > 1,
);
const registered = new Set(SEO_PAGE_REGISTRY.map((page) => page.path));
const indexable = new Set(INDEXABLE_SEO_PAGES.map((page) => page.path));
let mappedIndexable = 0;
let mappedOther = 0;
let unmapped = 0;
for (const targets of byKeyword.values()) {
  const [target] = targets;
  if (!target || targets.size !== 1) continue;
  if (indexable.has(target)) mappedIndexable += 1;
  else if (registered.has(target)) mappedOther += 1;
  else unmapped += 1;
}

const missingCanonicals = INDEXABLE_SEO_PAGES.filter(
  (page) => !page.canonicalPath,
);
const invalidCanonicals = INDEXABLE_SEO_PAGES.filter(
  (page) =>
    page.canonicalPath !== page.path || !seoPage(page.canonicalPath)?.indexable,
);
const duplicateCanonicals = new Map<string, number>();
for (const page of INDEXABLE_SEO_PAGES) {
  duplicateCanonicals.set(
    page.canonicalPath,
    (duplicateCanonicals.get(page.canonicalPath) ?? 0) + 1,
  );
}
const duplicateCanonicalCount = [...duplicateCanonicals.values()].filter(
  (count) => count > 1,
).length;

console.log("Keyword coverage audit");
console.log("KEYWORDS", byKeyword.size);
console.log("ROWS", rows.length);
console.log("MAPPED TO INDEXABLE PAGE", mappedIndexable);
console.log("MAPPED TO OTHER REGISTERED PAGE", mappedOther);
console.log("NO PUBLISHED DESTINATION", unmapped);
console.log("COMPETING CANONICALS", competing.length);
console.log("INDEXABLE PAGES", INDEXABLE_SEO_PAGES.length);
console.log("MISSING CANONICALS", missingCanonicals.length);
console.log("INVALID CANONICALS", invalidCanonicals.length);
console.log("DUPLICATE CANONICALS", duplicateCanonicalCount);

if (competing.length) {
  for (const [keyword, targets] of competing.slice(0, 12)) {
    console.error(
      `COMPETING ${keyword} → ${[...targets].slice(0, 4).join(" | ")}`,
    );
  }
  process.exitCode = 1;
}
if (
  missingCanonicals.length ||
  invalidCanonicals.length ||
  duplicateCanonicalCount
) {
  process.exitCode = 1;
}
