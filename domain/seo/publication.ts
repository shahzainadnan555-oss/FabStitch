export const SEO_PUBLICATION_STATUSES = [
  "draft",
  "scheduled",
  "published_noindex",
  "published_indexable",
  "archived",
] as const;

export type SeoPublicationStatus =
  (typeof SEO_PUBLICATION_STATUSES)[number];

export type ScheduledIndexability =
  | "published_noindex"
  | "published_indexable";

export type SeoPublication =
  | {
      status: Exclude<SeoPublicationStatus, "scheduled">;
      publishAt?: never;
      scheduledAs?: never;
      replacementPath?: string;
    }
  | {
      status: "scheduled";
      publishAt: string;
      scheduledAs: ScheduledIndexability;
      replacementPath?: never;
    };

export const SEO_LAUNCH_PHASES = [
  "phase_1_core",
  "phase_2_fabric_families",
  "phase_3_fabric_types",
  "phase_4_best_for",
  "phase_5_collections",
  "phase_6_guides",
] as const;

export type SeoLaunchPhase = (typeof SEO_LAUNCH_PHASES)[number];

export type EffectivePublicationStatus =
  | "unavailable"
  | "published_noindex"
  | "published_indexable";

export type ResolvedPublication = {
  configuredStatus: SeoPublicationStatus;
  effectiveStatus: EffectivePublicationStatus;
  isPublic: boolean;
  isIndexable: boolean;
  isSitemapEligible: boolean;
  isInternalLinkEligible: boolean;
  publishAt?: string;
  replacementPath?: string;
};

export function canonicalSeoPath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0] || "/";
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, "/").toLowerCase();
  return collapsed === "/" ? "/" : `${collapsed.replace(/\/+$/, "")}/`;
}

export function resolvePublication(
  publication: SeoPublication,
  now = new Date(),
): ResolvedPublication {
  if (publication.status === "scheduled") {
    const publishTime = Date.parse(publication.publishAt);
    const hasPublished =
      Number.isFinite(publishTime) && now.getTime() >= publishTime;

    if (!hasPublished) {
      return {
        configuredStatus: publication.status,
        effectiveStatus: "unavailable",
        isPublic: false,
        isIndexable: false,
        isSitemapEligible: false,
        isInternalLinkEligible: false,
        publishAt: publication.publishAt,
      };
    }

    const isIndexable = publication.scheduledAs === "published_indexable";
    return {
      configuredStatus: publication.status,
      effectiveStatus: publication.scheduledAs,
      isPublic: true,
      isIndexable,
      isSitemapEligible: isIndexable,
      isInternalLinkEligible: true,
      publishAt: publication.publishAt,
    };
  }

  if (
    publication.status === "draft" ||
    publication.status === "archived"
  ) {
    return {
      configuredStatus: publication.status,
      effectiveStatus: "unavailable",
      isPublic: false,
      isIndexable: false,
      isSitemapEligible: false,
      isInternalLinkEligible: false,
      replacementPath: publication.replacementPath
        ? canonicalSeoPath(publication.replacementPath)
        : undefined,
    };
  }

  const isIndexable = publication.status === "published_indexable";
  return {
    configuredStatus: publication.status,
    effectiveStatus: publication.status,
    isPublic: true,
    isIndexable,
    isSitemapEligible: isIndexable,
    isInternalLinkEligible: true,
  };
}

export function assertPublication(publication: SeoPublication): void {
  if (publication.status !== "scheduled") return;
  if (!Number.isFinite(Date.parse(publication.publishAt))) {
    throw new Error(
      `Scheduled SEO publication has an invalid publishAt value: ${publication.publishAt}`,
    );
  }
}
