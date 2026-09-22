/**
 * Pure Best For SEO helpers (no server API imports).
 */
import {
  BEST_FOR_BY_SLUG,
  COLLECTION_BY_SLUG,
  MEDIA_BY_FABRIC_SLUG,
  SEO_USE_CASE_BY_SLUG,
  SOURCE_FAMILY_BY_SLUG,
  fabricsForUseCase,
  type SeoUseCase,
} from "@/catalog";
import type { Fabric2027 } from "@/catalog/fabrics-2027";

/** Minimal card shape for Best For grids (matches CustomerCatalogFabric fields used). */
export type BestForFabricCard = {
  id: string;
  slug: string;
  name: string;
  aliases: readonly string[];
  family: { slug: string; label: string };
  collection: { slug: string; label: string };
  seasons: readonly string[];
  composition: readonly string[];
  measurements: readonly {
    unit: string;
    min?: number;
    max?: number;
    exact?: number;
    qualifier?: string;
  }[];
  construction: readonly string[];
  characteristics: readonly string[];
  applications: readonly { slug: string; label: string }[];
  bestFor: readonly { slug: string; label: string }[];
  media: {
    status: "final" | "placeholder";
    src?: string;
    alt?: string;
  };
};

export type LocalBestForDetail = {
  slug: string;
  name: string;
  description: string;
  editorial: SeoUseCase;
  marketplaceBestForSlug: string;
  fabrics: BestForFabricCard[];
  total: number;
  pageSize: number;
};

/** Candidate API slugs for a Best For URL segment. */
export function bestForApiCandidates(seoSlug: string): string[] {
  const editorial =
    SEO_USE_CASE_BY_SLUG[seoSlug as keyof typeof SEO_USE_CASE_BY_SLUG];
  const candidates = [seoSlug];
  if (editorial) {
    for (const application of editorial.applicationSlugs) {
      if (!candidates.includes(application)) candidates.push(application);
    }
  }
  return candidates;
}

export function catalogFabricToCustomer(fabric: Fabric2027): BestForFabricCard {
  const collection = COLLECTION_BY_SLUG[fabric.collection];
  const family = SOURCE_FAMILY_BY_SLUG[fabric.family];
  const media = MEDIA_BY_FABRIC_SLUG[fabric.slug];
  const src = media?.status === "final" ? media.src : undefined;
  const measurements =
    "measurements" in fabric && fabric.measurements
      ? fabric.measurements.map((item) => {
          const row: {
            unit: string;
            min?: number;
            max?: number;
            exact?: number;
            qualifier?: string;
          } = { unit: item.unit };
          if ("min" in item && typeof item.min === "number") row.min = item.min;
          if ("max" in item && typeof item.max === "number") row.max = item.max;
          if ("exact" in item && typeof item.exact === "number")
            row.exact = item.exact;
          if ("qualifier" in item && typeof item.qualifier === "string")
            row.qualifier = item.qualifier;
          return row;
        })
      : [];
  return {
    id: fabric.id,
    slug: fabric.slug,
    name: fabric.name,
    aliases: [],
    family: {
      slug: family?.slug ?? fabric.family,
      label: family?.label ?? fabric.family,
    },
    collection: {
      slug: collection?.slug ?? fabric.collection,
      label: collection?.label ?? fabric.collection,
    },
    seasons: fabric.seasons ?? [],
    composition: "composition" in fabric ? (fabric.composition ?? []) : [],
    measurements,
    construction:
      "construction" in fabric ? [...(fabric.construction ?? [])] : [],
    characteristics:
      "characteristics" in fabric ? [...(fabric.characteristics ?? [])] : [],
    applications: fabric.applications.map((slug) => ({
      slug,
      label: BEST_FOR_BY_SLUG[slug]?.label ?? slug,
    })),
    bestFor: fabric.applications.map((slug) => ({
      slug,
      label: BEST_FOR_BY_SLUG[slug]?.label ?? slug,
    })),
    media: {
      status: src ? "final" : "placeholder",
      src,
      alt: media && "alt" in media ? media.alt : undefined,
    },
  };
}

export function localBestForDetail(seoSlug: string): LocalBestForDetail | null {
  const editorial =
    SEO_USE_CASE_BY_SLUG[seoSlug as keyof typeof SEO_USE_CASE_BY_SLUG];
  if (!editorial) return null;
  const fabrics = fabricsForUseCase(editorial).map(catalogFabricToCustomer);
  return {
    slug: editorial.slug,
    name: editorial.label,
    description: editorial.description,
    editorial,
    marketplaceBestForSlug: editorial.applicationSlugs[0] ?? seoSlug,
    fabrics,
    total: fabrics.length,
    pageSize: Math.max(fabrics.length, 1),
  };
}
