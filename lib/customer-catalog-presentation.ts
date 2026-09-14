export type CatalogMeasurement = {
  exact?: number;
  min?: number;
  max?: number;
  unit: string;
  qualifier?: string;
};

export type CustomerCatalogSort =
  | "relevance"
  | "featured"
  | "popular"
  | "newest"
  | "name"
  | "name_asc"
  | "name_desc"
  | "editorial";

export const BACKEND_CATALOG_SORTS = [
  "relevance",
  "featured",
  "popular",
  "newest",
  "name",
  "name_asc",
  "name_desc",
  "editorial",
] as const satisfies readonly CustomerCatalogSort[];

export const CUSTOMER_CATALOG_SORT_LABELS: Record<CustomerCatalogSort, string> =
  {
    relevance: "Most relevant",
    featured: "Featured",
    popular: "Most popular",
    newest: "Newest",
    name: "Name, A–Z",
    name_asc: "Name, A–Z",
    name_desc: "Name, Z–A",
    editorial: "Editorial order",
  };

export const CUSTOMER_CATALOG_SORT_OPTIONS = BACKEND_CATALOG_SORTS.map(
  (value) => ({
    value,
    label: CUSTOMER_CATALOG_SORT_LABELS[value],
  }),
);

const BACKEND_SORT_SET = new Set<string>(BACKEND_CATALOG_SORTS);

export function isCustomerCatalogSort(
  value: string | undefined,
): value is CustomerCatalogSort {
  return Boolean(value && BACKEND_SORT_SET.has(value));
}

export function formatCatalogMeasurement(
  measurement: CatalogMeasurement,
): string {
  const value =
    measurement.exact !== undefined
      ? `${measurement.exact}`
      : measurement.min !== undefined && measurement.max !== undefined
        ? `${measurement.min}–${measurement.max}`
        : measurement.min !== undefined
          ? `${measurement.min}+`
          : measurement.max !== undefined
            ? `Up to ${measurement.max}`
            : "";
  return [value, measurement.unit, measurement.qualifier]
    .filter(Boolean)
    .join(" ");
}
