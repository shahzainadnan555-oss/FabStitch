/**
 * FabStitch domain types.
 *
 * Current types describe frontend-owned catalogue, taxonomy and preview
 * models. A future service adapter may map a new backend contract into these
 * UI-facing shapes, but no current type implies a live network integration.
 */

/* ==========================================================================
 Units - every physical quantity carries its unit. Never a bare number.
 ========================================================================== */

export type LengthUnit = "cm" | "inch";
export type QuantityUnit = "kg" | "m" | "yard" | "piece" | "roll";
export type WidthType = "open-width" | "tubular";

/** GSM with the tolerance mills actually work to. 180 means 171-189 at ±5%. */
export type Gsm = {
  value: number;
  /** Percentage tolerance, e.g. 5 for ±5%. */
  tolerancePct?: number;
};

export type Width = {
  value: number;
  unit: LengthUnit;
  type?: WidthType;
};

export type Moq = {
  value: number;
  unit: QuantityUnit;
  /** True when the minimum applies per colour rather than per order. */
  perColour?: boolean;
};

export type PriceBand = {
  min: number;
  max?: number;
  currency: string;
  unit: QuantityUnit;
};

/* ==========================================================================
 Controlled vocabularies
 ========================================================================== */

/** Mirrors the live `FabricMaterial` enum. Flat today; see D2. */
export type FabricMaterial =
  | "cotton"
  | "linen"
  | "silk"
  | "wool"
  | "polyester"
  | "nylon"
  | "viscose"
  | "rayon"
  | "denim"
  | "velvet"
  | "chiffon"
  | "satin"
  | "jersey"
  | "twill"
  | "canvas"
  | "georgette"
  | "blended"
  | "other";

/** Mirrors the live `FabricType` enum. */
export type FabricType = "woven" | "knitted" | "non_woven";

/** Mirrors the live `StockStatus` enum. */
export type StockStatus =
  "in_stock" | "low_stock" | "made_to_order" | "out_of_stock";

/** Mirrors the live `FabricStatus` enum. There is no `paused`. */
export type FabricStatus =
  | "draft"
  | "pending_review"
  | "active"
  | "rejected"
  | "suspended"
  | "out_of_stock"
  | "archived";

export type FibreOrigin = "natural" | "regenerated" | "synthetic" | "blended";

export type ConstructionClass =
  "knit" | "woven" | "non-woven" | "coated" | "laminated";

/* ==========================================================================
 Taxonomy - the structures the SEO and discovery architecture generate from
 ========================================================================== */

export type Slug = string;

export type TaxonomyRef = {
  id: string;
  name: string;
  slug: Slug;
};

/**
 * A node in the fabric hierarchy. One canonical parent defines the URL
 * (cotton → jersey → single-jersey); `tags` carry the cross-cutting
 * memberships that generate hub pages. See docs/ARCHITECTURE.md §2.
 */
export type FabricNode = {
  id: string;
  name: string;
  slug: Slug;
  /** Null for a family root. */
  parentSlug: Slug | null;
  family: Slug;
  fibreOrigin: FibreOrigin;
  constructionClass: ConstructionClass;
  /** One line a buyer can act on - never marketing copy. */
  summary: string;
  /** Typical commercial weight range, in GSM. */
  gsmRange?: [number, number];
  /** Cross-cutting hub memberships: 'stretch', 'sustainable', 'performance'. */
  tags?: Slug[];
  /** Search aliases: lycra→elastane, loopback→french-terry. */
  aliases?: string[];
  /**
   * Representative photograph of the *category*, not of any mill's stock.
   *
   * Named for `FabricNodeResponse.image_url`, which the backend already
   * exposes on every taxonomy node, so an API-backed taxonomy maps one to one
   * with no second concept to reconcile. Null there today for every node.
   *
   * This is category media and obeys R28. Listing media is a different field
   * on a different entity (`FabricListing.imageUrl`) and still shows only what
   * the supplier uploaded (R9).
   */
  imageUrl?: string | null;
};

export type FabricFamily = {
  slug: Slug;
  name: string;
  summary: string;
  fibreOrigin: FibreOrigin;
};

export type ApplicationGroup = {
  slug: Slug;
  name: string;
  /** Applications inside this group, in commercial-value order. */
  applications: Application[];
};

export type Application = {
  id: string;
  name: string;
  slug: Slug;
  group: Slug;
  /** What the buyer is making, in one clause. */
  summary: string;
  /** Fabric slugs this application typically needs, best-first. */
  typicalFabrics: Slug[];
  /** The weight band that matters for this product. */
  gsmRange?: [number, number];
};

export type BuyerCategory = {
  id: string;
  name: string;
  slug: Slug;
  /** Why this buyer needs fabric - the block that makes the page unique. */
  summary: string;
  subcategories: BuyerSubcategory[];
};

export type BuyerSubcategory = {
  id: string;
  name: string;
  slug: Slug;
  category: Slug;
  /** Applications this buyer manufactures - the join to fabric. */
  applications: Slug[];
};

export type Certification = {
  id: string;
  name: string;
  slug: Slug;
  abbreviation: string;
  /** What the certificate actually proves. Never overstated. */
  covers: string;
};

export type Country = {
  /** ISO 3166-1 alpha-2, matching the API's `country_code`. */
  code: string;
  name: string;
  /** What this origin is commercially known for. Empty when it is not. */
  knownFor?: string;
};

