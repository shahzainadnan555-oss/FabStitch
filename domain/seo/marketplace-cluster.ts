import { INDEXABLE_SEMANTIC_PAGES } from "@/domain/seo/semantic";
import { MATERIALS, USES } from "@/domain/seo/semantic/ontology";
import { imageAlt } from "@/domain/seo/image-assets";

/**
 * Marketplace support cluster.
 *
 * /marketplace/ stays the only canonical for the fabric-marketplace money
 * intent. These pages cover distinct buying, filtering, and sourcing
 * questions and link back to that hub. Material essays and fibre comparisons
 * stay on their existing discover/collection URLs.
 */
export const MARKETPLACE_CLUSTER_CAPACITY = 1000;

export type MarketplaceFamily =
  "education" | "b2b" | "buying" | "sourcing" | "journey" | "brand";

export type MarketplaceSupportPage = {
  slug: string;
  path: string;
  family: MarketplaceFamily;
  title: string;
  h1: string;
  description: string;
  primaryKeyword: string;
  imagePath: string;
  imageAlt: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
  faqs: { question: string; answer: string }[];
  relatedPaths: string[];
  wordCount: number;
  indexable: boolean;
  qualityNotes: string[];
};

type Spec = {
  slug: string;
  family: MarketplaceFamily;
  title: string;
  h1: string;
  description: string;
  keyword: string;
  imagePath: string;
  imageAlt: string;
  relatedPaths: string[];
  intro: string;
  evaluate: string;
  act: string;
  limit: string;
  faqs: { question: string; answer: string }[];
  generated?: boolean;
};

const COTTON = "/media/fabrics/cotton-poplin-primary.webp";
const LINEN = "/media/fabrics/european-flax-linen-primary.webp";
const DENIM = "/media/fabrics/lightweight-denim-primary.webp";
const JERSEY = "/media/hero-navy-jersey.jpg";

