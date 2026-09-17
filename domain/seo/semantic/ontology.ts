/**
 * Semantic SEO ontology for FabStitch discovery pages.
 *
 * Entities carry real fabric-knowledge facts used by the composer. Pages are
 * built from qualified combinations — never from keyword-only string swaps.
 */

export type SemanticCluster =
  | "material"
  | "use_case"
  | "attribute"
  | "material_use"
  | "material_attribute"
  | "use_attribute"
  | "education"
  | "comparison"
  | "commercial"
  | "construction";

export type SemanticPageType =
  | "material"
  | "use_case"
  | "attribute"
  | "material_use"
  | "material_attribute"
  | "use_attribute"
  | "education"
  | "comparison"
  | "commercial"
  | "construction";

export type SemanticIntent =
  "informational" | "commercial_investigation" | "commercial";

export type MaterialEntity = {
  id: string;
  label: string;
  aliases: readonly string[];
  family: string;
  collectionSlug?: string;
  fiberNotes: string;
  handFeel: string;
  constructionNotes: string;
  weightNotes: string;
  strengths: readonly string[];
  watchouts: readonly string[];
  typicalUses: readonly string[];
  buyerNotes: string;
  relatedMaterials: readonly string[];
  imageHint: string;
};

export type UseEntity = {
  id: string;
  label: string;
  garmentLabel: string;
  bestForSlug?: string;
  requirements: readonly string[];
  preferredTraits: readonly string[];
  weightGuidance: string;
  constructionGuidance: string;
  seasonalNotes: string;
  buyerNotes: string;
  relatedUses: readonly string[];
};

export type AttributeEntity = {
  id: string;
  label: string;
  definition: string;
  whyItMatters: string;
  howToJudge: string;
  tradeoffs: string;
  relatedAttributes: readonly string[];
  guidePath?: string;
};

export type ConstructionEntity = {
  id: string;
  label: string;
  definition: string;
  behaviour: string;
  typicalUses: readonly string[];
  buyerNotes: string;
  guidePath?: string;
};

