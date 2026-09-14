import type { FabricListing, FabricNode } from "@/domain/types";
import { FABRIC_NODES, getFabric } from "@/domain/taxonomy/fabrics";
import { applicationsForFabric } from "@/domain/taxonomy/relations";

/**
 * Fabric-type comparison.
 *
 * Distinct from listing comparison, which compares what four mills are
 * offering. This compares the *materials* - cotton jersey against polyester
 * jersey - which is the question a buyer asks before they have a shortlist.
 *
 * Two kinds of row, kept visibly separate because they carry different
 * authority:
 *
 *   **Declared** comes from the taxonomy. It is what the fabric is.
 *   **Observed** is counted from live listings. It is what the marketplace
 *   currently holds, and it changes as suppliers onboard.
 *
 * Anything neither source states is `null`, which renders as "Not specified".
 * There is no third category of plausible-looking value: a comparison table
 * that guesses is worse than one that admits a gap, because a buyer will
 * specify against it.
 */

export type ComparisonValue = {
  /** Null means the data does not state it. Never a guess, never a default. */
  value: string | null;
  /** Where it came from, so a buyer can weigh it. */
  source: "declared" | "observed";
};

export type ComparisonRow = {
  label: string;
  /** One entry per fabric, in the order the fabrics were requested. */
  values: ComparisonValue[];
};

export type FabricComparison = {
  fabrics: FabricNode[];
  declared: ComparisonRow[];
  observed: ComparisonRow[];
};

const FIBRE_ORIGIN_LABEL: Record<string, string> = {
  natural: "Natural",
  synthetic: "Synthetic",
  regenerated: "Regenerated",
  blend: "Blend",
};

const CONSTRUCTION_LABEL: Record<string, string> = {
  knit: "Knitted",
  woven: "Woven",
  nonwoven: "Non-woven",
};

function declared(value: string | null): ComparisonValue {
  return { value, source: "declared" };
}
function observed(value: string | null): ComparisonValue {
  return { value, source: "observed" };
}

/** Listings that belong to a fabric, matched the way the marketplace matches. */
function listingsFor(
  node: FabricNode,
  listings: FabricListing[],
): FabricListing[] {
  const names = [node.name.toLowerCase(), ...(node.aliases ?? [])];
  return listings.filter((listing) => {
    const haystack =
      `${listing.material} ${listing.construction ?? ""} ${listing.name}`.toLowerCase();
    return names.some((name) => haystack.includes(name));
  });
}

function range(values: number[], unit: string): string | null {
  if (!values.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? `${min} ${unit}` : `${min}-${max} ${unit}`;
}

export function compareFabrics(
  slugs: string[],
  listings: FabricListing[],
): FabricComparison | null {
  const fabrics = slugs
    .map(getFabric)
    .filter((node): node is FabricNode => node !== undefined);
  if (fabrics.length < 2) return null;

  const sets = fabrics.map((node) => listingsFor(node, listings));

  const declaredRows: ComparisonRow[] = [
    {
      label: "Family",
      values: fabrics.map((f) => declared(f.family)),
    },
    {
      label: "Fibre origin",
      values: fabrics.map((f) =>
        declared(FIBRE_ORIGIN_LABEL[f.fibreOrigin] ?? f.fibreOrigin),
      ),
    },
    {
      label: "Construction",
      values: fabrics.map((f) =>
        declared(
          CONSTRUCTION_LABEL[f.constructionClass] ?? f.constructionClass,
        ),
      ),
    },
    {
      label: "Typical weight",
      values: fabrics.map((f) =>
        declared(f.gsmRange ? `${f.gsmRange[0]}-${f.gsmRange[1]} GSM` : null),
      ),
    },
    {
      label: "Properties",
      values: fabrics.map((f) =>
        declared(f.tags?.length ? f.tags.join(", ") : null),
      ),
    },
    {
      label: "Typical applications",
      values: fabrics.map((f) => {
        const apps = applicationsForFabric(f.slug, 4).map((a) => a.label);
        return declared(apps.length ? apps.join(", ") : null);
      }),
    },
  ];

  const observedRows: ComparisonRow[] = [
    {
      label: "Listings",
      values: sets.map((set) =>
        observed(set.length ? String(set.length) : null),
      ),
    },
    {
      label: "Suppliers",
      values: sets.map((set) => {
        const count = new Set(set.map((l) => l.supplier.slug)).size;
        return observed(count ? String(count) : null);
      }),
    },
    {
      label: "Weight offered",
      values: sets.map((set) =>
        observed(
          range(
            set.map((l) => l.gsm?.value).filter((v): v is number => !!v),
            "GSM",
          ),
        ),
      ),
    },
    {
      label: "Width offered",
      values: sets.map((set) => {
        const cm = set
          .map((l) =>
            l.width
              ? l.width.unit === "cm"
                ? l.width.value
                : Math.round(l.width.value * 2.54)
              : undefined,
          )
          .filter((v): v is number => !!v);
        return observed(range(cm, "cm"));
      }),
    },
    {
      label: "MOQ from",
      values: sets.map((set) => {
        const moqs = set
          .map((l) => l.moq?.value)
          .filter((v): v is number => typeof v === "number");
        return observed(
          moqs.length
            ? `${Math.min(...moqs)} ${set[0]?.moq?.unit ?? ""}`.trim()
            : null,
        );
      }),
    },
    {
      label: "Origins",
      values: sets.map((set) => {
        const origins = [...new Set(set.map((l) => l.countryOfOrigin))];
        return observed(origins.length ? origins.join(", ") : null);
      }),
    },
    {
      label: "Certifications held",
      values: sets.map((set) => {
        const certs = [
          ...new Set(set.flatMap((l) => l.certifications.map((c) => c.name))),
        ];
        return observed(certs.length ? certs.join(", ") : null);
      }),
    },
  ];

  return { fabrics, declared: declaredRows, observed: observedRows };
}

/**
 * Fabrics worth comparing against this one.
 *
 * Ranked by shared applications, not by family. A buyer choosing cloth for
 * t-shirts wants cotton jersey against polyester jersey - two different
 * families - and does not want cotton jersey against cotton canvas, which
 * shares a family and nothing else. Overlap of *use* is the real axis of
 * comparison.
 */
export function comparableWith(slug: string, limit = 4): FabricNode[] {
  const node = getFabric(slug);
  if (!node) return [];

  const mine = new Set(applicationsForFabric(slug, 20).map((a) => a.href));
  if (!mine.size) return [];

  return FABRIC_NODES.filter((candidate) => candidate.slug !== slug)
    .map((candidate) => {
      const theirs = applicationsForFabric(candidate.slug, 20);
      const shared = theirs.filter((a) => mine.has(a.href)).length;
      return { candidate, shared };
    })
    .filter((entry) => entry.shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}
