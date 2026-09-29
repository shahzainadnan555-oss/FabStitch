import { writeFileSync } from "node:fs";
import { SEMANTIC_BUILD_REPORT, INDEXABLE_SEMANTIC_PAGES } from "@/domain/seo/semantic";
import {
  SEED_RECORDS,
  seedExpansionKindCounts,
  seedExpansionPlans,
} from "@/domain/seo/seed-expansion";
import { SITEMAP_ELIGIBLE_SEO_PAGES } from "@/domain/seo/storefront-registry";

const expansionIndexable = INDEXABLE_SEMANTIC_PAGES.filter((page) =>
  page.slug.startsWith("hub-"),
);
const expansionPlans = seedExpansionPlans();
const kinds = seedExpansionKindCounts();
const bySeed = new Map<string, number>();
for (const plan of expansionPlans) {
  bySeed.set(plan.seedKeyword, (bySeed.get(plan.seedKeyword) ?? 0) + 1);
}

const missingSeeds = SEED_RECORDS.filter(
  (seed) => !expansionPlans.some((plan) => plan.seedId === seed.id),
);

const lines = [
  "pageId,seedKeyword,kind,slug,path,primaryKeyword,indexable",
  ...expansionPlans.map((plan) => {
    const live = expansionIndexable.some((page) => page.slug === plan.slug);
    return [
      plan.pageId,
      JSON.stringify(plan.seedKeyword),
      plan.kind,
      plan.slug,
      `/discover/${plan.slug}/`,
      JSON.stringify(plan.primaryKeyword),
      live ? "true" : "false",
    ].join(",");
  }),
];

writeFileSync("docs/seo/SEED-KEYWORD-1000-REGISTRY.csv", `${lines.join("\n")}\n`);

const report = {
  seedCount: SEED_RECORDS.length,
  plannedPages: expansionPlans.length,
  indexableHubPages: expansionIndexable.length,
  kinds,
  missingSeeds: missingSeeds.map((seed) => seed.keyword),
  pagesPerSeed: Object.fromEntries(bySeed),
  semanticReport: SEMANTIC_BUILD_REPORT,
  sitemapEligible: SITEMAP_ELIGIBLE_SEO_PAGES.length,
};

console.log(JSON.stringify(report, null, 2));

if (expansionPlans.length !== 1000) {
  throw new Error(`Plan count ${expansionPlans.length} !== 1000`);
}
if (expansionIndexable.length !== 1000) {
  throw new Error(
    `Indexable hub pages ${expansionIndexable.length} !== 1000. Rejection reasons: ${JSON.stringify(SEMANTIC_BUILD_REPORT.rejectionReasons)}`,
  );
}
if (missingSeeds.length) {
  throw new Error(`Missing seeds: ${missingSeeds.map((s) => s.keyword).join(", ")}`);
}