const SPECS: readonly Spec[] = [
  {
    slug: "what-is-a-fabric-marketplace",
    family: "education",
    title: "What Is a Fabric Marketplace",
    h1: "What a fabric marketplace is",
    description:
      "A fabric marketplace is a place to compare documented cloths and start an inquiry. See how that works on FabStitch.",
    keyword: "what is a fabric marketplace",
    imagePath: COTTON,
    imageAlt:
      "Cotton poplin listed for comparison in the FabStitch marketplace",
    relatedPaths: ["/marketplace/", "/fabrics/", "/collections/", "/guides/"],
    intro:
      "A fabric marketplace is a commercial catalog where a buyer can search documented cloth, compare composition and construction, and take a next step such as an inquiry. It is not a dictionary of fibre names and it is not a promise that every cloth has the same price or lead time.",
    evaluate:
      "On FabStitch the marketplace at /marketplace/ is that catalog. Search and filters narrow published fabrics. Each fabric page holds the specs that were actually recorded. Collections and Best For pages group cloth by material or garment so you are not starting from a blank search every time.",
    act: "Use the marketplace when you already know you need cloth and want to see real FabStitch options. Use a guide or a discover topic when you still need the vocabulary for GSM, weave, or drape, then come back to search.",
    limit:
      "Do not treat the marketplace as a ranking of the world's best fabrics. FabStitch does not publish star ratings or a claim to be the largest network. Filtered search URLs stay noindex so the clean marketplace URL remains the commercial canonical.",
    faqs: [
      {
        question: "Is the marketplace the same as a fabric guide?",
        answer:
          "No. Guides explain a decision. The marketplace lists published fabrics you can open and inquire on.",
      },
    ],
  },
  {
    slug: "how-a-fabric-marketplace-works",
    family: "education",
    title: "How a Fabric Marketplace Works",
    h1: "How the FabStitch marketplace works",
    description:
      "Search, filter, open a fabric, and inquire. A plain account of the FabStitch marketplace path.",
    keyword: "how a fabric marketplace works",
    imagePath: LINEN,
    imageAlt: "Linen fabric a buyer can open from marketplace search",
    relatedPaths: [
      "/marketplace/",
      "/how-it-works/",
      "/fabrics/",
      "/fabric-sourcing/",
    ],
    intro:
      "The FabStitch marketplace works as a search-and-filter catalog. You describe a fibre, construction, season, weight, or use. The server returns published fabrics that match. You open a card to read the cloth, then inquire if it fits the brief.",
    evaluate:
      "Filters are calculated from the current catalog, not from a private spreadsheet. Sort and pagination stay on the marketplace URL as query states. Those filtered views are not separate indexable pages. The canonical commercial page is always /marketplace/.",
    act: "Start with one or two constraints, not ten. If the grid is empty, remove a filter. If a cloth looks right, read composition and construction on its fabric page before you write the inquiry.",
    limit:
      "The marketplace does not invent supplier certificates, prices, or shrinkage numbers that are absent from the fabric record. How it works describes the customer path. It does not add hidden services.",
    faqs: [
      {
        question: "Do filters create new marketplace pages for Google?",
        answer:
          "No. Filter and search states are noindex. Only the clean marketplace URL is the commercial canonical.",
      },
    ],
  },
  {
    slug: "how-to-buy-fabric",
    family: "buying",
    title: "How to Buy Fabric",
    h1: "How to buy fabric on FabStitch",
    description:
      "Buying fabric on FabStitch means finding a documented cloth and sending an inquiry. The public path is discovery, not a guessed checkout.",
    keyword: "how to buy fabric on FabStitch",
    imagePath: COTTON,
    imageAlt: "Cotton cloth selected before a FabStitch inquiry",
    relatedPaths: [
      "/marketplace/",
      "/guides/how-to-buy-fabric-online/",
      "/how-it-works/",
      "/fabrics/",
    ],
    intro:
      "To buy fabric on FabStitch, identify the cloth in the marketplace, confirm the published spec, and inquire with quantity and end use. The guide on how to buy fabric online explains the wider decision. This page is only the marketplace sequence.",
    evaluate:
      "Search the marketplace, open two or three fabrics, and keep the one whose composition and construction match the pattern. Do not buy from a colour photo alone. Width, GSM, and fibre have to be the ones written on the page.",
    act: "When the cloth is a real candidate, use the inquiry path. Name the fabric, the quantity, and what you are making. The wholesale page covers bulk context. It does not replace the fabric you selected.",
    limit:
      "This is not a second copy of the buying guide and it is not a price list. If a price or minimum is not on the fabric page, do not invent it in the inquiry.",
    faqs: [
      {
        question: "Can every fabric be checked out instantly?",
        answer:
          "The public commercial step is an inquiry tied to a fabric page. Follow that path rather than assuming instant checkout.",
      },
    ],
  },
  {
    slug: "how-to-source-fabric",
    family: "sourcing",
    title: "How to Source Fabric",
    h1: "How to source fabric in the marketplace",
    description:
      "Sourcing on FabStitch starts in the marketplace, then moves to a fabric page and an inquiry. Here is that sequence.",
    keyword: "how to source fabric in the marketplace",
    imagePath: DENIM,
    imageAlt: "Denim shortlisted while sourcing fabric for production",
    relatedPaths: [
      "/marketplace/",
      "/fabric-sourcing/",
      "/collections/",
      "/guides/",
    ],
    intro:
      "Sourcing fabric in the marketplace means building a shortlist you can describe: fibre, construction, weight, and garment. The fabric sourcing page explains the commercial frame. This page explains how to use search and collections without leaving the marketplace mindset.",
    evaluate:
      "Name the garment first. Then search or open a collection. Reject cloths that do not publish the field you need. Two fabrics that only share a colour are not a shortlist.",
    act: "Link each keeper to its fabric URL. Add quantity when you inquire. If you still need GSM vocabulary, read the weight guide, then return to /marketplace/.",
    limit:
      "Do not open a second sourcing canonical that repeats the fabric sourcing page word for word. This page stays on the search-and-shortlist step.",
    faqs: [
      {
        question: "Where should a sourcing brief start?",
        answer:
          "Start on the marketplace or a collection, then freeze specs from a fabric page.",
      },
    ],
  },
  {
    slug: "how-to-compare-fabrics",
    family: "buying",
    title: "How to Compare Fabrics",
    h1: "How to compare fabrics in the marketplace",
    description:
      "Compare fabrics on the same fields: fibre, construction, weight, and use. Do not crown a universal winner.",
    keyword: "how to compare fabrics in the marketplace",
    imagePath: LINEN,
    imageAlt: "Linen cloth compared with other marketplace fabrics by spec",
    relatedPaths: [
      "/marketplace/",
      "/guides/",
      "/discover/how-to-compare-two-fabrics/",
      "/collections/",
    ],
    intro:
      "Comparing fabrics in the marketplace means holding the garment still and reading the same rows on each fabric page. Fibre versus fibre belongs on a discover comparison when one already exists, such as cotton versus linen. This page is the method, not another copy of those essays.",
    evaluate:
      "Open two marketplace results. Write composition, construction, and GSM if published. Leave a cell blank rather than guessing. A blend is a third cloth, not a tie between the other two.",
    act: "Keep the cloth that matches the constraint you cannot drop, such as opacity for a white shirt. Then inquire. Follow a discover comparison only when you need the fibre essay.",
    limit:
      "Do not publish marketplace URLs that repeat an existing cotton-versus-linen or silk-versus-satin page. Those intents already have canonicals.",
    faqs: [
      {
        question: "Should a comparison name the best fabric?",
        answer:
          "No. Say which cloth fits which constraint. A universal best usually means a missing constraint.",
      },
    ],
  },
  {
    slug: "how-to-choose-fabric",
    family: "buying",
    title: "How to Choose Fabric",
    h1: "How to choose a fabric from the marketplace",
    description:
      "Choose fabric from the garment, then the construction, then the marketplace result. A practical FabStitch sequence.",
    keyword: "how to choose fabric from the marketplace",
    imagePath: COTTON,
    imageAlt: "Marketplace cotton options narrowed for a garment brief",
    relatedPaths: [
      "/marketplace/",
      "/fabrics/best-for/shirts/",
      "/fabrics/best-for/dresses/",
      "/guides/",
    ],
    intro:
      "Choosing fabric from the marketplace starts with the thing you are making. A shirt, a dress, and a workwear layer do not share one correct cloth. Best For pages name those uses. The marketplace is where you see the published fabrics behind them.",
    evaluate:
      "Pick the use, note two constraints such as woven and breathable, and search. Read the fabric page before you fall in love with the thumbnail. Hand words on the page are more useful than a generic premium label.",
    act: "If two results read the same, keep one. If you need a fibre explanation, open the related collection or discover topic, then come back to inquire on a specific fabric.",
    limit:
      "Choosing is not the same article as evaluating quality or as GSM selection. Those are separate pages because the question is different.",
    faqs: [
      {
        question: "Should I choose fibre or construction first?",
        answer:
          "Name the garment, then construction, then fibre. Colour comes after the cloth can actually be cut.",
      },
    ],
  },
  {
    slug: "how-to-find-fabric-for-production",
    family: "sourcing",
    title: "How to Find Fabric for Production",
    h1: "How to find fabric for production",
    description:
      "Production sourcing needs a repeatable spec. Use the marketplace to find it, then inquire with quantity.",
    keyword: "find fabric for production",
    imagePath: DENIM,
    imageAlt: "Production-weight denim found through marketplace filters",
    relatedPaths: [
      "/marketplace/",
      "/fabric-sourcing/",
      "/discover/choosing-fabric-for-manufacturing/",
      "/fabrics/",
    ],
    intro:
      "Finding fabric for production means locating a cloth you can describe again: one construction, one weight target, one width if it is published. The marketplace is the search step. A discover note on manufacturing explains the wider choice. This page stays on finding the record.",
    evaluate:
      "Filter until the grid is a family, not a mood board. Drop results that omit the spec field you will hand to a factory. Keep a backup in the same construction.",
    act: "Copy only published fields into your sheet and link the fabric URL. Add quantity in the inquiry. Do not convert a marketplace thumbnail into a certificate.",
    limit:
      "FabStitch does not calculate marker yield or publish a universal metreage per garment. Estimate after width is known.",
    faqs: [
      {
        question: "What if GSM is missing?",
        answer:
          "Do not invent it. Ask in the inquiry or choose a cloth whose weight is published.",
      },
    ],
  },
  {
    slug: "how-to-source-fabric-for-a-clothing-brand",
    family: "b2b",
    title: "Fabric Sourcing for Clothing Brands",
    h1: "How clothing brands source fabric on FabStitch",
    description:
      "Clothing brands can shortlist marketplace fabrics by use and spec before they inquire. A brand-specific path.",
    keyword: "fabric marketplace for clothing brands",
    imagePath: LINEN,
    imageAlt: "Linen fabric shortlisted for a clothing brand programme",
    relatedPaths: [
      "/marketplace/",
      "/collections/",
      "/fabrics/best-for/shirts/",
      "/discover/sourcing-fabric-for-clothing-brands/",
    ],
    intro:
      "A clothing brand sources against a silhouette and a season. The marketplace lets the team see published cloth instead of a private board of unnamed swatches. The discover page on sourcing for brands explains the brief. This page is how to run that brief through marketplace search.",
    evaluate:
      "Split the line into uses: shirts, dresses, tailoring. Search or open Best For for one use at a time. Keep one primary construction per style before you add a contrast fabric.",
    act: "Share fabric URLs, not screenshots. The spec on the page is what design and production can both read. Inquire when the standard is describable.",
    limit:
      "Do not turn a trend word into a bulk spec. If the page does not say washed, brushed, or stretch, the brand story does not imply it.",
    faqs: [
      {
        question: "Should a brand start in collections or search?",
        answer:
          "Collections when the material story is already chosen. Search when the constraint is a use or a weight.",
      },
    ],
  },
  {
    slug: "how-to-source-fabric-for-manufacturing",
    family: "b2b",
    title: "Fabric Sourcing for Manufacturers",
    h1: "How manufacturers use the fabric marketplace",
    description:
      "Manufacturers need repeatable marketplace specs, not inspiration alone. How to search FabStitch before an inquiry.",
    keyword: "fabric marketplace for manufacturers",
    imagePath: DENIM,
    imageAlt: "Denim spec reviewed for a manufacturing inquiry",
    relatedPaths: [
      "/marketplace/",
      "/fabric-sourcing/",
      "/discover/sourcing-fabric-for-manufacturers/",
      "/guides/fabric-weight-and-gsm/",
    ],
    intro:
      "Manufacturers use the marketplace to find cloth that can be named on a cutting ticket. Inspiration is optional. Composition, construction, and weight are not. This is a different job from the clothing-brand page, which starts from a silhouette.",
    evaluate:
      "Search the construction you already sew. Open the fabric page and copy only printed facts. If elastane is not listed, do not assume stretch. If width is absent, mark it unknown.",
    act: "Inquire with quantity, garment, and the fabric URL. Keep the backup cloth in the same construction so a second lot does not change the needle and interlining plan.",
    limit:
      "No page here invents a factory minimum, a lead time, or a test report.",
    faqs: [
      {
        question: "What belongs in a factory inquiry?",
        answer:
          "The fabric URL, published composition and construction, target weight, garment, and quantity.",
      },
    ],
  },
  {
    slug: "b2b-fabric-marketplace",
    family: "b2b",
    title: "B2B Fabric Marketplace",
    h1: "Using FabStitch as a B2B fabric marketplace",
    description:
      "FabStitch is a B2B fabric marketplace for discovering documented cloth and inquiring. What that does and does not mean.",
    keyword: "B2B fabric marketplace",
    imagePath: COTTON,
    imageAlt: "Commercial cotton fabric available to browse on FabStitch",
    relatedPaths: [
      "/marketplace/",
      "/fabric-sourcing/",
      "/wholesale-fabric/",
      "/how-it-works/",
    ],
    intro:
      "A B2B fabric marketplace is a catalog built for businesses that need to specify cloth, not only admire it. FabStitch's commercial hub is /marketplace/. Businesses search published fabrics, read specs, and inquire. That is the supported path.",
    evaluate:
      "Teams use it when design, buying, and production need the same fabric URL. Collections explain a material story. The marketplace shows the cloths currently published behind that story.",
    act: "Start at the marketplace, narrow with real filters, and leave with a shortlist of URLs. Wholesale context lives on the wholesale fabric page if the conversation is about bulk.",
    limit:
      "Do not describe FabStitch as the number-one, cheapest, or largest marketplace. Those claims are not on the site. Filtered URLs are not extra B2B landing pages.",
    faqs: [
      {
        question: "Which URL is the B2B marketplace?",
        answer:
          "https://fabstitch.net/marketplace/ is the canonical commercial page. Supporting articles do not replace it.",
      },
    ],
  },
  {
    slug: "fabric-sourcing-for-apparel-production",
    family: "sourcing",
    title: "Fabric Sourcing for Apparel Production",
    h1: "Sourcing fabric for apparel production",
    description:
      "Apparel production sourcing needs a marketplace shortlist you can repeat. How to get there on FabStitch.",
    keyword: "fabric sourcing for apparel production",
    imagePath: JERSEY,
    imageAlt: "Jersey fabric considered for apparel production",
    relatedPaths: [
      "/marketplace/",
      "/fabrics/clothing/",
      "/fabrics/apparel/",
      "/fabric-sourcing/",
    ],
    intro:
      "Apparel production sourcing connects a pattern to a cloth the line can repeat. The marketplace is where you test whether a woven shirt cloth and a jersey are even in the same search. They should not be. This page is about that production filter, not about a single fibre.",
    evaluate:
      "Separate wovens and knits before you compare GSM. Use clothing and apparel hubs for the range, then the marketplace for the actual cards. Read construction on every keeper.",
    act: "Freeze one construction per style. Inquire with quantity. Send the fabric page, not a description that could match fifty cloths.",
    limit:
      "Production research on a discover page does not replace this search step, and this page does not replace the fabric record.",
    faqs: [
      {
        question: "Can one search cover shirts and activewear?",
        answer:
          "It can, and it will mix constructions. Search one garment family at a time.",
      },
    ],
  },
  {
    slug: "how-to-evaluate-fabric",
    family: "buying",
    title: "How to Evaluate Fabric",
    h1: "How to evaluate a fabric before you inquire",
    description:
      "Evaluate a marketplace fabric by whether its page is consistent: composition, construction, weight, and photo.",
    keyword: "how to evaluate fabric",
    imagePath: LINEN,
    imageAlt: "Linen fabric page reviewed before an inquiry",
    relatedPaths: [
      "/marketplace/",
      "/fabrics/",
      "/guides/",
      "/fabric-sourcing/",
    ],
    intro:
      "Evaluating a fabric on FabStitch means checking that the written spec and the photograph agree, and that the spec matches the brief. It is not a star rating. The site does not publish review scores.",
    evaluate:
      "Read composition, then construction, then weight. Look for contradictions, such as a sheer photo on a cloth described as canvas. If the page is consistent, the cloth is a candidate for a sample or an inquiry.",
    act: "Write down only what the page says. Ask about shrinkage, elastane, or finish if the brief depends on them and the page is silent.",
    limit:
      "Quality is fitness for the brief, not a leaderboard. Do not add testimonials or prices that were never published.",
    faqs: [
      {
        question: "Does a sharper photo mean better cloth?",
        answer:
          "No. Lighting changes texture. Use the written spec as the record.",
      },
    ],
  },
  {
    slug: "how-to-select-fabric-by-gsm",
    family: "buying",
    title: "How to Select Fabric by GSM",
    h1: "How to select fabric by GSM",
    description:
      "Use GSM inside one construction when you filter the marketplace. The number is not a quality score.",
    keyword: "select fabric by GSM",
    imagePath: COTTON,
    imageAlt: "Cotton cloth whose weight should be read as GSM",
    relatedPaths: [
      "/marketplace/",
      "/guides/fabric-weight-and-gsm/",
      "/discover/what-fabric-gsm-means/",
      "/fabrics/",
    ],
    intro:
      "Selecting by GSM means using weight as a filter after construction is fixed. The marketplace accepts weight bounds. A 110 GSM voile and a 110 GSM jersey are not the same result even when the number matches.",
    evaluate:
      "Set a range, not a single lucky gram, unless a fabric page states one. Compare results that share a construction. Read the GSM guide if the unit itself is unfamiliar. The discover page on what GSM means is the definition. This page is the filter.",
    act: "When the grid matches the garment's weight, open the fabric and confirm the published GSM. Inquire with that number attached so the follow-up cannot drift.",
    limit:
      "Do not sort the whole catalog by GSM and call the heaviest cloth the best.",
    faqs: [
      {
        question: "Where do I filter weight?",
        answer:
          "On the marketplace, using the weight controls. Filtered URLs are for you. They are not extra indexable pages.",
      },
    ],
  },
  {
    slug: "how-to-select-fabric-for-shirts",
    family: "buying",
    title: "How to Select Shirt Fabric",
    h1: "How to select shirt fabric",
    description:
      "Shirt fabric needs a stable collar cloth and honest opacity. Start from Best For shirts, then the marketplace.",
    keyword: "select shirt fabric",
    imagePath: COTTON,
    imageAlt: "Cotton poplin suited to shirt selection",
    relatedPaths: [
      "/marketplace/",
      "/fabrics/best-for/shirts/",
      "/fabrics/shirt-fabric/",
      "/collections/cotton/",
    ],
    intro:
      "Shirt selection is about collar support, placket stability, and opacity in the colour you will cut. The Best For shirts page and the shirt fabric page own that garment story. The marketplace is where you see the published shirt cloths and compare them.",
    evaluate:
      "Prefer a woven with a stated construction such as poplin or oxford unless the style is a knit shirt. Check pale colours for cover. Linen and cotton can both be right. They are not the same crease.",
    act: "Shortlist from the shirt pages, open marketplace results if you need to widen the set, and inquire on one fabric URL.",
    limit:
      "This page does not repeat the full cotton-versus-linen essay. Follow that comparison if the fibre is the remaining question.",
    faqs: [
      {
        question: "Is every cotton a shirt cloth?",
        answer:
          "No. Denim, canvas, and fleece can be cotton and still be the wrong shirt construction.",
      },
    ],
  },
  {
    slug: "how-to-select-fabric-for-dresses",
    family: "buying",
    title: "How to Select Dress Fabric",
    h1: "How to select dress fabric",
    description:
      "Dress fabric depends on drape and lining. Use the dress pages, then confirm the cloth in the marketplace.",
    keyword: "select dress fabric",
    imagePath: LINEN,
    imageAlt: "Fluid linen considered for a dress",
    relatedPaths: [
      "/marketplace/",
      "/fabrics/best-for/dresses/",
      "/fabrics/dress-fabric/",
      "/collections/silk-sheer/",
    ],
    intro:
      "Dress selection turns on drape, opacity, and whether the cloth is the outer layer. A structured shirting and a fluid dress cloth answer different patterns. Best For dresses and the dress fabric page hold that guidance. The marketplace shows candidates.",
    evaluate:
      "Decide if the dress needs to fall or to hold a shape. Then search. Sheer cloths need a lining plan. Do not judge opacity only on a dark photo.",
    act: "Keep the shortlist inside one drape family. Inquire when the lining question is answered or explicitly asked.",
    limit:
      "Shirt selection and dress selection stay separate pages because collar stability and skirt drape are different tests.",
    faqs: [
      {
        question: "Can I use shirt poplin for a dress?",
        answer:
          "Only if the pattern wants that crisp hand. Many dress blocks need more drape than poplin gives.",
      },
    ],
  },
  {
    slug: "how-to-select-fabric-for-uniforms",
    family: "buying",
    title: "How to Select Uniform Fabric",
    h1: "How to select uniform fabric",
    description:
      "Uniform cloth needs durability and a spec you can repeat. Search the marketplace with that constraint, not a trend word.",
    keyword: "select uniform fabric",
    imagePath: DENIM,
    imageAlt: "Durable cloth reviewed for uniform selection",
    relatedPaths: [
      "/marketplace/",
      "/fabrics/best-for/",
      "/fabrics/",
      "/fabric-sourcing/",
    ],
    intro:
      "Uniform selection favours cloth that survives repeated wear and can be reordered against a written spec. It is not the same brief as a fashion dress or a one-off shirt. Search for durable constructions and read what the fabric page actually claims.",
    evaluate:
      "Look for a stable weave, a published composition, and a weight that matches the uniform's layer. Do not assume stain resistance or a corporate colour standard unless it is written down.",
    act: "Inquire with quantity and the wear context, such as daily workwear versus a lighter staff shirt. Keep the backup in the same construction.",
    limit:
      "Workwear and uniforms overlap, but a heavy workwear layer and a light staff shirt should not share one page or one search.",
    faqs: [
      {
        question: "Does durable mean denim?",
        answer:
          "No. Denim is one option. Other twills and blends can be durable when the page says so.",
      },
    ],
  },
  {
    slug: "how-to-select-fabric-for-workwear",
    family: "buying",
    title: "How to Select Workwear Fabric",
    h1: "How to select workwear fabric",
    description:
      "Workwear fabric is chosen for abrasion and repeatability. Use marketplace specs, not a fashion collection alone.",
    keyword: "select workwear fabric",
    imagePath: DENIM,
    imageAlt: "Workwear-weight denim with a visible twill face",
    relatedPaths: [
      "/marketplace/",
      "/collections/denim/",
      "/fabrics/",
      "/fabric-sourcing/",
    ],
    intro:
      "Workwear selection asks what will scuff, what must bend, and what must be bought again next season. Denim and other sturdy wovens are common starts when the page describes that weight. A lightweight dress linen is a different search.",
    evaluate:
      "Filter toward heavier wovens. Read construction. Confirm the cloth is the shell, not a lining. GSM helps only inside that sturdy family.",
    act: "Shortlist two fabrics you can tell apart on weight and face. Inquire with the job the garment does, not only the style name.",
    limit:
      "This is not the uniform page. Uniforms may be lighter staff cloth. Workwear here means the tougher layer.",
    faqs: [
      {
        question: "Should I start in the denim collection?",
        answer:
          "Yes if the twill tradition fits. Then check the marketplace for neighbouring constructions before you decide.",
      },
    ],
  },
  {
    slug: "how-to-discover-fabrics",
    family: "journey",
    title: "How to Discover Fabrics",
    h1: "How to discover fabrics",
    description:
      "Discover fabrics through the marketplace, collections, and Best For pages. Each path answers a different question.",
    keyword: "how to discover fabrics",
    imagePath: COTTON,
    imageAlt: "Fabrics arranged for discovery by material and use",
    relatedPaths: [
      "/marketplace/",
      "/discover/",
      "/collections/",
      "/fabrics/best-for/",
    ],
    intro:
      "Discovery on FabStitch is more than one URL. The marketplace searches published cloth. Collections group a material. Best For groups a garment. Discover topics explain a word or a comparison. Use the path that matches the question.",
    evaluate:
      "If you know the constraint, search the marketplace. If you know the material story, open a collection. If you know the garment, open Best For. If you do not know the word GSM yet, read a guide first.",
    act: "End discovery on a fabric page. A topic page is not a product. The commercial canonical for browsing the catalog remains /marketplace/.",
    limit:
      "Do not create a discover URL that only repeats the marketplace grid. The grid already has a canonical.",
    faqs: [
      {
        question: "Which page should I bookmark?",
        answer:
          "Bookmark /marketplace/ for search, and bookmark a fabric URL once you have chosen a cloth.",
      },
    ],
  },
  {
    slug: "how-to-filter-fabrics",
    family: "journey",
    title: "How to Filter Fabrics",
    h1: "How to filter fabrics",
    description:
      "Marketplace filters narrow published fabrics. Learn which filters help and why filtered URLs are not extra SEO pages.",
    keyword: "how to filter fabrics",
    imagePath: JERSEY,
    imageAlt: "Jersey fabric found after narrowing marketplace filters",
    relatedPaths: ["/marketplace/", "/fabrics/", "/guides/", "/how-it-works/"],
    intro:
      "Filtering is how you turn the marketplace grid into a comparable set. Fibre, construction, season, weight, colour, and Best For use are applied on the server from the published catalog. A useful filter removes cloths that cannot meet the brief.",
    evaluate:
      "Add one filter at a time. If the set goes empty, the combination is too tight or that cloth is not published. Weight filters should follow construction, or you will mix voile with jersey.",
    act: "Use filters to choose, then open a fabric. Do not share a long filtered URL as the public canonical. Share /marketplace/ or the fabric page.",
    limit:
      "Filtered marketplace URLs are noindex on purpose. Publishing each filter combination would be an infinite doorway set.",
    faqs: [
      {
        question: "Why are filter URLs not in the sitemap?",
        answer:
          "They are query states of one catalog, not separate articles. The sitemap lists the clean marketplace URL.",
      },
    ],
  },
  {
    slug: "how-to-prepare-a-fabric-inquiry",
    family: "journey",
    title: "How to Prepare a Fabric Inquiry",
    h1: "How to prepare a fabric inquiry",
    description:
      "A useful inquiry names the marketplace fabric, the quantity, and the end use. Leave unpublished claims out.",
    keyword: "prepare a fabric inquiry",
    imagePath: COTTON,
    imageAlt: "Cotton fabric page used as the source of an inquiry",
    relatedPaths: [
      "/marketplace/",
      "/how-it-works/",
      "/fabric-sourcing/",
      "/fabrics/",
    ],
    intro:
      "An inquiry should point at one fabric page you found in the marketplace. It should say how much you need and what you are making. It should not invent a price, a certificate, or a lead time the page never stated.",
    evaluate:
      "Before you send it, check that composition and construction on the page still match the brief. If you need several cloths, keep each inquiry attached to its own fabric so the specs do not blur.",
    act: "Use the inquiry path described in how it works. Repeat published facts plus your quantity. The discover note on preparing an inquiry is the general checklist. This page is the marketplace version of that step.",
    limit:
      "Sending an inquiry is not proof of stock, price, or a completed order.",
    faqs: [
      {
        question: "What if I have not chosen a fabric yet?",
        answer:
          "Stay in the marketplace until one fabric page is the candidate. A vague inquiry matches too many cloths.",
      },
    ],
  },
  {
    slug: "why-use-fabstitch",
    family: "brand",
    title: "Why Use FabStitch",
    h1: "Why businesses use the FabStitch marketplace",
    description:
      "Businesses use FabStitch to browse documented fabrics and inquire. A factual reason, without unsupported superlatives.",
    keyword: "why use FabStitch marketplace",
    imagePath: COTTON,
    imageAlt:
      "FabStitch cotton fabric shown as a documented marketplace record",
    relatedPaths: [
      "/",
      "/marketplace/",
      "/how-it-works/",
      "/discover/why-businesses-use-fabstitch/",
    ],
    intro:
      "Businesses use the FabStitch marketplace when they want a public fabric URL with composition and construction, not an unnamed swatch. The homepage introduces the brand. This page explains the commercial reason to start at /marketplace/.",
    evaluate:
      "The useful part is a shared record for design and production. Collections, guides, and discover topics support that record. They do not outrank it as the place to search cloth.",
    act: "Use the marketplace to build the shortlist. Use sampling and your own costing for decisions the site does not publish.",
    limit:
      "There is no claim here that FabStitch is the best, the cheapest, or the largest marketplace.",
    faqs: [
      {
        question: "What should I not expect?",
        answer:
          "Invented reviews, invented prices, and a promise that every filter combination is a landing page.",
      },
    ],
  },
  {
    slug: "how-fabstitch-helps-buyers",
    family: "brand",
    title: "How FabStitch Helps Buyers",
    h1: "How FabStitch helps buyers discover fabrics",
    description:
      "FabStitch helps buyers move from a garment question to a published fabric and an inquiry. The paths that exist today.",
    keyword: "how FabStitch helps buyers",
    imagePath: LINEN,
    imageAlt: "Buyer discovery path from linen cloth to a fabric page",
    relatedPaths: ["/marketplace/", "/discover/", "/collections/", "/guides/"],
    intro:
      "FabStitch helps buyers by separating search, explanation, and the fabric record. You can learn a term, browse a collection, and still land on one marketplace result with a spec. Help is the structure, not a ranking badge.",
    evaluate:
      "Buyers who already know the cloth should search the marketplace. Buyers who know only the garment should open Best For. Buyers who know only the fibre should open a collection and then search.",
    act: "The last click should be a fabric page or an inquiry. Supporting articles, including this one, link back to the marketplace so the commercial page stays the hub.",
    limit:
      "Helping buyers discover options is not the same as guaranteeing a mill match or a price.",
    faqs: [
      {
        question: "Where do I start if I am new?",
        answer:
          "Read this page, then open the marketplace and try one search with a fibre or a use you actually need.",
      },
    ],
  },
];

