import type { FabricQuestionSection } from "./types";
import type { QuestionDraft } from "./drafts-a";

const COTTON = "/media/fabrics/cotton-poplin-primary.webp";
const LINEN = "/media/fabrics/european-flax-linen-primary.webp";
const WOOL = "/media/fabrics/tropical-wool-super-110s-130s-primary.webp";
const DENIM = "/media/fabrics/lightweight-denim-primary.webp";
const POLY = "/media/fabrics/stretch-woven-compression-primary.webp";
const VISCOSE = "/media/fabrics/linen-viscose-primary.webp";
const JERSEY = "/media/fabrics/mercerized-cotton-jersey-primary.webp";
const GEORGETTE = "/media/fabrics/silk-georgette-primary.webp";
const SATIN = "/media/fabrics/silk-satin-primary.webp";
const CREPE = "/media/fabrics/crepe-de-chine-primary.webp";
const CANVAS = "/media/fabrics/wool-hemp-canvas-primary.webp";
const TWILL = "/media/fabrics/wool-cotton-twill-primary.webp";
const SILK = "/media/fabrics/silk-chiffon-primary.webp";

const s = (
  heading: string,
  ...paragraphs: string[]
): FabricQuestionSection => ({ heading, paragraphs });

export const FABRIC_QUESTION_DRAFTS_C: readonly QuestionDraft[] = [
  {
    slug: "sourcing-sustainable-technical-fabrics",
    category: "marketplace",
    sources: ["r1-39"],
    keyword: "sourcing technical fabrics",
    secondary: ["sustainable fabric sourcing", "B2B fabric marketplace"],
    title: "Sourcing Sustainable or Technical Cloth",
    h1: "How do buyers source sustainable or technical fabrics?",
    description:
      "Look for documented fiber, construction, and any real certificate. FabStitch does not run a separate technical-fabric portal.",
    image: POLY,
    alt: "Performance cloth where recovery has to be on the record",
    commercial: true,
    related: [
      "/marketplace/",
      "/guides/fabric-questions/eco-friendly-fabrics/",
      "/guides/choosing-fabric-for-activewear/",
    ],
    answer:
      "Sustainable and technical are not marketplace departments by themselves. A buyer still opens a cloth and reads composition, construction, and any certificate the page actually shows. Performance cloth needs a recovery or finish note. A lyocell cloth needs the fiber stated. FabStitch does not operate a second site for those words.",
    points: [
      "Filter by what is written.",
      "Do not trust a portal slogan.",
      "Inquire on one fabric URL.",
    ],
    sections: [
      s(
        "What technical means here",
        "It means the record supports the job: stretch, coating, or density.",
        "If the field is empty, the cloth is not technical by reputation.",
      ),
    ],
    faqs: [
      {
        question: "Does FabStitch certify sustainable mills?",
        answer: "No. Only a certificate on that cloth counts.",
      },
    ],
  },
  {
    slug: "upholstery-and-bedding-fabrics",
    category: "use-cases",
    sources: ["r1-49", "r2-29"],
    keyword: "upholstery and bedding fabrics",
    secondary: ["sofa fabric", "bedding cloth"],
    title: "Upholstery and Bedding Fabrics",
    h1: "Which fabrics suit upholstery or bedding?",
    description:
      "Upholstery wants abrasion resistance. Bedding wants next-to-skin hand. They are not one cloth, and car seats are a different specification.",
    image: CANVAS,
    alt: "Heavier woven cloth considered for upholstery rather than a shirt",
    related: [
      "/collections/",
      "/guides/fabric-weight-and-gsm/",
      "/guides/fabric-questions/what-is-thread-count/",
    ],
    answer:
      "Upholstery cloth is chosen for rub, seam hold, and light. Bedding is chosen for hand against skin and wash. A sofa cloth is often a bad sheet. Car-seat cloth adds flammability and wear rules this page does not certify. FabStitch home textiles, where documented, are still read cloth by cloth.",
    points: [
      "Do not use apparel GSM as an upholstery grade.",
      "Thread count is a sheeting habit, not a sofa grade.",
      "No automotive approval is stated here.",
    ],
    sections: [
      s(
        "How to separate the briefs",
        "Write abrasion for seating and hand for bedding.",
        "If you need a car interior, that is a different standard from a sofa cover.",
      ),
    ],
    faqs: [
      {
        question: "Is heavier always better for a sofa?",
        answer:
          "Not always. Backing, weave, and finish matter. Weight is only one field.",
      },
    ],
  },
  {
    slug: "why-wool-care-labels-differ",
    category: "care",
    sources: ["r2-02"],
    keyword: "wool care labels",
    secondary: ["merino ironing", "garment care label"],
    title: "Why Wool Care Labels Differ",
    h1: "Why can two wool sweaters have different ironing labels?",
    description:
      "The same fiber name can hide a different knit, finish, or blend. Follow each garment label. Do not average them.",
    image: WOOL,
    alt: "Wool cloth whose care depends on more than the fiber name",
    related: ["/guides/fabric-questions/delicate-fabric-care/"],
    answer:
      "Two labels can both say merino and still differ because the knit, the finish, and any undeclared blend percentage change heat and wash. The fiber name is not the care instruction. Use the label sewn into that garment. A fabric page that does not state care cannot fill the gap.",
    points: [
      "Fiber is not a wash cycle.",
      "Finish is often the hidden variable.",
      "Do not copy one sweater's iron onto another.",
    ],
    sections: [
      s(
        "What to check",
        "Look for blend lines and the iron symbol, not only the word wool.",
        "If you are sourcing the cloth, ask for care before you print a label.",
      ),
    ],
    faqs: [
      {
        question: "Is 100% merino always dry-clean?",
        answer:
          "No. Some knits are written for gentle wash. The label decides.",
      },
    ],
  },
  {
    slug: "softening-cotton",
    category: "care",
    sources: ["r2-03"],
    keyword: "soften cotton fabric",
    secondary: ["cotton hand", "cotton finish"],
    title: "How Cotton Hand Softens",
    h1: "How can cotton be softened?",
    description:
      "Cotton hand comes from yarn, finish, and washing. There is no sure-fire home recipe that is safe for every cotton.",
    image: JERSEY,
    alt: "Cotton jersey whose soft hand comes from knit and finish",
    related: [
      "/collections/cotton/",
      "/guides/fabric-questions/new-and-worn-fabric/",
    ],
    answer:
      "Cotton softens when the finish and the wash relax the yarns. A jersey is built softer than a poplin. Enzyme finishes and garment wash do this at the mill. A home softener is not a sure method, and it can coat cloth or affect colour. If you need a soft hand, specify it and sample it.",
    points: [
      "Choose the construction first.",
      "Do not promise a home remedy.",
      "Worn cotton feels different from greige cotton.",
    ],
    sections: [
      s(
        "What not to claim",
        "There is no single soak that makes every cotton silky.",
        "If the research called a method sure-fire, that is not a FabStitch instruction.",
      ),
    ],
    faqs: [
      {
        question: "Will washing always soften cotton?",
        answer: "Often the hand changes. It can also shrink or fade. Sample.",
      },
    ],
  },
  {
    slug: "faded-lines-on-jeans",
    category: "care",
    sources: ["r2-04"],
    keyword: "faded lines on jeans",
    secondary: ["denim wash", "indigo abrasion"],
    title: "Faded Lines on Jeans",
    h1: "What causes faded lines on jeans after washing?",
    description:
      "Indigo sits near the yarn surface. Creases and abrasion lose colour first. A wash line is wear, not a GSM fault.",
    image: DENIM,
    alt: "Denim twill where surface indigo can wear at creases",
    related: [
      "/collections/denim/",
      "/guides/fabric-questions/why-fabric-color-fades/",
    ],
    answer:
      "Jeans fade along folds because indigo is mostly on the outside of the yarn. Washing and wear remove it first where the cloth rubs. Whiskers and seam lines are that abrasion, not a proof the denim was thin. A rigid denim and a washed denim will not age the same way.",
    points: [
      "Fade follows crease and rub.",
      "It is not a thread-count issue.",
      "Specify wash if the look must stay even.",
    ],
    sections: [
      s(
        "What a buyer should write",
        "Say whether contrast fade is wanted.",
        "Do not call a crease line a defect unless the spec forbids it.",
      ),
    ],
    faqs: [
      {
        question: "Does a gentle wash stop it?",
        answer: "It slows abrasion. It does not freeze indigo in place.",
      },
    ],
  },
  {
    slug: "thread-quality-in-garments",
    category: "quality",
    sources: ["r2-07"],
    keyword: "garment thread quality",
    secondary: ["sewing thread", "seam quality"],
    title: "Judging Thread in a Garment",
    h1: "How can thread quality in a garment be judged?",
    description:
      "Look at the seam, the fiber of the thread, and whether it matches the cloth. Thread count of the fabric is a different number.",
    image: TWILL,
    alt: "Woven cloth where seam thread is separate from the cloth yarns",
    related: [
      "/guides/fabric-questions/what-is-thread-count/",
      "/guides/fabric-questions/sewing-pucker/",
    ],
    answer:
      "Sewing thread is not the fabric's thread count. Judge it by whether the seam holds, whether the thread fiber suits the cloth, and whether the stitch skips or shines. Cotton thread on a stretch cloth can snap. A glossy polyester thread can show on a matte weave. The garment spec should name the thread if it matters.",
    points: [
      "Do not use sheet thread-count language.",
      "Match stretch with the thread.",
      "Skipped stitches are a sewing problem, not a GSM problem.",
    ],
    sections: [
      s(
        "What you cannot see",
        "Tensile strength is a test, not a glance.",
        "If the order is commercial, ask for the thread ticket rather than guessing from a photo.",
      ),
    ],
    faqs: [
      {
        question: "Is thicker thread always better?",
        answer: "No. It can perforate a light cloth.",
      },
    ],
  },
  {
    slug: "what-is-cork-fabric",
    category: "materials",
    sources: ["r2-08"],
    keyword: "what is cork fabric",
    secondary: ["cork textile"],
    title: "What Is Cork Fabric?",
    h1: "What is cork fabric?",
    description:
      "Cork fabric is cork sheet on a backing, used for small goods more than for draped apparel. FabStitch does not list it as a catalog family.",
    image: CANVAS,
    alt: "Woven canvas, not a substitute photo of cork",
    related: ["/guides/fabric-questions/what-is-fabric/", "/fabrics/"],
    answer:
      "Cork fabric is a thin cork layer bonded to a textile or other backing. It is used for bags and small accessories more often than for flowing garments. It does not drape like poplin, and it can crack if folded hard. FabStitch does not present cork as one of its documented apparel families. The image on this page is a woven cloth, not cork.",
    points: [
      "It is a laminate, not a weave of cork fiber.",
      "Do not treat it as cotton.",
      "No cork SKU is implied.",
    ],
    sections: [
      s(
        "Handling",
        "Score and fold only as the maker's note allows.",
        "Needles and glues are product instructions, not something this page invents.",
      ),
    ],
    faqs: [
      {
        question: "Can I find cork on the marketplace?",
        answer:
          "Not as a named FabStitch family. Search only for cloth the catalog actually lists.",
      },
    ],
  },
  {
    slug: "outdoor-upholstery-for-apparel",
    category: "use-cases",
    sources: ["r2-09"],
    keyword: "outdoor upholstery for apparel",
    secondary: ["solution dyed fabric", "apparel safety"],
    title: "Outdoor Upholstery Cloth for Apparel",
    h1: "Can outdoor upholstery fabric be used for clothes?",
    description:
      "Outdoor upholstery is built for weather and rub, often with coatings that reduce breathability. It is not automatically suitable for apparel.",
    image: CANVAS,
    alt: "Heavy woven cloth closer to upholstery than to a shirt",
    related: [
      "/guides/fabric-questions/upholstery-and-bedding-fabrics/",
      "/guides/fabric-questions/skin-comfort-and-fabric/",
    ],
    answer:
      "Usually it is a poor apparel choice. Outdoor upholstery is specified for sun, rain, and abrasion. Coatings and solution dyes that help a cushion can trap heat or feel harsh on skin. 'Safe' is the wrong word unless a wearer standard is actually met. This page does not certify any cloth for skin contact.",
    points: [
      "Weather resistance is not breathability.",
      "Read the finish.",
      "Do not cut a cushion cloth into a shirt on a slogan.",
    ],
    sections: [
      s(
        "If you still sample it",
        "Check stiffness, smell, and skin feel on a swatch.",
        "Absence of a warning is not an approval.",
      ),
    ],
    faqs: [
      {
        question: "Is solution-dyed acrylic a shirt fabric?",
        answer:
          "It is an outdoor-furniture fiber story. Apparel needs its own brief.",
      },
    ],
  },
  {
    slug: "how-to-choose-fabric",
    category: "use-cases",
    sources: ["r2-10"],
    keyword: "how to choose fabric",
    secondary: ["fabric selection", "fabric sourcing brief"],
    title: "How to Choose a Fabric",
    h1: "How do you choose a fabric?",
    description:
      "Choose from the garment, then construction, then fiber. Confidence comes from a written brief, not from guessing a colour story.",
    image: COTTON,
    alt: "Cotton poplin as a starting cloth for a written brief",
    commercial: true,
    related: [
      "/guides/how-to-choose-fabric-for-shirts/",
      "/guides/how-to-choose-fabric-for-dresses/",
      "/guides/fabric-weight-and-gsm/",
      "/marketplace/",
    ],
    answer:
      "Write the garment first: shirt, dress, trouser, or coat. Then choose construction, then fiber, then weight if it is published. Colour and print come after the cloth can do the job. That order is what makes selection calmer than staring at a wall of folds.",
    points: [
      "Garment before fiber.",
      "Compare two cloths of one construction.",
      "Open the marketplace with that brief, not with a mood word.",
    ],
    sections: [
      s(
        "What this is not",
        "It is not a quilting colour workshop.",
        "Pattern confidence is irrelevant if the weave cannot hold the seam.",
      ),
    ],
    faqs: [
      {
        question: "Should I start on the marketplace?",
        answer:
          "Yes, once the brief exists. Browse is not a substitute for the brief.",
      },
    ],
  },
  {
    slug: "what-is-aida-cloth",
    category: "materials",
    sources: ["r2-11"],
    keyword: "what is aida cloth",
    secondary: ["counted thread cloth", "cross stitch fabric"],
    title: "What Is Aida Cloth?",
    h1: "What is Aida cloth?",
    description:
      "Aida is an evenweave grid used for counted cross-stitch. It is not an apparel fabric in the FabStitch catalog.",
    image: COTTON,
    alt: "Woven cotton, shown only as a weave reference and not as Aida",
    related: [
      "/guides/what-is-a-fabric-weave/",
      "/guides/fabric-questions/what-is-fabric/",
    ],
    answer:
      "Aida is a stiff, open, evenweave cotton cloth with a visible grid for cross-stitch. Stitchers sometimes remove waste canvas or stabilizer. Aida itself is usually the ground that stays. This page does not give a removal procedure, because that depends on the product and can damage the work. FabStitch does not sell Aida as apparel cloth. The photo is cotton weave, not Aida.",
    points: [
      "It is a counted-thread ground.",
      "It is not shirting.",
      "Follow the kit, not a generic tip.",
    ],
    sections: [
      s(
        "Why it is here",
        "The research asked about removing it. The textile fact is what the cloth is.",
        "Apparel sourcing should not land on this page except to avoid the confusion.",
      ),
    ],
    faqs: [
      {
        question: "Is Aida the same as canvas?",
        answer:
          "No. Canvas is a heavier plain weave. Aida is an embroidery grid.",
      },
    ],
  },
  {
    slug: "everyday-laundry-mistakes",
    category: "care",
    sources: ["r2-16", "r2-27"],
    keyword: "fabric laundry mistakes",
    secondary: ["garment care", "washing fabric"],
    title: "Everyday Laundry Mistakes",
    h1: "What laundry mistakes damage fabric?",
    description:
      "Heat, mixing unfinished dyes, and ignoring the label cause most everyday damage. Care is per cloth, not one cycle for the wardrobe.",
    image: JERSEY,
    alt: "Jersey cloth that still needs its own wash instruction",
    related: [
      "/guides/fabric-questions/delicate-fabric-care/",
      "/guides/fabric-questions/why-fabric-color-fades/",
      "/guides/fabric-questions/storing-clothes/",
    ],
    answer:
      "The common mistakes are hot water on a cloth that was not written for it, drying heat on elastane, and washing a fresh dye with a light ground. Overloading hides those errors until the garment twists. Read each label. Essential care is that habit, not a list of products.",
    points: [
      "Heat is the usual damage.",
      "New darks can crock.",
      "One cycle does not fit silk and jersey.",
    ],
    sections: [
      s(
        "What this page will not do",
        "It will not name a detergent as safe for every fiber.",
        "If the label and this page disagree, follow the label.",
      ),
    ],
    faqs: [
      {
        question: "Should linens and jerseys share a wash?",
        answer: "Only if both labels allow it. Assume they do not.",
      },
    ],
  },
  {
    slug: "chiffon-georgette-and-satin",
    category: "comparisons",
    sources: ["r2-18"],
    keyword: "chiffon vs georgette vs satin",
    secondary: ["sheer fabrics", "satin weave"],
    title: "Chiffon, Georgette, and Satin",
    h1: "How do chiffon, georgette, and satin differ?",
    description:
      "Chiffon and georgette are sheers with different hands. Satin is a smooth weave. Fiber is a separate question.",
    image: GEORGETTE,
    alt: "Georgette surface, drier and sheerer than a satin face",
    table: {
      caption: "Chiffon, georgette, and satin",
      headers: ["", "Chiffon", "Georgette", "Satin"],
      rows: [
        [
          "What it is",
          "Soft sheer",
          "Drier, crisper sheer",
          "Float weave with a smooth face",
        ],
        [
          "Usual job",
          "Overlays, scarves",
          "Dresses, overlays",
          "Linings, dresses, trim",
        ],
        ["Do not assume", "It is silk", "It matches chiffon", "It is a fiber"],
      ],
    },
    related: [
      "/guides/chiffon-vs-georgette/",
      "/guides/silk-vs-satin/",
      "/guides/fabric-questions/what-is-satin/",
    ],
    answer:
      "Chiffon is a soft sheer. Georgette is a sheer with a drier, more textured hand. Satin is not a sheer by definition. It is a weave with floats and a smooth face. All three can be silk or polyester. The existing chiffon-versus-georgette guide remains the two-way comparison. This page only separates the three names.",
    points: [
      "Satin is a weave.",
      "The two sheers are not interchangeable.",
      "Check fiber on the page.",
    ],
    sections: [
      s(
        "When the names get mixed",
        "A shiny polyester is often called satin in retail.",
        "If you need georgette, a satin page is the wrong cloth.",
      ),
    ],
    faqs: [
      {
        question: "Which is more formal?",
        answer: "None, by rule. The garment and the fiber decide.",
      },
    ],
  },
  {
    slug: "voile-and-cotton",
    category: "comparisons",
    sources: ["r2-19"],
    keyword: "voile vs cotton",
    secondary: ["cotton voile", "plain weave"],
    title: "Voile and Cotton",
    h1: "What is the difference between voile and cotton?",
    description:
      "Voile is usually a lightweight plain-weave cloth. Cotton is a fiber. Cotton voile is both. They are not opposing materials.",
    image: COTTON,
    alt: "Fine cotton weave of the kind voile belongs to",
    related: [
      "/collections/cotton/",
      "/guides/what-is-a-fabric-weave/",
      "/guides/lightweight-fabric/",
    ],
    answer:
      "The question treats voile and cotton as rivals. They are not. Cotton is a fiber. Voile is a light, plain weave, very often made of cotton. Cotton voile is cotton. A cotton poplin is also cotton, and it is not voile. Compare construction when both cloths are cotton.",
    points: [
      "Fiber versus weave.",
      "Voile is not a separate plant.",
      "Opacity is the usual reason a voile fails a shirt.",
    ],
    sections: [
      s(
        "How to specify",
        "Say cotton voile or cotton poplin.",
        "Saying cotton alone leaves the weave open.",
      ),
    ],
    faqs: [
      {
        question: "Is all voile cotton?",
        answer: "No. Voile can be other fibers. Read the composition.",
      },
    ],
  },
  {
    slug: "fabric-stain-care",
    category: "care",
    sources: ["r2-20", "r2-45", "r2-57"],
    keyword: "fabric stain care",
    secondary: ["oil stain on fabric", "wine stain", "makeup stain"],
    title: "Fabric Stains: Oil, Wine, and Makeup",
    h1: "How should fabric stains be approached?",
    description:
      "Blot, then follow the care label. Oil, wine, and makeup are different soils. No home recipe is safe for every cloth.",
    image: COTTON,
    alt: "Cotton cloth where a stain still needs the care label",
    related: [
      "/guides/fabric-questions/everyday-laundry-mistakes/",
      "/guides/fabric-questions/delicate-fabric-care/",
    ],
    answer:
      "Act on the label, not on a viral recipe. Blot liquids. Do not rub a sheer or a pile. Oil, wine, and lipstick sit differently, and a solvent that lifts one can dissolve a finish or a print. There is no fabric that is universally easy to clean, so this page will not rank fibers for makeup.",
    points: [
      "Label first.",
      "No universal solvent.",
      "Test is still a risk on a one-off garment.",
    ],
    sections: [
      s(
        "What a buyer can specify",
        "A stain-resistant finish must be written on the cloth.",
        "If it is not written, do not sell the garment as stain-proof.",
      ),
    ],
    faqs: [
      {
        question: "Which fabric hides wine?",
        answer: "Darker grounds hide colour. That is optics, not cleanability.",
      },
    ],
  },
  {
    slug: "fabrics-and-sweat",
    category: "use-cases",
    sources: ["r2-21"],
    keyword: "fabrics that do not trap sweat",
    secondary: ["breathable fabric", "moisture wicking"],
    title: "Fabrics and Sweat",
    h1: "Which fabrics do not trap sweat?",
    description:
      "Open cloths and some performance knits move moisture differently. No fiber guarantees dry skin. Compare construction.",
    image: LINEN,
    alt: "Open linen cloth associated with airflow",
    commercial: true,
    related: [
      "/guides/fabric-questions/linen-and-cotton-absorbency/",
      "/guides/choosing-fabric-for-activewear/",
      "/guides/lightweight-fabric/",
      "/marketplace/",
    ],
    answer:
      "Cloth traps sweat when it blocks airflow or holds moisture against the skin. Open linen and cotton can feel drier in heat. Some polyester knits are built to move moisture along the face. A coated cloth or a tight synthetic can do the opposite. There is no fiber that never traps sweat.",
    points: [
      "Airflow is construction.",
      "Wicking is a finish-and-knit story.",
      "The activewear guide covers sport briefs.",
    ],
    sections: [
      s(
        "How to write it",
        "Say moisture management or open weave.",
        "Do not write 'does not trap sweat' as a guarantee.",
      ),
    ],
    faqs: [
      {
        question: "Is cotton bad for sweat?",
        answer:
          "Cotton holds water. In a light weave that can still be comfortable. In a dense knit it can feel wet.",
      },
    ],
  },
  {
    slug: "identifying-georgette-and-satin",
    category: "identification",
    sources: ["r2-22"],
    keyword: "identify georgette and satin",
    secondary: ["georgette fabric", "satin weave"],
    title: "Identifying Georgette and Satin",
    h1: "How do you tell georgette from satin?",
    description:
      "Georgette is a drier sheer. Satin has a smooth, light-catching face. The fiber still has to be read from the label.",
    image: SATIN,
    alt: "Satin face with a smooth reflection georgette does not have",
    related: [
      "/guides/fabric-questions/chiffon-georgette-and-satin/",
      "/guides/fabric-questions/how-to-identify-fabric/",
      "/guides/silk-vs-satin/",
    ],
    answer:
      "Georgette looks matte and slightly crisp, and you can often see through it. Satin reflects light on one face because of the floats. If both faces look the same and the cloth is sheer, it is not satin. This still does not tell you silk from polyester.",
    points: [
      "Sheer and matte points to georgette.",
      "One shiny face points to satin.",
      "Composition is a label problem.",
    ],
    sections: [
      s(
        "Online orders",
        "Ask for the construction name on the page.",
        "A thumbnail of a shine is not enough.",
      ),
    ],
    faqs: [
      {
        question: "Can chiffon be mistaken for georgette?",
        answer: "Yes. Chiffon is softer. The comparison page separates them.",
      },
    ],
  },
  {
    slug: "buying-fabric-by-length",
    category: "marketplace",
    sources: ["r2-23"],
    keyword: "buying fabric by the metre",
    secondary: ["fabric yardage", "fabric width"],
    title: "Buying Fabric by Metre or Yard",
    h1: "How do you buy fabric by length?",
    description:
      "Order length and read width separately. One yard is 0.9144 metres. Yield still depends on the pattern and the cloth width.",
    image: COTTON,
    alt: "Cotton cloth sold by length only after width is known",
    commercial: true,
    related: [
      "/guides/understanding-fabric-width/",
      "/marketplace/",
      "/guides/how-to-buy-fabric-online/",
    ],
    answer:
      "Buy a length, and read the width on the fabric page. A metre of 110 cm cloth is not a metre of 150 cm cloth in a pattern. One yard equals 0.9144 metres. That conversion does not calculate yield. The width guide is the place for usable width. FabStitch does not invent a price per metre.",
    points: [
      "Length is not width.",
      "State the unit in the inquiry.",
      "Pattern yield is your calculation.",
    ],
    sections: [
      s(
        "What to send",
        "Fabric URL, width you saw, and metres or yards required.",
        "If width is unpublished, ask before you multiply.",
      ),
    ],
    faqs: [
      {
        question: "Is a metre always enough for a shirt?",
        answer: "No. It depends on width, size, and pattern.",
      },
    ],
  },
  {
    slug: "choosing-woven-wool-and-cotton",
    category: "use-cases",
    sources: ["r2-25"],
    keyword: "choosing woven wool and cotton",
    secondary: ["wool suiting", "cotton weave"],
    title: "Choosing Woven Wool or Cotton",
    h1: "How do you choose a woven wool or cotton?",
    description:
      "Pick the garment climate first. Wool wovens often structure tailoring. Cotton wovens cover shirts through denser twills. Weave names stay on the weave guide.",
    image: TWILL,
    alt: "Wool-cotton twill as a woven selection example",
    commercial: true,
    related: [
      "/guides/what-is-a-fabric-weave/",
      "/guides/woven-vs-knit-fabrics/",
      "/collections/cotton/",
      "/marketplace/",
    ],
    answer:
      "Choose wool when the brief is structure, crease recovery, or cooler-climate tailoring, and the cloth's weight supports it. Choose cotton when you need a shirt, a dress, or a trouser that washes in a familiar way. Both are families. A tropical wool and a melton are not one choice. A poplin and a canvas are not one choice.",
    points: [
      "Climate and garment first.",
      "Do not re-explain plain, twill, and satin here.",
      "Sample hand.",
    ],
    sections: [
      s(
        "Knits are a different search",
        "If you need jersey, leave this page.",
        "The woven-versus-knit guide is the split.",
      ),
    ],
    faqs: [
      {
        question: "Is wool always warmer?",
        answer: "No. An open tropical wool can wear in heat. Read the weight.",
      },
    ],
  },
  {
    slug: "reading-fabric-prints",
    category: "quality",
    sources: ["r2-26", "r2-51"],
    keyword: "fabric prints",
    secondary: ["fabric patterns", "colorfastness"],
    title: "How to Read Fabric Prints",
    h1: "How should a buyer read fabric prints?",
    description:
      "Judge a print by the ground cloth, the placement, and colourfastness. FabStitch does not publish a 2026 trend ranking.",
    image: COTTON,
    alt: "Cotton ground cloth before a print is judged",
    related: [
      "/guides/fabric-questions/digital-and-reverse-prints/",
      "/guides/fabric-questions/why-fabric-color-fades/",
    ],
    answer:
      "A print sits on a ground cloth. That ground still has to fit the garment. Look at repeat, face, and whether the colour is documented as fast. The research file estimated trend scores and said some sources were missing. Those scores are not search volumes and not a list of prints FabStitch endorses for 2026.",
    points: [
      "No trend ranking.",
      "Ground cloth first.",
      "Colourfastness is a test, not a vibe.",
    ],
    sections: [
      s(
        "Patterns versus cloth",
        "A stripe on a bad weave is still a bad weave.",
        "Ask which face is the print face.",
      ),
    ],
    faqs: [
      {
        question: "What is trending?",
        answer: "This site will not answer that from an estimated score.",
      },
    ],
  },
  {
    slug: "what-is-ripstop",
    category: "materials",
    sources: ["r2-30"],
    keyword: "what is ripstop fabric",
    secondary: ["ripstop nylon", "reinforced weave"],
    title: "What Is Ripstop Fabric?",
    h1: "What is ripstop fabric used for?",
    description:
      "Ripstop is a weave with thicker yarns at intervals so a tear is slower to run. It is common in bags and outer layers. It is not a shoe system.",
    image: CANVAS,
    alt: "Firm woven cloth illustrating a reinforced weave idea",
    related: [
      "/guides/what-is-a-fabric-weave/",
      "/guides/fabric-questions/durable-fiber-blends/",
    ],
    answer:
      "Ripstop is a woven construction with reinforcement yarns in a grid. A small tear is meant to stop at the next thick yarn. It is used for bags, packs, and some outerwear. It does not mean every shoe or jacket uses it, and the fiber can be nylon or polyester. The photo here is a firm weave, not a labeled ripstop grid.",
    points: [
      "It is a weave pattern.",
      "Fiber is separate.",
      "FabStitch does not imply a ripstop SKU from this page.",
    ],
    sections: [
      s(
        "What it does not do",
        "It does not make a cloth waterproof.",
        "Coatings are a second spec.",
      ),
    ],
    faqs: [
      {
        question: "Is canvas ripstop?",
        answer:
          "Not by default. Canvas is a dense plain weave. Ripstop is a reinforcement grid.",
      },
    ],
  },
  {
    slug: "microfiber-and-rayon",
    category: "comparisons",
    sources: ["r2-32"],
    keyword: "microfiber vs rayon",
    secondary: ["viscose", "polyester microfiber"],
    title: "Microfiber and Rayon",
    h1: "How do microfiber and rayon differ?",
    description:
      "Microfiber is a very fine synthetic filament, often polyester. Rayon is regenerated cellulose, usually viscose. They are different families.",
    image: VISCOSE,
    alt: "Viscose blend cloth from the regenerated-cellulose family",
    table: {
      caption: "Microfiber and rayon",
      headers: ["", "Microfiber", "Rayon"],
      rows: [
        ["Family", "Fine synthetic filament", "Regenerated cellulose"],
        ["Typical fiber", "Polyester or nylon", "Viscose"],
        [
          "Do not assume",
          "It is soft because it is fine",
          "It behaves like cotton",
        ],
      ],
    },
    related: [
      "/guides/fabric-questions/tencel-and-viscose/",
      "/guides/fabric-questions/polyester-cotton-and-nylon/",
    ],
    answer:
      "Microfiber means the filament is very fine, usually polyester or nylon. Rayon, in apparel, usually means viscose: cellulose dissolved and regenerated. One is a synthetic fineness. The other is a cellulosic process. Hand can overlap. Care and heat do not.",
    points: [
      "Fine is not the same as viscose.",
      "Rayon can lose strength when wet.",
      "Read the composition line.",
    ],
    sections: [
      s(
        "Why shops mix the words",
        "Both can feel smooth.",
        "The fiber line is the correction.",
      ),
    ],
    faqs: [
      {
        question: "Is modal rayon?",
        answer: "Modal is a kind of rayon. It is still not microfiber.",
      },
    ],
  },
  {
    slug: "fabrics-for-structured-jackets",
    category: "materials",
    sources: ["r2-33"],
    keyword: "fabrics for structured jackets",
    secondary: ["wool jacket fabric", "silk border"],
    title: "Cloth for Structured Jackets",
    h1: "What cloths suit structured jackets?",
    description:
      "Structured jackets start with a stable weave: wool, cotton twill, or a documented blend. Decorative borders are a separate trim spec.",
    image: WOOL,
    alt: "Wool cloth with the stability a jacket brief often needs",
    commercial: true,
    related: [
      "/guides/fabric-questions/choosing-woven-wool-and-cotton/",
      "/marketplace/",
      "/guides/woven-vs-knit-fabrics/",
    ],
    answer:
      "A structured jacket needs a cloth that holds a shoulder and a lapel. Worsted wool, cotton twill, and some blends do that when the weight is right. A fluid viscose usually does not. Decorative borders and embroidery are trims. FabStitch does not invent a Nehru-jacket SKU. Choose the body cloth from a real fabric page.",
    points: [
      "Stability before decoration.",
      "Knit is a different jacket.",
      "Trim is not the body cloth.",
    ],
    sections: [
      s(
        "Handicraft briefs",
        "If the border is silk, specify the border separately.",
        "Do not assume the body and the border are one roll.",
      ),
    ],
    faqs: [
      {
        question: "Is velvet a structured jacket cloth?",
        answer: "Only if the pile cloth is stable enough. Many are not.",
      },
    ],
  },
  {
    slug: "fabrics-for-fasteners",
    category: "quality",
    sources: ["r2-36"],
    keyword: "fabrics for zippers and buttons",
    secondary: ["seam stability", "garment construction"],
    title: "Fabrics for Zippers and Buttons",
    h1: "Which fabrics hold zippers and buttons?",
    description:
      "Fasteners need a stable ground. Sheers and loose knits often need reinforcement. No fiber is the zipper fabric.",
    image: DENIM,
    alt: "Denim stable enough to discuss fastener placement",
    related: [
      "/guides/fabric-questions/sewing-pucker/",
      "/guides/woven-vs-knit-fabrics/",
    ],
    answer:
      "Zippers and buttons need cloth that will not wave or tear around the stitch. Stable wovens, denim, and canvases usually hold. Chiffon and loose jersey usually need a stay or a different placket. The fiber is secondary to that stability.",
    points: [
      "Stable ground.",
      "Reinforce sheers.",
      "Button weight must match the cloth.",
    ],
    sections: [
      s(
        "What not to promise",
        "There is no best zipper fabric.",
        "Test the fastening on the actual cloth.",
      ),
    ],
    faqs: [
      {
        question: "Can knitwear have buttons?",
        answer:
          "Yes, with a placket or tape that is more stable than the body knit.",
      },
    ],
  },
  {
    slug: "fabrics-for-childrens-clothing",
    category: "use-cases",
    sources: ["r2-37", "r2-52"],
    keyword: "fabrics for childrens clothing",
    secondary: ["soft fabric", "baby clothes fabric"],
    title: "Fabrics for Children's Clothing",
    h1: "What should buyers consider for children's clothing?",
    description:
      "Soft hand, documented composition, and washability matter. No fiber is the softest or the safest for every child.",
    image: JERSEY,
    alt: "Cotton jersey often considered for children's knits",
    related: [
      "/guides/fabric-questions/skin-comfort-and-fabric/",
      "/guides/fabric-questions/what-is-organic-cotton/",
      "/collections/cotton/",
    ],
    answer:
      "Children's clothing usually wants a soft hand, a cloth that survives washing, and a composition you can read. Cotton jersey is a common start. It is not the softest cloth in every finish, and it is not a medical claim. Diaper and baby-skin decisions belong with the product standard and a caregiver, not with a marketplace ranking. This page does not certify any cloth as hypoallergenic.",
    points: [
      "Hand and wash, not a winner.",
      "Organic is a certificate, not a feel.",
      "No diaper safety claim is made.",
    ],
    sections: [
      s(
        "What to sample",
        "Wash the swatch the way the garment will be washed.",
        "Stiff prints and scratchy seams fail more often than the fiber name.",
      ),
    ],
    faqs: [
      {
        question: "Is organic cotton required?",
        answer:
          "Only if your brief requires the certificate. Softness is separate.",
      },
    ],
  },
  {
    slug: "why-fabric-color-fades",
    category: "quality",
    sources: ["r2-38", "r2-40"],
    keyword: "why fabric color fades",
    secondary: ["colorfastness", "dye and print"],
    title: "Why Fabric Color Fades",
    h1: "Why do fabric colors fade?",
    description:
      "Light, wash, rub, and dye class move colour. Printed and dyed cloth can both fade. No home method locks every dye.",
    image: DENIM,
    alt: "Denim whose surface colour is known to wear",
    related: [
      "/guides/fabric-questions/faded-lines-on-jeans/",
      "/guides/fabric-questions/hand-dyed-fabric-care/",
    ],
    answer:
      "Colour fades when dye or pigment leaves the fiber: in wash, in sun, or by rub. A print can sit on the surface and crack. A dye can be deep and still poor to washing. Setting dye at home is not a reliable lock. If colourfastness matters, ask for a test on that dye lot. Do not print a recipe from a forum onto a care label.",
    points: [
      "Prints and dyes fail differently.",
      "Denim fade is often surface indigo.",
      "No universal lock.",
    ],
    sections: [
      s(
        "Solid versus print",
        "A solid can fade evenly. A print can fade in one ink.",
        "Specify which you cannot accept.",
      ),
    ],
    faqs: [
      {
        question: "Does cold water stop fading?",
        answer: "It can reduce wash fade. It does not stop light fade.",
      },
    ],
  },
  {
    slug: "sewing-pucker",
    category: "quality",
    sources: ["r2-39"],
    keyword: "sewing pucker",
    secondary: ["seam pucker", "fabric tension"],
    title: "Why Seams Pucker",
    h1: "How is sewing pucker reduced?",
    description:
      "Pucker is the cloth gathering at the seam. Match needle and tension to the cloth, and stabilize sheers. This is not a machine manual.",
    image: SILK,
    alt: "Light silk cloth that can pucker if the seam is forced",
    related: [
      "/guides/fabric-questions/fabrics-for-fasteners/",
      "/guides/chiffon-vs-georgette/",
    ],
    answer:
      "Pucker happens when the seam feeds more cloth than the stitch length can take, or when a fine cloth is sewn like canvas. Lighter needles, balanced tension, and a stable underlayer help sheers. The right fix depends on the machine and the cloth. This page will not list dial numbers.",
    points: [
      "Cloth and tension, together.",
      "Sheers need support.",
      "A heavy thread can cause the wave.",
    ],
    sections: [
      s(
        "What to change first",
        "If only one cloth puckers, it is not 'the machine is bad'.",
        "Sample the seam before you cut the run.",
      ),
    ],
    faqs: [
      {
        question: "Does pucker mean bad fabric?",
        answer:
          "Not always. It often means the seam was not matched to the cloth.",
      },
    ],
  },
  {
    slug: "new-and-worn-fabric",
    category: "quality",
    sources: ["r2-41"],
    keyword: "new and worn fabric",
    secondary: ["fabric hand after wear"],
    title: "New Cloth and Worn Cloth",
    h1: "How does new fabric differ from worn fabric?",
    description:
      "Wear relaxes finish, fades colour, and can pill or shine a cloth. New and worn are not two quality grades.",
    image: DENIM,
    alt: "Denim that changes after wear and wash",
    related: [
      "/guides/fabric-questions/softening-cotton/",
      "/guides/fabric-questions/faded-lines-on-jeans/",
    ],
    answer:
      "New cloth still has mill finish. Worn cloth has lost some of that finish, and may have faded, pilled, or shone at rub points. A washed denim is designed to look worn. A suiting that shines at the seat is wear you may not want. They are not a quality ranking of old versus new.",
    points: [
      "Finish leaves with wash and rub.",
      "Some programs want that.",
      "Do not buy worn cloth expecting new hand.",
    ],
    sections: [
      s(
        "Shirts and trousers",
        "A new shirting can feel crisp and then relax.",
        "Specify the hand you sell, not the hand after a year, unless you have washed it.",
      ),
    ],
    faqs: [
      {
        question: "Is worn fabric lower quality?",
        answer: "Only if the brief wanted the original finish and it is gone.",
      },
    ],
  },
  {
    slug: "crepe-de-chine-and-georgette",
    category: "comparisons",
    sources: ["r2-42"],
    keyword: "crepe de chine vs georgette",
    secondary: ["silk crepe", "georgette fabric"],
    title: "Crepe de Chine and Georgette",
    h1: "Are crepe de chine and georgette the same?",
    description:
      "No. Crepe de chine is a tighter, smoother crepe. Georgette is sheerer and drier. Both can be silk or synthetic.",
    image: CREPE,
    alt: "Crepe de chine with a closer surface than georgette",
    table: {
      caption: "Crepe de chine and georgette",
      headers: ["", "Crepe de chine", "Georgette"],
      rows: [
        ["Hand", "Smoother, fluid", "Drier, crisper"],
        ["Cover", "More opaque than georgette", "Sheerer"],
        ["Same fiber?", "Not necessarily", "Not necessarily"],
      ],
    },
    related: ["/guides/chiffon-vs-georgette/", "/collections/silk-sheer/"],
    answer:
      "No. Crepe de chine has a fine, pebbled surface and more cover. Georgette is lighter, sheerer, and drier to the hand. Both names are used for silk and for synthetics. Treat them as different cloths until the composition matches.",
    points: [
      "Not the same weave effect.",
      "Check fiber.",
      "Do not substitute one in a lining.",
    ],
    sections: [
      s(
        "Why the names collide",
        "Both can be called crepe in retail.",
        "The fabric page should use one name and a composition.",
      ),
    ],
    faqs: [{ question: "Is crepe de chine a georgette?", answer: "No." }],
  },
  {
    slug: "lining-fabrics",
    category: "materials",
    sources: ["r2-43"],
    keyword: "lining fabrics",
    secondary: ["habitai lining", "viscose lining"],
    title: "Lining Fabrics",
    h1: "What lining cloth should a brief name?",
    description:
      "Linings are chosen for slip, weight, and heat. Viscose and some silks are common. Leather styling is not a lining standard.",
    image: SATIN,
    alt: "Smooth cloth of the kind used when a lining must slip",
    related: [
      "/guides/fabric-questions/what-is-satin/",
      "/guides/fabric-questions/fabrics-for-structured-jackets/",
    ],
    answer:
      "A lining should slip, match the shell's care, and not add heat the garment cannot bear. Viscose twills and lightweight satins are common. Silk linings exist and cost differently. The research asked about leather. This page will not claim a lining makes leather stylish. Name the lining fiber and construction on their own.",
    points: [
      "Slip and care.",
      "Do not inherit the shell's marketing.",
      "No leather claim.",
    ],
    sections: [
      s(
        "What to avoid",
        "A stiff upholstery cloth is a bad lining.",
        "A sheer fashion fabric may not survive the seam.",
      ),
    ],
    faqs: [
      {
        question: "Is satin the lining?",
        answer: "Satin is one weave used for linings. It is not the only one.",
      },
    ],
  },
  {
    slug: "storing-clothes",
    category: "care",
    sources: ["r2-44"],
    keyword: "storing clothes",
    secondary: ["fabric storage", "wrinkle prevention"],
    title: "Storing Clothes",
    h1: "How should clothes be stored?",
    description:
      "Store clean, dry cloth. Fold knits. Hang structured wovens if the cloth can take it. Storage does not remove stains.",
    image: WOOL,
    alt: "Wool cloth that should be stored clean and dry",
    related: [
      "/guides/fabric-questions/everyday-laundry-mistakes/",
      "/guides/fabric-questions/delicate-fabric-care/",
    ],
    answer:
      "Store garments clean and dry. Soil left in fibers sets. Fold knits so hangers do not stretch the shoulder. Hang structured wovens if the cloth supports its own weight. Plastic that traps damp is a mildew risk. None of this removes a stain that is already in the fiber.",
    points: [
      "Clean first.",
      "Knits fold. Some wovens hang.",
      "Dry beats airtight damp.",
    ],
    sections: [
      s(
        "Wrinkles",
        "Folding a linen will crease it. That is linen.",
        "Storage will not press a jacket.",
      ),
    ],
    faqs: [
      {
        question: "Does a dark closet stop fading?",
        answer: "It reduces light fade. It does not clean the cloth.",
      },
    ],
  },
  {
    slug: "hand-dyed-fabric-care",
    category: "care",
    sources: ["r2-46"],
    keyword: "hand dyed fabric care",
    secondary: ["colorfastness"],
    title: "Caring for Hand-Dyed Fabric",
    h1: "How should hand-dyed fabric be cared for?",
    description:
      "Assume a hand dye may crock until a wash test says otherwise. Wash it alone, cool, and do not promise colourfastness.",
    image: LINEN,
    alt: "Linen ground that can take dye differently from mill-dyed cloth",
    related: [
      "/guides/fabric-questions/why-fabric-color-fades/",
      "/guides/fabric-questions/fabric-stain-care/",
    ],
    answer:
      "Hand-dyed cloth has not passed a mill colourfastness line unless someone tested it. Wash it alone, in cool water, the first times. Do not mix it with light grounds. Do not iron a print or a dye you have not checked for heat. This is caution, not a dye recipe.",
    points: [
      "Untested until tested.",
      "Separate washes.",
      "No lock-dye folklore.",
    ],
    sections: [
      s(
        "Selling it",
        "Tell the buyer the dye is hand done.",
        "Do not write colourfast if you have not washed a sample.",
      ),
    ],
    faqs: [
      {
        question: "Does vinegar set every dye?",
        answer: "No. That claim is not used here.",
      },
    ],
  },
  {
    slug: "digital-and-reverse-prints",
    category: "quality",
    sources: ["r2-47"],
    keyword: "digital fabric print",
    secondary: ["reverse print", "print face"],
    title: "Digital Prints and Reverse Prints",
    h1: "What is a digital print versus a reverse print?",
    description:
      "A digital print is applied from a file onto cloth. Reverse print is not one standard. Ask which face carries the ink.",
    image: SILK,
    alt: "Sheer cloth where print face changes what you see",
    related: [
      "/guides/fabric-questions/reading-fabric-prints/",
      "/guides/fabric-questions/why-fabric-color-fades/",
    ],
    answer:
      "Digital print means the image is printed from a digital file onto the cloth, rather than from a screen or roller setup. 'Reverse digital print' is not a single industry standard. On sheers, people sometimes mean ink on the back so colour shows through. Ask which face is printed. Do not assume a proprietary process from the phrase.",
    points: [
      "File-to-cloth is the digital part.",
      "Face matters.",
      "No secret process is described here.",
    ],
    sections: [
      s(
        "What to write on a spec",
        "Print method, face, and ground cloth.",
        "If the supplier cannot say the face, you cannot approve the sheer.",
      ),
    ],
    faqs: [
      {
        question: "Is reverse print better?",
        answer:
          "Not as a rule. It is a placement. Coverage and hand still vary.",
      },
    ],
  },
  {
    slug: "tencel-and-viscose",
    category: "comparisons",
    sources: ["r2-48"],
    keyword: "tencel vs viscose",
    secondary: ["lyocell vs rayon", "regenerated cellulose"],
    title: "Tencel and Viscose",
    h1: "How do Tencel lyocell and viscose differ?",
    description:
      "Both are regenerated cellulose. Lyocell uses a solvent-spinning process. Viscose uses a different chemical route. They are not polyester.",
    image: VISCOSE,
    alt: "Viscose blend beside the lyocell comparison",
    table: {
      caption: "Lyocell and viscose",
      headers: ["", "Tencel lyocell", "Viscose"],
      rows: [
        ["Family", "Regenerated cellulose", "Regenerated cellulose"],
        [
          "Process story",
          "Solvent spinning, solvent recovery designed in",
          "Classic viscose chemistry",
        ],
        ["Not", "Polyester", "Polyester"],
      ],
    },
    related: [
      "/guides/fabric-questions/what-is-tencel-lyocell/",
      "/guides/fabric-questions/microfiber-and-rayon/",
    ],
    answer:
      "The English question compares Tencel lyocell with viscose. Both come from cellulose. Lyocell is solvent-spun. Conventional viscose uses a different chemical route and often feels less stable when wet. Neither is polyester. A blend that adds polyester should say so. The Hindi line in the source mixed silk marketing into this. This page follows the English comparison.",
    points: [
      "Same family, different process.",
      "Wet strength is a known viscose watchout.",
      "Brand name is not every lyocell.",
    ],
    sections: [
      s(
        "Polyester rayon",
        "That phrase in the source is confusing.",
        "Viscose is not polyester. If a cloth contains both, the composition must list both.",
      ),
    ],
    faqs: [
      {
        question: "Can I substitute them?",
        answer: "Not without a sample. Drape and wet behavior differ.",
      },
    ],
  },
  {
    slug: "skin-comfort-and-fabric",
    category: "use-cases",
    sources: ["r2-54"],
    keyword: "skin friendly fabrics",
    secondary: ["fabric hand", "sensitive skin"],
    title: "Fabric and Skin Comfort",
    h1: "Which fabrics are comfortable against skin?",
    description:
      "Comfort is hand, finish, and friction. No fiber is medically skin-safe for everyone. Sample if the wearer is sensitive.",
    image: JERSEY,
    alt: "Soft cotton jersey used as a next-to-skin example",
    related: [
      "/guides/fabric-questions/fabrics-for-childrens-clothing/",
      "/guides/fabric-questions/what-is-organic-cotton/",
    ],
    answer:
      "Skin comfort is a smooth or soft hand, few scratchy finishes, and seams that do not rub. Cotton jersey and some cellulosics are common starts. Wool can be comfortable or itchy depending on micron and finish. This is not a medical page. Nothing here is hypoallergenic by decree.",
    points: [
      "Hand and finish.",
      "Sample for sensitive skin.",
      "Organic is not a feel.",
    ],
    sections: [
      s(
        "What to avoid promising",
        "Do not write dermatologist-approved.",
        "Do not write chemical-free as a comfort claim.",
      ),
    ],
    faqs: [
      {
        question: "Is polyester always harsh?",
        answer:
          "No. Some microfiber knits are soft. Some are not. Touch the cloth.",
      },
    ],
  },
  {
    slug: "durable-fiber-blends",
    category: "quality",
    sources: ["r2-58"],
    keyword: "durable fiber blends",
    secondary: ["polyester cotton blend", "fabric durability"],
    title: "Durable Fiber Blends",
    h1: "Which fiber blend is most durable?",
    description:
      "No blend wins every test. Durability is abrasion, seam, and use. A cotton-polyester twill and a wool blend answer different jobs.",
    image: TWILL,
    alt: "Twill blend whose durability depends on the weave",
    table: {
      caption: "Durability is contextual",
      headers: ["Job", "Often opened", "Watch"],
      rows: [
        ["Work trouser", "Dense twill or canvas", "Hand can be stiff"],
        [
          "Fitted knit",
          "Documented stretch blend",
          "Recovery must be on the page",
        ],
        ["Tailoring", "Wool or wool blend", "Abrasion is not the only brief"],
      ],
    },
    related: [
      "/guides/fabric-questions/polyester-cotton-and-nylon/",
      "/guides/fabric-questions/verify-fabric-quality/",
      "/marketplace/",
    ],
    commercial: true,
    answer:
      "There is no most durable blend. A polyester-cotton twill can resist abrasion in workwear and feel wrong in a soft shirt. A wool blend can recover creases and still pill. Durability means the failure you care about: rub, tear, or stretch loss. Name that failure, then compare cloths. FabStitch will not award a winner.",
    points: [
      "Name the failure mode.",
      "Construction beats the blend slogan.",
      "Test the lot if the order is large.",
    ],
    sections: [
      s(
        "How blends help",
        "Polyester can add recovery or abrasion resistance.",
        "It can also change hand and heat. Read the percentage.",
      ),
    ],
    faqs: [
      {
        question: "Is a higher synthetic share always tougher?",
        answer:
          "No. A loose knit with polyester can fail faster than a dense cotton twill.",
      },
    ],
  },
];
