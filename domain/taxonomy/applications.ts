import type { Application, ApplicationGroup } from "@/domain/types";

/**
 * Application taxonomy - the end products fabric becomes.
 *
 * This is the **primary organising axis** of FabStitch (docs/ARCHITECTURE.md
 * §1): a buyer knows with certainty what they are making and only
 * approximately what fabric they need, so application is the join between
 * buyer intent and specification.
 *
 * Content is domain knowledge transcribed from the research documents, not
 * invented - see docs/DECISIONS.md R7. `typicalFabrics` and `gsmRange` become
 * `application_fabric.suitability_score` / `recommended_gsm_min|max` when the
 * relationship moves server-side (D2).
 */

function app(a: Application): Application {
  return a;
}

const TOPS: Application[] = [
  app({
    id: "app-t-shirts",
    name: "T-shirts",
    slug: "t-shirts",
    group: "tops-casualwear",
    summary: "Jersey tees, blanks and promotional shirts.",
    typicalFabrics: ["single-jersey", "jersey", "interlock"],
    gsmRange: [140, 220],
  }),
  app({
    id: "app-polo-shirts",
    name: "Polo shirts",
    slug: "polo-shirts",
    group: "tops-casualwear",
    summary: "Collared knit shirts, corporate and sports.",
    typicalFabrics: ["pique", "interlock", "single-jersey"],
    gsmRange: [180, 220],
  }),
  app({
    id: "app-hoodies",
    name: "Hoodies",
    slug: "hoodies",
    group: "tops-casualwear",
    summary: "Pullover and zip hoodies.",
    typicalFabrics: ["french-terry", "fleece"],
    gsmRange: [240, 400],
  }),
  app({
    id: "app-sweatshirts",
    name: "Sweatshirts",
    slug: "sweatshirts",
    group: "tops-casualwear",
    summary: "Crew necks and raglan sweats.",
    typicalFabrics: ["french-terry", "fleece", "interlock"],
    gsmRange: [240, 360],
  }),
  app({
    id: "app-shirts",
    name: "Shirts",
    slug: "shirts",
    group: "tops-casualwear",
    summary: "Formal, casual and work shirting.",
    typicalFabrics: ["poplin", "oxford", "twill"],
    gsmRange: [100, 150],
  }),
  app({
    id: "app-blouses",
    name: "Blouses",
    slug: "blouses",
    group: "tops-casualwear",
    summary: "Women's woven tops where drape decides.",
    typicalFabrics: ["viscose", "crepe", "georgette"],
    gsmRange: [80, 140],
  }),
];

const BOTTOMS: Application[] = [
  app({
    id: "app-jeans",
    name: "Jeans",
    slug: "jeans",
    group: "bottoms-outerwear",
    summary: "Rigid and stretch denim bottoms.",
    typicalFabrics: ["denim"],
    gsmRange: [270, 475],
  }),
  app({
    id: "app-trousers",
    name: "Trousers",
    slug: "trousers",
    group: "bottoms-outerwear",
    summary: "Formal and casual trousers.",
    typicalFabrics: ["twill", "gabardine"],
    gsmRange: [200, 320],
  }),
  app({
    id: "app-chinos",
    name: "Chinos",
    slug: "chinos",
    group: "bottoms-outerwear",
    summary: "Cotton and stretch-cotton casual trousers.",
    typicalFabrics: ["twill", "canvas"],
    gsmRange: [200, 300],
  }),
  app({
    id: "app-jackets",
    name: "Jackets",
    slug: "jackets",
    group: "bottoms-outerwear",
    summary: "Fashion, casual and insulated outerwear.",
    typicalFabrics: ["canvas", "ripstop", "twill"],
    gsmRange: [180, 380],
  }),
  app({
    id: "app-coats",
    name: "Coats",
    slug: "coats",
    group: "bottoms-outerwear",
    summary: "Wool and technical outerwear.",
    typicalFabrics: ["wool", "gabardine"],
    gsmRange: [300, 600],
  }),
];

