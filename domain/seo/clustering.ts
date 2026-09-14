import type { KeywordRecord } from "./keywords";

/**
 * Keyword clustering.
 *
 * The problem this solves, from Q21: "Do not let two pages target the same
 * primary keyword" and "Consolidate near-duplicates into one strong page with
 * several entry keywords."
 *
 * "cotton jersey fabric", "cotton jersey material" and "cotton jersey cloth"
 * are one intent wearing three coats. Giving each a page splits authority
 * three ways and makes them compete with each other - cannibalisation, which
 * is the failure mode that gets worse the more pages a site has. So keywords
 * group into a cluster, the cluster gets **one** page, and the rest become
 * secondary terms on it.
 *
 * Clustering is by normalised entity signature rather than string similarity:
 * two keywords belong together when they are about the same things, which is
 * what actually determines whether one page can serve both.
 */

/** Words that carry no distinguishing meaning in fabric search. */
const NOISE = new Set([
  "fabric",
  "fabrics",
  "material",
  "materials",
  "cloth",
  "textile",
  "textiles",
  "the",
  "a",
  "for",
  "of",
  "in",
  "to",
  "buy",
  "best",
]);

/**
 * Terms that change *intent* rather than subject.
 *
 * Kept out of the signature deliberately: "cotton jersey" and "cotton jersey
 * supplier" are the same subject but different jobs, and merging them would
 * put a browsing page and a sourcing page on one URL. They cluster separately.
 */
const INTENT_MARKERS = new Set([
  "supplier",
  "suppliers",
  "manufacturer",
  "manufacturers",
  "wholesale",
  "bulk",
  "exporter",
  "mill",
  "price",
  "vs",
]);

/** The subject a keyword is about, order-independent. */
export function clusterSignature(keyword: string): string {
  const tokens = keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const subject = tokens.filter((t) => !NOISE.has(t) && !INTENT_MARKERS.has(t));
  const markers = tokens.filter((t) => INTENT_MARKERS.has(t));

  // Subject sorted so word order cannot split a cluster; intent kept as a
  // suffix so browsing and sourcing stay apart.
  return [
    [...new Set(subject)].sort().join("-"),
    markers.length ? "intent" : "browse",
  ].join("|");
}

export type KeywordCluster = {
  signature: string;
  /** The one keyword the page leads on. */
  primary: KeywordRecord;
  /** Everything else the page is allowed to answer. */
  secondary: KeywordRecord[];
  /** Where the cluster resolves. Null while unmapped. */
  targetPath: string | null;
};

/**
 * Groups keywords into clusters, one page each.
 *
 * The primary is the shortest keyword in the cluster - the least qualified
 * phrasing is usually the head term for that subject, and the longer variants
 * read naturally as secondary terms on the same page.
 */
export function clusterKeywords(keywords: KeywordRecord[]): KeywordCluster[] {
  const groups = new Map<string, KeywordRecord[]>();
  for (const keyword of keywords) {
    const signature = clusterSignature(keyword.keyword);
    groups.set(signature, [...(groups.get(signature) ?? []), keyword]);
  }

  return [...groups.entries()].map(([signature, members]) => {
    const sorted = [...members].sort(
      (a, b) =>
        a.keyword.length - b.keyword.length ||
        a.keyword.localeCompare(b.keyword),
    );
    const [primary, ...secondary] = sorted;
    return {
      signature,
      primary: { ...primary, role: "primary" as const },
      secondary: secondary.map((k) => ({ ...k, role: "secondary" as const })),
      targetPath: primary.targetPath,
    };
  });
}

/**
 * Cannibalisation: two clusters resolving to the same page.
 *
 * Q20 condition 5 forbids a sibling sharing a primary keyword. This is the
 * inverse check and the one that scales: as combinations multiply, two
 * *different* subjects quietly landing on one URL is far more common than an
 * exact keyword collision, and it is invisible until traffic splits.
 */
export function cannibalisation(
  clusters: KeywordCluster[],
): { targetPath: string; primaries: string[] }[] {
  const byPath = new Map<string, string[]>();
  for (const cluster of clusters) {
    if (!cluster.targetPath) continue;
    byPath.set(cluster.targetPath, [
      ...(byPath.get(cluster.targetPath) ?? []),
      cluster.primary.keyword,
    ]);
  }
  return [...byPath.entries()]
    .filter(([, primaries]) => primaries.length > 1)
    .map(([targetPath, primaries]) => ({ targetPath, primaries }));
}

/** Clusters with no page yet - the research backlog, not a publishing queue. */
export function unmapped(clusters: KeywordCluster[]): KeywordCluster[] {
  return clusters.filter((cluster) => cluster.targetPath === null);
}
