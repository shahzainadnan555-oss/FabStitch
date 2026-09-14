import type { BestForSlug } from "./best-for";
import type { CollectionSlug, SourceFamilySlug } from "./collections";
import type { CatalogMeasurement, CatalogProduct, CatalogSeason } from "./types";

type ExpansionSpec = {
  id: string;
  slug: string;
  name: string;
  family: SourceFamilySlug;
  collection: CollectionSlug;
  composition: readonly string[];
  measurements: readonly CatalogMeasurement[];
  construction: readonly string[];
  characteristics: readonly string[];
  applications: readonly BestForSlug[];
  summary: string;
};

const SEASON: readonly CatalogSeason[] = ["SS 27", "AW 27/28"];

function product(spec: ExpansionSpec): CatalogProduct {
  return {
    ...spec,
    description: `${spec.name} is a source-backed FabStitch expansion direction with ${spec.characteristics.join(", ").toLowerCase()}. Its documented construction is ${spec.construction.join(" and ").toLowerCase()}, for ${spec.applications.join(", ")}.`,
    seasons: SEASON,
    source:
      "Frontend catalog expansion requested 2026-09-12; standard trade description for the named construction",
  };
}

const frenchTerry = [
  ["french-terry-lightweight", "Lightweight French Terry", ["100% cotton"], 210, ["French terry knit", "unbrushed loopback"], ["Smooth jersey face", "fine reverse loops", "light stretch"], ["baselayers", "knitwear", "loungewear"]],
  ["french-terry-classic", "Classic French Terry", ["100% cotton"], 280, ["French terry knit", "loopback"], ["Smooth face", "soft looped reverse", "medium body"], ["knitwear", "loungewear", "layering-pieces"]],
  ["french-terry-organic", "Organic Cotton French Terry", ["100% organic cotton"], 290, ["French terry knit", "loopback"], ["Natural cotton hand", "visible reverse loops", "breathable"], ["knitwear", "loungewear", "baselayers"]],
  ["french-terry-modal", "Cotton Modal French Terry", ["60% cotton / 40% modal"], 250, ["French terry knit", "loopback"], ["Soft fluid face", "fine loops", "gentle drape"], ["loungewear", "knitwear", "dresses"]],
  ["french-terry-stretch", "Stretch French Terry", ["95% cotton / 5% elastane"], 300, ["French terry knit", "loopback"], ["Controlled stretch", "smooth face", "resilient loops"], ["knitwear", "loungewear", "baselayers"]],
  ["french-terry-slub", "Slub French Terry", ["100% cotton"], 270, ["Slub French terry knit", "loopback"], ["Irregular yarn texture", "looped reverse", "casual body"], ["loungewear", "knitwear", "layering-pieces"]],
  ["french-terry-loopback", "Fine Loopback French Terry", ["100% cotton"], 230, ["Fine-gauge French terry", "loopback"], ["Fine smooth face", "small reverse loops", "lightweight drape"], ["baselayers", "knitwear", "loungewear"]],
  ["french-terry-heavyweight", "Heavyweight French Terry", ["100% cotton"], 360, ["Heavy French terry knit", "loopback"], ["Dense face", "full reverse loops", "substantial body"], ["knitwear", "layering-pieces", "loungewear"]],
  ["french-terry-recycled-cotton", "Recycled Cotton French Terry", ["70% recycled cotton / 30% cotton"], 285, ["French terry knit", "loopback"], ["Natural fleck", "soft face", "breathable reverse loops"], ["knitwear", "loungewear", "layering-pieces"]],
  ["french-terry-peached", "Peached French Terry", ["100% cotton"], 275, ["French terry knit", "light peached finish", "loopback"], ["Softened face", "visible loops", "warm casual hand"], ["loungewear", "knitwear", "layering-pieces"]],
] as const;

