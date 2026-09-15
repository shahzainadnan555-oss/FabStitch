import { cache } from "react";
import { ApiError } from "@/lib/api/errors";
import { serverApi } from "@/lib/api/server";
import type {
  BestFor,
  BestForCard,
  Collection,
  CollectionCard,
  Discovery,
  Fabric,
  FabricCard,
  FabricFilter,
  FabricFilters,
  FabricPage,
  Recommendation,
  RecommendationPage,
} from "@/lib/api/types";
import { CATALOG_COLLECTION_CARDS } from "@/catalog/discovery";
import { MEDIA_BY_FABRIC_SLUG } from "@/catalog/media";
import {
  BACKEND_CATALOG_SORTS,
  formatCatalogMeasurement,
  isCustomerCatalogSort,
  type CatalogMeasurement,
  type CustomerCatalogSort,
} from "@/lib/customer-catalog-presentation";

export {
  BACKEND_CATALOG_SORTS,
  formatCatalogMeasurement,
  isCustomerCatalogSort,
  type CatalogMeasurement,
  type CustomerCatalogSort,
};

export type CustomerCatalogFabric = {
  id: string;
  slug: string;
  name: string;
  aliases: readonly string[];
  family: { slug: string; label: string };
  collection: { slug: string; label: string };
  seasons: readonly string[];
  summary?: string;
  description?: string;
  composition: readonly string[];
  measurements: readonly CatalogMeasurement[];
  construction: readonly string[];
  characteristics: readonly string[];
  applications: readonly { slug: string; label: string }[];
  bestFor: readonly { slug: string; label: string }[];
  media: {
    status: "final" | "placeholder";
    src?: string;
    alt?: string;
  };
  fabstitchVerified?: boolean;
  seo?: {
    title?: string;
    description?: string;
    canonicalPath?: string;
    indexable: boolean;
  };
  commercial?: {
    listingSlug: string;
    minimum: number;
    minimumUnit: "kg" | "m" | "yard" | "piece" | "roll";
    currency?: string;
  };
};

type MultiValue = string | readonly string[];

export type CustomerCatalogQuery = {
  q?: string;
  cursor?: string;
  /** Legacy compatibility only. Public routes use opaque cursors. */
  page?: number;
  limit?: number;
  sort?: CustomerCatalogSort;
  family?: MultiValue;
  fiber?: MultiValue;
  fiberPure?: MultiValue;
  construction?: MultiValue;
  color?: MultiValue;
  pattern?: MultiValue;
  finish?: MultiValue;
  texture?: MultiValue;
  season?: MultiValue;
  application?: MultiValue;
  bestFor?: MultiValue;
  collection?: MultiValue;
  stretch?: MultiValue;
  weightClass?: MultiValue;
  weightMin?: number;
  weightMax?: number;
  widthMin?: number;
  widthMax?: number;
};

export type CatalogFacetBucket = {
  value: string;
  label: string;
  count?: number;
};

export type CustomerCatalogFacets = {
  family: CatalogFacetBucket[];
  fiber: CatalogFacetBucket[];
  construction: CatalogFacetBucket[];
  color: CatalogFacetBucket[];
  pattern: CatalogFacetBucket[];
  finish: CatalogFacetBucket[];
  texture: CatalogFacetBucket[];
  season: CatalogFacetBucket[];
  application: CatalogFacetBucket[];
  bestFor: CatalogFacetBucket[];
  collection: CatalogFacetBucket[];
  stretch: CatalogFacetBucket[];
  weightClass: CatalogFacetBucket[];
  sorts: CustomerCatalogSort[];
  gsmRange: [number, number] | null;
  widthRange: [number, number] | null;
  semantics: Record<string, string>;
};

export type CustomerCatalogResults = {
  items: CustomerCatalogFabric[];
  total: number;
  totalKnown: boolean;
  totalPages: number | null;
  pageSize: number;
  hasMore: boolean;
  nextCursor: string | null;
  sort: string | null;
  facets: CustomerCatalogFacets;
};

export type CustomerCatalogDetail = {
  fabric: CustomerCatalogFabric;
  related: CustomerCatalogFabric[];
};

export type CustomerCollectionCard = {
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
  fabricCount: number;
};

