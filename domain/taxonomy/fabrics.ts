import type { FabricFamily, FabricNode } from "@/domain/types";

/**
 * Fabric taxonomy.
 *
 * Modelled as **one canonical hierarchy plus cross-cutting tags**, never a
 * single tree (docs/ARCHITECTURE.md §2). A node's `parentSlug` chain defines
 * its one canonical URL; `tags` generate hub pages such as /fabrics/knitted/
 * and /fabrics/sustainable/ which canonicalise to themselves.
 *
 * `aliases` are the search-time synonyms the research requires to live in the
 * taxonomy rather than in a search index - lycra→elastane,
 * loopback→french terry, sweatshirt fleece→brushed back fleece.
 */

export const FABRIC_FAMILIES: FabricFamily[] = [
  {
    slug: "cotton",
    name: "Cotton & cotton-based",
    summary: "Breathable naturals: the base of most apparel programmes.",
    fibreOrigin: "natural",
  },
  {
    slug: "knits",
    name: "Knits",
    summary: "Jersey, terry and fleece constructions bought by GSM.",
    fibreOrigin: "natural",
  },
  {
    slug: "wovens",
    name: "Wovens & suiting",
    summary: "Twills, drills and jacquards for structure and durability.",
    fibreOrigin: "natural",
  },
  {
    slug: "fine-drapey",
    name: "Fine & drapey",
    summary: "Occasion and fashion wovens where drape decides.",
    fibreOrigin: "natural",
  },
  {
    slug: "bast-wool-protein",
    name: "Bast, wool & protein",
    summary: "Linen, hemp, wool and silk.",
    fibreOrigin: "natural",
  },
  {
    slug: "synthetics",
    name: "Synthetics & regenerated",
    summary: "Performance and cost-driven man-made fibres.",
    fibreOrigin: "synthetic",
  },
  {
    // The third construction class. The strategy names it alongside knits and
    // wovens ("construction classes (knits, wovens, non-wovens)") and lists its
    // members under Q7; it was missing here, which is why three technical
    // applications referenced a fabric that did not exist.
    slug: "non-wovens",
    name: "Non-wovens",
    summary:
      "Bonded rather than knitted or woven; bought to test standard, not hand-feel.",
    fibreOrigin: "synthetic",
  },
];