/* ==========================================================================
 Marketplace records
 ========================================================================== */

export type SupplierSummary = {
  id: string;
  slug: Slug;
  companyName: string;
  countryCode: string;
  city?: string | null;
  supplierType: "mill" | "manufacturer" | "converter" | "wholesaler" | "agent";
  isVerified: boolean;
  /**
   * Published listings this supplier has, as counted by the API.
   *
   * `null` means *not reported*, which is the case for the supplier block
   * embedded in a listing — that payload carries no count. It never means
   * "no listings": a supplier with none does not appear in the directory at
   * all, so a real zero is unreachable here and a rendered `0` would be a
   * claim the marketplace never made.
   */
  publishedListingCount?: number | null;
};

/**
 * A fabric listing - the atomic unit of the marketplace and the only record a
 * buyer can transact on. Field order here matches the fixed display order on
 * the listing page so two listings compare top-to-bottom.
 */
export type FabricListing = {
  id: string;
  slug: Slug;
  /** Written as a buyer would search it, not as a marketing name. */
  name: string;
  supplier: SupplierSummary;
  countryOfOrigin: string;

  material: FabricMaterial;
  composition: string;
  fabricType: FabricType;
  construction?: string;
  gsm?: Gsm;
  width?: Width;
  yarnCount?: string;
  finish?: string[];
  stretch?: { direction: "2-way" | "4-way"; percent?: number } | null;

  moq: Moq;
  price?: PriceBand | null;
  leadTimeDays?: [number, number];
  stockStatus: StockStatus;
  sample: { available: boolean; swatchFree?: boolean; note?: string };

  certifications: TaxonomyRef[];
  applications: Slug[];
  imageUrl?: string | null;
  /**
   * Representative shade of the cloth, as the supplier states it. Drives the
   * rendered swatch when no photograph exists. Not a claim about a dye lot.
   */
  swatchColor?: string;

  /** Marks records that are illustrative rather than live inventory (R7). */
  isSpecimen?: boolean;

  /**
   * When the supplier last touched this record. ISO 8601.
   *
   * Optional because fixtures do not carry it; the API does
   * (`PublicFabricResponse.updated_at`). Staleness is the one page-refresh
   * trigger that cannot be derived from anything else - a listing whose price
   * band and lead time were last confirmed a year ago weakens every page it
   * appears on, and nothing in the catalogue reveals that without a timestamp.
   */
  updatedAt?: string;
};

/* ==========================================================================
 Search
 ========================================================================== */

/**
 * Search intent produced by the local query parser.
 */
export type FabricSearchIntent = {
  query: string | null;
  material: string | null;
  composition: string | null;
  fabric_type: string | null;
  gsm_min: number | null;
  gsm_max: number | null;
  width_min: string | null;
  width_max: string | null;
  width_unit: string | null;
  color: string | null;
  weave: string | null;
  finish: string | null;
  dye: string | null;
  stretch: boolean | null;
  moq_min: string | null;
  moq_max: string | null;
  target_quantity: string | null;
  quantity_unit: string | null;
  country_code: string | null;
  certifications: string[];
  sample_required: boolean | null;
  /**
   * A canonical `StockStatus`, when the query named a sourcing condition.
   *
   * "ready stock" and "in stock" both mean `in_stock`; "made to order" means
   * `made_to_order`. The vocabulary is the API's, not a parallel one - see the
   * `ready-stock` and `made-to-order` buyer requirements, which define the
   * condition as `stock_status` with comparison `equals`.
   */
  stock_status: string | null;
  use_case: string | null;
};

export const EMPTY_SEARCH_INTENT: FabricSearchIntent = {
  query: null,
  material: null,
  composition: null,
  fabric_type: null,
  gsm_min: null,
  gsm_max: null,
  width_min: null,
  width_max: null,
  width_unit: null,
  color: null,
  weave: null,
  finish: null,
  dye: null,
  stretch: null,
  moq_min: null,
  moq_max: null,
  target_quantity: null,
  quantity_unit: null,
  country_code: null,
  certifications: [],
  sample_required: null,
  stock_status: null,
  use_case: null,
};

/** The facets the query parser can recognise, in display order. */
export type SearchFacet =
  | "material"
  | "construction"
  | "type"
  | "gsm"
  | "width"
  | "composition"
  | "finish"
  | "stretch"
  | "colour"
  | "certification"
  | "country"
  | "quantity"
  | "stock"
  | "application"
  | "sample";

/** One recognised token, rendered as a removable chip. */
export type ParsedTerm = {
  /** Stable key for React and for removal. */
  id: string;
  facet: SearchFacet;
  /** Short uppercase facet name shown on the chip. */
  facetLabel: string;
  /** Human-readable resolved value, e.g. "180 GSM ±5%". */
  label: string;
  /** The exact substring of the query this came from. */
  source: string;
};

export type ParsedQuery = {
  intent: FabricSearchIntent;
  terms: ParsedTerm[];
  /** Words the parser did not recognise - kept as free text for the server. */
  unmatched: string[];
  /**
   * Commercial-intent signals ("supplier", "wholesale", "bulk", "mill").
   * Not part of the API schema; used to decide which result view to open.
   */
  signals: string[];
};
