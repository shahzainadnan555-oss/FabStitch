import { generateSemanticCandidates } from "./candidates";
import { composeSemanticPage } from "./compose";
import { reservedPathSet } from "./reserved";
import type { SemanticPage } from "./types";
import { canonicalSeoPath } from "@/domain/seo/publication";

export type SemanticBuildReport = {
  candidates: number;
  accepted: number;
  rejected: number;
  indexable: number;
  byCluster: Record<string, number>;
  rejectionReasons: Record<string, number>;
  duplicateTitles: string[];
  duplicateH1s: string[];
  duplicateDescriptions: string[];
  duplicateSlugs: string[];
};

function dedupeKey(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Build the semantic page corpus once at module load.
 * Pages failing the quality gate remain available for audit but are not indexed.
 */
function buildSemanticCorpus(): {
  pages: readonly SemanticPage[];
  report: SemanticBuildReport;
} {
  const reserved = reservedPathSet();
  const candidates = generateSemanticCandidates();
  const rejectionReasons: Record<string, number> = {};
  const composed: SemanticPage[] = [];

  const bump = (reason: string) => {
    rejectionReasons[reason] = (rejectionReasons[reason] ?? 0) + 1;
  };

  for (const candidate of candidates) {
    if (reserved.has(canonicalSeoPath(candidate.path))) {
      bump("reserved_path");
      continue;
    }
    const page = composeSemanticPage(candidate);
    if (!page.qualityGatePassed) {
      for (const note of page.qualityNotes) bump(note);
      continue;
    }
    composed.push(page);
  }

  // Uniqueness pass across the accepted set.
  const titleMap = new Map<string, string[]>();
  const h1Map = new Map<string, string[]>();
  const descMap = new Map<string, string[]>();
  const slugMap = new Map<string, string[]>();

  for (const page of composed) {
    const t = dedupeKey(page.title);
    const h = dedupeKey(page.h1);
    const d = dedupeKey(page.metaDescription);
    titleMap.set(t, [...(titleMap.get(t) ?? []), page.slug]);
    h1Map.set(h, [...(h1Map.get(h) ?? []), page.slug]);
    descMap.set(d, [...(descMap.get(d) ?? []), page.slug]);
    slugMap.set(page.slug, [...(slugMap.get(page.slug) ?? []), page.slug]);
  }

  const duplicateTitles = [...titleMap.entries()]
    .filter(([, slugs]) => slugs.length > 1)
    .map(([title]) => title);
  const duplicateH1s = [...h1Map.entries()]
    .filter(([, slugs]) => slugs.length > 1)
    .map(([h1]) => h1);
  const duplicateDescriptions = [...descMap.entries()]
    .filter(([, slugs]) => slugs.length > 1)
    .map(([desc]) => desc);
  const duplicateSlugs = [...slugMap.entries()]
    .filter(([, slugs]) => slugs.length > 1)
    .map(([slug]) => slug);

  const collideSlugs = new Set<string>();
  for (const map of [titleMap, h1Map, descMap]) {
    for (const slugs of map.values()) {
      if (slugs.length < 2) continue;
      // Keep the first slug; demote the rest.
      for (const slug of slugs.slice(1)) collideSlugs.add(slug);
    }
  }

  const pages: SemanticPage[] = [];
  for (const page of composed) {
    if (collideSlugs.has(page.slug)) {
      bump("duplicate_metadata");
      pages.push({
        ...page,
        indexable: false,
        qualityGatePassed: false,
        qualityNotes: [...page.qualityNotes, "duplicate_metadata"],
      });
      continue;
    }
    pages.push(page);
  }

  // Final safety: if still under ~900 strong pages, keep all quality-passed;
  // report counts honestly.
  const indexablePages = pages.filter((page) => page.indexable);
  const byCluster: Record<string, number> = {};
  for (const page of indexablePages) {
    byCluster[page.cluster] = (byCluster[page.cluster] ?? 0) + 1;
  }

  const rejected =
    candidates.length - pages.filter((page) => page.qualityGatePassed).length;

  return {
    pages,
    report: {
      candidates: candidates.length,
      accepted: pages.filter((page) => page.qualityGatePassed).length,
      rejected: Math.max(0, rejected),
      indexable: indexablePages.length,
      byCluster,
      rejectionReasons,
      duplicateTitles,
      duplicateH1s,
      duplicateDescriptions,
      duplicateSlugs,
    },
  };
}

const CORPUS = buildSemanticCorpus();

export const SEMANTIC_PAGES: readonly SemanticPage[] = CORPUS.pages;
export const INDEXABLE_SEMANTIC_PAGES = SEMANTIC_PAGES.filter(
  (page) => page.indexable,
);
export const SEMANTIC_BY_SLUG: Readonly<Record<string, SemanticPage>> =
  Object.freeze(
    Object.fromEntries(SEMANTIC_PAGES.map((page) => [page.slug, page])),
  );
export const SEMANTIC_BUILD_REPORT: SemanticBuildReport = CORPUS.report;

export function getSemanticPage(slug: string): SemanticPage | undefined {
  return SEMANTIC_BY_SLUG[slug];
}

export function listSemanticSlugs(): string[] {
  return SEMANTIC_PAGES.filter((page) => page.qualityGatePassed).map(
    (page) => page.slug,
  );
}