export const MATERIALS: readonly MaterialEntity[] = [
  {
    id: "cotton",
    label: "Cotton",
    aliases: ["cotton cloth", "cotton textile"],
    family: "natural cellulose",
    collectionSlug: "cotton",
    fiberNotes:
      "Cotton is a natural cellulose fibre with a familiar hand, reliable dye affinity, and broad apparel adoption from everyday shirting to denser work cloths.",
    handFeel:
      "Depending on yarn and finish, cotton can read crisp, soft, brushed, or dry — the fibre name alone never fixes the hand.",
    constructionNotes:
      "Poplin, voile, oxford, twill, seersucker, jersey and fleece are common cotton constructions; each changes drape and durability more than fibre branding does.",
    weightNotes:
      "Cotton programmes span sheer lawns through mid-weight poplins into denser twills. Published GSM on FabStitch is the reliable comparator.",
    strengths: [
      "Broad apparel familiarity",
      "Stable dye and finish options when documented",
      "Works across shirts, dresses, trousers and home textiles",
    ],
    watchouts: [
      "Crease behaviour varies by weave and finish",
      "Shrinkage and recovery must be confirmed in sampling",
      "Softness claims without construction context are incomplete",
    ],
    typicalUses: ["shirts", "dresses", "trousers", "blouses", "uniforms"],
    buyerNotes:
      "Shortlist cotton by construction and weight for the garment, then confirm care and recovery in the inquiry — not by fibre buzzwords alone.",
    relatedMaterials: ["linen", "viscose", "poplin", "denim"],
    imageHint: "/media/fabrics/cotton-poplin-primary.webp",
  },
  {
    id: "linen",
    label: "Linen",
    aliases: ["flax linen", "linen cloth"],
    family: "bast fibre",
    collectionSlug: "linen-lightweight",
    fiberNotes:
      "Linen (flax) is a bast fibre valued for breathability, dry hand, and a lived-in crease character that is part of its visual language.",
    handFeel:
      "Typically cooler and drier than cotton, with a distinctive texture that softens through wear and washing when the cloth is built for apparel.",
    constructionNotes:
      "Open weaves, plain weaves and linen blends (cotton, silk, lyocell, viscose) change opacity, drape and crease behaviour dramatically.",
    weightNotes:
      "Lightweight linen dominates summer clothing; heavier linen appears in trousers and structured summer tailoring. Always compare published weight.",
    strengths: [
      "Breathability in warm climates",
      "Natural texture that reads premium when well finished",
      "Strong story for resort and summer programmes",
    ],
    watchouts: [
      "Creasing is characteristic, not always a defect",
      "Sheer open weaves need opacity checks for dresses",
      "Blends change the linen story — read the composition",
    ],
    typicalUses: ["shirts", "dresses", "trousers", "resortwear", "blouses"],
    buyerNotes:
      "Match linen construction to climate and silhouette first. Resort dresses and crisp shirts rarely share the same cloth brief.",
    relatedMaterials: ["cotton", "viscose", "silk"],
    imageHint: "/media/fabrics/european-flax-linen-primary.webp",
  },
  {
    id: "silk",
    label: "Silk",
    aliases: ["silk cloth", "silk textile"],
    family: "protein fibre",
    collectionSlug: "silk-sheer",
    fiberNotes:
      "Silk is a protein filament fibre associated with fluid drape, luminosity and occasion or lining roles depending on construction.",
    handFeel:
      "Can be fluid, crisp, dry or softly lustrous — chiffon, georgette, habotai, dupion and crepe de chine behave differently.",
    constructionNotes:
      "Sheer chiffons and georgettes, denser crepes, crisp organzas and textured dupions sit under the same fibre label with unrelated product jobs.",
    weightNotes:
      "Sheer silks are light and often need lining strategies; denser silks carry more opacity for dresses and blouses.",
    strengths: [
      "Fluid drape for occasion and dress programmes",
      "Distinctive surface character when well chosen",
      "Useful for overlays, linings and elevated ready-to-wear",
    ],
    watchouts: [
      "Sheer constructions need opacity planning",
      "Care and abrasion resistance vary widely",
      "Do not treat all silks as interchangeable",
    ],
    typicalUses: ["dresses", "blouses", "scarves", "overlays", "linings"],
    buyerNotes:
      "Name the silhouette and opacity need before shortlisting silk. A lining cloth and a statement dress cloth are different briefs.",
    relatedMaterials: ["chiffon", "georgette", "satin", "viscose"],
    imageHint: "/media/fabrics/silk-chiffon-primary.webp",
  },
  {
    id: "wool",
    label: "Wool",
    aliases: ["wool cloth", "woollen fabric"],
    family: "protein fibre",
    collectionSlug: "tailoring",
    fiberNotes:
      "Wool covers apparel and outerwear programmes from tropical suiting to denser coating cloths, with behaviour driven by micron, yarn and finish.",
    handFeel:
      "Can be dry and crisp, soft and fluid, brushed or open — tropical wools and meltons are not the same product family in practice.",
    constructionNotes:
      "Worsted suitings, open weaves, double-face constructions and stretch-woven wool blends each answer different garment constraints.",
    weightNotes:
      "Lightweight tropical wools support warm-climate tailoring; heavier cloths support coats and structured outerwear.",
    strengths: [
      "Structure for tailoring and coats",
      "Seasonal range from open summer weaves to dense coatings",
      "Recovery and crease behaviour useful for suiting",
    ],
    watchouts: [
      "Warmth and itch perception vary by micron and finish",
      "Open weaves may need lining for opacity",
      "Stretch claims must appear on the fabric record",
    ],
    typicalUses: ["suits", "jackets", "coats", "trousers", "blazers"],
    buyerNotes:
      "Start from climate and silhouette. Suiting, soft jackets and coats rarely share one wool brief.",
    relatedMaterials: ["linen", "polyester", "canvas"],
    imageHint: "/media/fabrics/tropical-wool-super-110s-130s-primary.webp",
  },
  {
    id: "denim",
    label: "Denim",
    aliases: ["denim cloth", "jeans fabric"],
    family: "cotton twill family",
    collectionSlug: "denim",
    fiberNotes:
      "Denim is typically a warp-faced twill associated with jeans and workwear, though weights and finishes now span fashion and utility programmes.",
    handFeel:
      "Ranges from rigid dry hands to softened, brushed or stretch-assisted cloths. Finish history matters as much as fibre.",
    constructionNotes:
      "Classic indigo twills, stretch denims and lighter fashion denims behave differently in pattern cutting and laundry.",
    weightNotes:
      "Lightweight fashion denims and premium-weight jeans cloths are different product tools. Compare published GSM and stretch notes.",
    strengths: [
      "Strong cultural and commercial clarity for jeans programmes",
      "Durable twill structure when correctly specified",
      "Wide finish vocabulary when documented",
    ],
    watchouts: [
      "Stretch and recovery must be verified for fitted jeans",
      "Weight alone does not define hand after finishing",
      "Indigo and laundry expectations belong in the brief",
    ],
    typicalUses: ["trousers", "jackets", "workwear", "bottoms"],
    buyerNotes:
      "Define fit, stretch need and laundry story before choosing denim weight. Rigid and stretch programmes are different sourcing paths.",
    relatedMaterials: ["cotton", "canvas", "twill"],
    imageHint: "/media/fabrics/lightweight-denim-primary.webp",
  },
  {
    id: "polyester",
    label: "Polyester",
    aliases: ["polyester cloth", "PES fabric"],
    family: "synthetic",
    fiberNotes:
      "Polyester is a versatile synthetic used in performance apparel, blends, linings and structured programmes where recovery and durability matter.",
    handFeel:
      "Can be technical, soft, crisp or peach-skin depending on yarn and finish. Fibre name alone is not a hand description.",
    constructionNotes:
      "Wovens, knits, chiffons and performance constructions all use polyester; match construction to the garment job.",
    weightNotes:
      "From sheer overlays to denser performance cloths — published weight and stretch notes are the practical filters.",
    strengths: [
      "Recovery and durability in many constructions",
      "Useful in blends and performance apparel",
      "Often practical for travel and workwear briefs",
    ],
    watchouts: [
      "Breathability varies widely by construction",
      "Heat and finish behaviour should be sampled",
      "Sustainability claims require documented evidence",
    ],
    typicalUses: ["activewear", "uniforms", "linings", "outerwear"],
    buyerNotes:
      "Specify the garment constraint first — stretch recovery, opacity, or drape — then shortlist polyester constructions that document those traits.",
    relatedMaterials: ["viscose", "nylon", "jersey"],
    imageHint: "/media/fabrics/stretch-woven-compression-primary.webp",
  },
  {
    id: "viscose",
    label: "Viscose",
    aliases: ["viscose rayon", "rayon viscose"],
    family: "regenerated cellulose",
    fiberNotes:
      "Viscose is a regenerated cellulose fibre often chosen for fluid drape and soft apparel hands in dresses and blouses.",
    handFeel:
      "Frequently soft and fluid, though yarn and weave can produce crisper or denser results.",
    constructionNotes:
      "Plain weaves, crepes and jersey-like constructions appear in apparel programmes; blends with linen or cotton are common.",
    weightNotes:
      "Often mid-to-light apparel weights for dresses and shirts. Confirm opacity for pale colours and sheers.",
    strengths: [
      "Fluid drape for dresses and soft shirts",
      "Good colour clarity in many programmes",
      "Useful bridge between natural and synthetic briefs",
    ],
    watchouts: [
      "Wet strength and care need sampling attention",
      "Dimensional stability varies by construction",
      "Do not assume silk-like behaviour without evidence",
    ],
    typicalUses: ["dresses", "blouses", "shirts", "linings"],
    buyerNotes:
      "Use viscose when drape is the priority and confirm care plus opacity early in sampling.",
    relatedMaterials: ["rayon", "silk", "linen", "cotton"],
    imageHint: "/media/fabrics/linen-viscose-primary.webp",
  },
  {
    id: "rayon",
    label: "Rayon",
    aliases: ["rayon fabric", "rayon cloth"],
    family: "regenerated cellulose",
    fiberNotes:
      "Rayon is a regenerated cellulose family label that often overlaps market language with viscose; always read the published composition on FabStitch.",
    handFeel:
      "Typically soft with fluid drape in apparel constructions, but finishes can shift the hand toward dry or peach effects.",
    constructionNotes:
      "Appears in dress-weight wovens, soft shirts and some knits. Treat construction as the primary decision once composition is clear.",
    weightNotes:
      "Most apparel rayons sit in light-to-mid weights. Opacity and wet behaviour should be checked against the garment brief.",
    strengths: [
      "Soft apparel drape",
      "Useful for fluid dresses and blouses",
      "Often blended for cost or performance balance",
    ],
    watchouts: [
      "Composition labels vary by market language",
      "Care and shrinkage need sampling",
      "Not a substitute for silk without testing",
    ],
    typicalUses: ["dresses", "blouses", "linings"],
    buyerNotes:
      "Confirm the exact composition string and construction. ‘Rayon’ on its own is not a complete fabric brief.",
    relatedMaterials: ["viscose", "silk", "cotton"],
    imageHint: "/media/fabrics/tencel-plain-weave-primary.webp",
  },
  {
    id: "jersey",
    label: "Jersey",
    aliases: ["jersey knit", "jersey cloth"],
    family: "knit construction family",
    collectionSlug: "knitwear",
    fiberNotes:
      "Jersey is a knit construction family rather than a single fibre — cotton, wool, polyester and blends all appear as jersey.",
    handFeel:
      "Usually soft with stretch from structure; fibre and gauge still decide thickness and recovery.",
    constructionNotes:
      "Single jersey, interlock and related knits change opacity, edge behaviour and recovery. Always read construction notes.",
    weightNotes:
      "Fine gauges suit tees and base layers; heavier jerseys support lounge and structured knit programmes.",
    strengths: [
      "Inherent stretch from knit structure",
      "Comfort for apparel and active-adjacent programmes",
      "Wide fibre options under one construction label",
    ],
    watchouts: [
      "Fibre still matters for care and hand",
      "Edge curl and opacity need pattern checks",
      "Recovery should be sampled for fitted garments",
    ],
    typicalUses: ["shirts", "activewear", "dresses", "loungewear"],
    buyerNotes:
      "Specify fibre, gauge and recovery needs. Jersey is a construction choice first.",
    relatedMaterials: ["cotton", "polyester", "wool"],
    imageHint: "/media/fabrics/mercerized-cotton-jersey-primary.webp",
  },
  {
    id: "velvet",
    label: "Velvet",
    aliases: ["velvet cloth", "pile velvet"],
    family: "pile",
    collectionSlug: "velvet-pile",
    fiberNotes:
      "Velvet is a pile construction that can be silk, cotton, polyester or blends — fibre and pile density drive the product role.",
    handFeel:
      "Soft, directional pile with light play. Crush and mark behaviour depend on pile and ground cloth.",
    constructionNotes:
      "Pile height, density and ground weave decide durability for apparel versus décor.",
    weightNotes:
      "Apparel velvets and décor piles are different tools. Compare published weight and end-use notes.",
    strengths: [
      "Distinctive surface for occasion and seasonal programmes",
      "Rich visual depth",
      "Works in apparel and selected interiors when specified correctly",
    ],
    watchouts: [
      "Crush marks and seam behaviour need sampling",
      "Directional nap affects cutting",
      "Fibre composition changes care dramatically",
    ],
    typicalUses: ["dresses", "jackets", "occasionwear"],
    buyerNotes:
      "Confirm fibre, pile behaviour and garment role before shortlisting velvet.",
    relatedMaterials: ["silk", "cotton", "polyester"],
    imageHint: "/media/fabrics/crushed-velvet-primary.webp",
  },
  {
    id: "chiffon",
    label: "Chiffon",
    aliases: ["chiffon cloth"],
    family: "sheer woven",
    collectionSlug: "silk-sheer",
    fiberNotes:
      "Chiffon is a sheer, lightweight plain-weave character often in silk or polyester, used for overlays and fluid dresses.",
    handFeel:
      "Light, airy, with soft float. Sheer by nature — opacity strategies matter.",
    constructionNotes:
      "Sheer plain weave with lively drape. Fibre choice changes care and luminosity.",
    weightNotes:
      "Very light weights. Layering and lining are common product decisions.",
    strengths: [
      "Fluid sheer for overlays and occasion dresses",
      "Light visual movement",
      "Useful for layered silhouettes",
    ],
    watchouts: [
      "Sheer — plan lining or layering",
      "Seam and fray behaviour need care",
      "Not a structured garment cloth",
    ],
    typicalUses: ["dresses", "overlays", "scarves", "blouses"],
    buyerNotes:
      "Use chiffon when sheer fluid movement is intentional, and document opacity needs in the brief.",
    relatedMaterials: ["georgette", "silk", "polyester"],
    imageHint: "/media/fabrics/silk-chiffon-primary.webp",
  },
  {
    id: "georgette",
    label: "Georgette",
    aliases: ["georgette cloth"],
    family: "sheer woven",
    collectionSlug: "silk-sheer",
    fiberNotes:
      "Georgette is a sheer crepe-character cloth, often silk or polyester, with more grain and bounce than chiffon.",
    handFeel:
      "Dry, lightly pebbled, with lively drape. Reads less slippery than chiffon in many programmes.",
    constructionNotes:
      "Crepe yarns create the surface. Fibre still decides care and lustre.",
    weightNotes:
      "Light sheer weights for dresses and blouses; opacity planning still applies.",
    strengths: [
      "Sheer with more texture than chiffon",
      "Good for fluid dresses and overlays",
      "Distinct surface character",
    ],
    watchouts: [
      "Sheer constructions need lining strategies",
      "Compare carefully with chiffon for the silhouette",
      "Fibre care differs widely",
    ],
    typicalUses: ["dresses", "blouses", "overlays"],
    buyerNotes:
      "Choose georgette when you want sheer movement with a drier crepe hand rather than a glassy chiffon float.",
    relatedMaterials: ["chiffon", "silk", "crepe"],
    imageHint: "/media/fabrics/silk-georgette-primary.webp",
  },
  {
    id: "poplin",
    label: "Poplin",
    aliases: ["poplin cloth", "cotton poplin"],
    family: "plain weave",
    collectionSlug: "cotton",
    fiberNotes:
      "Poplin is a fine plain weave, commonly cotton, associated with crisp shirting and clean apparel surfaces.",
    handFeel:
      "Typically smooth and crisp with a clean face — finishes can soften or polish the hand.",
    constructionNotes:
      "Fine warp-faced plain weave. Yarn quality and finish drive commercial shirting performance.",
    weightNotes:
      "Usually light-to-mid apparel weights suited to shirts and structured blouses.",
    strengths: [
      "Clean surface for shirts and uniforms",
      "Predictable cutting behaviour in many programmes",
      "Familiar apparel language for buyers",
    ],
    watchouts: [
      "Not all poplins are cotton — read composition",
      "Crispness vs softness is a finish decision",
      "Opacity varies with yarn and colour",
    ],
    typicalUses: ["shirts", "blouses", "uniforms"],
    buyerNotes:
      "Poplin is a construction choice for clean shirts. Confirm fibre, weight and finish against the shirt brief.",
    relatedMaterials: ["cotton", "oxford", "twill"],
    imageHint: "/media/fabrics/cotton-poplin-primary.webp",
  },
  {
    id: "satin",
    label: "Satin",
    aliases: ["satin cloth", "satin weave"],
    family: "satin weave",
    fiberNotes:
      "Satin refers to a weave structure with long floats that create lustre; fibre may be silk, polyester or blends.",
    handFeel:
      "Smooth, often lustrous face with a softer reverse. Float length affects snag risk.",
    constructionNotes:
      "Satin weave is the defining trait. Fibre and density decide apparel vs lining roles.",
    weightNotes:
      "From fluid dress satins to denser lining satins — weight and opacity must match the garment.",
    strengths: [
      "Lustrous face for occasion and evening programmes",
      "Smooth hand for linings and dresses",
      "Clear visual identity when well chosen",
    ],
    watchouts: [
      "Snagging risk on long floats",
      "Fibre care varies",
      "Not automatically ‘silk’ — read composition",
    ],
    typicalUses: ["dresses", "linings", "blouses", "occasionwear"],
    buyerNotes:
      "Treat satin as a weave decision, then confirm fibre and opacity for the silhouette.",
    relatedMaterials: ["silk", "polyester", "crepe"],
    imageHint: "/media/fabrics/silk-satin-primary.webp",
  },
  {
    id: "crepe",
    label: "Crepe",
    aliases: ["crepe cloth", "crêpe"],
    family: "textured woven",
    fiberNotes:
      "Crepe describes a textured, often pebbled surface from high-twist yarns or crepe weaves, across silk, wool, polyester and blends.",
    handFeel:
      "Dry, granular, with fluid or structured drape depending on fibre and density.",
    constructionNotes:
      "Crepe de chine, wool crepes and polyester crepes are different tools under one surface language.",
    weightNotes:
      "Dress-weight crepes and suiting crepes diverge quickly — use published GSM and end-use notes.",
    strengths: [
      "Matte textured face that hides minor creasing",
      "Useful for dresses and soft tailoring",
      "Good movement without high shine",
    ],
    watchouts: [
      "Fibre determines care and recovery",
      "Surface can mark under pressure",
      "Do not assume silk crepe behaviour for all crepes",
    ],
    typicalUses: ["dresses", "blouses", "trousers", "suits"],
    buyerNotes:
      "Name the garment and fibre first. Crepe is a surface/construction character, not a complete brief.",
    relatedMaterials: ["silk", "wool", "georgette"],
    imageHint: "/media/fabrics/crepe-de-chine-primary.webp",
  },
  {
    id: "canvas",
    label: "Canvas",
    aliases: ["canvas cloth", "cotton canvas"],
    family: "dense woven",
    fiberNotes:
      "Canvas is a dense, durable plain weave historically cotton or linen, used for structured bags, workwear and some outer layers.",
    handFeel:
      "Firm, dry, with body. Softer washed canvases exist but structure remains the point.",
    constructionNotes:
      "Tight plain weave with durability as the primary product promise.",
    weightNotes: "Typically mid-to-heavy. Not a fluid dress cloth.",
    strengths: [
      "Structure and durability",
      "Clear workwear and utility language",
      "Holds shape in bags and structured garments",
    ],
    watchouts: [
      "Too heavy or stiff for many soft apparel briefs",
      "Finish and fibre change water behaviour",
      "Confirm weight for wearable programmes",
    ],
    typicalUses: ["workwear", "jackets", "trousers"],
    buyerNotes:
      "Use canvas when structure and toughness lead the brief. Soft apparel programmes usually need a different construction.",
    relatedMaterials: ["cotton", "denim", "twill"],
    imageHint: "/media/fabrics/wool-hemp-canvas-primary.webp",
  },
  {
    id: "oxford",
    label: "Oxford",
    aliases: ["oxford cloth", "oxford cotton"],
    family: "shirting weave",
    collectionSlug: "cotton",
    fiberNotes:
      "Oxford is a basket-weave shirting construction, typically cotton, with a slightly textured face and solid everyday durability.",
    handFeel:
      "Soft-crisp with a subtle texture; softer than many poplins in casual shirt programmes.",
    constructionNotes:
      "Basket weave creates the oxford character. Yarn quality drives commercial shirt performance.",
    weightNotes: "Usually light-to-mid shirt weights.",
    strengths: [
      "Reliable casual and smart-casual shirt language",
      "Good everyday durability in many programmes",
      "Familiar buyer shorthand",
    ],
    watchouts: [
      "Not identical to poplin — surface and opacity differ",
      "Stretch oxfords need recovery checks",
      "Composition still matters",
    ],
    typicalUses: ["shirts", "blouses", "uniforms"],
    buyerNotes:
      "Choose oxford when you want a textured shirt cloth rather than a flat poplin face.",
    relatedMaterials: ["cotton", "poplin", "twill"],
    imageHint: "/media/fabrics/soft-oxford-cotton-primary.webp",
  },
  {
    id: "twill",
    label: "Twill",
    aliases: ["twill cloth", "twill weave"],
    family: "diagonal weave",
    fiberNotes:
      "Twill is a weave with diagonal wales, used across cotton, wool, polyester and blends for trousers, jackets and work cloths.",
    handFeel:
      "Usually denser and more durable-feeling than comparable plain weaves, with drape depending on yarn and fibre.",
    constructionNotes:
      "Diagonal structure improves durability and can hide wear. Denim is a specialised twill story.",
    weightNotes: "Spans shirting twills through trouser and jacket weights.",
    strengths: [
      "Durable structure for trousers and jackets",
      "Good commercial clarity for workwear",
      "Flexible fibre platforms",
    ],
    watchouts: [
      "Fibre still decides care and seasonality",
      "Not automatically denim",
      "Weight must match the garment",
    ],
    typicalUses: ["trousers", "jackets", "uniforms", "workwear"],
    buyerNotes:
      "Use twill when diagonal structure and durability support the garment — then confirm fibre and weight.",
    relatedMaterials: ["cotton", "wool", "denim", "canvas"],
    imageHint: "/media/fabrics/wool-cotton-twill-primary.webp",
  },
  {
    id: "french-terry",
    label: "French terry",
    aliases: ["french terry cloth", "terry knit"],
    family: "knit",
    collectionSlug: "knitwear",
    fiberNotes:
      "French terry is a knit with loops on one face, used for lounge, sports-adjacent and casual apparel programmes.",
    handFeel:
      "Soft face with looped reverse; fibre (often cotton or blends) drives absorbency and hand.",
    constructionNotes:
      "Loop knit structure — not woven terry towelling. Gauge and fibre change the product role.",
    weightNotes:
      "Mid weights are common for sweatshirts and lounge; lighter versions exist for milder climates.",
    strengths: [
      "Comfort for casual and lounge programmes",
      "Familiar athletic-adjacent language",
      "Good everyday knit option when recovery is adequate",
    ],
    watchouts: [
      "Not a formal shirting cloth",
      "Recovery and stretch vary",
      "Fibre blends change care",
    ],
    typicalUses: ["activewear", "loungewear", "workwear"],
    buyerNotes:
      "Shortlist french terry for casual knit programmes and confirm fibre, weight and recovery.",
    relatedMaterials: ["jersey", "cotton", "polyester"],
    imageHint: "/media/fabrics/french-terry-stretch-primary.webp",
  },
  {
    id: "lyocell",
    label: "Lyocell",
    aliases: ["Tencel", "lyocell cloth"],
    family: "regenerated cellulose",
    fiberNotes:
      "Lyocell is a regenerated cellulose fibre often chosen for soft hand, fluid drape and cleaner process narratives when documented.",
    handFeel:
      "Typically soft and smooth with fluid apparel drape; blends with linen or cotton shift texture.",
    constructionNotes:
      "Appears in plain weaves, twills and jersey-like constructions for shirts and dresses.",
    weightNotes:
      "Often light-to-mid apparel weights. Confirm opacity for pale colours.",
    strengths: [
      "Soft fluid apparel hand",
      "Useful in modern cellulose programmes",
      "Blends well for summer clothing",
    ],
    watchouts: [
      "Brand names are not a substitute for composition strings",
      "Care and wet behaviour need sampling",
      "Process claims require documentation",
    ],
    typicalUses: ["shirts", "dresses", "blouses"],
    buyerNotes:
      "Treat lyocell as a cellulose option for soft apparel, and verify construction plus care in sampling.",
    relatedMaterials: ["viscose", "linen", "cotton"],
    imageHint: "/media/fabrics/tencel-shirting-primary.webp",
  },
];

