/**
 * Generate FabStitch keyword map (≥1000 real-intent fabric keywords).
 *
 * Metrics (Volume, Difficulty, Current Rank) are ALWAYS "TBD" until a verified
 * SEMrush / GSC / Keyword Planner export is imported. This script never invents
 * rankings or volumes.
 *
 * Usage:
 *   node --import=./scripts/register-loader.mjs scripts/seo/generate-keyword-map.mts
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { FABRICS_2027 } from "@/catalog/fabrics-2027";
import { COLLECTIONS } from "@/catalog/collections";
import { SEO_USE_CASES } from "@/catalog/use-cases";
import { CURATED_FABRIC_SLUGS } from "@/catalog/discovery";
import { BEST_FOR } from "@/catalog/best-for";
import { CATALOG_GUIDES } from "@/content/guides";
import { EDUCATION_GUIDES } from "@/content/guides-education";

type Intent = "Informational" | "Commercial" | "Transactional" | "Navigational";

type Row = {
  keyword: string;
  country: string;
  volume: string;
  difficulty: string;
  currentRank: string;
  intent: Intent;
  cluster: string;
  targetUrl: string;
  contentType: string;
  priority: "P0" | "P1" | "P2" | "P3";
  status: string;
};

const OUT = path.resolve("docs/seo/fabstitch-keyword-map.csv");
const COUNTRIES = [
  "GLOBAL",
  "US",
  "UK",
  "CA",
  "PK",
  "IN",
  "BD",
  "TR",
  "IT",
  "FR",
  "SG",
] as const;

const curated = new Set(CURATED_FABRIC_SLUGS as readonly string[]);

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function normalize(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function humanize(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bGsm\b/g, "GSM")
    .replace(/\bAw\b/g, "AW")
    .replace(/\bSs\b/g, "SS");
}

const rows: Row[] = [];
const seen = new Set<string>();

function add(
  input: Omit<Row, "volume" | "difficulty" | "currentRank"> &
    Partial<Pick<Row, "volume" | "difficulty" | "currentRank">>,
) {
  const keyword = normalize(input.keyword);
  if (!keyword || keyword.length < 3) return;
  // Drop meaningless ultra-short noise and pure duplicates.
  const key = `${keyword}|${input.country}`;
  if (seen.has(key)) return;
  seen.add(key);
  rows.push({
    keyword,
    country: input.country,
    volume: "TBD",
    difficulty: "TBD",
    currentRank: "TBD",
    intent: input.intent,
    cluster: input.cluster,
    targetUrl: input.targetUrl,
    contentType: input.contentType,
    priority: input.priority,
    status: input.status,
  });
}

function addGlobal(
  partial: Omit<Row, "country" | "volume" | "difficulty" | "currentRank">,
) {
  add({ ...partial, country: "GLOBAL" });
}

// ---------------------------------------------------------------------------
// Seed commercial / discovery universe
// ---------------------------------------------------------------------------
const MARKETPLACE_SEEDS: Array<[string, Intent, "P0" | "P1" | "P2"]> = [
  ["fabric", "Commercial", "P0"],
  ["fabrics", "Commercial", "P0"],
  ["fabric online", "Commercial", "P0"],
  ["buy fabric online", "Transactional", "P0"],
  ["fabric marketplace", "Commercial", "P0"],
  ["online fabric marketplace", "Commercial", "P0"],
  ["fabric store", "Commercial", "P0"],
  ["online fabric store", "Commercial", "P0"],
  ["fabric supplier", "Transactional", "P0"],
  ["fabric suppliers", "Transactional", "P0"],
  ["textile supplier", "Transactional", "P0"],
  ["textile suppliers", "Transactional", "P1"],
  ["fabric sourcing", "Commercial", "P0"],
  ["fabric sourcing platform", "Commercial", "P0"],
  ["fabric sourcing online", "Commercial", "P0"],
  ["online fabric sourcing", "Commercial", "P0"],
  ["fabric wholesale", "Transactional", "P0"],
  ["wholesale fabric", "Transactional", "P0"],
  ["wholesale fabrics", "Transactional", "P0"],
  ["bulk fabric", "Transactional", "P1"],
  ["bulk fabrics", "Transactional", "P1"],
  ["textile sourcing", "Commercial", "P0"],
  ["textile sourcing company", "Commercial", "P1"],
  ["fabric supplier online", "Transactional", "P0"],
  ["wholesale textile supplier", "Transactional", "P1"],
  ["fabric for clothing production", "Commercial", "P1"],
  ["fabric for fashion designers", "Commercial", "P1"],
  ["fabric for apparel manufacturers", "Transactional", "P1"],
  ["fabric supplier for clothing brands", "Transactional", "P0"],
  ["fabric supplier for boutiques", "Transactional", "P1"],
  ["fabric supplier for manufacturers", "Transactional", "P1"],
  ["fabric sourcing for fashion brands", "Commercial", "P0"],
  ["fabric wholesale supplier", "Transactional", "P1"],
  ["find fabric online", "Commercial", "P1"],
  ["source fabric online", "Commercial", "P0"],
  ["compare fabrics online", "Commercial", "P1"],
  ["fabric catalog online", "Commercial", "P1"],
  ["textile marketplace", "Commercial", "P1"],
  ["fashion fabric supplier", "Transactional", "P1"],
  ["apparel fabric supplier", "Transactional", "P1"],
  ["b2b fabric marketplace", "Commercial", "P1"],
  ["b2b fabric sourcing", "Commercial", "P1"],
  ["order fabric online", "Transactional", "P1"],
  ["inquire fabric online", "Transactional", "P2"],
  ["fabric inquiry platform", "Commercial", "P2"],
];

for (const [keyword, intent, priority] of MARKETPLACE_SEEDS) {
  addGlobal({
    keyword,
    intent,
    cluster: "Fabric Marketplace",
    targetUrl: "/marketplace/",
    contentType: "money",
    priority,
    status: "mapped",
  });
}

addGlobal({
  keyword: "fabstitch",
  intent: "Navigational",
  cluster: "Brand",
  targetUrl: "/",
  contentType: "brand",
  priority: "P0",
  status: "mapped",
});
addGlobal({
  keyword: "fab stitch",
  intent: "Navigational",
  cluster: "Brand",
  targetUrl: "/",
  contentType: "brand",
  priority: "P1",
  status: "mapped",
});
addGlobal({
  keyword: "fabstitch fabric",
  intent: "Navigational",
  cluster: "Brand",
  targetUrl: "/",
  contentType: "brand",
  priority: "P1",
  status: "mapped",
});
addGlobal({
  keyword: "fabstitch marketplace",
  intent: "Navigational",
  cluster: "Brand",
  targetUrl: "/marketplace/",
  contentType: "brand",
  priority: "P1",
  status: "mapped",
});

const FABRIC_HUB_SEEDS = [
  "explore fabrics",
  "fabric types",
  "types of fabric",
  "fabric materials",
  "textile materials",
  "browse fabrics",
  "fabric catalogue",
  "fabric catalog",
  "named fabrics",
  "fabric products",
];
for (const keyword of FABRIC_HUB_SEEDS) {
  addGlobal({
    keyword,
    intent: "Commercial",
    cluster: "Fabric Discovery",
    targetUrl: "/fabrics/",
    contentType: "hub",
    priority: "P1",
    status: "mapped",
  });
}

// ---------------------------------------------------------------------------
// Material / type / characteristic seeds → collections + guides
// ---------------------------------------------------------------------------
const MATERIAL_CLUSTERS: Array<{
  cluster: string;
  collection?: string;
  guide?: string;
  seeds: string[];
}> = [
  {
    cluster: "Cotton Fabrics",
    collection: "/collections/cotton/",
    guide: "/guides/what-is-cotton-fabric/",
    seeds: [
      "cotton fabric",
      "cotton fabrics",
      "cotton cloth",
      "cotton textile",
      "buy cotton fabric",
      "cotton fabric online",
      "cotton fabric for shirts",
      "cotton fabric for dresses",
      "breathable cotton fabric",
      "lightweight cotton fabric",
      "cotton poplin fabric",
      "cotton voile fabric",
      "cotton organdy fabric",
      "cotton seersucker fabric",
      "slub cotton fabric",
      "crinkle cotton fabric",
      "what is cotton fabric",
      "cotton fabric properties",
      "soft cotton fabric",
      "cotton fabric wholesale",
    ],
  },
  {
    cluster: "Linen Fabrics",
    collection: "/collections/linen-lightweight/",
    guide: "/guides/linen-fabrics-2027/",
    seeds: [
      "linen fabric",
      "linen fabrics",
      "flax linen",
      "european flax linen",
      "linen fabric online",
      "buy linen fabric",
      "lightweight linen fabric",
      "linen cotton fabric",
      "linen silk fabric",
      "linen blend fabric",
      "breathable linen fabric",
      "linen fabric for shirts",
      "linen fabric for dresses",
      "linen fabric for trousers",
      "summer linen fabric",
      "what is linen fabric",
      "linen fabric properties",
      "linen fabric wholesale",
      "washed linen fabric",
      "heavy linen fabric",
    ],
  },
  {
    cluster: "Silk Fabrics",
    collection: "/collections/silk-sheer/",
    guide: "/guides/silk-vs-satin/",
    seeds: [
      "silk fabric",
      "silk fabrics",
      "sheer silk fabric",
      "silk chiffon fabric",
      "silk georgette fabric",
      "silk organza fabric",
      "silk taffeta fabric",
      "crepe de chine fabric",
      "silk habotai fabric",
      "silk dupion fabric",
      "buy silk fabric",
      "silk fabric online",
      "silk fabric for dresses",
      "silk fabric for blouses",
      "lightweight silk fabric",
      "what is silk fabric",
      "silk fabric properties",
      "silk fabric wholesale",
      "fluid silk fabric",
      "silk lining fabric",
    ],
  },
  {
    cluster: "Wool Fabrics",
    collection: "/collections/tailoring/",
    seeds: [
      "wool fabric",
      "wool fabrics",
      "tropical wool fabric",
      "wool silk fabric",
      "wool linen fabric",
      "wool mohair fabric",
      "boiled wool fabric",
      "melton fabric",
      "wool flannel fabric",
      "wool fabric for coats",
      "wool fabric for jackets",
      "wool fabric for suits",
      "lightweight wool fabric",
      "winter wool fabric",
      "buy wool fabric",
      "wool fabric online",
      "wool fabric wholesale",
      "what is wool fabric",
      "tailoring wool fabric",
      "stretch wool fabric",
    ],
  },
  {
    cluster: "Denim Fabrics",
    collection: "/collections/denim/",
    guide: "/guides/denim-2027/",
    seeds: [
      "denim fabric",
      "denim fabrics",
      "lightweight denim",
      "premium denim fabric",
      "selvedge denim",
      "recycled denim fabric",
      "hemp cotton denim",
      "buy denim fabric",
      "denim fabric online",
      "denim fabric wholesale",
      "denim fabric for jackets",
      "denim fabric for trousers",
      "rigid denim fabric",
      "stretch denim fabric",
      "what is denim fabric",
      "denim fabric weight",
      "oz denim fabric",
      "sustainable denim fabric",
    ],
  },
  {
    cluster: "Knit Fabrics",
    collection: "/collections/knitwear/",
    guide: "/guides/woven-vs-knit-fabrics/",
    seeds: [
      "knit fabric",
      "knit fabrics",
      "jersey fabric",
      "pointelle knit",
      "open stitch knit",
      "crochet knit fabric",
      "merino knit fabric",
      "boucle knit fabric",
      "knit fabric for sweaters",
      "knit fabric for t shirts",
      "buy knit fabric",
      "knit fabric online",
      "stretch knit fabric",
      "lightweight knit fabric",
      "what is knit fabric",
      "knit vs woven",
      "semi sheer knit",
      "fine gauge knit",
    ],
  },
  {
    cluster: "Woven Fabrics",
    guide: "/guides/woven-vs-knit-fabrics/",
    seeds: [
      "woven fabric",
      "woven fabrics",
      "woven textile",
      "what is woven fabric",
      "woven vs knit fabric",
      "woven fabric for shirts",
      "woven fabric for trousers",
      "stretch woven fabric",
      "lightweight woven fabric",
      "buy woven fabric",
      "woven fabric online",
      "woven fabric construction",
      "plain weave fabric",
      "twill weave fabric",
    ],
  },
  {
    cluster: "Performance Fabrics",
    collection: "/collections/performance/",
    guide: "/guides/choosing-fabric-for-activewear/",
    seeds: [
      "performance fabric",
      "technical fabric",
      "stretch fabric",
      "compression fabric",
      "swimwear fabric",
      "activewear fabric",
      "cooling fabric",
      "performance fabric for apparel",
      "buy performance fabric",
      "technical textile",
      "water resistant fabric",
      "breathable performance fabric",
      "next to skin fabric",
      "loungewear knit fabric",
    ],
  },
  {
    cluster: "Velvet & Pile",
    collection: "/collections/velvet-pile/",
    seeds: [
      "velvet fabric",
      "crushed velvet fabric",
      "panne velvet",
      "corduroy fabric",
      "fine wale corduroy",
      "jumbo corduroy",
      "velveteen fabric",
      "pile fabric",
      "buy velvet fabric",
      "velvet fabric for dresses",
      "velvet fabric for upholstery",
      "corduroy fabric for trousers",
    ],
  },
  {
    cluster: "Technical Outerwear",
    collection: "/collections/technical-outerwear/",
    seeds: [
      "technical outerwear fabric",
      "membrane fabric",
      "ripstop fabric",
      "laminate fabric",
      "gabardine fabric",
      "outerwear fabric",
      "waterproof fabric",
      "rain jacket fabric",
      "technical shell fabric",
      "buy outerwear fabric",
    ],
  },
  {
    cluster: "Home & Contract Textiles",
    collection: "/collections/home-contract/",
    seeds: [
      "home textile fabric",
      "contract textile",
      "upholstery fabric",
      "curtain fabric",
      "drape fabric",
      "bedding fabric",
      "acoustic fabric",
      "performance upholstery fabric",
      "buy upholstery fabric",
      "home decor fabric",
      "interior fabric",
      "sheers fabric",
    ],
  },
];

for (const group of MATERIAL_CLUSTERS) {
  for (const [index, keyword] of group.seeds.entries()) {
    const informational = /^(what is|how |.* vs |.* comparison)/i.test(keyword);
    const target =
      informational && group.guide
        ? group.guide
        : (group.collection ?? "/fabrics/");
    addGlobal({
      keyword,
      intent: informational ? "Informational" : "Commercial",
      cluster: group.cluster,
      targetUrl: target,
      contentType: informational ? "article" : "collection",
      priority: index < 6 ? "P0" : index < 12 ? "P1" : "P2",
      status: "mapped",
    });
  }
}

const CHARACTERISTIC_SEEDS = [
  "lightweight fabric",
  "heavyweight fabric",
  "breathable fabric",
  "stretch fabric",
  "soft fabric",
  "durable fabric",
  "structured fabric",
  "flowy fabric",
  "warm fabric",
  "summer fabric",
  "winter fabric",
  "sheer fabric",
  "opaque fabric",
  "drapey fabric",
  "crisp fabric",
  "brushed fabric",
  "open weave fabric",
  "semi sheer fabric",
  "fabric hand feel",
  "fabric drape",
];
for (const keyword of CHARACTERISTIC_SEEDS) {
  addGlobal({
    keyword,
    intent: "Commercial",
    cluster: "Fabric Characteristics",
    targetUrl: "/marketplace/",
    contentType: "money",
    priority: "P2",
    status: "mapped",
  });
}

// ---------------------------------------------------------------------------
// Use-case / Best For
// ---------------------------------------------------------------------------
for (const useCase of SEO_USE_CASES) {
  const label = useCase.label.toLowerCase();
  const target = `/fabrics/best-for/${useCase.slug}/`;
  const variants = [
    `fabric for ${label}`,
    `fabrics for ${label}`,
    `best fabric for ${label}`,
    `best fabrics for ${label}`,
    `${label} fabric`,
    `${label} fabrics`,
    `buy fabric for ${label}`,
    `choose fabric for ${label}`,
    `fabric suitable for ${label}`,
    `${label} textile`,
  ];
  for (const [index, keyword] of variants.entries()) {
    addGlobal({
      keyword,
      intent: index < 4 ? "Commercial" : "Informational",
      cluster: `Fabric for ${useCase.label}`,
      targetUrl: target,
      contentType: "best_for",
      priority: index < 3 ? "P0" : "P1",
      status: "mapped",
    });
  }
}

for (const item of BEST_FOR) {
  const label = item.label.toLowerCase();
  // Map raw applications to closest SEO use-case when possible.
  const match = SEO_USE_CASES.find(
    (useCase) =>
      useCase.applicationSlugs.includes(item.slug as never) ||
      useCase.slug === item.slug,
  );
  const target = match
    ? `/fabrics/best-for/${match.slug}/`
    : "/fabrics/best-for/";
  addGlobal({
    keyword: `fabric for ${label}`,
    intent: "Commercial",
    cluster: "Best For Applications",
    targetUrl: target,
    contentType: "best_for",
    priority: match ? "P1" : "P2",
    status: match ? "mapped" : "hub_fallback",
  });
  addGlobal({
    keyword: `${label} fabric`,
    intent: "Commercial",
    cluster: "Best For Applications",
    targetUrl: target,
    contentType: "best_for",
    priority: "P2",
    status: match ? "mapped" : "hub_fallback",
  });
}

const EXTRA_USE = [
  ["fabric for mens clothing", "/fabrics/best-for/tailoring/"],
  ["fabric for childrens clothing", "/fabrics/best-for/"],
  ["fabric for coats", "/fabrics/best-for/outerwear/"],
  ["fabric for jackets", "/fabrics/best-for/outerwear/"],
  ["fabric for suits", "/fabrics/best-for/tailoring/"],
  ["fabric for resortwear", "/fabrics/best-for/resortwear/"],
  ["fabric for occasionwear", "/fabrics/best-for/occasionwear/"],
  ["fabric for home textiles", "/fabrics/best-for/home-textiles/"],
  [
    "how to choose fabric for shirts",
    "/guides/how-to-choose-fabric-for-shirts/",
  ],
  [
    "how to choose fabric for dresses",
    "/guides/how-to-choose-fabric-for-dresses/",
  ],
  ["choosing fabric for activewear", "/guides/choosing-fabric-for-activewear/"],
] as const;
for (const [keyword, target] of EXTRA_USE) {
  addGlobal({
    keyword,
    intent:
      keyword.startsWith("how") || keyword.startsWith("choosing")
        ? "Informational"
        : "Commercial",
    cluster: "Use-Based Keywords",
    targetUrl: target,
    contentType: target.startsWith("/guides/") ? "article" : "best_for",
    priority: "P1",
    status: "mapped",
  });
}

// ---------------------------------------------------------------------------
// Comparison + educational
// ---------------------------------------------------------------------------
const COMPARISONS: Array<[string, string]> = [
  ["cotton vs linen", "/guides/cotton-vs-linen/"],
  ["linen vs cotton", "/guides/cotton-vs-linen/"],
  ["woven vs knit", "/guides/woven-vs-knit-fabrics/"],
  ["knit vs woven", "/guides/woven-vs-knit-fabrics/"],
  ["chiffon vs georgette", "/guides/chiffon-vs-georgette/"],
  ["georgette vs chiffon", "/guides/chiffon-vs-georgette/"],
  ["silk vs satin", "/guides/silk-vs-satin/"],
  ["satin vs silk", "/guides/silk-vs-satin/"],
  ["fabric weight comparison", "/guides/fabric-weight-and-gsm/"],
  ["gsm fabric guide", "/guides/fabric-weight-and-gsm/"],
  ["what is gsm in fabric", "/guides/fabric-weight-and-gsm/"],
  [
    "fabric quality comparison",
    "/guides/how-to-choose-the-right-fabric-weight/",
  ],
  [
    "how to compare fabric quality",
    "/guides/how-fabric-composition-affects-performance/",
  ],
];
for (const [keyword, target] of COMPARISONS) {
  addGlobal({
    keyword,
    intent: "Informational",
    cluster: "Fabric Comparisons",
    targetUrl: target,
    contentType: "article",
    priority: "P1",
    status: "mapped",
  });
}

const EDUCATION: Array<[string, string]> = [
  ["what is gsm in fabric", "/guides/fabric-weight-and-gsm/"],
  ["fabric weight gsm", "/guides/fabric-weight-and-gsm/"],
  ["how to choose fabric", "/guides/how-to-choose-the-right-fabric-weight/"],
  ["how to buy fabric online", "/guides/how-to-buy-fabric-online/"],
  [
    "how to source fabric for clothing brand",
    "/guides/how-to-source-fabric-for-clothing-brands/",
  ],
  [
    "how to source fabric online",
    "/guides/how-to-source-fabric-for-clothing-brands/",
  ],
  ["what is a fabric weave", "/guides/what-is-a-fabric-weave/"],
  ["understanding fabric width", "/guides/understanding-fabric-width/"],
  [
    "understanding stretch in fabric",
    "/guides/understanding-stretch-in-fabric/",
  ],
  [
    "fabric composition guide",
    "/guides/how-fabric-composition-affects-performance/",
  ],
  [
    "fabric for boutiques guide",
    "/guides/how-to-source-fabric-for-clothing-brands/",
  ],
];
for (const [keyword, target] of EDUCATION) {
  addGlobal({
    keyword,
    intent: "Informational",
    cluster: "Fabric Education",
    targetUrl: target,
    contentType: "article",
    priority: "P1",
    status: "mapped",
  });
}

for (const guide of [...CATALOG_GUIDES, ...EDUCATION_GUIDES]) {
  addGlobal({
    keyword: normalize(guide.title),
    intent: "Informational",
    cluster: "Fabric Guides",
    targetUrl: guide.path,
    contentType: "article",
    priority: "P1",
    status: "mapped",
  });
  if (guide.metaDescription) {
    // Derive a short secondary phrase from heading when distinct.
    addGlobal({
      keyword: normalize(guide.heading ?? guide.title),
      intent: "Informational",
      cluster: "Fabric Guides",
      targetUrl: guide.path,
      contentType: "article",
      priority: "P2",
      status: "mapped",
    });
  }
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------
for (const collection of COLLECTIONS) {
  const label = collection.label.toLowerCase();
  const target = `/collections/${collection.slug}/`;
  const variants = [
    `${label} fabrics`,
    `${label} fabric collection`,
    `buy ${label} fabrics`,
    `${label} textiles`,
    `explore ${label} fabrics`,
    `${humanize(collection.slug).toLowerCase()} fabrics`,
  ];
  for (const [index, keyword] of variants.entries()) {
    addGlobal({
      keyword,
      intent: "Commercial",
      cluster: "Fabric Collections",
      targetUrl: target,
      contentType: "collection",
      priority: index < 2 ? "P0" : "P1",
      status: "mapped",
    });
  }
}

// ---------------------------------------------------------------------------
// Fabric PDPs — long-tail from real catalog names (not spam plurals)
// ---------------------------------------------------------------------------
for (const fabric of FABRICS_2027) {
  const name = fabric.name.toLowerCase();
  const target = `/fabrics/${fabric.slug}/`;
  const indexable = curated.has(fabric.slug);
  const base = [
    `${name} fabric`,
    `${name}`,
    `buy ${name} fabric`,
    `${name} fabric online`,
    `${name} textile`,
    `what is ${name}`,
  ];
  // Composition / construction long-tails when documented.
  const composition = "composition" in fabric ? fabric.composition : undefined;
  const construction =
    "construction" in fabric ? fabric.construction : undefined;
  if (Array.isArray(composition) && composition[0]) {
    base.push(`${String(composition[0]).toLowerCase()} ${name}`);
  }
  if (Array.isArray(construction) && construction[0]) {
    base.push(`${String(construction[0]).toLowerCase()} ${name}`);
  }
  for (const app of (fabric.applications ?? []).slice(0, 3)) {
    const appLabel =
      BEST_FOR.find((item) => item.slug === app)?.label.toLowerCase() ??
      String(app).replace(/-/g, " ");
    base.push(`${name} for ${appLabel}`);
    base.push(`fabric for ${appLabel} ${name.split(" ")[0]}`);
  }
  for (const [index, keyword] of base.entries()) {
    addGlobal({
      keyword,
      intent: keyword.startsWith("what is") ? "Informational" : "Commercial",
      cluster: "Named Fabrics",
      targetUrl: target,
      contentType: "product",
      priority: indexable ? (index < 2 ? "P0" : "P1") : "P3",
      status: indexable ? "mapped_indexable" : "mapped_noindex_holdback",
    });
  }
}

// ---------------------------------------------------------------------------
// Country segmentation for high-priority commercial seeds only (no doorway pages)
// ---------------------------------------------------------------------------
const COUNTRY_KEYWORDS = [
  "fabric marketplace",
  "fabric sourcing",
  "wholesale fabric",
  "buy fabric online",
  "fabric supplier",
  "linen fabric",
  "cotton fabric",
  "silk fabric",
  "denim fabric",
  "fabric for shirts",
  "fabric for dresses",
];
for (const country of COUNTRIES) {
  if (country === "GLOBAL") continue;
  for (const keyword of COUNTRY_KEYWORDS) {
    const existing = rows.find(
      (row) => row.keyword === keyword && row.country === "GLOBAL",
    );
    add({
      keyword,
      country,
      intent: existing?.intent ?? "Commercial",
      cluster: existing?.cluster ?? "Country Opportunity",
      // Same URL — country pages are NOT created; metrics segment research only.
      targetUrl: existing?.targetUrl ?? "/marketplace/",
      contentType: existing?.contentType ?? "money",
      priority: "P2",
      status: "research_segment_no_localized_page",
    });
  }
}

// ---------------------------------------------------------------------------
// Content-gap placeholders (planned pages)
// ---------------------------------------------------------------------------
const GAPS: Array<[string, string, string]> = [
  [
    "fabric inquiry process",
    "/guides/how-to-source-fabric-for-clothing-brands/",
    "Fabric Sourcing Guides",
  ],
  [
    "moq fabric sourcing",
    "/guides/how-to-source-fabric-for-clothing-brands/",
    "Fabric Sourcing Guides",
  ],
  [
    "fabric sampling online",
    "/guides/how-to-buy-fabric-online/",
    "Fabric Buying Guides",
  ],
];
for (const [keyword, target, cluster] of GAPS) {
  addGlobal({
    keyword,
    intent: "Informational",
    cluster,
    targetUrl: target,
    contentType: "article",
    priority: "P1",
    status: "mapped",
  });
}

// ---------------------------------------------------------------------------
// Write CSV
// ---------------------------------------------------------------------------
rows.sort((a, b) => {
  const p = a.priority.localeCompare(b.priority);
  if (p) return p;
  const c = a.cluster.localeCompare(b.cluster);
  if (c) return c;
  return a.keyword.localeCompare(b.keyword);
});

const header = [
  "Keyword",
  "Country",
  "Volume",
  "Difficulty",
  "Current Rank",
  "Intent",
  "Cluster",
  "Target URL",
  "Content Type",
  "Priority",
  "Status",
];

const lines = [
  header.join(","),
  ...rows.map((row) =>
    [
      row.keyword,
      row.country,
      row.volume,
      row.difficulty,
      row.currentRank,
      row.intent,
      row.cluster,
      row.targetUrl,
      row.contentType,
      row.priority,
      row.status,
    ]
      .map(csvEscape)
      .join(","),
  ),
];

writeFileSync(OUT, `${lines.join("\n")}\n`, "utf8");

const uniqueKeywords = new Set(rows.map((row) => row.keyword));
console.log(
  JSON.stringify(
    {
      path: OUT,
      rows: rows.length,
      uniqueKeywords: uniqueKeywords.size,
      clusters: new Set(rows.map((r) => r.cluster)).size,
      planned: rows.filter((r) => r.status === "planned").length,
      note: "Volume/Difficulty/Current Rank are TBD until SEMrush/GSC import",
    },
    null,
    2,
  ),
);

if (uniqueKeywords.size < 1000) {
  console.error(`Expected >= 1000 unique keywords, got ${uniqueKeywords.size}`);
  process.exit(1);
}
