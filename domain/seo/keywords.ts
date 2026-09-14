import type { Slug } from "@/domain/types";
import { getFabric } from "@/domain/taxonomy/fabrics";
import { COUNTRIES } from "@/domain/taxonomy/buyers";
import { buildCanonical } from "@/domain/taxonomy/resolve";

/**
 * Keyword intelligence.
 *
 * The planning database, deliberately separate from the page system. Keywords
 * are *mapped onto* pages that already deserve to exist; a page is never
 * created because a keyword exists. That separation is the single rule that
 * keeps a marketplace from turning into a content farm, and it is enforced by
 * keeping these records here rather than inside any component.
 *
 * **No search volumes are invented.** Every numeric metric is optional and
 * defaults to unknown. Nothing in this file claims a ranking, a volume or a
 * difficulty score, because no keyword research has been imported. The shape
 * exists so real research can be loaded without touching a page.
 */

export type SearchIntent =
  /** "what is french terry" - explanation, no purchase yet. */
  | "informational"
  /** "best fabric for t shirts" - choosing between options. */
  | "commercial_investigation"
  /** "cotton jersey fabric supplier" - ready to source. */
  | "transactional"
  /** "fabstitch login" - looking for a specific place. */
  | "navigational"
  /** "180 gsm cotton jersey wholesale" - B2B quantity language. */
  | "sourcing";

/** Which template answers this keyword. Maps intent onto the route system. */
export type PageType =
  | "fabric_category"
  | "fabric_specification"
  | "application"
  | "buyer_category"
  | "supplier_directory"
  | "supplier_country"
  | "certification"
  | "comparison"
  | "guide"
  | "listing"
  // Composites the strategy names as commercially meaningful (Q20 condition
  // 7). Anything not listed here has no page type and therefore no page.
  | "buyer_fabric"
  | "country_fabric"
  | "fabric_certification";

/**
 * A keyword and what it should resolve to.
 *
 * `targetPath` is nullable on purpose: a keyword can be researched, classified
 * and parked without a page. "Unmapped" is a legitimate, common state, and
 * forcing every keyword to a URL is exactly how thin pages get made.
 */
export type KeywordRecord = {
  keyword: string;
  slug: Slug;
  intent: SearchIntent;
  pageType: PageType;
  /** Entities this keyword is about. Drives the mapping to a real route. */
  entities: {
    fabric?: Slug;
    application?: Slug;
    buyerType?: Slug;
    certification?: Slug;
    countryCode?: string;
    gsm?: number;
  };
  /** Resolved destination, or null while the keyword is unmapped. */
  targetPath: string | null;
  /** Whether this is the one keyword a page is allowed to lead on. */
  role: "primary" | "secondary";
  status: "candidate" | "researching" | "approved" | "published" | "rejected";
  /**
   * Metrics from real research. **Unknown until imported** - there is no
   * keyword data connected, so these are absent rather than estimated.
   */
  metrics?: {
    monthlySearches?: number;
    difficulty?: number;
    commercialIntentScore?: number;
    /** Where the numbers came from. Required whenever any metric is set. */
    source: string;
    retrievedAt: string;
  };
  /** What the page must contain to deserve this keyword. */
  contentRequirements?: string[];
};

/**
 * Intent classification.
 *
 * Deterministic and rule-based, not a model. The vocabulary of B2B fabric
 * sourcing is narrow and stable: quantity words mean sourcing, "supplier"
 * means transactional, "best/vs" means comparison, "what is/how" means
 * explanation. A classifier that can be read and corrected beats one that
 * cannot be explained.
 */
const SOURCING_TERMS = [
  "wholesale",
  "bulk",
  "moq",
  "per kg",
  "per metre",
  "per meter",
  "roll",
  "container",
  "mill direct",
  "deadstock",
];
const TRANSACTIONAL_TERMS = [
  "supplier",
  "suppliers",
  "manufacturer",
  "manufacturers",
  "buy",
  "price",
  "quote",
  "sample",
  "exporter",
  "factory",
];
const COMPARISON_TERMS = ["best", "vs", "versus", "compare", "alternative"];
const INFORMATIONAL_TERMS = [
  "what is",
  "what's",
  "how to",
  "how much",
  "guide",
  "meaning",
  "difference between",
  "explained",
];

