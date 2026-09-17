import { CURATED_FABRIC_SLUGS } from "@/catalog";
import {
  SEO_LAUNCH_PHASES,
  canonicalSeoPath,
  resolvePublication,
  type SeoLaunchPhase,
  type SeoPublication,
  type ResolvedPublication,
} from "@/domain/seo/publication";

/**
 * Frontend-owned publication source for the current no-backend phase.
 *
 * This is deliberately configuration, not a page builder. A future FabStitch
 * publishing service can implement the same record contract, but no network
 * adapter or future-backend URL belongs in this repository today.
 *
 * Scheduled changes are evaluated when the frontend is built. Publishing a
 * scheduled static page therefore requires a rebuild/deploy after publishAt.
 */

export const ACTIVE_SEO_LAUNCH_PHASE: SeoLaunchPhase = "phase_6_guides";

const phaseRank = new Map(
  SEO_LAUNCH_PHASES.map((phase, index) => [phase, index + 1]),
);

const INDEXABLE_FABRIC_PATHS = new Set(
  CURATED_FABRIC_SLUGS.map((slug) => `/fabrics/${slug}/`),
);

/**
 * Sparse exceptions for editorial launch control. Keep the catalogue and page
 * data in their existing authoritative sources; this object controls only
 * route publication. It is intentionally empty until an editor records a
 * draft, schedule, archive or one-page launch exception.
 */
export const SEO_PUBLICATION_OVERRIDES: Readonly<
  Record<string, SeoPublication>
> = Object.freeze({});

export type SeoPublicationRequest = {
  path: string;
  type: string;
  qualityGatePassed: boolean;
};

export interface SeoPublicationSource {
  publicationForPage(input: SeoPublicationRequest): SeoPublication;
}

export function launchPhaseForPageType(type: string): SeoLaunchPhase {
  switch (type) {
    case "collection":
      return "phase_2_fabric_families";
    case "fabric":
      return "phase_3_fabric_types";
    case "best_for":
    case "best_for_hub":
      return "phase_4_best_for";
    case "seasonal_collection":
      return "phase_5_collections";
    case "guide":
    case "guide_hub":
      return "phase_6_guides";
    case "semantic_landing":
      return "phase_1_core";
    default:
      return "phase_1_core";
  }
}

export function launchBatchForPage(type: string, path: string): string {
  if (type === "fabric") {
    return INDEXABLE_FABRIC_PATHS.has(canonicalSeoPath(path))
      ? "curated-fabric-foundation"
      : "fabric-catalog-holdback";
  }
  return launchPhaseForPageType(type).replace(/_/g, "-");
}

function localPublicationForPage(input: SeoPublicationRequest): SeoPublication {
  const path = canonicalSeoPath(input.path);
  const override = SEO_PUBLICATION_OVERRIDES[path];
  if (override) return override;

  if (
    input.type === "private" ||
    input.type === "support" ||
    input.type === "legal"
  ) {
    return { status: "published_noindex" };
  }

  if (!input.qualityGatePassed) {
    return { status: "published_noindex" };
  }

  const pagePhase = launchPhaseForPageType(input.type);
  const activeRank = phaseRank.get(ACTIVE_SEO_LAUNCH_PHASE) ?? 0;
  const pageRank = phaseRank.get(pagePhase) ?? Number.MAX_SAFE_INTEGER;
  if (pageRank > activeRank) return { status: "published_noindex" };

  // The catalogue can remain completely browseable while only the approved
  // launch edit becomes indexable. This is the key distinction between public
  // product discovery and controlled organic landing-page rollout.
  if (input.type === "fabric" && !INDEXABLE_FABRIC_PATHS.has(path)) {
    return { status: "published_noindex" };
  }

  return { status: "published_indexable" };
}

export const LOCAL_SEO_PUBLICATION_SOURCE: SeoPublicationSource = {
  publicationForPage: localPublicationForPage,
};

export function publicationForPage(
  input: SeoPublicationRequest,
): SeoPublication {
  return LOCAL_SEO_PUBLICATION_SOURCE.publicationForPage(input);
}

export function isCuratedFabricLaunchPath(path: string): boolean {
  return INDEXABLE_FABRIC_PATHS.has(canonicalSeoPath(path));
}

export function publicationOverrideForPath(
  path: string,
  now = new Date(),
): ResolvedPublication | null {
  const publication = SEO_PUBLICATION_OVERRIDES[canonicalSeoPath(path)];
  return publication ? resolvePublication(publication, now) : null;
}