export const USES: readonly UseEntity[] = [
  {
    id: "shirts",
    label: "shirts",
    garmentLabel: "shirt",
    bestForSlug: "shirting",
    requirements: [
      "stable cutting behaviour",
      "appropriate opacity for pale colours",
      "collar and placket friendliness",
      "comfort next to skin",
    ],
    preferredTraits: [
      "crisp or soft-crisp hand",
      "predictable recovery",
      "clean surface",
    ],
    weightGuidance:
      "Most shirt programmes sit in light-to-mid weights. Too heavy reads outerwear; too sheer needs lining strategies uncommon in classic shirts.",
    constructionGuidance:
      "Poplin, oxford, twill, fine jersey and selected linens cover most shirt briefs. Match construction to formal vs casual intent.",
    seasonalNotes:
      "Summer shirts favour breathable open cottons, linens and lightweight cellulosics. Cooler seasons may use denser cottons or brushed hands.",
    buyerNotes:
      "Define formal vs casual, climate and opacity before shortlisting. Shirt fabric is a garment decision first.",
    relatedUses: ["blouses", "uniforms", "dresses"],
  },
  {
    id: "dresses",
    label: "dresses",
    garmentLabel: "dress",
    bestForSlug: "dresses",
    requirements: [
      "drape matched to silhouette",
      "opacity planning",
      "comfort for longer wear",
      "seam and finish behaviour for curves",
    ],
    preferredTraits: [
      "fluid or controlled drape",
      "agreeable hand",
      "predictable opacity",
    ],
    weightGuidance:
      "Dress weights span sheer overlays to mid-weight day dresses. GSM and construction together explain silhouette support.",
    constructionGuidance:
      "Crepes, chiffons, georgettes, soft cottons, linens and selected knits appear often — each answers a different dress architecture.",
    seasonalNotes:
      "Summer dresses lean breathable and lighter; occasion dresses may prioritise surface and drape over climate.",
    buyerNotes:
      "Name the silhouette (slip, shirt-dress, volume, column) before fibre. Drape and opacity decide more than marketing labels.",
    relatedUses: ["blouses", "skirts", "occasionwear"],
  },
  {
    id: "trousers",
    label: "trousers",
    garmentLabel: "trouser",
    bestForSlug: "trousers",
    requirements: [
      "recovery at seat and knee",
      "opacity",
      "crease or soft break behaviour as designed",
      "durable seam performance",
    ],
    preferredTraits: [
      "stable structure",
      "good recovery",
      "appropriate denseness",
    ],
    weightGuidance:
      "Trouser cloths are usually mid weight and up. Lightweight cloths can work for soft summer trousers if opacity and recovery hold.",
    constructionGuidance:
      "Twills, denser plains, wool suitings, linen blends and selected stretch wovens dominate.",
    seasonalNotes:
      "Linen and tropical wools for warm climates; denser cottons and wools for cooler programmes.",
    buyerNotes:
      "Prioritise recovery and opacity. A beautiful soft shirt cloth often fails as a trouser cloth.",
    relatedUses: ["suits", "workwear", "skirts"],
  },
  {
    id: "jackets",
    label: "jackets",
    garmentLabel: "jacket",
    bestForSlug: "jackets",
    requirements: [
      "enough body for shape",
      "compatible interlining strategy",
      "durable wear at elbows and edges",
    ],
    preferredTraits: ["structure", "stable cutting", "season-right weight"],
    weightGuidance:
      "Jackets need enough body to hold shape. Soft dress weights rarely succeed without structural support.",
    constructionGuidance:
      "Suiting wools, denser cottons, technical shells and selected double-face cloths appear depending on the jacket type.",
    seasonalNotes:
      "Unlined summer jackets need lighter structured cloths; winter jackets push denser or technical builds.",
    buyerNotes:
      "Separate soft jackets, work jackets and tailored jackets into different briefs before shortlisting.",
    relatedUses: ["coats", "blazers", "suits"],
  },
  {
    id: "coats",
    label: "coats",
    garmentLabel: "coat",
    bestForSlug: "coats",
    requirements: [
      "insulation or wind strategy",
      "durable face",
      "weight compatible with wear time",
    ],
    preferredTraits: ["density or technical performance", "stable structure"],
    weightGuidance:
      "Coat cloths are typically heavier or technical. Lightweight apparel cloths are usually wrong tools.",
    constructionGuidance:
      "Meltons, dense wools, technical outerwear constructions and selected double-face cloths lead.",
    seasonalNotes:
      "Climate and layering strategy define the brief more than fibre fashion.",
    buyerNotes:
      "Document climate, lining and silhouette. Coat fabric selection is structural first.",
    relatedUses: ["jackets", "outerwear", "suits"],
  },
  {
    id: "suits",
    label: "suits",
    garmentLabel: "suit",
    bestForSlug: "suiting",
    requirements: [
      "crease behaviour",
      "recovery",
      "tailoring compatibility",
      "consistent matching across garments",
    ],
    preferredTraits: [
      "controlled structure",
      "clean face",
      "predictable press behaviour",
    ],
    weightGuidance:
      "Tropical to mid suiting weights depending on climate. Heavy coating weights are usually separate programmes.",
    constructionGuidance:
      "Worsted wools, tropical wools and selected stretch suitings dominate.",
    seasonalNotes:
      "Warm-climate suits need lighter open or tropical constructions.",
    buyerNotes:
      "Suit programmes need cloth that can be matched across jacket and trouser with stable behaviour.",
    relatedUses: ["blazers", "trousers", "jackets"],
  },
  {
    id: "blazers",
    label: "blazers",
    garmentLabel: "blazer",
    bestForSlug: "soft-tailoring",
    requirements: [
      "enough body for clean lines",
      "compatible with intended structure level",
    ],
    preferredTraits: ["tailored face", "manageable drape"],
    weightGuidance:
      "Usually mid suiting or soft-tailoring weights rather than coat weights.",
    constructionGuidance:
      "Wool suitings, linen blends and selected stretch wovens depending on soft vs structured blazer intent.",
    seasonalNotes:
      "Unstructured summer blazers favour lighter cloths with enough body to hold a shape.",
    buyerNotes:
      "Decide structured vs soft blazer before fibre. The canvas and shoulder strategy changes the cloth brief.",
    relatedUses: ["suits", "jackets"],
  },
  {
    id: "uniforms",
    label: "uniforms",
    garmentLabel: "uniform",
    requirements: [
      "durability",
      "consistent colourways",
      "care practicality",
      "predictable sizing behaviour",
    ],
    preferredTraits: ["durable", "stable", "easy-care when required"],
    weightGuidance: "Often mid weights that survive repeated wear and laundry.",
    constructionGuidance:
      "Poplins, twills, durable blends and selected performance cloths are common.",
    seasonalNotes:
      "Climate and laundry systems dominate more than fashion seasonality.",
    buyerNotes:
      "Uniform briefs should document laundry, durability and colour continuity before aesthetics.",
    relatedUses: ["workwear", "shirts", "trousers"],
  },
  {
    id: "activewear",
    label: "activewear",
    garmentLabel: "activewear piece",
    bestForSlug: "performance-apparel",
    requirements: [
      "stretch and recovery",
      "moisture strategy when required",
      "abrasion tolerance for the sport",
    ],
    preferredTraits: ["recovery", "comfort in motion", "stable stretch"],
    weightGuidance:
      "Depends on compression vs coverage. Always verify stretch percentage and recovery in sampling.",
    constructionGuidance:
      "Stretch knits, stretch wovens and performance constructions lead.",
    seasonalNotes:
      "Climate and activity intensity define insulation vs breathability needs.",
    buyerNotes:
      "Activewear is a performance brief. Aesthetic fibre stories without recovery data are incomplete.",
    relatedUses: ["workwear", "loungewear"],
  },
  {
    id: "workwear",
    label: "workwear",
    garmentLabel: "workwear piece",
    bestForSlug: "workwear-trousers",
    requirements: [
      "abrasion resistance",
      "durability at stress points",
      "practical care",
    ],
    preferredTraits: ["durable", "stable", "protective where required"],
    weightGuidance: "Usually mid-to-heavy utility weights.",
    constructionGuidance:
      "Twills, canvases, denims and durable blends are common starting points.",
    seasonalNotes: "Climate still matters, but durability leads.",
    buyerNotes:
      "Write the job site constraints into the brief before shortlisting fashion-forward cloths.",
    relatedUses: ["uniforms", "trousers", "jackets"],
  },
  {
    id: "blouses",
    label: "blouses",
    garmentLabel: "blouse",
    bestForSlug: "blouses",
    requirements: [
      "agreeable next-to-skin hand",
      "drape suited to the silhouette",
      "opacity planning",
    ],
    preferredTraits: [
      "soft or fluid hand",
      "clean or textured face as designed",
    ],
    weightGuidance:
      "Usually light-to-mid. Sheer blouses need intentional opacity strategy.",
    constructionGuidance:
      "Soft cottons, silks, chiffons, georgettes, viscose and fine knits appear frequently.",
    seasonalNotes:
      "Summer blouses favour breathable cellulosics and sheers; cooler seasons may add denser silks or brushed hands.",
    buyerNotes:
      "Blouse briefs sit between shirt structure and dress fluidity — name which side you need.",
    relatedUses: ["shirts", "dresses"],
  },
  {
    id: "skirts",
    label: "skirts",
    garmentLabel: "skirt",
    bestForSlug: "full-skirts",
    requirements: [
      "drape or structure matched to silhouette",
      "opacity",
      "comfortable waist and movement behaviour",
    ],
    preferredTraits: ["controlled or fluid drape", "stable opacity"],
    weightGuidance: "From light fluid skirts to structured mid weights.",
    constructionGuidance:
      "Crepes, cottons, wools, linens and selected knits depending on volume vs column silhouettes.",
    seasonalNotes:
      "Season follows the same climate logic as dresses, with structure more critical for tailored skirts.",
    buyerNotes: "Volume skirts and pencil skirts rarely share one cloth brief.",
    relatedUses: ["dresses", "trousers"],
  },
  {
    id: "outerwear",
    label: "outerwear",
    garmentLabel: "outerwear piece",
    bestForSlug: "outerwear",
    requirements: [
      "weather strategy",
      "durable face",
      "compatible insulation or lining plan",
    ],
    preferredTraits: ["protective", "stable", "season-right weight"],
    weightGuidance: "Typically denser or technical weights.",
    constructionGuidance:
      "Technical shells, dense wools and selected performance constructions.",
    seasonalNotes: "Climate is the brief.",
    buyerNotes:
      "Outerwear selection starts with weather and layering, not fibre fashion.",
    relatedUses: ["coats", "jackets"],
  },
  {
    id: "loungewear",
    label: "loungewear",
    garmentLabel: "loungewear piece",
    bestForSlug: "loungewear",
    requirements: ["comfort", "soft hand", "easy movement"],
    preferredTraits: ["soft", "comfortable stretch when needed"],
    weightGuidance: "Usually mid soft knits or brushed hands.",
    constructionGuidance: "Jersey, french terry and soft cellulosics dominate.",
    seasonalNotes:
      "Brushed hands for cooler lounging; lighter jerseys for mild climates.",
    buyerNotes:
      "Comfort leads. Formal suiting constructions are usually the wrong tool.",
    relatedUses: ["activewear", "knitwear"],
  },
  {
    id: "knitwear",
    label: "knitwear",
    garmentLabel: "knitwear piece",
    bestForSlug: "knitwear",
    requirements: [
      "gauge matched to silhouette",
      "recovery",
      "dimensional stability",
    ],
    preferredTraits: ["appropriate stretch", "stable loop structure"],
    weightGuidance: "Fine to heavy gauges depending on tee vs sweater intent.",
    constructionGuidance: "Jersey, interlock, pointelle and related knits.",
    seasonalNotes:
      "Fine gauges for warm weather; denser knits for cooler programmes.",
    buyerNotes: "Knitwear is gauge and fibre together — not fibre alone.",
    relatedUses: ["loungewear", "activewear", "shirts"],
  },
];

