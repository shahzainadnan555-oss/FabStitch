import type { FabricQuestionSection } from "./types";
import type { QuestionDraft } from "./drafts-a";

const COTTON = "/media/fabrics/cotton-poplin-primary.webp";
const LINEN = "/media/fabrics/european-flax-linen-primary.webp";
const DENIM = "/media/fabrics/lightweight-denim-primary.webp";
const LYOCELL = "/media/fabrics/tencel-plain-weave-primary.webp";
const VELVET = "/media/fabrics/crushed-velvet-primary.webp";
const SATIN = "/media/fabrics/silk-satin-primary.webp";
const CANVAS = "/media/fabrics/wool-hemp-canvas-primary.webp";

const s = (
  heading: string,
  ...paragraphs: string[]
): FabricQuestionSection => ({ heading, paragraphs });

export const FABRIC_QUESTION_DRAFTS_B: readonly QuestionDraft[] = [
  {
    slug: "how-to-identify-fabric",
    category: "identification",
    sources: ["r1-17", "r2-12"],
    keyword: "how to identify fabric",
    secondary: ["fabric identification", "fiber identification"],
    title: "How to Identify Fabric",
    h1: "How can you identify a fabric?",
    description:
      "Start with the label, then hand, construction, and published composition. A photo alone does not identify a fiber.",
    image: COTTON,
    alt: "Cotton cloth whose fiber still has to be read from the label",
    related: [
      "/guides/cotton-vs-linen/",
      "/guides/fabric-questions/what-is-a-fabric-burn-test/",
      "/fabrics/",
    ],
    answer:
      "Identify cloth in this order: any label or composition, then construction, then hand. Linen often looks slubbier and creases harder than cotton. Polyester can feel smoother and recover differently. Blends break simple tests. A photograph of an unknown swatch is not an identification.",
    points: [
      "Labels beat guesses.",
      "Construction is visible. Fiber often is not.",
      "Send unknowns to a lab when the decision is commercial.",
    ],
    sections: [
      s(
        "What you can see",
        "A weave, a knit, a pile, or a sheer is visible. That tells you the structure.",
        "It does not tell you whether a smooth filament is silk or polyester.",
      ),
    ],
    faqs: [
      {
        question: "Can I identify fabric from a photo?",
        answer:
          "Only the structure, and even that can be wrong. Composition needs a record or a test.",
      },
    ],
  },
  {
    slug: "what-is-a-fabric-burn-test",
    category: "identification",
    sources: ["r1-18"],
    keyword: "fabric burn test",
    secondary: ["fiber identification test"],
    title: "What Is a Fabric Burn Test?",
    h1: "What is a fabric burn test?",
    description:
      "A burn test heats fiber and reads the residue. It is a fire hazard. FabStitch does not publish a procedure. Use a textile lab for commercial identification.",
    image: CANVAS,
    alt: "Canvas cloth that should be identified without a home burn test",
    related: [
      "/guides/fabric-questions/how-to-identify-fabric/",
      "/guides/fabric-questions/fabric-identification-resources/",
    ],
    answer:
      "A burn test is a destructive check in which a fiber is burned so the flame, smell, and ash can be compared with known fibers. It can distinguish some pure fibers and fails on many blends. It is a fire risk. This page does not give steps, tools, or timings. For a buying decision, use the composition on the fabric record or a textile laboratory.",
    points: [
      "Do not burn cloth at home to answer a sourcing question.",
      "Blends confuse the result.",
      "A lab report beats a smell.",
    ],
    sections: [
      s(
        "Why the procedure is omitted",
        "Open flame, melted synthetics, and toxic fumes are real hazards. A how-to would be the wrong artifact.",
        "If a school or lab demonstrates the test, that is their controlled setting, not a marketplace instruction.",
      ),
    ],
    faqs: [
      {
        question: "Will FabStitch identify a swatch by burning it?",
        answer: "No. Read the published composition or ask for a lab test.",
      },
    ],
  },
  {
    slug: "fabric-identification-resources",
    category: "identification",
    sources: ["r1-19"],
    keyword: "fabric identification resources",
    secondary: ["textile testing"],
    title: "Resources for Identifying Fabric",
    h1: "What helps identify a fabric?",
    description:
      "Use the fabric record, construction guides, and a laboratory when composition is unknown. Do not treat a blog photo as a certificate.",
    image: "/media/fabrics/soft-oxford-cotton-primary.webp",
    alt: "Documented cotton cloth with a composition to read",
    related: [
      "/guides/fabric-questions/how-to-identify-fabric/",
      "/fabrics/",
      "/guides/",
    ],
    answer:
      "The useful sources are the cloth's own record, a construction guide, and a laboratory when the fiber is disputed. FabStitch fabric pages state composition when it is documented. They are not a field guide to unnamed swatches. Third-party blogs can teach vocabulary. They do not certify a roll.",
    points: [
      "Start with the listing.",
      "Use guides for weave and weight language.",
      "Use a lab for disputes.",
    ],
    sections: [
      s(
        "What not to trust",
        "A marketplace comment, a trend score, or a burn done in a kitchen is not a resource.",
        "If the research report estimated popularity, that number is not evidence of fiber content.",
      ),
    ],
    faqs: [
      {
        question: "Does FabStitch publish a fiber dictionary as a test method?",
        answer: "No. The guides explain terms. Testing stays with a lab.",
      },
    ],
  },
  {
    slug: "why-linen-wrinkles",
    category: "comparisons",
    sources: ["r1-20"],
    keyword: "why linen wrinkles",
    secondary: ["linen vs cotton crease"],
    title: "Why Linen Wrinkles More Than Cotton",
    h1: "Why does linen wrinkle more than cotton?",
    description:
      "Flax fibers are stiffer and less elastic than cotton, so linen creases and holds the crease. That is characteristic, not automatically a defect.",
    image: LINEN,
    alt: "Linen fabric with the crease linen is known for",
    related: ["/guides/cotton-vs-linen/", "/collections/linen-lightweight/"],
    answer:
      "Linen wrinkles more because flax is stiffer and less elastic than cotton. The fiber bends and stays bent. Cotton fibers flex more, so many cotton cloths shake out more easily. Finish and weave still change both. A resin-finished linen and a loose cotton gauze are not the textbook pair.",
    points: [
      "Crease is part of linen's look.",
      "Do not reject linen only for wrinkling if the brief wants that texture.",
      "The cotton-versus-linen guide remains the full comparison.",
    ],
    sections: [
      s(
        "What to tell a customer",
        "If the garment is meant to look pressed all day, linen is the wrong promise.",
        "If the garment is meant to look lived-in, the crease is the point. Sample it anyway.",
      ),
    ],
    faqs: [
      {
        question: "Can a finish stop linen wrinkling?",
        answer:
          "Some finishes reduce it. Read the fabric page. Do not assume a finish is present.",
      },
    ],
  },
  {
    slug: "linen-and-cotton-absorbency",
    category: "comparisons",
    sources: ["r1-21"],
    keyword: "linen absorbency",
    secondary: ["cotton absorbency", "moisture wicking"],
    title: "Is Linen More Absorbent Than Cotton?",
    h1: "Is linen more absorbent than cotton?",
    description:
      "Linen is widely treated as a fast-wicking cloth. Cotton holds moisture in the fiber. The actual cloth and finish decide what you feel.",
    image: LINEN,
    alt: "Linen cloth associated with quick moisture movement",
    related: [
      "/guides/cotton-vs-linen/",
      "/guides/fabric-questions/fabrics-and-sweat/",
    ],
    answer:
      "Linen is generally described as moving moisture quickly along the yarn, which is why it feels dry in heat. Cotton absorbs into the fiber and can feel wet longer. That is a tendency, not a lab result for every roll. Coatings and blends can reverse the story.",
    points: [
      "No percentage is claimed here.",
      "Finish can matter more than the fiber slogan.",
      "Sample for the climate you actually ship into.",
    ],
    sections: [
      s(
        "How to use the answer",
        "Put absorbency in the brief as a need, then compare documented cloths.",
        "Do not write 'linen is more absorbent' on a product that has not been tested.",
      ),
    ],
    faqs: [
      {
        question: "Does this mean linen is always cooler?",
        answer:
          "No. Weight and fit still decide. A heavy linen trouser is not a voile shirt.",
      },
    ],
  },
  {
    slug: "tencel-lyocell-sustainability",
    category: "sustainability",
    sources: ["r1-22"],
    keyword: "tencel sustainability",
    secondary: ["lyocell process", "closed loop lyocell"],
    title: "What Makes Lyocell Called Sustainable?",
    h1: "What makes Tencel or lyocell described as sustainable?",
    description:
      "Lyocell starts from wood pulp and is spun in a solvent process designed to recover that solvent. The claim still depends on sourcing and certification, not the name alone.",
    image: LYOCELL,
    alt: "Lyocell fabric whose process claims need a certificate",
    related: [
      "/guides/fabric-questions/what-is-tencel-lyocell/",
      "/guides/fabric-questions/fabric-eco-labels/",
    ],
    answer:
      "Lyocell is described as lower-impact because the cellulose comes from wood and the spinning process is designed to recover and reuse the solvent. That is a process claim, not a promise that every cloth labeled lyocell is certified, organic, or biodegradable in a landfill. Tencel is a brand of lyocell. Ask which standard, if any, is on the fabric record.",
    points: [
      "Wood origin is not the same as a finished-goods certificate.",
      "Solvent recovery is the process story. Verify it if you need to claim it.",
      "FabStitch does not add a certification the page does not show.",
    ],
    sections: [
      s(
        "What not to print on a hangtag",
        "Do not write sustainable because the fiber family is lyocell.",
        "Use the certificate name only when the document is for that cloth.",
      ),
    ],
    faqs: [
      {
        question: "Is lyocell automatically biodegradable?",
        answer:
          "Cellulose can biodegrade under the right conditions. A finish or blend can change that. Do not print the claim without evidence.",
      },
    ],
  },
  {
    slug: "what-is-organic-cotton",
    category: "sustainability",
    sources: ["r1-24", "r1-46", "r2-31"],
    keyword: "what is organic cotton",
    secondary: ["GOTS", "organic cotton vs conventional"],
    title: "What Is Organic Cotton?",
    h1: "What is organic cotton?",
    description:
      "Organic cotton is cotton grown under an organic farming standard. GOTS is one textile standard. A cotton page is not organic unless the record says so.",
    image: COTTON,
    alt: "Cotton fabric that is not organic unless the record says so",
    related: [
      "/collections/cotton/",
      "/guides/fabric-questions/fabric-eco-labels/",
      "/guides/fabric-questions/oeko-tex-standard-100/",
    ],
    answer:
      "Organic cotton means the fiber was grown to an organic agriculture standard, without the synthetic pesticides and fertilizers that standard prohibits. Conventional cotton is the rest. GOTS, the Global Organic Textile Standard, covers fiber content and processing when a product is certified to it. A cotton poplin on FabStitch is not organic, and not GOTS, unless that cloth's record says so.",
    points: [
      "Organic refers to farming of the fiber.",
      "GOTS is a separate textile standard.",
      "Do not infer either from the word cotton.",
    ],
    sections: [
      s(
        "What the difference is not",
        "Organic cotton is not automatically softer, stronger, or lower GSM.",
        "Hand still comes from yarn, weave, and finish.",
      ),
    ],
    faqs: [
      {
        question: "Does OEKO-TEX mean organic?",
        answer:
          "No. OEKO-TEX Standard 100 is a harmful-substance test, not an organic-farming standard.",
      },
    ],
  },
  {
    slug: "oeko-tex-standard-100",
    category: "sustainability",
    sources: ["r1-25", "r2-56"],
    keyword: "oeko tex standard 100",
    secondary: ["harmful substance testing", "textile certification"],
    title: "What OEKO-TEX Standard 100 Means",
    h1: "What does OEKO-TEX Standard 100 mean?",
    description:
      "OEKO-TEX Standard 100 means a textile was tested for harmful substances against that standard's limits. It is not an organic label and not a quality score.",
    image: COTTON,
    alt: "Cotton cloth that would need its own certificate for OEKO-TEX",
    related: [
      "/guides/fabric-questions/what-is-organic-cotton/",
      "/guides/fabric-questions/fabric-eco-labels/",
    ],
    answer:
      "OEKO-TEX Standard 100 means the tested textile met that standard's limits for harmful substances. It is a chemistry check on the article, not proof of organic farming, recycled content, or better drape. 'Chemical-free' is not the name of this label. If a print or dye claim matters, ask for the certificate that covers that cloth. FabStitch does not stamp the label onto pages that do not document it.",
    points: [
      "It is a substance test.",
      "It is not GOTS.",
      "A marketplace listing without the certificate is not certified.",
    ],
    sections: [
      s(
        "Prints and chemistry",
        "A chemical-free print claim needs a named standard or a test. Otherwise it is marketing.",
        "Standard 100 does not tell you the print method.",
      ),
    ],
    faqs: [
      {
        question: "If one cotton is certified, are all cottons?",
        answer:
          "No. Certification attaches to the tested article, not the fiber name.",
      },
    ],
  },
  {
    slug: "eco-friendly-fabrics",
    category: "sustainability",
    sources: ["r1-26", "r1-47", "r2-15"],
    keyword: "eco friendly fabrics",
    secondary: ["sustainable fabrics", "hemp fabric", "organic cotton"],
    title: "Which Fabrics Are Called Eco-Friendly?",
    h1: "Which fabrics are called eco-friendly?",
    description:
      "Organic cotton, lyocell, hemp, and some recycled fibers are often discussed. Each claim needs a scope. No fiber is impact-free.",
    image: LYOCELL,
    alt: "Lyocell cloth often discussed in lower-impact fiber conversations",
    related: [
      "/guides/fabric-questions/what-is-organic-cotton/",
      "/guides/fabric-questions/tencel-lyocell-sustainability/",
      "/guides/fabric-questions/fabric-eco-labels/",
    ],
    answer:
      "People usually mean organic cotton, lyocell, hemp, or recycled polyester when they say eco-friendly. Those are different claims: farming, solvent recovery, or recycled input. None is impact-free, and a blend can undo the story. FabStitch does not rank them. Read the composition and any certificate on the cloth.",
    points: [
      "Natural origin is not a full impact story.",
      "Hemp is not in the FabStitch catalog as a named family here.",
      "Do not print biodegradable without a condition and a source.",
    ],
    sections: [
      s(
        "How to compare without a winner",
        "Ask what is being reduced: pesticide use, solvent loss, or virgin polyester.",
        "Then ask whether this roll has the document, or only the fiber reputation.",
      ),
    ],
    faqs: [
      {
        question: "Is bamboo fabric the same claim as lyocell?",
        answer:
          "No. Bamboo is often viscose with a different marketing name. Read the process.",
      },
    ],
  },
  {
    slug: "fabric-eco-labels",
    category: "sustainability",
    sources: ["r1-27"],
    keyword: "fabric eco labels",
    secondary: ["GOTS", "OEKO-TEX"],
    title: "Fabric Eco-Labels Explained",
    h1: "What eco-labels exist for fabrics?",
    description:
      "GOTS covers organic textile processing. OEKO-TEX Standard 100 covers harmful substances. A label applies only when that cloth is certified.",
    image: COTTON,
    alt: "Cotton fabric before any eco-label is assumed",
    related: [
      "/guides/fabric-questions/what-is-organic-cotton/",
      "/guides/fabric-questions/oeko-tex-standard-100/",
    ],
    answer:
      "Two labels buyers confuse are GOTS and OEKO-TEX Standard 100. GOTS is about organic fiber content and processing. Standard 100 is about harmful substances in the tested textile. Other marks exist. This page does not list every private logo, because a logo without a scope is not an explanation. Use a label only when the certificate matches the cloth you are buying.",
    points: [
      "Read the scope, not the leaf icon.",
      "One certified lot does not cover the next lot.",
      "FabStitch will not invent a mark.",
    ],
    sections: [
      s(
        "Where to look",
        "The fabric page is the place a documented mark would appear.",
        "If it is absent, the honest line in a tech pack is absent, not implied.",
      ),
    ],
    faqs: [
      {
        question: "Are estimated trend scores a label?",
        answer:
          "No. The source report marked some scores as estimates. They are not certifications.",
      },
    ],
  },
  {
    slug: "what-is-satin",
    category: "materials",
    sources: ["r1-31"],
    keyword: "what is satin",
    secondary: ["satin weave", "silk satin"],
    title: "What Is Satin?",
    h1: "What is satin?",
    description:
      "Satin is a weave with floats that make a smooth face. It can be silk, polyester, or another fiber. It is not itself a fiber.",
    image: SATIN,
    alt: "Satin cloth with a smooth, light-catching face",
    related: ["/guides/silk-vs-satin/", "/guides/what-is-a-fabric-weave/"],
    answer:
      "Satin is a weave, not a fiber. Long floats on the face make it smooth and reflective. The fiber can be silk, polyester, or something else. Silk satin and polyester satin can look related and behave differently in care and heat.",
    points: [
      "Ask for the fiber, not only the word satin.",
      "The silk-versus-satin guide is the comparison canonical.",
      "Floats can snag. That is a construction trait.",
    ],
    sections: [
      s(
        "Use",
        "Linings, dresses, and trims are common. A workwear brief rarely starts here.",
        "If the page says satin and omits composition, you do not yet know the fiber.",
      ),
    ],
    faqs: [
      {
        question: "Is satin always silk?",
        answer: "No. Silk is a fiber. Satin is a weave.",
      },
    ],
  },
  {
    slug: "delicate-fabric-care",
    category: "care",
    sources: ["r1-33", "r1-50", "r2-34", "r2-49"],
    keyword: "delicate fabric care",
    secondary: ["silk care", "wool care", "how to iron velvet"],
    title: "Caring for Delicate Fabrics",
    h1: "How should delicate fabrics be cared for?",
    description:
      "Silk, wool, velvet, and sheers do not share one wash cycle. Follow the cloth or garment label. This page does not replace it.",
    image: VELVET,
    alt: "Velvet pile that should be cared for from its own label",
    related: [
      "/guides/silk-vs-satin/",
      "/collections/silk-sheer/",
      "/guides/fabric-questions/why-wool-care-labels-differ/",
    ],
    answer:
      "Care follows the label on that cloth or garment. Silk and wool often want less heat and less agitation than a cotton jersey. Velvet pile can crush under a hot iron. Organza and printed sheers can scorch or shine if ironed like poplin. There is no single delicate cycle that covers all of them.",
    points: [
      "Read the label before a home method.",
      "Pile, protein fibers, and sheers fail in different ways.",
      "A finish can change the rule. The label knows the finish.",
    ],
    sections: [
      s(
        "Ironing without a universal setting",
        "If two cloths look similar, their heat limits can still differ. Test is the wrong word if you mean scorching a corner in hope.",
        "When the label is missing, ask the supplier. Do not invent a temperature.",
      ),
    ],
    faqs: [
      {
        question: "Can I machine-wash all synthetics?",
        answer:
          "No. Some polyester sheers and coated cloths are not jersey. Use the label.",
      },
    ],
  },
  {
    slug: "personal-fabric-stash-marketplaces",
    category: "marketplace",
    sources: ["r1-34"],
    keyword: "fabric stash marketplace",
    secondary: ["fabric marketplace", "B2B fabric marketplace"],
    title: "Personal Fabric Stash Marketplaces",
    h1: "Is there a marketplace for personal fabric stashes?",
    description:
      "Peer resale boards are not the same as a B2B fabric marketplace. FabStitch is for discovering documented cloth, not trading leftover stashes.",
    image: COTTON,
    alt: "Folded cotton cloth in a documented fabric library",
    commercial: true,
    intent: "commercial_investigation",
    related: [
      "/marketplace/",
      "/guides/how-to-buy-fabric-online/",
      "/fabric-sourcing/",
    ],
    answer:
      "People looking to buy or sell leftover personal stashes usually use general resale platforms. That is a different job from sourcing production cloth. FabStitch is a B2B fabric marketplace for discovering documented fabrics and inquiring on them. It is not a peer-to-peer stash exchange, and it does not list private leftovers.",
    points: [
      "Stash trading and production sourcing are different intents.",
      "FabStitch listings are catalog cloths, not one-off remnants.",
      "Use the marketplace when you need a spec, not a leftover length.",
    ],
    sections: [
      s(
        "What to use FabStitch for",
        "Search by material and open a fabric page before you inquire.",
        "Do not expect a cart of unnamed scraps.",
      ),
    ],
    faqs: [
      {
        question: "Can I sell my personal stash on FabStitch?",
        answer: "No. The marketplace is not a classifieds board.",
      },
    ],
  },
  {
    slug: "what-is-fabric-moq",
    category: "marketplace",
    sources: ["r1-36"],
    keyword: "what is fabric moq",
    secondary: ["minimum order quantity", "wholesale fabric"],
    title: "What Is Fabric MOQ?",
    h1: "What is MOQ for fabric?",
    description:
      "MOQ is the supplier's minimum order. FabStitch does not publish one minimum for every cloth. Ask on the fabric you actually want.",
    image: DENIM,
    alt: "Denim cloth where order quantity is a supplier term",
    commercial: true,
    intent: "commercial",
    related: [
      "/wholesale-fabric/",
      "/marketplace/",
      "/guides/how-to-source-fabric-for-clothing-brands/",
    ],
    answer:
      "MOQ means minimum order quantity. A mill or supplier sets it for a cloth, a color, or a dye lot. It is not a law of fabric, and FabStitch does not print one number for the whole catalog. Negotiation is a commercial conversation about that cloth. This page will not invent a starting quantity or a discount.",
    points: [
      "MOQ is per supplier offer, not per fiber.",
      "Color minimums and order minimums can differ.",
      "Inquire with the fabric URL and the quantity you can actually use.",
    ],
    sections: [
      s(
        "How to ask",
        "Name the fabric page, the colour, and the metres you need.",
        "If the record is silent, silence is not a zero minimum.",
      ),
    ],
    faqs: [
      {
        question: "Does wholesale mean no minimum?",
        answer: "No. Wholesale often still has a minimum. Read the offer.",
      },
    ],
  },
  {
    slug: "requesting-fabric-samples",
    category: "marketplace",
    sources: ["r1-37"],
    keyword: "request fabric samples",
    secondary: ["fabric swatches", "B2B fabric sourcing"],
    title: "How to Request Fabric Samples",
    h1: "How do businesses request fabric samples?",
    description:
      "Request a sample against a specific fabric page, with end use and quantity. FabStitch does not run a separate overseas sample checkout.",
    image: COTTON,
    alt: "Cotton swatch context for a fabric inquiry",
    commercial: true,
    intent: "commercial",
    related: [
      "/marketplace/",
      "/guides/how-to-buy-fabric-online/",
      "/fabric-sourcing/",
    ],
    answer:
      "A useful sample request names the fabric URL, the end use, and the production quantity you are considering. That lets the other side send the cloth you mean. FabStitch inquiries start from the fabric page. There is no separate sample shop, and this page does not explain customs brokerage or a particular country's shipping rules.",
    points: [
      "One URL, one cloth.",
      "Say what the garment is.",
      "Do not ask for 'similar' if you need a spec.",
    ],
    sections: [
      s(
        "Overseas suppliers",
        "The research mentions overseas swatches. The principle is the same: identify the cloth first.",
        "Lead time and courier cost are not published here because they are not a catalog fact.",
      ),
    ],
    faqs: [
      {
        question: "Is a photo a sample?",
        answer:
          "No. A photo does not carry hand, weight, or colour in a reliable way.",
      },
    ],
  },
  {
    slug: "verify-fabric-quality",
    category: "quality",
    sources: ["r1-38", "r2-50"],
    keyword: "verify fabric quality",
    secondary: ["fabric supplier quality", "fabric testing"],
    title: "How to Verify Fabric Quality",
    h1: "How can a buyer verify fabric quality?",
    description:
      "Read composition and construction, compare like with like, and test when the risk is commercial. A catalog photo is not a test report.",
    image: "/media/fabrics/wool-cotton-twill-primary.webp",
    alt: "Twill cloth whose quality is in the construction, not a photo score",
    commercial: true,
    related: [
      "/guides/fabric-weight-and-gsm/",
      "/marketplace/",
      "/guides/fabric-questions/what-is-thread-count/",
    ],
    answer:
      "Verify quality from the record first: composition, construction, and any published weight. Then compare cloths of the same construction. A catalog photo can show colour and texture poorly. It cannot show shrinkage, crocking, or seam strength. When those matter, ask for a lab test on that lot. References and certificates count only when they name the standard and the cloth.",
    points: [
      "No star rating is a quality system here.",
      "Thread count is not an apparel grade.",
      "Missing data stays missing.",
    ],
    sections: [
      s(
        "From a pamphlet or screen",
        "Check whether GSM, width, and composition are written.",
        "If they are not, you cannot complete the check remotely. Ask, or sample.",
      ),
    ],
    faqs: [
      {
        question: "Does FabStitch score quality?",
        answer:
          "No. The page shows documented fields. It does not award a best-fabric mark.",
      },
    ],
  },
];