const ponte = [
  ["ponte-rayon-nylon", "Rayon Nylon Ponte", ["68% rayon / 27% nylon / 5% elastane"], 320, ["Ponte double knit"], ["Dense double-knit face", "controlled stretch", "stable drape"], ["trousers", "dresses", "soft-tailoring"]],
  ["ponte-cotton-rayon", "Cotton Rayon Ponte", ["60% cotton / 35% rayon / 5% elastane"], 300, ["Ponte double knit"], ["Smooth stable surface", "breathable cotton hand", "moderate stretch"], ["trousers", "dresses", "workwear-jackets"]],
  ["ponte-double-knit", "Classic Double-Knit Ponte", ["68% rayon / 27% nylon / 5% elastane"], 360, ["Dense ponte double knit"], ["Substantial body", "clean face", "controlled recovery"], ["trousers", "jackets", "dresses"]],
  ["ponte-compact", "Compact Ponte", ["70% rayon / 25% nylon / 5% elastane"], 390, ["Compact double knit"], ["Firm body", "smooth surface", "tailored stability"], ["trousers", "full-skirts", "soft-tailoring"]],
  ["ponte-brushed", "Brushed Ponte", ["68% rayon / 27% nylon / 5% elastane"], 370, ["Ponte double knit", "brushed reverse"], ["Smooth face", "soft warm reverse", "stable stretch"], ["trousers", "dresses", "layering-pieces"]],
  ["ponte-structured", "Structured Ponte", ["65% rayon / 30% nylon / 5% elastane"], 410, ["Heavy ponte double knit"], ["Clean tailored face", "high body", "controlled stretch"], ["jackets", "trousers", "workwear-jackets"]],
  ["ponte-lightweight", "Lightweight Ponte", ["68% rayon / 27% nylon / 5% elastane"], 260, ["Light ponte double knit"], ["Smooth face", "lighter body", "soft controlled drape"], ["dresses", "full-skirts", "citywear"]],
  ["ponte-matte", "Matte Ponte", ["70% rayon / 25% nylon / 5% elastane"], 330, ["Ponte double knit", "matte finish"], ["Low-lustre face", "dense structure", "stable stretch"], ["trousers", "dresses", "workwear-jackets"]],
  ["ponte-ribbed", "Ribbed Ponte", ["65% rayon / 30% nylon / 5% elastane"], 350, ["Ponte double knit", "fine rib texture"], ["Subtle ribs", "substantial body", "controlled stretch"], ["full-skirts", "dresses", "knitwear"]],
  ["ponte-travel", "Travel Ponte", ["68% rayon / 27% nylon / 5% elastane"], 300, ["Ponte double knit"], ["Smooth compact face", "resilient stretch", "clean travel drape"], ["trousers", "dresses", "citywear"]],
] as const;

const tencel = [
  ["tencel-plain-weave", "Tencel Plain Weave", ["100% Tencel lyocell"], 125, ["Plain weave"], ["Smooth cellulosic surface", "soft drape", "breathable light body"], ["shirting", "blouses", "dresses"]],
  ["tencel-twill", "Tencel Twill", ["100% Tencel lyocell"], 185, ["2/1 twill"], ["Soft diagonal grain", "fluid drape", "subtle natural lustre"], ["trousers", "dresses", "shirting"]],
  ["tencel-denim", "Tencel Denim", ["55% cotton / 45% Tencel lyocell"], 260, ["Denim twill"], ["Soft denim grain", "fluid medium body", "cotton-cellulosic hand"], ["trousers", "jackets", "knitwear"]],
  ["tencel-shirting", "Tencel Shirting", ["100% Tencel lyocell"], 115, ["Fine plain weave"], ["Smooth refined face", "light fluid drape", "breathable"], ["shirting", "blouses", "dresses"]],
  ["tencel-jersey", "Tencel Jersey", ["95% Tencel lyocell / 5% elastane"], 190, ["Single jersey knit"], ["Soft smooth face", "fluid knit drape", "light stretch"], ["baselayers", "dresses", "knitwear"]],
  ["tencel-heavy-twill", "Heavy Tencel Twill", ["100% Tencel lyocell"], 245, ["3/1 twill"], ["Dense diagonal grain", "soft substantial body", "matte cellulosic face"], ["trousers", "jackets", "dresses"]],
  ["tencel-linen-blend", "Tencel Linen Blend", ["70% Tencel lyocell / 30% linen"], 150, ["Plain weave"], ["Dry linen texture", "soft fluid drape", "breathable"], ["shirting", "dresses", "resortwear"]],
  ["tencel-sateen", "Tencel Sateen", ["100% Tencel lyocell"], 145, ["Sateen weave"], ["Smooth face", "restrained natural lustre", "fluid drape"], ["dresses", "blouses", "linings"]],
  ["tencel-brushed", "Brushed Tencel", ["100% Tencel lyocell"], 210, ["Plain weave", "light brushed finish"], ["Soft peach surface", "fluid medium body", "matte"], ["shirting", "dresses", "loungewear"]],
  ["tencel-cotton-poplin", "Tencel Cotton Poplin", ["55% Tencel lyocell / 45% cotton"], 135, ["Poplin plain weave"], ["Clean cotton structure", "soft surface", "breathable"], ["shirting", "dresses", "blouses"]],
] as const;

