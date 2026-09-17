/**
 * Top-level commercial SEO landings (sourcing + wholesale).
 * Kept separate from /fabrics/* intent hubs to avoid cannibalization.
 */

export type CommercialLandingFaq = {
  question: string;
  answer: string;
};

export type CommercialLandingSection = {
  heading: string;
  body: string[];
  keyPoints?: string[];
};

export type CommercialConsideration = {
  title: string;
  body: string;
};

export type CommercialLandingPage = {
  slug: "fabric-sourcing" | "wholesale-fabric";
  path: string;
  title: string;
  h1: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: readonly string[];
  eyebrow: string;
  valueProposition: string;
  heroCtaLabel: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  image: string;
  imageAlt: string;
  considerationsHeading: string;
  considerations: readonly CommercialConsideration[];
  sections: readonly CommercialLandingSection[];
  fabricSlugs: readonly string[];
  bestForSlugs: readonly string[];
  collectionSlugs: readonly string[];
  guidePaths: readonly string[];
  relatedLandingPaths: readonly string[];
  faqs: readonly CommercialLandingFaq[];
  finalCtaHeading: string;
  finalCtaBody: string;
};

export const COMMERCIAL_LANDING_PAGES: readonly CommercialLandingPage[] = [
  {
    slug: "fabric-sourcing",
    path: "/fabric-sourcing/",
    title: "Fabric Sourcing for Clothing Brands & Designers",
    h1: "Fabric sourcing for clothing lines and designers",
    metaDescription:
      "Learn fabric sourcing for clothing brands and designers — briefs, composition, construction, weight, sampling and inquiry — then explore FabStitch.",
    primaryKeyword: "fabric sourcing",
    secondaryKeywords: [
      "sourcing fabrics",
      "fabric sourcing guide",
      "what is fabric sourcing",
      "how to source fabric",
      "how to source fabric for clothing",
      "where to source fabric",
      "fabric sourcing online",
      "fabric sourcing platform",
      "fabric sourcing process",
      "fabric sourcing for designers",
      "sourcing fabric for clothing line",
      "sourcing fabric for small business",
      "finding fabric for clothing line",
      "where do clothing brands get their fabric",
      "where do fashion designers get their fabric",
      "materials for clothing line",
      "fabric procurement",
      "fabric acquisition",
      "fabric sourcing best practices",
      "fabric sourcing tips",
    ],
    eyebrow: "Fabric sourcing",
    valueProposition:
      "Fabric sourcing is how clothing brands, designers and small labels turn a product brief into named cloth with documented specs — then inquire with clear quantity and use context.",
    heroCtaLabel: "Open fabric marketplace",
    secondaryCtaLabel: "Browse fabrics hub",
    secondaryCtaHref: "/fabrics/",
    image: "/media/fabrics/european-flax-linen-primary.webp",
    imageAlt: "European flax linen fabric used in clothing-line sourcing",
    considerationsHeading: "What to decide before you shortlist cloth",
    considerations: [
      {
        title: "Composition",
        body: "Fibre content drives hand, care and performance. Only use what the fabric record states.",
      },
      {
        title: "Construction",
        body: "Woven, knit and specialty constructions behave differently in sewing, stretch and drape.",
      },
      {
        title: "Weight / GSM",
        body: "Published weight or measurement helps match season, opacity and silhouette — do not invent numbers.",
      },
      {
        title: "Quantity & MOQ",
        body: "Share metres or yards in the inquiry. Do not assume MOQs that the page does not publish.",
      },
      {
        title: "Sampling",
        body: "Sample when hand, opacity or stretch matter. Mention sample needs in your inquiry note.",
      },
      {
        title: "Lead time & quality",
        body: "Ask about timing and quality checks in follow-up. Public pages do not invent supplier lead times.",
      },
    ],
    sections: [
      {
        heading: "What fabric sourcing means",
        body: [
          "Fabric sourcing is the process of finding, evaluating and securing cloth for a clothing programme. It covers product brief, material shortlist, specification checks, sampling where needed, and commercial inquiry — not a single keyword search.",
          "Brands and designers often ask where clothing companies get their fabric. In practice, teams use marketplaces, mills, agents and showrooms. FabStitch focuses on discovery with published composition, construction and Best For uses before you inquire — without exposing private supplier identities on the storefront.",
        ],
        keyPoints: [
          "Start from the garment and constraints, not a fibre buzzword alone.",
          "Documented specs beat lifestyle language.",
        ],
      },
      {
        heading: "A practical fabric sourcing process",
        body: [
          "Write the brief: garment type, season, stretch or opacity needs, approximate metres, and any hard factory constraints you already know.",
          "Discover on FabStitch through collections (material families), Best For edits (product-first), or marketplace search. Open product pages to compare composition, construction and published measurements.",
          "Shortlist two or three named fabrics. Inquire with fabric name, quantity and garment context. Ask about sampling, lead time and commercial terms in that conversation — do not invent them onto the page.",
        ],
        keyPoints: [
          "Keep the shortlist small enough to compare honestly.",
          "Inquiry notes replace missing commercial fields.",
        ],
      },
      {
        heading: "Sourcing fabrics for a clothing line",
        body: [
          "Clothing-line sourcing usually mixes everyday ready-to-wear cloth with a few signature materials. Use Best For edits for shirts, dresses, trousers, outerwear or tailoring when the silhouette is clear. Use collections when the fibre family is already decided.",
          "Small businesses and boutique labels can share the same fabric records as larger brands; the inquiry note changes. State whether you are sampling, producing a capsule, or planning a broader run.",
          "Raw materials for a clothing business include more than fashion cloth — linings, trims and packaging sit outside this page. Focus here on apparel fabric selection with documented properties.",
        ],
      },
      {
        heading: "Where designers and brands source online",
        body: [
          "Online fabric sourcing works when product pages carry real specifications and the inquiry path is clear. FabStitch is a fabric marketplace and sourcing website for that workflow: search, filter, compare named fabrics, then inquire.",
          "If your brief is aesthetic-first, also read the fashion fabrics landing. If production language dominates, use the apparel fabric page. Everyday garment selection is covered on the clothing fabric page.",
        ],
      },
      {
        heading: "Fabric sourcing tips that stay honest",
        body: [
          "Prefer published weight and construction over photo mood. Ask about opacity, recovery and care when those properties are critical and not listed.",
          "Do not claim certifications, MOQs, prices or supplier counts that the fabric page does not state. FabStitch keeps the storefront free of invented commercial theatre.",
          "Connect discovery to education: weight/GSM guides and buying-online guides support the same path without duplicating this page.",
        ],
      },
    ],
    fabricSlugs: [
      "european-flax-linen",
      "cotton-poplin",
      "tropical-wool-super-110s-130s",
      "stretch-woven-compression",
      "silk-chiffon",
      "lightweight-denim",
    ],
    bestForSlugs: ["shirts", "dresses", "trousers", "tailoring", "outerwear"],
    collectionSlugs: [
      "cotton",
      "linen-lightweight",
      "tailoring",
      "performance",
    ],
    guidePaths: [
      "/guides/how-to-source-fabric-for-clothing-brands/",
      "/guides/how-to-buy-fabric-online/",
      "/guides/fabric-weight-and-gsm/",
      "/guides/how-to-choose-fabric-for-shirts/",
    ],
    relatedLandingPaths: [
      "/wholesale-fabric/",
      "/fabrics/clothing/",
      "/fabrics/apparel/",
      "/fabrics/fashion/",
    ],
    faqs: [
      {
        question: "What is fabric sourcing?",
        answer:
          "Fabric sourcing is finding and evaluating cloth for a clothing or apparel programme, then moving from a shortlist to sampling and commercial inquiry with clear quantity and use context.",
      },
      {
        question: "Where do clothing brands get their fabric?",
        answer:
          "Brands use a mix of marketplaces, mills, agents and showrooms. On FabStitch, you discover named fabrics with published specs, then inquire — supplier identities are not exposed on the public storefront.",
      },
      {
        question: "How do I source fabric for a clothing line on FabStitch?",
        answer:
          "Define the garment brief, browse collections or Best For edits, open product pages to compare composition and construction, then inquire with metres and garment context.",
      },
      {
        question: "Does FabStitch publish MOQs and prices on fabric pages?",
        answer:
          "Only documented catalog fields appear on fabric pages. Quantity, MOQ and commercial terms belong in the inquiry follow-up when they are not published.",
      },
    ],
    finalCtaHeading: "Ready to source named fabrics?",
    finalCtaBody:
      "Search the marketplace, compare documented specs, and inquire with quantity and garment context.",
  },
  {
    slug: "wholesale-fabric",
    path: "/wholesale-fabric/",
    title: "Wholesale Fabric for Brands & Bulk Programmes",
    h1: "Wholesale fabric for commercial clothing programmes",
    metaDescription:
      "Explore wholesale fabric for brands and bulk programmes. Compare composition, construction and weight, then inquire with commercial quantity on FabStitch.",
    primaryKeyword: "wholesale fabric",
    secondaryKeywords: [
      "fabric wholesale",
      "wholesale fabrics",
      "buy fabric wholesale",
      "wholesale fabric suppliers",
      "wholesale fabric online",
      "fabric online wholesale",
      "bulk fabric wholesale",
      "buy bulk fabric",
      "wholesale apparel fabric",
      "wholesale garment fabric",
      "wholesale fashion fabric",
      "wholesale cotton fabric",
      "wholesale fabric by the yard",
      "where to buy wholesale fabric",
      "where can i buy wholesale fabric",
      "wholesale fabric store",
      "online fabric wholesale",
      "fabric bulk",
      "bulk fabrics",
      "how to order fabric wholesale",
    ],
    eyebrow: "Wholesale fabric",
    valueProposition:
      "Wholesale fabric on FabStitch means commercial discovery of named cloth with published specs — then inquiry with bulk or programme quantity. It is not a doorway page of invented dealer lists.",
    heroCtaLabel: "Shop the marketplace",
    secondaryCtaLabel: "Fabric sourcing guide",
    secondaryCtaHref: "/fabric-sourcing/",
    image: "/media/fabrics/cotton-poplin-primary.webp",
    imageAlt: "Cotton poplin suitable for wholesale apparel programmes",
    considerationsHeading: "Commercial checks before a wholesale inquiry",
    considerations: [
      {
        title: "Bulk quantity",
        body: "State metres or yards for sampling vs production. Larger runs need clearer timing context in the note.",
      },
      {
        title: "MOQ reality",
        body: "Minimums vary by cloth and programme. Ask in inquiry when MOQ is not published on the fabric page.",
      },
      {
        title: "Composition & construction",
        body: "Wholesale decisions still rest on fibre and structure — not only unit price language.",
      },
      {
        title: "Weight / GSM",
        body: "Match published weight to garment category: shirts, denim, outerwear and knits differ.",
      },
      {
        title: "Samples first",
        body: "Approve hand and opacity before committing bulk. Mention sample needs early.",
      },
      {
        title: "Lead time",
        body: "Ask about availability windows in follow-up. Public pages do not invent warehouse stock claims.",
      },
    ],
    sections: [
      {
        heading: "What wholesale fabric means on FabStitch",
        body: [
          "Wholesale fabric sourcing is buying or inquiring about cloth at commercial quantities for brands, manufacturers and apparel programmes. Searchers often look for wholesale fabric stores, online wholesalers or bulk fabric for sale — the useful answer is still a named fabric with documented specs and a clear inquiry path.",
          "FabStitch is a B2B-oriented fabric marketplace: browse, filter and compare materials, then inquire. We do not publish invented supplier directories, near-me warehouse claims, or fake price lists.",
        ],
        keyPoints: [
          "Commercial quantity belongs in the inquiry.",
          "Named fabrics beat anonymous “wholesale dealer” lists.",
        ],
      },
      {
        heading: "Bulk purchasing without inventing terms",
        body: [
          "Buy fabric wholesale by shortlisting cloth that fits the garment, then stating programme metres. Bulk fabric purchase is a conversation about quantity, timing and quality — not a self-checkout cart of invented offers.",
          "Wholesale cotton, apparel and fashion fabrics all follow the same honesty rule: only claim composition, construction and measurements that appear on the fabric record.",
          "If you need education on how brands source materials, pair this page with the fabric sourcing landing and the clothing-brand sourcing guide.",
        ],
      },
      {
        heading: "Wholesale apparel and garment programmes",
        body: [
          "Wholesale garment fabric programmes span shirts, dresses, trousers, denim, activewear and outerwear. Use Best For edits when the end use is fixed. Use collections when material family leads.",
          "Clothing fabric wholesale and fashion fabric wholesale intents still resolve to product pages — not separate thin URLs for every synonym.",
        ],
      },
      {
        heading: "How to order fabric wholesale through inquiry",
        body: [
          "Open the fabric page, confirm published specs, then inquire with fabric name, quantity band, garment and any sample needs. That is how to order fabric wholesale on FabStitch without inventing MOQs or prices in markup.",
          "Continue in the marketplace for filtered discovery across the catalog, or return to fabric sourcing when the brief is still educational rather than commercial-quantity led.",
        ],
      },
    ],
    fabricSlugs: [
      "cotton-poplin",
      "lightweight-denim",
      "merino-roica-stretch-tailoring",
      "stretch-woven-compression",
      "brushed-flannel",
      "european-flax-linen",
    ],
    bestForSlugs: [
      "shirts",
      "activewear",
      "tailoring",
      "outerwear",
      "knitwear",
    ],
    collectionSlugs: ["cotton", "denim", "performance", "tailoring"],
    guidePaths: [
      "/guides/how-to-buy-fabric-online/",
      "/guides/how-to-source-fabric-for-clothing-brands/",
      "/guides/fabric-weight-and-gsm/",
      "/guides/denim-2027/",
    ],
    relatedLandingPaths: [
      "/fabric-sourcing/",
      "/fabrics/apparel/",
      "/fabrics/clothing/",
      "/marketplace/",
    ],
    faqs: [
      {
        question: "Where can I buy wholesale fabric online?",
        answer:
          "On FabStitch, browse the marketplace or collections, open named fabric pages with published specs, then inquire with commercial quantity. We do not invent dealer directories or local warehouse claims.",
      },
      {
        question: "Does wholesale fabric mean published prices and MOQs?",
        answer:
          "Only documented catalog fields appear publicly. Quantity, MOQ and commercial terms are confirmed in inquiry when they are not listed on the fabric page.",
      },
      {
        question: "Can small brands inquire about bulk fabric?",
        answer:
          "Yes. State your quantity honestly — sampling metres versus production runs. Smaller programmes and larger brands can use the same fabric records with different inquiry context.",
      },
      {
        question: "How is wholesale fabric different from fabric sourcing?",
        answer:
          "Fabric sourcing covers the full brief-to-inquiry process. This wholesale page focuses on commercial quantity and bulk programme language while still requiring documented fabric specs.",
      },
    ],
    finalCtaHeading: "Compare wholesale-ready fabrics",
    finalCtaBody:
      "Filter the marketplace, open product specs, and inquire with bulk or programme quantity.",
  },
] as const;

export const COMMERCIAL_LANDING_BY_SLUG = Object.fromEntries(
  COMMERCIAL_LANDING_PAGES.map((page) => [page.slug, page]),
) as Record<CommercialLandingPage["slug"], CommercialLandingPage>;

export function commercialLandingWordCount(
  page: CommercialLandingPage,
): number {
  return [
    page.h1,
    page.valueProposition,
    page.metaDescription,
    page.considerationsHeading,
    ...page.considerations.flatMap((item) => [item.title, item.body]),
    ...page.sections.flatMap((section) => [
      section.heading,
      ...section.body,
      ...(section.keyPoints ?? []),
    ]),
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
    page.finalCtaHeading,
    page.finalCtaBody,
  ]
    .join(" ")
    .trim()
    .split(/\s+/).length;
}