export function classifyIntent(keyword: string): SearchIntent {
  const q = keyword.toLowerCase().trim();

  if (INFORMATIONAL_TERMS.some((t) => q.includes(t))) return "informational";
  if (SOURCING_TERMS.some((t) => q.includes(t))) return "sourcing";
  if (COMPARISON_TERMS.some((t) => q.includes(t)))
    return "commercial_investigation";
  if (TRANSACTIONAL_TERMS.some((t) => q.includes(t))) return "transactional";
  if (/^fabstitch\b/.test(q)) return "navigational";

  // A bare product or material term is someone browsing, not yet buying.
  return "commercial_investigation";
}

/**
 * Which template should answer an intent.
 *
 * Intent decides page *type*; the entities in the keyword decide *which* page
 * of that type. Both are needed, and neither alone is enough - "cotton jersey"
 * and "cotton jersey supplier" share an entity but not a destination.
 */
export function pageTypeFor(
  intent: SearchIntent,
  entities: KeywordRecord["entities"],
): PageType {
  if (entities.gsm && entities.fabric) return "fabric_specification";
  if (entities.certification) return "certification";

  switch (intent) {
    case "informational":
      return "guide";
    case "transactional":
    case "sourcing":
      if (entities.countryCode) return "supplier_country";
      if (entities.buyerType) return "buyer_category";
      if (entities.application) return "application";
      if (entities.fabric) return "fabric_category";
      return "supplier_directory";
    case "commercial_investigation":
      if (entities.application) return "application";
      if (entities.fabric) return "fabric_category";
      return "fabric_category";
    default:
      return "fabric_category";
  }
}

/** A country's directory slug, or null when the code is not a known origin. */
function countryPathSlug(code: string): string | null {
  const country = COUNTRIES.find((c) => c.code === code);
  return country ? country.name.toLowerCase().replace(/\W+/g, "-") : null;
}

/**
 * Resolves a keyword to a route, or null when nothing should answer it yet.
 *
 * Returning null is the point. A keyword with no entity, or one whose page
 * type has no template, stays unmapped rather than inventing a destination.
 */
export function resolveTarget(record: {
  pageType: PageType;
  entities: KeywordRecord["entities"];
}): string | null {
  const { pageType, entities } = record;

  // Fabric routes are resolved through the taxonomy, never string-built: a
  // node's URL is its *ancestry* (`/fabrics/cotton/jersey/`), which is not
  // derivable from the slug alone. Building it by hand produced a path the
  // page never self-canonicalises to, which silently mapped many keywords onto
  // one URL and read as cannibalisation.
  const node = entities.fabric ? getFabric(entities.fabric) : undefined;

  switch (pageType) {
    case "fabric_specification":
      return node && entities.gsm ? buildCanonical(node, entities.gsm) : null;
    case "fabric_category":
      return node ? buildCanonical(node) : null;
    case "fabric_certification":
      return node && entities.certification
        ? buildCanonical(node, undefined, undefined, entities.certification)
        : null;
    case "buyer_fabric":
      return entities.buyerType && entities.fabric
        ? `/for/${entities.buyerType}/${entities.fabric}/`
        : null;
    case "country_fabric":
      return entities.countryCode && entities.fabric
        ? `/countries/${countryPathSlug(entities.countryCode)}/${entities.fabric}/`
        : null;
    case "application":
      return entities.application
        ? `/applications/${entities.application}/`
        : null;
    case "buyer_category":
      return entities.buyerType ? `/for/${entities.buyerType}/` : null;
    case "certification":
      return entities.certification
        ? `/certifications/${entities.certification}/`
        : null;
    case "supplier_country":
      // Every country resolving to `/suppliers/` made twelve distinct subjects
      // look like one contested page.
      return entities.countryCode
        ? `/countries/${countryPathSlug(entities.countryCode)}/`
        : null;
    case "supplier_directory":
      return "/suppliers/";
    case "guide":
      return "/guides/";
    default:
      return null;
  }
}

/** Builds a record from a keyword string plus the entities research found. */
export function keywordRecord(
  keyword: string,
  entities: KeywordRecord["entities"],
  overrides: Partial<KeywordRecord> = {},
): KeywordRecord {
  const intent = overrides.intent ?? classifyIntent(keyword);
  const pageType = overrides.pageType ?? pageTypeFor(intent, entities);
  return {
    keyword,
    slug: keyword
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    intent,
    pageType,
    entities,
    targetPath: overrides.targetPath ?? resolveTarget({ pageType, entities }),
    role: overrides.role ?? "primary",
    status: overrides.status ?? "candidate",
    ...overrides,
  };
}