const woolBlends = [
  ["wool-cotton-twill", "Wool Cotton Twill", ["55% wool / 45% cotton"], 260, ["2/1 twill"], ["Dry diagonal grain", "breathable medium body", "soft tailoring hand"], ["trousers", "jackets", "workwear-jackets"]],
  ["wool-linen-tailoring-open-weave", "Wool Linen Open Weave Blend", ["70% wool / 30% linen"], 210, ["Open weave"], ["Airy structure", "dry hand", "warm-weather tailoring"], ["unstructured-jackets", "soft-tailoring", "suiting"]],
  ["wool-silk-suiting", "Wool Silk Suiting Blend", ["85% wool / 15% silk"], 220, ["Fine plain weave"], ["Refined surface", "light natural lustre", "tailored drape"], ["suiting", "jackets", "occasionwear"]],
  ["wool-viscose-twill", "Wool Viscose Twill", ["55% wool / 45% viscose"], 280, ["Twill weave"], ["Soft diagonal grain", "smooth drape", "medium warmth"], ["trousers", "suiting", "dresses"]],
  ["wool-polyester-suiting", "Wool Polyester Suiting Blend", ["55% wool / 45% polyester"], 250, ["Plain suiting weave"], ["Clean tailored face", "structured drape", "moderate warmth"], ["suiting", "workwear-jackets", "trousers"]],
  ["wool-polyamide-crepe", "Wool Polyamide Crepe", ["70% wool / 30% polyamide"], 230, ["Crepe weave"], ["Dry pebbled surface", "soft structure", "resilient drape"], ["dresses", "jackets", "trousers"]],
  ["wool-cashmere-melton", "Wool Cashmere Melton Blend", ["90% wool / 10% cashmere"], 520, ["Fulled melton"], ["Dense compact surface", "soft luxury hand", "warm coat body"], ["coats", "suiting"]],
  ["wool-mohair-fresco", "Wool Mohair Fresco Blend", ["80% wool / 20% mohair"], 230, ["Open fresco weave"], ["Airy crisp structure", "subtle fiber lustre", "tailored drape"], ["suiting", "unstructured-jackets", "jackets"]],
  ["wool-alpaca-brushed", "Wool Alpaca Brushed Blend", ["70% wool / 30% alpaca"], 360, ["Plain weave", "brushed finish"], ["Soft fine halo", "warm fuller body", "brushed surface"], ["coats", "jackets", "layering-pieces"]],
  ["wool-hemp-canvas", "Wool Hemp Canvas Blend", ["70% wool / 30% hemp"], 340, ["Plain canvas weave"], ["Dry textured face", "firm body", "natural fibre character"], ["jackets", "trousers", "workwear-jackets"]],
] as const;

function makeFamily(
  prefix: string,
  specs: readonly (readonly [
    string,
    string,
    readonly string[],
    number,
    readonly string[],
    readonly string[],
    readonly BestForSlug[],
  ])[],
  family: SourceFamilySlug,
  collection: CollectionSlug,
): CatalogProduct[] {
  return specs.map(([slug, name, composition, gsm, construction, characteristics, applications], index) =>
    product({
      id: `fs-exp-${prefix}-${String(index + 1).padStart(3, "0")}`,
      slug,
      name,
      family,
      collection,
      composition,
      measurements: [{ unit: "gsm", exact: gsm }],
      construction,
      characteristics,
      applications,
      summary: `${name} with ${characteristics.slice(0, 2).join(" and ").toLowerCase()}.`,
    }),
  );
}

export const EXPANDED_JERSEY_CELLULOSIC_WOOL: readonly CatalogProduct[] = [
  ...makeFamily("french-terry", frenchTerry, "year-round-knitwear", "knitwear"),
  ...makeFamily("ponte", ponte, "year-round-knitwear", "knitwear"),
  ...makeFamily("tencel", tencel, "linen-and-linen-blends", "linen-lightweight"),
  ...makeFamily("wool-blend", woolBlends, "summer-wools-and-tailoring", "tailoring"),
];
