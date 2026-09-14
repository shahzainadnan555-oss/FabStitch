import type { PageType } from "./keywords";

/**
 * The indexability gate.
 *
 * **These thresholds are not invented.** They come from the FabStitch keyword
 * and programmatic-SEO strategy in the repository root, Q20: "A seven-condition
 * gate... the single most important control in the entire architecture: it is
 * what allows FabStitch to plan for 40,000 pages without ever publishing a thin
 * one." The Phase 2 gate used numbers I chose; these replace them.
 *
 * The document is equally clear about what a failure means (Q21):
 *
 *   > NOINDEX IS NOT DELETION. Non-indexable pages still work for users: they
 *   > are reachable through filters and internal search, they render normally,
 *   > and they remain crawlable via noindex, follow so link equity flows
 *   > through them. The moment supply crosses the threshold, [they flip] to
 *   > indexable and [are added] to the sitemap.
 *
 * So a failing page is never hidden or deleted. It renders, it links, and it
 * qualifies itself automatically when the marketplace grows into it.
 */

/* ==========================================================================
   Condition 2 and 6 - supply and depth thresholds, per page type
   ========================================================================== */

/**
 * Live listings required.
 *
 * Q20 condition 2: "Fabric / application / buyer pages: >= 3 live listings.
 * Specification, buyer x fabric, country x fabric pages: >= 5 live listings."
 * The deeper the combination, the more supply it takes to be worth a page -
 * a narrow page with two listings is a dead end for a buyer.
 */
const LISTING_FLOOR: Record<PageType, number> = {
  fabric_category: 3,
  application: 3,
  buyer_category: 3,
  fabric_specification: 5,
  buyer_fabric: 5,
  country_fabric: 5,
  supplier_country: 3,
  certification: 3,
  fabric_certification: 5,
  // Hubs, comparisons and guides route or explain; they hold no supply of
  // their own and are curated rather than generated.
  supplier_directory: 0,
  comparison: 0,
  guide: 0,
  listing: 0,
};

/**
 * Distinct suppliers required.
 *
 * Q20 condition 6: ">= 2 distinct suppliers (>= 3 for country pages)... A
 * single supplier behind a page makes it a supplier ad, not a marketplace
 * category - and it disappears if that supplier leaves."
 */
function supplierFloor(pageType: PageType): number {
  if (LISTING_FLOOR[pageType] === 0) return 0;
  return pageType === "supplier_country" || pageType === "country_fabric"
    ? 3
    : 2;
}

/** Q20 condition 3: ">= 150 words of specific, non-templated content". */
export const MIN_UNIQUE_WORDS = 150;

/** Q20 condition 4: "uniqueness_score >= 0.7 against its parent and siblings". */
export const MIN_UNIQUENESS = 0.7;

/** Q20 condition 6: "average listing completeness >= 70%". */
export const MIN_COMPLETENESS = 0.7;

/* ==========================================================================
   Condition 7 - which combinations may exist at all
   ========================================================================== */

/**
 * Q20 condition 7: "Passes the rule set: fabric x spec, fabric x country,
 * buyer x fabric - fabric x colour, spec x spec x spec." This is what "stops
 * the combinatorial explosion at the point of publication".
 *
 * An allow-list, not a deny-list. A combination nobody has argued for does not
 * get a page by default, which is the only way this stays bounded.
 */
const ALLOWED_COMBINATIONS = new Set<PageType>([
  "fabric_category",
  "fabric_specification",
  "application",
  "buyer_category",
  "buyer_fabric",
  "country_fabric",
  "supplier_country",
  "certification",
  "fabric_certification",
]);

/** Combinations the research names as forbidden, for an explicit refusal. */
export const FORBIDDEN_COMBINATIONS = [
  "fabric x colour",
  "fabric x city",
  "spec x spec x spec",
  "any trivial specification increment",
] as const;

/* ==========================================================================
   Signals and states
   ========================================================================== */

export type GateSignals = {
  listingCount: number;
  supplierCount: number;
  /** Words of page-specific prose, excluding anything shared with the parent. */
  uniqueWordCount: number;
  /** 0-1 against parent and nearest siblings. See `uniquenessScore`. */
  uniquenessScore: number;
  /** 0-1 mean field completeness across the listings on this page. */
  dataCompleteness: number;
  /** A mapped keyword with commercial intent, or measured on-site demand. */
  hasQualifiedIntent: boolean;
  /** False when a sibling page already claims this primary keyword. */
  primaryKeywordIsUnique: boolean;
  relatedLinkCount: number;
};

/**
 * Page states.
 *
 * Deliberately more than a boolean: the fixes differ. `insufficient_supply`
 * resolves itself as suppliers onboard and needs nobody; `insufficient_content`
 * needs writing; `rejected` needs the combination rule changed or the page
 * abandoned.
 */
export type PageState =
  | "candidate"
  | "research_needed"
  | "insufficient_supply"
  | "insufficient_content"
  | "duplicate"
  | "approved"
  | "published"
  | "noindex"
  | "rejected";

export type GateDecision = {
  indexable: boolean;
  state: PageState;
  /** Condition numbers from Q20 that failed, with the measured shortfall. */
  failures: { condition: number; reason: string }[];
};