const RESERVED_SLUGS = new Set(["fabrics", "marketplace"]);

function words(parts: string[]): number {
  return parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

function shingles(text: string): Set<string> {
  const tokens = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 3);
  const grams = new Set<string>();
  for (let index = 0; index < tokens.length - 2; index += 1) {
    grams.add(`${tokens[index]} ${tokens[index + 1]} ${tokens[index + 2]}`);
  }
  return grams;
}

function tooSimilar(left: Set<string>, right: Set<string>): boolean {
  if (left.size < 8 || right.size < 8) return false;
  let overlap = 0;
  const [small, large] = left.size < right.size ? [left, right] : [right, left];
  for (const gram of small) if (large.has(gram)) overlap += 1;
  const union = left.size + right.size - overlap;
  return union > 0 && overlap / union > 0.62;
}

function pageFromSpec(spec: Spec): MarketplaceSupportPage {
  const sections = [
    { heading: "How this uses the marketplace", body: [spec.evaluate] },
    { heading: "What to do next", body: [spec.act] },
    { heading: "Limits", body: [spec.limit] },
    {
      heading: `Using “${spec.keyword}” in a brief`,
      body: [
        spec.intro,
        `${spec.h1} stays on one question. The marketplace at /marketplace/ is still the catalog. This page does not add a price, a certificate, or a count of suppliers.`,
        `After you read the limit — ${spec.limit} — open a fabric page and copy the composition and construction into the inquiry. Leave GSM blank if that page does not publish weight.`,
        `Teams use this note when they need language for ${spec.keyword}. They still have to look at the cloth. A heading is not a spec.`,
      ],
    },
  ];
  const count = words([
    spec.title,
    spec.h1,
    spec.description,
    spec.intro,
    ...sections.flatMap((section) => [section.heading, ...section.body]),
    ...spec.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ]);
  const notes: string[] = [];
  if (count < 300) notes.push("thin");
  if (!spec.title || !spec.h1 || !spec.description)
    notes.push("missing_metadata");
  if (!spec.imageAlt.trim()) notes.push("missing_alt");
  return {
    slug: spec.slug,
    path: `/marketplace/${spec.slug}/`,
    family: spec.family,
    title: spec.title,
    h1: spec.h1,
    description: spec.description,
    primaryKeyword: spec.keyword,
    imagePath: spec.imagePath,
    imageAlt: imageAlt(spec.imagePath),
    intro: spec.intro,
    sections,
    faqs: spec.faqs,
    relatedPaths: ["/marketplace/", ...spec.relatedPaths].filter(
      (path, index, all) => all.indexOf(path) === index,
    ),
    wordCount: count,
    indexable: notes.length === 0,
    qualityNotes: notes,
  };
}

