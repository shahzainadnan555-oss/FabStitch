import type { Metadata } from "next";
import type { Crumb } from "@/components/ui/breadcrumbs";
import type { SeoPage } from "@/lib/api/types";
import { BRAND_NAME, cleanPageTitle, metadataTitle } from "@/lib/page-title";
import { hasIndexAffectingSearchParams } from "@/lib/seo-query";
import { getSeoPageByPath } from "@/repositories/seo";
import type { CustomerCatalogFabric } from "@/repositories/customer-catalog";
import { seoPage as localSeoPage } from "@/domain/seo/storefront-registry";

const DEFAULT_SOCIAL_IMAGE = "/media/hero-navy-jersey.jpg";

function canonicalPath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0] || "/";
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, "/").toLowerCase();
  return collapsed === "/" ? "/" : `${collapsed.replace(/\/+$/, "")}/`;
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
  const socialImage = image ?? DEFAULT_SOCIAL_IMAGE;
  const documentTitle = metadataTitle(title, {
    absolute: canonical === "/",
  });
  const socialTitle =
    typeof documentTitle === "string"
      ? `${documentTitle} | ${BRAND_NAME}`
      : BRAND_NAME;
  return {
    title: documentTitle,
    description,
    alternates: { canonical },
    robots: { index, follow: true },
    openGraph: {
      type,
      siteName: BRAND_NAME,
      title: socialTitle,
      description,
      url: canonical,
      locale: "en_US",
      images: [
        { url: socialImage, alt: socialTitle, width: 1200, height: 630 },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
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
    image?: string;
    index?: boolean;
    type?: "website" | "article";
  },
): Metadata {
  const isHome = page.canonical_path === "/";
  const preferred =
    overrides.title?.trim() || page.seo_title?.trim() || page.title;
  const cleaned = cleanPageTitle(preferred, BRAND_NAME);
  const documentTitle = metadataTitle(cleaned, { absolute: isHome });
  const description = page.meta_description?.trim() || undefined;
  const canonical = page.canonical_url?.trim() || page.canonical_path;
  const socialTitle = cleanPageTitle(
    page.og_title?.trim() || cleaned,
    BRAND_NAME,
  );
  const socialDisplay =
    socialTitle === BRAND_NAME ? BRAND_NAME : `${socialTitle} | ${BRAND_NAME}`;
  const socialDescription = page.og_description?.trim() || description;
  const socialImage =
    page.og_image_path?.trim() || overrides.image?.trim() || undefined;
  const indexable = page.is_indexable && overrides.index !== false;
  const configuredRobots = page.robots_directives?.trim();
  const robots = configuredRobots
    ? [
        indexable ? null : "noindex",
        page.is_public ? null : "nofollow",
        ...configuredRobots
          .split(",")
          .map((directive) => directive.trim())
          .filter(
            (directive) =>
              directive &&
              !(!indexable && /^(?:no)?index$/i.test(directive)) &&
              !(!page.is_public && /^(?:no)?follow$/i.test(directive)),
          ),
      ]
        .filter(Boolean)
        .join(", ")
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
  let page: SeoPage | null = null;
  try {
    page = await getSeoPageByPath(path);
  } catch (error) {
    console.error("[seo] metadata lookup failed", {
      path,
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
  }

  if (page) {
    return {
      page,
      metadata: backendMetadata(page, overrides),
      breadcrumbs: seoBreadcrumbs(page),
    };
  }

  // Registry fallback keeps curated money pages indexable when the SEO API
  // has no row yet or is temporarily unavailable.
  const local = localSeoPage(path);
  if (local?.indexable) {
    return {
      page: null,
      metadata: storefrontMetadata({
        title: overrides.title ?? local.title,
        description: overrides.description ?? local.description,
        path: local.canonicalPath,
        image: overrides.image ?? local.image,
        index: overrides.index !== false,
        type:
          overrides.type ??
          (local.type === "guide" || local.type === "help"
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
      path: canonicalPath(path),
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