export const ATTRIBUTES: readonly AttributeEntity[] = [
  {
    id: "lightweight",
    label: "lightweight",
    definition:
      "Lightweight fabric usually means a lower published weight that supports breathability, softer drape or warm-climate comfort — but ‘light’ is relative to the garment family.",
    whyItMatters:
      "Weight affects drape, opacity, seasonality and whether a cloth can hold structure. Buyers use it as a first filter before fibre stories.",
    howToJudge:
      "Compare published GSM and construction together. A lightweight coating cloth and a lightweight shirt cloth are not interchangeable.",
    tradeoffs:
      "Very light cloths may lose opacity or structure. Confirm silhouette support and lining needs.",
    relatedAttributes: ["breathable", "sheer", "soft"],
    guidePath: "/guides/fabric-weight-and-gsm/",
  },
  {
    id: "heavyweight",
    label: "heavyweight",
    definition:
      "Heavyweight fabric typically provides structure, coverage or insulation through higher mass per area.",
    whyItMatters:
      "Trousers, jackets, coats and workwear often need denser cloths to hold shape and survive wear.",
    howToJudge:
      "Use published weight plus construction. Heavy jersey and heavy canvas solve different problems.",
    tradeoffs:
      "Heavier cloths can overheat in warm climates or feel stiff if the silhouette wants fluidity.",
    relatedAttributes: ["durable", "structured"],
    guidePath: "/guides/fabric-weight-and-gsm/",
  },
  {
    id: "breathable",
    label: "breathable",
    definition:
      "Breathable fabric allows heat and moisture vapour to move more readily, supporting comfort in warm conditions or active wear — construction matters as much as fibre.",
    whyItMatters:
      "Climate comfort is a top apparel constraint. Fibre marketing without construction context misleads.",
    howToJudge:
      "Open weaves, lighter cellulosics and some performance knits often read more breathable; dense coatings less so.",
    tradeoffs: "More open structures can reduce opacity or wind resistance.",
    relatedAttributes: ["lightweight", "soft"],
  },
  {
    id: "stretch",
    label: "stretch",
    definition:
      "Stretch fabric extends under load and should recover. Stretch can come from knit structure, elastane, or both.",
    whyItMatters:
      "Fitted apparel, activewear and comfort trousers depend on reliable stretch and recovery.",
    howToJudge:
      "Check documented stretch notes and sample recovery. Hand stretch tests are not a substitute for wear trials.",
    tradeoffs:
      "Poor recovery creates bagging. Too much stretch can distort tailored shapes.",
    relatedAttributes: ["soft", "durable"],
  },
  {
    id: "soft",
    label: "soft",
    definition:
      "Soft fabric prioritises a pleasant next-to-skin hand through fibre, yarn, construction and finish.",
    whyItMatters:
      "Blouses, dresses, lounge and many shirts succeed or fail on hand as much as on lab metrics.",
    howToJudge:
      "Hand evaluation plus finish notes. Softness claims without construction context are weak.",
    tradeoffs:
      "Very soft cloths may crease more or lose crisp structure needed for formal shirts.",
    relatedAttributes: ["breathable", "lightweight", "flowy"],
  },
  {
    id: "durable",
    label: "durable",
    definition:
      "Durable fabric maintains integrity through wear, abrasion and repeated care cycles relative to its intended use.",
    whyItMatters:
      "Workwear, uniforms, trousers and outerwear need longevity, not only first-impression hand.",
    howToJudge:
      "Construction density, fibre choice and documented end use are better signals than adjectives.",
    tradeoffs: "High durability can mean more weight or a stiffer hand.",
    relatedAttributes: ["heavyweight", "structured"],
  },
  {
    id: "premium",
    label: "premium",
    definition:
      "Premium fabric is a commercial quality signal — finer yarns, careful finishing, distinctive character — not a regulated standard.",
    whyItMatters:
      "Buyers use it as shorthand for elevated programmes, but evidence must still sit on the fabric record.",
    howToJudge:
      "Inspect composition, construction quality, finish and consistency rather than the word ‘premium’ alone.",
    tradeoffs:
      "Premium positioning without documented specs creates sourcing risk.",
    relatedAttributes: ["soft", "durable"],
  },
  {
    id: "structured",
    label: "structured",
    definition:
      "Structured fabric holds shape and supports clean lines for tailoring, trousers and jackets.",
    whyItMatters:
      "Silhouette architecture depends on cloth body as much as pattern.",
    howToJudge:
      "Look for denser weaves, suiting constructions and appropriate weight.",
    tradeoffs: "Too much structure fights fluid dresses and soft blouses.",
    relatedAttributes: ["heavyweight", "durable"],
  },
  {
    id: "flowy",
    label: "flowy",
    definition:
      "Flowy fabric drapes and moves readily, supporting fluid dresses, blouses and overlays.",
    whyItMatters:
      "Movement and silhouette softness are design-critical for many ready-to-wear programmes.",
    howToJudge:
      "Lower stiffness constructions, crepes, chiffons and soft cellulosics often read flowy — confirm with sampling.",
    tradeoffs:
      "Flowy cloths may lack the body for tailored jackets or structured trousers.",
    relatedAttributes: ["soft", "lightweight", "sheer"],
  },
  {
    id: "sheer",
    label: "sheer",
    definition:
      "Sheer fabric transmits light and usually needs lining or layering strategies for opacity-critical garments.",
    whyItMatters:
      "Opacity failures are expensive late discoveries in production.",
    howToJudge: "Hold against light, check colour, and plan lining early.",
    tradeoffs: "Sheer is a design feature — not a defect — when intentional.",
    relatedAttributes: ["lightweight", "flowy"],
  },
  {
    id: "opaque",
    label: "opaque",
    definition:
      "Opaque fabric blocks light sufficiently for the garment’s modesty and colour needs without extra lining.",
    whyItMatters:
      "Trousers, uniforms and many dresses require reliable opacity.",
    howToJudge:
      "Test in intended colourways. Pale dyes reveal opacity issues denser colours hide.",
    tradeoffs: "Higher opacity can add weight or reduce breathability.",
    relatedAttributes: ["structured", "durable"],
  },
  {
    id: "performance",
    label: "performance",
    definition:
      "Performance fabric is specified for functional traits such as stretch recovery, moisture management or durability under activity.",
    whyItMatters:
      "Active and technical programmes need measurable behaviour, not aesthetic adjectives.",
    howToJudge: "Read documented traits and sample against the activity brief.",
    tradeoffs: "Performance finishes can change hand and care requirements.",
    relatedAttributes: ["stretch", "durable", "breathable"],
  },
];