export type MarketplaceClusterReport = {
  candidates: number;
  published: number;
  rejected: number;
  capacity: number;
  byFamily: Record<string, number>;
  rejectionReasons: Record<string, number>;
  cannibalization: string[];
};

function ownedKeywords(): Set<string> {
  const owned = new Set<string>();
  owned.add("fabric marketplace");
  owned.add("wholesale fabric");
  owned.add("fabric sourcing");
  for (const page of INDEXABLE_SEMANTIC_PAGES) {
    owned.add(page.primaryKeyword.toLowerCase());
    owned.add(page.title.toLowerCase());
  }
  return owned;
}

function semanticFingerprints(): Set<string>[] {
  return INDEXABLE_SEMANTIC_PAGES.map((page) =>
    shingles(
      [page.intro, ...page.sections.flatMap((section) => section.body)].join(
        " ",
      ),
    ),
  );
}

export function buildMarketplaceCluster(): {
  pages: MarketplaceSupportPage[];
  report: MarketplaceClusterReport;
} {
  const reasons: Record<string, number> = {};
  const bump = (reason: string) => {
    reasons[reason] = (reasons[reason] ?? 0) + 1;
  };
  const owned = ownedKeywords();
  const pages: MarketplaceSupportPage[] = [];
  const fingerprints: Set<string>[] = [];
  const titles = new Set<string>();
  const h1s = new Set<string>();
  const descriptions = new Set<string>();
  const keywords = new Set<string>();
  const cannibalization: string[] = [];
  const existingCopy = semanticFingerprints();
  let rejected = 0;

  const consider = (
    page: MarketplaceSupportPage,
    keyword: string,
    generated = false,
  ) => {
    if (generated) {
      rejected += 1;
      bump("existing_canonical");
      return;
    }
    if (RESERVED_SLUGS.has(page.slug) || page.path === "/marketplace/") {
      rejected += 1;
      bump("reserved");
      return;
    }
    const key = keyword.toLowerCase();
    if (owned.has(key) || keywords.has(key)) {
      rejected += 1;
      cannibalization.push(page.slug);
      bump("cannibalization");
      return;
    }
    if (
      titles.has(page.title.toLowerCase()) ||
      h1s.has(page.h1.toLowerCase()) ||
      descriptions.has(page.description.toLowerCase())
    ) {
      rejected += 1;
      bump("duplicate_metadata");
      return;
    }
    if (!page.indexable) {
      rejected += 1;
      bump(page.qualityNotes[0] ?? "quality");
      return;
    }
    const fingerprint = shingles(
      [page.intro, ...page.sections.flatMap((section) => section.body)].join(
        " ",
      ),
    );
    if (
      fingerprints.some((existing) => tooSimilar(existing, fingerprint)) ||
      existingCopy.some((existing) => tooSimilar(existing, fingerprint))
    ) {
      rejected += 1;
      bump("near_duplicate");
      return;
    }
    if (pages.length >= MARKETPLACE_CLUSTER_CAPACITY) {
      rejected += 1;
      bump("capacity");
      return;
    }
    titles.add(page.title.toLowerCase());
    h1s.add(page.h1.toLowerCase());
    descriptions.add(page.description.toLowerCase());
    keywords.add(key);
    fingerprints.push(fingerprint);
    pages.push(page);
  };

  for (const spec of SPECS) consider(pageFromSpec(spec), spec.keyword);

  // Proposed ontology pages are candidates. They are published only when they
  // do not copy an existing discover/collection intent.
  for (const material of MATERIALS) {
    const keyword = `${material.label.toLowerCase()} vs marketplace listing`;
    consider(
      pageFromSpec({
        slug: `${material.id}-marketplace-listing`,
        family: "sourcing",
        title: `${material.label} Marketplace Listing`,
        h1: `Find ${material.label.toLowerCase()} in the marketplace`,
        description: `Search the FabStitch marketplace for ${material.label.toLowerCase()} fabrics, then open a fabric page before you inquire.`,
        keyword,
        imagePath: material.imageHint,
        imageAlt: `${material.label} fabric used as a marketplace example`,
        relatedPaths: [
          "/marketplace/",
          material.collectionSlug
            ? `/collections/${material.collectionSlug}/`
            : "/collections/",
          "/fabrics/",
        ],
        intro: `If you already know you want ${material.label.toLowerCase()}, the marketplace is a search, not a second essay. ${material.buyerNotes}`,
        evaluate: material.fiberNotes,
        act: material.constructionNotes,
        limit: material.weightNotes,
        faqs: [
          {
            question: `Does this replace the ${material.label} collection?`,
            answer:
              "No. Use the collection or discover topic for the fibre story, and the marketplace to see published cloths.",
          },
        ],
        generated: true,
      }),
      keyword,
      true,
    );
  }

  for (const use of USES) {
    const keyword = `marketplace fabric for ${use.label}`;
    consider(
      pageFromSpec({
        slug: `marketplace-for-${use.id}`,
        family: "buying",
        title: `Marketplace Fabric for ${use.label}`,
        h1: `Search the marketplace for ${use.label} fabric`,
        description: `Use FabStitch marketplace search when you are making ${use.label}. Read the Best For page first if one exists.`,
        keyword,
        imagePath: COTTON,
        imageAlt: `Fabric search for ${use.label}`,
        relatedPaths: [
          "/marketplace/",
          use.bestForSlug
            ? `/fabrics/best-for/${use.bestForSlug}/`
            : "/fabrics/best-for/",
          "/fabrics/",
        ],
        intro: use.buyerNotes,
        evaluate: use.weightGuidance,
        act: use.constructionGuidance,
        limit: use.seasonalNotes,
        faqs: [
          {
            question: `Is there a Best For page for ${use.label}?`,
            answer: use.bestForSlug
              ? "Yes. Read it, then return to the marketplace to see published fabrics."
              : "Use the marketplace search and the fabrics hub rather than inventing a Best For URL.",
          },
        ],
        generated: true,
      }),
      keyword,
      true,
    );
  }

  const byFamily: Record<string, number> = {};
  for (const page of pages)
    byFamily[page.family] = (byFamily[page.family] ?? 0) + 1;

  return {
    pages,
    report: {
      candidates: SPECS.length + MATERIALS.length + USES.length,
      published: pages.length,
      rejected,
      capacity: MARKETPLACE_CLUSTER_CAPACITY,
      byFamily,
      rejectionReasons: reasons,
      cannibalization,
    },
  };
}

const CLUSTER = buildMarketplaceCluster();

export const MARKETPLACE_SUPPORT_PAGES = CLUSTER.pages;
export const MARKETPLACE_CLUSTER_REPORT = CLUSTER.report;

export function getMarketplaceSupportPage(
  slug: string,
): MarketplaceSupportPage | undefined {
  return MARKETPLACE_SUPPORT_PAGES.find((page) => page.slug === slug);
}