/**
 * Runs the seven conditions.
 *
 * Every failure carries its condition number so a decision can be traced back
 * to the document rather than argued about.
 */
export function runGate(
  pageType: PageType,
  signals: GateSignals,
): GateDecision {
  const failures: GateDecision["failures"] = [];

  // 7 - checked first: a forbidden combination is not worth measuring.
  if (!ALLOWED_COMBINATIONS.has(pageType) && LISTING_FLOOR[pageType] !== 0) {
    return {
      indexable: false,
      state: "rejected",
      failures: [
        { condition: 7, reason: `${pageType} is not an allowed combination` },
      ],
    };
  }

  const listingFloor = LISTING_FLOOR[pageType] ?? 3;
  const supplierMin = supplierFloor(pageType);
  const curated = listingFloor === 0;

  // 1 - relevant search intent exists
  if (!curated && !signals.hasQualifiedIntent) {
    failures.push({
      condition: 1,
      reason: "no mapped keyword with commercial intent and no on-site demand",
    });
  }

  // 2 - real listings exist
  if (signals.listingCount < listingFloor) {
    failures.push({
      condition: 2,
      reason: `${signals.listingCount} listings, ${listingFloor} required`,
    });
  }

  // 3 - useful information exists
  if (!curated && signals.uniqueWordCount < MIN_UNIQUE_WORDS) {
    failures.push({
      condition: 3,
      reason: `${signals.uniqueWordCount} unique words, ${MIN_UNIQUE_WORDS} required`,
    });
  }

  // 4 - the page has unique value
  if (!curated && signals.uniquenessScore < MIN_UNIQUENESS) {
    failures.push({
      condition: 4,
      reason: `uniqueness ${signals.uniquenessScore.toFixed(2)}, ${MIN_UNIQUENESS} required`,
    });
  }

  // 5 - it is not a duplicate variant
  if (!signals.primaryKeywordIsUnique) {
    failures.push({
      condition: 5,
      reason: "a sibling page already targets this primary keyword",
    });
  }

  // 6 - enough supplier and marketplace depth
  if (signals.supplierCount < supplierMin) {
    failures.push({
      condition: 6,
      reason: `${signals.supplierCount} suppliers, ${supplierMin} required`,
    });
  }
  if (!curated && signals.dataCompleteness < MIN_COMPLETENESS) {
    failures.push({
      condition: 6,
      reason: `listing completeness ${Math.round(signals.dataCompleteness * 100)}%, ${MIN_COMPLETENESS * 100}% required`,
    });
  }

  if (failures.length === 0) {
    return { indexable: true, state: "published", failures };
  }

  return { indexable: false, state: stateFor(failures), failures };
}

/** The most actionable label for a set of failures. */
function stateFor(failures: GateDecision["failures"]): PageState {
  const conditions = new Set(failures.map((f) => f.condition));
  if (conditions.has(5)) return "duplicate";
  if (conditions.has(1)) return "research_needed";
  if (conditions.has(3) || conditions.has(4)) return "insufficient_content";
  if (conditions.has(2) || conditions.has(6)) return "insufficient_supply";
  return "noindex";
}

/* ==========================================================================
   Uniqueness
   ========================================================================== */

/**
 * How different a page is from its parent and nearest siblings.
 *
 * Q20 condition 4 exists to stop "180 GSM and 185 GSM existing as two
 * near-identical pages". Measured on the facts a page actually states, not on
 * its prose: two pages whose listing sets, weight bands and supplier sets are
 * the same *are* the same page, however differently they are worded.
 *
 * Jaccard distance over the fact set, which is cheap, stable and explainable.
 */
export function uniquenessScore(
  facts: Set<string>,
  neighbours: Set<string>[],
): number {
  if (!facts.size) return 0;
  if (!neighbours.length) return 1;

  let worst = 1;
  for (const other of neighbours) {
    if (!other.size) continue;
    let shared = 0;
    for (const fact of facts) if (other.has(fact)) shared += 1;
    const union = facts.size + other.size - shared;
    const similarity = union === 0 ? 0 : shared / union;
    worst = Math.min(worst, 1 - similarity);
  }
  return Number(worst.toFixed(2));
}

/**
 * Mean completeness of the listings behind a page.
 *
 * Counts the fields a buyer filters on. A page whose listings mostly lack
 * width and MOQ cannot answer the question it is ranking for, however many
 * listings it has.
 */
export function completeness(
  listings: {
    gsm?: unknown;
    width?: unknown;
    composition?: unknown;
    construction?: unknown;
    moq?: unknown;
    price?: unknown;
    leadTimeDays?: unknown;
    certifications?: unknown[];
  }[],
): number {
  if (!listings.length) return 0;
  const total = listings.reduce((sum, listing) => {
    const fields = [
      listing.gsm,
      listing.width,
      listing.composition,
      listing.construction,
      listing.moq,
      listing.price,
      listing.leadTimeDays,
      listing.certifications?.length ? listing.certifications : undefined,
    ];
    const present = fields.filter((f) => f !== undefined && f !== null).length;
    return sum + present / fields.length;
  }, 0);
  return Number((total / listings.length).toFixed(2));
}
