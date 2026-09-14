import { EDUCATION_GUIDES } from "./guides-education";

export type CatalogGuideSection = {
  heading: string;
  body: string;
  keyPoints: string[];
};

export type CatalogGuide = {
  slug: string;
  path: string;
  type:
    | "pillar"
    | "seasonal_guide"
    | "technical_guide"
    | "comparison"
    | "buyer_guide";
  title: string;
  heading: string;
  metaDescription: string;
  summary: string;
  sections: CatalogGuideSection[];
  faqs: { question: string; answer: string }[];
  fabricSlugs: string[];
  applicationSlugs: string[];
  buyerCategorySlugs: string[];
  certificationSlugs: string[];
  countryCodes: string[];
  cluster: "2027-directions" | "fabric-education" | "choosing-fabrics";
  pillarSlug?: string;
  author: null;
  publishedAt: null;
  updatedAt: null;
  wordCount: number;
};

type GuideInput = Omit<
  CatalogGuide,
  | "path"
  | "wordCount"
  | "author"
  | "publishedAt"
  | "updatedAt"
  | "buyerCategorySlugs"
  | "certificationSlugs"
  | "countryCodes"
>;

function guide(input: GuideInput): CatalogGuide {
  const words = [
    input.heading,
    input.summary,
    ...input.sections.flatMap((section) => [
      section.heading,
      section.body,
      ...section.keyPoints,
    ]),
    ...input.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ]
    .join(" ")
    .trim()
    .split(/\s+/).length;

  return {
    ...input,
    path: `/guides/${input.slug}/`,
    buyerCategorySlugs: [],
    certificationSlugs: [],
    countryCodes: [],
    author: null,
    publishedAt: null,
    updatedAt: null,
    wordCount: words,
  };
}

