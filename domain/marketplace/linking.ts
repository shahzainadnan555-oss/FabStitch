import type { FabricListing } from "@/domain/types";
import { FABRIC_NODES } from "@/domain/taxonomy/fabrics";
import { APPLICATIONS } from "@/domain/taxonomy/applications";
import {
  BUYER_SUBCATEGORIES,
  COUNTRIES,
  countrySlug,
} from "@/domain/taxonomy/buyers";
import { buildCanonical } from "@/domain/taxonomy/resolve";
import {
  applicationsForFabric,
  buyersForApplication,
  buyersForFabric,
  fabricsForApplication,
  fabricsForBuyer,
  originsInResults,
  siblingFabrics,
} from "@/domain/taxonomy/relations";

/**
 * Internal link graph.
 *
 * §18 asks for orphan, weakly-linked and overlinked pages to be identified from
 * "actual marketplace relationships". That is exactly what the taxonomy is, so
 * the graph is derived from the same relation functions the pages render, not
 * from crawling HTML - a crawl reports what shipped, this reports what the
 * data says *should* ship, and the difference between them is the bug.
 *
 * The distinction that matters here is **orphan vs weak**:
 *
 *   An orphan has no inbound link at all. It can only be found by a crawler
 *   that already knows the URL, which for a programmatic page means never.
 *
 *   A weakly-linked page has one or two. It is reachable but carries almost no
 *   internal authority, and on a marketplace that is usually a page whose
 *   relationships exist in the data and were not rendered.
 *
 * Overlinking is included because it is the failure that looks like success:
 * a hub linked from every page passes authority to nothing in particular.
 */

export type LinkNode = {
  path: string;
  type: "fabric" | "application" | "buyer" | "country" | "certification";
  label: string;
  inbound: number;
  outbound: number;
};

export type LinkGraph = {
  nodes: Map<string, LinkNode>;
  edges: { from: string; to: string }[];
};

/** Builds the graph the templates would render from the taxonomy. */
export function buildLinkGraph(listings: FabricListing[]): LinkGraph {
  const nodes = new Map<string, LinkNode>();
  const edges: { from: string; to: string }[] = [];

  const node = (
    path: string,
    type: LinkNode["type"],
    label: string,
  ): LinkNode => {
    const existing = nodes.get(path);
    if (existing) return existing;
    const created = { path, type, label, inbound: 0, outbound: 0 };
    nodes.set(path, created);
    return created;
  };

  const link = (from: string, to: string) => {
    if (from === to) return;
    const source = nodes.get(from);
    const target = nodes.get(to);
    if (!source || !target) return;
    source.outbound += 1;
    target.inbound += 1;
    edges.push({ from, to });
  };

  // Register every node first: an edge to a page nobody has declared is how a
  // link graph ends up quietly lying about reachability.
  for (const fabric of FABRIC_NODES) {
    node(buildCanonical(fabric), "fabric", fabric.name);
  }
  for (const application of APPLICATIONS) {
    node(`/applications/${application.slug}/`, "application", application.name);
  }
  for (const buyer of BUYER_SUBCATEGORIES) {
    node(`/for/${buyer.slug}/`, "buyer", buyer.name);
  }
  for (const country of COUNTRIES) {
    node(`/countries/${countrySlug(country.name)}/`, "country", country.name);
  }

  // Edges, taken from the same relation functions the templates call.
  for (const fabric of FABRIC_NODES) {
    const from = buildCanonical(fabric);
    for (const related of applicationsForFabric(fabric.slug, 99)) {
      link(from, related.href);
    }
    for (const sibling of siblingFabrics(fabric.slug, 99)) {
      link(from, sibling.href);
    }
    // "Sourced by" on the fabric template. Without this edge every buyer page
    // read as an orphan while the site links to all of them.
    for (const buyer of buyersForFabric(fabric.slug, 99)) {
      link(from, buyer.href);
    }
    // "Origins in these results" - supply-driven, so it only exists where the
    // fabric is actually listed from somewhere.
    for (const origin of originsInResults(
      listings.filter((l) => l.material === (fabric.slug as never)),
      99,
    )) {
      link(from, origin.href);
    }
  }

  for (const application of APPLICATIONS) {
    const from = `/applications/${application.slug}/`;
    for (const fabric of fabricsForApplication(application.slug, 99)) {
      link(from, fabric.href);
    }
    for (const buyer of buyersForApplication(application.slug, 99)) {
      link(from, buyer.href);
    }
  }

  for (const buyer of BUYER_SUBCATEGORIES) {
    const from = `/for/${buyer.slug}/`;
    for (const fabric of fabricsForBuyer(buyer.slug, 99)) {
      link(from, fabric.href);
    }
    for (const slug of buyer.applications) {
      link(from, `/applications/${slug}/`);
    }
  }

  // Country pages link to the fabrics actually listed from that origin - the
  // only edge in this graph that comes from supply rather than taxonomy.
  for (const country of COUNTRIES) {
    const from = `/countries/${countrySlug(country.name)}/`;
    const materials = new Set(
      listings
        .filter((l) => l.countryOfOrigin === country.code)
        .map((l) => l.material),
    );
    for (const fabric of FABRIC_NODES) {
      if (materials.has(fabric.slug as never))
        link(from, buildCanonical(fabric));
    }
  }

  return { nodes, edges };
}

