import type { CollectionDefinition, SourceFamilyDefinition } from "./types";

export const COLLECTIONS = [
  { slug: "linen-lightweight", label: "Linen & Lightweight" },
  { slug: "cotton", label: "Cotton" },
  { slug: "silk-sheer", label: "Silk & Sheer" },
  { slug: "tailoring", label: "Tailoring" },
  { slug: "knitwear", label: "Knitwear" },
  { slug: "performance", label: "Performance" },
  { slug: "aw-textures", label: "AW Textures" },
  { slug: "velvet-pile", label: "Velvet & Pile" },
  { slug: "structured-classics", label: "Structured Classics" },
  { slug: "technical-outerwear", label: "Technical Outerwear" },
  { slug: "denim", label: "Denim" },
  { slug: "home-contract", label: "Home & Contract" },
] as const satisfies readonly CollectionDefinition[];

export type CollectionSlug = (typeof COLLECTIONS)[number]["slug"];

export const COLLECTION_BY_SLUG = Object.fromEntries(
  COLLECTIONS.map((collection) => [collection.slug, collection]),
) as Record<CollectionSlug, (typeof COLLECTIONS)[number]>;

export const SOURCE_FAMILIES = [
  {
    slug: "linen-and-linen-blends",
    label: "Linen and linen blends",
    sourceSection: "Part 1 §1.1",
  },
  {
    slug: "cotton-light-open-textured",
    label: "Cotton — light, open, textured",
    sourceSection: "Part 1 §1.2",
  },
  {
    slug: "silk-and-ethereal",
    label: "Silk and the ethereal group",
    sourceSection: "Part 1 §1.3",
  },
  {
    slug: "summer-wools-and-tailoring",
    label: "Summer wools and tailoring",
    sourceSection: "Part 1 §1.4",
  },
  {
    slug: "year-round-knitwear",
    label: "Knitwear — the year-round shift",
    sourceSection: "Part 1 §1.5",
  },
  {
    slug: "performance-swim-next-to-skin",
    label: "Performance, swim and next-to-skin",
    sourceSection: "Part 1 §1.6",
  },
  {
    slug: "brushed-and-felted",
    label: "The brushed and felted group",
    sourceSection: "Part 2 §2.1",
  },
  {
    slug: "suede-touch-and-dry-hand",
    label: "Suede-touch and dry-hand surfaces",
    sourceSection: "Part 2 §2.2",
  },
  {
    slug: "corduroy-velvet-and-pile",
    label: "Corduroy, velvet and pile",
    sourceSection: "Part 2 §2.3",
  },
  {
    slug: "structured-classics",
    label: "Structured classics reinterpreted",
    sourceSection: "Part 2 §2.4",
  },
  {
    slug: "technical-outerwear",
    label: "Technical outerwear",
    sourceSection: "Part 2 §2.5",
  },
  {
    slug: "denim-2027",
    label: "Denim in 2027",
    sourceSection: "Part 2 §2.6",
  },
  {
    slug: "home-and-contract",
    label: "Home and contract textiles",
    sourceSection: "Part 4",
  },
] as const satisfies readonly SourceFamilyDefinition[];

export type SourceFamilySlug = (typeof SOURCE_FAMILIES)[number]["slug"];

export const SOURCE_FAMILY_BY_SLUG = Object.fromEntries(
  SOURCE_FAMILIES.map((family) => [family.slug, family]),
) as Record<SourceFamilySlug, (typeof SOURCE_FAMILIES)[number]>;
