import type { FabricListing } from "@/domain/types";

export type BuyerFabricListing = Omit<FabricListing, "supplier">;

export function toBuyerFabricListing(
  listing: FabricListing,
): BuyerFabricListing {
  const { supplier: _supplier, ...fabric } = listing;
  return fabric;
}

export function toBuyerFabricListings(
  listings: FabricListing[],
): BuyerFabricListing[] {
  return listings.map(toBuyerFabricListing);
}
