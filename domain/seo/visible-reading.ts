/**
 * Visible reading used by both the page and the SEO word-count audit.
 * Every paragraph is rendered. Do not count text that the page does not show.
 */

export function countWords(value: string): number {
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed ? trimmed.split(" ").length : 0;
}

export function countParts(parts: readonly string[]): number {
  return countWords(parts.join(" "));
}

type FabricNoteInput = {
  name: string;
  composition: readonly string[];
  construction: readonly string[];
  characteristics: readonly string[];
  applications: readonly string[];
  seasons: readonly string[];
  collection: string;
  gsm: string | null;
  siblings: readonly string[];
};

export function fabricNotes(input: FabricNoteInput): string[] {
  const name = input.name;
  const composition = input.composition.length
    ? input.composition.join("; ")
    : "not stated on this page";
  const construction = input.construction.length
    ? input.construction.join(", ")
    : "not stated beyond the fabric name";
  const gsm = input.gsm ?? "not published";
  const uses = input.applications.length
    ? input.applications.join(", ")
    : "not assigned in the source";
  const seasons = input.seasons.length
    ? input.seasons.join(", ")
    : "not stated";
  const character = input.characteristics.length
    ? input.characteristics.join(", ")
    : "not separately described";
  const siblings = input.siblings.length
    ? input.siblings.join(", ")
    : "no other named fabric in the same collection";
  return [
    `${name} is a named cloth in the FabStitch catalog, filed in the ${input.collection} collection. The published composition is ${composition}. Construction is ${construction}. Weight, where the reference gives it, is ${gsm}. Those three cells are the brief. A fibre name by itself does not tell you the hand, the cover, or the end use.`,
    `Documented uses for ${name} are ${uses}. A use label means the sourcing reference mentions that application. It is not a guarantee that every colour, finish, or width will suit the garment. Read this page, then inquire on this URL rather than on the collection as a whole.`,
    `Season context published for ${name} is ${seasons}. Seasonal labels describe the collection direction. They are not a promise that every colourway is available, and they are not a quality score. Character recorded here: ${character}. Those words describe the reference, not a lab result.`,
    `Other named fabrics in ${input.collection} include ${siblings}. Each has its own page. Do not copy a GSM, a finish, or a composition from one onto ${name}. If a sibling looks close, open it and compare the published cells before you decide they are interchangeable.`,
    `A buyer shortlisting ${name} should write composition (${composition}), construction (${construction}), and weight (${gsm}) into the inquiry. If a cell is blank here, leave it blank. FabStitch does not estimate a missing measurement, a price, a certificate, or a supplier count on this page.`,
    `${name} is one product on the marketplace, not a category and not a filter. Search can group it with other ${input.collection} fabrics, but the cloth you inquire on should be this page. Filtered marketplace URLs are not the address to share.`,
    `When ${name} is compared with another fabric, compare construction first, then the stated weight, then the documented uses. Overlapping fibre names across collections are common. The product name is the unit of comparison, not the family label.`,
    `Care, width, and finish only belong in the brief for ${name} when this page states them. Otherwise keep the note to the published composition and the uses listed above, and confirm anything else with the fabric page rather than with a general guide.`,
  ];
}

export function collectionNotes(input: {
  label: string;
  products: readonly {
    name: string;
    composition: string;
    uses: string;
  }[];
}): string[] {
  const names = input.products.map((product) => product.name);
  const listed = names.length
    ? names.join(", ")
    : "the fabrics published in it";
  const lines = input.products.map(
    (product) =>
      `${product.name} is published here with composition ${product.composition || "not stated"} and documented uses ${product.uses || "not assigned"}. Open that fabric page before you copy a spec into a brief.`,
  );
  return [
    `The ${input.label} collection groups named FabStitch fabrics that share a material direction. It is not a single cloth and it is not a price list. The fabrics in this edit are ${listed}.`,
    `Use the collection when the fibre or the character is the starting point. Use a Best For page when the garment is already fixed. Use the marketplace when you need to search across collections. An inquiry should still name one fabric URL.`,
    `Construction and weight change the cloth more than the collection title. Two fabrics in ${input.label} can share a fibre and still differ in hand, cover, and GSM. Compare the published cells. Do not infer a measurement that a fabric page omits.`,
    ...lines,
    `${input.label} does not add certificates, supplier counts, or inventory. If a fabric page leaves a field blank, the collection does not fill it in. Return to the marketplace only after you have a shortlist of named cloths. The inquiry names one fabric from ${listed}, not the collection title.`,
  ];
}

