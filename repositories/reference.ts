import {
  BUYER_CATEGORIES,
  BUYER_SUBCATEGORIES,
  findCountryBySlug,
} from "@/domain/taxonomy/buyers";
import { getApplication as localApplication } from "@/domain/taxonomy/applications";

export type ReferenceBuyerCategory = {
  id: string;
  name: string;
  slug: string;
  summary: string | null;
  applicationSlugs: string[];
  children: { name: string; slug: string }[];
};

export async function listBuyerCategories(
  options: { limit?: number } = {},
): Promise<ReferenceBuyerCategory[]> {
  const categories: ReferenceBuyerCategory[] = [
    ...BUYER_CATEGORIES.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      summary: category.summary,
      applicationSlugs: [
        ...new Set(
          category.subcategories.flatMap((child) => child.applications),
        ),
      ],
      children: category.subcategories.map((child) => ({
        name: child.name,
        slug: child.slug,
      })),
    })),
    ...BUYER_SUBCATEGORIES.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      summary: null,
      applicationSlugs: category.applications,
      children: [],
    })),
  ];
  return categories.slice(0, options.limit ?? categories.length);
}

export async function getBuyerCategory(
  slug: string,
): Promise<ReferenceBuyerCategory | null> {
  return (await listBuyerCategories()).find((item) => item.slug === slug) ?? null;
}

export type BuyerLanding = {
  sections: {
    slug: string;
    name: string;
    summary?: string | null;
    counts: { listings?: number | null };
    listings: unknown[];
  }[];
  fabrics: {
    slug: string;
    name: string;
    listingCount: number;
    summary?: string | null;
  }[];
};

export async function getBuyerLanding(
  _slug: string,
): Promise<BuyerLanding | null> {
  return null;
}

export type CountryReference = {
  country: {
    code: string;
    name: string;
    knownFor?: string | null;
    listingCount: number;
  };
  fabrics: { slug: string; name: string; listingCount: number }[];
};

export async function getCountry(
  slug: string,
): Promise<CountryReference | null> {
  const country = findCountryBySlug(slug);
  if (!country) return null;
  return {
    country: {
      ...country,
      knownFor: country.knownFor ?? null,
      listingCount: 0,
    },
    fabrics: [],
  };
}

export type ApplicationReference = {
  application: {
    id: string;
    name: string;
    slug: string;
    group?: string | null;
    summary?: string | null;
    typicalFabricSlugs: string[];
    gsmRange?: [number, number] | null;
  };
};

export async function getApplication(
  slug: string,
): Promise<ApplicationReference | null> {
  const application = localApplication(slug);
  if (!application) return null;
  return {
    application: {
      id: application.id,
      name: application.name,
      slug: application.slug,
      group: application.group,
      summary: application.summary,
      typicalFabricSlugs: application.typicalFabrics,
      gsmRange: application.gsmRange ?? null,
    },
  };
}
