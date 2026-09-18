import type { Metadata } from "next";
import type { Crumb } from "@/components/ui/breadcrumbs";
import type { SeoPage } from "@/lib/api/types";
import { BRAND_NAME, cleanPageTitle, metadataTitle } from "@/lib/page-title";
import { hasIndexAffectingSearchParams } from "@/lib/seo-query";
import { getSeoPageByPath } from "@/repositories/seo";
import type { CustomerCatalogFabric } from "@/repositories/customer-catalog";
import { seoPage as localSeoPage } from "@/domain/seo/storefront-registry";
import { absolute } from "@/lib/seo";

const DEFAULT_SOCIAL_IMAGE = "/media/hero-navy-jersey.jpg";

/**
 * Public money/discovery paths that must remain snippet-eligible.
 *
 * Google shows “No information is available for this page.” when `nosnippet`
 * (or equivalent) is present. Backend SEO rows must never be allowed to attach
 * those directives to these URLs.
 */
const SNIPPET_ELIGIBLE_PUBLIC_PATHS = new Set([
  "/",
  "/marketplace/",
  "/fabrics/",
  "/collections/",
  "/fabrics/best-for/",
  "/guides/",
  "/about/",
  "/how-it-works/",
  "/contact/",
  "/support/",
  "/help/",
  "/discover/",
  "/fabric-sourcing/",
  "/wholesale-fabric/",
]);

/** Exact homepage document title. Do not apply this to other routes. */
export const HOMEPAGE_TITLE =
  "FabStitch | B2B Fabric Marketplace & Fabric Sourcing";

export const HOMEPAGE_DESCRIPTION =
  "Discover fabrics for apparel, fashion, and manufacturing with FabStitch, a B2B fabric marketplace for discovering materials and sourcing fabric for your next project.";

function canonicalPath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0] || "/";
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, "/").toLowerCase();
  return collapsed === "/" ? "/" : `${collapsed.replace(/\/+$/, "")}/`;
}

function isSnippetEligiblePublicPath(path: string): boolean {
  const canonical = canonicalPath(path);
  if (SNIPPET_ELIGIBLE_PUBLIC_PATHS.has(canonical)) return true;
  return Boolean(localSeoPage(canonical)?.indexable);
}

/** Strip directives that suppress Google snippets on public money pages. */
function sanitizePublicRobotsDirectives(
  directives: string | null | undefined,
): string[] {
  return (directives ?? "")
    .split(",")
    .map((directive) => directive.trim())
    .filter(Boolean)
    .filter(
      (directive) =>
        !/^(?:nosnippet|noarchive|noimageindex|nofollow|noindex|none|unavailable_after:.*)$/i.test(
          directive,
        ),
    );
}

