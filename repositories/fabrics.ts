import type { FabricListing } from "@/domain/types";

/**
 * Legacy listing-shaped contract retained for workspace and redirected page
 * compatibility. The customer catalogue uses `customer-catalog.ts`; no local
 * product is coerced into a supplier listing with invented MOQ or supplier.
 */
export type FabricQuery = {
  q?: string;
  material?: string;
  composition?: string;
  fabric_type?: string;
  construction?: string;
  use_case?: string;
  buyer_type?: string;
  buyer_section?: string;
  supplier?: string;
  fabric?: string;
  gsm_min?: number;
  gsm_max?: number;
  moq_max?: number;
  price_min?: number;
  price_max?: number;
  country_code?: string;
  certification?: string[];
  stretch?: boolean;
  sample_available?: boolean;
  verified_supplier?: boolean;
  stock_status?: string;
  sort?: FabricSort;
  page?: number;
  page_size?: number;
};

export type FabricSort =
  | "relevance"
  | "newest"
  | "gsm_asc"
  | "gsm_desc"
  | "moq_asc"
  | "price_asc"
  | "price_desc"
  | "lead_time_asc";

export const SORT_OPTIONS: { value: FabricSort; label: string }[] = [
  { value: "relevance", label: "Most relevant" },
  { value: "newest", label: "Newest" },
];

export function isFabricSort(value: string | undefined): value is FabricSort {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export type FacetBucket = { value: string; label: string; count: number };
export type Facets = {
  material: FacetBucket[];
  construction: FacetBucket[];
  country: FacetBucket[];
  certification: FacetBucket[];
  stock: FacetBucket[];
  gsmRange: [number, number] | null;
  moqRange: [number, number] | null;
};

export type FabricResults = {
  items: FabricListing[];
  total: number;
  page: number;
  pageSize: number;
  facets: Facets;
};

const EMPTY_FACETS: Facets = {
  material: [],
  construction: [],
  country: [],
  certification: [],
  stock: [],
  gsmRange: null,
  moqRange: null,
};

export async function listFabrics(
  query: FabricQuery = {},
): Promise<FabricResults> {
  return {
    items: [],
    total: 0,
    page: query.page ?? 1,
    pageSize: query.page_size ?? 24,
    facets: EMPTY_FACETS,
  };
}

export async function listAllFabrics(
  _query: Omit<FabricQuery, "page" | "page_size"> = {},
): Promise<FabricListing[]> {
  return [];
}

export async function getFabric(
  _slug: string,
): Promise<FabricListing | null> {
  return null;
}

export async function getFabricsByIds(
  _ids: string[],
): Promise<FabricListing[]> {
  return [];
}