export function bestForNotes(input: {
  label: string;
  introduction: readonly string[];
  products: readonly {
    name: string;
    composition: string;
    gsm: string | null;
  }[];
}): string[] {
  const names = input.products.map((product) => product.name).join(", ");
  const lines = input.products.map(
    (product) =>
      `${product.name} is in this ${input.label} edit. Published composition: ${product.composition || "not stated"}. Weight: ${product.gsm ?? "not published"}. The use label does not replace those cells.`,
  );
  return [
    ...input.introduction,
    `This Best For edit is for ${input.label}. The named fabrics are ${names || "listed on the page when the catalog publishes them"}. A garment family is a way to start, not a proof that every cloth in the list will sew the same way.`,
    `Compare construction before weight. A lighter cloth and a heavier cloth can both be filed under ${input.label} and still answer different briefs. Leave GSM blank when the fabric page does not publish it.`,
    ...lines,
    `After the shortlist, open the fabric page and inquire there. This edit does not set a price, a minimum, or a certificate. Related Best For pages are neighbouring garment families, not substitutes. For ${input.label}, write the composition you actually read and leave weight as “not published” when that is what the fabric page says.`,
    `If two cloths in ${input.label} look alike, the difference is in construction or GSM, not in the shared use label. Keep one fabric URL in the brief until that comparison is done.`,
  ];
}

export function seasonalNotes(input: {
  title: string;
  introduction: readonly string[];
  products: readonly { name: string; composition: string }[];
}): string[] {
  const lines = input.products.map(
    (product) =>
      `${product.name} is part of ${input.title}. Its published composition is ${product.composition || "not stated"}. Treat it as its own fabric page, not as a colourway of the season title.`,
  );
  return [
    ...input.introduction,
    `${input.title} is a seasonal reading of the catalog, not a new marketplace. The cloths named here already live in their material collections. Use the season to narrow a direction, then read each fabric.`,
    ...lines,
    `Seasonal language does not add a price, a certificate, or a count of suppliers. If you need a specification, the fabric page is the source. If you need a fibre group, open the related collection linked from this page.`,
  ];
}

export function directoryNotes(input: {
  label: string;
  description: string;
  page: number;
  items: readonly { h1: string }[];
}): string[] {
  const names = input.items.map((item) => item.h1);
  const listed = names.length ? names.join(", ") : input.label;
  const explanations = input.items.map(
    (item) =>
      `${item.h1} is one topic on this ${input.label} page. Read it for that subject only. It does not set a price, a certificate, or a supplier count, and it is not a substitute for the next title in ${input.label}. If ${item.h1} matches the decision, open it, then go to a fabric or collection page when you need a published specification.`,
  );
  return [
    input.description,
    `Page ${input.page} of the ${input.label} directory lists ${listed}. Each title is its own page. Use the list to choose a subject, not to treat the directory as a product.`,
    `These notes explain a fabric question. The marketplace remains the catalog. Share a topic URL when the reader needs the explanation, and a fabric URL when the reader needs the cloth.`,
    ...explanations,
    `If you searched for ${input.label.toLowerCase()}, stay with the titles on this page until one of them matches. Widening the query before you read ${names[0] ?? input.label} usually mixes a different decision into the same brief.`,
  ];
}

export type PillarReading = {
  heading: string;
  paragraphs: readonly string[];
};

