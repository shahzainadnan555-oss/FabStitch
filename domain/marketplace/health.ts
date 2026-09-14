import type { FabricListing } from "@/domain/types";
import { FABRIC_NODES, getFabric } from "@/domain/taxonomy/fabrics";
import { APPLICATIONS } from "@/domain/taxonomy/applications";
import {
  BUYER_SUBCATEGORIES,
  CERTIFICATIONS,
  COUNTRIES,
  countrySlug,
} from "@/domain/taxonomy/buyers";
import { buildCanonical } from "@/domain/taxonomy/resolve";

/**
 * Marketplace health.
 *
 * A young marketplace fails quietly. Nothing crashes when a fabric page has no
 * listings, a buyer type points at applications nothing serves, or a
 * certification names a standard no supplier holds - the page renders, looks
 * finished, and disappoints whoever arrives. Those are the failures that
 * matter, and they are only visible if something counts them.
 *
 * Every check below is computed from the catalogue and the taxonomy. There is
 * no threshold anyone can tune to make the number look better: the only way to
 * move a `blocking` count is to add supply or fix a relationship.
 *
 * Deliberately **not** a score to optimise. The score exists so a change can be
 * compared against the previous run; the issue list is the useful part.
 */

export type HealthSeverity = "blocking" | "warning" | "info";

export type HealthIssue = {
  kind: string;
  severity: HealthSeverity;
  /** What this means and what fixes it. Shown to a human, so plain language. */
  explanation: string;
  count: number;
  /** The specific entities, so the issue is actionable rather than a statistic. */
  examples: { label: string; path: string; detail?: string }[];
};

export type HealthReport = {
  issues: HealthIssue[];
  blocking: number;
  warnings: number;
  /** 0-100. Comparable between runs; meaningless in isolation. */
  score: number;
};

const SAMPLE = 12;

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

/** Fields a buyer filters or decides on. Absence is a real gap, not cosmetic. */
const DECISION_FIELDS = [
  "gsm",
  "width",
  "composition",
  "construction",
  "moq",
  "price",
  "leadTimeDays",
] as const;