export function storefrontMetadata({
  title,
  description,
  path,
  image,
  index = false,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  index?: boolean;
  type?: "website" | "article";
}): Metadata {
  const canonical = canonicalPath(path);
  const isHome = canonical === "/";
  const socialImage = image ?? DEFAULT_SOCIAL_IMAGE;
  const documentTitle = metadataTitle(isHome ? HOMEPAGE_TITLE : title, {
    absolute: isHome,
  });
  const socialTitle =
    typeof documentTitle === "string"
      ? `${documentTitle} | ${BRAND_NAME}`
      : documentTitle.absolute;
  const forcePublicIndex = isSnippetEligiblePublicPath(canonical);
  const resolvedDescription = isHome ? HOMEPAGE_DESCRIPTION : description;
  return {
    title: documentTitle,
    description: resolvedDescription,
    alternates: { canonical: isHome ? absolute("/") : canonical },
    robots: {
      index: forcePublicIndex ? true : index,
      follow: true,
      nosnippet: false,
      noarchive: false,
      noimageindex: false,
    },
    openGraph: {
      type,
      siteName: BRAND_NAME,
      title: socialTitle,
      description: resolvedDescription,
      url: isHome ? absolute("/") : canonical,
      locale: "en_US",
      images: [
        { url: socialImage, alt: socialTitle, width: 1200, height: 630 },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: resolvedDescription,
      images: [socialImage],
    },
  };
}

export type StorefrontSeoResult = {
  page: SeoPage | null;
  metadata: Metadata;
  breadcrumbs: Crumb[];
};

function text(
  value: Record<string, string>,
  keys: readonly string[],
): string | undefined {
  for (const key of keys) {
    const candidate = value[key]?.trim();
    if (candidate) return candidate;
  }
  return undefined;
}

export function seoBreadcrumbs(page: SeoPage | null): Crumb[] {
  return (page?.breadcrumb ?? []).flatMap((item) => {
    const label = text(item, ["label", "name", "title"]);
    if (!label) return [];
    const href = text(item, [
      "href",
      "path",
      "url",
      "canonical_path",
      "canonical_url",
    ]);
    return [{ label, ...(href ? { href } : {}) }];
  });
}

function backendMetadata(
  page: SeoPage,
  overrides: {
    title?: string;
    description?: string;
    image?: string;
    index?: boolean;
    type?: "website" | "article";
  },
): Metadata {
  const canonical = canonicalPath(
    page.canonical_url?.trim() || page.canonical_path || "/",
  );
  const isHome = canonical === "/";
  const snippetEligible = isSnippetEligiblePublicPath(canonical);
  const preferred =
    overrides.title?.trim() || page.seo_title?.trim() || page.title;
  const cleaned = cleanPageTitle(preferred, BRAND_NAME);
  const documentTitle = metadataTitle(cleaned, { absolute: isHome });
  const description =
    overrides.description?.trim() ||
    page.meta_description?.trim() ||
    (isHome ? HOMEPAGE_DESCRIPTION : undefined) ||
    localSeoPage(canonical)?.description ||
    "FabStitch fabric sourcing marketplace.";
  const socialTitle = cleanPageTitle(
    page.og_title?.trim() || cleaned,
    BRAND_NAME,
  );
  const socialDisplay =
    socialTitle === BRAND_NAME ? BRAND_NAME : `${socialTitle} | ${BRAND_NAME}`;
  const socialDescription = page.og_description?.trim() || description;
  const socialImage =
    page.og_image_path?.trim() || overrides.image?.trim() || undefined;

  // Public money pages stay indexable/snippet-eligible even if the SEO API row
  // is stale, missing is_indexable, or carries nosnippet/noarchive.
  const indexable = snippetEligible
    ? overrides.index !== false
    : page.is_indexable && overrides.index !== false;

  if (snippetEligible) {
    return {
      title: documentTitle,
      description,
      alternates: { canonical },
      robots: {
        index: true,
        follow: true,
        nosnippet: false,
        noarchive: false,
        noimageindex: false,
      },
      openGraph: {
        type: overrides.type ?? "website",
        siteName: BRAND_NAME,
        title: socialDisplay,
        description: socialDescription,
        url: canonical,
        ...(socialImage
          ? { images: [{ url: socialImage, alt: socialDisplay }] }
          : {}),
      },
      twitter: {
        card: socialImage ? "summary_large_image" : "summary",
        title: socialDisplay,
        description: socialDescription,
        ...(socialImage ? { images: [socialImage] } : {}),
      },
    };
  }

  const configuredRobots = sanitizePublicRobotsDirectives(
    page.robots_directives,
  );
  const robots = configuredRobots.length
    ? [
        indexable ? "index" : "noindex",
        page.is_public ? "follow" : "nofollow",
        ...configuredRobots.filter(
          (directive) =>
            !/^(?:no)?index$/i.test(directive) &&
            !/^(?:no)?follow$/i.test(directive),
        ),
      ].join(", ")
    : { index: indexable, follow: page.is_public };

  return {
    title: documentTitle,
    description,
    alternates: { canonical },
    robots,
    openGraph: {
      type: overrides.type ?? "website",
      siteName: BRAND_NAME,
      title: socialDisplay,
      description: socialDescription,
      url: canonical,
      ...(socialImage
        ? { images: [{ url: socialImage, alt: socialDisplay }] }
        : {}),
    },
    twitter: {
      card: socialImage ? "summary_large_image" : "summary",
      title: socialDisplay,
      description: socialDescription,
      ...(socialImage ? { images: [socialImage] } : {}),
    },
  };
}

export async function loadStorefrontSeo(
  path: string,
  overrides: {
    title?: string;
    description?: string;
    image?: string;
    index?: boolean;
    type?: "website" | "article";
  } = {},
): Promise<StorefrontSeoResult> {
  const canonical = canonicalPath(path);

  // Homepage metadata is frontend-owned. The SEO API must not rewrite the
  // title, description, or canonical onto another route.
  if (canonical === "/") {
    return {
      page: null,
      metadata: storefrontMetadata({
        title: HOMEPAGE_TITLE,
        description: HOMEPAGE_DESCRIPTION,
        path: "/",
        image: overrides.image,
        index: true,
      }),
      breadcrumbs: [],
    };
  }

  let page: SeoPage | null = null;
  try {
    page = await getSeoPageByPath(path);
  } catch (error) {
    console.error("[seo] metadata lookup failed", {
      path,
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
  }

  // Homepage / money pages: if the SEO API row would suppress indexing or
  // snippets, prefer the curated frontend registry instead of fail-closed.
  if (page && isSnippetEligiblePublicPath(canonical)) {
    const directives = (page.robots_directives ?? "").toLowerCase();
    const blocksSnippet =
      /\bnosnippet\b/.test(directives) ||
      /\bnoarchive\b/.test(directives) ||
      /\bnoimageindex\b/.test(directives) ||
      /\bnone\b/.test(directives);
    const blocksIndex =
      page.is_indexable === false || /\bnoindex\b/.test(directives);
    if (blocksSnippet || blocksIndex) {
      page = null;
    }
  }

  if (page) {
    return {
      page,
      metadata: backendMetadata(page, {
        ...overrides,
        description:
          overrides.description ??
          (canonical === "/" ? HOMEPAGE_DESCRIPTION : undefined),
      }),
      breadcrumbs: seoBreadcrumbs(page),
    };
  }

  // Registry fallback keeps curated money pages indexable when the SEO API
  // has no row yet or is temporarily unavailable.
  const local = localSeoPage(path);
  if (local?.indexable || isSnippetEligiblePublicPath(canonical)) {
    return {
      page: null,
      metadata: storefrontMetadata({
        title: overrides.title ?? local?.title ?? BRAND_NAME,
        description:
          overrides.description ??
          local?.description ??
          (canonical === "/"
            ? HOMEPAGE_DESCRIPTION
            : "FabStitch fabric sourcing marketplace."),
        path: local?.canonicalPath ?? canonical,
        image: overrides.image ?? local?.image,
        index: true,
        type:
          overrides.type ??
          (local?.type === "guide" || local?.type === "help"
            ? "article"
            : "website"),
      }),
      breadcrumbs: [],
    };
  }

  // Explicit opt-in: when a page supplies full metadata and asks to be
  // indexed, honor that. Unknown thin routes stay noindex by default.
  const explicitIndex = overrides.index === true;
  return {
    page: null,
    metadata: storefrontMetadata({
      title: overrides.title ?? BRAND_NAME,
      description:
        overrides.description ?? "FabStitch fabric sourcing marketplace.",
      path: canonical,
      image: overrides.image,
      index: explicitIndex,
      type: overrides.type,
    }),
    breadcrumbs: [],
  };
}

export async function registeredStorefrontMetadata(
  path: string,
  overrides: {
    title?: string;
    description?: string;
    image?: string;
    index?: boolean;
    type?: "website" | "article";
  } = {},
): Promise<Metadata> {
  return (await loadStorefrontSeo(path, overrides)).metadata;
}

export function hasSeoQueryState(
  query: Record<string, string | string[] | undefined>,
): boolean {
  return hasIndexAffectingSearchParams(query);
}

export function fabricSeoDescription(fabric: CustomerCatalogFabric): string {
  if (fabric.description?.trim()) return fabric.description.trim();
  const composition = fabric.composition[0];
  const character = fabric.characteristics.slice(0, 2).join(" and ");
  const uses = fabric.applications.length
    ? `Documented Best For uses include ${fabric.applications
        .slice(0, 3)
        .map((item) => item.label.toLowerCase())
        .join(", ")}.`
    : "";
  const lead = `Explore ${fabric.name} in the FabStitch 2027 collection`;
  const mid = [composition, character].filter(Boolean).join("; ");
  return `${lead}${mid ? ` — ${mid}` : ""}. ${uses}`.trim();
}