export type LinkFinding = {
  severity: "orphan" | "weak" | "overlinked";
  node: LinkNode;
  /** Concrete pages that should link here, from relations already in the data. */
  suggestions: { path: string; label: string; because: string }[];
};

/**
 * Pages the graph says are unreachable or nearly so.
 *
 * Every finding carries **where the link should come from**, because "this page
 * is an orphan" is an observation and "these four applications already name
 * this fabric" is a fix.
 */
export function linkFindings(graph: LinkGraph): LinkFinding[] {
  const findings: LinkFinding[] = [];
  const inboundCounts = [...graph.nodes.values()].map((n) => n.inbound);
  // Overlinked is relative to this site, not to an absolute number: a hub with
  // 40 inbound links is normal on a large site and dominant on a small one.
  const mean =
    inboundCounts.reduce((sum, n) => sum + n, 0) /
    Math.max(1, inboundCounts.length);
  const overlinkThreshold = Math.max(20, mean * 6);

  for (const node of graph.nodes.values()) {
    if (node.inbound === 0) {
      findings.push({
        severity: "orphan",
        node,
        suggestions: sourcesFor(node, graph),
      });
    } else if (node.inbound <= 2) {
      findings.push({
        severity: "weak",
        node,
        suggestions: sourcesFor(node, graph),
      });
    } else if (node.inbound > overlinkThreshold) {
      findings.push({ severity: "overlinked", node, suggestions: [] });
    }
  }

  const rank = { orphan: 0, weak: 1, overlinked: 2 };
  return findings.sort(
    (a, b) =>
      rank[a.severity] - rank[b.severity] || a.node.inbound - b.node.inbound,
  );
}

/** Pages whose data already relates to this one but that do not link to it. */
function sourcesFor(
  node: LinkNode,
  graph: LinkGraph,
): LinkFinding["suggestions"] {
  if (node.type !== "fabric") return [];

  const fabric = FABRIC_NODES.find((f) => buildCanonical(f) === node.path);
  if (!fabric) return [];

  const linked = new Set(
    graph.edges.filter((e) => e.to === node.path).map((e) => e.from),
  );

  const suggestions: LinkFinding["suggestions"] = [];

  for (const application of APPLICATIONS) {
    if (!application.typicalFabrics.includes(fabric.slug)) continue;
    const path = `/applications/${application.slug}/`;
    if (linked.has(path)) continue;
    suggestions.push({
      path,
      label: application.name,
      because: `${application.name} names ${fabric.name.toLowerCase()} as a typical fabric`,
    });
  }

  for (const sibling of FABRIC_NODES) {
    if (sibling.slug === fabric.slug || sibling.family !== fabric.family)
      continue;
    const path = buildCanonical(sibling);
    if (linked.has(path)) continue;
    suggestions.push({
      path,
      label: sibling.name,
      because: `same family (${fabric.family})`,
    });
    if (suggestions.length >= 6) break;
  }

  return suggestions.slice(0, 6);
}

/** Counts, for the health header. */
export function linkSummary(findings: LinkFinding[]) {
  return {
    orphans: findings.filter((f) => f.severity === "orphan").length,
    weak: findings.filter((f) => f.severity === "weak").length,
    overlinked: findings.filter((f) => f.severity === "overlinked").length,
  };
}
