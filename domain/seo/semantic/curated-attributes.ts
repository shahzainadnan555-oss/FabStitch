import type { SemanticFaq, SemanticPage, SemanticSection } from "./types";

/**
 * Hand-authored enrichment for high-intent semantic pages already in the
 * registry. Applied onto the existing canonical discover slug — never a new URL.
 */
type CuratedSemanticHub = {
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

const UNDERSTANDING_OPAQUE: CuratedSemanticHub = {
  slug: "understanding-opaque-fabric",
  title: "What Is Opaque Fabric? How to Check Before Buying",
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
      heading: "Thickness, Color, Finish and Lighting",
      body: [
        "Thickness helps when it comes from dense fibre packing, not from lofted open piles that still pass light. Deep dyes absorb and scatter light; pale dyes reveal the spaces between yarns. Prints can mask or exaggerate show-through depending on ground colour and print coverage.",
        "Finishes such as calendering, coating or bonding can raise opacity, while soft peaching or open brushing can change hand without fixing cover. Lighting matters in evaluation: a cloth that looks solid under soft indoor light can flash under store fluorescents or strong daylight. Wetting and body heat can also change how a pale knit or fine weave reads.",
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
      heading: "How Opacity Matters by Garment",
      body: [
        "Shirts and blouses: classic programmes usually want reliable cover in light colours at the chest and across seams. Prefer close plain weaves or oxfords with published mid-light GSM, and sample white or pastel before locking a pale story.",
        "Dresses and skirts: decide whether opacity is required in a single layer or whether lining is part of the design. Flowy sheers belong with lining plans; day dresses in pale colours need the same backlight check as shirtings.",
        "Trousers and work skirts: seat and thigh show-through is a common failure. Mid-weight twills, denser plains and many suiting cloths are starting points — still verify in the actual colour under seated stretch.",
        "Outerwear and uniforms: cover often travels with durability and colour fastness. Densely set wovens and work cloths are typical, but pale softshells and fine shirtings used as uniform layers still need opacity checks.",
        "Home textiles: curtains, sheers and upholstery use opacity language differently — privacy cloth versus decorative sheer. Match the brief to the end use rather than copying apparel rules wholesale.",
      ],
    },
    {
      heading: "Layering, Lining and Garment Construction",
      body: [
        "Lining, bonding, double-layering and strategic pattern mapping can supply cover when the face cloth is sheer or borderline. Plan lining early when the design needs movement from a sheer face cloth rather than discovering opacity failure in a fitting.",
        "Seams, pocket bags and stretch panels can create local show-through even when the body of the cloth looks solid. Evaluate the garment architecture, not only a flat swatch held at rest.",
      ],
    },
    {
      heading: "How to Assess Opacity Before You Buy",
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
      question: "Does GSM affect fabric opacity?",
      answer:
        "Higher GSM often correlates with more cover within the same construction family, but GSM alone does not guarantee opacity across unrelated weaves or knits.",
    },
    {
      question: "Is thicker fabric always more opaque?",
      answer:
        "No. A thicker but open construction can show more light than a thinner, densely set cloth. Compare construction and colour alongside thickness or GSM.",
    },
    {
      question: "What is the difference between opaque and sheer fabric?",
      answer:
        "Opaque cloth is meant to hide; sheer cloth transmits light and silhouette by design. Semi-sheer sits between and usually needs lining or layering for opacity-critical garments.",
    },
    {
      question: "Can lightweight fabric still be opaque?",
      answer:
        "Yes, when yarn cover and sett are tight and the colour is deep enough. Lightweight does not automatically mean sheer — and mid-weight does not automatically mean opaque.",
    },
    {
      question: "Does fabric color affect opacity?",
      answer:
        "Strongly. Pale and undyed colourways reveal yarn gaps that deeper dyes hide. Always evaluate opacity in the colour you will cut.",
    },
    {
      question: "Can lining make fabric more opaque?",
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

const UNDERSTANDING_FLOWY: CuratedSemanticHub = {
  slug: "understanding-flowy-fabric",
  title: "What Is Flowy Fabric? Drape, Weight & Uses",
  h1: "What Is Flowy Fabric?",
  metaDescription:
    "Flowy fabric drapes and moves readily for dresses, blouses and overlays. Learn how drape, weight, fibre and construction create fluid cloth — then compare FabStitch fabrics.",
  eyebrow: "Fabric drape",
  intro:
    "Flowy fabric is cloth that drapes and moves with little resistance, supporting fluid dresses, blouses, skirts and overlays. “Flowy” is a hand-and-drape description, not a fibre certificate — the same family can feel stiff in one construction and liquid in another.",
  imagePath: "/media/fabrics/silk-georgette-primary.webp",
  imageAlt:
    "Muted teal silk georgette with a fine crepe surface showing fluid drape",
  relatedPaths: [
    "/discover/understanding-opaque-fabric/",
    "/discover/sheer-fabric/",
    "/guides/fabric-weight-and-gsm/",
    "/guides/woven-vs-knit-fabrics/",
    "/fabrics/best-for/dresses/",
    "/fabrics/best-for/shirts/",
    "/collections/silk-sheer/",
    "/collections/linen-lightweight/",
    "/marketplace/",
    "/fabrics/",
    "/guides/",
  ],
  collectionSlugs: ["silk-sheer", "linen-lightweight"],
  bestForSlugs: ["dresses", "shirts"],
  ctaHeading: "Next step for flowy fabric",
  ctaBody:
    "Open a named FabStitch fabric, check published weight and construction against the silhouette, then inquire on that URL. This page does not invent a drape grade.",
  sections: [
    {
      heading: "What “Flowy” Means in Fabric",
      body: [
        "Buyers use flowy when cloth falls into soft folds, follows body motion and resists standing away from the silhouette. It sits opposite structured or crisp cloth that holds a line for tailoring.",
        "Because the word is sensory, two people can disagree on the same swatch. Anchor the brief in silhouette needs — fluid blouse, bias dress, soft skirt — then verify with published construction and a real sample.",
      ],
    },
    {
      heading: "Drape, Weight and Fibre Characteristics",
      body: [
        "Drape is how cloth hangs under its own weight. Lower bending stiffness and enough mass to pull folds usually read as flowy. Very light open cloths can float; denser soft cloths can still flow if the yarn and finish stay flexible.",
        "Fibre and yarn matter: filament silks, many rayons and lyocells, fine worsteds and soft cellulosic blends often support fluid movement. Stiff linen, canvas and heavy twills usually fight flow unless softened by wash or blend. Still treat fibre as a hint, not a guarantee.",
      ],
    },
    {
      heading: "Construction and Surface Feel",
      body: [
        "Crepes, chiffons, georgettes, soft satins, fluid jerseys and many washed cellulosics are common flowy starting points. Plain weaves with fine yarns and modest sett can also drape well when the finish stays soft.",
        "Surface feel — dry crepe, slippery filament, brushed peach — changes how the garment moves and how seams behave. A flowy face that snags or marks under production handling still fails a brief even if the drape looks right on a hanger.",
      ],
    },
    {
      heading: "Garment Applications for Flowy Cloth",
      body: [
        "Dresses and skirts: bias cuts, soft gathers and overlays rely on cloth that follows motion without fighting the pattern.",
        "Blouses and shirts: fluid fronts and sleeves need enough cover for the colour story; pale flowy cloths often need lining or opacity checks.",
        "Trousers and tailored jackets rarely want maximum flow unless the design is deliberately soft. Match the attribute to the silhouette before filtering the catalog.",
      ],
    },
    {
      heading: "How to Choose a Flowy Fabric",
      body: [
        "Start from the garment silhouette and opacity plan. Then compare published construction, weight and fibre notes on FabStitch fabric pages. Prefer cloths whose photography and construction match fluid movement rather than stiff hand.",
        "Sample for hang, recovery and seam behaviour. Flowy cloths can grow, mark or cling differently than crisp shirtings — write those checks into development before bulk.",
      ],
      keyPoints: [
        "Define silhouette and opacity before chasing the word “flowy”",
        "Compare similar constructions when reading GSM",
        "Sample hang and seam behaviour, not only a flat hand feel",
      ],
    },
    {
      heading: "What Buyers Should Evaluate",
      body: [
        "Check composition, construction, published weight, colourway and whether lining is part of the design. Note stretch for knits and wet opacity for pale wovens.",
        "Inquire with the fabric URL, intended garment, quantity and any lining plan so follow-up stays tied to the cloth you evaluated.",
      ],
    },
  ],
  faqs: [
    {
      question: "What does flowy fabric mean?",
      answer:
        "Flowy fabric drapes and moves readily with soft folds, supporting fluid garments. It describes hand and drape behaviour, not a certified fibre class.",
    },
    {
      question: "What makes a fabric flowy?",
      answer:
        "Lower bending stiffness, suitable yarn and finish, and a construction that hangs into folds. Fibre family helps, but construction and finish often decide the result.",
    },
    {
      question: "Does lightweight fabric always drape well?",
      answer:
        "No. Some lightweight cloths are crisp or sheer without fluid hang. Weight is only one input alongside yarn, weave or knit and finish.",
    },
    {
      question: "Which garments need flowy fabric?",
      answer:
        "Soft dresses, blouses, skirts and overlays often do. Tailored jackets and structured trousers usually need more body unless the design is intentionally fluid.",
    },
    {
      question: "How should buyers check flowy fabric before ordering?",
      answer:
        "Read published construction and weight, study hang in photography or samples, and confirm opacity and seam behaviour for the real colourway and silhouette.",
    },
  ],
};

const TWILL_VS_WOOL: CuratedSemanticHub = {
  slug: "twill-vs-wool",
  title: "Twill vs Wool Fabric: Key Differences",
  h1: "Twill vs Wool Fabric: Differences & Uses",
  metaDescription:
    "Twill is a weave structure; wool is a fibre family. Compare how each shapes hand, drape, GSM reading and garment choice before you shortlist FabStitch cloths.",
  eyebrow: "Fabric comparison",
  intro:
    "Twill vs wool is an uneven comparison until you separate structure from fibre. Twill is a weave pattern with a diagonal rib; wool is a protein fibre family that can be woven or knitted in many constructions — including twill. This page explains what each term actually contributes so a sourcing brief does not mix categories.",
  imagePath: "/media/fabrics/wool-cotton-twill-primary.webp",
  imageAlt:
    "Wool-cotton twill with a fine diagonal weave showing twill structure",
  relatedPaths: [
    "/discover/twill-fabric/",
    "/discover/wool-fabric/",
    "/guides/woven-vs-knit-fabrics/",
    "/guides/fabric-weight-and-gsm/",
    "/collections/tailoring/",
    "/fabrics/best-for/trousers/",
    "/fabrics/best-for/outerwear/",
    "/marketplace/",
    "/fabrics/",
    "/guides/",
  ],
  collectionSlugs: ["tailoring"],
  bestForSlugs: ["trousers", "outerwear"],
  ctaHeading: "Next step for twill vs wool",
  ctaBody:
    "Open named FabStitch fabrics and compare published construction and fibre content on the page — do not treat “twill” and “wool” as interchangeable filters.",
  sections: [
    {
      heading: "Twill and Wool Are Different Kinds of Label",
      body: [
        "Twill names how yarns interlace: a stepped float creates the familiar diagonal line. Cotton twill, polyester twill and wool twill can share the structure while behaving differently because the fibre and yarn differ.",
        "Wool names the fibre. Worsted wool suiting, wool flannel, wool jersey and wool coatings are all wool programmes with different constructions. Asking “twill or wool?” without a garment brief mixes a weave question with a fibre question.",
      ],
    },
    {
      heading: "What Twill Contributes",
      body: [
        "Twill weaves often pack yarn efficiently, show a diagonal surface and can feel smoother or more drapey than a plain weave at a similar sett. Mid-weight twills are common in trousers, workwear, chinos and many outer layers.",
        "Because twill is a structure, opacity, stretch and care still depend on fibre, yarn size, finish and colour. A pale fine cotton twill is not the same brief as a dense wool-blend twill for winter trousers.",
      ],
    },
    {
      heading: "What Wool Contributes",
      body: [
        "Wool fibres bring warmth, resilience and a characteristic hand that varies with micron, yarn and finish. Wool can be woven as plain, twill or other structures, or knitted for soft layers.",
        "Wool’s advantages only help when the construction matches the garment: a soft wool jersey does not replace a crisp wool suiting twill. Read fibre content and construction together on the fabric page.",
      ],
    },
    {
      heading: "Hand, Drape, Weight and GSM Limits",
      body: [
        "Hand and drape come from fibre, yarn, weave or knit and finish together. GSM helps compare similar constructions but does not convert a cotton twill into wool behaviour.",
        "When shortlisting, compare published weight inside one construction family, then check fibre content, stretch and care. Do not pick the higher GSM and assume it is “more wool-like.”",
      ],
    },
    {
      heading: "When the Brief Should Start with Twill",
      body: [
        "Start with twill when the silhouette needs a woven diagonal structure — trousers, chinos, many work cloths, some outer layers — and fibre is still open. Then choose cotton, wool, polyester or blends to meet climate, hand and care.",
      ],
    },
    {
      heading: "When the Brief Should Start with Wool",
      body: [
        "Start with wool when warmth, resilience or a wool hand is non-negotiable. Then choose construction: suiting twill, flannel, coating, knit and so on. Twill may still be the right weave inside that wool programme.",
      ],
    },
    {
      heading: "How a Business Should Source the Shortlist",
      body: [
        "Write the garment, climate, opacity and care needs first. Decide whether you are filtering by structure (twill) or fibre (wool), then open FabStitch fabric pages that publish both. Inquire on the URL that matches the cloth you sampled.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is twill the same as wool?",
      answer:
        "No. Twill is a weave structure; wool is a fibre family. Wool can be woven in twill, and twill can be made from many fibres.",
    },
    {
      question: "Can wool fabric be twill?",
      answer:
        "Yes. Many suiting and trouser wool programmes use twill weaves. Always confirm construction on the fabric page.",
    },
    {
      question: "Which is better for trousers: twill or wool?",
      answer:
        "Neither wins universally. Many trousers use twill structure; wool or wool blends help when warmth and resilience matter. Match fibre and construction to the brief.",
    },
    {
      question: "How should I compare GSM between twill and wool?",
      answer:
        "Compare GSM within similar constructions. A wool knit and a cotton twill at the same GSM are not interchangeable.",
    },
  ],
};

const LIGHTWEIGHT_COTTON: CuratedSemanticHub = {
  slug: "lightweight-cotton-fabric",
  title: "Lightweight Cotton Fabric for Apparel",
  h1: "Lightweight Cotton Fabric",
  metaDescription:
    "Lightweight cotton fabric suits shirts, dresses and soft layers when construction and GSM match the silhouette. Learn how to judge light cotton before you inquire on FabStitch.",
  eyebrow: "Material attribute",
  intro:
    "Lightweight cotton fabric is a useful filter only when “lightweight” is evidenced by construction and published weight — not by the fibre name alone. Cotton can be voile, poplin, oxford, twill or jersey; each reads differently at a similar GSM.",
  imagePath: "/media/fabrics/egyptian-cotton-poplin-primary.webp",
  imageAlt:
    "Fine Egyptian cotton poplin with a smooth plain weave suited to lightweight shirts",
  relatedPaths: [
    "/collections/cotton/",
    "/discover/understanding-opaque-fabric/",
    "/guides/fabric-weight-and-gsm/",
    "/guides/woven-vs-knit-fabrics/",
    "/fabrics/best-for/shirts/",
    "/fabrics/best-for/dresses/",
    "/discover/breathable-cotton-fabric/",
    "/marketplace/",
    "/fabrics/",
    "/wholesale-fabric/",
  ],
  collectionSlugs: ["cotton"],
  bestForSlugs: ["shirts", "dresses"],
  ctaHeading: "Next step for lightweight cotton",
  ctaBody:
    "Open a published cotton fabric on FabStitch, compare construction and GSM to your silhouette, then inquire on that URL.",
  sections: [
    {
      heading: "What Cotton Contributes as a Family",
      body: [
        "Cotton is a natural cellulosic staple widely used for shirts, dresses, trousers and soft layers. Comfort, dyeability and a broad construction range make it a default starting point for many apparel programmes.",
        "Cotton alone does not define weight or opacity. A lightweight cotton voile and a mid-weight cotton twill share a fibre family while serving different briefs.",
      ],
    },
    {
      heading: "What “Lightweight” Should Mean in a Fabric Brief",
      body: [
        "Lightweight should point to published mass (GSM), yarn count and how the cloth hangs on the body — not a marketing adjective. For shirts and dresses, buyers often look for cloth that feels easy in warm weather without collapsing seams or showing through unintentionally.",
        "Write the target GSM range or a reference cloth when you can. If the fabric page publishes weight, use it to compare like constructions.",
      ],
    },
    {
      heading: "How Lightweight Shows Up in Cotton Constructions",
      body: [
        "Common lightweight cotton directions include fine poplins, lawns, voiles, soft jersey and some seersuckers. Each trades cover, crispness and drape differently: voile may need lining for opacity; poplin can stay sharper; jersey moves with stretch.",
        "Heavier cotton oxfords, canvases and moleskins are usually the wrong answer when the brief truly needs light hang — even if they are still “cotton.”",
      ],
    },
    {
      heading: "Applications: Shirts, Dresses and Soft Layers",
      body: [
        "Shirts: fine poplins and oxfords are frequent lightweight starting points; check pale colour opacity early.",
        "Dresses and blouses: soft plains, lawns and light jerseys support fluid silhouettes when opacity and seam behaviour pass sampling.",
        "Trousers and uniforms: true lightweight cotton can fail abrasion or show-through — confirm end use before filtering only on weight.",
      ],
    },
    {
      heading: "Buyer Checks Before You Inquire",
      body: [
        "Confirm composition, construction, published GSM, width and care on the fabric page. Sample the colourway for opacity and hand. Note whether lining is planned.",
        "For bulk or wholesale programmes, include quantity, unit and garment end use in the inquiry so commercial follow-up stays attached to the cloth you evaluated.",
      ],
      keyPoints: [
        "Compare GSM inside the same construction family",
        "Test pale colourways for opacity",
        "Match weight to garment stress, not only climate",
      ],
    },
  ],
  faqs: [
    {
      question: "What is lightweight cotton fabric?",
      answer:
        "It is cotton cloth with a relatively low mass and an easy hand for shirts, dresses or soft layers — verified by construction and published weight, not by the word cotton alone.",
    },
    {
      question: "Is lightweight cotton always sheer?",
      answer:
        "No. Fine dense poplins can stay relatively covered, while open voiles may need lining. Always check the colourway against light.",
    },
    {
      question: "What GSM is lightweight for cotton?",
      answer:
        "There is no single universal cutoff. Compare published GSM within similar constructions and against a reference garment cloth for your programme.",
    },
    {
      question: "Which garments use lightweight cotton?",
      answer:
        "Shirts, blouses, dresses and soft layers are common. High-abrasion trousers or heavy uniforms often need denser cotton or other constructions.",
    },
    {
      question: "How do I buy lightweight cotton on FabStitch?",
      answer:
        "Open the cotton collection or a named cotton fabric, confirm construction and weight on the page, then submit an inquiry on that fabric URL.",
    },
  ],
};

const CURATED_BY_SLUG: Record<string, CuratedSemanticHub> = {
  [UNDERSTANDING_OPAQUE.slug]: UNDERSTANDING_OPAQUE,
  [UNDERSTANDING_FLOWY.slug]: UNDERSTANDING_FLOWY,
  [TWILL_VS_WOOL.slug]: TWILL_VS_WOOL,
  [LIGHTWEIGHT_COTTON.slug]: LIGHTWEIGHT_COTTON,
};

export function curatedAttributeHub(
  slug: string,
): CuratedSemanticHub | undefined {
  return CURATED_BY_SLUG[slug];
}

/** Apply curated copy onto a composed semantic page while keeping route identity. */
export function applyCuratedAttributeHub(page: SemanticPage): SemanticPage {
  const curated = curatedAttributeHub(page.slug);
  if (!curated) return page;

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
