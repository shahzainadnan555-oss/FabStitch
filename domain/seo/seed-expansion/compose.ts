import type {
  SemanticFaq,
  SemanticPage,
  SemanticSection,
  SemanticTable,
} from "@/domain/seo/semantic/types";
import { SEED_BY_ID, SEED_BY_SLUG, SEED_RECORDS } from "./catalog";
import {
  clusterDiscoverPaths,
  generateSeedExpansionPlans,
} from "./generate";
import type { ExpansionKind, ExpansionPlan, SeedRecord } from "./types";

const BEST_FOR: Record<string, string> = {
  shirts: "shirts",
  dresses: "dresses",
  coats: "outerwear",
  "t-shirts": "knitwear",
  jeans: "trousers",
  trousers: "trousers",
  upholstery: "upholstery",
  sofas: "upholstery",
  activewear: "activewear",
  sportswear: "activewear",
  clothing: "shirts",
  "outdoor clothing": "outerwear",
  hoodies: "knitwear",
  loungewear: "knitwear",
  bags: "home-textiles",
  windows: "home-textiles",
  apparel: "shirts",
  collections: "dresses",
  workwear: "trousers",
  occasionwear: "occasionwear",
  jackets: "outerwear",
  blouses: "womens-clothing",
  linings: "dresses",
  overlays: "occasionwear",
  uniforms: "shirts",
  denim: "trousers",
};

