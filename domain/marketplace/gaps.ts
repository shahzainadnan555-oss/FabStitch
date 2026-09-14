import type { FabricListing } from "@/domain/types";
import { FABRIC_NODES, getFabric } from "@/domain/taxonomy/fabrics";
import { APPLICATIONS } from "@/domain/taxonomy/applications";
import {
  BUYER_SUBCATEGORIES,
  COUNTRIES,
  countrySlug,
} from "@/domain/taxonomy/buyers";
import { buildCanonical } from "@/domain/taxonomy/resolve";

/**
 * Marketplace gap analysis.
 *
 * Demand on one axis, supply on the other. Where they disagree is where the
 * next unit of work belongs, and *which kind* of work it is:
 *
 *   demand high, supply low   → acquire suppliers
 *   demand high, listings low → acquire listings from suppliers already here
 *   demand high, content weak → improve the page
 *   supply high, demand low   → the marketplace is unbalanced; market it
 *
 * The honest problem with this system today is the demand axis. FabStitch has
 * no search-volume data, no analytics and no traffic history, so "demand"
 * cannot be measured - only *structural* demand can: how many applications
 * need this fabric, how many buyer types make those applications. That is a
 * genuine signal (it is the taxonomy saying "many buyers need this") and it is
 * emphatically not a traffic estimate.
 *
 * `DemandBasis` is carried on every gap so no consumer can mistake one for the
 * other, and so the switch to real data later changes one function rather than
 * every caller.
 */

export type DemandBasis =
  /** Counted from taxonomy relationships. Available today. */
  | "structural"
  /** Counted from real on-site searches. Needs a search-events backend. */
  | "observed_search"
  /** Counted from external keyword volume. Needs a keyword dataset. */
  | "keyword_volume";

export type GapKind =
  | "supplier_acquisition"
  | "listing_acquisition"
  | "content_improvement"
  | "marketplace_balance";

export type Gap = {
  kind: GapKind;
  /** The entity this gap is about. */
  entity: {
    type: "fabric" | "application" | "country";
    slug: string;
    name: string;
  };
  path: string;
  demand: number;
  demandBasis: DemandBasis;
  /** How the demand number was arrived at, in words. Shown to a human. */
  demandExplanation: string;
  listings: number;
  suppliers: number;
  /** What to do about it. */
  action: string;
  /** Higher runs first. Derived, not assigned. */
  priority: number;
};

function listingsForFabric(
  listings: FabricListing[],
  slug: string,
): FabricListing[] {
  const node = getFabric(slug);
  if (!node) return [];
  const names = [node.name.toLowerCase(), ...(node.aliases ?? [])];
  return listings.filter((listing) => {
    const haystack =
      `${listing.material} ${listing.construction ?? ""} ${listing.name}`.toLowerCase();
    return names.some((name) => haystack.includes(name.toLowerCase()));
  });
}

/**
 * Structural demand for a fabric.
 *
 * How many applications name it, weighted by how many buyer types make those
 * applications. A fabric five buyer types need through three products is under
 * more real pressure than one nobody's product requires - and unlike a search
 * volume, this number is derived from data FabStitch actually holds.
 */
function fabricDemand(slug: string): { score: number; explanation: string } {
  const applications = APPLICATIONS.filter((a) =>
    a.typicalFabrics.includes(slug),
  );
  if (!applications.length) {
    return { score: 0, explanation: "no application names this fabric" };
  }

  const buyers = new Set<string>();
  for (const application of applications) {
    for (const buyer of BUYER_SUBCATEGORIES) {
      if (buyer.applications.includes(application.slug)) buyers.add(buyer.slug);
    }
  }

  return {
    score: applications.length * 2 + buyers.size,
    explanation: `${applications.length} application${applications.length === 1 ? "" : "s"} across ${buyers.size} buyer type${buyers.size === 1 ? "" : "s"}`,
  };
}

function applicationDemand(slug: string): {
  score: number;
  explanation: string;
} {
  const buyers = BUYER_SUBCATEGORIES.filter((b) =>
    b.applications.includes(slug),
  );
  return {
    score: buyers.length * 3,
    explanation: `${buyers.length} buyer type${buyers.length === 1 ? "" : "s"} manufacture this`,
  };
}

/* ==========================================================================
   The analysis
   ========================================================================== */

