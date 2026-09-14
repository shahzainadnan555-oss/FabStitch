import type { CatalogGuide } from "./guides";

type EducationInput = {
  slug: string;
  type: CatalogGuide["type"];
  title: string;
  heading: string;
  metaDescription: string;
  summary: string;
  cluster: CatalogGuide["cluster"];
  sections: CatalogGuide["sections"];
  faqs: CatalogGuide["faqs"];
  fabricSlugs: string[];
  applicationSlugs: string[];
};

function educationGuide(input: EducationInput): CatalogGuide {
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

export const EDUCATION_GUIDES: CatalogGuide[] = [
  educationGuide({
    slug: "what-is-cotton-fabric",
    type: "technical_guide",
    title: "What is cotton fabric?",
    heading: "What is cotton fabric?",
    metaDescription:
      "Learn how cotton is spun and woven or knitted, which constructions suit shirts and dresses, and how to compare cotton fabrics on FabStitch.",
    summary:
      "Cotton is a plant fibre used for breathable cloth across shirts, dresses, trousers and interiors. The useful question is not whether a fabric is cotton, but which construction and weight you need.",
    cluster: "fabric-education",
    sections: [
      {
        heading: "What cotton is, and what it is not",
        body: "Cotton comes from the seed hairs of the cotton plant. Once spun, it can be woven into poplin, twill, canvas or sateen, or knitted into jersey, pique and fleece. The fibre itself is absorbent and comfortable next to skin, but those qualities change with yarn count, twist and finish.\n\nA cotton poplin for shirts and a cotton canvas for workwear share a fibre, not a performance profile. Compare the named construction and stated weight before treating two cottons as interchangeable.",
        keyPoints: [
          "Cotton is a fibre; poplin, twill and jersey are constructions.",
          "Comfort and drape depend on yarn and finish as much as fibre.",
          "Browse the Cotton collection to compare named constructions.",
        ],
      },
      {
        heading: "Common cotton constructions",
        body: "Poplin and broadcloth give a smooth, crisp shirt face. Twill has a diagonal rib and more drape. Canvas and duck are denser and better for structured garments or interiors. Sateen is smoother and more lustrous because more weft sits on the surface.\n\nKnitted cotton — jersey, pique, French terry — stretches with the loop structure rather than with elastane. If a product page does not state stretch, do not assume it.",
        keyPoints: [
          "Woven cottons hold shape; knits follow the body.",
          "Sateen and canvas can both be cotton and still behave differently.",
        ],
      },
      {
        heading: "How to choose cotton on FabStitch",
        body: "Open a cotton fabric and read composition, construction and GSM where stated. A shirting poplin is typically lighter than a chino twill or canvas. If the page lists Best For uses such as shirts or dresses, treat those as documented starting points, not as a guarantee for every design.\n\nFrom there, move to related fabrics in the same family so you can compare weight and surface rather than shopping by fibre name alone.",
        keyPoints: [
          "Use the fabric page, not the word cotton, to decide.",
          "Collection pages keep comparable cottons in one place.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is cotton always breathable?",
        answer:
          "Cotton is generally more breathable than many synthetics at a similar weight, but a heavy canvas or coated finish will feel warmer than a fine voile. Check construction and GSM.",
      },
      {
        question: "Where do I browse cotton on FabStitch?",
        answer:
          "Start with the Cotton collection, then open individual fabrics to compare construction and weight.",
      },
    ],
    fabricSlugs: ["cotton-poplin", "egyptian-cotton-poplin", "crinkle-cotton"],
    applicationSlugs: ["shirts", "dresses", "trousers"],
  }),
  educationGuide({
    slug: "understanding-fabric-width",
    type: "technical_guide",
    title: "Understanding fabric width",
    heading: "Understanding fabric width",
    metaDescription:
      "Learn why fabric width matters when you estimate quantity, how usable width differs from listed width, and how to read width on FabStitch.",
    summary:
      "Width determines how much cloth you need for a marker or garment plan. A listed width is a starting figure; usable width after selvedge and shrinkage can be smaller.",
    cluster: "fabric-education",
    sections: [
      {
        heading: "Why width changes the quantity",
        body: "Quantity is not only length. A wider cloth can reduce the metres needed for the same pattern, while a narrow cloth may need more length or more joins. That is why two fabrics of the same GSM can still produce different order quantities.\n\nOn FabStitch, width is shown in centimetres when the catalog record includes it. If width is not published, do not assume a standard 140 cm or 150 cm.",
        keyPoints: [
          "Width and length together decide how far a quantity goes.",
          "Missing width should stay missing, not guessed.",
        ],
      },
      {
        heading: "Listed width versus usable width",
        body: "The published width usually includes selvedge. Pattern cutting uses the usable width inside the selvedge, and finishing or washing can also reduce the cut size. For inquiry quantities, state the garment or product plan and the quantity you need rather than converting from an assumed marker efficiency.",
        keyPoints: [
          "Selvedge and shrinkage reduce usable width.",
          "Include the intended product when you send an inquiry.",
        ],
      },
    ],
    faqs: [
      {
        question: "What if a fabric page has no width?",
        answer:
          "Leave it blank in your own notes and ask for width in the inquiry. FabStitch does not invent a commercial width.",
      },
    ],
    fabricSlugs: ["cotton-poplin", "european-flax-linen"],
    applicationSlugs: ["shirts", "dresses"],
  }),
  educationGuide({
    slug: "cotton-vs-linen",
    type: "comparison",
    title: "Cotton vs linen: which fabric is right for your project?",
    heading: "Cotton vs linen: which fabric is right for your project?",
    metaDescription:
      "Compare cotton and linen for drape, crease, weight and typical uses so you can choose a starting collection on FabStitch.",
    summary:
      "Cotton and linen are both plant fibres, but they handle, crease and drape differently. Choose from the construction and the product, not from a preference for one fibre name.",
    cluster: "fabric-education",
    sections: [
      {
        heading: "How the two fibres behave",
        body: "Cotton yarns are generally smoother and more regular. Linen, especially flax, has a drier hand and a more visible slub. Linen often feels cooler and more open at a similar weight, and it creases more readily. Cotton can take a wider range of smooth, crisp or brushed finishes.\n\nNeither fibre is automatically better for summer or for tailoring. A heavy linen canvas and a cotton voile sit at opposite ends of the same season.",
        keyPoints: [
          "Linen usually shows more slub and crease.",
          "Cotton covers a wider range of smooth constructions.",
        ],
      },
      {
        heading: "Choosing by product",
        body: "For shirts, both fibres work: cotton poplin for a clean collar and placket, linen for a more relaxed surface. For dresses and trousers, linen blends can add fluidity; cotton twill or poplin holds a cleaner line. For interiors, heavier linen and cotton canvases are more relevant than shirting weights.\n\nIf you already know the fibre family, open that collection. If you only know the garment, start from Best For and compare the fibre afterwards.",
        keyPoints: [
          "Match fibre to the garment line, not the other way around.",
          "Blends such as linen-cotton sit between the two extremes.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is linen always more expensive than cotton?",
        answer:
          "Price is not published as a catalog fact on FabStitch. Commercial terms are confirmed after an inquiry, so fibre name alone is not a price signal.",
      },
    ],
    fabricSlugs: ["european-flax-linen", "linen-cotton", "cotton-poplin"],
    applicationSlugs: ["shirts", "dresses", "trousers"],
  }),
  educationGuide({
    slug: "silk-vs-satin",
    type: "comparison",
    title: "Silk vs satin: what's the difference?",
    heading: "Silk vs satin: what's the difference?",
    metaDescription:
      "Understand the difference between silk as a fibre and satin as a weave, and how to read silk and satin-like fabrics on FabStitch.",
    summary:
      "Silk is a fibre. Satin is a weave that can be made from silk or from other filaments. Mixing the two words is how teams order the wrong cloth.",
    cluster: "fabric-education",
    sections: [
      {
        heading: "Fibre and weave are different questions",
        body: "Silk describes the filament. Satin describes a weave with long surface floats, which is why it looks lustrous. A silk satin uses both. A polyester satin uses the weave without the silk fibre. Silk chiffon, georgette, habotai and twill are silk without being satin.\n\nOn a FabStitch fabric page, read composition and construction together. If the page says silk chiffon, the fibre is silk and the construction is a sheer plain weave, not satin.",
        keyPoints: [
          "Silk is the fibre; satin is the weave.",
          "A lustrous surface is not proof of silk.",
        ],
      },
      {
        heading: "When each is useful",
        body: "Silk sheers and crepes are common for dresses and occasionwear where drape and lightness matter. Satin weaves, whether silk or not, give a smoother highlight and can feel more formal. For linings and fluid dresses, confirm weight and opacity on the product page rather than ordering by the word satin.",
        keyPoints: [
          "Use Best For dresses when the garment is known and the weave is not.",
          "Open Silk & Sheer to compare named silk constructions.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is satin always slippery?",
        answer:
          "Satin weaves are typically smoother than plain weaves, but finish and fibre still change the hand. Read the named fabric rather than assuming one handle.",
      },
    ],
    fabricSlugs: ["silk-chiffon", "silk-satin", "silk-georgette"],
    applicationSlugs: ["dresses", "occasionwear"],
  }),
  educationGuide({
    slug: "what-is-a-fabric-weave",
    type: "technical_guide",
    title: "What is a fabric weave?",
    heading: "What is a fabric weave?",
    metaDescription:
      "A plain-language explanation of plain, twill and satin weaves, and how weave changes drape, opacity and surface on FabStitch fabrics.",
    summary:
      "A weave is the order in which warp and weft cross. That order changes thickness, drape, lustre and how a cloth takes a crease.",
    cluster: "fabric-education",
    sections: [
      {
        heading: "The three basic woven structures",
        body: "Plain weave crosses every thread in turn. It is stable and is the base of poplin, voile, canvas and many linens. Twill steps the crossing to make a diagonal rib; denim, gabardine and many suitings are twills. Satin floats more yarns on the surface, which increases lustre and can reduce opacity.\n\nKnit structures are not weaves. Jersey, rib and terry are loops, so stretch and recovery behave differently even when the fibre is the same.",
        keyPoints: [
          "Plain, twill and satin are the three foundational weaves.",
          "Knits are a separate construction family.",
        ],
      },
      {
        heading: "How to read weave on a product page",
        body: "FabStitch lists construction as a catalog field when it is known. Use that field with GSM and composition. A 180 gsm plain-weave cotton and a 180 gsm twill cotton will not cut or hang the same.\n\nIf construction is not stated, do not infer it from the fabric name alone unless the name is itself a construction, such as poplin or twill.",
        keyPoints: [
          "Construction plus weight is more useful than either alone.",
          "Related fabrics help you compare the same fibre in another weave.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is twill always heavier than plain weave?",
        answer:
          "No. Weight is a separate measurement. Twill can be light suiting or heavy workwear. Read GSM when it is published.",
      },
    ],
    fabricSlugs: ["cotton-poplin", "egyptian-cotton-twill", "silk-twill"],
    applicationSlugs: ["shirts", "tailoring", "trousers"],
  }),
  educationGuide({
    slug: "how-to-choose-the-right-fabric-weight",
    type: "buyer_guide",
    title: "How to choose the right fabric weight",
    heading: "How to choose the right fabric weight",
    metaDescription:
      "Use GSM and construction together to choose a fabric weight for shirts, dresses, tailoring and interiors on FabStitch.",
    summary:
      "Weight is a measurement, not a style. The right GSM depends on the garment, the climate and whether the cloth is woven or knitted.",
    cluster: "choosing-fabrics",
    sections: [
      {
        heading: "Start from the product, then the number",
        body: "A shirt usually needs less mass than a jacket or an upholstery cloth. Dresses can sit anywhere from a sheer silk to a compact ponte. If you begin with a GSM target and no product, you will reject useful cloth and keep the wrong cloth.\n\nOn FabStitch, GSM appears when the catalog record includes a value or a range. A range is a range. Do not average it into a single buying number.",
        keyPoints: [
          "Product first, measurement second.",
          "A published range should stay a range.",
        ],
      },
      {
        heading: "Weight without construction is incomplete",
        body: "A 200 gsm jersey and a 200 gsm canvas do not sew or hang the same. Use the fabric-weight-and-gsm guide for how the unit works, then return to the named construction. For activewear, stretch and recovery matter as much as mass. For tailoring, drape and crease resistance sit beside GSM.",
        keyPoints: [
          "Compare fabrics inside the same construction family.",
          "Open Best For when the garment is known and the GSM is not.",
        ],
      },
    ],
    faqs: [
      {
        question: "What GSM is best for shirts?",
        answer:
          "There is no single best GSM. Many shirtings are lighter than trousers or jackets, but the right number still depends on climate, opacity and construction. Compare the shirt fabrics themselves.",
      },
    ],
    fabricSlugs: ["cotton-poplin", "european-flax-linen", "silk-chiffon"],
    applicationSlugs: ["shirts", "dresses", "tailoring"],
  }),
  educationGuide({
    slug: "understanding-stretch-in-fabric",
    type: "technical_guide",
    title: "Understanding stretch in fabric",
    heading: "Understanding stretch in fabric",
    metaDescription:
      "Learn the difference between mechanical stretch and elastane stretch, and how FabStitch records stretch only when it is documented.",
    summary:
      "Stretch can come from the knit structure or from an elastane or similar filament. If a fabric page does not document stretch, treat it as unstated.",
    cluster: "fabric-education",
    sections: [
      {
        heading: "Two different kinds of stretch",
        body: "Mechanical stretch comes from loops in a knit or from a crimped yarn. Elastane stretch comes from a filament that recovers after extension. A cotton jersey can move without any elastane. A woven stretch trouser usually needs an elastane or similar component.\n\nRecovery matters as much as extension. A cloth that grows and does not return will not hold a waistband or a tailored line.",
        keyPoints: [
          "Knit stretch and elastane stretch are not the same.",
          "Recovery is part of the decision, not only stretch percentage.",
        ],
      },
      {
        heading: "How FabStitch treats stretch",
        body: "Stretch appears in filters and on fabric records only when the catalog documents it. The interface does not invent a stretch percentage to make two products easier to compare. If you need stretch for activewear or a fitted dress, use the documented field and the Performance or knit collections rather than assuming every jersey will recover.",
        keyPoints: [
          "No documented stretch means no claimed stretch.",
          "Activewear and knitwear pages are the right starting points.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does jersey always stretch?",
        answer:
          "Jersey has mechanical give. How much it recovers depends on fibre, gauge and finish. Read the named fabric rather than assuming elastane.",
      },
    ],
    fabricSlugs: [
      "pointelle-knit",
      "stretch-woven-compression",
      "ponte-double-knit",
    ],
    applicationSlugs: ["activewear", "knitwear", "dresses"],
  }),
  educationGuide({
    slug: "how-fabric-composition-affects-performance",
    type: "technical_guide",
    title: "How fabric composition affects performance",
    heading: "How fabric composition affects performance",
    metaDescription:
      "See how fibre blends change moisture, drape, crease and durability, and how to read composition on FabStitch fabric pages.",
    summary:
      "Composition is the fibre recipe. It influences moisture, drape, crease and durability, but it never replaces construction and weight.",
    cluster: "fabric-education",
    sections: [
      {
        heading: "Read the whole composition",
        body: "A 100% cotton poplin and a cotton-elastane poplin are not the same product. A linen-viscose blend will usually drape more than a European flax linen at a similar weight. If a page lists several fibres, the first named fibre is not automatically the only one that matters.\n\nPercentages, when published, stay as published. FabStitch does not round a blend into a simpler marketing fibre.",
        keyPoints: [
          "Blends change handle even when the first fibre is familiar.",
          "Unstated percentages stay unstated.",
        ],
      },
      {
        heading: "Performance is more than sport",
        body: "Performance can mean moisture management in activewear, crease resistance in shirts, or abrasion resistance in contract interiors. Composition contributes, but so do weave, finish and weight. Use the Performance collection for technical constructions and Best For activewear when the end use is sport or next-to-skin movement.",
        keyPoints: [
          "Do not equate polyester with performance or cotton with comfort.",
          "Check construction and Best For together with composition.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I request a different blend?",
        answer:
          "An inquiry can include a note about the intended product. Availability of another blend is confirmed by FabStitch after the inquiry, not assumed from the catalog.",
      },
    ],
    fabricSlugs: [
      "linen-viscose",
      "stretch-woven-compression",
      "wool-silk-bi-stretch",
    ],
    applicationSlugs: ["activewear", "shirts", "tailoring"],
  }),
  educationGuide({
    slug: "how-to-choose-fabric-for-dresses",
    type: "buyer_guide",
    title: "How to choose fabric for dresses",
    heading: "How to choose fabric for dresses",
    metaDescription:
      "Choose dress fabrics by drape, opacity and weight, then use FabStitch Best For dresses and related collections to compare real cloth.",
    summary:
      "A dress fabric has to hang, cover and move. Start with the silhouette, then compare sheers, crepes, knits and linens that are documented for dresses.",
    cluster: "choosing-fabrics",
    sections: [
      {
        heading: "Decide the silhouette before the fibre",
        body: "A bias slip, a shirt dress and a structured day dress do not share one cloth. Sheers and crepes follow the body. Poplin and linen hold a cleaner line. Compact knits such as ponte can support a closer cut without a woven interfacing.\n\nOpacity matters as much as drape. A chiffon that works for a draped overlay is not automatically a one-layer dress cloth.",
        keyPoints: [
          "Silhouette first, fibre second.",
          "Check opacity on the fabric page and in related sheers.",
        ],
      },
      {
        heading: "Where to look on FabStitch",
        body: "Use Best For dresses to see fabrics whose documented applications include dresses. From there, Silk & Sheer is useful for fluid and occasion cloth, Cotton and Linen & Lightweight for daywear, and Knitwear for closer cuts.\n\nWhen you have a shortlist, send an inquiry with the quantity and the dress type so the commercial follow-up matches the product you are making.",
        keyPoints: [
          "Best For dresses is the product-led entry.",
          "Inquiry notes should name the silhouette.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I use shirting cotton for a dress?",
        answer:
          "Sometimes, if the silhouette is closer to a shirt dress and the weight and drape suit it. Compare the named fabric rather than assuming every poplin will work.",
      },
    ],
    fabricSlugs: ["silk-chiffon", "silk-georgette", "linen-viscose"],
    applicationSlugs: ["dresses", "occasionwear"],
  }),
  educationGuide({
    slug: "choosing-fabric-for-activewear",
    type: "buyer_guide",
    title: "Choosing fabric for activewear",
    heading: "Choosing fabric for activewear",
    metaDescription:
      "Compare stretch, recovery and construction for activewear, then use FabStitch Performance and Best For activewear pages.",
    summary:
      "Activewear cloth has to move and recover. Start from the activity and the required stretch, then compare documented performance and knit constructions.",
    cluster: "choosing-fabrics",
    sections: [
      {
        heading: "What the activity actually needs",
        body: "Compression, swim, next-to-skin training and retro-sport knits are different briefs. A stretch woven with recovery is not a substitute for a mesh, and a cotton jersey is not automatically an activewear cloth.\n\nLook for documented stretch, construction and Best For activewear. If those fields are absent, do not fill them in from a lifestyle photo.",
        keyPoints: [
          "Name the activity before choosing the cloth.",
          "Documented stretch beats assumed stretch.",
        ],
      },
      {
        heading: "Where to compare on FabStitch",
        body: "The Performance collection groups technical and next-to-skin constructions. Best For activewear collects fabrics whose applications include that use. Open a fabric, read composition and construction, then send an inquiry with the quantity and the product — for example a legging, a polo or a swim brief.",
        keyPoints: [
          "Use Performance and Best For activewear together.",
          "Inquiry notes should name the end product.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is every polyester fabric suitable for sport?",
        answer:
          "No. Fibre alone does not define activewear. Construction, stretch and finish decide whether a cloth belongs in that brief.",
      },
    ],
    fabricSlugs: [
      "stretch-woven-compression",
      "crossover-swimwear-fabric",
      "cooling-performance-construction",
    ],
    applicationSlugs: ["activewear"],
  }),
];