const OCCASION: Application[] = [
  app({
    id: "app-dresses",
    name: "Dresses",
    slug: "dresses",
    group: "dresses-occasion",
    summary: "Day, occasion and fashion dresses.",
    typicalFabrics: ["crepe", "viscose", "satin"],
    gsmRange: [90, 220],
  }),
  app({
    id: "app-skirts",
    name: "Skirts",
    slug: "skirts",
    group: "dresses-occasion",
    summary: "Woven and knit skirts.",
    typicalFabrics: ["crepe", "twill", "denim"],
  }),
  app({
    id: "app-bridal",
    name: "Bridal",
    slug: "bridal",
    group: "dresses-occasion",
    summary: "Wedding and bridesmaid wear.",
    typicalFabrics: ["satin", "organza", "chiffon"],
  }),
  app({
    id: "app-abayas-modest-wear",
    name: "Abayas & modest wear",
    slug: "abayas-modest-wear",
    group: "dresses-occasion",
    summary: "Abayas, hijabs, kaftans and modest dresses.",
    typicalFabrics: ["crepe", "georgette", "chiffon"],
  }),
];

const PERFORMANCE: Application[] = [
  app({
    id: "app-activewear",
    name: "Activewear",
    slug: "activewear",
    group: "performance-apparel",
    summary: "Leggings, tops and shorts bought on measurable properties.",
    typicalFabrics: ["interlock", "mesh", "polyester"],
    gsmRange: [180, 280],
  }),
  app({
    id: "app-sportswear",
    name: "Sportswear",
    slug: "sportswear",
    group: "performance-apparel",
    summary: "Training and team apparel.",
    typicalFabrics: ["polyester", "mesh", "interlock"],
    gsmRange: [140, 240],
  }),
  app({
    id: "app-swimwear",
    name: "Swimwear",
    slug: "swimwear",
    group: "performance-apparel",
    summary: "Swimsuits and rash guards; chlorine resistance decides.",
    typicalFabrics: ["nylon", "polyester"],
    gsmRange: [180, 260],
  }),
  app({
    id: "app-yoga-wear",
    name: "Yoga wear",
    slug: "yoga-wear",
    group: "performance-apparel",
    summary: "Four-way stretch with high recovery.",
    typicalFabrics: ["nylon", "interlock"],
    gsmRange: [220, 300],
  }),
  app({
    id: "app-cycling-apparel",
    name: "Cycling apparel",
    slug: "cycling-apparel",
    group: "performance-apparel",
    summary: "Jerseys, bibs and base layers.",
    typicalFabrics: ["polyester", "mesh"],
  }),
];

const INTIMATES: Application[] = [
  app({
    id: "app-underwear",
    name: "Underwear",
    slug: "underwear",
    group: "intimates-sleep",
    summary: "Briefs, boxers and base layers.",
    typicalFabrics: ["single-jersey", "rib", "modal"],
    gsmRange: [140, 200],
  }),
  app({
    id: "app-loungewear",
    name: "Loungewear",
    slug: "loungewear",
    group: "intimates-sleep",
    summary: "Lounge sets and soft separates.",
    typicalFabrics: ["french-terry", "single-jersey", "modal"],
  }),
  app({
    id: "app-sleepwear",
    name: "Sleepwear",
    slug: "sleepwear",
    group: "intimates-sleep",
    summary: "Pyjamas and robes.",
    typicalFabrics: ["poplin", "flannel", "satin"],
  }),
];