export const FABRIC_NODES: FabricNode[] = [
  /* --- Knits ------------------------------------------------------------ */
  {
    id: "fab-single-jersey",
    name: "Single jersey",
    slug: "single-jersey",
    parentSlug: "jersey",
    family: "knits",
    fibreOrigin: "natural",
    constructionClass: "knit",
    summary: "The default tee knit. Smooth face, looped back.",
    gsmRange: [140, 220],
    tags: ["knitted"],
    // "jersey" alone belongs to the parent node, which owns that URL segment.
    aliases: ["sj", "plain jersey"],
  },
  {
    id: "fab-cotton-jersey",
    name: "Cotton jersey",
    slug: "jersey",
    parentSlug: "cotton",
    family: "knits",
    fibreOrigin: "natural",
    constructionClass: "knit",
    summary: "Combed or carded; yarn quality drives hand and print result.",
    gsmRange: [140, 240],
    tags: ["knitted"],
    aliases: ["cotton knit", "cotton jersey"],
    imageUrl: "/media/fabrics/jersey.jpg",
  },
  {
    id: "fab-interlock",
    name: "Interlock",
    slug: "interlock",
    parentSlug: null,
    family: "knits",
    fibreOrigin: "natural",
    constructionClass: "knit",
    summary: "Double-faced knit; stable, smooth on both sides.",
    gsmRange: [180, 280],
    tags: ["knitted"],
    aliases: ["double jersey"],
  },
  {
    id: "fab-rib",
    name: "Rib",
    slug: "rib",
    parentSlug: null,
    family: "knits",
    fibreOrigin: "natural",
    constructionClass: "knit",
    summary: "1×1 and 2×2 for collars, cuffs and fitted bodies.",
    gsmRange: [180, 320],
    tags: ["knitted", "stretch"],
    aliases: ["rib knit", "1x1 rib", "2x2 rib"],
  },
  {
    id: "fab-pique",
    name: "Piqué",
    slug: "pique",
    parentSlug: null,
    family: "knits",
    fibreOrigin: "natural",
    constructionClass: "knit",
    summary: "Textured polo knit; honeycomb or birdseye.",
    gsmRange: [180, 240],
    tags: ["knitted"],
    aliases: ["pique", "polo knit", "honeycomb"],
  },
  {
    id: "fab-french-terry",
    name: "French terry",
    slug: "french-terry",
    parentSlug: null,
    family: "knits",
    fibreOrigin: "natural",
    constructionClass: "knit",
    summary: "Looped back, unbrushed. The sweat and hoodie base.",
    gsmRange: [240, 400],
    tags: ["knitted"],
    aliases: ["loopback", "loop knit", "terry knit"],
  },
  {
    id: "fab-fleece",
    name: "Fleece",
    slug: "fleece",
    parentSlug: null,
    family: "knits",
    fibreOrigin: "natural",
    constructionClass: "knit",
    summary: "Brushed back for warmth; heavier than French terry.",
    gsmRange: [260, 420],
    tags: ["knitted"],
    aliases: ["brushed fleece", "sweatshirt fleece", "brushed back fleece"],
    imageUrl: "/media/fabrics/fleece.jpg",
  },
  {
    id: "fab-terry",
    name: "Terry towelling",
    slug: "terry",
    parentSlug: null,
    family: "knits",
    fibreOrigin: "natural",
    constructionClass: "knit",
    summary: "Absorbent pile for towels, robes and spa textiles.",
    gsmRange: [350, 600],
    tags: ["knitted"],
    aliases: ["towelling", "terry cloth"],
  },
  {
    id: "fab-mesh",
    name: "Mesh",
    slug: "mesh",
    parentSlug: null,
    family: "knits",
    fibreOrigin: "synthetic",
    constructionClass: "knit",
    summary: "Open structure for ventilation and linings.",
    gsmRange: [90, 200],
    tags: ["knitted", "performance"],
    aliases: ["micro mesh", "power mesh", "birdseye mesh"],
  },

  /* --- Cotton & cotton-based -------------------------------------------- */
  {
    id: "fab-cotton",
    name: "Cotton",
    slug: "cotton",
    parentSlug: null,
    family: "cotton",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Carded, combed, organic, recycled or mercerised.",
    tags: ["sustainable"],
    aliases: ["100% cotton", "cotton fabric"],
    // Category photography, supplied 2026-08-29. Illustrative of the material,
    // not any mill's stock - the same standing this file's data has, and the
    // same standing the hero photograph has under R17. Only the nine nodes the
    // homepage browses carry one; every other node still renders its diagram,
    // so this can never leave a broken frame behind (R28).
    imageUrl: "/media/fabrics/cotton.jpg",
  },
  {
    id: "fab-denim",
    name: "Denim",
    slug: "denim",
    parentSlug: null,
    family: "cotton",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Rigid, stretch and selvedge; bought in oz per square yard.",
    gsmRange: [270, 475],
    aliases: ["jean fabric", "selvedge"],
    imageUrl: "/media/fabrics/denim.jpg",
  },
  {
    id: "fab-poplin",
    name: "Poplin",
    slug: "poplin",
    parentSlug: "cotton",
    family: "cotton",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Fine plain weave; the formal shirting default.",
    gsmRange: [100, 140],
    aliases: ["broadcloth"],
    imageUrl: "/media/fabrics/poplin.jpg",
  },
  {
    id: "fab-twill",
    name: "Twill",
    slug: "twill",
    parentSlug: "cotton",
    family: "cotton",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Diagonal weave; durable, drapes better than plain.",
    gsmRange: [180, 320],
    aliases: ["2/1 twill", "3/1 twill"],
    imageUrl: "/media/fabrics/twill.jpg",
  },
  {
    id: "fab-canvas",
    name: "Canvas",
    slug: "canvas",
    parentSlug: "cotton",
    family: "cotton",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Heavy plain weave for bags, workwear and upholstery.",
    gsmRange: [220, 600],
    aliases: ["duck", "cotton duck"],
    imageUrl: "/media/fabrics/canvas.jpg",
  },
  {
    id: "fab-flannel",
    name: "Flannel",
    slug: "flannel",
    parentSlug: "cotton",
    family: "cotton",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Brushed woven; sleepwear and shirting.",
    gsmRange: [140, 220],
  },
  {
    id: "fab-corduroy",
    name: "Corduroy",
    slug: "corduroy",
    parentSlug: "cotton",
    family: "cotton",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Cut-pile wales; measured in wales per inch.",
    gsmRange: [240, 400],
    aliases: ["cord"],
  },

  /* --- Wovens & suiting -------------------------------------------------- */
  {
    id: "fab-oxford",
    name: "Oxford",
    slug: "oxford",
    parentSlug: null,
    family: "wovens",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Basketweave shirting; heavier and more textured than poplin.",
    gsmRange: [120, 180],
    aliases: ["oxford cloth", "pinpoint oxford"],
  },
  {
    id: "fab-gabardine",
    name: "Gabardine",
    slug: "gabardine",
    parentSlug: null,
    family: "wovens",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Tight twill for uniforms, suiting and trousers.",
    gsmRange: [190, 320],
  },
  {
    id: "fab-drill",
    name: "Drill",
    slug: "drill",
    parentSlug: null,
    family: "wovens",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Heavy twill; the workwear and coverall base.",
    gsmRange: [220, 340],
  },
  {
    id: "fab-ripstop",
    name: "Ripstop",
    slug: "ripstop",
    parentSlug: null,
    family: "wovens",
    fibreOrigin: "synthetic",
    constructionClass: "woven",
    summary: "Reinforcing grid that stops tears propagating.",
    gsmRange: [60, 240],
    tags: ["performance"],
    aliases: ["rip stop", "ripstop nylon"],
  },
  {
    id: "fab-sateen",
    name: "Sateen",
    slug: "sateen",
    parentSlug: null,
    family: "wovens",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Lustrous face; bedding is sold by thread count.",
    aliases: ["cotton sateen", "percale"],
  },
  {
    id: "fab-jacquard",
    name: "Jacquard",
    slug: "jacquard",
    parentSlug: null,
    family: "wovens",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Woven-in pattern; upholstery, drapery and occasion.",
    aliases: ["brocade", "damask"],
  },

  /* --- Fine & drapey ----------------------------------------------------- */
  {
    id: "fab-satin",
    name: "Satin",
    slug: "satin",
    parentSlug: null,
    family: "fine-drapey",
    fibreOrigin: "synthetic",
    constructionClass: "woven",
    summary: "High-lustre face for occasion and lining.",
    aliases: ["charmeuse", "duchess satin"],
  },
  {
    id: "fab-chiffon",
    name: "Chiffon",
    slug: "chiffon",
    parentSlug: null,
    family: "fine-drapey",
    fibreOrigin: "synthetic",
    constructionClass: "woven",
    summary: "Sheer and light; occasion and modest wear.",
    gsmRange: [30, 80],
  },
  {
    id: "fab-crepe",
    name: "Crepe",
    slug: "crepe",
    parentSlug: null,
    family: "fine-drapey",
    fibreOrigin: "regenerated",
    constructionClass: "woven",
    summary: "Crimped hand with fluid drape; dresses and abayas.",
    gsmRange: [90, 180],
    aliases: ["crepe de chine", "nida"],
  },
  {
    id: "fab-georgette",
    name: "Georgette",
    slug: "georgette",
    parentSlug: null,
    family: "fine-drapey",
    fibreOrigin: "synthetic",
    constructionClass: "woven",
    summary: "Grainier and more opaque than chiffon.",
    gsmRange: [50, 110],
  },
  {
    id: "fab-organza",
    name: "Organza",
    slug: "organza",
    parentSlug: null,
    family: "fine-drapey",
    fibreOrigin: "synthetic",
    constructionClass: "woven",
    summary: "Crisp sheer for bridal and structure.",
  },
  {
    id: "fab-velvet",
    name: "Velvet",
    slug: "velvet",
    parentSlug: null,
    family: "fine-drapey",
    fibreOrigin: "synthetic",
    constructionClass: "woven",
    summary: "Dense pile; occasion wear and upholstery.",
    aliases: ["stretch velvet", "crushed velvet"],
  },

  /* --- Bast, wool & protein ---------------------------------------------- */
  {
    id: "fab-linen",
    name: "Linen",
    slug: "linen",
    parentSlug: null,
    family: "bast-wool-protein",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Flax; breathable, creases by nature.",
    gsmRange: [120, 260],
    tags: ["sustainable"],
    aliases: ["flax"],
    imageUrl: "/media/fabrics/linen.jpg",
  },
  {
    id: "fab-wool",
    name: "Wool",
    slug: "wool",
    parentSlug: null,
    family: "bast-wool-protein",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Worsted and woollen; suiting, coating and knitwear.",
    aliases: ["merino", "worsted", "lambswool"],
  },
  {
    id: "fab-silk",
    name: "Silk",
    slug: "silk",
    parentSlug: null,
    family: "bast-wool-protein",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Measured in momme; premium occasion and lining.",
    aliases: ["mulberry silk"],
  },
  {
    id: "fab-hemp",
    name: "Hemp",
    slug: "hemp",
    parentSlug: null,
    family: "bast-wool-protein",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Durable bast fibre, usually blended with cotton.",
    tags: ["sustainable"],
  },

  /* --- Synthetics & regenerated ------------------------------------------ */
  {
    id: "fab-polyester",
    name: "Polyester",
    slug: "polyester",
    parentSlug: null,
    family: "synthetics",
    fibreOrigin: "synthetic",
    constructionClass: "knit",
    summary: "Performance base; recycled rPET widely available.",
    gsmRange: [90, 320],
    tags: ["performance", "sustainable"],
    aliases: ["poly", "pet", "rpet", "recycled polyester"],
    imageUrl: "/media/fabrics/polyester.jpg",
  },
  {
    id: "fab-nylon",
    name: "Nylon",
    slug: "nylon",
    parentSlug: null,
    family: "synthetics",
    fibreOrigin: "synthetic",
    constructionClass: "knit",
    summary: "Abrasion resistance and recovery; swim and outerwear.",
    gsmRange: [40, 300],
    tags: ["performance"],
    aliases: ["polyamide", "nylon 6", "cordura"],
  },
  {
    id: "fab-viscose",
    name: "Viscose / rayon",
    slug: "viscose",
    parentSlug: null,
    family: "synthetics",
    fibreOrigin: "regenerated",
    constructionClass: "woven",
    summary: "Regenerated cellulose; drape at a low price point.",
    gsmRange: [90, 200],
    aliases: ["rayon", "bamboo viscose"],
  },
  {
    id: "fab-modal",
    name: "Modal",
    slug: "modal",
    parentSlug: null,
    family: "synthetics",
    fibreOrigin: "regenerated",
    constructionClass: "knit",
    summary: "Soft, stable regenerated fibre; intimates and loungewear.",
    gsmRange: [140, 220],
  },
  {
    id: "fab-lyocell",
    name: "Lyocell",
    slug: "lyocell",
    parentSlug: null,
    family: "synthetics",
    fibreOrigin: "regenerated",
    constructionClass: "woven",
    summary: "Closed-loop regenerated cellulose.",
    tags: ["sustainable"],
    aliases: ["tencel"],
  },
  {
    id: "fab-elastane",
    name: "Elastane",
    slug: "elastane",
    parentSlug: null,
    family: "synthetics",
    fibreOrigin: "synthetic",
    constructionClass: "knit",
    summary: "Blended in at 3-20% for stretch and recovery.",
    tags: ["stretch", "performance"],
    aliases: ["spandex", "lycra"],
  },
  /* --- Added from the Q7 named taxonomy ---------------------------------- */
  {
    id: "fab-muslin",
    name: "Muslin",
    slug: "muslin",
    parentSlug: "cotton",
    family: "cotton",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Loose plain weave, sold greige or bleached; toiles and linings.",
    gsmRange: [60, 140],
    aliases: ["cheesecloth", "gauze cotton"],
  },
  {
    id: "fab-lawn",
    name: "Lawn",
    slug: "lawn",
    parentSlug: "cotton",
    family: "cotton",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "High-count fine plain weave with a crisp hand; summer shirting.",
    gsmRange: [70, 110],
    aliases: ["cotton lawn", "batiste"],
  },
  {
    id: "fab-voile",
    name: "Voile",
    slug: "voile",
    parentSlug: "cotton",
    family: "cotton",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Sheer open plain weave; curtains and layered summer wear.",
    gsmRange: [50, 90],
    aliases: ["cotton voile"],
  },
  {
    id: "fab-jute",
    name: "Jute",
    slug: "jute",
    parentSlug: null,
    family: "bast-wool-protein",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Coarse bast fibre; sacking, webbing and rigid interiors.",
    aliases: ["hessian", "burlap"],
  },
  {
    id: "fab-ramie",
    name: "Ramie",
    slug: "ramie",
    parentSlug: null,
    family: "bast-wool-protein",
    fibreOrigin: "natural",
    constructionClass: "woven",
    summary: "Bast fibre with high wet strength; usually blended with cotton.",
    aliases: ["china grass"],
  },
  {
    id: "fab-acrylic",
    name: "Acrylic",
    slug: "acrylic",
    parentSlug: null,
    family: "synthetics",
    fibreOrigin: "synthetic",
    constructionClass: "knit",
    summary:
      "Wool-substitute synthetic; knitwear, pile and outdoor furnishing.",
    aliases: ["polyacrylic"],
  },
  {
    id: "fab-cupro",
    name: "Cupro",
    slug: "cupro",
    parentSlug: null,
    family: "synthetics",
    fibreOrigin: "regenerated",
    constructionClass: "woven",
    summary:
      "Regenerated cellulose with a silk-like drape; linings and blouses.",
    gsmRange: [60, 120],
    aliases: ["bemberg"],
  },
  {
    id: "fab-acetate",
    name: "Acetate",
    slug: "acetate",
    parentSlug: null,
    family: "synthetics",
    fibreOrigin: "regenerated",
    constructionClass: "woven",
    summary: "Regenerated cellulose ester; lustrous linings and occasion wear.",
    gsmRange: [70, 130],
    aliases: [],
  },

  /* --- Non-wovens -------------------------------------------------------- */
  {
    id: "fab-non-woven",
    name: "Non-woven",
    slug: "non-woven",
    parentSlug: null,
    family: "non-wovens",
    fibreOrigin: "synthetic",
    constructionClass: "non-woven",
    summary:
      "Fibres bonded thermally, chemically or mechanically; specified by weight and test standard rather than yarn count.",
    gsmRange: [10, 300],
    aliases: ["nonwoven", "non woven"],
  },
  {
    id: "fab-spunbond",
    name: "Spunbond",
    slug: "spunbond",
    parentSlug: "non-woven",
    family: "non-wovens",
    fibreOrigin: "synthetic",
    constructionClass: "non-woven",
    summary:
      "Continuous filaments laid and thermally bonded; the strongest non-woven per gram.",
    gsmRange: [10, 150],
    aliases: ["spun bond", "pp spunbond"],
  },
  {
    id: "fab-meltblown",
    name: "Meltblown",
    slug: "meltblown",
    parentSlug: "non-woven",
    family: "non-wovens",
    fibreOrigin: "synthetic",
    constructionClass: "non-woven",
    summary:
      "Microfibre web with very fine pore structure; the filtration layer in medical and PPE laminates.",
    gsmRange: [10, 60],
    aliases: ["melt blown"],
  },
  {
    id: "fab-needle-punched",
    name: "Needle-punched",
    slug: "needle-punched",
    parentSlug: "non-woven",
    family: "non-wovens",
    fibreOrigin: "synthetic",
    constructionClass: "non-woven",
    summary:
      "Mechanically entangled web; heavier and more dimensionally stable, used in automotive and geotextiles.",
    gsmRange: [80, 800],
    aliases: ["needlepunch", "needle punch"],
  },
  {
    id: "fab-interlining",
    name: "Interlining",
    slug: "interlining",
    parentSlug: "non-woven",
    family: "non-wovens",
    fibreOrigin: "synthetic",
    constructionClass: "non-woven",
    summary:
      "Fusible or sew-in support behind collars, cuffs and waistbands; specified by weight and fusing temperature.",
    gsmRange: [15, 120],
    aliases: ["fusible", "fusing"],
  },
  {
    id: "fab-geotextile",
    name: "Geotextile",
    slug: "geotextile",
    parentSlug: "non-woven",
    family: "non-wovens",
    fibreOrigin: "synthetic",
    constructionClass: "non-woven",
    summary:
      "Civil-engineering fabric for separation, filtration and reinforcement; bought to tensile and permeability standards.",
    gsmRange: [100, 800],
    aliases: ["geo textile"],
  },
];

