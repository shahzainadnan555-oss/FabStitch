import type { Certification, FabricFamily, FabricNode } from "@/domain/types";
import { FABRIC_FAMILIES, FABRIC_NODES, FABRIC_PROPERTY_HUBS } from "./fabrics";
import { CERTIFICATIONS, COUNTRIES } from "./buyers";

/**
 * Resolves a `/fabrics/[...path]` URL against the taxonomy.
 *
 * This is the single decision that makes the SEO ceiling reachable without new
 * components: fabric, fabric × construction, fabric × GSM and fabric × country
 * are **one template resolving a path**, not four page types.
 *
 * /fabrics/cotton/ → family
 * /fabrics/knitted/ → property hub (tag-generated)
 * /fabrics/cotton/jersey/ → node
 * /fabrics/cotton/jersey/180-gsm/ → node + specification
 * /fabrics/cotton/jersey/180-gsm/pakistan/ → node + specification + origin
 * /fabrics/knits/jersey/gots/ → node + certification
 *
 * Trailing qualifiers are stripped first, because a country narrows an
 * existing page rather than reclassifying it (docs/ARCHITECTURE.md §5). A
 * certification narrows it the same way, so it is stripped by the same loop
 * rather than becoming a fourth template - Tier 8 in the keyword strategy
 * ("GOTS certified organic cotton fabric") is a filter on a fabric page, not a
 * new kind of page.
 */

export type FabricRoute = {
  kind: "family" | "node" | "property";
  family?: FabricFamily;
  node?: FabricNode;
  property?: { slug: string; name: string };
  /** GSM taken from a `180-gsm` segment. */
  gsm?: number;
  /** ISO country code taken from a trailing origin segment. */
  countryCode?: string;
  countryName?: string;
  /** Certification taken from a trailing segment, e.g. `.../jersey/gots/`. */
  certification?: Certification;
  /** Canonical path for this resolution, always with a trailing slash. */
  canonical: string;
  title: string;
};

const COUNTRY_BY_SLUG = new Map(
  COUNTRIES.map((c) => [c.name.toLowerCase().replace(/\W+/g, "-"), c]),
);

const CERT_BY_SLUG = new Map(CERTIFICATIONS.map((c) => [c.slug, c]));
const NODE_BY_SLUG = new Map(FABRIC_NODES.map((n) => [n.slug, n]));
const FAMILY_BY_SLUG = new Map(FABRIC_FAMILIES.map((f) => [f.slug, f]));
// Explicitly widened: FABRIC_PROPERTY_HUBS is `as const`, so an inferred map
// would key on the literal union and reject an arbitrary path segment.
const PROPERTY_BY_SLUG = new Map<string, { slug: string; name: string }>(
  FABRIC_PROPERTY_HUBS.map((h) => [h.slug, { slug: h.slug, name: h.name }]),
);

export function resolveFabricPath(segments: string[]): FabricRoute | null {
  const path = [...segments];
  let gsm: number | undefined;
  let countryCode: string | undefined;
  let countryName: string | undefined;
  let certification: Certification | undefined;

  // Strip every trailing qualifier, in whatever order they appear. A loop
  // rather than a fixed sequence: the qualifiers are independent, and
  // hard-coding one order silently 404s the others.
  while (path.length > 1) {
    const last = path[path.length - 1];

    const country = COUNTRY_BY_SLUG.get(last);
    if (country && !countryCode) {
      countryCode = country.code;
      countryName = country.name;
      path.pop();
      continue;
    }

    const cert = CERT_BY_SLUG.get(last);
    if (cert && !certification) {
      certification = cert;
      path.pop();
      continue;
    }

    const gsmMatch = last?.match(/^(\d{2,4})-gsm$/);
    if (gsmMatch && !gsm) {
      gsm = Number(gsmMatch[1]);
      path.pop();
      continue;
    }

    break;
  }

  if (!path.length) return null;

  const leaf = path[path.length - 1];

  const node = NODE_BY_SLUG.get(leaf);
  if (node) {
    // A one-segment path is a supported alias, but a nested path has to be
    // the node's real ancestry. Matching only the leaf made
    // `/fabrics/linen/jersey/` resolve as cotton jersey.
    const expected = ancestry(node).map((part) => part.slug);
    if (path.length > 1 && path.join("/") !== expected.join("/")) return null;

    return {
      kind: "node",
      node,
      family: FAMILY_BY_SLUG.get(node.family),
      gsm,
      countryCode,
      countryName,
      certification,
      canonical: buildCanonical(node, gsm, countryCode, certification?.slug),
      title: buildTitle(node.name, gsm, countryName, certification),
    };
  }

  const family = FAMILY_BY_SLUG.get(leaf);
  if (family) {
    return {
      kind: "family",
      family,
      gsm,
      countryCode,
      countryName,
      certification,
      canonical: `/fabrics/${family.slug}/`,
      title: buildTitle(family.name, gsm, countryName, certification),
    };
  }

  const property = PROPERTY_BY_SLUG.get(leaf);
  if (property) {
    return {
      kind: "property",
      property,
      canonical: `/fabrics/${property.slug}/`,
      title: property.name,
    };
  }

  return null;
}