function words(parts: string[]): number {
  return parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${cut.slice(0, space > 40 ? space : max - 1)}`;
}

function fitDescription(text: string): string {
  let clean = text.replace(/\s+/g, " ").trim();
  if (clean.length < 120) {
    clean = `${clean} Read published specs on FabStitch, then sample before bulk.`;
  }
  if (clean.length < 120) {
    clean = `${clean} Keep claims limited to the named fabric page.`;
  }
  if (clean.length > 151) return clip(clean, 151);
  return clean;
}

function fitTitle(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length >= 32 && clean.length <= 48) return clean;
  if (clean.length < 32) return clip(`${clean} for apparel teams`, 48);
  return clip(clean, 48);
}

function bestForPath(label: string): string | undefined {
  const slug = BEST_FOR[label] ?? BEST_FOR[label.toLowerCase()];
  return slug ? `/fabrics/best-for/${slug}/` : undefined;
}

function stampSection(seed: SeedRecord, plan: ExpansionPlan): SemanticSection {
  const human = plan.slug.replace(/^hub-/, "").replaceAll("-", " ");
  return {
    heading: `Why this ${seed.keyword} note is separate`,
    body: [
      `This article is the ${human} note. It does not replace ${seed.existingCanonical}.`,
      `Use it when the job is ${plan.kind.replaceAll("_", " ")} for ${plan.useLabel ?? seed.primaryUse}, not when you only needed the canonical page.`,
      `${seed.imageAlt} is the photograph on this note. It is illustrative, not a named mill SKU.`,
    ],
  };
}

function clusterSlugs(seed: SeedRecord, current: string): string[] {
  return clusterDiscoverPaths(seed.id, current);
}

function relatedFor(
  seed: SeedRecord,
  plan: ExpansionPlan,
  includeMarketplace: boolean,
): string[] {
  const paths = new Set<string>([
    seed.existingCanonical,
    "/fabrics/",
    "/collections/",
    "/guides/",
    "/fabric-sourcing/",
    "/guides/fabric-weight-and-gsm/",
    ...clusterSlugs(seed, plan.slug),
  ]);
  if (includeMarketplace) paths.add("/marketplace/");
  if (seed.collectionPath) paths.add(seed.collectionPath);
  const usePath = bestForPath(plan.useLabel ?? seed.primaryUse);
  if (usePath) paths.add(usePath);
  if (seed.bestForPath && BEST_FOR[seed.primaryUse]) {
    paths.add(seed.bestForPath);
  }
  if (plan.kind === "commercial") {
    paths.add("/wholesale-fabric/");
    paths.add("/guides/how-to-buy-fabric-online/");
  }
  if (seed.primaryUse === "shirts" || seed.keyword.includes("shirt")) {
    paths.add("/fabrics/shirt-fabric/");
    paths.add("/guides/how-to-choose-fabric-for-shirts/");
  }
  if (seed.primaryUse === "dresses" || seed.keyword.includes("dress")) {
    paths.add("/fabrics/dress-fabric/");
    paths.add("/guides/how-to-choose-fabric-for-dresses/");
  }
  const peer = SEED_BY_SLUG[seed.peerSlug];
  if (peer) {
    paths.add(`/discover/hub-brief-${peer.slug}/`);
    if (peer.collectionPath) paths.add(peer.collectionPath);
  }
  paths.delete("");
  return [...paths].filter(Boolean).slice(0, 12);
}

function tableFor(
  seed: SeedRecord,
  plan: ExpansionPlan,
): SemanticTable | undefined {
  if (plan.kind === "comparison") {
    const peerName = plan.peerKeyword ?? seed.peerKeyword;
    return {
      caption: `${seed.keyword} and ${peerName} on a brief`,
      headers: ["Check", seed.keyword, peerName],
      rows: [
        ["What it is", seed.definition, `See the ${peerName} notes, not a synonym swap.`],
        ["Feel", seed.feel, "Judge the peer on its own sample."],
        ["Mass", seed.weight, "Do not copy a GSM from one family to the other."],
        ["Typical use", seed.uses, "Match the peer to its own end use."],
        ["Watch-out", seed.limits, "The peer has its own limits. Read them."],
      ],
    };
  }
  if (plan.kind === "buyer_spec") {
    return {
      caption: `Specification checklist for ${seed.keyword}`,
      headers: ["Field", "Why it matters"],
      rows: [
        ["Composition", seed.makeup],
        ["Mass / construction", seed.weight],
        ["Care", seed.care],
        ["Sample", seed.sampling],
        ["Common miss", seed.mistake],
      ],
    };
  }
  return undefined;
}

function faqsFor(seed: SeedRecord, plan: ExpansionPlan): SemanticFaq[] {
  const q1 =
    plan.question ??
    `Does every ${seed.keyword} listing mean the same cloth?`;
  return [
    {
      question: q1,
      answer: `No. ${seed.definition} ${seed.makeup}`,
    },
    {
      question: `Can you skip sampling ${seed.keyword}?`,
      answer: seed.sampling,
    },
    {
      question: `What should stay on the brief besides the keyword ${seed.keyword}?`,
      answer: `${seed.specCheck} ${seed.mistake}`,
    },
  ];
}

function sectionsFor(seed: SeedRecord, plan: ExpansionPlan): SemanticSection[] {
  const keyword = seed.keyword;
  const peer = plan.peerKeyword ?? seed.peerKeyword;
  const use = plan.useLabel ?? seed.primaryUse;
  const human = plan.slug.replace(/^hub-/, "").replaceAll("-", " ");
  const kind = plan.kind;
  const siblings = `This ${human} article is not the other ${keyword} hub notes. It is only the ${kind.replaceAll("_", " ")} record, written for ${use}, with ${peer} as the comparison label when a comparison is in scope.`;

  if (kind === "seed_support") {
    return [
      {
        heading: `Mill paperwork for ${keyword}`,
        body: [
          `${keyword} arrives on mill paperwork as a label. ${seed.definition}`,
          siblings,
          `Write ${use} beside ${keyword} so the mill does not fill a blank with a cousin cloth.`,
        ],
      },
      {
        heading: `Fields that belong next to ${keyword}`,
        body: [
          seed.makeup,
          `GSM for ${keyword} means grams per square metre of that named cloth, not a quality medal.`,
        ],
      },
      {
        heading: `What ${keyword} paperwork is not`,
        body: [
          `Paperwork for ${keyword} is not a price, not a factory count, and not ${peer} copied into the same SKU line.`,
          seed.specCheck,
        ],
        keyPoints: [
          `Keep ${keyword} on one quality code.`,
          `Name ${use} in the same block.`,
          "Leave unknown fields marked unknown.",
        ],
      },
      {
        heading: `After the ${keyword} brief is written`,
        body: [
          `Open a published fabric page that actually matches ${keyword}, then enquire. Do not enquire from this note.`,
        ],
      },
    ];
  }

  if (kind === "education" && plan.slug.startsWith("hub-meaning-")) {
    return [
      {
        heading: `Meaning of the words ${keyword}`,
        body: [seed.definition, siblings],
      },
      {
        heading: `What ${keyword} does not say out loud`,
        body: [
          seed.feel,
          `The phrase ${keyword} does not carry opacity, recovery, or a certificate. Those sit on a named page or a test attached to a sample.`,
        ],
      },
      {
        heading: `Examples that still need a cloth`,
        body: [
          `Teams searching ${keyword} often mean ${use}. ${seed.climate}`,
          `Nearby language such as ${peer} is a different meaning page.`,
        ],
      },
      {
        heading: `How to keep the meaning of ${keyword} honest`,
        body: [
          "Do not call this the most sustainable, the most premium, or easy to rank. Those claims are not on this page.",
          seed.makeup,
        ],
      },
    ];
  }

  if (kind === "education") {
    return [
      {
        heading: `Trade-offs inside ${keyword}`,
        body: [seed.limits, siblings],
      },
      {
        heading: `The miss people make with ${keyword}`,
        body: [
          seed.mistake,
          `If ${keyword} shows that miss on a sample, change construction or change ${use}. Do not hide it with adjectives.`,
        ],
      },
      {
        heading: `What a ${keyword} trade-off is not`,
        body: [
          `A trade-off is not a reason to invent mill capacity for ${keyword}. It is a reason to write the next field.`,
          seed.strengths,
        ],
      },
      {
        heading: `Care still sits beside the ${keyword} limit`,
        body: [seed.care],
      },
    ];
  }

  if (kind === "application") {
    return [
      {
        heading: `${use} is the garment, ${keyword} is the cloth`,
        body: [
          `A ${use} block asks for movement, cover, seams and care. ${keyword} is only useful if those answers match.`,
          siblings,
        ],
      },
      {
        heading: `Where ${keyword} is a fair ${use} candidate`,
        body: [seed.uses, seed.strengths],
      },
      {
        heading: `Where ${keyword} fights a ${use} block`,
        body: [
          seed.limits,
          `Do not force ${keyword} into ${use} because the leftover roll is convenient.`,
        ],
      },
      {
        heading: `Cutting-room checks for ${keyword} in ${use}`,
        body: [
          `Sew a small ${use} stress point if the garment will work a collar, seat, handle or stretch panel.`,
          `Keep ${peer} off this ${use} PO unless it is a second named quality.`,
        ],
      },
    ];
  }

  if (kind === "buyer_spec" && plan.slug.startsWith("hub-sample-")) {
    return [
      {
        heading: `Sampling ${keyword} is a different job from photographing it`,
        body: [
          seed.sampling,
          siblings,
        ],
      },
      {
        heading: `What to do with a ${keyword} sample`,
        body: [
          `Hold the ${keyword} sample to light. Stretch it if ${use} will stretch. Wash or steam it if ${use} will be washed.`,
          "A leftover swatch from last year is not this year’s dye lot.",
        ],
      },
      {
        heading: `Rejecting a ${keyword} sample`,
        body: [
          seed.mistake,
          `Rejection is allowed when ${keyword} misses the ${use} brief. Polite rejection is still a sourcing skill.`,
        ],
      },
      {
        heading: `After a ${keyword} sample passes`,
        body: [
          `Enquire from a named fabric URL with the sample code. This ${human} note does not set MOQ for ${keyword}.`,
        ],
      },
    ];
  }

  if (kind === "buyer_spec") {
    return [
      {
        heading: `Tech-pack lines for ${keyword}`,
        body: [seed.specCheck, siblings],
      },
      {
        heading: `Mass and width for ${keyword}`,
        body: [
          seed.weight,
          `Width changes yield for ${keyword}. GSM is grams per square metre. Compare GSM only inside one construction family of ${keyword}.`,
        ],
      },
      {
        heading: `Unknowns on a ${keyword} pack`,
        body: [
          `If a ${keyword} field is unknown, write unknown. Do not copy a number from ${peer}.`,
          "MOQ is mill quantity language. This page does not publish an MOQ.",
        ],
      },
      {
        heading: `Care line for ${keyword}`,
        body: [seed.care],
      },
    ];
  }

  if (kind === "commercial" && plan.slug.startsWith("hub-wholesale-notes-")) {
    return [
      {
        heading: `Mill units of ${keyword}`,
        body: [
          `Wholesale ${keyword} still means mill units of a named quality, not a cheaper fibre.`,
          siblings,
        ],
      },
      {
        heading: `Documents that should travel with ${keyword}`,
        body: [
          seed.makeup,
          "MOQ, packing and reorder live on the offer. They are not invented here.",
        ],
      },
      {
        heading: `Markets that read ${keyword} notes`,
        body: [
          `Buyers of ${keyword} on FabStitch may sit in the United States, United Kingdom, Turkey, Pakistan, India, Bangladesh, or Singapore. That is audience, not a factory map.`,
        ],
      },
      {
        heading: `From ${keyword} notes to a named page`,
        body: [
          `Browse the FabStitch marketplace, open a named ${keyword} quality, and enquire with the brief you wrote.`,
        ],
      },
    ];
  }

  if (kind === "commercial") {
    return [
      {
        heading: `RFQ order for ${keyword}`,
        body: [
          `Sourcing ${keyword} is brief, sample, tests, then quantity. The search phrase is only line one.`,
          siblings,
        ],
      },
      {
        heading: `What an RFQ for ${keyword} will not invent`,
        body: [
          `No supplier count, factory map, lead time, price, or certificate for ${keyword} unless a named fabric page already states it.`,
          seed.limits,
        ],
      },
      {
        heading: `Tests that still belong on a ${keyword} RFQ`,
        body: [
          seed.sampling,
          `If ${use} needs wash, stretch or abrasion, write that test name. Do not pretend ${peer} results apply.`,
        ],
      },
      {
        heading: `Where the ${keyword} RFQ continues`,
        body: [
          `Source fabrics through FabStitch only from a named URL that matches ${keyword}.`,
        ],
      },
    ];
  }

  if (kind === "comparison") {
    const peerSeed = Object.values(SEED_BY_SLUG).find(
      (item) => item.keyword === peer,
    );
    return [
      {
        heading: `${keyword} is not ${peer}`,
        body: [
          seed.definition,
          peerSeed
            ? peerSeed.definition
            : `${peer} is another label. It is not a spelling of ${keyword}.`,
          siblings,
        ],
      },
      {
        heading: `Hand and mass: ${keyword} against ${peer}`,
        body: [
          seed.feel,
          peerSeed
            ? peerSeed.feel
            : `Sample ${peer} separately. Do not borrow the hand of ${keyword}.`,
          seed.weight,
        ],
      },
      {
        heading: `Uses: ${keyword} or ${peer}`,
        body: [
          `Choose ${keyword} when ${use} needs the behaviour on this note. Choose ${peer} when that other label matches the block.`,
          seed.uses,
        ],
      },
      {
        heading: `Lots: keep ${keyword} and ${peer} apart`,
        body: [
          `Separate quality codes. A blended PO is how ${peer} substitutes hide inside a ${keyword} line.`,
        ],
      },
    ];
  }

  return [
    {
      heading: plan.question ?? `A briefing question on ${keyword}`,
      body: [
        `Short answer: write ${use} first, then the ${keyword} fields. ${seed.specCheck}`,
        siblings,
      ],
    },
    {
      heading: `What goes wrong with ${keyword} questions`,
      body: [seed.mistake],
    },
    {
      heading: `A practical ${keyword} check`,
      body: [seed.sampling, seed.feel],
    },
    {
      heading: `If the ${keyword} answer is still “buy cloth”`,
      body: [
        `Find fabrics for your project on FabStitch after the ${keyword} brief exists, not before.`,
      ],
    },
  ];
}

function metaFor(
  seed: SeedRecord,
  plan: ExpansionPlan,
): { title: string; h1: string; description: string; eyebrow: string } {
  const k = seed.keyword;
  const peer = plan.peerKeyword ?? seed.peerKeyword;
  const use = plan.useLabel ?? seed.primaryUse;
  switch (plan.kind) {
    case "seed_support":
      return {
        title: fitTitle(`${cap(k)} mill brief checklist`),
        h1: `Putting ${k} on mill paperwork`,
        description: fitDescription(
          `A mill-brief checklist for ${k}: fibre, construction, mass, ${use}, sampling and care. Distinct from the canonical ${seed.existingCanonical} page.`,
        ),
        eyebrow: "Buyer brief",
      };
    case "education":
      if (plan.slug.startsWith("hub-limits-")) {
        return {
          title: fitTitle(`Trade-offs inside ${k}`),
          h1: `Trade-offs that sit inside ${k}`,
          description: fitDescription(
            `Trade-off note for ${k}: ${clip(seed.limits, 55)} Separate from the meaning page and from ${seed.existingCanonical}.`,
          ),
          eyebrow: "Fabric education",
        };
      }
      return {
        title: fitTitle(`Meaning of ${k} in programs`),
        h1: `The program meaning of ${k}`,
        description: fitDescription(
          `Program meaning of ${k}: ${clip(seed.definition, 60)} What the phrase hides, and how this note differs from ${seed.existingCanonical}.`,
        ),
        eyebrow: "Fabric education",
      };
    case "application":
      return {
        title: fitTitle(`${cap(use)} programs using ${k}`),
        h1: `Using ${k} inside ${use} programs`,
        description: fitDescription(
          `Application note: ${use} programs using ${k}. Hand, mass, cover, care, sampling. Not a duplicate of a generic “fabric for ${use}” hub.`,
        ),
        eyebrow: "Application",
      };
    case "buyer_spec":
      if (plan.slug.startsWith("hub-sample-")) {
        return {
          title: fitTitle(`Bulk sampling path for ${k}`),
          h1: `A bulk sampling path for ${k}`,
          description: fitDescription(
            `Sampling path for ${k} before bulk: hand, colour, mass, wash. Reject rules and what this note will not invent.`,
          ),
          eyebrow: "Sampling",
        };
      }
      return {
        title: fitTitle(`Tech-pack fields for ${k}`),
        h1: `Tech-pack fields to write for ${k}`,
        description: fitDescription(
          `Tech-pack fields for ${k}: composition, construction, mass, width, care, sample rules. GSM in plain English. No fake MOQ.`,
        ),
        eyebrow: "Specification",
      };
    case "commercial":
      if (plan.slug.startsWith("hub-wholesale-notes-")) {
        return {
          title: fitTitle(`Mill-unit notes on ${k}`),
          h1: `Mill-unit buying notes for ${k}`,
          description: fitDescription(
            `Mill-unit notes for ${k}: spec, sample, units. Written for teams in FabStitch’s seven markets without invented factory lists.`,
          ),
          eyebrow: "Wholesale",
        };
      }
      return {
        title: fitTitle(`RFQ path for ${k}`),
        h1: `An RFQ path for sourcing ${k}`,
        description: fitDescription(
          `RFQ path for ${k}: brief, sample, tests, then quantity. No invented factories, prices or lead times. Continue on named fabric pages.`,
        ),
        eyebrow: "Sourcing",
      };
    case "comparison":
      return {
        title: fitTitle(`Beside ${k} and ${peer}`),
        h1: `How ${k} differs from ${peer}`,
        description: fitDescription(
          `Side-by-side note: ${k} beside ${peer}. Fibre, feel, mass, uses, care, sampling. Not a reverse duplicate and not a synonym swap.`,
        ),
        eyebrow: "Comparison",
      };
    case "question":
      return {
        title: fitTitle(`Q — ${plan.question ?? `briefing ${k}`}`),
        h1: plan.question ?? `What should a brief ask about ${k}?`,
        description: fitDescription(
          `Question note on ${k} for ${use}: checks, common misses, sampling. This is not the canonical ${seed.existingCanonical} article.`,
        ),
        eyebrow: "Question",
      };
  }
}

function cap(value: string): string {
  return value ? `${value[0]!.toUpperCase()}${value.slice(1)}` : value;
}

function pageTypeFor(kind: ExpansionKind): SemanticPage["pageType"] {
  if (kind === "comparison") return "comparison";
  if (kind === "commercial") return "commercial";
  if (kind === "application") return "use_case";
  if (kind === "buyer_spec") return "education";
  return "education";
}

function clusterFor(kind: ExpansionKind): SemanticPage["cluster"] {
  if (kind === "comparison") return "comparison";
  if (kind === "commercial") return "commercial";
  if (kind === "application") return "use_case";
  return "education";
}

function composePage(plan: ExpansionPlan): SemanticPage {
  const seed = SEED_BY_ID[plan.seedId];
  if (!seed) throw new Error(`Missing seed ${plan.seedId}`);
  const meta = metaFor(seed, plan);
  const human = plan.slug.replace(/^hub-/, "").replaceAll("-", " ");
  const title = fitTitle(human);
  const h1 = `${meta.h1} — ${human}`;
  const description = fitDescription(`${human}. ${meta.description}`);
  const sections = [...sectionsFor(seed, plan), stampSection(seed, plan)];
  const faqs = faqsFor(seed, plan);
  const table = tableFor(seed, plan);
  const uniqueClose = `Keep this ${plan.kind.replaceAll("_", " ")} record separate from other ${seed.keyword} notes. Slug words: ${plan.slug.replaceAll("-", " ")}. Seed number ${seed.id}. Peer label on this record: ${plan.peerKeyword ?? seed.peerKeyword}. End use on this record: ${plan.useLabel ?? seed.primaryUse}. Canonical owner remains ${seed.existingCanonical}.`;
  const intro =
    plan.kind === "question"
      ? `${plan.question ?? ""} ${seed.definition} The rest of this page shows how to check ${seed.keyword} for ${plan.useLabel ?? seed.primaryUse} without treating the phrase as a finished spec. ${uniqueClose}`
      : `${seed.definition} This note is the ${plan.kind.replaceAll("_", " ")} record for ${plan.primaryKeyword}. ${uniqueClose}`;
  const relatedPaths = relatedFor(
    seed,
    plan,
    plan.kind === "commercial" ||
      plan.kind === "application" ||
      plan.kind === "seed_support" ||
      plan.kind === "buyer_spec",
  );
  const count = words([
    meta.title,
    meta.h1,
    meta.description,
    intro,
    ...sections.flatMap((section) => [
      section.heading,
      ...section.body,
      ...(section.keyPoints ?? []),
    ]),
    ...faqs.flatMap((faq) => [faq.question, faq.answer]),
    ...(table?.rows.flat() ?? []),
  ]);
  const notes: string[] = [];
  if (count < 220) notes.push("insufficient_word_count");
  if (sections.length < 4) notes.push("too_few_sections");
  const passed = notes.length === 0;
  const alt = `${seed.imageAlt} (${plan.kind.replaceAll("_", " ")} note)`;

  return {
    slug: plan.slug,
    path: `/discover/${plan.slug}/`,
    pageType: pageTypeFor(plan.kind),
    cluster: clusterFor(plan.kind),
    intent:
      plan.kind === "commercial"
        ? "commercial_investigation"
        : "informational",
    primaryKeyword: plan.primaryKeyword,
    secondaryKeywords: plan.secondaryKeywords,
    signature: `seed-expansion|${plan.pageId}`,
    title,
    h1,
    metaDescription: description,
    eyebrow: meta.eyebrow,
    intro,
    sections,
    comparisonTable: table,
    faqs,
    relatedPaths,
    collectionSlugs: seed.collectionPath
      ? [seed.collectionPath.replace("/collections/", "").replace(/\//g, "")]
      : [],
    bestForSlugs: seed.bestForPath
      ? [seed.bestForPath.replace("/fabrics/best-for/", "").replace(/\//g, "")]
      : [],
    fabricQueryHints: [seed.topic, seed.keyword],
    ctaHeading:
      plan.kind === "commercial"
        ? "Continue on a named FabStitch fabric"
        : `Next step after ${seed.keyword}`,
    ctaBody:
      plan.kind === "commercial"
        ? "Browse the FabStitch marketplace, open a named fabric page, and enquire with fibre, construction, quantity and end use. This article does not add mill claims."
        : "Open a related fabric, collection or guide, then enquire only from a named fabric URL.",
    wordCount: count,
    indexable: passed,
    qualityGatePassed: passed,
    qualityNotes: notes,
    imagePath: seed.image,
    imageAlt: alt,
  };
}

let PLANS: ExpansionPlan[] | undefined;

export function seedExpansionPlans(): ExpansionPlan[] {
  PLANS ??= generateSeedExpansionPlans();
  return PLANS;
}

export function buildSeedExpansionPages(): SemanticPage[] {
  return seedExpansionPlans().map(composePage);
}

export function seedExpansionKindCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const plan of seedExpansionPlans()) {
    counts[plan.kind] = (counts[plan.kind] ?? 0) + 1;
  }
  return counts;
}

export { SEED_RECORDS };
