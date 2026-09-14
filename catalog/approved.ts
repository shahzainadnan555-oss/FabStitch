import {
  FABRIC_2027_BY_SLUG,
  FABRICS_2027,
  type Fabric2027,
  type Fabric2027Slug,
} from "./fabrics-2027";

/**
 * The customer-facing product boundary.
 *
 * This is deliberately derived from the source-backed 2027 catalog instead of
 * being a second hand-maintained array. Backend records, fixtures and route
 * parameters are displayable as products only when their canonical slug is in
 * this set.
 */
export const APPROVED_FABRIC_SLUGS = Object.freeze(
  FABRICS_2027.map((fabric) => fabric.slug),
) as readonly Fabric2027Slug[];

const APPROVED_FABRIC_SLUG_SET = new Set<string>(APPROVED_FABRIC_SLUGS);

export function isApprovedFabricSlug(value: string): value is Fabric2027Slug {
  return APPROVED_FABRIC_SLUG_SET.has(value);
}

export function approvedFabric(value: string): Fabric2027 | undefined {
  return isApprovedFabricSlug(value) ? FABRIC_2027_BY_SLUG[value] : undefined;
}
