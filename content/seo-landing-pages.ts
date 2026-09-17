/**
 * Intent landing pages derived from verified keyword research clusters.
 * Content must stay differentiated to avoid cannibalization.
 */

export type SeoLandingSection = {
  heading: string;
  body: string[];
  keyPoints?: string[];
};

export type SeoLandingPage = {
  slug: "clothing" | "apparel" | "fashion";
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
  sections: SeoLandingSection[];
  fabricSlugs: readonly string[];
  bestForSlugs: readonly string[];
  collectionSlugs: readonly string[];
  guidePaths: readonly string[];
  relatedLandingPaths: readonly string[];
};

export const SEO_LANDING_PAGES: readonly SeoLandingPage[] = [
  {
    slug: "clothing",
    path: "/fabrics/clothing/",
    title: "Clothing Fabric for Apparel & Fashion",
    h1: "Clothing Fabric for Apparel & Fashion",
    metaDescription:
      "Explore clothing fabric for shirts, dresses, trousers, jackets and coats. Compare composition, construction and weight, then inquire on FabStitch.",
    primaryKeyword: "clothing fabric",
    secondaryKeywords: [
      "fabric for clothes",
      "fabric for clothing",
      "clothing material fabric",
      "clothing fabric material",
      "fabric to make clothes",
      "fabric to make clothing",
      "fabric for clothing making",
      "fabrics and clothes",
      "fabrics and cloth",
      "clothes fabric",
      "clothes fabric material",
      "fabric and clothes",
    ],
    eyebrow: "Clothing programmes",
    intro:
      "Choosing cloth for clothing is a product decision first. Start from the garment, then compare fibre, construction, weight and documented uses before you inquire — not from a fibre buzzword alone.",
    image: "/media/fabrics/cotton-poplin-primary.webp",
    imageAlt: "Cotton poplin fabric suitable for clothing programmes",
    sections: [
      {
        heading: "Start with the garment you are making",
        body: [
          "Clothing fabric only makes sense when the end product is clear. A crisp shirting poplin, a fluid dress georgette and a brushed outerwear cloth can all be “clothing materials,” yet they answer different silhouettes, seasons and production constraints.",
          "On FabStitch, use Best For edits for shirts, dresses, trousers, outerwear and tailoring when you already know the product. Use collections when the fibre family is decided. Both paths should land on named fabrics with documented composition and construction.",
          "If you are still deciding between everyday ready-to-wear and a more production-led apparel brief, keep this page for garment-first selection and move to the apparel landing when factory constraints dominate the conversation.",
        ],
        keyPoints: [
          "Name the garment before shortlisting fibre.",
          "Best For is product-first; collections are material-first.",
        ],
      },
      {
        heading: "Properties that matter for clothes",
        body: [
          "Comfort, drape, opacity, stretch and durability are not optional extras for clothing — they decide whether a cloth can survive wear and finishing. Weight and construction explain more than fibre names: a lightweight open weave and a dense brushed cloth behave differently even when both contain wool or cotton.",
          "Read the published measurement, surface character and Best For uses on each fabric page. If a property is not documented, do not invent it from a photo. Ask in the inquiry when care, recovery or opacity constraints are critical.",
          "For shirts, favour clearer hand and stable structure. For dresses, prioritise drape and opacity. For trousers and jackets, look at recovery, crease behaviour and how the cloth will finish. Coats and outerwear need denser constructions or technical shells that match the climate brief.",
        ],
        keyPoints: [
          "Weight and construction beat fibre buzzwords.",
          "Only claim properties that appear on the fabric record.",
        ],
      },
      {
        heading: "Seasonal clothing and layering",
        body: [
          "Summer clothing programmes often need breathable linen, open cottons or lightweight wools. Cooler seasons lean toward brushed textures, denser wools, pile surfaces or technical shells. Resort and occasion clothing may prioritise drape and sheerness over toughness.",
          "Season labels on FabStitch fabrics are editorial direction from the 2027 reference, not a substitute for your climate brief. Compare the stated weight and character against the garment calendar you actually produce.",
          "Layering programmes should also check how fabrics sit together — a sheer overlay on a structured base behaves differently from two mid-weight cloths stacked for warmth. Document that stack in the inquiry when you shortlist.",
        ],
      },
      {
        heading: "Tailoring, trousers and outerwear paths",
        body: [
          "Tailoring and structured trousers ask for cloths with enough body to hold a crease and clean seams. Soft suiting weaves, tropical wools and selected stretch-woven constructions appear in the Tailoring collection and related Best For edits when those uses are documented.",
          "Outerwear and coats push toward denser wools, brushed surfaces or performance constructions. Do not assume a dress-weight silk or open linen can carry a winter coat brief simply because both are clothing materials.",
        ],
      },
      {
        heading: "From shortlist to inquiry",
        body: [
          "When two or three fabrics fit the clothing brief, open each product page, note composition and measurement differences, then inquire with quantity in metres and the garment name. Clear context helps follow-up without forcing invented MOQs or prices onto the page.",
          "If you are still exploring broadly, search the marketplace or browse the fabrics hub, then return here once the clothing use is defined. Guides on shirt selection, fabric weight and buying fabric online support the same path without duplicating this page.",
        ],
        keyPoints: [
          "Include quantity and garment type in the inquiry.",
          "Keep the shortlist small enough to compare honestly.",
        ],
      },
    ],
    fabricSlugs: [
      "european-flax-linen",
      "cotton-poplin",
      "silk-chiffon",
      "linen-cotton",
      "cotton-voile",
      "brushed-flannel",
    ],
    bestForSlugs: ["shirts", "dresses", "trousers", "outerwear", "tailoring"],
    collectionSlugs: ["cotton", "linen-lightweight", "silk-sheer", "tailoring"],
    guidePaths: [
      "/guides/how-to-choose-fabric-for-shirts/",
      "/guides/how-to-choose-fabric-for-dresses/",
      "/guides/how-to-buy-fabric-online/",
      "/guides/fabric-weight-and-gsm/",
    ],
    relatedLandingPaths: ["/fabrics/apparel/", "/fabrics/fashion/"],
  },
  {
    slug: "apparel",
    path: "/fabrics/apparel/",
    title: "Apparel Fabric for Clothing Brands & Manufacturers",
    h1: "Apparel Fabric for Clothing Production",
    metaDescription:
      "Source apparel fabric for brands and manufacturers. Compare documented specs, production use cases and Best For edits, then inquire on FabStitch.",
    primaryKeyword: "apparel fabric",
    secondaryKeywords: [
      "fabric apparel",
      "garment fabric",
      "fabric for clothing production",
      "apparel fabric supplier",
      "clothing production fabric",
    ],
    eyebrow: "Apparel production",
    intro:
      "Apparel fabric sourcing is a manufacturing brief. Define product, quantity band and constraints first, then shortlist named cloths with published specifications — not lifestyle language.",
    image: "/media/fabrics/stretch-woven-compression-primary.webp",
    imageAlt: "Stretch-woven compression fabric for apparel programmes",
    sections: [
      {
        heading: "Write the production brief before you browse",
        body: [
          "Apparel teams waste sampling cycles when the brief is “nice cotton” without silhouette, stretch needs, opacity, finishing route or approximate metres. A workable brief names the garment category, season, and any hard constraints the factory already knows.",
          "FabStitch is built for that workflow: Best For groups fabrics already documented for a use, collections group material families, and product pages keep composition and construction visible before inquiry.",
          "Treat this page as the production-oriented companion to clothing fabric discovery. If you are still choosing cloth for a single silhouette without factory language, start on the clothing page instead.",
        ],
        keyPoints: [
          "Production constraints belong in the brief early.",
          "Documented specs beat moodboard fibre names.",
        ],
      },
      {
        heading: "What apparel manufacturers compare",
        body: [
          "Beyond aesthetics, apparel production cares about consistency of hand, weight tolerance language when stated, construction behaviour under sewing, and whether stretch or recovery is actually documented. Performance, knitwear and denim programmes each bring different risk profiles.",
          "Use the Performance collection for next-to-skin and technical directions, Tailoring for soft suiting weaves, and Denim for weight-separated denim records. Open related Best For edits when the garment category is already fixed.",
          "Garment fabric decisions for brands also include how the cloth will behave after washing or finishing routes your factory already runs. If those constraints are not on the fabric page, put them in the inquiry rather than assuming from imagery.",
        ],
        keyPoints: [
          "Match collection to the manufacturing risk, not the photo.",
          "Stretch and recovery must be documented to count.",
        ],
      },
      {
        heading: "Brand, boutique and manufacturer contexts",
        body: [
          "Clothing brands, private-label programmes and cut-and-sew partners can share the same fabric record while asking different follow-up questions. Brands often need colour, hand and silhouette fit; manufacturers often need run size, timing and sewing behaviour.",
          "Keep the public page honest: FabStitch shows documented composition and construction. Commercial terms that are not published stay in the inquiry thread.",
        ],
      },
      {
        heading: "Sourcing conversation, not checkout theatre",
        body: [
          "When the shortlist is ready, inquire with fabric name, quantity, garment and timing context you can share. Do not claim certifications, MOQs or prices that the fabric page does not state.",
          "Boutiques and manufacturers can share the same fabric record; the inquiry note changes. Manufacturers often need clearer run size and timeline language, while smaller brands may need smaller quantity context.",
        ],
      },
      {
        heading: "Where to go next on FabStitch",
        body: [
          "Continue in the marketplace for filtered discovery across the catalog, or open the clothing fabric landing page if the brief is still consumer-garment oriented rather than production-led. Fashion fabric landing pages support aesthetic and collection-building intents.",
          "Guides on buying fabric online and sourcing for clothing brands explain the inquiry path without inventing commercial terms. Activewear and composition guides help when performance constraints dominate.",
        ],
      },
    ],
    fabricSlugs: [
      "cotton-poplin",
      "stretch-woven-compression",
      "merino-roica-stretch-tailoring",
      "lightweight-denim",
      "cooling-performance-construction",
      "tropical-wool-super-110s-130s",
    ],
    bestForSlugs: ["shirts", "activewear", "tailoring", "knitwear"],
    collectionSlugs: ["cotton", "performance", "tailoring", "denim"],
    guidePaths: [
      "/guides/how-to-source-fabric-for-clothing-brands/",
      "/guides/how-to-buy-fabric-online/",
      "/guides/choosing-fabric-for-activewear/",
      "/guides/how-fabric-composition-affects-performance/",
    ],
    relatedLandingPaths: ["/fabrics/clothing/", "/fabrics/fashion/"],
  },
  {
    slug: "fashion",
    path: "/fabrics/fashion/",
    title: "Fashion Fabrics for Designers & Brands",
    h1: "Fashion Fabrics for Designers & Brands",
    metaDescription:
      "Discover fashion fabrics for designers and brands — drape, texture, sheers, seasonal edits and boutique programmes — then inquire on FabStitch.",
    primaryKeyword: "fashion fabric",
    secondaryKeywords: [
      "fashion fabrics",
      "designer fabric",
      "fashion textile",
      "boutique fabric",
    ],
    eyebrow: "Fashion collections",
    intro:
      "Fashion fabric selection is about character: drape, texture, sheerness, surface and how a cloth reads in a collection. Start from aesthetic direction, then confirm the documented construction before you inquire.",
    image: "/media/fabrics/silk-chiffon-primary.webp",
    imageAlt: "Silk chiffon fabric for fashion and occasion programmes",
    sections: [
      {
        heading: "Design character before commercial checkout",
        body: [
          "Designers and boutique brands often begin with mood — fluid, crisp, sheer, brushed, sculptural — rather than a factory brief. That is valid, as long as the shortlist still lands on named fabrics with real composition and construction data.",
          "Silk & Sheer, Velvet & Pile, Linen & Lightweight and Knitwear collections are useful fashion-facing starting points on FabStitch. Pair them with Best For edits for dresses, occasionwear, resortwear or statement knits when the silhouette is known.",
          "This page is intentionally aesthetic-first. It is not a copy of the clothing or apparel landings: those pages prioritise garment selection and production briefs.",
        ],
        keyPoints: [
          "Aesthetic direction still needs a named fabric record.",
          "Sheerness and drape must match the silhouette.",
        ],
      },
      {
        heading: "Texture, drape and seasonal storytelling",
        body: [
          "Fashion programmes live or die on how cloth moves and photographs. Chiffon, georgette, organza and crepe behave differently in volume sleeves and overlays. Brushed and pile surfaces change the winter story. Open weaves and lightweight linens change the summer story.",
          "Seasonal collection pages and the 2027 fabric guides help orient the story without replacing product-level specs. Use them as editorial context, then verify each candidate fabric page.",
          "Collection building also benefits from contrast: pair a sheer fashion cloth with a grounded base, or a pile surface with a cleaner weave, so the line reads as a set rather than a single texture repeated.",
        ],
      },
      {
        heading: "Boutique and designer workflows",
        body: [
          "Boutique teams often shortlist fewer metres across more SKUs. Designers may sample for a look before committing to a production cloth. Both can use the same FabStitch fabric pages; the inquiry should state whether you are sampling, producing a capsule, or building a seasonal story.",
          "Keep lining, opacity and photography needs in the note when sheer or reflective surfaces are central to the look.",
        ],
      },
      {
        heading: "From look development to inquiry",
        body: [
          "Once the fashion shortlist is tight, inquire with the fabric name, intended look (for example a slip dress or overlay), and quantity. Mention lining needs when sheer cloths are in play.",
          "If the brief is more manufacturing-led than aesthetic, switch to the apparel fabric landing page. If the brief is everyday clothing selection for specific garments, use the clothing fabric page.",
        ],
      },
      {
        heading: "Keep discovery connected",
        body: [
          "Fashion exploration should still connect upward to the marketplace and fabrics hub, and sideways to relevant guides such as chiffon vs georgette or silk vs satin. That keeps topical authority intact without duplicating the same article across three URLs.",
          "Named fabrics below are published catalog records — open each product page for composition and construction before you inquire.",
        ],
      },
    ],
    fabricSlugs: [
      "silk-chiffon",
      "silk-georgette",
      "silk-organza",
      "crepe-de-chine",
      "pointelle-knit",
      "silk-viscose-velvet",
    ],
    bestForSlugs: ["dresses", "occasionwear", "resortwear", "knitwear"],
    collectionSlugs: [
      "silk-sheer",
      "velvet-pile",
      "knitwear",
      "linen-lightweight",
    ],
    guidePaths: [
      "/guides/chiffon-vs-georgette/",
      "/guides/silk-vs-satin/",
      "/guides/how-to-choose-fabric-for-dresses/",
      "/guides/linen-fabrics-2027/",
    ],
    relatedLandingPaths: ["/fabrics/clothing/", "/fabrics/apparel/"],
  },
] as const;

export const SEO_LANDING_BY_SLUG = Object.fromEntries(
  SEO_LANDING_PAGES.map((page) => [page.slug, page]),
) as Record<SeoLandingPage["slug"], SeoLandingPage>;

export function seoLandingWordCount(page: SeoLandingPage): number {
  return [
    page.h1,
    page.intro,
    page.metaDescription,
    ...page.sections.flatMap((section) => [
      section.heading,
      ...section.body,
      ...(section.keyPoints ?? []),
    ]),
  ]
    .join(" ")
    .trim()
    .split(/\s+/).length;
}
