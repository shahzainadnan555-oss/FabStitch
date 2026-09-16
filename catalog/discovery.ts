import type { CollectionSlug } from "./collections";

export type CatalogCollectionCard = {
  slug: CollectionSlug;
  description: string;
  representativeFabric: string;
};

export const CATALOG_COLLECTION_CARDS: readonly CatalogCollectionCard[] = [
  {
    slug: "linen-lightweight",
    description: "Breathable linen and fluid blends selected for SS 27.",
    representativeFabric: "european-flax-linen",
  },
  {
    slug: "cotton",
    description: "Light, open and irregular cotton constructions.",
    representativeFabric: "cotton-poplin",
  },
  {
    slug: "silk-sheer",
    description: "Sheer, crisp and fluid occasion fabrics.",
    representativeFabric: "silk-chiffon",
  },
  {
    slug: "tailoring",
    description: "Lightweight wool blends and open summer weaves.",
    representativeFabric: "wool-silk-bi-stretch",
  },
  {
    slug: "knitwear",
    description: "Open stitches and featherweight year-round gauges.",
    representativeFabric: "pointelle-knit",
  },
  {
    slug: "performance",
    description: "Compression, cooling, swim and retro-sport constructions.",
    representativeFabric: "stretch-woven-compression",
  },
  {
    slug: "aw-textures",
    description: "Brushed, felted and dry-hand materials for AW 27/28.",
    representativeFabric: "melton",
  },
  {
    slug: "velvet-pile",
    description: "Corduroy, velveteen and directional velvet surfaces.",
    representativeFabric: "silk-viscose-velvet",
  },
  {
    slug: "structured-classics",
    description: "Tweed, checks and heritage structures reworked for AW.",
    representativeFabric: "donegal-tweed",
  },
  {
    slug: "technical-outerwear",
    description: "Ripstop, compliant laminates and hybrid protection.",
    representativeFabric: "recycled-nylon-ripstop",
  },
  {
    slug: "denim",
    description: "Lightweight, recycled, hemp and heritage denim.",
    representativeFabric: "lightweight-denim",
  },
  {
    slug: "home-contract",
    description: "Tactile home textiles and performance contract materials.",
    representativeFabric: "heavy-linen-upholstery",
  },
];

export const CURATED_FABRIC_SLUGS = [
  "european-flax-linen",
  "linen-cotton",
  "cotton-poplin",
  "cotton-voile",
  "cotton-seersucker",
  "silk-chiffon",
  "silk-georgette",
  "pointelle-knit",
  "stretch-woven-compression",
  "lightweight-denim",
  "melton",
  "boiled-wool",
] as const;
