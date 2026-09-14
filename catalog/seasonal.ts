import { FABRICS_2027, type Fabric2027 } from "./fabrics-2027";
import type { CatalogSeason } from "./types";

export type SeasonalCollection = {
  slug: string;
  label: string;
  title: string;
  description: string;
  introduction: readonly string[];
  season: CatalogSeason;
  relatedCollections: readonly string[];
};

export const SEASONAL_COLLECTIONS = [
  {
    slug: "spring-summer-2027",
    label: "Spring / Summer 2027",
    title: "Spring / Summer 2027 fabrics",
    description:
      "Explore the breathable, lightweight, sheer and performance fabrics selected for FabStitch Spring / Summer 2027.",
    introduction: [
      "Spring / Summer 2027 moves through linen and cotton, ethereal silk, lighter tailoring, open knitwear and year-round performance constructions. The common thread is not one predicted winner but a practical emphasis on breathability, lightness and movement.",
      "The fabrics below come directly from the FabStitch 2027 sourcing reference. Forecasts describe direction rather than certainty, so each product is presented through its stated composition, construction, weight and applications instead of an unsupported trend claim.",
    ],
    season: "SS 27",
    relatedCollections: [
      "linen-lightweight",
      "cotton",
      "silk-sheer",
      "tailoring",
      "knitwear",
      "performance",
    ],
  },
  {
    slug: "autumn-winter-2027-28",
    label: "Autumn / Winter 2027–28",
    title: "Autumn / Winter 2027–28 fabrics",
    description:
      "Explore brushed wool, pile, structured classics, technical outerwear and denim selected for FabStitch Autumn / Winter 2027–28.",
    introduction: [
      "Autumn / Winter 2027–28 puts surface and structure ahead of uniform shine. Brushed and felted wool, suede-touch cloth, corduroy, velvet, enlarged classics and technical layers give the collection its weight and texture.",
      "This is a sourcing direction, not a guarantee that one material will dominate the season. FabStitch keeps the forecast context attached to named products and source-supported specifications so the collection remains useful beyond a trend headline.",
    ],
    season: "AW 27/28",
    relatedCollections: [
      "aw-textures",
      "velvet-pile",
      "structured-classics",
      "technical-outerwear",
      "denim",
    ],
  },
  {
    slug: "home-contract-2027-28",
    label: "Home & Contract 2027–28",
    title: "Home and contract fabrics for 2027–28",
    description:
      "Explore upholstery, curtain, bedding, rug and contract-textile directions selected for FabStitch Home & Contract 2027–28.",
    introduction: [
      "Home and contract textiles follow their own calendar and are organized here by purpose. The collection covers tactile upholstery, materials that regulate light or sound, bedding constructions, rug surfaces and textiles designed for contract settings.",
      "The 2027–28 direction balances visible construction and technical function with materials that feel good and age with character. Product pages state only the performance, fibre and construction information supported by the reference.",
    ],
    season: "Home & Contract 27/28",
    relatedCollections: ["home-contract"],
  },
] as const satisfies readonly SeasonalCollection[];

export type SeasonalCollectionSlug =
  (typeof SEASONAL_COLLECTIONS)[number]["slug"];

export const SEASONAL_COLLECTION_BY_SLUG = Object.fromEntries(
  SEASONAL_COLLECTIONS.map((item) => [item.slug, item]),
) as Record<SeasonalCollectionSlug, (typeof SEASONAL_COLLECTIONS)[number]>;

export function fabricsForSeason(theme: SeasonalCollection): Fabric2027[] {
  return FABRICS_2027.filter((fabric) =>
    fabric.seasons.includes(theme.season as never),
  );
}
