"use client";

import { FabricCatalogueCard } from "@/components/marketplace/fabric-card";
import type { CustomerCatalogFabric } from "@/repositories/customer-catalog";

/**
 * Keeps the established grid layout while preserving the backend's order.
 * Personalization is applied by the catalog service, never re-ranked locally.
 */
export function PersonalizedCatalogGrid({
  fabrics,
  columns = "marketplace",
}: {
  fabrics: CustomerCatalogFabric[];
  columns?: "marketplace" | "featured";
}) {
  return (
    <div
      className={
        columns === "featured"
          ? "grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid gap-x-5 gap-y-7 sm:grid-cols-2 xl:grid-cols-3"
      }
    >
      {fabrics.map((fabric, index) => (
        <FabricCatalogueCard
          key={fabric.id}
          fabric={fabric}
          priority={columns === "marketplace" && index === 0}
        />
      ))}
    </div>
  );
}
