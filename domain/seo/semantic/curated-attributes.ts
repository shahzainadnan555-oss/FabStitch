import type { SemanticFaq, SemanticPage, SemanticSection } from "./types";

/**
 * Hand-authored enrichment for high-intent attribute hubs.
 * Applied onto the existing canonical discover slug — never a new URL.
 */
type CuratedAttributeHub = {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  eyebrow: string;
  intro: string;
  sections: readonly SemanticSection[];
  faqs: readonly SemanticFaq[];
  relatedPaths: readonly string[];
  collectionSlugs?: readonly string[];
  bestForSlugs?: readonly string[];
  imagePath: string;
  imageAlt: string;
  ctaHeading: string;
  ctaBody: string;
};

const OPAQUE_FABRIC: CuratedAttributeHub = {
  slug: "opaque-fabric",
  title: "What Is Opaque Fabric?",
  h1: "What Is Opaque Fabric?",
  metaDescription:
    "Opaque fabric hides light and skin enough for the garment without relying on lining. Learn how GSM, weave, knit, colour and finish change coverage.",
  eyebrow: "Fabric coverage",
  intro:
    "Opaque fabric is cloth that blocks enough light and skin show-through for the garment you are making, usually without needing a lining for modesty or colour fidelity. Opacity is not a moral grade and it is not fixed by fibre name alone — construction, weight, yarn, colour and lighting all change how covered a cloth reads in wear.",
  imagePath: "/media/fabrics/cotton-poplin-primary.webp",
  imageAlt:
    "Close-up texture of opaque woven cotton poplin with dense plain-weave construction",
  relatedPaths: [
    "/discover/fabric-opacity-for-garments/",
    "/discover/sheer-fabric/",
    "/guides/fabric-weight-and-gsm/",
    "/guides/woven-vs-knit-fabrics/",
    "/fabrics/best-for/shirts/",
    "/fabrics/best-for/dresses/",
    "/fabrics/best-for/trousers/",
    "/fabrics/best-for/outerwear/",
    "/collections/cotton/",
    "/collections/silk-sheer/",
    "/marketplace/",
    "/fabrics/",
    "/guides/",
  ],
  collectionSlugs: ["cotton"],
  bestForSlugs: ["shirts", "dresses", "trousers"],
  ctaHeading: "Next step for opaque fabric",
  ctaBody:
    "Open a named FabStitch fabric, check colour and construction against your garment, then inquire on that URL. This page does not invent a GSM, lining rule or certificate.",
  sections: [
    {
      heading: "What Does Opaque Mean in Fabric?",
      body: [
        "In apparel sourcing, opaque means the cloth covers: light does not pass through enough to reveal skin, underlayers or a stark colour shift when the garment is worn. Sheer means light and silhouette show through by design. Semi-sheer or semi-opaque sits between those poles and often needs lining, doubling or strategic layering.",
        "These labels are practical shorthand, not lab certificates. The same cloth can read opaque in a deep navy and revealing in an undyed or pale colourway because dye depth fills yarn gaps that a light colour leaves open.",
      ],
    },
    {
      heading: "What Makes a Fabric Opaque?",
      body: [
        "Coverage comes from how much solid fibre sits between the eye and whatever is behind the cloth. Yarn size, yarn twist, sett (how closely yarns sit), knit gauge, fabric thickness, surface finish and colour all contribute. No single factor always wins.",
        "A dense plain weave at a moderate GSM can cover better than a lofted but open construction at a higher GSM. A compact jersey can look solid until stretch opens the loops. Treat opacity as a system of traits, then verify on the colour you will actually cut.",
      ],
      keyPoints: [
        "Yarn cover and sett matter as much as fibre branding",
        "Colour and dye depth change perceived coverage",
        "Stretch, wetness and backlight can open a cloth that looked solid at rest",
      ],
    },
    {
      heading: "How Fabric Weight and GSM Affect Opacity",
      body: [
        "GSM — grams per square metre — is mass per area. Heavier cloth often hides more because there is more fibre in the path of light, but GSM alone does not guarantee opacity. A 140 GSM voile and a 140 GSM poplin can share a number and disagree completely on coverage because the constructions differ.",
        "Use published GSM to compare similar constructions: woven with woven, knit with knit. Pair the number with the weave or knit name, yarn description and a photograph against a light ground. For pale shirtings and dress cloths, assume you may need lining unless the fabric page or sample proves otherwise.",
      ],
    },
    {
      heading: "How Weave and Knit Construction Affect Coverage",
      body: [
        "In woven cloth, plain weaves with a close sett usually cover more evenly than open lenos or deliberately sheer plains. Twills can pack yarn efficiently and often read solid in mid weights; satin floats can look richer while still transmitting light if the yarn is fine and the sett is open. Canvas and denser work cloths are typically chosen when cover and abrasion resistance travel together.",
        "In knits, gauge, loop length and yarn fill decide how much skin shows when the cloth is relaxed and when it is stretched on the body. A compact interlock often covers better than a fine single jersey at a similar GSM. French terry and fleece add bulk and usually more cover, but loops and stretch still need sampling in the intended fit.",
      ],
    },
    {
      heading: "Color, Finish and Lighting: Why Opacity Can Vary",
      body: [
        "Deep dyes absorb and scatter light; pale dyes reveal the spaces between yarns. Prints can mask or exaggerate show-through depending on ground colour and print coverage. Finishes such as calendering, coating or bonding can raise opacity, while soft peaching or open brushing can change hand without fixing cover.",
        "Lighting matters in evaluation. A cloth that looks solid under soft indoor light can flash under store fluorescents or strong daylight. Wetting and body heat can also change how a pale knit or fine weave reads. Judge opacity in the lighting and colourway closest to end use.",
      ],
    },
    {
      heading: "Which Fabrics Tend to Offer More Coverage?",
      body: [
        "Cloths that often support single-layer opacity when construction and colour cooperate include mid-weight poplins and oxfords, many twills, denim and canvas characters, compact cotton or wool suiting weights, and denser jerseys or interlocks. That tendency is not a promise for every SKU — a fine pale poplin can still need lining for a white shirt.",
        "Cloths that often need lining or layering for opacity-critical garments include chiffon, georgette, voile, organza, fine single jersey in pale colours, and open lace or mesh. Those materials are not defects when sheer movement is the design; they fail when a brief assumed solid coverage without planning a lining.",
      ],
    },
    {
      heading: "Opaque vs Sheer vs Semi-Sheer Fabric",
      body: [
        "Opaque: intended to hide skin and most underlayers without lining for modesty or colour. Sheer: transmits light and silhouette as a design feature. Semi-sheer: partial cover that usually needs lining, slip layers or strategic opacity mapping on a pattern.",
        "Do not treat the page title as the test. Read construction notes, look at photography against a light ground, and sample the colourway. Stretch knits and pale wovens are the usual places where a “solid” expectation fails late in development.",
      ],
    },
    {
      heading: "How to Choose an Opaque Fabric for Different Garments",
      body: [
        "Shirts and blouses: classic programmes usually want reliable cover in light colours at the chest and across seams. Prefer close plain weaves or oxfords with published mid-light GSM, and sample white or pastel before locking a pale story.",
        "Dresses and skirts: decide whether opacity is required in a single layer or whether lining is part of the design. Flowy sheers belong with lining plans; day dresses in pale colours need the same backlight check as shirtings.",
        "Trousers and skirts for work: seat and thigh show-through is a common failure. Mid-weight twills, denser plains and many suiting cloths are starting points — still verify in the actual colour under seated stretch.",
        "Outerwear and uniforms: cover often travels with durability and colour fastness. Densely set wovens and work cloths are typical, but pale softshells and fine shirtings used as uniform layers still need opacity checks.",
        "Home textiles: curtains, sheers and upholstery use opacity language differently — privacy cloth versus decorative sheer. Match the brief to the end use rather than copying apparel rules wholesale.",
      ],
    },
    {
      heading: "What Buyers Should Check Before Ordering",
      body: [
        "Confirm composition, construction and published weight on the FabStitch fabric page. Look for sheer or coverage notes when present. Compare photography against a light ground, and treat pale colourways as higher risk.",
        "Ask whether the garment is single-layer or lined. Note stretch percentage for knits, because fit tension opens loops. Inquire with the fabric URL, colourway, quantity and end use so commercial follow-up stays attached to the cloth you actually tested.",
      ],
      keyPoints: [
        "Sample the real colourway, not only a dark swatch",
        "Check seated and stretched positions for trousers and knits",
        "Write lining expectations into the brief when coverage is uncertain",
      ],
    },
  ],
  faqs: [
    {
      question: "What does opaque fabric mean?",
      answer:
        "Opaque fabric blocks enough light and skin show-through for the garment, usually without relying on lining for modesty or colour fidelity. It is a practical coverage label, not a fibre certificate.",
    },
    {
      question: "What makes a fabric opaque?",
      answer:
        "Yarn cover, sett or gauge, thickness, colour depth and finish all contribute. Construction and colour often matter as much as weight.",
    },
    {
      question: "Is thicker fabric always more opaque?",
      answer:
        "No. A thicker but open construction can show more light than a thinner, densely set cloth. Compare construction and colour alongside thickness or GSM.",
    },
    {
      question: "Does GSM affect fabric opacity?",
      answer:
        "Higher GSM often correlates with more cover within the same construction family, but GSM alone does not guarantee opacity across unrelated weaves or knits.",
    },
    {
      question: "What is the difference between opaque and sheer fabric?",
      answer:
        "Opaque cloth is meant to hide; sheer cloth transmits light and silhouette by design. Semi-sheer sits between and usually needs lining or layering for opacity-critical garments.",
    },
    {
      question: "Which fabrics are naturally more opaque?",
      answer:
        "Dense poplins, oxfords, twills, denim, canvas and compact knits often cover well when colour cooperates. Fine voiles, chiffons and open jerseys usually need lining plans.",
    },
    {
      question: "Can a lightweight fabric still be opaque?",
      answer:
        "Yes, when yarn cover and sett are tight and the colour is deep enough. Lightweight does not automatically mean sheer — and mid-weight does not automatically mean opaque.",
    },
    {
      question: "Does fabric color affect opacity?",
      answer:
        "Strongly. Pale and undyed colourways reveal yarn gaps that deeper dyes hide. Always evaluate opacity in the colour you will cut.",
    },
    {
      question: "Can lining make a fabric more opaque?",
      answer:
        "Yes. Lining, bonding or doubling can supply cover when the face cloth is sheer or borderline. Plan lining early when the design needs movement from a sheer face.",
    },
    {
      question: "How can I check fabric opacity before buying?",
      answer:
        "Read published construction and weight, study photography against a light ground, and sample the real colourway under daylight and indoor light. For knits, stretch the sample as the garment will fit.",
    },
  ],
};

