import type { FabricListing } from "@/domain/types";
import { FABRIC_LOOKUP, getFabric } from "@/domain/taxonomy/fabrics";
import { APPLICATIONS } from "@/domain/taxonomy/applications";
import { CERTIFICATIONS, COUNTRY_LOOKUP } from "@/domain/taxonomy/buyers";
import { buildCanonical } from "@/domain/taxonomy/resolve";

/**
 * Zero-result intelligence.
 *
 * A search that returns nothing is a buyer stating, in their own words, exactly
 * what the marketplace failed to stock. §3 asks each one to be *classified*
 * rather than acted on: "Do not automatically create pages from every search."
 *
 * The classification is deterministic and explainable. It works by resolving
 * the query against the taxonomy and then asking one question - **which part
 * was missing?**
 *
 *   every term known, page exists, no listings  → supply, not content
 *   every term known, no page for the combination → page opportunity
 *   a term is a real textile word we do not model → taxonomy opportunity
 *   nothing resolves at all                     → probably irrelevant
 *
 * That distinction matters because the fixes are unrelated. Writing a page for
 * a query that failed on supply produces a thin page; onboarding a supplier for
 * a query that failed on vocabulary produces nothing at all.
 */

export type ZeroResultClass =
  | "existing_page_improvement"
  | "new_page_opportunity"
  | "new_taxonomy_opportunity"
  | "supplier_opportunity"
  | "listing_opportunity"
  | "rfq_opportunity"
  | "irrelevant";

export type ZeroResultVerdict = {
  query: string;
  classification: ZeroResultClass;
  /**
   * How much to trust the classification.
   *
   * `low` means the query resolved to nothing at all and used no vocabulary the
   * system recognises - which is what a genuinely irrelevant search looks like
   * *and* what a real fabric name we have never modelled looks like. "neoprene
   * scuba" and "cheap flights" are indistinguishable to a taxonomy that
   * contains neither. Rather than guess confidently, these are marked for
   * review: a wrong `irrelevant` silently discards the most valuable signal
   * the marketplace gets.
   */
  confidence: "high" | "low";
  /** Why this classification, in words. No verdict without a reason. */
  reason: string;
  /** Entities the query did resolve to. */
  resolved: {
    fabric?: string;
    application?: string;
    certification?: string;
    countryCode?: string;
    gsm?: number;
  };
  /** Terms that look like textile vocabulary but are not in the taxonomy. */
  unrecognised: string[];
  /** Where this query should land, if anywhere does. */
  suggestedPath?: string;
};

/**
 * Words that mark a query as textile-domain even when nothing resolves.
 *
 * Used only to separate "a real sourcing query we cannot answer" from noise.
 * Deliberately small: a long list would classify everything as relevant, which
 * is the same as not classifying at all.
 */
const DOMAIN_MARKERS = new Set([
  "fabric",
  "fabrics",
  "textile",
  "textiles",
  "cloth",
  "material",
  "yarn",
  "knit",
  "knitted",
  "woven",
  "weave",
  "dyed",
  "printed",
  "finish",
  "gsm",
  "denier",
  "supplier",
  "suppliers",
  "mill",
  "mills",
  "manufacturer",
  "wholesale",
  "bulk",
  "moq",
  "swatch",
  "sample",
  "roll",
  "meter",
  "metre",
  "yard",
  "kg",
]);

/**
 * Words that qualify a search and *do* map onto the taxonomy.
 *
 * "organic cotton" is not an unmodelled fabric - it is cotton under GOTS. Left
 * out, these words were reported as missing vocabulary and sent a real
 * certification query to the wrong queue.
 */
const QUALIFIER_SYNONYMS: Record<
  string,
  { certification?: string; tag?: string }
> = {
  organic: { certification: "gots", tag: "sustainable" },
  recycled: { certification: "grs", tag: "sustainable" },
  sustainable: { tag: "sustainable" },
  eco: { tag: "sustainable" },
  stretch: { tag: "stretch" },
  stretchy: { tag: "stretch" },
  performance: { tag: "performance" },
  wicking: { tag: "performance" },
};

