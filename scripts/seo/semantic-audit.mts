/**
 * Semantic SEO build + uniqueness audit.
 *
 * Run: node --import=./scripts/register-loader.mjs scripts/seo/semantic-audit.mts
 */
import {
  INDEXABLE_SEMANTIC_PAGES,
  SEMANTIC_BUILD_REPORT,
  SEMANTIC_PAGES,
} from "@/domain/seo/semantic";
import {
  INDEXABLE_SEO_PAGES,
  SITEMAP_ELIGIBLE_SEO_PAGES,
  assertStorefrontSeoRegistry,
} from "@/domain/seo/storefront-registry";

function main() {
  console.log("=== FabStitch semantic SEO audit ===");
  console.log(
    JSON.stringify(
      {
        candidates: SEMANTIC_BUILD_REPORT.candidates,
        accepted: SEMANTIC_BUILD_REPORT.accepted,
        rejected: SEMANTIC_BUILD_REPORT.rejected,
        indexable: SEMANTIC_BUILD_REPORT.indexable,
        byCluster: SEMANTIC_BUILD_REPORT.byCluster,
        rejectionReasons: SEMANTIC_BUILD_REPORT.rejectionReasons,
        duplicateTitleCount: SEMANTIC_BUILD_REPORT.duplicateTitles.length,
        duplicateH1Count: SEMANTIC_BUILD_REPORT.duplicateH1s.length,
        additionalCandidates: SEMANTIC_BUILD_REPORT.additionalCandidates,
        additionalPublished: SEMANTIC_BUILD_REPORT.additionalPublished,
        additionalRejected: SEMANTIC_BUILD_REPORT.additionalRejected,
        additionalCapacity: SEMANTIC_BUILD_REPORT.additionalCapacity,
      },
      null,
      2,
    ),
  );
  console.log("semantic pages total", SEMANTIC_PAGES.length);
  console.log("semantic indexable", INDEXABLE_SEMANTIC_PAGES.length);
  console.log("registry indexable", INDEXABLE_SEO_PAGES.length);
  console.log("sitemap eligible", SITEMAP_ELIGIBLE_SEO_PAGES.length);

  assertStorefrontSeoRegistry();
  console.log("storefront registry assertions: OK");
}

main();
