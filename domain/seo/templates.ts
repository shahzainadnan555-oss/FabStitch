import type { Metadata } from "next";
import type { PageType } from "./keywords";

/**
 * Page metadata and heading structure, generated per entity.
 *
 * Two failure modes this exists to prevent, both of which are invisible until
 * a site is large:
 *
 *   1. **Duplicate titles and descriptions.** Every template here composes
 *      from entity-specific values, so two pages cannot produce the same
 *      string unless two entities are genuinely identical.
 *   2. **Keyword-stuffed headings.** One primary topic per page. The H1 states
 *      the entity; the H2s are the questions a buyer actually asks about it,
 *      in a fixed order, so the outline is the same shape everywhere and the
 *      words differ because the entity does.
 *
 * Every field can be overridden, because a researcher writing a better title
 * than a generator is normal and the system should not fight them.
 */

export type PageSeo = {
  title: string;
  description: string;
  canonical: string;
  h1: string;
  /** Section headings, in render order. Each is one buyer question. */
  sections: string[];
  indexable: boolean;
};

export type SeoOverrides = Partial<
  Pick<PageSeo, "title" | "description" | "h1" | "sections">
>;

/** Descriptions are trimmed to a length search engines will actually show. */
function clamp(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}...`;
}

/* ==========================================================================
   Per-type builders
   ========================================================================== */

export function fabricCategorySeo(input: {
  name: string;
  summary: string;
  path: string;
  gsmRange?: [number, number];
  listingCount: number;
  supplierCount: number;
  indexable: boolean;
  overrides?: SeoOverrides;
}): PageSeo {
  const weight = input.gsmRange
    ? `${input.gsmRange[0]}-${input.gsmRange[1]} GSM`
    : null;

  return {
    title: `${input.name} fabric${weight ? ` - ${weight}` : ""} | Wholesale suppliers`,
    description: clamp(
      `${input.summary} Compare ${input.listingCount} ${input.name.toLowerCase()} listings from ${input.supplierCount} suppliers with composition, weight, width, MOQ, price band and lead time.`,
    ),
    canonical: input.path,
    h1: `${input.name} fabric`,
    sections: [
      `What ${input.name.toLowerCase()} is`,
      `${input.name} specifications`,
      `What ${input.name.toLowerCase()} is used for`,
      `${input.name} suppliers and listings`,
      `Related fabrics`,
    ],
    indexable: input.indexable,
    ...input.overrides,
  };
}

export function specificationSeo(input: {
  fabricName: string;
  gsm: number;
  path: string;
  listingCount: number;
  indexable: boolean;
  overrides?: SeoOverrides;
}): PageSeo {
  const label = `${input.gsm} GSM ${input.fabricName.toLowerCase()}`;
  return {
    title: `${input.gsm} GSM ${input.fabricName} | Wholesale fabric`,
    description: clamp(
      `${label} from verified mills. ${input.listingCount} listings at this weight, matched within mill tolerance, with width, MOQ, price band, lead time and certification.`,
    ),
    canonical: input.path,
    h1: `${input.gsm} GSM ${input.fabricName} fabric`,
    sections: [
      `${input.gsm} GSM ${input.fabricName} specifications`,
      `Common uses at this weight`,
      `${input.fabricName} suppliers at ${input.gsm} GSM`,
      `Other weights of ${input.fabricName.toLowerCase()}`,
    ],
    indexable: input.indexable,
    ...input.overrides,
  };
}

/**
 * Fabric × certification.
 *
 * Tier 8 in the keyword strategy - "lowest volume, highest qualification".
 * The title leads on the certificate because that is the constraint the buyer
 * cannot compromise on, and it is what keeps this page's primary keyword
 * distinct from the plain fabric page's (gate condition 5).
 *
 * The description states what the certificate *covers* and never what it
 * implies: GOTS is not "sustainable", it is organic fibre content plus
 * processing and social criteria.
 */
export function fabricCertificationSeo(input: {
  fabricName: string;
  certificationName: string;
  abbreviation: string;
  covers: string;
  path: string;
  listingCount: number;
  supplierCount: number;
  indexable: boolean;
  overrides?: SeoOverrides;
}): PageSeo {
  return {
    title: `${input.abbreviation} certified ${input.fabricName} | Wholesale suppliers`,
    description: clamp(
      `${input.listingCount} ${input.fabricName.toLowerCase()} listings from ${input.supplierCount} suppliers holding ${input.certificationName}. ${input.covers}`,
    ),
    canonical: input.path,
    h1: `${input.abbreviation} certified ${input.fabricName}`,
    sections: [
      `What ${input.abbreviation} certification covers`,
      `${input.abbreviation} certified ${input.fabricName.toLowerCase()} listings`,
      `Suppliers holding ${input.abbreviation}`,
      `How certificates are verified`,
    ],
    indexable: input.indexable,
    ...input.overrides,
  };
}

export function applicationSeo(input: {
  name: string;
  summary: string;
  path: string;
  fabricNames: string[];
  listingCount: number;
  indexable: boolean;
  overrides?: SeoOverrides;
}): PageSeo {
  const lead = input.fabricNames.slice(0, 3).join(", ");
  return {
    title: `Fabric for ${input.name.toLowerCase()} | Suppliers and specifications`,
    description: clamp(
      `${input.summary} ${lead ? `Commonly ${lead}. ` : ""}Compare ${input.listingCount} listings with weight, width, MOQ and lead time, then request samples.`,
    ),
    canonical: input.path,
    h1: `Fabric for ${input.name.toLowerCase()}`,
    sections: [
      `Fabrics commonly used for ${input.name.toLowerCase()}`,
      `Specifications that matter`,
      `Listings for ${input.name.toLowerCase()}`,
      `Who sources this`,
      `Related products`,
    ],
    indexable: input.indexable,
    ...input.overrides,
  };
}

export function buyerCategorySeo(input: {
  name: string;
  summary: string;
  path: string;
  applicationNames: string[];
  indexable: boolean;
  overrides?: SeoOverrides;
}): PageSeo {
  const makes = input.applicationNames.slice(0, 3).join(", ");
  return {
    title: `Fabric sourcing for ${input.name.toLowerCase()}`,
    description: clamp(
      `${input.summary}${makes ? ` Typically sourcing for ${makes}.` : ""} Compare mills on specification, MOQ and lead time.`,
    ),
    canonical: input.path,
    h1: `Fabric sourcing for ${input.name.toLowerCase()}`,
    sections: [
      `What ${input.name.toLowerCase()} source`,
      `Applications they manufacture`,
      `Fabrics to consider`,
      `Specifications that matter`,
      `Related buyer types`,
    ],
    indexable: input.indexable,
    ...input.overrides,
  };
}

export function supplierCountrySeo(input: {
  countryName: string;
  knownFor?: string;
  path: string;
  /**
   * `null` when nothing has counted them, which is not the same as none.
   *
   * The SEO gate is the usual source, and it has no signals for an origin
   * with no page opportunity yet - so this arrived as `0` and the description
   * read "0 fabric suppliers listing from Türkiye" for a country with four.
   * A meta description is a claim in a search result; an uncounted origin
   * simply does not make one.
   */
  supplierCount: number | null;
  indexable: boolean;
  overrides?: SeoOverrides;
}): PageSeo {
  const supply =
    input.supplierCount === null
      ? `Fabric suppliers listing from ${input.countryName}.`
      : `${input.supplierCount} fabric suppliers listing from ${input.countryName}.`;

  return {
    title: `Fabric suppliers in ${input.countryName} | Mills and converters`,
    description: clamp(
      `${supply}${input.knownFor ? ` Known for ${input.knownFor.toLowerCase()}.` : ""} Filter by capability, certification and minimum order.`,
    ),
    canonical: input.path,
    h1: `Fabric suppliers in ${input.countryName}`,
    sections: [
      `Suppliers in ${input.countryName}`,
      `What this origin is known for`,
      `Other sourcing origins`,
    ],
    indexable: input.indexable,
    ...input.overrides,
  };
}

export function comparisonSeo(input: {
  names: string[];
  path: string;
  indexable: boolean;
  overrides?: SeoOverrides;
}): PageSeo {
  const joined = input.names.join(" vs ");
  return {
    title: `${joined} | Fabric comparison`,
    description: clamp(
      `Compare ${joined} on composition, construction, weight range, typical applications and what the marketplace actually holds. Values shown only where the data states them.`,
    ),
    canonical: input.path,
    h1: joined,
    sections: [
      "Declared properties",
      "What the marketplace holds",
      "Typical applications",
      "Suppliers",
    ],
    indexable: input.indexable,
    ...input.overrides,
  };
}

/* ==========================================================================
   Adapter
   ========================================================================== */

/**
 * Turns a `PageSeo` into Next metadata.
 *
 * Indexability arrives from the gate, so a page cannot quietly opt itself in:
 * the only way to be indexed is to pass `evaluate()`.
 */
export function toMetadata(seo: PageSeo): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    robots: seo.indexable ? undefined : { index: false, follow: true },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      type: "website",
    },
  };
}

/** Page types that have a template here. Anything else has no generator yet. */
export const TEMPLATED: PageType[] = [
  "fabric_category",
  "fabric_specification",
  "application",
  "buyer_category",
  "supplier_country",
  "comparison",
];