const CORE_GUIDES: CatalogGuide[] = [
  guide({
    slug: "fabrics-2027",
    type: "pillar",
    title: "Fabrics for 2027: the FabStitch material guide",
    heading: "A practical guide to the FabStitch 2027 fabric collection",
    metaDescription:
      "Understand the Spring/Summer, Autumn/Winter and Home & Contract directions behind the FabStitch 2027 fabric collection.",
    summary:
      "A season-by-season view of the materials, constructions and applications represented in FabStitch's 2027 collection.",
    cluster: "2027-directions",
    sections: [
      {
        heading: "How the 2027 collection is organized",
        body: "Textile buying does not follow one calendar-year trend. The FabStitch reference separates Spring/Summer 2027, Autumn/Winter 2027–28 and Home & Contract 2027–28 because each season answers a different material brief.\n\nSpring/Summer moves toward lightness: linen and cotton blends, sheer silk, open knitwear, lighter tailoring and performance constructions. Autumn/Winter puts more emphasis on weight, fibre and surface through brushed wool, dry-hand cloth, pile, structured classics, technical outerwear and denim. Home & Contract is organized around upholstery, light and sound control, bedding, rugs and contract use.",
        keyPoints: [
          "SS 27 contains 38 named FabStitch fabrics.",
          "AW 27/28 contains 37 named FabStitch fabrics.",
          "Home & Contract 27/28 contains 17 named FabStitch fabrics.",
        ],
      },
      {
        heading: "Direction is not certainty",
        body: "A forecast is useful when it helps a customer frame a sourcing decision; it is not proof that one fabric will become a guaranteed bestseller. FabStitch therefore uses the source as a selection and design reference, not as a licence to label every product a top trend.\n\nProduct pages lead with what can be checked: the canonical fabric name, stated fibre or blend, construction, weight or other measurement, surface characteristics and documented applications. Seasonal language provides context around those facts rather than replacing them.",
        keyPoints: [
          "No product is described as a guaranteed trend.",
          "Unknown technical and commercial values stay absent.",
          "Colour forecasts and experimental fibres are context, not invented products.",
        ],
      },
      {
        heading: "The two material forces behind AW 27/28",
        body: "The reference identifies two connected shifts. First, established constructions are being reworked with technical performance or renewed craft rather than displaced by novelty fibres. Second, visible surface is gaining importance: brushed, felted, irregular and fibrous materials sit ahead of perfectly smooth high-shine cloth.\n\nThat explains why the collection places melton, boiled wool, double-face wool, flannel, Casentino, corduroy and velvet beside membrane-backed gabardine, recycled ripstop and wool-technical hybrids. They answer different uses, but both groups make construction visible.",
        keyPoints: [
          "Classic constructions and technical performance can coexist.",
          "Surface character distinguishes much of the AW selection.",
          "Product specifications remain more important than a seasonal label.",
        ],
      },
      {
        heading: "How to use the collection",
        body: "Begin with the product you are making when the exact cloth is still open. Best For pages collect only fabrics whose applications are supported by the reference. Begin with a collection when the fibre, construction or seasonal direction is already clear.\n\nFrom either route, open the individual fabric page and compare composition, construction, weight, season and related materials. When you have a shortlist, send an inquiry with the quantity you need. Commercial terms are confirmed afterwards.",
        keyPoints: [
          "Use Best For for a product-led starting point.",
          "Use collections for a material-led starting point.",
          "Use product pages for the source-supported detail.",
        ],
      },
    ],
    faqs: [
      {
        question:
          "Does FabStitch guarantee these will be the top fabrics of 2027?",
        answer:
          "No. The reference describes sourcing and design directions, not certainty. FabStitch uses it to shape a real product collection without claiming guaranteed popularity.",
      },
      {
        question: "Are every price and minimum quantity available?",
        answer:
          "No. Commercial controls remain unavailable wherever the catalog does not yet have real MOQ, price, unit and availability data.",
      },
    ],
    fabricSlugs: [
      "european-flax-linen",
      "silk-chiffon",
      "pointelle-knit",
      "melton",
      "recycled-nylon-ripstop",
      "lightweight-denim",
    ],
    applicationSlugs: [
      "shirts",
      "womens-clothing",
      "outerwear",
      "home-textiles",
    ],
  }),
  guide({
    slug: "spring-summer-2027-fabrics",
    type: "seasonal_guide",
    title: "Spring/Summer 2027 fabrics",
    heading: "Spring/Summer 2027: lightness with structure",
    metaDescription:
      "Explore linen, cotton, silk, summer tailoring, open knitwear and performance fabrics in the FabStitch Spring/Summer 2027 collection.",
    summary:
      "What connects the 38 named fabrics in FabStitch's Spring/Summer 2027 selection, and how to compare them.",
    cluster: "2027-directions",
    pillarSlug: "fabrics-2027",
    sections: [
      {
        heading: "Linen and cotton provide the foundation",
        body: "The season begins with breathable cloth. European flax linen covers shirts, trousers, dresses and jackets across a stated 120–200 gsm range. Linen-cotton extends that idea into casual shirts, chore jackets and bottoms at 140–220 gsm, while linen-silk and linen-cellulosic blends add fluidity.\n\nCotton moves toward openness and yarn character. Poplin and voile use fine-count, high-twist yarns for crisp translucent shirting. Organdy holds volume, while seersucker, crinkle, slub and khadi-effect cotton make the surface itself part of the design.",
        keyPoints: [
          "Compare fibre blends and weight, not the word linen alone.",
          "Open or irregular cotton constructions answer different briefs from smooth basics.",
        ],
      },
      {
        heading: "Sheer silk changes silhouette and consumption",
        body: "Chiffon, georgette, organza, taffeta, crepe de chine, habotai, dupion and silk bouclé each have a separate product identity because their structures behave differently. Chiffon floats, georgette is crinkled and slightly heavier, organza is sheer but stiff, and taffeta is crisp with a papery rustle.\n\nSheer cloth may need a lining, facing or slip. That practical construction decision can increase fabric consumption, so visual lightness should not be mistaken for a simpler bill of materials.",
        keyPoints: [
          "Chiffon and georgette prioritize drape.",
          "Organza and taffeta hold more shape.",
          "Lining requirements belong in early costing.",
        ],
      },
      {
        heading: "Tailoring and knitwear become lighter",
        body: "Summer tailoring emphasizes breathability, recovery and comfort. Wool-silk bi-stretch, wool-linen and wool-mohair open weaves, tropical wool and stretch merino sit between roughly 180 and 260 gsm where the source states a range.\n\nKnitwear follows the same seasonal logic through open-stitch, pointelle and crochet-effect structures, fine-gauge semi-sheer cloth, cotton or linen bouclé and lightweight merino. Gauge and micron data remain attached to the relevant product instead of being generalized across the whole category.",
        keyPoints: [
          "Open weaves support unstructured summer jackets.",
          "Fine and open knits extend beyond a winter-only use.",
        ],
      },
      {
        heading: "Performance is designed for crossover use",
        body: "The performance group includes stretch-woven compression, swim cloth that crosses into city and lounge use, cooling construction, an ultra-light semi-sheer lounge knit and retro sportif piqué, mesh, tricot or ribs.\n\nThese are distinct product directions rather than one broad activewear fabric. Start from the intended use—compression, cooling, swim, lounge or retro sport—then compare the available construction and fibre information.",
        keyPoints: [
          "Application should lead the performance-fabric choice.",
          "No unsupported cooling or durability number is added.",
        ],
      },
    ],
    faqs: [
      {
        question: "What defines the FabStitch SS 27 collection?",
        answer:
          "The selection emphasizes lightweight, breathable, sheer, fluid and open constructions across linen, cotton, silk, tailoring, knitwear and performance fabrics.",
      },
    ],
    fabricSlugs: [
      "european-flax-linen",
      "cotton-poplin",
      "silk-chiffon",
      "wool-silk-bi-stretch",
      "pointelle-knit",
      "stretch-woven-compression",
    ],
    applicationSlugs: ["shirts", "dresses", "tailoring", "activewear"],
  }),
  guide({
    slug: "autumn-winter-2027-28-fabrics",
    type: "seasonal_guide",
    title: "Autumn/Winter 2027–28 fabrics",
    heading: "Autumn/Winter 2027–28: surface, weight and protection",
    metaDescription:
      "Explore brushed wool, dry-hand cloth, velvet, structured classics, technical outerwear and denim in the FabStitch AW 2027–28 collection.",
    summary:
      "A practical reading of the 37 named fabrics in FabStitch's Autumn/Winter 2027–28 selection.",
    cluster: "2027-directions",
    pillarSlug: "fabrics-2027",
    sections: [
      {
        heading: "Brushed and felted wool makes surface visible",
        body: "Melton, boiled wool, double-face wool, brushed flannel, mohair, alpaca and Casentino form the tactile center of the season. Their stated weights move from 250–400 gsm flannel through 500–800 gsm melton and 600 gsm or more for Casentino.\n\nWeight alone does not decide the product. Melton is heavily felted and cropped for coats, boiled wool begins as a knit before shrinking, double-face wool supports reversible unlined construction, and flannel brings a raised nap to shirts, trousers or suiting.",
        keyPoints: [
          "Surface and construction distinguish the wool group.",
          "Product use ranges from shirting to substantial coating.",
        ],
      },
      {
        heading: "Dry hand and pile create a second texture group",
        body: "Cotton moleskin, peach-skin and suede-effect wovens create dry or brushed surfaces without turning real leather or suede into fabric products. Moleskin is the most specific: a dense sueded cotton twill at 280–360 gsm, documented for workwear trousers and jackets.\n\nCorduroy and velvet add pile. Fine-wale corduroy supports shirts and trousers, jumbo cord moves toward outerwear, and silk-viscose velvet brings fluid lustre to occasionwear and interiors. Crushed and panné velvet remain separate because their directional surfaces are visually distinct.",
        keyPoints: [
          "Real suede and leather are excluded from the fabric catalog.",
          "Fine and jumbo cord answer different weights and applications.",
        ],
      },
      {
        heading: "Classics are enlarged, disrupted or backed",
        body: "Herringbone, Donegal, tartan, check, gabardine, covert, jacquard and damask remain recognizable, but the reference points to larger repeats, brighter neps, oversized scale, off-register colour and partially rendered motifs.\n\nTechnical membrane backing brings gabardine and covert into city outerwear. This is a useful example of the season's larger idea: a classic construction can absorb technical performance without losing its material identity.",
        keyPoints: [
          "Tartan and check remain separate canonical products.",
          "Jacquard and damask are not collapsed into one generic pattern.",
        ],
      },
      {
        heading: "Technical outerwear and denim provide structure",
        body: "The technical group includes recycled nylon ripstop, 2L, 2.5L and 3L membrane laminates, wool-technical hybrids, down-alternative fill and recycled polyester wadding. The catalog preserves layer and denier information where the source states it, without inventing waterproof ratings.\n\nDenim spans lightweight 8–11 oz, premium 12–14 oz, recycled-cotton, laser- and ozone-finished, hemp-cotton and selvedge rigid directions. These are separate sourcing concepts, not duplicate names for one blue twill.",
        keyPoints: [
          "Membrane layer counts remain explicit.",
          "Six denim concepts preserve weight, fibre and finishing distinctions.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is every AW 27/28 fabric heavy?",
        answer:
          "No. The season includes very heavy coatings, but also structured classics, denim and technical layers whose weight and purpose vary by product.",
      },
    ],
    fabricSlugs: [
      "melton",
      "brushed-flannel",
      "fine-wale-corduroy",
      "silk-viscose-velvet",
      "recycled-nylon-ripstop",
      "selvedge-rigid-denim",
    ],
    applicationSlugs: ["outerwear", "tailoring", "trousers", "occasionwear"],
  }),
  guide({
    slug: "fabric-weight-and-gsm",
    type: "technical_guide",
    title: "Fabric weight and GSM explained",
    heading: "How to read fabric weight and GSM",
    metaDescription:
      "Understand GSM, weight ranges and why fabric construction and intended use matter alongside the number.",
    summary:
      "A practical guide to reading the weight information shown on FabStitch fabric pages.",
    cluster: "fabric-education",
    sections: [
      {
        heading: "What GSM tells you",
        body: "GSM means grams per square metre. It describes mass over area, which makes it useful for comparing cloth without relying on roll width. A range such as 120–200 gsm means the named product direction covers more than one construction or commercial version; it should not be silently reduced to a single midpoint.\n\nFabStitch preserves stated ranges. When the reference does not provide GSM, the page does not manufacture a number from the fibre name or a photograph.",
        keyPoints: [
          "GSM compares mass per unit area.",
          "A range remains a range.",
          "Missing weight stays visibly unstated.",
        ],
      },
      {
        heading: "Why the same weight can behave differently",
        body: "Weight is not drape, opacity, stretch or warmth. A tightly woven cloth and an open weave can share a similar GSM while transmitting light and moving very differently. Fibre, yarn twist, knit or weave structure, finishing and pile all change the result.\n\nThat is why FabStitch places weight beside composition, construction and characteristics. Use the number to narrow a decision, then read the rest of the specification.",
        keyPoints: [
          "Construction changes how weight is experienced.",
          "Pile and finishing can add bulk or surface without answering every performance question.",
        ],
      },
      {
        heading: "Other measurements in the catalog",
        body: "Not every textile category is best described by GSM. Silk entries may use momme, denim uses ounces per square yard, technical ripstop may use denier, knitwear may state gauge or fibre micron, corduroy uses wale, and upholstery may state Martindale abrasion cycles.\n\nThese units are not converted into false equivalents. They measure different properties, so the catalog displays the source unit attached to the product.",
        keyPoints: [
          "Momme, oz/yd², denier, gauge, micron, wale and Martindale are retained where stated.",
          "Different measurements should not be treated as interchangeable.",
        ],
      },
      {
        heading: "Using weight in fabric discovery",
        body: "Use the marketplace GSM filter only when the product has a stated GSM range. An upper or lower bound returns fabrics whose documented range overlaps the request. Products with no supported GSM are excluded from a GSM-constrained result rather than guessed into it.\n\nAfter filtering, open the product page to confirm the range, season, construction and applications. Commercial sample testing remains necessary once a sellable fabric record is available.",
        keyPoints: [
          "Weight filtering is server-evaluated.",
          "Unknown GSM never passes a numeric GSM filter.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does a higher GSM always mean a warmer fabric?",
        answer:
          "No. Higher mass can contribute to warmth, but fibre, density, air permeability, finishing and construction also matter.",
      },
      {
        question: "Why does FabStitch sometimes show no GSM?",
        answer:
          "Because the approved source does not state one for that product. FabStitch does not infer technical specifications.",
      },
    ],
    fabricSlugs: [
      "european-flax-linen",
      "melton",
      "lightweight-denim",
      "fine-wale-corduroy",
    ],
    applicationSlugs: ["shirts", "outerwear"],
  }),
  guide({
    slug: "woven-vs-knit-fabrics",
    type: "comparison",
    title: "Woven vs knit fabrics",
    heading: "Woven and knit fabrics: how construction changes the choice",
    metaDescription:
      "Compare woven and knit fabric construction through real FabStitch 2027 products and intended applications.",
    summary:
      "Why construction—not just fibre—changes stretch, surface, drape and the way a product is made.",
    cluster: "fabric-education",
    sections: [
      {
        heading: "Construction is separate from fibre",
        body: "Cotton, linen, silk and wool can appear in woven or knitted constructions. Fibre describes the material input; construction describes how yarn becomes cloth. Treating cotton as one fabric therefore hides the difference between poplin, voile, moleskin, corduroy and a cotton bouclé knit.\n\nFabStitch keeps family, composition and construction as separate fields so search and filters can answer different questions.",
        keyPoints: [
          "One fibre can support multiple constructions.",
          "A fabric name often carries more useful behavior information than fibre alone.",
        ],
      },
      {
        heading: "Woven directions in the 2027 collection",
        body: "The woven selection moves from open linen and fine cotton to sheer silk, tropical tailoring, dense moleskin, structured classics, ripstop and denim. Woven does not automatically mean rigid: wool-silk bi-stretch and stretch-woven compression are documented examples where stretch or recovery is part of the construction.\n\nLikewise, a plain weave can be floating and sheer in chiffon, crisp in taffeta or stiff in organza because yarn and finish change the outcome.",
        keyPoints: [
          "Woven fabrics range from sheer to dense.",
          "Stretch must be stated; it is not inferred from construction class.",
        ],
      },
      {
        heading: "Knit directions in the 2027 collection",
        body: "Open-stitch, pointelle and crochet-effect knits emphasize visible holes and resort texture. Fine-gauge semi-sheer knits emphasize layering, while cotton or linen bouclé creates volume without the weight of a heavy winter jumper. Lightweight merino extends through shoulder seasons.\n\nBoiled wool is a useful edge case: the source identifies it as knitted and then shrunk. Its finished role can be jackets or unlined coats even though it begins from a knit construction.",
        keyPoints: [
          "Gauge helps distinguish open and fine knit directions.",
          "Finishing can substantially change a knitted base.",
        ],
      },
      {
        heading: "Choosing between them",
        body: "Start with the product and silhouette. Shirts may call for crisp woven cotton, breathable linen, fluid crepe or even fine corduroy depending on season. Resortwear can move between linen-silk woven cloth and open knit structures. Active applications may use a stretch woven, mesh, tricot or rib.\n\nThe useful comparison is therefore product by product: composition, construction, weight, surface and intended use together.",
        keyPoints: [
          "Use Best For pages to begin with the product.",
          "Use construction filters when the structural requirement is already known.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are all knits stretchy?",
        answer:
          "Knit construction can allow mechanical give, but the amount and direction of stretch must be confirmed from the actual product specification.",
      },
    ],
    fabricSlugs: [
      "cotton-poplin",
      "open-stitch-knit",
      "wool-silk-bi-stretch",
      "boiled-wool",
    ],
    applicationSlugs: ["shirts", "knitwear", "activewear"],
  }),
  guide({
    slug: "how-to-choose-fabric-for-shirts",
    type: "buyer_guide",
    title: "How to choose fabric for shirts",
    heading: "Choosing shirt fabric by season, structure and hand",
    metaDescription:
      "Compare linen, cotton, silk, flannel and corduroy shirt fabrics using real FabStitch 2027 product data.",
    summary:
      "A product-led way to narrow the FabStitch fabrics explicitly documented for shirts.",
    cluster: "choosing-fabrics",
    sections: [
      {
        heading: "Begin with the kind of shirt",
        body: "A hot-weather shirt, a fluid blouse, a brushed overshirt and a fine corduroy shirt do not need the same cloth. Start by deciding whether the garment should be crisp, breathable, sheer, fluid, brushed or textural.\n\nThe FabStitch shirts page includes only products whose reference applications state shirting. It does not fill the result with every cotton or linen product simply because the fibre is familiar.",
        keyPoints: [
          "Use the intended silhouette before choosing a fibre.",
          "Best For mappings come from documented applications.",
        ],
      },
      {
        heading: "Linen and cotton for warm conditions",
        body: "European flax linen is documented at 120–200 gsm for shirting among other uses. Linen-cotton is slightly broader at 140–220 gsm and is framed as casual shirting, with cotton in the blend helping move the material away from an all-linen brief.\n\nCotton poplin and voile use fine-count, high-twist yarns. The reference describes them as crisp and translucent, so opacity and layering should be considered instead of assuming that every cotton shirting is dense.",
        keyPoints: [
          "European flax linen and linen-cotton carry stated GSM ranges.",
          "Poplin and voile share a yarn direction but remain distinct fabrics.",
        ],
      },
      {
        heading: "Fluid and cooler-season options",
        body: "Crepe de chine is matte, fluid and close-hanging, documented for slip dresses, shirts and linings. It answers a very different shirt silhouette from crisp poplin.\n\nBrushed flannel at 250–400 gsm adds a raised surface for shirts, trousers and suiting. Fine-wale corduroy at 280–340 gsm brings a 16–21 wale pile to shirts and trousers. Their weight and surface make them more appropriate to cooler-season or overshirt briefs.",
        keyPoints: [
          "Crepe de chine supports a fluid shirt.",
          "Flannel and fine-wale corduroy provide more surface and weight.",
        ],
      },
      {
        heading: "Check the product page before quantity",
        body: "Compare composition, construction, stated weight, season and related fabrics on each product page. If opacity, shrinkage, colourfastness or care is not provided, treat it as an open commercial question rather than assuming an answer.\n\nSend an inquiry with the quantity you need. Availability and commercial terms are confirmed after FabStitch reviews the request.",
        keyPoints: [
          "Unknown testing and care values remain open.",
          "Commercial values appear only when supplied by a real record.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which FabStitch fabrics are documented for shirts?",
        answer:
          "European flax linen, linen-cotton, cotton poplin, cotton voile, crepe de chine, brushed flannel and fine-wale corduroy carry a shirting application in the 2027 catalog.",
      },
    ],
    fabricSlugs: [
      "european-flax-linen",
      "linen-cotton",
      "cotton-poplin",
      "cotton-voile",
      "crepe-de-chine",
      "brushed-flannel",
      "fine-wale-corduroy",
    ],
    applicationSlugs: ["shirts"],
  }),
  guide({
    slug: "chiffon-vs-georgette",
    type: "comparison",
    title: "Chiffon vs georgette",
    heading: "Chiffon or georgette: comparing two sheer dress fabrics",
    metaDescription:
      "Compare chiffon and georgette construction, surface, drape and documented uses in the FabStitch 2027 collection.",
    summary:
      "Both are sheer high-twist fabrics, but their surface, weight and intended silhouettes are not identical.",
    cluster: "fabric-education",
    sections: [
      {
        heading: "What they share",
        body: "The FabStitch reference places chiffon and georgette together in the ethereal silk group. Both use high-twist yarns and both can support dress silhouettes where lightness and movement matter.\n\nThat shared family makes comparison useful, but it does not make the names interchangeable. Each remains a separate canonical product with its own documented character and applications.",
        keyPoints: [
          "Both sit in the Silk & Sheer collection.",
          "Both are represented as separate FabStitch fabrics.",
        ],
      },
      {
        heading: "How chiffon is described",
        body: "Chiffon is a sheer, floating plain weave made with high-twist yarns. The reference gives a weight of 8–12 momme and applications in layered dresses, blouses and scarves.\n\nIts transparency can require a lining, facing or slip. That extra layer affects material consumption and should be considered during product costing rather than after the silhouette is approved.",
        keyPoints: [
          "Plain weave, high-twist, sheer and floating.",
          "Documented for layered dresses, blouses and scarves.",
        ],
      },
      {
        heading: "How georgette is described",
        body: "Georgette is described as like chiffon but crinkled and slightly heavier, with better drape. Its documented applications are dresses and wide trousers.\n\nThe crinkled surface and additional body can make georgette the more relevant starting point when the garment needs flow without the same floating character as chiffon.",
        keyPoints: [
          "Crinkled and slightly heavier than chiffon.",
          "Documented for dresses and wide trousers.",
        ],
      },
      {
        heading: "How to choose",
        body: "Choose chiffon when the brief emphasizes floating layers, a blouse or scarf. Compare georgette when the brief needs a crinkled surface, stronger drape or a wide trouser application.\n\nThe catalog does not state every available colour, width or commercial option. Those details belong to the eventual sellable record and should not be inferred from the general fabric type.",
        keyPoints: [
          "Use application and silhouette to lead the comparison.",
          "Do not infer missing commercial specifications.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is georgette the same as chiffon?",
        answer:
          "No. The reference describes georgette as crinkled and slightly heavier, with better drape, while chiffon is a sheer floating plain weave.",
      },
    ],
    fabricSlugs: ["silk-chiffon", "silk-georgette"],
    applicationSlugs: ["dresses", "womens-clothing"],
  }),
  guide({
    slug: "denim-2027",
    type: "seasonal_guide",
    title: "Denim directions for 2027",
    heading: "Six denim sourcing directions in the FabStitch 2027 collection",
    metaDescription:
      "Compare lightweight, premium, recycled-cotton, lower-impact finished, hemp-cotton and selvedge rigid denim for 2027.",
    summary:
      "The denim collection separates weight, fibre, finishing and heritage concepts instead of treating denim as one product.",
    cluster: "2027-directions",
    pillarSlug: "fabrics-2027",
    sections: [
      {
        heading: "Weight separates volume and premium directions",
        body: "The reference identifies 8–11 oz denim for the lighter volume market and 12–14 oz for premium weight. FabStitch keeps these as Lightweight Denim and Premium-Weight Denim so search and product pages do not collapse two sourcing briefs into one generic record.\n\nOunces per square yard are retained as the source unit. They are not silently converted into an invented exact GSM value.",
        keyPoints: [
          "Lightweight denim: 8–11 oz.",
          "Premium-weight denim: 12–14 oz.",
        ],
      },
      {
        heading: "Fibre content creates separate sourcing choices",
        body: "Recycled-cotton denim is documented at 20–40% recycled content blended with virgin cotton for strength. Hemp-cotton denim is documented at 15–30% hemp, selected for hand feel and its water-use story.\n\nThese are composition directions, not blanket sustainability claims. Final fibre percentages and documentation must come from the sellable product record.",
        keyPoints: [
          "Recycled cotton and hemp-cotton remain distinct products.",
          "No certificate or unsupported impact number is claimed.",
        ],
      },
      {
        heading: "Finishing and heritage answer different briefs",
        body: "Laser and ozone finishing form one direction replacing stonewash and hand-sanding. Selvedge and rigid denim form another, connected to longevity and heritage rather than a distressed finish.\n\nA customer choosing between them is deciding how character enters the cloth: through finishing, through rigid construction and edge detail, or through fibre blend and weight.",
        keyPoints: [
          "Laser- and ozone-finished denim is a finishing concept.",
          "Selvedge rigid denim is a heritage construction concept.",
        ],
      },
      {
        heading: "How to compare the six products",
        body: "Begin with required weight, then compare composition and finishing. Lightweight and premium-weight products answer mass; recycled-cotton and hemp-cotton answer fibre blend; laser and ozone answer finishing; selvedge rigid answers construction and longevity.\n\nThe product pages expose only what the 2027 source supports. Width, colour, shrinkage, price, MOQ and availability remain open until commercial data is attached.",
        keyPoints: [
          "Weight, composition, finish and construction are separate decision axes.",
          "Commercial and testing values are not inferred.",
        ],
      },
    ],
    faqs: [
      {
        question: "How many denim products are in the FabStitch 2027 catalog?",
        answer:
          "Six canonical denim concepts are represented: lightweight, premium-weight, recycled-cotton, laser- and ozone-finished, hemp-cotton and selvedge rigid denim.",
      },
    ],
    fabricSlugs: [
      "lightweight-denim",
      "premium-weight-denim",
      "recycled-cotton-denim",
      "laser-and-ozone-finished-denim",
      "hemp-cotton-denim",
      "selvedge-rigid-denim",
    ],
    applicationSlugs: [],
  }),
  guide({
    slug: "linen-fabrics-2027",
    type: "seasonal_guide",
    title: "Linen fabrics for 2027",
    heading: "Five linen and linen-blend directions for 2027",
    metaDescription:
      "Compare European flax linen, linen-cotton, linen-silk, linen-viscose and linen-lyocell in the FabStitch 2027 collection.",
    summary:
      "How composition, weight and intended use separate the five linen-led products in the SS 27 collection.",
    cluster: "2027-directions",
    pillarSlug: "fabrics-2027",
    sections: [
      {
        heading: "European flax linen is the broad starting point",
        body: "European Flax Linen is the collection's 100% flax product, documented at 120–200 gsm for shirts, trousers, dresses and jackets. Its broad application range makes it a useful starting point, but it should not be treated as a substitute for every linen blend.\n\nThe product page keeps the composition and weight range explicit. It does not add a finish, stretch value or commercial claim from a branded example in the source.",
        keyPoints: [
          "100% flax.",
          "120–200 gsm.",
          "Documented for shirts, trousers, dresses and jackets.",
        ],
      },
      {
        heading: "Linen-cotton adds casual structure",
        body: "Linen-cotton appears in two example blend ratios—55/45 and 70/30—and a stated 140–220 gsm range. Its applications are casual shirts, chore jackets and bottoms.\n\nThose alternative ratios are retained as alternatives rather than averaged into a composition FabStitch does not possess. The eventual commercial product will need to identify its actual blend.",
        keyPoints: [
          "Two source-supported blend alternatives.",
          "A slightly heavier stated range than the 100% flax entry.",
        ],
      },
      {
        heading: "Linen-silk moves toward fluid premium uses",
        body: "Linen-silk is documented as 70% linen and 30% mulberry silk at 130–180 gsm. The reference connects it with knitwear, fluid dresses and resortwear.\n\nThat use profile distinguishes it from casual linen-cotton. The silk content and lighter range support a different hand and silhouette, while the product record avoids copying branded performance claims that do not automatically apply to every linen-silk cloth.",
        keyPoints: ["70% linen / 30% mulberry silk.", "130–180 gsm."],
      },
      {
        heading: "Viscose and lyocell blends emphasize drape",
        body: "The reference presents linen-viscose and linen-lyocell together at a 55/45 blend and 130–170 gsm for drapey trousers and soft tailoring. FabStitch separates them into two products because viscose and lyocell are different fibre choices.\n\nBoth retain the same source-supported weight and applications. No unsupported durability, care or environmental comparison is added to the product pages.",
        keyPoints: [
          "Two distinct cellulosic blend products.",
          "Documented for drapey trousers and soft tailoring.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why are linen-viscose and linen-lyocell separate?",
        answer:
          "The source groups the direction but names two different cellulosic fibre options. FabStitch keeps a stable product identity for each while retaining the same supported blend, weight and applications.",
      },
    ],
    fabricSlugs: [
      "european-flax-linen",
      "linen-cotton",
      "linen-silk",
      "linen-viscose",
      "linen-lyocell",
    ],
    applicationSlugs: ["shirts", "dresses", "trousers", "tailoring"],
  }),
];

export const CATALOG_GUIDES: CatalogGuide[] = [
  ...CORE_GUIDES,
  ...EDUCATION_GUIDES,
];

export const CATALOG_GUIDE_BY_SLUG = new Map(
  CATALOG_GUIDES.map((item) => [item.slug, item]),
);