const BY_SLUG = new Map(FABRIC_NODES.map((n) => [n.slug, n]));

export function getFabric(slug: string): FabricNode | undefined {
  return BY_SLUG.get(slug);
}

export function fabricsInFamily(family: string): FabricNode[] {
  return FABRIC_NODES.filter((n) => n.family === family);
}

export function fabricsWithTag(tag: string): FabricNode[] {
  return FABRIC_NODES.filter((n) => n.tags?.includes(tag));
}

/** Cross-cutting hubs generated from tags rather than from the hierarchy. */
export const FABRIC_PROPERTY_HUBS = [
  { slug: "knitted", name: "Knitted fabrics" },
  { slug: "stretch", name: "Stretch fabrics" },
  { slug: "performance", name: "Performance fabrics" },
  { slug: "sustainable", name: "Sustainable fabrics" },
] as const;

/**
 * Every alias and canonical name the query parser can resolve, longest first
 * so "french terry" wins over "terry" and "cotton jersey" over "cotton".
 */
export const FABRIC_LOOKUP: { term: string; slug: string; name: string }[] =
  FABRIC_NODES.flatMap((node) => [
    { term: node.name.toLowerCase(), slug: node.slug, name: node.name },
    { term: node.slug.replace(/-/g, " "), slug: node.slug, name: node.name },
    ...(node.aliases ?? []).map((alias) => ({
      term: alias.toLowerCase(),
      slug: node.slug,
      name: node.name,
    })),
  ]).sort((a, b) => b.term.length - a.term.length);

