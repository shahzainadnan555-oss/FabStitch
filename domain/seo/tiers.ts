import type { PageType, SearchIntent } from "./keywords";

/**
 * Keyword tiers and build priority.
 *
 * From the FabStitch keyword strategy, Q22. The tiers and their build order
 * are the document's, not mine:
 *
 *   > Note that the tier number is a structural ordering - it describes how
 *   > specific the query is, not the order in which FabStitch should chase
 *   > them. Build priority runs roughly Tier 3 -> 5 -> 4 -> 6 -> 7 -> 8 -> 2
 *   > -> 1, because specificity converts and head terms take years.
 *
 * And Q23 on why, which is the part that makes the ordering non-obvious:
 *
 *   > The most valuable keywords are not the highest-volume keywords. In B2B
 *   > fabric sourcing the relationship is close to inverted: as a query gets
 *   > more specific its volume falls and its value rises, because specificity
 *   > is evidence of a real buyer with a real order.
 *
 * This is why `buildRank` is not simply the tier number. Ordering by tier
 * would put head terms first, which the research says take years and are
 * dominated by retailers.
 */

export type KeywordTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type TierDefinition = {
  tier: KeywordTier;
  name: string;
  /** Verbatim examples from Q22, kept as evidence rather than paraphrased. */
  examples: string[];
  /** Which template answers this tier. */
  pageTypes: PageType[];
  intent: SearchIntent;
  /** Position in the document's stated build order. Lower runs first. */
  buildRank: number;
  /** The document's own assessment. Not a volume claim. */
  note: string;
};

export const KEYWORD_TIERS: TierDefinition[] = [
  {
    tier: 1,
    name: "Broad fabric terms",
    examples: ["fabric supplier", "cotton fabric", "wholesale fabric"],
    pageTypes: ["fabric_category"],
    intent: "commercial_investigation",
    buildRank: 8,
    note: "Mixed intent, dominated by established retailers. Necessary for taxonomy and authority flow, not a realistic early win.",
  },
  {
    tier: 2,
    name: "Specific fabric types",
    examples: ["french terry fabric", "single jersey fabric", "cotton sateen"],
    pageTypes: ["fabric_category"],
    intent: "commercial_investigation",
    buildRank: 7,
    note: "Clearer intent, far less competition. Maps one-to-one onto fabric pages and is the backbone of the taxonomy.",
  },
  {
    tier: 3,
    name: "Wholesale and commercial intent",
    examples: [
      "wholesale cotton fabric",
      "bulk jersey fabric",
      "fabric price per kg",
    ],
    pageTypes: ["fabric_category", "supplier_directory"],
    intent: "sourcing",
    buildRank: 1,
    note: "Highest immediate priority. Unambiguously B2B and exactly what a marketplace is built to satisfy.",
  },
  {
    tier: 4,
    name: "Application and product intent",
    examples: [
      "fabric for t-shirts",
      "best fabric for hoodies",
      "curtain fabric wholesale",
    ],
    pageTypes: ["application"],
    intent: "commercial_investigation",
    buildRank: 3,
    note: "Genuine buying intent, often poorly served by pages with no inventory, which makes them winnable.",
  },
  {
    tier: 5,
    name: "Specification intent",
    examples: ["180 GSM cotton jersey", "240 GSM french terry", "12 oz denim"],
    pageTypes: ["fabric_specification"],
    intent: "sourcing",
    buildRank: 2,
    note: "Anyone typing a GSM number is a professional mid-sourcing. Cheap to rank for and the highest ROI in the portfolio.",
  },
  {
    tier: 6,
    name: "Buyer-specific intent",
    examples: [
      "fabric for t-shirt manufacturers",
      "hotel linen fabric supplier",
    ],
    pageTypes: ["buyer_category", "buyer_fabric"],
    intent: "transactional",
    buildRank: 4,
    note: "Exceptional qualification - the searcher has already said who they are and what they buy.",
  },
  {
    tier: 7,
    name: "Location-specific intent",
    examples: ["cotton fabric supplier Pakistan", "denim mill India"],
    pageTypes: ["supplier_country", "country_fabric"],
    intent: "transactional",
    buildRank: 5,
    note: "Buyers with a sourcing-region strategy, driven by duty, lead time or compliance rather than price alone.",
  },
  {
    tier: 8,
    name: "Certification and performance intent",
    examples: [
      "GOTS certified organic cotton fabric",
      "OEKO-TEX jersey supplier",
    ],
    pageTypes: ["certification", "fabric_certification"],
    intent: "transactional",
    buildRank: 6,
    note: "Lowest volume, highest qualification. A compliance requirement and a budget, and the least price-sensitive segment.",
  },
];

const BY_PAGE_TYPE = new Map<PageType, TierDefinition>();
// Later tiers are more specific, so the last match wins - a specification page
// belongs to Tier 5, not to Tier 1's "cotton fabric".
for (const definition of KEYWORD_TIERS) {
  for (const pageType of definition.pageTypes) {
    BY_PAGE_TYPE.set(pageType, definition);
  }
}

export function tierFor(pageType: PageType): TierDefinition | undefined {
  return BY_PAGE_TYPE.get(pageType);
}

/**
 * Build priority for a page type.
 *
 * Lower runs first, following Q22's stated order. Returns a high number for
 * anything untiered so it sorts last rather than accidentally leading.
 */
export function buildPriority(pageType: PageType): number {
  return tierFor(pageType)?.buildRank ?? 99;
}
