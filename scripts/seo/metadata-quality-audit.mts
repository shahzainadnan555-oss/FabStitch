/**
 * Indexable title, description, and content-length audit.
 *
 * Titles are the rendered document title (`segment | FabStitch`, homepage absolute).
 * Content words are registry word counts of text the page renders. Help, support,
 * and private routes are excluded. The old 300-word floor forced a cloned
 * closing section onto topic pages, so the floor is now a real-body check.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  INDEXABLE_SEO_PAGES,
  PUBLIC_SEO_PAGES,
  SEO_PAGE_REGISTRY,
} from "@/domain/seo/storefront-registry";
import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  TITLE_MAX,
  TITLE_MIN,
  renderedDocumentTitle,
} from "@/domain/seo/snippet-length";

const CONTENT_EXCLUDED = new Set(["help", "help_hub", "support", "private"]);

const titles = new Map<string, string>();
const descriptions = new Map<string, string>();
let titleShort = 0;
let titleLong = 0;
let titleMissing = 0;
let descriptionShort = 0;
let descriptionLong = 0;
let descriptionMissing = 0;
let duplicateTitles = 0;
let duplicateDescriptions = 0;
let contentOk = 0;
let contentShort = 0;
let contentExcluded = 0;

for (const page of INDEXABLE_SEO_PAGES) {
  const title = renderedDocumentTitle(page.path, page.title);
  if (!page.title.trim()) titleMissing += 1;
  else if (title.length < TITLE_MIN) titleShort += 1;
  else if (title.length > TITLE_MAX) titleLong += 1;
  if (titles.has(title)) duplicateTitles += 1;
  else titles.set(title, page.path);

  if (!page.description.trim()) descriptionMissing += 1;
  else if (page.description.length < DESCRIPTION_MIN) descriptionShort += 1;
  else if (page.description.length > DESCRIPTION_MAX) descriptionLong += 1;
  if (descriptions.has(page.description)) duplicateDescriptions += 1;
  else descriptions.set(page.description, page.path);

  if (CONTENT_EXCLUDED.has(page.type)) {
    contentExcluded += 1;
    continue;
  }
  if (typeof page.wordCount === "number" && page.wordCount >= 80)
    contentOk += 1;
  else contentShort += 1;
}

const report = {
  totalPages: SEO_PAGE_REGISTRY.length,
  publicPages: PUBLIC_SEO_PAGES.length,
  indexablePages: INDEXABLE_SEO_PAGES.length,
  title: {
    min: TITLE_MIN,
    max: TITLE_MAX,
    withinRange:
      INDEXABLE_SEO_PAGES.length - titleShort - titleLong - titleMissing,
    tooShort: titleShort,
    tooLong: titleLong,
    missing: titleMissing,
    duplicate: duplicateTitles,
  },
  description: {
    min: DESCRIPTION_MIN,
    max: DESCRIPTION_MAX,
    withinRange:
      INDEXABLE_SEO_PAGES.length -
      descriptionShort -
      descriptionLong -
      descriptionMissing,
    tooShort: descriptionShort,
    tooLong: descriptionLong,
    missing: descriptionMissing,
    duplicate: duplicateDescriptions,
  },
  content: {
    eligible: contentOk + contentShort,
    atLeast80: contentOk,
    under80: contentShort,
    excludedUtility: contentExcluded,
  },
};

const outDir = path.join(process.cwd(), "docs/seo");
mkdirSync(outDir, { recursive: true });
writeFileSync(
  path.join(outDir, "METADATA-QUALITY.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.log(JSON.stringify(report, null, 2));

const failed =
  titleShort +
  titleLong +
  titleMissing +
  descriptionShort +
  descriptionLong +
  descriptionMissing +
  duplicateTitles +
  duplicateDescriptions +
  contentShort;

if (failed) {
  console.error(`metadata quality audit failed (${failed})`);
  process.exit(1);
}