const UNIFORM: Application[] = [
  app({
    id: "app-uniforms",
    name: "Uniforms",
    slug: "uniforms",
    group: "uniform-workwear",
    summary: "Corporate, hospitality and institutional programmes.",
    typicalFabrics: ["twill", "gabardine", "poplin"],
    gsmRange: [190, 320],
  }),
  app({
    id: "app-scrubs",
    name: "Scrubs",
    slug: "scrubs",
    group: "uniform-workwear",
    summary: "Healthcare tunics and trousers; industrial-wash durability.",
    typicalFabrics: ["twill", "poplin"],
    gsmRange: [140, 220],
  }),
  app({
    id: "app-school-uniforms",
    name: "School uniforms",
    slug: "school-uniforms",
    group: "uniform-workwear",
    summary: "Shirts, trousers, skirts and blazers.",
    typicalFabrics: ["poplin", "gabardine", "twill"],
    gsmRange: [140, 280],
  }),
  app({
    id: "app-workwear",
    name: "Workwear",
    slug: "workwear",
    group: "uniform-workwear",
    summary: "Trade and industrial garments; abrasion and tear matter.",
    typicalFabrics: ["drill", "twill", "ripstop"],
    gsmRange: [220, 340],
  }),
  app({
    id: "app-chef-wear",
    name: "Chef wear",
    slug: "chef-wear",
    group: "uniform-workwear",
    summary: "Chef coats, aprons and service uniforms.",
    typicalFabrics: ["twill", "canvas"],
  }),
  app({
    id: "app-hi-vis",
    name: "Hi-vis",
    slug: "hi-vis",
    group: "uniform-workwear",
    summary: "Fluorescent garments to EN ISO 20471.",
    typicalFabrics: ["polyester", "mesh"],
  }),
  app({
    id: "app-coveralls",
    name: "Coveralls",
    slug: "coveralls",
    group: "uniform-workwear",
    summary: "One-piece industrial garments, often FR-treated.",
    typicalFabrics: ["drill", "ripstop"],
    gsmRange: [240, 340],
  }),
];

const HOME: Application[] = [
  app({
    id: "app-bedding",
    name: "Bedding",
    slug: "bedding",
    group: "home-textiles",
    summary: "Sheets and duvet covers; wide width is the gate.",
    typicalFabrics: ["sateen", "poplin"],
  }),
  app({
    id: "app-towels",
    name: "Towels",
    slug: "towels",
    group: "home-textiles",
    summary: "Bath, hand and hotel towelling.",
    typicalFabrics: ["terry"],
    gsmRange: [350, 600],
  }),
  app({
    id: "app-bathrobes",
    name: "Bathrobes",
    slug: "bathrobes",
    group: "home-textiles",
    summary: "Terry, velour and waffle robes.",
    typicalFabrics: ["terry"],
  }),
  app({
    id: "app-curtains",
    name: "Curtains",
    slug: "curtains",
    group: "home-textiles",
    summary: "Drapery, blackout and voile; FR for contract.",
    typicalFabrics: ["jacquard", "voile"],
  }),
  app({
    id: "app-table-linen",
    name: "Table linen",
    slug: "table-linen",
    group: "home-textiles",
    summary: "Cloths, runners and napkins.",
    typicalFabrics: ["linen", "jacquard"],
  }),
];

const INTERIORS: Application[] = [
  app({
    id: "app-upholstery",
    name: "Upholstery",
    slug: "upholstery",
    group: "furniture-interiors",
    summary: "Rated by Martindale rub count and fire retardancy.",
    typicalFabrics: ["velvet", "jacquard", "canvas"],
    gsmRange: [300, 600],
  }),
  app({
    id: "app-sofas",
    name: "Sofas",
    slug: "sofas",
    group: "furniture-interiors",
    summary: "Domestic and contract seating.",
    typicalFabrics: ["velvet", "jacquard"],
  }),
  app({
    id: "app-cushions",
    name: "Cushions",
    slug: "cushions",
    group: "furniture-interiors",
    summary: "Decorative and utility cushions.",
    typicalFabrics: ["canvas", "linen", "velvet"],
  }),
  app({
    id: "app-outdoor-furniture",
    name: "Outdoor furniture",
    slug: "outdoor-furniture",
    group: "furniture-interiors",
    summary: "UV- and water-resistant, solution-dyed.",
    typicalFabrics: ["polyester", "canvas"],
  }),
];

const BAGS: Application[] = [
  app({
    id: "app-bags",
    name: "Bags",
    slug: "bags",
    group: "bags-footwear-accessories",
    summary: "Totes, shoppers and soft goods.",
    typicalFabrics: ["canvas", "nylon"],
  }),
  app({
    id: "app-backpacks",
    name: "Backpacks",
    slug: "backpacks",
    group: "bags-footwear-accessories",
    summary: "Coated polyester and ripstop nylon by denier.",
    typicalFabrics: ["nylon", "ripstop", "polyester"],
  }),
  app({
    id: "app-luggage",
    name: "Luggage",
    slug: "luggage",
    group: "bags-footwear-accessories",
    summary: "Travel bags and linings.",
    typicalFabrics: ["nylon", "polyester"],
  }),
  app({
    id: "app-caps-headwear",
    name: "Caps & headwear",
    slug: "caps-headwear",
    group: "bags-footwear-accessories",
    summary: "Structured and unstructured caps.",
    typicalFabrics: ["twill", "canvas"],
  }),
  app({
    id: "app-footwear-uppers",
    name: "Footwear uppers",
    slug: "footwear-uppers",
    group: "bags-footwear-accessories",
    summary: "Knitted uppers, mesh and canvas.",
    typicalFabrics: ["mesh", "canvas"],
  }),
];

