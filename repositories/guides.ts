import { CATALOG_GUIDES, CATALOG_GUIDE_BY_SLUG } from "@/content/guides";
import {
  GUIDE_CATEGORY_BY_SLUG,
  GUIDE_RELATED_BY_SLUG,
  categoryLabel,
  type GuideCategorySlug,
} from "@/content/guide-taxonomy";
import {
  COLLECTION_BY_SLUG,
  FABRIC_2027_BY_SLUG,
  SEO_USE_CASE_BY_SLUG,
} from "@/catalog";

export type GuideSection = {
  heading: string;
  body: string;
  keyPoints: string[];
};

export type Guide = {
  slug: string;
  path: string;
  type: string;
  title: string;
  heading: string;
  metaDescription?: string | null;
  summary?: string | null;
  sections: GuideSection[];
  faqs: { question: string; answer: string }[];
  fabricSlugs: string[];
  applicationSlugs: string[];
  buyerCategorySlugs: string[];
  certificationSlugs: string[];
  countryCodes: string[];
  cluster?: string | null;
  pillarSlug?: string | null;
  author?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  wordCount: number;
  category: GuideCategorySlug;
  categoryLabel: string;
  relatedGuides: string[];
};

function withPresentation(guide: (typeof CATALOG_GUIDES)[number]): Guide {
  const category = GUIDE_CATEGORY_BY_SLUG[guide.slug] ?? "fabric-basics";
  return {
    ...guide,
    category,
    categoryLabel: categoryLabel(category),
    relatedGuides: [...(GUIDE_RELATED_BY_SLUG[guide.slug] ?? [])].filter(
      (slug) => CATALOG_GUIDE_BY_SLUG.has(slug),
    ),
  };
}

export async function listGuides(limit = 100): Promise<Guide[]> {
  return CATALOG_GUIDES.slice(0, limit).map(withPresentation);
}

export async function getGuide(slug: string): Promise<Guide | null> {
  const guide = CATALOG_GUIDE_BY_SLUG.get(slug);
  return guide ? withPresentation(guide) : null;
}

export function guideLinks(guide: Guide): { href: string; label: string }[] {
  const knownFabrics = guide.fabricSlugs.filter(
    (slug) => FABRIC_2027_BY_SLUG[slug as keyof typeof FABRIC_2027_BY_SLUG],
  );
  const collections = new Set(
    knownFabrics
      .map(
        (slug) =>
          FABRIC_2027_BY_SLUG[slug as keyof typeof FABRIC_2027_BY_SLUG]
            ?.collection,
      )
      .filter((slug): slug is NonNullable<typeof slug> => Boolean(slug)),
  );
  return [
    ...knownFabrics.map((slug) => ({
      href: `/fabrics/${slug}/`,
      label:
        FABRIC_2027_BY_SLUG[slug as keyof typeof FABRIC_2027_BY_SLUG]?.name ??
        slug.replace(/-/g, " "),
    })),
    ...guide.applicationSlugs
      .map(
        (slug) =>
          SEO_USE_CASE_BY_SLUG[slug as keyof typeof SEO_USE_CASE_BY_SLUG],
      )
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .map((item) => ({
        href: `/fabrics/best-for/${item.slug}/`,
        label: item.label,
      })),
    ...[...collections]
      .filter((slug) => slug in COLLECTION_BY_SLUG)
      .map((slug) => ({
        href: `/collections/${slug}/`,
        label:
          COLLECTION_BY_SLUG[slug as keyof typeof COLLECTION_BY_SLUG].label,
      })),
    {
      href: "/guides/",
      label: "All fabric guides",
    },
  ];
}
