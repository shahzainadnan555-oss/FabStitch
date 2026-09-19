import type { SemanticPage, SemanticSection } from "./types";
import { isReservedSemanticSlug } from "./reserved";
import { imageAlt } from "@/domain/seo/image-assets";

/**
 * Additional semantic pages with distinct search intent.
 *
 * This library is the expansion slot for new indexable discover pages.
 * It is capped so the corpus can grow toward 2,000 additional pages later
 * without publishing doorway combinations. Each record below has its own
 * facts. Pages that collide with the existing corpus are rejected in build.ts.
 */
export const ADDITIONAL_PAGE_CAPACITY = 2000;

type LibrarySpec = {
  slug: string;
  family: "glossary" | "sourcing" | "selection" | "brand" | "comparison";
  title: string;
  h1: string;
  description: string;
  keyword: string;
  imagePath: string;
  imageAlt: string;
  relatedPaths: readonly string[];
  what: string;
  why: string;
  how: string;
  watch: string;
  choose: string;
  faqs: readonly { question: string; answer: string }[];
};

const COTTON = "/media/fabrics/cotton-poplin-primary.webp";
const LINEN = "/media/fabrics/european-flax-linen-primary.webp";
const SILK = "/media/fabrics/silk-chiffon-primary.webp";
const DENIM = "/media/fabrics/lightweight-denim-primary.webp";
const JERSEY = "/media/hero-navy-jersey.jpg";