export const CONSTRUCTIONS: readonly ConstructionEntity[] = [
  {
    id: "woven",
    label: "woven",
    definition:
      "Woven fabrics are made by interlacing warp and weft yarns, generally offering more stable structure than knits.",
    behaviour:
      "Typically limited inherent stretch unless elastane or special weaves are introduced. Good for shirts, trousers, jackets and many apparel classics.",
    typicalUses: ["shirts", "trousers", "jackets", "dresses"],
    buyerNotes:
      "Choose woven when stability and clean structure matter. Confirm any stretch claims separately.",
    guidePath: "/guides/woven-vs-knit-fabrics/",
  },
  {
    id: "knit",
    label: "knit",
    definition:
      "Knit fabrics are made from interlocking loops, usually offering more inherent stretch and softer recovery behaviour than comparable wovens.",
    behaviour:
      "Comfortable for tees, dresses, lounge and active-adjacent programmes. Edge behaviour and recovery need pattern attention.",
    typicalUses: ["shirts", "dresses", "activewear", "loungewear"],
    buyerNotes:
      "Choose knit when stretch and soft movement lead. Fibre and gauge still define the product.",
    guidePath: "/guides/woven-vs-knit-fabrics/",
  },
];

export function materialById(id: string): MaterialEntity | undefined {
  return MATERIALS.find((item) => item.id === id);
}

export function useById(id: string): UseEntity | undefined {
  return USES.find((item) => item.id === id);
}

export function attributeById(id: string): AttributeEntity | undefined {
  return ATTRIBUTES.find((item) => item.id === id);
}

export function constructionById(id: string): ConstructionEntity | undefined {
  return CONSTRUCTIONS.find((item) => item.id === id);
}