const PILLARS: Record<string, PillarReading> = {
  "/": {
    heading: "What you can do on FabStitch",
    paragraphs: [
      "FabStitch is a B2B fabric marketplace for discovering cloth and preparing a sourcing inquiry. The public site is organised around named fabrics, material collections, Best For uses, guides, and discovery topics. It is not a private mood board and it is not a ranking of suppliers.",
      "Start on the marketplace when you already know you want to search. Start on Fabrics when you want the catalog explained by collection and use. Start on Collections when the fibre or the character is the first decision. Start on Best For when the garment is already fixed, such as shirts, dresses, or outerwear.",
      "A fabric page is the unit of comparison. It shows the composition, construction, and weight the catalog actually publishes, plus the uses the sourcing reference documents. If a cell is blank, the page does not estimate it. An inquiry should name that fabric URL rather than a filtered search.",
      "Guides answer one subject, such as GSM or a comparison between two materials. Discovery topics do the same for a narrower question and link back to the marketplace. Question pages answer one fabric question and stop there. None of those pages replace the cloth you will inquire on.",
      "Wholesale and fabric-sourcing pages describe how a business can use the catalog. They do not invent a minimum, a price, or a certificate. Contact and Support are for a question about a fabric, an account, or how the product works. Help articles stay short because they are instructions, not search essays.",
      "Use internal links to move from a hub to a named fabric, then back to a collection or a guide when the brief still has an open question. The sitemap lists indexable pages once. Canonicals point at the page itself unless a URL is a genuine duplicate.",
    ],
  },
  "/marketplace/": {
    heading: "How this marketplace is meant to be used",
    paragraphs: [
      "A fabric marketplace, on FabStitch, is the commercial catalog: search, open a fabric, and inquire. Topic pages around it explain one search question. They are not a second catalog and they do not add a price, a certificate, or a supplier count.",
      "Buyers typically arrive with a material, a garment, or a weight band. Search supports material, construction, season, and Best For use. Keep one construction in view before you compare GSM. Heavier is not better, and a fibre name is not a construction.",
      "Collections group cloth by material direction, such as cotton, linen, silk, denim, or technical outerwear. Best For edits group the same catalog by garment. Use both, then return here to see the published fabrics. Share the marketplace URL or a specific fabric URL. Filtered states are not the address to send.",
      "Evaluation is the fabric page: composition, construction, stated weight, and documented uses. Leave a cell blank if that page leaves it blank. Guides on GSM, cotton versus linen, and woven versus knit are there when the brief needs the definition before the shortlist.",
      "Business use is a sourcing workflow, not a checkout promise. Discover the cloth, read the specification, choose the quantity you actually need, and submit an inquiry on that fabric. The marketplace does not invent inventory, lead time, or a factory minimum.",
      "Related reading sits in the topic directories below: materials, comparisons, use cases, weight, and buyer roles. Open one note, then come back to the catalog. The note explains the question. The fabric page is the cloth.",
    ],
  },
  "/fabrics/": {
    heading: "What the fabrics catalog contains",
    paragraphs: [
      "FabStitch fabrics are named cloths with a published composition and, where the reference gives them, a construction, a weight, and a use. The fabrics hub is the map. It points at collections, Best For edits, guides, and the marketplace. It is not a substitute for the fabric page.",
      "Materials in the catalog include linen and linen blends, cotton, silk and sheer cloths, wool and tailoring fabrics, knits, denim, performance cloth, and home textiles. A material family is a way to browse. Two cottons can still differ in weave, GSM, and hand.",
      "Construction is the next cell after fibre. Woven, knit, and the named fabric type change drape and cover more than the collection title. Weight, in grams per square metre when the page publishes GSM, is a planning range for that cloth, not a quality score.",
      "Use cases are documented applications such as shirting, dresses, tailoring, outerwear, or home textiles. They help you start. They do not prove that every fabric in a use edit will sew the same way. Open the fabric and read the cells.",
      "Sourcing context stays on the marketplace and on the fabric page. This hub explains what you can explore. An inquiry still names one cloth. Guides cover GSM, comparisons, and how to read a specification. Discovery topics cover a narrower question and link back here.",
      "Related pages are the collections, the Best For index, fabric questions, and the marketplace search. Follow the one that matches the decision in front of you, then stop at the fabric page when you need the specification.",
    ],
  },
  "/collections/": {
    heading: "How collections are organised",
    paragraphs: [
      "A FabStitch collection groups named fabrics that share a material direction. Linen and lightweight cloth, cotton, silk and sheer, tailoring, knitwear, performance, autumn-winter textures, velvet and pile, structured classics, technical outerwear, denim, and home and contract are the material edits. Seasonal readings sit beside them and point at the same fabrics.",
      "Use a collection when the fibre or the character is the first decision. Use Best For when the garment is already fixed. Use the marketplace when you need to search across groups. The collection is not a single product and it is not a price list.",
      "Inside a collection, compare construction and stated weight. Fabrics that share a fibre can still differ in hand and cover. Each fabric has its own page. Do not copy a GSM from one name onto another.",
      "Discovery topics and guides explain a question the collection title cannot answer, such as GSM or cotton versus linen. Question pages answer one definition. They link back to a collection when the next step is a cloth.",
      "Open the collection that matches the brief, read the named fabrics, and inquire on the fabric URL. Filtered marketplace links are for browsing. The canonical address of a collection is the collection page itself.",
      "Related collections are neighbouring material groups, not substitutes. If the garment matters more than the fibre, leave this index and start from Best For instead.",
    ],
  },
  "/about/": {
    heading: "What FabStitch is for",
    paragraphs: [
      "FabStitch exists so a business can discover fabric and compare cloth before it sends an inquiry. The work is material-first: composition, construction, weight, and documented use sit on the fabric page in the same shape, instead of arriving as a different attachment in every email.",
      "The audience is B2B. Apparel, fashion, and manufacturing teams use the marketplace to find a named cloth, read what the catalog actually publishes, and inquire with a quantity. The site does not claim to be the largest marketplace, and it does not publish a supplier count.",
      "Discovery is the public catalog: collections, Best For edits, guides, and topic pages. Sourcing is the step after that, when the brief names a fabric URL. Those are different pages on purpose. A guide explains a term. A fabric page is the cloth.",
      "Comparison is easier when the missing cell stays missing. FabStitch does not invent a price, a certificate, a test result, or a lead time to make two fabrics look complete. If the reference does not state it, the page does not state it.",
      "The product translates intent. A team may know it is making shirts before it knows the weave. Best For and search exist for that path. A team may know it wants linen before it knows the garment. Collections exist for that path. Both end on a fabric page.",
      "About is not a history and not a set of statistics. It describes the job the storefront is built to do: make the material decision readable, then let the inquiry carry the commercial question.",
    ],
  },
  "/how-it-works/": {
    heading: "The path from search to inquiry",
    paragraphs: [
      "The customer path on FabStitch follows the pages that already exist. You discover fabrics from the homepage, a collection, a Best For edit, or search. You browse the marketplace. You open a fabric page and read the specification the catalog publishes.",
      "Search uses material, construction, season, and use. Filters narrow the catalog. A filtered URL is for your own browsing. The address to share is the marketplace or a specific fabric page.",
      "On the fabric page, evaluate composition, construction, and weight or measurement when they are published. Best For guidance on that page points at the garment edits that include the cloth. Related fabrics are other named products, not variants invented for the page.",
      "Quantity is part of the inquiry, not a stock promise. Choose the quantity you need and submit the inquiry on that fabric. The product does not invent a factory minimum, a price, or a lead time on this explanation.",
      "Guides sit beside the path when a term is unclear: what GSM means, how two materials differ, how to read a weave. Question pages answer one question. They are optional. The required step is still the fabric page before the inquiry.",
      "Account, cart, and checkout are not this explanation. How it works describes discovery, search, specification, and inquiry, because those are the public steps a buyer can complete from the catalog.",
    ],
  },
  "/contact/": {
    heading: "When to contact FabStitch",
    paragraphs: [
      "Contact FabStitch when the question is about a fabric you are looking at, a sourcing brief, an account, or how buyers use the marketplace. The public path is this page and the support page. The published contact email is the address shown here. This page does not add a phone number.",
      "A useful inquiry names the fabric URL, the composition and construction you are comparing, and the quantity you have in mind. If the fabric page leaves weight blank, say so rather than guessing a GSM. The same applies to finish, width, and care.",
      "Businesses can use contact for a sourcing question that search did not answer, or for help understanding a collection, a Best For edit, or a guide. It is not a channel for a private supplier list, a certificate FabStitch does not publish, or a price the catalog does not show.",
      "Support is the right next step when the question needs the context of an existing inquiry, an order, or an account. Help articles cover the short instructions for search and inquiries. They stay separate from this page.",
      "If you are still choosing cloth, start on the marketplace or a collection and come back with the fabric name. A message that names the page is faster to answer than a message that only names a fibre.",
      "Contact does not change the catalog. It is how you ask about it. The fabric page remains the specification, and the inquiry on that fabric remains the commercial step.",
    ],
  },
  "/guides/": {
    heading: "How to use the guides",
    paragraphs: [
      "FabStitch guides answer one subject you need before you shortlist cloth: weight and GSM, composition, weave, a comparison such as cotton versus linen, or how to source for a clothing brand. Each guide links to the fabrics and Best For edits that match its subject.",
      "Read the guide when the term is the question. Open the marketplace when you need to see published fabrics. A guide does not add a price, a certificate, or a measurement the fabric page omits.",
      "Fabric questions are a separate set of short answers, one question per page. Use them for a definition. Use a guide when the subject needs a longer explanation, a comparison, or a sourcing step.",
      "Guides cite the catalog they are written against. If a fabric is named, follow the link and read that page. Do not treat the guide as a newer specification than the fabric page.",
      "The index lists every published guide. Category filters on this page are a browsing aid. The canonical address of the index is this URL without a query.",
      "After the guide, the next useful page is usually a collection, a Best For edit, or the marketplace. Pick the one that matches whether you are starting from a fibre, a garment, or a search.",
    ],
  },
  "/discover/": {
    heading: "How discovery topics relate to the catalog",
    paragraphs: [
      "Discovery topics are narrow pages about a material, a use, an attribute, a construction, or a comparison. They exist so a specific question has an address. They are not extra products, and they do not replace the marketplace.",
      "Directories below group those topics. Open a directory, then open one title. The title is the subject. A neighbouring title is a different decision, even when the words overlap.",
      "Material topics explain a fibre in the FabStitch ontology and point at collections. Use-case topics explain a garment. Attribute topics explain a constraint such as weight class or hand. Comparison topics put two real materials side by side and do not crown a winner.",
      "When the note is enough, go to the marketplace or a named fabric. When it is not, try another topic in the same directory rather than widening the search into a different question.",
      "Pagination is part of the directory, not a new subject. Page two of a cluster continues the same list. Each page canonicals to itself so the titles stay distinct.",
      "Discovery does not invent search volume, rankings, or supplier counts. It organises questions the catalog can actually support, and it links back to fabrics, collections, guides, and the marketplace.",
    ],
  },
  "/fabrics/best-for/": {
    heading: "Choosing by use instead of by fibre",
    paragraphs: [
      "Best For groups FabStitch fabrics by the application the sourcing reference documents: shirts, dresses, trousers, tailoring, activewear, knitwear, resortwear, occasionwear, outerwear, home textiles, upholstery, and bedding. The edit is a starting list, not a ranking.",
      "Use this index when the garment or the product is already known and the fibre is not. Use a collection when the fibre is known and the garment is not. Both paths end on a fabric page.",
      "Inside an edit, compare composition, construction, and stated weight. Two shirt fabrics can be a crisp cotton and a linen. They are both documented for shirting and they are not interchangeable.",
      "The marketplace can filter by the same use. The Best For page is the readable version of that group, with the fabrics named. Share this page or a fabric URL, not a filtered search.",
      "Guides linked from an edit explain a term that edit depends on, such as weight or a comparison. They do not replace the fabric list.",
      "A use label does not add a price, a certificate, or a minimum. If the fabric page omits GSM, the Best For page does not invent one.",
    ],
  },
};