export function health(listings: FabricListing[]): HealthReport {
  const issues: HealthIssue[] = [];

  function add(
    kind: string,
    severity: HealthSeverity,
    explanation: string,
    examples: HealthIssue["examples"],
  ) {
    if (!examples.length) return;
    issues.push({
      kind,
      severity,
      explanation,
      count: examples.length,
      examples: examples.slice(0, SAMPLE),
    });
  }

  /* -- Supply gaps -------------------------------------------------------- */

  add(
    "fabric pages without listings",
    "warning",
    "The page renders and explains the cloth, but a buyer who arrives cannot source it here. Fixed by supplier acquisition, never by editing the page.",
    FABRIC_NODES.filter((n) => !listingsForFabric(listings, n.slug).length).map(
      (n) => ({ label: n.name, path: buildCanonical(n) }),
    ),
  );

  add(
    "applications without listings",
    "warning",
    "A buyer searching by what they are making reaches an empty result set. Either no listing declares this application, or nothing in the catalogue serves it.",
    APPLICATIONS.filter(
      (a) => !listings.some((l) => l.applications.includes(a.slug)),
    ).map((a) => ({ label: a.name, path: `/applications/${a.slug}/` })),
  );

  add(
    "countries without supply",
    "warning",
    "A sourcing-origin page with no mills behind it. Country pages are a compliance and lead-time strategy for buyers; an empty one is worse than none.",
    COUNTRIES.filter(
      (c) => !listings.some((l) => l.countryOfOrigin === c.code),
    ).map((c) => ({
      label: c.name,
      path: `/countries/${countrySlug(c.name)}/`,
    })),
  );

  add(
    "certifications with no certified supply",
    "warning",
    "The standard is explained but no listing carries it. The page stays crawlable and flips to indexable on its own once a supplier's certificate is verified.",
    CERTIFICATIONS.filter(
      (c) =>
        !listings.some((l) => l.certifications.some((x) => x.id === c.slug)),
    ).map((c) => ({ label: c.name, path: `/certifications/${c.slug}/` })),
  );

  /* -- Broken relationships ----------------------------------------------- */

  // These are defects in the data, not gaps in supply: something references an
  // entity that does not exist, so a link goes nowhere and a join silently
  // returns empty.
  const fabricSlugs = new Set(FABRIC_NODES.map((n) => n.slug));
  const applicationSlugs = new Set(APPLICATIONS.map((a) => a.slug));

  add(
    "applications naming an unknown fabric",
    "blocking",
    "An application lists a fabric slug the taxonomy does not define. Every relation built from it silently returns nothing.",
    APPLICATIONS.flatMap((a) =>
      a.typicalFabrics
        .filter((f) => !fabricSlugs.has(f))
        .map((f) => ({
          label: `${a.name} → ${f}`,
          path: `/applications/${a.slug}/`,
          detail: `unknown fabric "${f}"`,
        })),
    ),
  );

  add(
    "buyers naming an unknown application",
    "blocking",
    "A buyer subcategory references an application slug that does not exist, so the buyer → application → fabric chain breaks at the first join.",
    BUYER_SUBCATEGORIES.flatMap((b) =>
      b.applications
        .filter((a) => !applicationSlugs.has(a))
        .map((a) => ({
          label: `${b.name} → ${a}`,
          path: `/for/${b.slug}/`,
          detail: `unknown application "${a}"`,
        })),
    ),
  );

  add(
    "listings naming an unknown application",
    "blocking",
    "A listing declares an application the taxonomy does not define, so it never appears on the application page it claims to serve.",
    listings.flatMap((l) =>
      l.applications
        .filter((a) => !applicationSlugs.has(a))
        .map((a) => ({
          label: l.name,
          path: `/listings/${l.slug}/`,
          detail: `unknown application "${a}"`,
        })),
    ),
  );

  add(
    "listings naming an unknown certification",
    "blocking",
    "A listing carries a certificate id the taxonomy does not know. It cannot be verified, and it will not surface under any certification filter.",
    listings.flatMap((l) =>
      l.certifications
        .filter((c) => !CERTIFICATIONS.some((x) => x.slug === c.id))
        .map((c) => ({
          label: l.name,
          path: `/listings/${l.slug}/`,
          detail: `unknown certification "${c.id}"`,
        })),
    ),
  );

  add(
    "listings with an unknown origin",
    "blocking",
    "A listing's country of origin is not a known sourcing origin, so it is missing from every country page and origin facet.",
    listings
      .filter((l) => !COUNTRIES.some((c) => c.code === l.countryOfOrigin))
      .map((l) => ({
        label: l.name,
        path: `/listings/${l.slug}/`,
        detail: `unknown origin "${l.countryOfOrigin}"`,
      })),
  );

  add(
    "orphan fabrics",
    "info",
    "A fabric no application points at. It is reachable by browsing but never by a buyer describing what they are making, which is the primary entry route.",
    FABRIC_NODES.filter(
      (n) => !APPLICATIONS.some((a) => a.typicalFabrics.includes(n.slug)),
    ).map((n) => ({ label: n.name, path: buildCanonical(n) })),
  );

  /* -- Data quality ------------------------------------------------------- */

  add(
    "duplicate listing slugs",
    "blocking",
    "Two listings resolve to one URL. One of them is unreachable.",
    duplicatesBy(listings, (l) => l.slug).map((l) => ({
      label: l.name,
      path: `/listings/${l.slug}/`,
    })),
  );

  // Compared across distinct *supplier records*, not listings. Many listings
  // per supplier is the normal case; counting those as duplicates reported 24
  // collisions against 8 real suppliers.
  const suppliersBySlug = new Map<string, string>();
  for (const listing of listings) {
    suppliersBySlug.set(listing.supplier.slug, listing.supplier.companyName);
  }
  const byNormalisedName = new Map<string, string[]>();
  for (const [slug, name] of suppliersBySlug) {
    const key = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    byNormalisedName.set(key, [...(byNormalisedName.get(key) ?? []), slug]);
  }

  add(
    "possible duplicate suppliers",
    "warning",
    "Two supplier records share a normalised company name. Usually one company onboarded twice; splits listings and supplier counts across both.",
    [...byNormalisedName.values()]
      .filter((slugs) => slugs.length > 1)
      .flatMap((slugs) =>
        slugs.map((slug) => ({
          label: suppliersBySlug.get(slug) ?? slug,
          path: `/suppliers/${slug}/`,
        })),
      ),
  );

  const incomplete = listings
    .map((listing) => {
      const missing = DECISION_FIELDS.filter(
        (field) =>
          listing[field] === undefined ||
          listing[field] === null ||
          (Array.isArray(listing[field]) && !listing[field].length),
      );
      return { listing, missing };
    })
    .filter((entry) => entry.missing.length > 0);

  add(
    "listings missing decision fields",
    "warning",
    "A listing without MOQ, price band or lead time cannot answer the question a buyer arrived with, and drags down the completeness score its pages are gated on.",
    incomplete.map(({ listing, missing }) => ({
      label: listing.name,
      path: `/listings/${listing.slug}/`,
      detail: `missing ${missing.join(", ")}`,
    })),
  );

  /* -- Score -------------------------------------------------------------- */

  const blocking = issues
    .filter((i) => i.severity === "blocking")
    .reduce((sum, i) => sum + i.count, 0);
  const warnings = issues
    .filter((i) => i.severity === "warning")
    .reduce((sum, i) => sum + i.count, 0);

  // Blocking issues are defects and cost heavily; warnings are usually supply
  // gaps, which are a young marketplace's normal state and cost a little.
  const score = Math.max(
    0,
    Math.round(100 - blocking * 5 - Math.min(40, warnings * 0.5)),
  );

  return {
    issues: issues.sort(
      (a, b) => weight(b.severity) - weight(a.severity) || b.count - a.count,
    ),
    blocking,
    warnings,
    score,
  };
}

function weight(severity: HealthSeverity): number {
  return severity === "blocking" ? 2 : severity === "warning" ? 1 : 0;
}

function duplicatesBy<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    seen.set(k, (seen.get(k) ?? 0) + 1);
  }
  return items.filter((item) => (seen.get(key(item)) ?? 0) > 1);
}