export function analyseGaps(listings: FabricListing[]): Gap[] {
  const gaps: Gap[] = [];

  /* -- Fabrics ------------------------------------------------------------ */

  for (const node of FABRIC_NODES) {
    const matched = listingsForFabric(listings, node.slug);
    const suppliers = new Set(matched.map((l) => l.supplier.slug)).size;
    const { score, explanation } = fabricDemand(node.slug);
    const path = buildCanonical(node);
    const entity = {
      type: "fabric" as const,
      slug: node.slug,
      name: node.name,
    };

    if (score > 0 && matched.length === 0) {
      gaps.push({
        kind: "supplier_acquisition",
        entity,
        path,
        demand: score,
        demandBasis: "structural",
        demandExplanation: explanation,
        listings: 0,
        suppliers: 0,
        action: `No supplier lists ${node.name.toLowerCase()}. Buyers reaching this page cannot source it here.`,
        priority: score * 3,
      });
      continue;
    }

    // Supply exists but too thin to publish: the gate's floor for a fabric
    // page is three listings from two suppliers.
    if (
      score > 0 &&
      matched.length > 0 &&
      (matched.length < 3 || suppliers < 2)
    ) {
      gaps.push({
        kind: "listing_acquisition",
        entity,
        path,
        demand: score,
        demandBasis: "structural",
        demandExplanation: explanation,
        listings: matched.length,
        suppliers,
        action:
          suppliers < 2
            ? `Only ${suppliers} supplier behind this page - one supplier makes it an advert, not a category.`
            : `${matched.length} listings; the page needs 3 to be worth indexing.`,
        priority: score * 2,
      });
      continue;
    }

    // Supply with no structural demand behind it. Not a defect - it may be a
    // real niche - but it is the marketplace growing on one side only.
    if (score === 0 && matched.length > 0) {
      gaps.push({
        kind: "marketplace_balance",
        entity,
        path,
        demand: 0,
        demandBasis: "structural",
        demandExplanation: explanation,
        listings: matched.length,
        suppliers,
        action: `${matched.length} listings but no application names this fabric. Either link it from an application or accept it is browse-only.`,
        priority: matched.length,
      });
    }
  }

  /* -- Applications ------------------------------------------------------- */

  for (const application of APPLICATIONS) {
    const matched = listings.filter((l) =>
      l.applications.includes(application.slug),
    );
    const suppliers = new Set(matched.map((l) => l.supplier.slug)).size;
    const { score, explanation } = applicationDemand(application.slug);
    const entity = {
      type: "application" as const,
      slug: application.slug,
      name: application.name,
    };
    const path = `/applications/${application.slug}/`;

    if (matched.length === 0) {
      gaps.push({
        kind: score > 0 ? "supplier_acquisition" : "content_improvement",
        entity,
        path,
        demand: score,
        demandBasis: "structural",
        demandExplanation: explanation,
        listings: 0,
        suppliers: 0,
        action:
          score > 0
            ? `Buyers making ${application.name.toLowerCase()} have nothing to source. Target suppliers of ${application.typicalFabrics.slice(0, 3).join(", ")}.`
            : `No listings and no buyer type names this product. Confirm it belongs in the taxonomy.`,
        priority: score * 3,
      });
    } else if (matched.length < 3 || suppliers < 2) {
      gaps.push({
        kind: "listing_acquisition",
        entity,
        path,
        demand: score,
        demandBasis: "structural",
        demandExplanation: explanation,
        listings: matched.length,
        suppliers,
        action: `${matched.length} listings from ${suppliers} supplier${suppliers === 1 ? "" : "s"}; the page needs 3 from 2.`,
        priority: score * 2,
      });
    }
  }

  /* -- Countries ---------------------------------------------------------- */

  for (const country of COUNTRIES) {
    const matched = listings.filter((l) => l.countryOfOrigin === country.code);
    const suppliers = new Set(matched.map((l) => l.supplier.slug)).size;
    if (matched.length >= 3 && suppliers >= 3) continue;

    gaps.push({
      kind:
        matched.length === 0 ? "supplier_acquisition" : "listing_acquisition",
      entity: { type: "country", slug: country.code, name: country.name },
      path: `/countries/${countrySlug(country.name)}/`,
      // A country's demand is its commercial reputation, which the taxonomy
      // records honestly as `knownFor` or not at all.
      demand: country.knownFor ? 6 : 2,
      demandBasis: "structural",
      demandExplanation: country.knownFor
        ? `known for ${country.knownFor.toLowerCase()}`
        : "no recorded sourcing reputation",
      listings: matched.length,
      suppliers,
      action:
        matched.length === 0
          ? `No mills listing from ${country.name}.`
          : `${suppliers} supplier${suppliers === 1 ? "" : "s"} from ${country.name}; a country page needs 3.`,
      priority: (country.knownFor ? 6 : 2) * 2,
    });
  }

  return gaps.sort((a, b) => b.priority - a.priority);
}

/** The top opportunities of one kind. What a sourcing team works from. */
export function topGaps(gaps: Gap[], kind: GapKind, limit = 10): Gap[] {
  return gaps.filter((g) => g.kind === kind).slice(0, limit);
}

/** Counts by kind, for the health header. */
export function gapSummary(gaps: Gap[]): Record<GapKind, number> {
  const summary: Record<GapKind, number> = {
    supplier_acquisition: 0,
    listing_acquisition: 0,
    content_improvement: 0,
    marketplace_balance: 0,
  };
  for (const gap of gaps) summary[gap.kind] += 1;
  return summary;
}