/** Filler around a real term: "GOTS *certified* cotton" says nothing extra. */
const FILLER = new Set([
  "certified",
  "certification",
  "certificate",
  "grade",
  "quality",
  "type",
  "kind",
  "style",
  "per",
]);

const STOPWORDS = new Set([
  "for",
  "the",
  "a",
  "an",
  "of",
  "in",
  "to",
  "with",
  "and",
  "or",
  "from",
  "best",
  "buy",
  "need",
  "want",
  "looking",
  "find",
  "cheap",
  "good",
  "my",
  "me",
  "i",
]);

function tokens(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

/** Resolves a query against every taxonomy the marketplace knows. */
function resolveQuery(query: string) {
  const lower = query.toLowerCase();
  const resolved: ZeroResultVerdict["resolved"] = {};
  const matched = new Set<string>();

  for (const entry of FABRIC_LOOKUP) {
    if (lower.includes(entry.term)) {
      resolved.fabric ??= entry.slug;
      for (const word of entry.term.split(/\s+/)) matched.add(word);
    }
  }
  for (const application of APPLICATIONS) {
    if (lower.includes(application.name.toLowerCase())) {
      resolved.application ??= application.slug;
      for (const word of application.name.toLowerCase().split(/\s+/)) {
        matched.add(word);
      }
    }
  }
  for (const certification of CERTIFICATIONS) {
    const terms = [
      certification.name.toLowerCase(),
      certification.abbreviation.toLowerCase(),
      certification.slug.replace(/-/g, " "),
    ];
    if (terms.some((term) => lower.includes(term))) {
      resolved.certification ??= certification.slug;
      for (const term of terms) {
        for (const word of term.split(/\s+/)) matched.add(word);
      }
    }
  }
  for (const entry of COUNTRY_LOOKUP) {
    if (lower.includes(entry.term)) {
      resolved.countryCode ??= entry.code;
      for (const word of entry.term.split(/\s+/)) matched.add(word);
    }
  }

  const gsm = lower.match(/(\d{2,4})\s*(gsm|g\/m2|gram)/);
  if (gsm) {
    resolved.gsm = Number(gsm[1]);
    matched.add(gsm[1]);
    matched.add("gsm");
  }

  // Qualifier synonyms resolve to real taxonomy before the leftover check, so
  // "organic" reads as GOTS rather than as missing vocabulary.
  const tags: string[] = [];
  for (const token of tokens(query)) {
    const synonym = QUALIFIER_SYNONYMS[token];
    if (!synonym) continue;
    matched.add(token);
    if (synonym.certification) resolved.certification ??= synonym.certification;
    if (synonym.tag) tags.push(synonym.tag);
  }

  const unrecognised = tokens(query).filter(
    (token) =>
      !matched.has(token) &&
      !DOMAIN_MARKERS.has(token) &&
      !FILLER.has(token) &&
      !/^\d+$/.test(token),
  );

  return { resolved, unrecognised, tags };
}

export function classifyZeroResult(
  query: string,
  listings: FabricListing[],
): ZeroResultVerdict {
  const { resolved, unrecognised, tags } = resolveQuery(query);
  const resolvedCount = Object.keys(resolved).length;

  const base = {
    query,
    resolved,
    unrecognised,
    confidence: "high" as const,
  };

  // Nothing resolved, and nothing in the query even sounds like textiles.
  if (resolvedCount === 0 && !tags.length) {
    const domainish = tokens(query).some((t) => DOMAIN_MARKERS.has(t));
    if (!domainish) {
      return {
        ...base,
        confidence: "low",
        classification: "irrelevant",
        reason:
          "nothing resolved and no textile vocabulary present - but an unmodelled fabric name looks identical, so review before discarding",
      };
    }
    return {
      ...base,
      classification: "new_taxonomy_opportunity",
      reason: `textile query using vocabulary the taxonomy does not model: ${unrecognised.join(", ") || "unrecognised terms"}`,
    };
  }

  // Something resolved, but part of the query is vocabulary we do not model -
  // that missing word is usually the whole point of the search.
  if (unrecognised.length) {
    return {
      ...base,
      classification: "new_taxonomy_opportunity",
      reason: `resolved ${Object.keys(resolved).join(", ")} but "${unrecognised.join('", "')}" is not in the taxonomy`,
      suggestedPath: pathFor(resolved),
    };
  }

  // Everything resolved. So the failure is supply, page coverage, or both.
  const node = resolved.fabric ? getFabric(resolved.fabric) : undefined;
  const matching = node
    ? listings.filter((l) =>
        `${l.material} ${l.construction ?? ""} ${l.name}`
          .toLowerCase()
          .includes(node.name.toLowerCase()),
      )
    : [];

  if (node && matching.length === 0) {
    return {
      ...base,
      classification: "supplier_opportunity",
      reason: `${node.name} is in the taxonomy and has a page, but no supplier lists it`,
      suggestedPath: buildCanonical(node),
    };
  }

  // The fabric has supply, so the buyer's *qualifier* is what failed: a weight,
  // a certificate or an origin nobody stocks.
  if (node && matching.length > 0) {
    // Every unmet qualifier, named the way a buyer said it - a reason that
    // prints a raw slug ("none at gots") is not a reason anyone can act on.
    const qualifiers: string[] = [];
    if (resolved.gsm) qualifiers.push(`at ${resolved.gsm} GSM`);
    if (resolved.certification) {
      const certification = CERTIFICATIONS.find(
        (c) => c.slug === resolved.certification,
      );
      qualifiers.push(
        `holding ${certification?.abbreviation ?? resolved.certification}`,
      );
    }
    if (resolved.countryCode) {
      const country = COUNTRY_LOOKUP.find(
        (c) => c.code === resolved.countryCode,
      );
      qualifiers.push(`from ${country?.name ?? resolved.countryCode}`);
    }

    if (qualifiers.length) {
      return {
        ...base,
        classification: "listing_opportunity",
        reason: `${node.name} has ${matching.length} listings but none ${qualifiers.join(", ")}. Suppliers already here may be able to run it.`,
        suggestedPath: buildCanonical(node),
      };
    }

    // Fabric stocked, no qualifier, still nothing returned - the filters or the
    // page are at fault rather than the marketplace.
    return {
      ...base,
      classification: "existing_page_improvement",
      reason: `${node.name} has ${matching.length} listings; the query should have matched. Check parsing and filters.`,
      suggestedPath: buildCanonical(node),
    };
  }

  // A combination that resolved but has no page of its own.
  if (resolvedCount >= 2) {
    return {
      ...base,
      classification: "new_page_opportunity",
      reason: `${Object.keys(resolved).join(" x ")} resolved, but no page covers that combination`,
      suggestedPath: pathFor(resolved),
    };
  }

  return {
    ...base,
    classification: "rfq_opportunity",
    reason:
      "a real sourcing intent the catalogue cannot answer; an RFQ still reaches mills that can run it",
    suggestedPath: "/rfq/",
  };
}

function pathFor(resolved: ZeroResultVerdict["resolved"]): string | undefined {
  const node = resolved.fabric ? getFabric(resolved.fabric) : undefined;
  if (node) {
    return buildCanonical(node, resolved.gsm, resolved.countryCode);
  }
  if (resolved.application) return `/applications/${resolved.application}/`;
  if (resolved.certification)
    return `/certifications/${resolved.certification}/`;
  return undefined;
}

/** Groups a batch of classified queries, for the admin view. */
export function summariseZeroResults(
  verdicts: ZeroResultVerdict[],
): { classification: ZeroResultClass; count: number; queries: string[] }[] {
  const groups = new Map<ZeroResultClass, string[]>();
  for (const verdict of verdicts) {
    groups.set(verdict.classification, [
      ...(groups.get(verdict.classification) ?? []),
      verdict.query,
    ]);
  }
  return [...groups.entries()]
    .map(([classification, queries]) => ({
      classification,
      count: queries.length,
      queries: queries.slice(0, 20),
    }))
    .sort((a, b) => b.count - a.count);
}
