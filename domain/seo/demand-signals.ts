import type { FabricListing } from "@/domain/types";
import { FABRIC_NODES, getFabric } from "@/domain/taxonomy/fabrics";
import { APPLICATIONS } from "@/domain/taxonomy/applications";
import { FABRIC_LOOKUP } from "@/domain/taxonomy/fabrics";
import { buildCanonical } from "@/domain/taxonomy/resolve";

/**
 * Demand signals.
 *
 * A search that returns nothing is the most valuable event in a young
 * marketplace: it is a buyer telling you exactly what you failed to stock, in
 * their own words. Phase 3 §38 asked for the architecture to learn from that,
 * and §25 asks a zero-result search to become "a potential future
 * research/page/supply opportunity".
 *
 * Two halves, deliberately separated:
 *
 *   **Recorded demand** needs a backend to persist it, and there is no
 *   endpoint for it. The adapter below defines the contract and does nothing
 *   yet, rather than pretending the data is being kept.
 *
 *   **Supply gaps** need nothing. They are computable today, from entities the
 *   taxonomy already knows about that have no listings behind them. That is
 *   demand the site is *structurally* failing to serve, and it is why the
 *   zero-result page can offer something better than a generic link list.
 */

/* ==========================================================================
   Recorded demand - awaiting a backend
   ========================================================================== */

export type ZeroResultEvent = {
  query: string;
  /** Entities the deterministic parser recognised, if any. */
  resolved: { fabric?: string; application?: string; gsm?: number };
  /** Filters applied when the result set came back empty. */
  filters: Record<string, string | undefined>;
  at: string;
};

/**
 * Records a search that returned nothing.
 *
 * **Not implemented, and deliberately not faked.** The live OpenAPI has no
 * endpoint for search telemetry - no `/analytics`, no `/search/events` - and
 * inventing one would make this look solved when nothing is being kept.
 *
 * Backend dependency: a write endpoint accepting `ZeroResultEvent`. Until it
 * exists this is a no-op with a stable signature, so wiring it up later
 * changes one function body and no call site.
 */
export async function recordZeroResult(event: ZeroResultEvent): Promise<void> {
  // Intentionally does not persist. Logged in development so the signal is at
  // least visible while the endpoint is missing; silent in production rather
  // than filling logs with data nothing consumes.
  if (process.env.NODE_ENV === "development") {
    console.info("[fabstitch] zero-result search", event.query);
  }
}

/* ==========================================================================
   Supply gaps - computable now
   ========================================================================== */

export type SupplyGap = {
  kind: "fabric" | "application";
  slug: string;
  name: string;
  /** Where a buyer would land. The page exists; the inventory does not. */
  path: string;
  listingCount: number;
};

/**
 * Entities the marketplace describes but cannot supply.
 *
 * Every one of these is a page that renders, ranks for nothing, and disappoints
 * a buyer who reaches it. Listing them is how the gap becomes a sourcing target
 * rather than an invisible hole.
 */
export function supplyGaps(listings: FabricListing[]): SupplyGap[] {
  const gaps: SupplyGap[] = [];

  for (const node of FABRIC_NODES) {
    const names = [node.name.toLowerCase(), ...(node.aliases ?? [])];
    const count = listings.filter((listing) => {
      const haystack =
        `${listing.material} ${listing.construction ?? ""} ${listing.name}`.toLowerCase();
      return names.some((name) => haystack.includes(name));
    }).length;
    if (count === 0) {
      gaps.push({
        kind: "fabric",
        slug: node.slug,
        name: node.name,
        path: buildCanonical(node),
        listingCount: 0,
      });
    }
  }

  for (const application of APPLICATIONS) {
    const count = listings.filter((l) =>
      l.applications?.includes(application.slug),
    ).length;
    if (count === 0) {
      gaps.push({
        kind: "application",
        slug: application.slug,
        name: application.name,
        path: `/applications/${application.slug}/`,
        listingCount: 0,
      });
    }
  }

  return gaps;
}

/* ==========================================================================
   Closest alternatives - what a zero-result page should actually offer
   ========================================================================== */

export type Alternative = {
  label: string;
  href: string;
  hint: string;
};

/**
 * The nearest thing the marketplace *can* supply.
 *
 * §25 asks a zero-result page to show "closest relevant fabrics" rather than a
 * generic list. Closeness is measured against the query's own words using the
 * taxonomy's alias table - the same deterministic lookup the parser uses, so
 * the suggestions are explainable and no model is involved.
 *
 * Crucially it only ever suggests entities that **have listings**. Sending a
 * buyer from one empty page to another is worse than saying nothing.
 */
export function closestWithSupply(
  query: string,
  listings: FabricListing[],
  limit = 5,
): Alternative[] {
  const tokens = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);
  if (!tokens.length) return [];

  const counts = new Map<string, number>();
  for (const listing of listings) {
    const haystack =
      `${listing.material} ${listing.construction ?? ""} ${listing.name}`.toLowerCase();
    for (const entry of FABRIC_LOOKUP) {
      if (haystack.includes(entry.term)) {
        counts.set(entry.slug, (counts.get(entry.slug) ?? 0) + 1);
      }
    }
  }

  // Score a stocked fabric by how much of the query it shares.
  return [...counts.entries()]
    .map(([slug, count]) => {
      const node = getFabric(slug);
      if (!node) return null;
      const text =
        `${node.name} ${(node.aliases ?? []).join(" ")}`.toLowerCase();
      const overlap = tokens.filter((token) => text.includes(token)).length;
      return { node, count, overlap };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => b.overlap - a.overlap || b.count - a.count)
    .slice(0, limit)
    .map(({ node, count }) => ({
      label: node.name,
      href: buildCanonical(node),
      hint: `${count} ${count === 1 ? "listing" : "listings"} - ${node.summary}`,
    }));
}