export function pillarReading(path: string): PillarReading | undefined {
  const reading = PILLARS[path];
  if (!reading) return undefined;
  const extra = PILLAR_EXTRA[path];
  if (!extra) return reading;
  return {
    heading: reading.heading,
    paragraphs: [...reading.paragraphs, ...extra],
  };
}

const PILLAR_EXTRA: Record<string, readonly string[]> = {
  "/": [
    "From the homepage, the useful next click is the marketplace, a collection, or a Best For edit. Guides and fabric questions are there when a term is still unclear. None of them replace the fabric page you will inquire on.",
  ],
  "/marketplace/": [
    "A practical pass looks like this: search by material or use, open two fabric pages, compare the published composition and construction, and inquire on one URL. Topic notes under this page explain the question. They are not extra products.",
    "Collections and Best For edits are the two ways to narrow the same catalog. Use the one that matches whether you started from a fibre or from a garment, then come back here if you still need to search.",
  ],
  "/fabrics/": [
    "The fabrics hub is a map, not a specification. Named cloths live on their own pages, with composition and weight only where the reference published them. Use this page to choose a collection or a use, then leave it.",
    "Marketplace search is the other door. It does not change the fabric page you will end on.",
  ],
  "/collections/": [
    "Seasonal collections read the same catalog by season. They do not create a second set of fabrics. If a material edit and a seasonal edit both name a cloth, the fabric page is still the specification.",
    "Denim, technical outerwear, and home textiles are collections because the end use changes the brief. Open the edit that matches the product, then compare the named fabrics inside it rather than the index.",
    "The collection URL is the canonical address. Do not send a filtered marketplace link in its place.",
  ],
  "/about/": [
    "The storefront you can use today is the marketplace, the fabric pages, the collections, and the inquiry on a named cloth. About does not add a history, a headcount, or a claim that FabStitch is first in any market.",
    "Contact is for a question about that path. It is not a second about page.",
  ],
  "/how-it-works/": [
    "If a step is not on the site, it is not part of this path. There is no hidden checkout in this explanation, and there is no supplier score. Discover, read the fabric page, and inquire with the quantity you need.",
    "Help articles cover the short instructions. This page is the overview of the same path, from discovery through the inquiry. Quantity is entered on the inquiry, not estimated on this page, and a filtered search is not the link to share.",
  ],
  "/contact/": [
    "Include the page URL you were reading. A message about “linen” is harder to answer than a message about a named fabric. Support handles an existing inquiry or account. This page is for the question that has not become one yet.",
    "Do not send private account details in a public note. Use the email on this page or Support.",
  ],
  "/guides/": [
    "Each guide has one subject. The GSM guide does not also answer cotton versus linen, and the comparison does not also answer how to inquire. Follow the related fabric links when you are ready to look at cloth.",
    "Category filters on this index only change which cards you see. The canonical page is the unfiltered guide index, and each guide keeps its own address.",
    "Fabric questions sit beside the guides. Use a question for one definition and a guide when the subject needs the longer note. The guide index does not repeat those answers.",
  ],
  "/discover/": [
    "Directories are lists of topics, not lists of products. Open one title, read that page, and use its links into a collection or the marketplace. Page two of a directory continues the same list. It is not a new subject.",
    "If a topic title is close to a guide you have already read, prefer the guide when it is the broader explanation and the topic when the question is narrower. Do not merge them into one brief.",
    "The discover index is the map of those directories. Each directory page is the list. Each topic page is the note.",
  ],
  "/fabrics/best-for/": [
    "Shirts, dresses, trousers, tailoring, and outerwear are garment edits. Bedding, upholstery, and home textiles are product edits. The rule is the same: the use gets you the list, and the fabric page gets you the specification.",
    "Search can filter by the same use. This index is the readable version, with the fabrics named. Share a Best For URL or a fabric URL, not a filtered marketplace link.",
    "A short list is still a real edit. Upholstery or bedding may name fewer cloths than shirting. That is the catalog, not a missing page. Compare what is published and leave the rest blank.",
    "When the use is right and the fibre is still open, stay on this index. When the fibre is right, switch to collections.",
  ],
};