/**
 * Which families a listing belongs to.
 *
 * Families are **cross-cutting views**, not a partition: a cotton jersey is
 * genuinely both "cotton & cotton-based" and "knits", and a buyer browsing
 * either should find it. So this returns a set rather than one answer, and the
 * counts on category cards are counts of what each view actually contains.
 *
 * Classification lives here, with the taxonomy, rather than inside whatever
 * component happens to need a count.
 */
const BAST_WOOL_PROTEIN = new Set(["linen", "wool", "silk", "hemp", "jute"]);
const SYNTHETIC = new Set([
  "polyester",
  "nylon",
  "acrylic",
  "viscose",
  "rayon",
  "modal",
  "lyocell",
  "elastane",
  "spandex",
]);
const DRAPEY_CONSTRUCTIONS = [
  "crepe",
  "satin",
  "sateen",
  "chiffon",
  "georgette",
  "organza",
  "velvet",
  "voile",
];

export function familiesOfListing(listing: {
  material: string;
  composition?: string;
  fabricType?: string;
  construction?: string | null;
}): string[] {
  const material = listing.material.toLowerCase();
  const composition = (listing.composition ?? "").toLowerCase();
  const construction = (listing.construction ?? "").toLowerCase();
  const families: string[] = [];

  if (
    material === "cotton" ||
    material === "denim" ||
    composition.includes("cotton")
  )
    families.push("cotton");
  if (listing.fabricType === "knitted") families.push("knits");
  if (listing.fabricType === "woven") families.push("wovens");
  if (DRAPEY_CONSTRUCTIONS.some((name) => construction.includes(name)))
    families.push("fine-drapey");
  if (
    BAST_WOOL_PROTEIN.has(material) ||
    [...BAST_WOOL_PROTEIN].some((fibre) => composition.includes(fibre))
  )
    families.push("bast-wool-protein");
  if (
    SYNTHETIC.has(material) ||
    [...SYNTHETIC].some((fibre) => composition.includes(fibre))
  )
    families.push("synthetics");

  return families;
}
