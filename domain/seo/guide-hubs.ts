import type { Guide } from "@/repositories/guides";

/**
 * Topical hubs over the published guides.
 *
 * A hub is a *view* of what has been published, not a page in its own right.
 * That distinction is the whole design: a hub cannot be empty and stale,
 * because it has no content of its own to go stale — it renders whatever
 * currently matches, and if nothing matches it does not exist as a URL at all.
 *
 * The alternative — hand-written hub pages listing links — is how a site ends
 * up with `/guides/fabric-sourcing/` promising eight articles and delivering
 * two, then promising them for a year after the other six were archived.
 *
 * Hubs live at `/guides/{hub}/`, the same level as an article. The resolver in
 * the route checks hubs first, and `RESERVED_HUB_SLUGS` is exported so the
 * publication source can refuse an article slug that would shadow one.
 */

export type GuideHub = {
  slug: string;
  title: string;
  /** The H1. Written as a statement of what is here, not as a label. */
  heading: string;
  intro: string;
  /** Which published guides belong. Pure, so it can run anywhere. */
  matches: (guide: Guide) => boolean;
};

/**
 * Hub definitions.
 *
 * Predicates match on `type` and `cluster` — both editorial fields — rather
 * than on the slug or the title. Matching on a string in the title would mean
 * renaming an article silently drops it out of its hub.
 */
export const GUIDE_HUBS: GuideHub[] = [
  {
    slug: "2027-fabric-directions",
    title: "2027 fabric directions",
    heading: "The materials shaping FabStitch's 2027 collection",
    intro:
      "Seasonal guides grounded in the FabStitch sourcing reference, without treating a forecast as certainty.",
    matches: (guide) => guide.cluster === "2027-directions",
  },
  {
    slug: "fabric-education",
    title: "Fabric education",
    heading: "Understand fabric through construction and specification",
    intro:
      "Practical explanations of weight, construction and material differences using real FabStitch products.",
    matches: (guide) =>
      guide.type === "technical_guide" ||
      guide.type === "comparison" ||
      guide.cluster === "fabric-education",
  },
  {
    slug: "choosing-fabrics",
    title: "Choosing fabrics",
    heading: "Choose fabric for what you are making",
    intro:
      "Product-led guides that connect a garment or use case to documented FabStitch fabrics.",
    matches: (guide) =>
      guide.type === "buyer_guide" ||
      guide.cluster === "choosing-fabrics",
  },
];

/**
 * Slugs a hub occupies, so an article cannot shadow one.
 *
 * Exported rather than duplicated: two lists of reserved names
 * drift, and the failure mode is an article that publishes successfully and
 * then cannot be reached because a hub answers its URL.
 */
export const RESERVED_HUB_SLUGS: readonly string[] = GUIDE_HUBS.map(
  (hub) => hub.slug,
);

export function findHub(slug: string): GuideHub | undefined {
  return GUIDE_HUBS.find((hub) => hub.slug === slug);
}

/**
 * Hubs that currently have something in them.
 *
 * The only function that decides whether a hub URL exists. A hub with nothing
 * behind it is not rendered, is not linked and is not in the sitemap — the
 * empty-category-hub problem solved by construction rather than by discipline.
 */
export function populatedHubs(
  guides: Guide[],
): { hub: GuideHub; guides: Guide[] }[] {
  return GUIDE_HUBS.map((hub) => ({
    hub,
    guides: guides.filter((guide) => hub.matches(guide)),
  })).filter((entry) => entry.guides.length >= 2);
}