export function buildCanonical(
  node: FabricNode,
  gsm?: number,
  countryCode?: string,
  certificationSlug?: string,
): string {
  const chain = ancestry(node).map((n) => n.slug);
  const parts = ["fabrics", ...chain];
  if (gsm) parts.push(`${gsm}-gsm`);
  if (certificationSlug) parts.push(certificationSlug);
  if (countryCode) {
    const country = COUNTRIES.find((c) => c.code === countryCode);
    if (country) parts.push(country.name.toLowerCase().replace(/\W+/g, "-"));
  }
  return `/${parts.join("/")}/`;
}

function buildTitle(
  base: string,
  gsm?: number,
  countryName?: string,
  certification?: Certification,
): string {
  const parts: string[] = [];
  if (gsm) parts.push(`${gsm} GSM`);
  // "GOTS certified organic cotton" - the certificate leads, because that is
  // the constraint the buyer is searching under (keyword strategy, Tier 8).
  if (certification) parts.push(`${certification.abbreviation} certified`);
  parts.push(base);
  if (countryName) parts.push(`from ${countryName}`);
  return parts.join(" ");
}

/** Root-to-leaf chain for a node, used by breadcrumbs and canonical URLs. */
export function ancestry(node: FabricNode): FabricNode[] {
  const chain: FabricNode[] = [node];
  let cursor = node;
  const guard = new Set([node.slug]);

  while (cursor.parentSlug) {
    const parent = NODE_BY_SLUG.get(cursor.parentSlug);
    if (!parent || guard.has(parent.slug)) break;
    guard.add(parent.slug);
    chain.unshift(parent);
    cursor = parent;
  }
  return chain;
}

export function childrenOf(slug: string): FabricNode[] {
  return FABRIC_NODES.filter((n) => n.parentSlug === slug);
}

/**
 * Standard GSM bands offered as child pages for a fabric.
 *
 * Only values inside the fabric's real commercial range are offered - the
 * research forbids generating a spec page for a weight nobody buys.
 */
export function gsmBandsFor(node: FabricNode): number[] {
  if (!node.gsmRange) return [];
  const [min, max] = node.gsmRange;
  const standard = [
    100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 320, 360, 400, 450, 500,
  ];
  return standard.filter((value) => value >= min && value <= max);
}

/** Every path the fabric templates can currently render, for sitemaps. */
export function allFabricPaths(): string[] {
  const paths: string[] = [];
  for (const family of FABRIC_FAMILIES) paths.push(`/fabrics/${family.slug}/`);
  for (const hub of FABRIC_PROPERTY_HUBS) paths.push(`/fabrics/${hub.slug}/`);
  for (const node of FABRIC_NODES) {
    paths.push(buildCanonical(node));
    for (const gsm of gsmBandsFor(node)) {
      paths.push(buildCanonical(node, gsm));
    }
  }
  return paths;
}