export type CustomerCollectionDetail = CustomerCollectionCard & {
  seoTitle?: string;
  seoDescription?: string;
  fabrics: CustomerCatalogFabric[];
  total: number | null;
  pageSize: number;
  hasMore: boolean;
  nextCursor: string | null;
};

export type CustomerBestForCard = {
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
  fabricCount: number;
};

export type CustomerBestForDetail = CustomerBestForCard & {
  fabrics: CustomerCatalogFabric[];
  total: number | null;
  pageSize: number;
  hasMore: boolean;
  nextCursor: string | null;
};

export type HomepageDiscovery = {
  personalized: boolean;
  recommended: CustomerCatalogFabric[];
  sections: {
    key: string;
    title: string;
    items: CustomerCatalogFabric[];
  }[];
};

type DiscoveryFabric = Recommendation["fabric"];

const EMPTY_FACETS: CustomerCatalogFacets = {
  family: [],
  fiber: [],
  construction: [],
  color: [],
  pattern: [],
  finish: [],
  texture: [],
  season: [],
  application: [],
  bestFor: [],
  collection: [],
  stretch: [],
  weightClass: [],
  sorts: [...BACKEND_CATALOG_SORTS],
  gsmRange: null,
  widthRange: null,
  semantics: {},
};

function text(value: string | null | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function labelFor(code: string): string {
  return code
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function references(values: readonly string[] | undefined) {
  return (values ?? []).map((slug) => ({ slug, label: labelFor(slug) }));
}

function collectionReference(values: readonly string[] | undefined) {
  const slug = values?.[0];
  return slug
    ? { slug, label: labelFor(slug) }
    : { slug: "", label: "Fabric catalog" };
}

function approvedFabricMedia(slug: string | undefined) {
  if (!slug) return undefined;
  const media = MEDIA_BY_FABRIC_SLUG[slug];
  const src = text(media?.src);
  if (!src) return undefined;
  return { src, alt: text(media?.alt) };
}

function approvedCollectionImage(slug: string) {
  const card = CATALOG_COLLECTION_CARDS.find(
    (collection) => collection.slug === slug,
  );
  return approvedFabricMedia(card?.representativeFabric);
}

function media(
  value: FabricCard["primary_image"] | Fabric["primary_image"] | undefined,
  slug?: string,
) {
  const approved = approvedFabricMedia(slug);
  const src = text(value?.url) ?? approved?.src;
  return {
    status: src ? ("final" as const) : ("placeholder" as const),
    src,
    alt: text(value?.alt_text) ?? approved?.alt,
  };
}

function measurements(fabric: Fabric): CatalogMeasurement[] {
  const result: CatalogMeasurement[] = [];
  const weightMin = numberValue(fabric.weight_gsm_min);
  const weightMax = numberValue(fabric.weight_gsm_max);
  if (weightMin !== undefined || weightMax !== undefined) {
    result.push({
      ...(weightMin === weightMax && weightMin !== undefined
        ? { exact: weightMin }
        : { min: weightMin, max: weightMax }),
      unit: "gsm",
    });
  }
  const width = numberValue(fabric.width_cm);
  if (width !== undefined) result.push({ exact: width, unit: "cm" });
  return result;
}

function numberValue(value: string | null | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function cardToCustomerFabric(fabric: FabricCard): CustomerCatalogFabric {
  return {
    id: fabric.id,
    slug: fabric.slug,
    name: fabric.name,
    aliases: [],
    family: { slug: fabric.family_code, label: fabric.family_name },
    collection: collectionReference(fabric.collection_slugs),
    seasons: [],
    summary: text(fabric.summary),
    composition: [],
    measurements: [],
    construction: [],
    characteristics: fabric.weight_class ? [labelFor(fabric.weight_class)] : [],
    applications: [],
    bestFor: references(fabric.best_for),
    media: media(fabric.primary_image, fabric.slug),
    fabstitchVerified: fabric.fabstitch_verified,
  };
}

function detailToCustomerFabric(fabric: Fabric): CustomerCatalogFabric {
  return {
    id: fabric.id,
    slug: fabric.slug,
    name: fabric.name,
    aliases: fabric.aliases ?? [],
    family: { slug: fabric.family_code, label: fabric.family_name },
    collection: collectionReference(fabric.collections),
    seasons: fabric.seasons ?? [],
    summary: text(fabric.summary),
    description: text(fabric.description),
    composition: (fabric.composition ?? []).map(
      (part) => text(part.raw_label) ?? text(part.fiber_name) ?? "Unspecified",
    ),
    measurements: measurements(fabric),
    construction: fabric.constructions ?? [],
    characteristics: [
      ...(fabric.characteristics ?? []),
      ...(fabric.finishes ?? []),
      ...(fabric.textures ?? []),
    ],
    applications: references(fabric.applications),
    bestFor: references(fabric.best_for),
    media: media(fabric.primary_image, fabric.slug),
    fabstitchVerified: fabric.fabstitch_verified,
    seo: {
      title: text(fabric.seo_title),
      description: text(fabric.seo_meta_description),
      canonicalPath: text(fabric.seo_canonical_path),
      indexable: fabric.is_indexable,
    },
  };
}

function discoveryToCustomerFabric(
  fabric: DiscoveryFabric,
): CustomerCatalogFabric {
  const family = fabric.fabric_family_codes?.[0] ?? "";
  const approved = approvedFabricMedia(fabric.slug);
  const src = text(fabric.primary_image_url) ?? approved?.src;
  return {
    id: fabric.id,
    slug: fabric.slug,
    name: fabric.name,
    aliases: [],
    family: {
      slug: family,
      label: family ? labelFor(family) : "Fabric",
    },
    collection: { slug: "", label: "Fabric catalog" },
    seasons: [],
    summary: text(fabric.summary),
    composition: [],
    measurements: [],
    construction: [],
    characteristics: [],
    applications: [],
    bestFor: references(fabric.use_case_codes),
    media: {
      status: src ? ("final" as const) : ("placeholder" as const),
      src,
      alt: approved?.alt,
    },
  };
}

function queryForFabrics(query: CustomerCatalogQuery) {
  return {
    q: query.q,
    limit: Math.min(Math.max(query.limit ?? 24, 1), 48),
    cursor: query.cursor,
    sort: query.sort,
    family: multiple(query.family),
    fiber: multiple(query.fiber),
    fiber_pure: multiple(query.fiberPure),
    construction: multiple(query.construction),
    color: multiple(query.color),
    pattern: multiple(query.pattern),
    finish: multiple(query.finish),
    texture: multiple(query.texture),
    season: multiple(query.season),
    application: multiple(query.application),
    best_for: multiple(query.bestFor),
    collection: multiple(query.collection),
    stretch: multiple(query.stretch),
    weight_class: multiple(query.weightClass),
    weight_min: query.weightMin,
    weight_max: query.weightMax,
    width_min: query.widthMin,
    width_max: query.widthMax,
  };
}

function queryForFilters(query: CustomerCatalogQuery) {
  return {
    q: query.q,
    family: multiple(query.family),
    fiber: multiple(query.fiber),
    construction: multiple(query.construction),
    color: multiple(query.color),
    pattern: multiple(query.pattern),
    finish: multiple(query.finish),
    texture: multiple(query.texture),
    season: multiple(query.season),
    application: multiple(query.application),
    best_for: multiple(query.bestFor),
    collection: multiple(query.collection),
    stretch: multiple(query.stretch),
    weight_min: query.weightMin,
    weight_max: query.weightMax,
    width_min: query.widthMin,
    width_max: query.widthMax,
  };
}

function multiple(
  value: MultiValue | undefined,
): readonly string[] | undefined {
  if (!value) return undefined;
  return typeof value === "string" ? [value] : value;
}

function facetBuckets(
  values: FabricFilter[] | undefined,
): CatalogFacetBucket[] {
  return (values ?? []).map((value) => ({
    value: value.code,
    label: value.label,
    count: value.count ?? undefined,
  }));
}

function range(
  ranges: FabricFilters["ranges"],
  keys: readonly string[],
): [number, number] | null {
  for (const key of keys) {
    const value = ranges?.[key];
    const min = numberValue(value?.min);
    const max = numberValue(value?.max);
    if (min !== undefined && max !== undefined) return [min, max];
  }
  return null;
}

function filtersToFacets(filters: FabricFilters): CustomerCatalogFacets {
  const sorts = (filters.sorts ?? []).filter(isCustomerCatalogSort);
  return {
    family: facetBuckets(filters.families),
    fiber: facetBuckets(filters.fibers),
    construction: facetBuckets(filters.constructions),
    color: facetBuckets(filters.colors),
    pattern: facetBuckets(filters.patterns),
    finish: facetBuckets(filters.finishes),
    texture: facetBuckets(filters.textures),
    season: facetBuckets(filters.seasons),
    application: facetBuckets(filters.applications),
    bestFor: facetBuckets(filters.best_for),
    collection: facetBuckets(filters.collections),
    stretch: facetBuckets(filters.stretch),
    weightClass: facetBuckets(filters.weight_classes),
    sorts: sorts.length ? sorts : [...BACKEND_CATALOG_SORTS],
    gsmRange: range(filters.ranges, ["weight_gsm", "weight"]),
    widthRange: range(filters.ranges, ["width_cm", "width"]),
    semantics: filters.semantics ?? {},
  };
}

function pageToResults(
  page: FabricPage,
  facets: CustomerCatalogFacets = EMPTY_FACETS,
): CustomerCatalogResults {
  const totalKnown = page.total !== undefined && page.total !== null;
  const total = page.total ?? page.items.length;
  return {
    items: page.items.map(cardToCustomerFabric),
    total,
    totalKnown,
    totalPages: totalKnown ? Math.ceil(total / Math.max(page.limit, 1)) : null,
    pageSize: Math.min(page.limit, 48),
    hasMore: page.has_more,
    nextCursor: page.next_cursor ?? null,
    sort: page.sort ?? null,
    facets,
  };
}

export async function searchCustomerCatalog(
  query: CustomerCatalogQuery = {},
): Promise<CustomerCatalogResults> {
  const listPath = query.q?.trim() ? "/fabrics/search" : "/fabrics";
  const pagePromise = serverApi.get<FabricPage>(listPath, {
    query: queryForFabrics(query),
  });
  const filtersPromise = serverApi
    .get<FabricFilters>("/fabrics/filters", {
      query: queryForFilters(query),
    })
    .catch(() => null);

  const [page, filters] = await Promise.all([pagePromise, filtersPromise]);
  return pageToResults(page, filters ? filtersToFacets(filters) : EMPTY_FACETS);
}

export async function listCustomerCatalog(
  query: CustomerCatalogQuery = {},
): Promise<CustomerCatalogResults> {
  const page = await serverApi.get<FabricPage>(
    query.q?.trim() ? "/fabrics/search" : "/fabrics",
    { query: queryForFabrics(query) },
  );
  return pageToResults(page);
}

export const getCustomerCatalogFabric = cache(
  async (slug: string): Promise<CustomerCatalogDetail | null> => {
    try {
      const fabric = await serverApi.get<Fabric>(
        `/fabrics/${encodeURIComponent(slug)}`,
      );
      const related = await serverApi
        .get<FabricCard[]>(`/fabrics/${encodeURIComponent(slug)}/related`, {
          query: { limit: 6 },
        })
        .catch(() => [] as FabricCard[]);
      return {
        fabric: detailToCustomerFabric(fabric),
        related: related.map(cardToCustomerFabric),
      };
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },
);

export async function getCustomerCatalogFabrics(
  slugs: readonly string[],
): Promise<CustomerCatalogFabric[]> {
  const results = await Promise.all(slugs.map(getCustomerCatalogFabric));
  return results
    .filter((result): result is CustomerCatalogDetail => result !== null)
    .map((result) => result.fabric);
}

export async function getCustomerCollections(): Promise<
  CustomerCollectionCard[]
> {
  try {
    const collections = await serverApi.get<CollectionCard[]>("/collections");
    return collections.map((collection) => ({
      slug: collection.slug,
      name: collection.name,
      description: text(collection.description),
      imageUrl:
        text(collection.image_url) ??
        approvedCollectionImage(collection.slug)?.src,
      fabricCount: collection.fabric_count,
    }));
  } catch {
    return [];
  }
}

export const getCustomerCollection = cache(
  async (
    slug: string,
    query: Pick<CustomerCatalogQuery, "cursor" | "limit" | "sort"> = {},
  ): Promise<CustomerCollectionDetail | null> => {
    try {
      const collection = await serverApi.get<Collection>(
        `/collections/${encodeURIComponent(slug)}`,
        {
          query: {
            cursor: query.cursor,
            limit: Math.min(Math.max(query.limit ?? 24, 1), 48),
            sort: query.sort,
          },
        },
      );
      return {
        slug: collection.slug,
        name: collection.name,
        description: text(collection.description),
        imageUrl:
          text(collection.image_url) ??
          approvedCollectionImage(collection.slug)?.src,
        fabricCount: collection.total ?? collection.fabrics?.length ?? 0,
        seoTitle: text(collection.seo_title),
        seoDescription: text(collection.seo_meta_description),
        fabrics: (collection.fabrics ?? []).map(cardToCustomerFabric),
        total: collection.total ?? null,
        pageSize: Math.min(collection.page_size || collection.limit, 48),
        hasMore: collection.has_more,
        nextCursor: collection.next_cursor ?? null,
      };
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },
);

export async function getCustomerBestFor(): Promise<CustomerBestForCard[]> {
  try {
    const items = await serverApi.get<BestForCard[]>("/best-for");
    return items.map((item) => ({
      slug: item.slug,
      name: item.name,
      description: text(item.description),
      imageUrl: text(item.image_url),
      fabricCount: item.fabric_count,
    }));
  } catch {
    return [];
  }
}

export const getCustomerBestForDetail = cache(
  async (
    slug: string,
    query: Pick<CustomerCatalogQuery, "cursor" | "limit" | "sort"> = {},
  ): Promise<CustomerBestForDetail | null> => {
    try {
      const item = await serverApi.get<BestFor>(
        `/best-for/${encodeURIComponent(slug)}`,
        {
          query: {
            cursor: query.cursor,
            limit: Math.min(Math.max(query.limit ?? 24, 1), 48),
            sort: query.sort,
          },
        },
      );
      return {
        slug: item.slug,
        name: item.name,
        description: text(item.description),
        imageUrl: text(item.image_url),
        fabricCount: item.total ?? item.fabrics?.length ?? 0,
        fabrics: (item.fabrics ?? []).map(cardToCustomerFabric),
        total: item.total ?? null,
        pageSize: Math.min(item.page_size || item.limit, 48),
        hasMore: item.has_more,
        nextCursor: item.next_cursor ?? null,
      };
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },
);

export async function getCustomerRecommendations(
  query: { limit?: number; offset?: number } = {},
): Promise<CustomerCatalogFabric[]> {
  try {
    const page = await serverApi.get<RecommendationPage>(
      "/me/recommendations",
      {
        query: {
          limit: Math.min(Math.max(query.limit ?? 12, 1), 48),
          offset: query.offset ?? 0,
        },
      },
    );
    return page.items.map((item) => discoveryToCustomerFabric(item.fabric));
  } catch {
    return [];
  }
}

export async function listPublishedCustomerCatalog(
  query: Pick<CustomerCatalogQuery, "sort"> = {},
): Promise<CustomerCatalogFabric[]> {
  try {
    const items: CustomerCatalogFabric[] = [];
    let cursor: string | undefined;
    do {
      const page = await listCustomerCatalog({
        sort: query.sort ?? "name_asc",
        limit: 48,
        cursor,
      });
      items.push(...page.items);
      cursor = page.hasMore && page.nextCursor ? page.nextCursor : undefined;
    } while (cursor && items.length < 2000);
    return items;
  } catch {
    return [];
  }
}

export async function getHomepageDiscovery(): Promise<HomepageDiscovery> {
  try {
    const [discovery, recommended] = await Promise.all([
      serverApi.get<Discovery>("/me/discovery"),
      getCustomerRecommendations({ limit: 12 }),
    ]);
    const fromDiscovery = discovery.recommended_fabrics.map((item) =>
      discoveryToCustomerFabric(item.fabric),
    );
    return {
      personalized: discovery.personalized,
      recommended: fromDiscovery.length ? fromDiscovery : recommended,
      sections: (discovery.sections ?? []).map((section) => ({
        key: section.key,
        title: section.title,
        items: section.items.map((item) =>
          discoveryToCustomerFabric(item.fabric),
        ),
      })),
    };
  } catch {
    return {
      personalized: false,
      recommended: [],
      sections: [],
    };
  }
}
