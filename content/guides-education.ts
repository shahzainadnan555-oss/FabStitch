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
    heading: "Where cotton and linen differ",
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
      {
        heading: "Breathability, crease, and moisture",
        body: "Linen often feels cooler because flax yarns leave a more open, irregular surface, not because a label says “breathable.” Cotton can be just as open in a voile or just as warm in a flannel. Crease is the usual linen trade-off: a dry linen shirt will mark at the elbow. A linen-cotton blend usually creases less and looks less slubby. Neither behaviour is a defect unless the brief asked for a pressed, smooth surface.",
        keyPoints: [
          "Cool hand comes from yarn and cloth structure, not the fibre slogan.",
          "Crease is expected in dry linen and reduced in many blends.",
        ],
      },
      {
        heading: "What to compare before you source either fibre",
        body: "Put European flax linen, a linen blend, and a cotton poplin or oxford side by side and read composition, construction, and any published weight. Leave GSM blank when a page omits it. Do not call a blend pure linen, and do not call every cotton organic. Price, mill, and certificate are not on these collection pages. The inquiry is where quantity and those commercial questions belong.",
        keyPoints: [
          "Compare named fabrics, not the two fibre words.",
          "Commercial terms stay in the inquiry.",
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
      {
        heading: "Avoid common activewear mistakes",
        body: "Do not treat every stretch cloth as interchangeable. A compression woven, a cooling construction and a retro-sport knit answer different briefs even when all feel “athletic” in a photo.\n\nIf recovery, opacity or swim suitability matters, confirm it on the product record or ask in the inquiry. Guessing from handfeel language alone creates sampling waste.",
        keyPoints: [
          "Stretch type and construction are not the same brief.",
          "Ask about undocumented performance needs in the inquiry.",
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
  educationGuide({
    slug: "how-to-buy-fabric-online",
    type: "buyer_guide",
    title: "How to buy fabric online",
    heading: "How to buy fabric online with confidence",
    metaDescription:
      "A practical guide to buying fabric online: search by material and use, compare specs, then inquire for quantity on FabStitch.",
    summary:
      "Buying fabric online works best when you start from the product you are making, compare documented composition and weight, and inquire with a clear quantity — not when you shop by fibre name alone.",
    cluster: "choosing-fabrics",
    sections: [
      {
        heading: "Start from the product, not a fibre buzzword",
        body: "Online fabric shopping fails most often when a brief starts with “I need cotton” and stops there. Cotton poplin, cotton voile and cotton moleskin serve different garments. The same is true for linen blends, silk sheers and technical knits.\n\nOn FabStitch, begin in the marketplace search or a Best For edit that matches what you are making — shirts, dresses, activewear, outerwear or home textiles. Then open named fabrics and read the documented composition, construction and weight before you inquire.",
        keyPoints: [
          "Name the end use before you shortlist cloth.",
          "Compare named fabrics, not fibre labels alone.",
        ],
      },
      {
        heading: "What to compare on every fabric page",
        body: "A useful online fabric record shows what you can verify: composition, construction, stated measurements, character notes and Best For uses. If a property is not documented, do not invent it from a photo.\n\nUse collections when you already know the material family — for example Cotton, Linen & Lightweight, or Silk & Sheer — and use Best For when the garment decides the shortlist. Both paths should land on the same product page with the same specifications.",
        keyPoints: [
          "Trust documented specs over lifestyle imagery.",
          "Collections and Best For should converge on the same fabric page.",
        ],
      },
      {
        heading: "From shortlist to inquiry",
        body: "When a fabric fits, send an inquiry with quantity in metres and a short note about the product. That is how FabStitch turns discovery into a sourcing conversation without forcing a self-serve checkout for every brief.\n\nIf you are still comparing options, keep two or three fabric pages open, note the differences in weight and drape, and only inquire when the brief is clear enough for a supplier conversation.",
        keyPoints: [
          "Include quantity and end use in the inquiry.",
          "Narrow the shortlist before you ask for commercial follow-up.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I buy fabric online without knowing GSM?",
        answer:
          "Yes, but you should still compare the stated weight or measurement on each product. If weight is missing, ask in the inquiry rather than guessing from a photo.",
      },
      {
        question: "Is marketplace search the same as Best For?",
        answer:
          "No. Search and filters explore the full catalog. Best For groups fabrics already documented for a specific end use. Use both when you need breadth and a focused shortlist.",
      },
    ],
    fabricSlugs: [
      "european-flax-linen",
      "cotton-poplin",
      "silk-chiffon",
      "stretch-woven-compression",
    ],
    applicationSlugs: ["shirts", "dresses", "activewear"],
  }),
  educationGuide({
    slug: "how-to-source-fabric-for-clothing-brands",
    type: "buyer_guide",
    title: "How to source fabric for clothing brands",
    heading: "How to source fabric for clothing brands",
    metaDescription:
      "A clear fabric sourcing workflow for clothing brands and boutiques: brief, shortlist, compare specs, then inquire on FabStitch.",
    summary:
      "Brand fabric sourcing is a brief-driven process. Define the garment and constraints first, shortlist named fabrics with documented properties, then inquire with quantity and timeline — without inventing certifications or MOQs that are not stated.",
    cluster: "choosing-fabrics",
    sections: [
      {
        heading: "Write a brief before you browse",
        body: "Clothing brands waste time when the team searches “nice linen” without stating season, silhouette, stretch needs or approximate quantity. A workable brief names the product, the handfeel range, any hard constraints, and whether the cloth must be sheer, structured, stretch or technical.\n\nFabStitch is built for that kind of brief. Use Best For edits for shirts, dresses, tailoring, activewear and outerwear, then open fabric pages that already document composition and uses.",
        keyPoints: [
          "A sourcing brief beats an open-ended fibre search.",
          "Quantity and silhouette belong in the brief early.",
        ],
      },
      {
        heading: "Shortlist with collections and Best For together",
        body: "Collections help when the material family is already decided — cotton shirting, silk sheers, denim, performance. Best For helps when the garment is decided and the fibre is still open.\n\nKeep the shortlist small. Three to five named fabrics with clear differences in weight or construction are easier to evaluate than twenty near-duplicates. Link each candidate back to the marketplace filters if you need a wider scan.",
        keyPoints: [
          "Collections answer material-first briefs.",
          "Best For answers product-first briefs.",
        ],
      },
      {
        heading: "Inquire like a brand, not like a browser",
        body: "When you inquire, include the fabric name, quantity in metres, the garment, and any timing constraints you can share. Do not claim a certification, MOQ or price that the product page does not state.\n\nIf two fabrics remain in contention, say so in the note. Clear commercial context helps the follow-up without turning the storefront into a content farm of invented supplier claims.",
        keyPoints: [
          "Inquiry notes should carry brand context.",
          "Only claim properties that are documented on the fabric page.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do boutiques and manufacturers use the same workflow?",
        answer:
          "The discovery path is similar. The inquiry note changes: boutiques often need smaller quantities and clearer delivery context, while manufacturers may specify production runs. Start from the same fabric record either way.",
      },
      {
        question: "Where should I go after reading this guide?",
        answer:
          "Open the marketplace for search, a relevant Best For edit for the garment, or a material collection if the fibre family is already fixed. Then inquire from the fabric page that fits the brief.",
      },
    ],
    fabricSlugs: [
      "cotton-poplin",
      "european-flax-linen",
      "merino-roica-stretch-tailoring",
      "lightweight-denim",
    ],
    applicationSlugs: ["shirts", "tailoring", "dresses"],
  }),
  educationGuide({
    slug: "lightweight-fabric",
    type: "technical_guide",
    title: "Lightweight fabric for apparel",
    heading: "What lightweight fabric means for clothing",
    metaDescription:
      "Understand lightweight fabric for shirts, dresses and apparel — how weight relates to GSM, thin vs light, and how to compare FabStitch cloths.",
    summary:
      "Lightweight fabric is a buyer shorthand for cloth that feels airy or low-mass for the silhouette. GSM helps, but construction and fibre still decide drape and opacity.",
    cluster: "fabric-education",
    sections: [
      {
        heading: "What is considered lightweight fabric?",
        body: "Lightweight fabric usually means cloth chosen for breathability, summer programmes or fluid silhouettes. It is not the same as “thin” in every case: an open weave and a fine dense plain can feel different at similar mass.\n\nFabStitch does not invent a universal GSM cutoff for “lightweight.” Use published measurements when present, then confirm hand and opacity on the product page.",
        keyPoints: [
          "Lightweight is a programme judgment, not a single number.",
          "Missing GSM stays unstated — ask in inquiry if critical.",
        ],
      },
      {
        heading: "Lightweight vs thin vs low density",
        body: "Thin often describes thickness; lightweight describes mass per area; open constructions can feel light without being fragile. Compare construction notes beside any weight figure.\n\nLightweight cotton, linen and silk sheers answer different briefs. A lightweight shirt fabric may need more body than a lightweight dress sheer.",
        keyPoints: [
          "Do not equate sheer with lightweight automatically.",
          "Match silhouette before chasing the lightest label.",
        ],
      },
      {
        heading: "Apparel uses: shirts, dresses and seasonal cloth",
        body: "Lightweight shirt fabric and lightweight dress fabric programmes often start in cotton, linen-lightweight or silk-sheer collections. Use Best For shirts or dresses when the garment is fixed.\n\nRead the fabric weight and GSM guide for how mass is displayed, and the woven vs knit guide when construction class is undecided.",
        keyPoints: [
          "Collections group fibre families; Best For groups end uses.",
          "Inquire with metres and garment context.",
        ],
      },
      {
        heading: "Buyer checklist without invented thresholds",
        body: "Confirm published composition and construction. Note any stated weight unit (GSM, momme, oz/yd²). Check Best For uses. Decide lining if opacity is low. Then inquire.\n\nAvoid ranking “best lightweight fabric” across fibres — the brief decides.",
        keyPoints: [
          "Quality is not GSM alone.",
          "Only use numbers that appear on the fabric record.",
        ],
      },
    ],
    faqs: [
      {
        question: "What fabric is lightweight?",
        answer:
          "Many cottons, linens and sheers can serve lightweight programmes when their published construction and hand fit the silhouette. Compare named FabStitch fabrics rather than assuming a fibre is always light.",
      },
      {
        question: "Does lightweight mean low GSM?",
        answer:
          "Lower mass often correlates with lighter programmes, but construction and finish change the feel. FabStitch does not publish a single GSM definition of lightweight.",
      },
    ],
    fabricSlugs: [
      "cotton-voile",
      "european-flax-linen",
      "silk-chiffon",
      "linen-cotton",
    ],
    applicationSlugs: ["shirts", "dresses", "resortwear"],
  }),
];