const SPECS: readonly LibrarySpec[] = [
  {
    slug: "what-fabric-gsm-means",
    family: "glossary",
    title: "What Fabric GSM Means",
    h1: "What fabric GSM means for a garment brief",
    description:
      "GSM is grams per square metre. Learn how fabric weight changes drape, opacity and suitability before you shortlist cloth on FabStitch.",
    keyword: "fabric GSM",
    imagePath: COTTON,
    imageAlt: "Cotton poplin folds showing a stable shirting cloth",
    relatedPaths: [
      "/guides/fabric-weight-and-gsm/",
      "/fabrics/",
      "/marketplace/",
      "/collections/cotton/",
    ],
    what: "GSM means grams per square metre. It describes how much a square metre of that cloth weighs, not how a garment will feel in the hand by itself. A 110 GSM voile and a 110 GSM jersey can share a number and still cut, drape and cover very differently because construction is not part of the GSM figure.",
    why: "Buyers use GSM to keep a weight conversation precise across mills and seasons. It is the usual way to separate a summer shirt cloth from a mid-weight trouser cloth, and to check whether a sample still matches the weight written on an inquiry.",
    how: "On FabStitch, read the published weight beside composition and construction. Compare GSM only among similar constructions: woven with woven, knit with knit. Then open the fabric page and the related collection rather than treating the number as a quality score.",
    watch:
      "GSM does not prove thread count, opacity, or shrinkage. A coated or heavily finished cloth can weigh more without feeling denser in wear. Always pair the number with a hand description and the garment it is meant for.",
    choose:
      "Choose a lower GSM when the brief needs air and drape, and a higher GSM when the brief needs cover, structure or abrasion resistance. State both the target GSM and the construction in a sourcing inquiry so the shortlist stays comparable.",
    faqs: [
      {
        question: "Is a higher GSM always better?",
        answer:
          "No. Higher GSM usually means more weight, not better quality. The right GSM is the one that matches the garment, season and construction.",
      },
      {
        question: "Can two fabrics share a GSM and still differ?",
        answer:
          "Yes. Weave or knit, yarn size and finish change hand and opacity even when the GSM matches.",
      },
    ],
  },
  {
    slug: "fabric-width-for-cutting",
    family: "glossary",
    title: "Fabric Width for Cutting",
    h1: "How fabric width affects cutting and yield",
    description:
      "Fabric width changes marker yield and seam planning. See how buyers should read width before estimating cloth for a make.",
    keyword: "fabric width",
    imagePath: LINEN,
    imageAlt: "Linen cloth with a visible plain weave",
    relatedPaths: [
      "/guides/",
      "/fabrics/",
      "/marketplace/",
      "/fabric-sourcing/",
    ],
    what: "Fabric width is the usable distance across the cloth, usually measured from edge to edge or between selvedges. It is a cutting fact, not a style fact. A beautiful hand on a narrow width can still be the wrong cloth if the marker cannot place the pieces.",
    why: "Width changes how many garments a length will yield and whether large pieces such as trouser legs or coat panels fit without extra seams. Ignoring width is a common reason a sample looks right and a bulk estimate does not.",
    how: "Check the width published with the fabric, then sketch the largest pattern piece against it. On FabStitch, keep width next to composition and GSM when you compare cloths for the same pattern.",
    watch:
      "Usable width can be narrower than the nominal width once selvedge and unusable edge are removed. Do not assume every cotton or linen in a collection shares one width.",
    choose:
      "Choose the wider cloth when marker efficiency matters, and do not reject a narrower cloth if the pattern was drafted for it. Write the required usable width into the inquiry alongside quantity.",
    faqs: [
      {
        question: "Does width change fabric quality?",
        answer:
          "No. Width changes yield and pattern fit. Quality still depends on fibre, construction and finish.",
      },
    ],
  },
  {
    slug: "thread-count-versus-construction",
    family: "glossary",
    title: "Thread Count Versus Construction",
    h1: "Why thread count is not a quality score",
    description:
      "Thread count describes yarn density in a weave. Learn when it helps a buyer and when construction and GSM matter more.",
    keyword: "thread count",
    imagePath: COTTON,
    imageAlt: "Fine cotton poplin with a close plain weave",
    relatedPaths: [
      "/guides/",
      "/collections/cotton/",
      "/fabrics/",
      "/marketplace/",
    ],
    what: "Thread count counts yarns in a given area of a woven cloth. It can hint at fineness, but marketing counts often add warp and weft in ways that are not comparable across mills. Knit fabrics are not described by the same thread-count habit at all.",
    why: "Buyers meet thread count in shirting and sheeting language. Used carefully, it helps compare similar plain weaves. Used alone, it hides yarn quality, GSM and finishing.",
    how: "Prefer the construction name, yarn description and GSM on the FabStitch fabric page. Treat thread count as extra context only when the seller defines how it was counted.",
    watch:
      "A high thread count on coarse yarn can still feel harsh. A moderate count on fine yarn can feel smoother. Do not rank cloths from unrelated families by thread count.",
    choose:
      "Choose on hand, opacity, GSM and construction first. Ask for thread count only when you are comparing two similar woven shirtings and the counting method is stated.",
    faqs: [
      {
        question: "Do knits have a thread count?",
        answer:
          "Knits are usually described by gauge, yarn and GSM, not by woven thread count.",
      },
    ],
  },
  {
    slug: "what-a-weave-changes",
    family: "glossary",
    title: "What a Weave Changes",
    h1: "What a weave changes in woven cloth",
    description:
      "Plain, twill and satin weaves change drape, strength and surface. Learn how to read weave before choosing a woven fabric.",
    keyword: "fabric weave",
    imagePath: DENIM,
    imageAlt: "Lightweight denim showing a twill surface",
    relatedPaths: [
      "/guides/woven-vs-knit-fabrics/",
      "/collections/denim/",
      "/fabrics/",
      "/marketplace/",
    ],
    what: "A weave is the pattern in which warp and weft yarns interlace. Plain weave crosses evenly and tends to look stable. Twill shifts the interlacing into a diagonal and often feels more pliable. Satin floats yarns to create a smoother face.",
    why: "The weave decides how the cloth bends, how it scuffs, and what the face looks like. Two cottons with the same GSM can behave differently if one is poplin and the other is twill.",
    how: "Read the construction on the fabric page, then look at the photograph for the face. Compare weaves inside one fibre family before you mix cotton twill with silk satin in the same decision.",
    watch:
      "Weave is not fibre. Denim is a twill, but not every twill is denim. Satin weave is not the same claim as silk fibre.",
    choose:
      "Choose plain weave when you want stability, twill when you want diagonal strength and a softer bend, and a satin weave when face smoothness matters more than snag resistance.",
    faqs: [
      {
        question: "Is denim a weave or a fabric?",
        answer:
          "Denim is a cotton twill cloth with a specific face and weight tradition. Twill is the broader weave family.",
      },
    ],
  },
  {
    slug: "how-knit-fabric-is-built",
    family: "glossary",
    title: "How Knit Fabric Is Built",
    h1: "How knit fabric is built",
    description:
      "Knits are looped yarns, not woven grids. See how that structure changes stretch, recovery and when a knit belongs in a brief.",
    keyword: "knit fabric",
    imagePath: JERSEY,
    imageAlt: "Navy jersey fabric with a looped knit surface",
    relatedPaths: [
      "/guides/woven-vs-knit-fabrics/",
      "/fabrics/",
      "/marketplace/",
      "/collections/",
    ],
    what: "A knit is made from loops of yarn. Those loops let the cloth stretch and recover in ways a woven grid usually cannot, unless the woven cloth contains elastane. Jersey, rib and french terry are different knit constructions, not synonyms.",
    why: "Buyers choose knits when the garment needs movement close to the body: tee shapes, active layers, some dresses. The loop structure also changes how edges curl and how the cloth must be cut.",
    how: "On FabStitch, filter by construction and read the published stretch notes rather than assuming every knit is four-way stretch. Compare jersey with french terry as different cloths.",
    watch:
      "Knits can grow if recovery is poor. A pretty drape does not mean the neckline will hold. Check composition for elastane only when the page states it.",
    choose:
      "Choose a knit when the pattern depends on stretch or a soft loop face. Stay with a woven when you need stable grain, sharp edges and less growth.",
    faqs: [
      {
        question: "Is jersey the same as knit?",
        answer:
          "Jersey is one knit construction. Knit is the broader family that also includes rib, interlock and terry.",
      },
    ],
  },
  {
    slug: "understanding-fabric-drape",
    family: "glossary",
    title: "Understanding Fabric Drape",
    h1: "Understanding fabric drape",
    description:
      "Drape is how cloth falls from a fold or a body. Learn how to judge it without confusing it with weight or softness.",
    keyword: "fabric drape",
    imagePath: SILK,
    imageAlt: "Silk chiffon with a light, fluid drape",
    relatedPaths: [
      "/fabrics/",
      "/collections/silk-sheer/",
      "/guides/",
      "/marketplace/",
    ],
    what: "Drape is the way a cloth bends and hangs under its own weight. Fluid drape falls into long folds. Crisp cloth holds a shape away from the body. Softness can accompany either behaviour, so hand-feel and drape are separate notes.",
    why: "A dress, blouse or skirt brief often fails when the cloth is the right fibre and the wrong drape. Structure at a collar and flow at a skirt are different requirements.",
    how: "Read the hand description and look at how the photographed cloth folds. Compare a chiffon or georgette with a poplin or canvas before you decide the silhouette.",
    watch:
      "Do not infer drape from GSM alone. A light canvas can still stand away from the body. A heavier crepe can still fall.",
    choose:
      "Choose fluid cloth for bias and gathered shapes, and a cloth with more body when the design needs a hem, collar or shoulder to hold a line.",
    faqs: [
      {
        question: "Is drape the same as softness?",
        answer:
          "No. Softness is how the surface feels. Drape is how the cloth hangs.",
      },
    ],
  },
  {
    slug: "what-hand-feel-describes",
    family: "glossary",
    title: "What Hand Feel Describes",
    h1: "What hand feel describes",
    description:
      "Hand feel is the tactile impression of cloth. Learn which words are useful in a brief and which ones are too vague to source against.",
    keyword: "fabric hand feel",
    imagePath: LINEN,
    imageAlt: "Natural linen showing an irregular woven hand",
    relatedPaths: ["/fabrics/", "/guides/", "/marketplace/", "/collections/"],
    what: "Hand feel, or hand, is the tactile read of a cloth: dry, smooth, crisp, fuzzy, cool, or slippery. It comes from fibre, yarn, weave or knit, and finish. It is not a lab number, so buyers should pair it with composition and GSM.",
    why: "Teams use hand language to reject or keep a sample quickly. Vague praise such as nice or premium does not tell a mill what to send next.",
    how: "Use the hand notes already written on FabStitch fabric pages. When you inquire, repeat the specific words you need, such as dry linen hand or smooth poplin face, instead of a single adjective.",
    watch:
      "Finishes can change hand without changing fibre. A softened cotton is still cotton. Do not treat a hand word as a fibre claim.",
    choose:
      "Choose language that a cutter can check on a sample: crisp, dry, fluid, brushed, or compact. Then confirm it against the published composition.",
    faqs: [
      {
        question: "Can hand feel be measured by GSM?",
        answer:
          "No. GSM is weight. Hand is tactile and can differ at the same weight.",
      },
    ],
  },
  {
    slug: "fabric-opacity-for-garments",
    family: "glossary",
    title: "Fabric Opacity for Garments",
    h1: "How to judge fabric opacity",
    description:
      "Opacity decides whether a cloth covers or reads as sheer. Learn how colour, layers and construction change that judgement.",
    keyword: "fabric opacity",
    imagePath: SILK,
    imageAlt: "Light silk cloth where coverage depends on layers",
    relatedPaths: [
      "/collections/silk-sheer/",
      "/fabrics/",
      "/fabrics/best-for/dresses/",
      "/marketplace/",
    ],
    what: "Opacity is how much light and skin a cloth hides. Sheer, semi-opaque and opaque are practical labels, not moral ones. A cloth can be opaque in navy and revealing in white because dye and yarn cover differ.",
    why: "Shirting, dresses and linings fail in wear when opacity was judged only on a dark sample. Buyers need to know whether the cloth is the outer layer or a layer in a stack.",
    how: "Read sheer or coverage notes where FabStitch publishes them, and look at the photograph against a light ground. For pale colours, assume you may need a lining or a second layer unless the page says the cloth is opaque.",
    watch:
      "Stretch can open a knit and reduce cover. A weave that looks dense in the photo can still flash at a seam if the cloth is light.",
    choose:
      "Choose an opaque cloth for a single-layer shirt or trouser, and a deliberately sheer cloth when the design uses lining, layering or evening coverage.",
    faqs: [
      {
        question: "Does a heavier GSM guarantee opacity?",
        answer:
          "Not always. Colour, yarn and construction still change how much the cloth covers.",
      },
    ],
  },
  {
    slug: "fabric-stretch-and-recovery",
    family: "glossary",
    title: "Fabric Stretch and Recovery",
    h1: "Fabric stretch and recovery",
    description:
      "Stretch is how far cloth gives. Recovery is whether it returns. Learn why both belong in an activewear or comfort brief.",
    keyword: "fabric stretch",
    imagePath: JERSEY,
    imageAlt: "Stretch jersey cloth used for close-fitting garments",
    relatedPaths: [
      "/guides/woven-vs-knit-fabrics/",
      "/fabrics/",
      "/marketplace/",
      "/collections/",
    ],
    what: "Stretch is the cloth giving under pull. Recovery is the cloth returning after that pull. A knit can stretch from its loops. A woven usually stretches in a useful way only when elastane or a similar yarn is part of the published composition.",
    why: "Comfort waistbands, activewear and some dresses need stretch. They also need recovery, or the garment grows at the elbow, seat or neckline.",
    how: "Read composition before you assume stretch. On FabStitch, do not infer elastane from a soft photograph. If the page does not list it, treat the cloth as stable unless the construction is a knit.",
    watch:
      "Mechanical stretch from a loose weave is not the same as elastane recovery. It can feel giving in the hand and then bag in wear.",
    choose:
      "Choose documented stretch for movement-critical garments. Choose a stable woven when edges, stripes and grain must stay put.",
    faqs: [
      {
        question: "Do all knits recover well?",
        answer:
          "No. Loop structure can stretch and still grow if the yarn and knit do not recover.",
      },
    ],
  },
  {
    slug: "reading-fiber-content",
    family: "glossary",
    title: "Reading Fiber Content",
    h1: "How to read fiber content",
    description:
      "Fiber content lists what a cloth is made from. Learn how to use composition on FabStitch without guessing missing percentages.",
    keyword: "fiber content",
    imagePath: COTTON,
    imageAlt: "Cotton fabric whose composition should be read from the page",
    relatedPaths: [
      "/fabrics/",
      "/marketplace/",
      "/guides/",
      "/fabric-sourcing/",
    ],
    what: "Fiber content, or composition, names the fibres in a cloth and, when published, their shares. Cotton, linen, silk, wool, viscose and polyester are different claims. A blend is not a single-fibre cloth with a marketing nickname.",
    why: "Care, dye, hand and price expectations follow composition. A sourcing inquiry that says natural without a fibre is too vague to match.",
    how: "Use the composition line on the FabStitch fabric page as the fact. If a percentage is not published, do not invent one in a comparison or a customer note.",
    watch:
      "Rayon and viscose language overlaps in the market. Read the wording on the page rather than swapping the names yourself.",
    choose:
      "Choose the fibre that matches the brief, then confirm the construction. A cotton twill and a cotton jersey are both cotton and still different cloths.",
    faqs: [
      {
        question: "What if a percentage is missing?",
        answer:
          "Treat the composition as incomplete. Do not guess the share, and ask in the inquiry if the share matters to the brief.",
      },
    ],
  },
  {
    slug: "what-a-fabric-finish-does",
    family: "glossary",
    title: "What a Fabric Finish Does",
    h1: "What a fabric finish does",
    description:
      "A finish is a treatment after the cloth is built. Learn which finish claims to trust and which ones need the page to say so.",
    keyword: "fabric finish",
    imagePath: COTTON,
    imageAlt: "Finished cotton cloth with a smooth face",
    relatedPaths: ["/fabrics/", "/guides/", "/marketplace/", "/collections/"],
    what: "A finish is work done after weaving or knitting: brushing, softening, mercerising, coating, or a wash. It can change hand and surface without changing the fibre name. A finish is only a fact when the fabric record states it.",
    why: "Buyers often want a washed hand or a crisp face. Those are finish conversations, not fibre conversations. Mixing them up sends the wrong sample.",
    how: "Read the finish only if FabStitch publishes it. Otherwise describe the hand you see and ask whether it comes from fibre, construction or a treatment.",
    watch:
      "Do not claim waterproof, antimicrobial or easy-care behaviour unless that treatment is written on the fabric. Photographs do not prove a chemical finish.",
    choose:
      "Choose a stated finish when the brief depends on it. If the page is silent, keep the requirement in the inquiry instead of assuming the cloth already has it.",
    faqs: [
      {
        question: "Is mercerised the same as cotton?",
        answer:
          "Mercerising is a cotton treatment. The fibre is still cotton, with a changed lustre and strength profile.",
      },
    ],
  },
  {
    slug: "fabric-shrinkage-before-bulk",
    family: "glossary",
    title: "Fabric Shrinkage Before Bulk",
    h1: "Thinking about fabric shrinkage before bulk",
    description:
      "Shrinkage changes fit after a first wash or steam. Learn what buyers can check on FabStitch and what they should ask before bulk.",
    keyword: "fabric shrinkage",
    imagePath: LINEN,
    imageAlt: "Linen fabric that can change after washing",
    relatedPaths: [
      "/fabric-sourcing/",
      "/guides/",
      "/fabrics/",
      "/marketplace/",
    ],
    what: "Shrinkage is the cloth pulling in after wetting, washing or steaming. Some fibres and constructions move more than others. A shrinkage figure is a test result, not something a product photo can show.",
    why: "A pattern graded to a washed measurement will miss if the bulk cloth moves differently from the sample. This matters more for linen, some cottons and knits than for a stable synthetic lining.",
    how: "If FabStitch does not publish a shrinkage test, do not invent a percentage. Note the fibre and construction, then ask for the expected movement in the inquiry before you commit a bulk quantity.",
    watch:
      "Pre-washed and loomstate cloths are different products. A soft hand does not mean the cloth has already been washed.",
    choose:
      "Choose a cloth whose movement you understand for fitted garments. For loose shapes, still record the expectation so the second lot matches the first.",
    faqs: [
      {
        question: "Does FabStitch publish a shrinkage number on every fabric?",
        answer:
          "No. Only use a shrinkage figure when it is actually written on the fabric record. Otherwise ask before bulk.",
      },
    ],
  },
  {
    slug: "b2b-fabric-sourcing-on-fabstitch",
    family: "sourcing",
    title: "B2B Fabric Sourcing on FabStitch",
    h1: "B2B fabric sourcing on FabStitch",
    description:
      "FabStitch helps businesses discover fabrics by material, use and spec, then inquire. See what the storefront actually supports.",
    keyword: "B2B fabric sourcing",
    imagePath: COTTON,
    imageAlt: "Cotton fabric ready for a sourcing shortlist",
    relatedPaths: [
      "/fabric-sourcing/",
      "/wholesale-fabric/",
      "/marketplace/",
      "/fabrics/",
    ],
    what: "B2B fabric sourcing on FabStitch means using the public storefront to find cloth for a commercial make: a brand, a studio, a manufacturer or a buyer comparing options before an inquiry. It is a discovery and inquiry path, not an anonymous checkout promise.",
    why: "Teams waste time when material, use and weight live in separate notes. FabStitch groups those paths through collections, Best For pages, guides and the marketplace so a shortlist starts from the garment problem.",
    how: "Start at the marketplace or a collection, open a fabric page, and read composition, construction and published specs. When the cloth fits, send an inquiry with quantity and the brief. Wholesale context lives on the wholesale fabric page.",
    watch:
      "Do not treat FabStitch as a claim about being the largest network or the cheapest source. The storefront shows published fabrics and inquiry tools, not a universal ranking.",
    choose:
      "Use FabStitch when you need to compare documented cloths and start a commercial conversation. Use a guide when you still need the vocabulary for GSM, weave or drape.",
    faqs: [
      {
        question: "Can I buy every fabric instantly?",
        answer:
          "The public path is discovery and inquiry. Follow the fabric page and inquiry flow rather than assuming instant checkout on every cloth.",
      },
    ],
  },
  {
    slug: "wholesale-fabric-sourcing-basics",
    family: "sourcing",
    title: "Wholesale Fabric Sourcing Basics",
    h1: "Wholesale fabric sourcing basics",
    description:
      "Wholesale sourcing starts with spec, quantity and a comparable shortlist. See how that maps to FabStitch collections and inquiries.",
    keyword: "wholesale fabric sourcing",
    imagePath: DENIM,
    imageAlt: "Denim cloth considered for a larger clothing run",
    relatedPaths: [
      "/wholesale-fabric/",
      "/fabric-sourcing/",
      "/marketplace/",
      "/collections/",
    ],
    what: "Wholesale fabric sourcing is the work of matching a production quantity to a cloth that can be repeated. The useful inputs are composition, construction, GSM, width and the garment, not a single adjective such as premium.",
    why: "A sample that cannot be described will not match a second lot. Wholesale buyers need a shortlist of cloths that can be compared on the same fields.",
    how: "Use the wholesale fabric page for the commercial frame, then open collections and fabric pages to gather specs. Put quantity, width and end use in the inquiry so the follow-up is specific.",
    watch:
      "Wholesale does not mean every published fabric has the same minimum or lead time. Those terms belong in the inquiry, not in a guessed table.",
    choose:
      "Choose cloths you can describe precisely. Reject a shortlist that only shares a colour story and not a construction.",
    faqs: [
      {
        question: "Where do I start a wholesale conversation?",
        answer:
          "Read the wholesale fabric page, shortlist fabrics with published specs, then submit an inquiry with quantity and end use.",
      },
    ],
  },
  {
    slug: "sourcing-fabric-for-clothing-brands",
    family: "sourcing",
    title: "Sourcing Fabric for Clothing Brands",
    h1: "Sourcing fabric for clothing brands",
    description:
      "Clothing brands can shortlist FabStitch fabrics by collection, use and spec before they inquire. Here is a practical path.",
    keyword: "fabric for clothing brands",
    imagePath: LINEN,
    imageAlt: "Linen fabric suited to a brand apparel shortlist",
    relatedPaths: [
      "/collections/",
      "/fabrics/best-for/shirts/",
      "/fabrics/best-for/dresses/",
      "/marketplace/",
    ],
    what: "A clothing brand usually sources against a silhouette and a season, not against a fibre slogan. Shirt programmes, dress programmes and tailoring programmes need different drape, opacity and weight even when they share a colour story.",
    why: "Brand teams move faster when the shortlist is already grouped by use. FabStitch Best For pages and collections exist so that grouping is public and crawlable, not locked in a private spreadsheet.",
    how: "Pick the use, open the related Best For or collection page, then compare fabric pages. Keep one primary construction per style before you add contrast fabrics.",
    watch:
      "Do not copy a consumer trend word into a bulk spec. If the page does not say washed, brushed or stretch, do not assume the brand story implies it.",
    choose:
      "Choose the cloth that matches the sample standard you can describe. Use guides when the team still disagrees on GSM or weave.",
    faqs: [
      {
        question: "Should a brand start from colour or construction?",
        answer:
          "Start from construction and use, then colour. Colour on the wrong construction will not save the fit.",
      },
    ],
  },
  {
    slug: "sourcing-fabric-for-manufacturers",
    family: "sourcing",
    title: "Sourcing Fabric for Manufacturers",
    h1: "Sourcing fabric for manufacturers",
    description:
      "Manufacturers need repeatable specs more than inspiration. See how to use FabStitch fabric pages before a production inquiry.",
    keyword: "fabric for manufacturers",
    imagePath: DENIM,
    imageAlt: "Structured denim cloth for a production shortlist",
    relatedPaths: [
      "/fabric-sourcing/",
      "/fabrics/",
      "/marketplace/",
      "/guides/",
    ],
    what: "Manufacturers source cloth that can be cut repeatedly: known composition, construction, weight and width. Inspiration images help a designer. They do not replace those fields on the cutting table.",
    why: "A factory inquiry that says soft cotton will return too many options. A inquiry that says cotton poplin, target GSM and usable width can be checked.",
    how: "Open the fabric page, copy only the specs that are published, and attach the garment type. Use the marketplace to find neighbours in the same construction rather than mixing unrelated families.",
    watch:
      "Do not invent a lead time, a test certificate or a price from the photograph. If it is not on the page, it is not a FabStitch fact.",
    choose:
      "Choose the narrowest spec that still leaves a real choice. Then inquire with quantity so the conversation is commercial rather than theoretical.",
    faqs: [
      {
        question: "What should a factory include in an inquiry?",
        answer:
          "Published composition, construction, target weight, width if known, garment type and quantity.",
      },
    ],
  },
  {
    slug: "fabric-sourcing-workflow",
    family: "sourcing",
    title: "A Fabric Sourcing Workflow",
    h1: "A practical fabric sourcing workflow",
    description:
      "Move from garment need to a FabStitch shortlist and inquiry without skipping spec. This is the workflow the storefront supports.",
    keyword: "fabric sourcing workflow",
    imagePath: COTTON,
    imageAlt: "Cotton fabric used as the start of a sourcing workflow",
    relatedPaths: [
      "/fabric-sourcing/",
      "/how-it-works/",
      "/marketplace/",
      "/guides/",
    ],
    what: "A workable flow is: name the garment, name the constraints, shortlist cloths that publish those constraints, then inquire. FabStitch supports that sequence with Best For pages, collections, fabric pages and the inquiry path.",
    why: "Skipping straight to colour creates a shortlist that cannot be compared. Skipping the inquiry leaves a bookmark, not a commercial next step.",
    how: "Write the garment and two or three constraints first, such as breathable woven shirting or stable trouser twill. Search or browse to fabrics that state those traits. Open each page before you add it to the inquiry.",
    watch:
      "How it works on FabStitch describes the customer path. It does not add hidden services that are not on the page.",
    choose:
      "Stop the shortlist at a handful of cloths you can tell apart. If two pages read the same, keep one and move on.",
    faqs: [
      {
        question: "Where is the workflow explained on the site?",
        answer:
          "The how it works page and the fabric sourcing page describe the public path. Fabric pages hold the specs.",
      },
    ],
  },
  {
    slug: "evaluating-fabric-before-bulk",
    family: "sourcing",
    title: "Evaluating Fabric Before Bulk",
    h1: "Evaluating fabric before a bulk inquiry",
    description:
      "Before you inquire for bulk, check composition, construction, weight and use. Here is a factual checklist using FabStitch pages.",
    keyword: "evaluate fabric before bulk",
    imagePath: LINEN,
    imageAlt: "Linen sample cloth reviewed before a larger order",
    relatedPaths: [
      "/wholesale-fabric/",
      "/fabrics/",
      "/guides/",
      "/marketplace/",
    ],
    what: "Evaluation before bulk is a comparison of published facts plus a sample in the hand. The page can tell you fibre, construction and stated weight. It cannot tell you how that exact roll will sew until you handle a cutting.",
    why: "Bulk multiplies a small mismatch. A slight difference in hand or width is cheap on a sample and expensive on a marker.",
    how: "Line up two or three FabStitch fabric pages. Keep only cloths that match fibre and construction. Note GSM and width where published. Then inquire for a sample or a quantity with those notes attached.",
    watch:
      "Do not score quality from photography alone. Lighting changes texture. Use the written spec as the record.",
    choose:
      "Proceed to bulk language only when the spec you need is either published or explicitly requested in the inquiry.",
    faqs: [
      {
        question: "Is a photograph enough to approve bulk?",
        answer:
          "No. Use it to understand the face, then rely on published specs and a handled sample for approval.",
      },
    ],
  },
  {
    slug: "preparing-a-fabric-inquiry",
    family: "sourcing",
    title: "Preparing a Fabric Inquiry",
    h1: "Preparing a fabric inquiry",
    description:
      "A useful FabStitch inquiry names the fabric, the quantity and the end use. See which details help and which claims to leave out.",
    keyword: "fabric inquiry",
    imagePath: COTTON,
    imageAlt: "Cotton fabric page used as the basis of an inquiry",
    relatedPaths: [
      "/how-it-works/",
      "/fabric-sourcing/",
      "/marketplace/",
      "/fabrics/",
    ],
    what: "An inquiry is the commercial message attached to a cloth you have already identified. It should name the fabric, the quantity you have in mind, and what you are making. It should not invent certifications or prices the page does not show.",
    why: "A short inquiry that points at the right fabric page is easier to answer than a long note that could match dozens of cloths.",
    how: "Open the fabric, confirm the slug and specs, then use the inquiry path described in how it works. Repeat only facts from the page, plus your quantity and deadline if you have one.",
    watch:
      "Do not add competitor claims or a demand for the lowest price as if it were a published offer. FabStitch does not invent prices on these pages.",
    choose:
      "Send the inquiry when the cloth is a real candidate, not when you are still choosing between unrelated fibres.",
    faqs: [
      {
        question: "What if I need several fabrics?",
        answer:
          "Keep each inquiry tied to a fabric page so composition and construction stay attached to the request.",
      },
    ],
  },
  {
    slug: "fabric-specifications-for-production",
    family: "sourcing",
    title: "Fabric Specifications for Production",
    h1: "Fabric specifications that matter in production",
    description:
      "Production specs are composition, construction, weight and width. Learn how to collect them from FabStitch without inventing the rest.",
    keyword: "fabric specifications",
    imagePath: DENIM,
    imageAlt: "Denim construction that should be specified before production",
    relatedPaths: [
      "/fabrics/",
      "/guides/fabric-weight-and-gsm/",
      "/marketplace/",
      "/fabric-sourcing/",
    ],
    what: "A production spec is the smallest set of facts that lets a second person find the same cloth. On FabStitch that set is whatever the fabric page publishes: composition, construction, weight, and sometimes width or hand. Missing fields stay missing.",
    why: "Production fails when the spec is a mood. Teams cannot cut, cost or repeat a mood. They can discuss a cotton twill at a stated GSM.",
    how: "Copy specs from the fabric page into your internal sheet. Link the page. Add garment and quantity yourself. Use guides for GSM and weave if the team does not share those words yet.",
    watch:
      "Do not fill blanks with typical industry numbers. A typical cotton is not this cotton.",
    choose:
      "Freeze the spec before you talk about colour stories or trim. Colour on an unstable spec will be reworked.",
    faqs: [
      {
        question: "Which spec should I never guess?",
        answer:
          "Composition share, elastane content, shrinkage and price. Use them only when published or confirmed in the inquiry.",
      },
    ],
  },
  {
    slug: "how-to-choose-fabric-weight",
    family: "selection",
    title: "How to Choose Fabric Weight",
    h1: "How to choose fabric weight",
    description:
      "Choose fabric weight from the garment and the construction, not from a single GSM slogan. A practical FabStitch approach.",
    keyword: "choose fabric weight",
    imagePath: COTTON,
    imageAlt: "Mid-weight cotton cloth compared by hand and fold",
    relatedPaths: [
      "/guides/fabric-weight-and-gsm/",
      "/discover/what-fabric-gsm-means/",
      "/fabrics/",
      "/marketplace/",
    ],
    what: "Fabric weight should be chosen after the garment is named. A shirt, a trouser and a coat do not share a correct GSM. Within one garment, construction still splits the range: a jersey and a twill at the same grams do not substitute.",
    why: "Weight is the easiest number to over-trust. Buyers who chase the lowest GSM for comfort often lose opacity. Buyers who chase the highest GSM for quality often lose drape.",
    how: "Read the GSM guide, then compare fabrics inside one FabStitch collection. Keep the construction fixed while you move the weight, so you can see what the grams actually change.",
    watch:
      "Season words are not weights. Summer can still need an opaque shirt cloth. Winter can still use a light layer under a coat.",
    choose:
      "Pick the lightest cloth that still covers and holds the shape you need. Write that GSM as a range, not a single lucky number, unless the page states one.",
    faqs: [
      {
        question: "Should I start with GSM or fibre?",
        answer:
          "Name the garment, then fibre and construction, then GSM. The number is the last filter, not the first.",
      },
    ],
  },
  {
    slug: "how-gsm-affects-clothing",
    family: "selection",
    title: "How GSM Affects Clothing",
    h1: "How GSM affects clothing",
    description:
      "GSM changes cover, drape and season more than it changes prestige. See how clothing categories use weight differently.",
    keyword: "GSM and clothing",
    imagePath: LINEN,
    imageAlt: "Lightweight linen cloth used in warm-weather clothing",
    relatedPaths: [
      "/guides/fabric-weight-and-gsm/",
      "/fabrics/best-for/shirts/",
      "/fabrics/best-for/dresses/",
      "/marketplace/",
    ],
    what: "In clothing, GSM influences how a cloth hangs, how warm it feels, and how much it covers. It does not by itself decide luxury. A light silk and a light cotton can share a low GSM and dress a body in different ways.",
    why: "Designers argue about season. Pattern makers argue about support. GSM is the shared number that lets both conversations meet, if construction is held constant.",
    how: "Look at shirt and dress Best For pages, then open fabrics and compare published weights. Note when a page gives a range instead of a point value.",
    watch:
      "Do not copy a GSM from a knit tee onto a woven shirt pattern. The clothing category and the construction both have to match.",
    choose:
      "Use GSM to reject cloths that are obviously too heavy or too light for the garment, then decide the final cloth on hand and opacity.",
    faqs: [
      {
        question: "Is there one GSM for summer clothing?",
        answer:
          "No. Summer shirts, dresses and linings sit in different ranges. Read the fabric page for the cloth you are actually considering.",
      },
    ],
  },
  {
    slug: "how-to-compare-two-fabrics",
    family: "selection",
    title: "How to Compare Two Fabrics",
    h1: "How to compare two fabrics",
    description:
      "Compare two fabrics on fibre, construction, weight and use. Skip universal winners. Here is a side-by-side method for FabStitch pages.",
    keyword: "compare fabrics",
    imagePath: COTTON,
    imageAlt: "Cotton cloth laid for a side-by-side comparison",
    relatedPaths: ["/guides/", "/fabrics/", "/marketplace/", "/collections/"],
    what: "A fair comparison holds the garment still and changes one or two facts at a time. Cotton versus linen is a fibre comparison. Poplin versus twill is a construction comparison. Mixing all four in one sentence makes a winner that does not exist.",
    why: "Teams pick faster when the table has the same rows for both cloths: fibre, construction, GSM, hand, opacity and typical use. Empty rows stay empty.",
    how: "Open two FabStitch fabric or discover pages. Copy only published lines. Write choose A when and choose B when, tied to the garment, not to a ranking.",
    watch:
      "Do not declare a best fabric for all brands. Context is the conclusion.",
    choose:
      "Keep the cloth that matches the constraint you cannot compromise, such as opacity for a white shirt or drape for a bias skirt.",
    faqs: [
      {
        question: "Should a comparison name a winner?",
        answer:
          "No. Say which cloth fits which constraint. A universal winner is usually a missing constraint.",
      },
    ],
  },
  {
    slug: "how-to-evaluate-fabric-quality",
    family: "selection",
    title: "How to Evaluate Fabric Quality",
    h1: "How to evaluate fabric quality",
    description:
      "Quality is fitness for the brief: even construction, honest composition and a hand that matches the garment. No invented scores.",
    keyword: "fabric quality",
    imagePath: SILK,
    imageAlt: "Silk cloth whose quality depends on the brief, not a score",
    relatedPaths: [
      "/guides/",
      "/fabrics/",
      "/marketplace/",
      "/fabric-sourcing/",
    ],
    what: "Quality here means the cloth does what the garment needs, consistently. Even yarn, a construction that matches its name, and a composition you can read are quality signals. A higher price is not published on these pages and is not a quality metric you should invent.",
    why: "Buyers ask for the best fabric and then cannot test it. A clearer test is whether the cloth matches the brief without hidden substitutions.",
    how: "Read the fabric page from composition to construction to weight. Look for contradictions, such as a sheer photo on a cloth described as canvas. If the page is consistent, the cloth is a candidate.",
    watch:
      "Do not add star ratings, review counts or award claims. FabStitch discover pages do not carry those facts.",
    choose:
      "Prefer the cloth whose written spec and photograph agree, and whose use matches your pattern.",
    faqs: [
      {
        question: "Does FabStitch rank fabrics by quality score?",
        answer:
          "No. Compare published specs and suitability. There is no star rating to sort by.",
      },
    ],
  },
  {
    slug: "lightweight-versus-heavyweight-cloth",
    family: "selection",
    title: "Lightweight Versus Heavyweight Cloth",
    h1: "Lightweight versus heavyweight cloth",
    description:
      "Lightweight and heavyweight are relative labels. Learn how to use them inside one construction instead of across the whole catalog.",
    keyword: "lightweight vs heavyweight fabric",
    imagePath: LINEN,
    imageAlt: "Light linen contrasted with a more substantial fold",
    relatedPaths: [
      "/guides/fabric-weight-and-gsm/",
      "/discover/what-fabric-gsm-means/",
      "/fabrics/",
      "/marketplace/",
    ],
    what: "Lightweight and heavyweight only mean something inside a family. A heavyweight shirt cloth can still be lighter than a light denim. The words point at a range, then GSM and construction make the range real.",
    why: "Catalog filters use these words because buyers search them. They become misleading when a lightweight denim is compared with a lightweight chiffon as if the word meant the same grams.",
    how: "Stay inside one FabStitch collection or construction. Read GSM where it is published. Use the attribute pages for lightweight or heavyweight as explanations, not as a single product.",
    watch:
      "Do not create a third page that only swaps the word light for lightweight. If the intent is the same, keep one page.",
    choose:
      "Choose lightweight when airflow and drape lead the brief. Choose heavyweight when cover, wind resistance or abrasion lead it.",
    faqs: [
      {
        question: "Is lightweight a fibre?",
        answer:
          "No. It is a weight description. The fibre and construction still have to be named.",
      },
    ],
  },
  {
    slug: "woven-versus-knit-selection",
    family: "selection",
    title: "Woven Versus Knit Selection",
    h1: "Choosing between woven and knit",
    description:
      "Choose woven or knit from the pattern's need for stability or stretch. This selection note sits beside the woven versus knit guide.",
    keyword: "woven vs knit selection",
    imagePath: JERSEY,
    imageAlt: "Jersey knit beside the decision to use a woven instead",
    relatedPaths: [
      "/guides/woven-vs-knit-fabrics/",
      "/fabrics/",
      "/marketplace/",
      "/collections/",
    ],
    what: "Choose a woven when the pattern needs a stable grain, crisp edges and predictable stripes. Choose a knit when the pattern needs loop stretch, a softer recovery and fewer darts. The fibre can be cotton in both cases.",
    why: "Many failed substitutions are construction mistakes, not fibre mistakes. A cotton jersey will not behave like a cotton poplin in a tailored shirt.",
    how: "Read the woven versus knit guide, then open one woven and one knit on FabStitch that share a fibre if you want a clean comparison. Keep the garment fixed.",
    watch:
      "Elastane in a woven can mimic some knit comfort and still fray and sew like a woven. Read composition.",
    choose:
      "Let the pattern decide. If the block was drafted for wovens, do not move it to a knit without recutting.",
    faqs: [
      {
        question: "Can I use the same pattern for both?",
        answer:
          "Only if it was designed for both. Stretch and grain change fit enough that most blocks should stay in one construction.",
      },
    ],
  },
  {
    slug: "estimating-fabric-for-a-make",
    family: "selection",
    title: "Estimating Fabric for a Make",
    h1: "Estimating fabric for a make",
    description:
      "Estimate cloth from pattern size, width and waste, not from a universal metre count. How to keep that estimate honest.",
    keyword: "estimate fabric quantity",
    imagePath: COTTON,
    imageAlt: "Cotton cloth whose yield depends on width and pattern",
    relatedPaths: [
      "/discover/fabric-width-for-cutting/",
      "/fabric-sourcing/",
      "/fabrics/",
      "/how-it-works/",
    ],
    what: "A fabric estimate is pattern area plus waste, divided by usable width. There is no honest single metreage for a dress or a shirt across all widths. Directional prints, naps and matching increase waste.",
    why: "Inquiries that ask for a quantity without width force a guess. Guesses become shortages at the marker.",
    how: "Note the usable width from the fabric page if it is published. If it is not, say unknown in the inquiry and ask. Add a waste allowance you can explain, such as matching a check, instead of a round marketing number.",
    watch:
      "Do not publish a universal yards-per-garment figure on a discover page. It would be a fabricated statistic.",
    choose:
      "Estimate after the cloth and the width are known. If they are not known, estimate a range and label it as a range.",
    faqs: [
      {
        question: "Does FabStitch calculate marker yield?",
        answer:
          "No. The site helps you find the cloth and its published width. Yield stays with your pattern.",
      },
    ],
  },
  {
    slug: "choosing-fabric-for-manufacturing",
    family: "selection",
    title: "Choosing Fabric for Manufacturing",
    h1: "Choosing fabric for manufacturing",
    description:
      "Manufacturing choices favour repeatable construction and a spec you can re-order. See how to narrow FabStitch options.",
    keyword: "fabric for manufacturing",
    imagePath: DENIM,
    imageAlt: "Denim selected for a repeatable manufacturing run",
    relatedPaths: [
      "/discover/sourcing-fabric-for-manufacturers/",
      "/fabric-sourcing/",
      "/fabrics/",
      "/marketplace/",
    ],
    what: "Manufacturing fabric choice favours cloths that can be described and repeated: one construction, one weight target, one width. Novelty texture is welcome when it is the product, and a risk when it is an accident of one sample.",
    why: "A line that changes hand every lot cannot hold a fit standard. The public fabric page is the start of that standard, not the whole of it.",
    how: "Shortlist from a collection, drop cloths that lack the spec field you need, and inquire with quantity. Keep a backup in the same construction rather than a different fibre that only matches the colour.",
    watch:
      "Do not assume unpublished minimums. Ask. A discover page must not invent a factory minimum.",
    choose:
      "Choose the cloth your pattern room can already sew, unless you have time to retest needles, interlining and shrinkage.",
    faqs: [
      {
        question: "Should manufacturing start from a trend page?",
        answer:
          "Use trend and collection pages for direction, then freeze a spec from a fabric page before production language.",
      },
    ],
  },
  {
    slug: "why-businesses-use-fabstitch",
    family: "brand",
    title: "Why Businesses Use FabStitch",
    h1: "Why businesses use FabStitch for fabric discovery",
    description:
      "Businesses use FabStitch to browse documented fabrics, compare uses and start an inquiry. No unsupported superlatives.",
    keyword: "why FabStitch",
    imagePath: COTTON,
    imageAlt: "FabStitch cotton fabric presented for commercial discovery",
    relatedPaths: ["/", "/marketplace/", "/fabric-sourcing/", "/how-it-works/"],
    what: "Businesses use FabStitch when they want a public, structured way to look at cloth: by collection, by use, by guide, and by individual fabric page. The value is the documented shortlist and the inquiry path, not a claim to be the world's largest marketplace.",
    why: "Scattered PDFs and unnamed swatches slow a team. A page with composition and construction gives design, buying and factory the same starting point.",
    how: "Begin on the homepage or marketplace, move into a collection or Best For page, and open fabrics that match the brief. Use discover topics when you need the vocabulary before the shortlist.",
    watch:
      "Do not say FabStitch is number one, the cheapest, or the biggest supplier network. Those claims are not established on the site.",
    choose:
      "Use it for discovery and inquiry. Use your own costing and testing for the decisions this site does not publish.",
    faqs: [
      {
        question: "What does FabStitch not claim?",
        answer:
          "It does not claim universal best-in-world status, invented review scores, or prices that are not on the fabric record.",
      },
    ],
  },
  {
    slug: "what-fabstitch-helps-you-discover",
    family: "brand",
    title: "What FabStitch Helps You Discover",
    h1: "What FabStitch helps buyers discover",
    description:
      "FabStitch helps buyers discover fabrics by material, construction, use and collection. See the public paths that already exist.",
    keyword: "FabStitch fabric discovery",
    imagePath: LINEN,
    imageAlt: "Linen fabric inside the FabStitch discovery path",
    relatedPaths: [
      "/discover/",
      "/collections/",
      "/fabrics/best-for/",
      "/guides/",
    ],
    what: "Buyers can discover cloth by collection, by Best For use, by guide, and by discover topics that explain a material or a comparison. Each path should land on a real page with its own intent, not on a keyword duplicate.",
    why: "Discovery fails when every link opens the same paragraph. The site separates hubs, fabric pages and educational topics so the next click answers a different question.",
    how: "Use the discover hub to browse topic groups, then follow a topic into a collection or a Best For page. Return through breadcrumbs rather than a dead end.",
    watch:
      "A discover page is not a second copy of a collection. Cotton as a collection stays at the collection URL. Related discover pages link to it.",
    choose:
      "Follow the path that matches your question: vocabulary, comparison, or a specific cloth.",
    faqs: [
      {
        question: "Are discover pages the same as fabric products?",
        answer:
          "No. Discover pages explain a topic and link to collections, guides and fabric pages. Product facts stay on the fabric page.",
      },
    ],
  },
  {
    slug: "using-fabstitch-for-production-research",
    family: "brand",
    title: "Using FabStitch for Production Research",
    h1: "Using FabStitch to research fabrics for production",
    description:
      "Use FabStitch to research production options from published specs, then inquire. A factual description of the storefront.",
    keyword: "FabStitch production research",
    imagePath: DENIM,
    imageAlt: "Production-weight denim researched on FabStitch",
    relatedPaths: [
      "/discover/fabric-specifications-for-production/",
      "/fabric-sourcing/",
      "/fabrics/",
      "/marketplace/",
    ],
    what: "Production research on FabStitch means gathering published facts before a commitment: which cloths share a construction, which uses they are grouped under, and which guides explain the words in the spec. It does not replace a mill trial.",
    why: "Research that starts from real pages avoids briefing a factory on a cloth the team has not actually identified.",
    how: "Build a short list of fabric URLs. Note only published fields. Add your quantity and tests in the inquiry. Keep discover pages as explanation, not as a substitute spec.",
    watch:
      "Research notes must not grow into fake certificates or fake price comparisons.",
    choose: "Use the site to narrow the field. Use sampling to approve it.",
    faqs: [
      {
        question: "Can research pages replace a fabric page?",
        answer:
          "No. Approve production against the fabric page and your sample, not against a general guide.",
      },
    ],
  },
  {
    slug: "cotton-versus-polyester",
    family: "comparison",
    title: "Cotton Versus Polyester",
    h1: "Cotton versus polyester",
    description:
      "Cotton and polyester solve different briefs. Compare hand, moisture, durability and when to choose each, without a universal winner.",
    keyword: "cotton vs polyester",
    imagePath: COTTON,
    imageAlt: "Cotton poplin used in a comparison with polyester",
    relatedPaths: [
      "/collections/cotton/",
      "/fabrics/",
      "/marketplace/",
      "/guides/",
    ],
    what: "Cotton is a natural cellulose fibre with a familiar dry-to-soft hand and broad apparel use. Polyester is a synthetic used where durability, shape retention or specific stretch blends are the point. They are not substitutes just because both can be woven.",
    why: "Buyers compare them for shirts, activewear and uniforms. The useful answer depends on whether the brief needs moisture comfort, easy recovery, or a natural hand.",
    how: "Read cotton collection pages and any polyester fabric page on FabStitch separately. Compare published composition before you compare photographs. A cotton-polyester blend is a third cloth, not a tie.",
    watch:
      "Do not claim one fibre is always more sustainable or always stronger. Those conclusions need test data this page does not invent.",
    choose:
      "Choose cotton when hand, breathability and a natural fibre story lead. Choose polyester when the published cloth offers the durability or recovery the garment needs.",
    faqs: [
      {
        question: "Is a blend the same as choosing both?",
        answer:
          "No. A blend has its own hand and care. Read the composition shares if they are published.",
      },
    ],
  },
  {
    slug: "silk-versus-satin",
    family: "comparison",
    title: "Silk Versus Satin",
    h1: "Silk versus satin",
    description:
      "Silk is a fibre. Satin is a weave. Learn the difference before you treat them as the same luxury cloth.",
    keyword: "silk vs satin",
    imagePath: SILK,
    imageAlt: "Silk cloth whose face should not be confused with every satin",
    relatedPaths: [
      "/collections/silk-sheer/",
      "/fabrics/",
      "/guides/",
      "/marketplace/",
    ],
    what: "Silk is a protein fibre. Satin is a weave that floats yarns to make a smooth face, and it can be made from silk or from other fibres. Calling every smooth cloth silk, or every silk a satin, mixes two different facts.",
    why: "A brief that says satin may accept a polyester satin. A brief that says silk is asking for the fibre. FabStitch pages should be read for which claim they actually make.",
    how: "Open the silk collection and read composition. If a cloth says satin, check whether the fibre is also stated. Keep those columns separate in your notes.",
    watch:
      "Sheen in a photograph is not proof of silk. Finish and weave both create shine.",
    choose:
      "Choose silk when the fibre matters. Choose a satin weave when the face and drape of that weave matter, and name the fibre beside it.",
    faqs: [
      {
        question: "Can satin be silk?",
        answer:
          "Yes. Silk satin is silk fibre in a satin weave. Satin without a fibre name is incomplete.",
      },
    ],
  },
  {
    slug: "denim-versus-twill",
    family: "comparison",
    title: "Denim Versus Twill",
    h1: "Denim versus twill",
    description:
      "Denim is a specific cotton twill tradition. Twill is the wider weave. See how to tell the two apart on FabStitch.",
    keyword: "denim vs twill",
    imagePath: DENIM,
    imageAlt: "Denim twill face compared with the broader twill idea",
    relatedPaths: [
      "/collections/denim/",
      "/fabrics/",
      "/marketplace/",
      "/guides/",
    ],
    what: "Twill is a weave with a diagonal float. Denim is usually a cotton twill with a particular face, yarn contrast and weight tradition used for jeans and related garments. All denim is twill-based. Not all twill is denim.",
    why: "A trouser brief that says twill might want gabardine or a cotton twill, not jeans cloth. A jeans brief that says twill might receive the wrong weight.",
    how: "Use the denim collection when the jeans tradition is the point. Use other woven collections when you need a twill that is not denim. Read the fabric name and construction, not only the diagonal in the photo.",
    watch:
      "Lightweight denim is still denim. It is not automatically a shirt poplin.",
    choose:
      "Choose denim for that cloth tradition. Choose another twill when you need the diagonal weave without the denim face and weight.",
    faqs: [
      {
        question: "Is every diagonal weave denim?",
        answer:
          "No. The diagonal shows twill. Denim needs the cotton denim cloth, not only the diagonal.",
      },
    ],
  },
  {
    slug: "viscose-versus-rayon",
    family: "comparison",
    title: "Viscose Versus Rayon",
    h1: "Viscose versus rayon",
    description:
      "Rayon is a family name and viscose is a common process inside it. Learn how FabStitch expects you to read the label.",
    keyword: "viscose vs rayon",
    imagePath: "/media/fabrics/linen-viscose-primary.webp",
    imageAlt: "Cellulosic cloth where the fibre label must be read carefully",
    relatedPaths: ["/fabrics/", "/guides/", "/marketplace/", "/collections/"],
    what: "Rayon is a broad name for regenerated cellulose fibres. Viscose is a common type within that language. In the market the words are sometimes swapped. They are not a licence to ignore the word printed on the fabric page.",
    why: "A buyer who treats the words as identical may mix a viscose twill with a different cellulosic and expect the same wet strength and hand.",
    how: "Quote the composition exactly as FabStitch publishes it. If you compare two pages, compare the written words, not a tidied synonym.",
    watch:
      "Do not merge this page into a generic natural versus synthetic article. The distinction is narrower and more useful.",
    choose:
      "Choose the cloth whose label matches the mill document you will later need. If the label is ambiguous, ask in the inquiry.",
    faqs: [
      {
        question: "Should I rewrite rayon as viscose?",
        answer:
          "No. Keep the page's wording unless a confirmed spec says otherwise.",
      },
    ],
  },
  {
    slug: "linen-versus-cotton-for-shirts",
    family: "comparison",
    title: "Linen Versus Cotton for Shirts",
    h1: "Linen versus cotton for shirts",
    description:
      "Linen and cotton both make shirts and feel different in heat, crease and structure. Choose by the shirt you are actually cutting.",
    keyword: "linen vs cotton shirts",
    imagePath: LINEN,
    imageAlt: "Linen shirting cloth compared with cotton shirting needs",
    relatedPaths: [
      "/collections/linen-lightweight/",
      "/collections/cotton/",
      "/fabrics/best-for/shirts/",
      "/fabrics/shirt-fabric/",
    ],
    what: "Cotton shirting, often poplin or oxford, is chosen for a cleaner surface and a more stable collar. Linen shirting is chosen for a dry, cool hand and a crease that many brands want as part of the look. Neither is the default summer shirt.",
    why: "Shirt programmes split on collar support and on how much wrinkle the customer expects. That is a design choice, not a quality ranking.",
    how: "Open the cotton and linen collections and the shirt Best For page. Compare published weights inside shirting constructions. Keep denim and jersey out of this comparison.",
    watch:
      "A linen-cotton blend is not pure linen and not pure cotton. Read the composition.",
    choose:
      "Choose cotton when the shirt needs a crisp, repeatable collar and placket. Choose linen when the dry hand and relaxed crease are the point of the shirt.",
    faqs: [
      {
        question: "Which is more breathable?",
        answer:
          "Both can feel cool. Judge the actual cloth's GSM and weave, not the fibre slogan alone.",
      },
    ],
  },
  {
    slug: "summer-fabric-selection",
    family: "selection",
    title: "Summer Fabric Selection",
    h1: "Selecting fabrics for warm weather",
    description:
      "Warm-weather cloth needs airflow, honest opacity and a wearable hand. See how to shortlist summer options on FabStitch.",
    keyword: "summer fabrics",
    imagePath: LINEN,
    imageAlt: "Lightweight linen considered for warm-weather clothing",
    relatedPaths: [
      "/collections/linen-lightweight/",
      "/collections/cotton/",
      "/fabrics/best-for/shirts/",
      "/fabrics/best-for/dresses/",
    ],
    what: "Warm-weather selection favours cloths that move air and do not cling, without becoming unintentionally sheer. Linen, lighter cottons and some cellulosics are common starting points. The season does not ban structure where a collar or waistband needs it.",
    why: "Summer failures are usually opacity and cling, not a missing trend colour. A beautiful light cloth that photographs the skin is the wrong outer layer.",
    how: "Start with lightweight linen and cotton collections, then check shirt and dress Best For pages. Read GSM and sheer notes where published.",
    watch:
      "Do not equate summer with the lowest GSM in the catalog. A slightly firmer cloth can still be the right warm-weather shirt.",
    choose:
      "Choose the cloth you can wear as a single layer in the colour you will actually cut, especially white and pale tones.",
    faqs: [
      {
        question: "Is linen always the summer choice?",
        answer:
          "No. Linen is a strong option. Cotton and other light cloths can fit the same season with a different crease and collar.",
      },
    ],
  },
  {
    slug: "winter-fabric-selection",
    family: "selection",
    title: "Winter Fabric Selection",
    h1: "Selecting fabrics for colder weather",
    description:
      "Colder-weather cloth needs cover, weight and a construction that blocks air. See how to look through FabStitch without guessing warmth.",
    keyword: "winter fabrics",
    imagePath: DENIM,
    imageAlt: "Heavier denim cloth considered for colder-weather garments",
    relatedPaths: [
      "/collections/denim/",
      "/collections/",
      "/fabrics/",
      "/guides/fabric-weight-and-gsm/",
    ],
    what: "Colder-weather clothing usually needs more cover: a heavier woven, a lined construction, or a knit with enough body. Warmth is a system of layers. One fabric page cannot promise a temperature rating the site does not publish.",
    why: "Buyers over-specify a single heavy cloth and then cannot move, or they under-specify and rely on a lining they have not chosen.",
    how: "Look at heavier collections such as denim and tailoring-related groups, read GSM, and decide whether the cloth is the shell or a layer. Use the weight guide before you lock a number.",
    watch:
      "Do not invent a tog or insulation value. If it is not on the page, it is not known here.",
    choose:
      "Choose weight and wind resistance for the outer layer, and a separate cloth for what sits underneath.",
    faqs: [
      {
        question: "Does a higher GSM mean a winter fabric?",
        answer:
          "It means more weight. Winter use still depends on construction, lining and the garment.",
      },
    ],
  },
];

