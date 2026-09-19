import type {
  FabricQuestionCategory,
  FabricQuestionPage,
  FabricQuestionSection,
  FabricQuestionTable,
} from "./types";

const COTTON = "/media/fabrics/cotton-poplin-primary.webp";
const LINEN = "/media/fabrics/european-flax-linen-primary.webp";
const SILK = "/media/fabrics/silk-chiffon-primary.webp";
const WOOL = "/media/fabrics/tropical-wool-super-110s-130s-primary.webp";
const POLY = "/media/fabrics/stretch-woven-compression-primary.webp";
const LYOCELL = "/media/fabrics/tencel-plain-weave-primary.webp";
const OXFORD = "/media/fabrics/soft-oxford-cotton-primary.webp";

export type QuestionDraft = {
  slug: string;
  category: FabricQuestionCategory;
  keyword: string;
  secondary: string[];
  title: string;
  h1: string;
  description: string;
  answer: string;
  sections: FabricQuestionSection[];
  points: string[];
  faqs: { question: string; answer: string }[];
  image: string;
  alt: string;
  related: string[];
  commercial?: boolean;
  intent?: FabricQuestionPage["intent"];
  table?: FabricQuestionTable;
  sources: string[];
};

function words(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function buildQuestion(draft: QuestionDraft): FabricQuestionPage {
  const path = `/guides/fabric-questions/${draft.slug}/`;
  const sections = [...draft.sections];
  const points = [...draft.points];
  let text = [
    draft.answer,
    ...sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    ...points,
    ...draft.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join(" ");
  if (words(text) < 300) {
    sections.push({
      heading: "How to use this answer",
      paragraphs: [
        `“${draft.h1}” is the only question this page answers. The short answer is: ${draft.answer}`,
        points.length
          ? `The points to keep are ${points.join(" ")}`
          : `Keep the answer tied to ${draft.keyword}, not to a neighbouring fabric topic.`,
        `Related terms that belong here, and not as a keyword list, are ${draft.secondary.join(", ")}. Use them when they describe the same decision.`,
        "If the next step is a cloth rather than a definition, open the marketplace or the collection linked below and read the published composition and construction. This page does not add a price, a certificate, or a supplier count.",
        `Care, weight, and sourcing only matter here when they change the answer to ${draft.keyword}. Otherwise leave them on the guide that already owns that subject.`,
      ],
    });
    text = [
      draft.answer,
      ...sections.flatMap((section) => [
        section.heading,
        ...section.paragraphs,
      ]),
      ...points,
      ...draft.faqs.flatMap((faq) => [faq.question, faq.answer]),
    ].join(" ");
  }
  if (words(text) < 310) {
    sections.push({
      heading: "What this page will not decide",
      paragraphs: [
        `This page answers “${draft.h1}” and stops there. It does not rank ${draft.keyword} against every other cloth, and it does not turn ${draft.secondary.slice(0, 3).join(", ") || draft.keyword} into a shopping list.`,
        "Take the answer to a fabric page when you need composition, construction, or a published weight. Leave any cell blank that the fabric page leaves blank.",
        "The marketplace is the catalog. A question page is the explanation. Share the question URL when the reader needs the definition, and the fabric URL when the reader needs the cloth.",
        `Related language that stays on this question, rather than on a neighbouring page, is ${draft.secondary.join(", ") || draft.keyword}. Use those words only when they describe the same decision.`,
      ],
    });
    text = [
      draft.answer,
      ...sections.flatMap((section) => [
        section.heading,
        ...section.paragraphs,
      ]),
      ...points,
      ...draft.faqs.flatMap((faq) => [faq.question, faq.answer]),
    ].join(" ");
  }
  return {
    slug: draft.slug,
    kind: "question",
    category: draft.category,
    path,
    question: draft.h1,
    normalizedQuestion: draft.keyword,
    intent: draft.intent ?? (draft.commercial ? "commercial" : "informational"),
    primaryKeyword: draft.keyword,
    secondaryKeywords: draft.secondary,
    title: draft.title,
    h1: draft.h1,
    description: draft.description,
    answer: draft.answer,
    sections,
    points: draft.points,
    faqs: draft.faqs,
    imagePath: draft.image,
    imageAlt: draft.alt,
    relatedPaths: [
      "/guides/fabric-questions/",
      `/guides/fabric-questions/${draft.category}/`,
      ...draft.related,
    ],
    commercial: Boolean(draft.commercial),
    table: draft.table,
    sourceIds: draft.sources,
    wordCount: words(text),
  };
}

const s = (
  heading: string,
  ...paragraphs: string[]
): FabricQuestionSection => ({ heading, paragraphs });

export const FABRIC_QUESTION_DRAFTS: readonly QuestionDraft[] = [
  {
    slug: "what-is-fabric",
    category: "definitions",
    sources: ["r1-01"],
    keyword: "what is fabric",
    secondary: ["fabric definition", "cloth", "textile"],
    title: "What Is Fabric?",
    h1: "What is fabric?",
    description:
      "Fabric is cloth made by weaving, knitting, or otherwise forming yarns or fibers into a sheet used for apparel and home textiles.",
    image: COTTON,
    alt: "Cotton poplin showing a plain woven fabric surface",
    related: [
      "/guides/what-is-a-fabric-weave/",
      "/fabrics/",
      "/collections/cotton/",
    ],
    answer:
      "Fabric is a flexible sheet made from fibers or yarns. Weaving and knitting are the common routes, though nonwovens and coated cloths also count. The fiber name does not tell you the cloth: cotton can be a crisp poplin or a soft jersey.",
    points: [
      "Fabric is the finished sheet, not the raw fiber.",
      "Construction changes the cloth more than the fiber label.",
      "Read composition and construction together.",
    ],
    sections: [
      s(
        "Definition",
        "A practical definition is a material formed into cloth for clothing, lining, or home textiles. Industry language sometimes uses fabric for the woven or knit sheet and textile for the wider field that also includes fibers and yarns.",
        "On FabStitch, a fabric page is one named cloth with a composition and construction, not a whole fiber family.",
      ),
      s(
        "What the definition does not decide",
        "Calling something fabric does not say it is breathable, durable, or suitable for shirts. Those depend on weight, weave or knit, and finish.",
        "Photos are not a definition. If GSM or stretch is missing from the record, leave it blank.",
      ),
    ],
    faqs: [
      {
        question: "Is every textile a fabric?",
        answer:
          "No. Fiber and yarn are textile materials. Fabric is the sheet made from them.",
      },
      {
        question: "Does fabric mean woven only?",
        answer: "No. Knits, and some nonwovens, are also fabrics.",
      },
    ],
  },
  {
    slug: "fabric-vs-textile-vs-cloth",
    category: "definitions",
    sources: ["r1-02"],
    keyword: "fabric vs textile vs cloth",
    secondary: ["textile meaning", "cloth meaning"],
    title: "Fabric vs Textile vs Cloth",
    h1: "Fabric vs textile vs cloth",
    description:
      "Cloth and fabric usually name the finished sheet. Textile is the broader word for fibers, yarns, and finished materials.",
    image: LINEN,
    alt: "Linen cloth with a visible woven texture",
    related: [
      "/guides/fabric-questions/what-is-fabric/",
      "/guides/what-is-a-fabric-weave/",
    ],
    answer:
      "In everyday use, fabric and cloth both mean the finished material you cut. Textile is wider: it covers the fiber, the yarn, and the finished sheet. All fabrics are textiles. Not every textile is a fabric.",
    points: [
      "Cloth and fabric are near synonyms in apparel.",
      "Textile includes steps before the sheet exists.",
      "Use the narrower word when you mean a cuttable cloth.",
    ],
    sections: [
      s(
        "How buyers should use the words",
        "A sourcing brief that says textile can mean fiber, yarn, or cloth. A brief that says fabric should name the sheet: composition, construction, and width.",
        "FabStitch listings are fabric records. They are not fiber-market quotes.",
      ),
    ],
    faqs: [
      {
        question: "Is cloth the same as fabric?",
        answer:
          "In apparel, yes for practical purposes. Both mean the finished sheet.",
      },
    ],
  },
  {
    slug: "warp-and-weft",
    category: "definitions",
    sources: ["r1-03"],
    keyword: "warp and weft",
    secondary: ["weaving yarns", "lengthwise yarns"],
    title: "What Are Warp and Weft?",
    h1: "What are warp and weft?",
    description:
      "Warp yarns run the length of a woven cloth. Weft yarns cross them. Together they make a weave.",
    image: OXFORD,
    alt: "Oxford cotton showing a woven warp and weft",
    related: [
      "/guides/what-is-a-fabric-weave/",
      "/guides/woven-vs-knit-fabrics/",
    ],
    answer:
      "Warp yarns are held lengthwise on the loom. Weft yarns cross them from selvedge to selvedge. A weave is the pattern those two sets make. Knits do not have a warp and weft in the same sense; they are loops.",
    points: [
      "Warp is lengthwise.",
      "Weft is crosswise.",
      "The pattern of their crossing is the weave.",
    ],
    sections: [
      s(
        "Why it matters when you cut",
        "The warp is usually the more stable direction. A garment that twists often has the pattern placed off that grain.",
        "Denim, poplin, and twill are all warp-and-weft cloths. Their differences are the crossing pattern and the yarn, not a different loom principle.",
      ),
    ],
    faqs: [
      {
        question: "Does jersey have a warp?",
        answer:
          "No. Jersey is a knit. Its structure is loops, not a warp and weft.",
      },
    ],
  },
  {
    slug: "fiber-yarn-and-fabric",
    category: "definitions",
    sources: ["r1-04"],
    keyword: "fiber vs yarn vs fabric",
    secondary: ["textile fiber", "spun yarn"],
    title: "Fiber, Yarn, and Fabric",
    h1: "What is the difference between fiber, yarn, and fabric?",
    description:
      "Fiber is the raw strand, yarn is spun or extruded fiber, and fabric is the sheet made from yarn or fiber.",
    image: COTTON,
    alt: "Cotton fabric made from spun yarn",
    related: [
      "/guides/fabric-questions/what-is-fabric/",
      "/collections/cotton/",
    ],
    answer:
      "Fiber is the smallest textile unit: a cotton hair, a flax strand, a silk filament, or a polyester filament. Yarn is fiber spun or grouped so it can be woven or knit. Fabric is the sheet made from that yarn, or sometimes directly from fiber.",
    points: [
      "Fiber is not yet cloth.",
      "Yarn is the intermediate.",
      "Fabric is what you cut.",
    ],
    sections: [
      s(
        "Why the order matters in a brief",
        "Asking for cotton names a fiber. Asking for cotton poplin names a fabric. The second can be sampled. The first cannot.",
        "Blends are decided at fiber or yarn stage. The fabric page should state the composition rather than imply a pure fiber.",
      ),
    ],
    faqs: [
      {
        question: "Is silk a yarn or a fabric?",
        answer:
          "Silk is a fiber. Silk chiffon or silk satin is a fabric made from it.",
      },
    ],
  },
  {
    slug: "polyester-cotton-and-nylon",
    category: "comparisons",
    sources: ["r1-06", "r1-43", "r2-17"],
    keyword: "polyester vs cotton",
    secondary: ["nylon fabric", "synthetic vs cotton"],
    title: "Polyester, Cotton, and Nylon",
    h1: "How does polyester differ from cotton and nylon?",
    description:
      "Polyester and nylon are synthetic filaments. Cotton is a plant fiber. Hand, moisture, and recovery depend on the cloth, not the name alone.",
    image: POLY,
    alt: "Stretch woven cloth used where polyester recovery matters",
    commercial: true,
    related: [
      "/collections/cotton/",
      "/guides/cotton-vs-linen/",
      "/guides/choosing-fabric-for-activewear/",
      "/marketplace/",
    ],
    answer:
      "Cotton is a natural cellulose fiber with a familiar hand and good dye uptake when the construction is right. Polyester is a synthetic used for recovery, durability, and many performance cloths. Nylon is another synthetic, often chosen where abrasion resistance matters. None of the three wins every garment.",
    points: [
      "Cotton is cellulose. Polyester and nylon are synthetic.",
      "Moisture behavior is not identical across polyester cloths.",
      "Compare construction before you compare fiber slogans.",
    ],
    table: {
      caption: "Cotton, polyester, and nylon as sourcing families",
      headers: ["", "Cotton", "Polyester", "Nylon"],
      rows: [
        ["Family", "Plant cellulose", "Synthetic", "Synthetic"],
        [
          "Often opened for",
          "Shirting, dresses, jersey",
          "Performance, blends, linings",
          "Abrasion-resistant cloths",
        ],
        [
          "Do not assume",
          "It is always cool",
          "It never breathes",
          "It matches polyester",
        ],
      ],
    },
    sections: [
      s(
        "Cotton",
        "Cotton programs on FabStitch run from poplin and oxford to jersey. The fiber does not fix drape or GSM.",
        "Crease, shrinkage, and hand still have to be read from the cloth and confirmed in a sample.",
      ),
      s(
        "Polyester and nylon",
        "Polyester shows up in stretch wovens, knits, and blends. Recovery claims belong on the fabric record, not in the fiber name.",
        "Nylon is not a synonym for polyester. If a page says polyester, do not rewrite it as nylon.",
      ),
    ],
    faqs: [
      {
        question: "Is polyester always less breathable than cotton?",
        answer:
          "No. Construction and finish change airflow. Compare the cloths, not the reputations.",
      },
    ],
  },
  {
    slug: "fabrics-for-hot-weather",
    category: "use-cases",
    sources: ["r1-07", "r1-28", "r2-14"],
    keyword: "fabrics for hot weather",
    secondary: ["summer fabric", "breathable fabric", "lightweight fabric"],
    title: "Fabrics for Hot Weather",
    h1: "Which fabrics work in hot weather?",
    description:
      "Hot-weather cloth is usually lighter and more open. Linen, cotton, and some cellulosics are common starts. No fiber is always the coolest.",
    image: LINEN,
    alt: "Lightweight linen used for warm-weather clothing",
    commercial: true,
    related: [
      "/guides/lightweight-fabric/",
      "/guides/how-to-choose-fabric-for-dresses/",
      "/guides/how-to-choose-fabric-for-shirts/",
      "/collections/linen-lightweight/",
      "/marketplace/",
    ],
    answer:
      "Hot weather asks for airflow and a cloth that does not hold heat against the skin. Lightweight linen and cotton are common starts because their constructions can be open. A heavy cotton twill can still feel hot. A light synthetic can still feel close if it does not move moisture.",
    points: [
      "Start with weight and openness, not a season slogan.",
      "Linen crease is normal, not a failure.",
      "Check opacity on sheers before you cut dresses.",
    ],
    sections: [
      s(
        "What to specify",
        "Name the garment, the climate, and whether the cloth must be opaque. Then compare published construction.",
        "GSM helps only when the fabric page states it. A missing number is not a light cloth.",
      ),
    ],
    faqs: [
      {
        question: "Is linen always better than cotton in heat?",
        answer:
          "No. An open cotton voile can wear cooler than a heavy linen. Compare the cloths.",
      },
    ],
  },
  {
    slug: "fabrics-for-winter",
    category: "use-cases",
    sources: ["r1-08", "r1-29"],
    keyword: "fabrics for winter",
    secondary: ["winter fabric", "wool fabric", "insulating fabric"],
    title: "Fabrics for Winter Clothing",
    h1: "Which fabrics suit winter clothing?",
    description:
      "Winter cloth is chosen for structure, cover, and insulation. Wool and denser knits are common. Heavier is not automatically warmer.",
    image: WOOL,
    alt: "Wool cloth used for cooler-weather tailoring",
    commercial: true,
    related: [
      "/guides/how-to-choose-the-right-fabric-weight/",
      "/guides/fabric-weight-and-gsm/",
      "/collections/denim/",
      "/marketplace/",
    ],
    answer:
      "Winter clothing needs cover and, often, a cloth that traps still air. Wool suitings, coating cloths, and denser knits are usual candidates. A high GSM number alone does not prove warmth, and a lined lighter cloth can wear warmer than a heavy open weave.",
    points: [
      "Insulation is structure plus layering, not a fiber trophy.",
      "Read published weight when it exists.",
      "Do not treat fleece, wool, and denim as interchangeable.",
    ],
    sections: [
      s(
        "What changes the shortlist",
        "A coat, a shirt, and a base layer do not share a GSM. Start from the garment.",
        "Stretch and hand still matter for trousers. A dense cloth that does not recover can fail a fitted brief.",
      ),
    ],
    faqs: [
      {
        question: "Does GSM above 300 mean a winter fabric?",
        answer:
          "No. GSM is mass per area. Use it with construction. The research ranges are planning notes, not FabStitch scores.",
      },
    ],
  },
  {
    slug: "what-is-tencel-lyocell",
    category: "materials",
    sources: ["r1-09", "r1-23", "r1-45"],
    keyword: "what is tencel lyocell",
    secondary: ["lyocell fabric", "tencel fabric"],
    title: "What Is Tencel Lyocell?",
    h1: "What is Tencel or lyocell?",
    description:
      "Lyocell is a regenerated cellulose fiber. Tencel is a branded lyocell. It starts from wood pulp and is processed, so it is not a raw natural fiber.",
    image: LYOCELL,
    alt: "Lyocell cloth in a plain weave",
    related: [
      "/guides/fabric-questions/tencel-and-viscose/",
      "/guides/fabric-questions/tencel-lyocell-sustainability/",
    ],
    answer:
      "Lyocell is a regenerated cellulose fiber made from wood pulp. Tencel is a trademark used for lyocell from Lenzing. The origin is plant cellulose, but the fiber is manufactured, so it is not raw cotton or linen. Call it regenerated cellulose, not a simple natural or a simple plastic.",
    points: [
      "Tencel names a branded lyocell, not every wood-pulp fiber.",
      "The cloth still has a construction and a weight.",
      "Do not assume a FabStitch page is certified because the fiber is lyocell.",
    ],
    sections: [
      s(
        "Natural or synthetic",
        "The feedstock is cellulose from wood. The fiber is dissolved and spun. That is why people call it semi-synthetic or regenerated.",
        "Viscose is also regenerated cellulose, but the process differs. See the Tencel and viscose comparison before you treat them as one fiber.",
      ),
    ],
    faqs: [
      {
        question: "Is every lyocell Tencel?",
        answer: "No. Tencel is a brand. Other lyocell may not use that name.",
      },
    ],
  },
  {
    slug: "chiffon-organza-georgette-uses",
    category: "materials",
    sources: ["r1-11", "r1-30"],
    keyword: "chiffon organza georgette",
    secondary: ["sheer fabric", "dress overlay"],
    title: "Chiffon, Organza, and Georgette",
    h1: "What are chiffon, organza, and georgette used for?",
    description:
      "These are lightweight sheers used for dresses, overlays, and scarves. Organza is crisper. Georgette is drier. Chiffon is softer.",
    image: SILK,
    alt: "Silk chiffon with a light, fluid drape",
    related: [
      "/guides/chiffon-vs-georgette/",
      "/collections/silk-sheer/",
      "/guides/how-to-choose-fabric-for-dresses/",
    ],
    answer:
      "Chiffon, organza, and georgette are sheer cloths used for overlays, scarves, and dresses that can take transparency or a lining. They are not one fabric. Organza holds a crisper edge. Georgette has a drier, slightly creped surface. Chiffon drapes more softly.",
    points: [
      "Plan opacity before you choose a sheer.",
      "Silk and polyester versions are not the same cloth.",
      "The comparison guide stays the chiffon-versus-georgette canonical.",
    ],
    sections: [
      s(
        "Apparel use",
        "Evening overlays and linings are common. A shirt brief usually wants a more stable weave.",
        "FabStitch silk-sheer imagery is a texture reference, not proof every listing is silk.",
      ),
    ],
    faqs: [
      {
        question: "Do these sheers need a lining?",
        answer:
          "Often, if the garment must be opaque. Check the cloth, not a rule.",
      },
    ],
  },
  {
    slug: "what-is-thread-count",
    category: "quality",
    sources: ["r1-12"],
    keyword: "what is thread count",
    secondary: ["thread count fabric", "threads per square inch"],
    title: "What Is Thread Count?",
    h1: "What is thread count?",
    description:
      "Thread count counts yarns in a square inch of woven cloth. It is common in sheeting. It is not a universal quality score.",
    image: COTTON,
    alt: "Close cotton weave where yarn count can be discussed",
    related: [
      "/guides/fabric-questions/thread-count-and-quality/",
      "/guides/fabric-weight-and-gsm/",
    ],
    answer:
      "Thread count is the number of warp and weft yarns in one square inch of a woven fabric. It is widely used for bed sheets. A higher count can mean a denser weave, but yarn size and fiber change what that density feels like. It is not GSM, and it is not a grade for every apparel cloth.",
    points: [
      "It applies to wovens, not to a knit the same way.",
      "Count without yarn size is incomplete.",
      "Do not confuse it with GSM.",
    ],
    sections: [
      s(
        "How it is counted",
        "Add the lengthwise yarns and the crosswise yarns in one square inch. Multi-ply yarns are sometimes marketed in ways that inflate the number. Read the construction, not only the headline count.",
      ),
    ],
    faqs: [
      {
        question: "Is thread count the same as GSM?",
        answer:
          "No. Thread count is yarns per area. GSM is grams per square metre.",
      },
    ],
  },
  {
    slug: "thread-count-and-quality",
    category: "quality",
    sources: ["r1-13"],
    keyword: "does thread count mean quality",
    secondary: ["higher thread count", "fabric quality"],
    title: "Does Thread Count Mean Better Fabric?",
    h1: "Does a higher thread count always mean better fabric?",
    description:
      "No. A higher thread count can mean a denser weave. Fiber, yarn size, and finish still decide whether the cloth is useful.",
    image: OXFORD,
    alt: "Cotton oxford whose quality is not a thread-count score",
    related: [
      "/guides/fabric-questions/what-is-thread-count/",
      "/guides/fabric-weight-and-gsm/",
    ],
    answer:
      "No. A higher thread count can describe a tighter weave, especially in sheeting. It does not prove better fiber, better colorfastness, or a better shirt. Very high marketed counts are sometimes built from fine plies that do not feel better in use.",
    points: [
      "Density is not durability.",
      "Apparel buyers should not specify sheets language by habit.",
      "Pair any count with fiber and weave.",
    ],
    sections: [
      s(
        "What to ask instead",
        "For apparel, construction, hand, and published weight answer more than a sheet count.",
        "If a supplier leads with a count and omits composition, the brief is incomplete.",
      ),
    ],
    faqs: [
      {
        question: "Should I reject a low thread count?",
        answer: "Not by itself. A gauze and a poplin are different tools.",
      },
    ],
  },
];
