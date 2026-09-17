/**
 * Material / garment-type SEO landings under /fabrics/*.
 * Distinct from collections (fibre families) and Best For (product grids).
 */

export type MaterialLandingSection = {
  heading: string;
  body: string[];
  keyPoints?: string[];
};

export type MaterialLandingFaq = {
  question: string;
  answer: string;
};

export type MaterialLandingPage = {
  slug: "shirt-fabric" | "dress-fabric" | "wool-fabric";
  path: string;
  title: string;
  h1: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: readonly string[];
  eyebrow: string;
  intro: string;
  image: string;
  imageAlt: string;
  sections: readonly MaterialLandingSection[];
  fabricSlugs: readonly string[];
  bestForSlugs: readonly string[];
  collectionSlugs: readonly string[];
  guidePaths: readonly string[];
  relatedLandingPaths: readonly string[];
  faqs: readonly MaterialLandingFaq[];
};

export const MATERIAL_LANDING_PAGES: readonly MaterialLandingPage[] = [
  {
    slug: "shirt-fabric",
    path: "/fabrics/shirt-fabric/",
    title: "Shirt Fabric Types, Weaves & Materials",
    h1: "Shirt fabric for dress shirts and everyday shirts",
    metaDescription:
      "Compare shirt fabric types — cotton poplin, linen, twill-ready constructions and dress-shirt materials. Read weave and weight guidance, then inquire on FabStitch.",
    primaryKeyword: "shirt fabric",
    secondaryKeywords: [
      "shirt fabrics",
      "shirt material",
      "types of shirt fabric",
      "cotton shirt fabric",
      "dress shirt fabric",
      "shirt fabric weaves",
      "shirt fabric guide",
      "material for shirts",
      "fabrics for dress shirts",
      "best fabric for dress shirt",
    ],
    eyebrow: "Shirt fabrics",
    intro:
      "Shirt fabric is a construction decision first: crisp poplin for dress shirts, breathable linen for warm weather, brushed cloth for cooler seasons. Start from the shirt you are making, then compare published composition, weave character and weight.",
    image: "/media/fabrics/cotton-poplin-primary.webp",
    imageAlt: "Cotton poplin shirt fabric",
    sections: [
      {
        heading: "Shirt fabric types buyers actually compare",
        body: [
          "Common shirt materials include cotton poplin, voile, seersucker, linen and linen blends, fluid crepe for softer shirts, and brushed flannel for cooler programmes. Each behaves differently in collar structure, opacity and care.",
          "Use this page for types and weaves. Open the shirts Best For edit when you want the full product grid of fabrics documented for shirting, then inquire from a named fabric page.",
        ],
        keyPoints: [
          "Name the shirt silhouette before shortlisting fibre.",
          "Best For lists documented shirting uses; this page explains types.",
        ],
      },
      {
        heading: "Cotton shirt fabric and dress-shirt constructions",
        body: [
          "Cotton shirt fabric remains the default for many dress and button-up programmes because it can be crisp, breathable and stable when woven as poplin or similar fine plains. Softness and durability still depend on yarn and finish — not the fibre name alone.",
          "Dress shirt fabric searches often mean a smooth, opaque, structured hand suitable for collars and plackets. Compare published construction and measurement on each FabStitch cotton record rather than assuming every cotton is dress-shirt ready.",
        ],
      },
      {
        heading: "Weaves, weight and quality signals",
        body: [
          "Shirt weave types change surface and drape. Plain weaves can read crisp; textured constructions such as seersucker add surface without inventing stretch. Twill-ready directions belong where the product record documents them.",
          "Weight and GSM help narrow season and opacity, but GSM alone does not define quality. Read composition, construction and Best For uses together. When weight is unstated, leave it unstated and ask in inquiry.",
        ],
        keyPoints: [
          "GSM supports decisions; it does not replace construction.",
          "Only claim weaves that appear on the fabric record.",
        ],
      },
      {
        heading: "Men’s shirts, casual shirts and seasonal programmes",
        body: [
          "Men’s dress shirt fabric briefs often prioritise opacity, collar stability and a clean ironed appearance. Casual shirts may accept more texture, open weaves or linen character.",
          "Warm-weather programmes lean toward linen and lightweight cottons. Cooler seasons may use brushed surfaces. Match the documented hand to the calendar you actually produce.",
        ],
      },
      {
        heading: "From shortlist to marketplace inquiry",
        body: [
          "When two or three shirt fabrics fit, open each product page, compare composition and measurement, then inquire with metres and shirt type. Pair this page with fabric sourcing guidance for clothing-line briefs.",
          "Explore cotton, linen and silk collections when fibre family is already decided, or search the marketplace for filtered discovery.",
        ],
      },
    ],
    fabricSlugs: [
      "cotton-poplin",
      "cotton-voile",
      "cotton-seersucker",
      "european-flax-linen",
      "linen-cotton",
      "brushed-flannel",
    ],
    bestForSlugs: ["shirts", "trousers", "tailoring"],
    collectionSlugs: ["cotton", "linen-lightweight", "tailoring"],
    guidePaths: [
      "/guides/how-to-choose-fabric-for-shirts/",
      "/guides/fabric-weight-and-gsm/",
      "/guides/woven-vs-knit-fabrics/",
      "/guides/what-is-cotton-fabric/",
    ],
    relatedLandingPaths: [
      "/fabrics/dress-fabric/",
      "/fabrics/clothing/",
      "/fabrics/wool-fabric/",
      "/collections/cotton/",
      "/fabric-sourcing/",
    ],
    faqs: [
      {
        question: "What fabric are dress shirts usually made of?",
        answer:
          "Many dress shirts use fine woven cotton constructions such as poplin. Always confirm composition and construction on the named fabric page — fibre alone does not guarantee dress-shirt behaviour.",
      },
      {
        question: "Is cotton always the best shirt fabric?",
        answer:
          "No. Cotton suits many programmes, but linen, blends and other documented constructions may fit breathability, drape or season better. Compare the brief to published specs.",
      },
      {
        question: "Where do I browse shirt fabrics on FabStitch?",
        answer:
          "Use this types guide, then the shirts Best For edit for documented shirting fabrics, cotton or linen collections for fibre families, and the marketplace for filtered search.",
      },
    ],
  },
  {
    slug: "dress-fabric",
    path: "/fabrics/dress-fabric/",
    title: "Dress Fabric Types for Dressmaking & Apparel",
    h1: "Fabric for dresses — types, drape and weight",
    metaDescription:
      "Explore fabric for dresses: cotton, linen, silk sheers and fluid constructions. Compare drape, opacity and weight, then inquire on FabStitch.",
    primaryKeyword: "fabric for dresses",
    secondaryKeywords: [
      "dress fabric",
      "fabrics for dresses",
      "dress material fabric",
      "types of dress fabric",
      "fabric to make dresses",
      "cotton dress fabric",
      "linen dress fabric",
      "silk dress fabric",
      "lightweight dress fabric",
      "fashion dress fabrics",
    ],
    eyebrow: "Dress fabrics",
    intro:
      "Fabric for dresses is chosen by silhouette: fluid for bias and slip shapes, structured for volume, sheer for layers. Compare drape, opacity, stretch and published weight before you inquire.",
    image: "/media/fabrics/silk-georgette-primary.webp",
    imageAlt: "Silk georgette dress fabric",
    sections: [
      {
        heading: "Dress fabric types by silhouette",
        body: [
          "Common dressmaking directions include breathable linen and linen blends, cotton plains and soft cottons, fluid crepe, and silk sheers such as chiffon and georgette. Occasion programmes may need more body or shine — only when the fabric record supports it.",
          "This page explains dress fabric choice. The dresses Best For edit lists fabrics documented for dressmaking so you can compare real product cards.",
          "Women’s dress fabric searches often mix day dresses, slip silhouettes and occasion looks. Treat those as different briefs even when they share a fibre family.",
        ],
        keyPoints: [
          "Match cloth to silhouette before fibre branding.",
          "Sheer cloths usually need lining decisions in the brief.",
        ],
      },
      {
        heading: "Drape, opacity, stretch and weight",
        body: [
          "Drape decides whether a dress hangs close or stands away. Opacity decides lining. Stretch decides fit strategy. Weight and GSM help with season and coverage, but never replace construction notes.",
          "Do not invent “best dress fabric” rankings. Two silks or two cottons can answer different dresses. Read each named FabStitch specification.",
          "Lightweight dress fabric programmes should still verify opacity in daylight conditions during sampling. A low-mass cloth can be surprisingly see-through.",
        ],
      },
      {
        heading: "Cotton, linen and silk dress programmes",
        body: [
          "Cotton dress fabric suits many day dresses when the construction is soft enough for movement. Linen dress fabric suits warm-weather and relaxed shapes when crease behaviour is acceptable. Silk sheers suit layered and occasion stories when opacity is managed.",
          "Browse cotton, linen-lightweight and silk-sheer collections when fibre family leads; return here for silhouette guidance.",
          "Fashion dress fabrics on FabStitch are still named catalog records — aesthetic direction does not replace composition and construction fields.",
        ],
      },
      {
        heading: "Sewing and sourcing notes",
        body: [
          "Dressmaking fabrics differ in seam finishing needs and lining. Mention silhouette and lining plans in the inquiry. For clothing-line sourcing process, use the fabric sourcing page alongside this guide.",
          "When quantity is commercial, pair dress selection with wholesale fabric guidance. When you need mass education, open the fabric GSM and lightweight fabric guides without treating either as a universal quality score.",
        ],
      },
    ],
    fabricSlugs: [
      "silk-georgette",
      "silk-chiffon",
      "crepe-de-chine",
      "european-flax-linen",
      "linen-silk",
      "cotton-voile",
    ],
    bestForSlugs: ["dresses", "occasionwear", "resortwear"],
    collectionSlugs: ["silk-sheer", "linen-lightweight", "cotton"],
    guidePaths: [
      "/guides/how-to-choose-fabric-for-dresses/",
      "/guides/chiffon-vs-georgette/",
      "/guides/fabric-weight-and-gsm/",
      "/guides/lightweight-fabric/",
    ],
    relatedLandingPaths: [
      "/fabrics/shirt-fabric/",
      "/fabrics/clothing/",
      "/collections/silk-sheer/",
      "/fabric-sourcing/",
      "/marketplace/",
    ],
    faqs: [
      {
        question: "What fabric is used to make dresses?",
        answer:
          "Dresses use many constructions — linen, cotton, crepe, chiffon, georgette and more. Choose by silhouette, drape and opacity, then confirm the named fabric’s published specs.",
      },
      {
        question: "Is silk always right for dresses?",
        answer:
          "No. Silk sheers suit some occasion and layered looks, but cotton and linen often fit day dresses better. Match the brief to documented behaviour.",
      },
    ],
  },
  {
    slug: "wool-fabric",
    path: "/fabrics/wool-fabric/",
    title: "Wool Fabric for Apparel, Tailoring & Outerwear",
    h1: "Wool fabric for clothing, tailoring and coats",
    metaDescription:
      "Explore wool fabric for apparel — woven wool, tailoring cloths, textures and outerwear directions. Compare composition and construction, then inquire on FabStitch.",
    primaryKeyword: "wool fabric",
    secondaryKeywords: [
      "wool fabrics",
      "wool material",
      "woven wool fabric",
      "wool clothing material",
      "types of wool fabrics",
      "what is woolen fabric",
      "properties of wool fabric",
      "wool fabric for clothing",
      "durable wool fabric",
    ],
    eyebrow: "Wool fabrics",
    intro:
      "Wool fabric covers soft suiting weaves, open summer wools, brushed textures and denser coat cloths. Evaluate fibre blend, construction and documented weight together — not a single “wool” label.",
    image: "/media/fabrics/tropical-wool-super-110s-130s-primary.webp",
    imageAlt: "Tropical wool fabric for apparel programmes",
    sections: [
      {
        heading: "What wool fabric is on FabStitch",
        body: [
          "Wool fabric is cloth made with wool fibre, often blended with silk, linen, elastane or other fibres when the product record says so. Woven wool and finished knits such as boiled wool answer different garments.",
          "FabStitch does not invent a universal wool ranking. Tropical suiting, open weaves, melton and merino knits are different tools for different briefs.",
          "Searches for woolen fabric, wool material and wool clothing material should still resolve to named product pages with published composition — not lifestyle adjectives alone.",
        ],
      },
      {
        heading: "Woven wool, weights and apparel uses",
        body: [
          "Woven wool fabric for clothing includes lightweight open weaves for unstructured jackets, tropical wools for warmer suiting, and denser cloths for cooler outerwear. Weight and density affect drape and warmth, but construction and finish matter as much as mass.",
          "Use the Tailoring and AW Textures collections when browsing wool-forward edits, and Best For tailoring or outerwear when the garment is fixed.",
          "Durable wool fabric claims only apply when recovery, density or finish language is actually documented. Do not infer durability from a photograph.",
        ],
        keyPoints: [
          "Warmth is not GSM alone.",
          "Stretch must be documented to count.",
        ],
      },
      {
        heading: "How buyers evaluate wool quality",
        body: [
          "Buyers compare hand, surface, recovery, crease behaviour and whether composition is clearly stated. “Real wool” claims only apply when the fabric page documents wool content.",
          "Identify wool by the published composition field — do not guess from photos. Ask in inquiry when testing or care constraints are critical.",
          "Medium-weight wool fabric programmes still need silhouette context: trousers, jackets and coats impose different structure requirements.",
        ],
      },
      {
        heading: "Sourcing wool for brands and programmes",
        body: [
          "Inquire with fabric name, metres and garment (suit, coat, knit). Pair with wholesale or fabric sourcing pages when quantity or process language dominates.",
          "Clothing fabric hubs and the woven fabric guide help when the brief is still choosing between fibre families and constructions.",
        ],
      },
    ],
    fabricSlugs: [
      "tropical-wool-super-110s-130s",
      "wool-silk-bi-stretch",
      "wool-linen-open-weave",
      "merino-roica-stretch-tailoring",
      "melton",
      "boiled-wool",
    ],
    bestForSlugs: ["tailoring", "outerwear", "trousers"],
    collectionSlugs: ["tailoring", "aw-textures", "knitwear"],
    guidePaths: [
      "/guides/fabric-weight-and-gsm/",
      "/guides/woven-vs-knit-fabrics/",
      "/guides/how-to-source-fabric-for-clothing-brands/",
    ],
    relatedLandingPaths: [
      "/fabrics/clothing/",
      "/fabrics/shirt-fabric/",
      "/collections/tailoring/",
      "/wholesale-fabric/",
      "/marketplace/",
    ],
    faqs: [
      {
        question: "What is woolen fabric?",
        answer:
          "Woolen or wool fabric is cloth that uses wool fibre in its published composition. Construction may be woven or knitted and finished; always read the named product record.",
      },
      {
        question: "Is wool always woven?",
        answer:
          "No. Wool appears in woven suiting and in knitted or felted directions such as boiled wool. Construction is separate from fibre.",
      },
    ],
  },
] as const;

export const MATERIAL_LANDING_BY_SLUG = Object.fromEntries(
  MATERIAL_LANDING_PAGES.map((page) => [page.slug, page]),
) as Record<MaterialLandingPage["slug"], MaterialLandingPage>;

export function materialLandingWordCount(page: MaterialLandingPage): number {
  return [
    page.h1,
    page.intro,
    page.metaDescription,
    ...page.sections.flatMap((section) => [
      section.heading,
      ...section.body,
      ...(section.keyPoints ?? []),
    ]),
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ]
    .join(" ")
    .trim()
    .split(/\s+/).length;
}