const CURATED_BY_SLUG: Record<string, CuratedAttributeHub> = {
  [OPAQUE_FABRIC.slug]: OPAQUE_FABRIC,
};

export function curatedAttributeHub(
  slug: string,
): CuratedAttributeHub | undefined {
  return CURATED_BY_SLUG[slug];
}

/** Apply curated copy onto a composed semantic page while keeping route identity. */
export function applyCuratedAttributeHub(page: SemanticPage): SemanticPage {
  const curated = curatedAttributeHub(page.slug);
  if (!curated) return page;
  if (page.pageType !== "attribute" || page.attribute?.id !== "opaque") {
    return page;
  }

  const wordCount = [
    curated.title,
    curated.h1,
    curated.intro,
    curated.metaDescription,
  ]
    .concat(
      curated.sections.flatMap((section) => [
        section.heading,
        ...section.body,
        ...(section.keyPoints ?? []),
      ]),
      curated.faqs.flatMap((faq) => [faq.question, faq.answer]),
    )
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return {
    ...page,
    title: curated.title,
    h1: curated.h1,
    metaDescription: curated.metaDescription,
    eyebrow: curated.eyebrow,
    intro: curated.intro,
    sections: [...curated.sections],
    faqs: [...curated.faqs],
    relatedPaths: [...curated.relatedPaths],
    collectionSlugs: curated.collectionSlugs
      ? [...curated.collectionSlugs]
      : page.collectionSlugs,
    bestForSlugs: curated.bestForSlugs
      ? [...curated.bestForSlugs]
      : page.bestForSlugs,
    ctaHeading: curated.ctaHeading,
    ctaBody: curated.ctaBody,
    wordCount,
    imagePath: curated.imagePath,
    imageAlt: curated.imageAlt,
    qualityNotes: wordCount < 80 ? ["insufficient_word_count"] : [],
    qualityGatePassed: wordCount >= 80,
    indexable: wordCount >= 80,
  };
}