const TECHNICAL: Application[] = [
  app({
    id: "app-medical-textiles",
    name: "Medical textiles",
    slug: "medical-textiles",
    group: "technical-industrial",
    summary: "Barrier and reusable hospital textiles.",
    typicalFabrics: ["polyester", "non-woven"],
  }),
  app({
    id: "app-automotive-textiles",
    name: "Automotive textiles",
    slug: "automotive-textiles",
    group: "technical-industrial",
    summary: "Seating, headliners and acoustic parts.",
    typicalFabrics: ["polyester", "non-woven"],
  }),
  app({
    id: "app-filtration",
    name: "Filtration",
    slug: "filtration",
    group: "technical-industrial",
    summary: "Filter media and bag fabrics.",
    typicalFabrics: ["non-woven", "polyester"],
  }),
  app({
    id: "app-ppe",
    name: "PPE",
    slug: "ppe",
    group: "technical-industrial",
    summary: "Protective clothing to named standards.",
    typicalFabrics: ["ripstop", "drill"],
  }),
  app({
    id: "app-marine-awning",
    name: "Marine & awning",
    slug: "marine-awning",
    group: "technical-industrial",
    summary: "UV- and mildew-resistant coated fabrics.",
    typicalFabrics: ["canvas", "polyester"],
  }),
];

export const APPLICATION_GROUPS: ApplicationGroup[] = [
  { slug: "tops-casualwear", name: "Tops & casualwear", applications: TOPS },
  {
    slug: "bottoms-outerwear",
    name: "Bottoms & outerwear",
    applications: BOTTOMS,
  },
  {
    slug: "dresses-occasion",
    name: "Dresses & occasion",
    applications: OCCASION,
  },
  {
    slug: "performance-apparel",
    name: "Performance apparel",
    applications: PERFORMANCE,
  },
  {
    slug: "intimates-sleep",
    name: "Intimates & sleep",
    applications: INTIMATES,
  },
  {
    slug: "uniform-workwear",
    name: "Uniform & workwear",
    applications: UNIFORM,
  },
  { slug: "home-textiles", name: "Home textiles", applications: HOME },
  {
    slug: "furniture-interiors",
    name: "Furniture & interiors",
    applications: INTERIORS,
  },
  {
    slug: "bags-footwear-accessories",
    name: "Bags, footwear & accessories",
    applications: BAGS,
  },
  {
    slug: "technical-industrial",
    name: "Technical & industrial",
    applications: TECHNICAL,
  },
];

export const APPLICATIONS: Application[] = APPLICATION_GROUPS.flatMap(
  (group) => group.applications,
);

const BY_SLUG = new Map(APPLICATIONS.map((a) => [a.slug, a]));

export function getApplication(slug: string): Application | undefined {
  return BY_SLUG.get(slug);
}

/**
 * The applications surfaced on the homepage tile row.
 *
 * Ordered by commercial value, per docs/ARCHITECTURE.md §4 - never
 * alphabetically. Once listing counts exist this becomes
 * `listing count × commercial intent` and the row re-orders itself.
 */
export const FEATURED_APPLICATION_SLUGS = [
  "t-shirts",
  "shirts",
  "hoodies",
  "uniforms",
  "activewear",
  "bedding",
  "dresses",
  "upholstery",
  "bags",
] as const;

export const FEATURED_APPLICATIONS: Application[] =
  FEATURED_APPLICATION_SLUGS.map((slug) => {
    const application = BY_SLUG.get(slug);
    if (!application) {
      throw new Error(`Featured application "${slug}" is not in the taxonomy`);
    }
    return application;
  });