function sectionsFor(spec: LibrarySpec): SemanticSection[] {
  return [
    {
      heading: "What this means",
      body: [spec.what],
    },
    {
      heading: "Why it matters when sourcing",
      body: [spec.why, spec.how],
    },
    {
      heading: `Applying ${spec.keyword} on FabStitch`,
      body: [
        `${spec.h1} stays separate from nearby topics because the decision is narrower than a general fabric overview. ${spec.what}`,
        `Write the constraint in the words a buyer can check, then open the related FabStitch page that already states it. ${spec.how} ${spec.choose}`,
        `Stop if a linked guide already answers this exact question, and use this page when it does not. ${spec.watch}`,
      ],
    },
    {
      heading: "What to avoid and how to choose",
      body: [spec.watch, spec.choose],
      keyPoints: [
        `Keep the decision tied to ${spec.keyword}, not to a swapped synonym.`,
        "Use only specs published on the fabric page.",
        "Inquire with quantity and end use when a cloth matches.",
      ],
    },
  ];
}

function wordCount(parts: string[]): number {
  return parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

export function buildLibraryPages(): {
  pages: SemanticPage[];
  rejected: { slug: string; reason: string }[];
} {
  const pages: SemanticPage[] = [];
  const rejected: { slug: string; reason: string }[] = [];
  const seen = new Set<string>();

  for (const spec of SPECS) {
    if (seen.has(spec.slug) || isReservedSemanticSlug(spec.slug)) {
      rejected.push({ slug: spec.slug, reason: "reserved_or_duplicate_slug" });
      continue;
    }
    seen.add(spec.slug);
    const pageSections = sectionsFor(spec);
    const count = wordCount([
      spec.title,
      spec.h1,
      spec.description,
      ...pageSections.flatMap((section) => [
        section.heading,
        ...section.body,
        ...(section.keyPoints ?? []),
      ]),
      ...spec.faqs.flatMap((faq) => [faq.question, faq.answer]),
    ]);
    const notes: string[] = [];
    if (count < 280) notes.push("insufficient_word_count");
    if (pageSections.length < 2) notes.push("too_few_sections");
    if (!spec.title.trim() || !spec.h1.trim() || !spec.description.trim()) {
      notes.push("missing_metadata");
    }
    const passed = notes.length === 0;
    pages.push({
      slug: spec.slug,
      path: `/discover/${spec.slug}/`,
      pageType:
        spec.family === "comparison"
          ? "comparison"
          : spec.family === "sourcing" || spec.family === "brand"
            ? "commercial"
            : "education",
      cluster:
        spec.family === "comparison"
          ? "comparison"
          : spec.family === "sourcing" || spec.family === "brand"
            ? "commercial"
            : "education",
      intent:
        spec.family === "sourcing" || spec.family === "brand"
          ? "commercial"
          : "informational",
      primaryKeyword: spec.keyword,
      secondaryKeywords: [spec.family, "FabStitch"],
      signature: `library|${spec.family}|${spec.slug}`,
      title: spec.title,
      h1: spec.h1,
      metaDescription: spec.description,
      eyebrow:
        spec.family === "comparison"
          ? "Fabric comparison"
          : spec.family === "glossary"
            ? "Fabric terminology"
            : spec.family === "brand"
              ? "About FabStitch"
              : "Fabric guidance",
      intro: spec.what,
      sections: pageSections,
      faqs: spec.faqs,
      relatedPaths: spec.relatedPaths,
      collectionSlugs: [],
      bestForSlugs: [],
      fabricQueryHints: [],
      ctaHeading: "Continue with published FabStitch fabrics",
      ctaBody:
        "Open the marketplace or a related collection, compare the specs that are actually published, and inquire when a cloth matches the brief.",
      wordCount: count,
      indexable: passed,
      qualityGatePassed: passed,
      qualityNotes: notes,
      imagePath: spec.imagePath,
      imageAlt: imageAlt(spec.imagePath),
    });
  }

  return {
    pages: pages.slice(0, ADDITIONAL_PAGE_CAPACITY),
    rejected,
  };
}
