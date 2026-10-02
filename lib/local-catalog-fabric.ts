import { FABRICS_2027, approvedFabric, isApprovedFabricSlug } from "@/catalog";
import { catalogFabricToCustomer } from "@/lib/best-for-resolve";
import type {
  CustomerCatalogDetail,
  CustomerCatalogFabric,
} from "@/repositories/customer-catalog";
import { fabricSeoDescription } from "@/lib/storefront-metadata";

/**
 * Local 2027 catalog as a customer fabric record.
 *
 * Fabric PDPs must not depend on a live API response to remain legitimate
 * public pages. Empty 200 shells during API timeouts were the crawl failure.
 */
export function localCustomerFabric(
  slug: string,
): CustomerCatalogFabric | null {
  if (!isApprovedFabricSlug(slug)) return null;
  const source = approvedFabric(slug);
  if (!source) return null;
  const card = catalogFabricToCustomer(source);
  const fabric: CustomerCatalogFabric = {
    ...card,
    summary:
      "summary" in source && typeof source.summary === "string"
        ? source.summary
        : undefined,
    description:
      "description" in source && typeof source.description === "string"
        ? source.description
        : undefined,
    seo: {
      title: source.name,
      canonicalPath: `/fabrics/${source.slug}/`,
      indexable: true,
    },
  };
  if (!fabric.description) {
    fabric.description = fabricSeoDescription(fabric);
  }
  return fabric;
}

export function localCatalogFabricDetail(
  slug: string,
): CustomerCatalogDetail | null {
  const fabric = localCustomerFabric(slug);
  if (!fabric) return null;
  const related = FABRICS_2027.filter(
    (item) =>
      item.slug !== fabric.slug && item.collection === fabric.collection.slug,
  )
    .slice(0, 6)
    .map((item) => localCustomerFabric(item.slug))
    .filter((item): item is CustomerCatalogFabric => item !== null);
  return { fabric, related };
}

export function approvedFabricStaticParams(): { path: string[] }[] {
  return FABRICS_2027.map((fabric) => ({ path: [fabric.slug] }));
}
