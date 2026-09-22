import { applyCuratedAttributeHub } from "./curated-attributes";
import type {
  SemanticFaq,
  SemanticPage,
  SemanticSection,
  SemanticTable,
  SemanticTopic,
} from "./types";
import { generateSemanticCandidates } from "./candidates";
import { CATALOG_GUIDES } from "@/content/guides";
import { illustrativeImage } from "@/domain/seo/topic-image";
import {
  CATALOG_COLLECTION_CARDS,
  SEASONAL_COLLECTIONS,
  SEO_USE_CASES,
} from "@/catalog";

function hash(input: string): number {
  let value = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    value ^= input.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function pick<T>(items: readonly T[], seed: number, salt: number): T {
  return items[(seed + salt * 2654435761) % items.length]!;
}

function clampMeta(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

function words(...parts: string[]): number {
  return parts.join(" ").split(/\s+/).filter(Boolean).length;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

const SEMANTIC_SLUGS = new Set(
  generateSemanticCandidates().map((topic) => topic.slug),
);
const GUIDE_PATHS = new Set(CATALOG_GUIDES.map((guide) => guide.path));
const COLLECTION_PATHS = new Set([
  ...CATALOG_COLLECTION_CARDS.map((card) => `/collections/${card.slug}/`),
  ...SEASONAL_COLLECTIONS.map((theme) => `/collections/${theme.slug}/`),
]);
const SEO_USE_SLUGS = new Set<string>(
  SEO_USE_CASES.map((useCase) => useCase.slug),
);
const BEST_FOR_CANONICAL: Record<string, string> = {
  shirting: "shirts",
  dresses: "dresses",
  trousers: "trousers",
  jackets: "outerwear",
  coats: "outerwear",
  suiting: "tailoring",
  "soft-tailoring": "tailoring",
  "performance-apparel": "activewear",
  "workwear-trousers": "trousers",
  blouses: "womens-clothing",
  "full-skirts": "dresses",
  outerwear: "outerwear",
  knitwear: "knitwear",
};
const STATIC_PATHS = new Set([
  "/marketplace/",
  "/fabrics/",
  "/collections/",
  "/fabrics/best-for/",
  "/fabric-sourcing/",
  "/wholesale-fabric/",
  "/guides/",
  "/discover/",
  "/guides/fabric-questions/",
  "/guides/fabric-weight-and-gsm/",
  "/guides/cotton-vs-linen/",
  "/guides/woven-vs-knit-fabrics/",
  "/guides/how-to-buy-fabric-online/",
  "/guides/how-to-source-fabric-for-clothing-brands/",
  "/guides/how-to-choose-fabric-for-shirts/",
  "/guides/how-to-choose-fabric-for-dresses/",
  "/fabrics/clothing/",
  "/fabrics/apparel/",
  "/fabrics/fashion/",
  "/fabrics/shirt-fabric/",
  "/fabrics/dress-fabric/",
  "/fabrics/wool-fabric/",
]);

function materialReadingPath(material: {
  id: string;
  collectionSlug?: string;
}): string {
  if (
    ["cotton", "linen", "silk", "denim"].includes(material.id) &&
    material.collectionSlug
  ) {
    return `/collections/${material.collectionSlug}/`;
  }
  return `/discover/${slugify(`${material.id}-fabric`)}/`;
}

function knownPath(target: string): boolean {
  if (STATIC_PATHS.has(target) || GUIDE_PATHS.has(target)) return true;
  if (COLLECTION_PATHS.has(target)) return true;
  const discover = target.match(/^\/discover\/([^/]+)\/$/);
  if (discover) return SEMANTIC_SLUGS.has(discover[1] ?? "");
  const bestFor = target.match(/^\/fabrics\/best-for\/([^/]+)\/$/);
  if (bestFor) return SEO_USE_SLUGS.has(bestFor[1] ?? "");
  return false;
}

function relatedPathsFor(topic: SemanticTopic): string[] {
  const paths = new Set<string>([
    "/marketplace/",
    "/fabrics/",
    "/collections/",
    "/fabric-sourcing/",
    "/guides/",
  ]);

  if (topic.material?.collectionSlug) {
    paths.add(`/collections/${topic.material.collectionSlug}/`);
  }
  if (topic.comparisonPeer?.collectionSlug) {
    paths.add(`/collections/${topic.comparisonPeer.collectionSlug}/`);
  }
  if (topic.material) {
    paths.add(materialReadingPath(topic.material));
  }
  if (topic.comparisonPeer) {
    paths.add(materialReadingPath(topic.comparisonPeer));
  }
  if (topic.use?.bestForSlug) {
    const canonical =
      BEST_FOR_CANONICAL[topic.use.bestForSlug] ?? topic.use.bestForSlug;
    paths.add(`/fabrics/best-for/${canonical}/`);
  }
  if (topic.attribute?.guidePath) paths.add(topic.attribute.guidePath);
  if (topic.construction?.guidePath) paths.add(topic.construction.guidePath);

  if (topic.use) {
    paths.add(`/discover/${slugify(`fabric-for-${topic.use.id}`)}/`);
  }
  if (topic.pageType === "commercial") {
    paths.add("/wholesale-fabric/");
    paths.add("/guides/how-to-buy-fabric-online/");
  }
  if (
    topic.material?.id === "cotton" ||
    topic.primaryKeyword.includes("cotton")
  ) {
    paths.add("/collections/cotton/");
  }
  if (
    topic.material?.id === "linen" ||
    topic.primaryKeyword.includes("linen")
  ) {
    paths.add("/collections/linen-lightweight/");
  }
  if (topic.use?.id === "shirts") {
    paths.add("/fabrics/shirt-fabric/");
    paths.add("/guides/how-to-choose-fabric-for-shirts/");
  }
  if (topic.use?.id === "dresses") {
    paths.add("/fabrics/dress-fabric/");
    paths.add("/guides/how-to-choose-fabric-for-dresses/");
  }

  paths.delete(topic.path);
  return [...paths].filter(knownPath).slice(0, 10);
}

function cap(value: string): string {
  return value ? `${value[0]!.toUpperCase()}${value.slice(1)}` : value;
}

function rotate(
  fields: readonly string[],
  seed: number,
  count: number,
): string[] {
  const clean = fields.map((field) => field.trim()).filter(Boolean);
  if (!clean.length) return [];
  const start = seed % clean.length;
  return [...clean.slice(start), ...clean.slice(0, start)].slice(
    0,
    Math.min(count, clean.length),
  );
}

function section(
  heading: string,
  body: string[],
  keyPoints?: string[],
): SemanticSection {
  return {
    heading,
    body: body.map((part) => part.trim()).filter(Boolean),
    keyPoints,
  };
}

function composeSections(
  topic: SemanticTopic,
  _seed: number,
): SemanticSection[] {
  const material = topic.material;
  const use = topic.use;
  const attribute = topic.attribute;
  const construction = topic.construction;
  const peer = topic.comparisonPeer;

  if (topic.pageType === "comparison" && material && peer) {
    return [
      section(
        `Where ${material.label.toLowerCase()} and ${peer.label.toLowerCase()} overlap`,
        [
          `Both can appear in apparel briefs, and neither wins by reputation. ${material.label} is ${material.family}. ${peer.label} is ${peer.family}. The comparison starts there, then moves to construction and published weight.`,
        ],
      ),
      section(
        `What ${material.label.toLowerCase()} actually contributes`,
        [material.fiberNotes, material.handFeel, material.constructionNotes],
        [...material.strengths.slice(0, 3)],
      ),
      section(
        `What ${peer.label.toLowerCase()} actually contributes`,
        [peer.fiberNotes, peer.handFeel, peer.constructionNotes],
        [...peer.strengths.slice(0, 3)],
      ),
      section("Hand, weight and the limits of a GSM comparison", [
        material.weightNotes,
        peer.weightNotes,
        "Compare GSM only when both fabric pages publish it, and only inside a similar construction. A missing number is not evidence that one cloth is lighter.",
      ]),
      section(
        `When the brief should start with ${material.label.toLowerCase()}`,
        [
          `Start here when you need ${material.strengths[0]!.toLowerCase()}, especially for ${material.typicalUses.slice(0, 3).join(", ")}.`,
          material.buyerNotes,
          `Still sample for ${material.watchouts[0]!.toLowerCase()}.`,
        ],
      ),
      section(`When the brief should start with ${peer.label.toLowerCase()}`, [
        `Start here when ${peer.strengths[0]!.toLowerCase()} is the constraint you cannot drop, especially for ${peer.typicalUses.slice(0, 3).join(", ")}.`,
        peer.buyerNotes,
        `Still sample for ${peer.watchouts[0]!.toLowerCase()}.`,
      ]),
    ];
  }

  if (material && construction) {
    return [
      section(
        `${cap(construction.label)} is the decision, not the fibre name`,
        [
          construction.definition,
          construction.behaviour,
          `${material.label} can be made in more than one construction. This page is only the ${construction.label} reading.`,
        ],
      ),
      section(`How ${material.label.toLowerCase()} behaves in that build`, [
        material.constructionNotes,
        material.handFeel,
        material.weightNotes,
      ]),
      section(
        `Confirm this ${material.label.toLowerCase()} ${construction.label} on the fabric page`,
        [
          construction.buyerNotes,
          material.buyerNotes,
          `Watchouts that do not disappear because the construction is named: ${material.watchouts.join("; ")}.`,
        ],
      ),
    ];
  }

  if (material && use && attribute) {
    const materialSlice = rotate(
      [
        material.handFeel,
        material.constructionNotes,
        material.weightNotes,
        material.buyerNotes,
      ],
      hash(use.id + attribute.id),
      2,
    );
    const useSlice = rotate(
      [use.weightGuidance, use.constructionGuidance, use.seasonalNotes],
      hash(material.id + attribute.id),
      1,
    );
    return [
      section(
        `${cap(attribute.label)} ${material.label.toLowerCase()} for ${use.label}`,
        [
          `The garment still has to meet ${use.requirements[0]}. ${cap(attribute.label)} does not replace that.`,
          attribute.howToJudge,
          ...useSlice,
        ],
      ),
      section(`What ${material.label.toLowerCase()} adds to that constraint`, [
        ...materialSlice,
        `Test ${material.strengths[0]!.toLowerCase()}. Sample for ${material.watchouts[0]!.toLowerCase()}.`,
      ]),
      section(`The trade-off on this ${use.garmentLabel}`, [
        attribute.tradeoffs,
        `Related checks sit on the ${attribute.label} page. This URL only tests that constraint on ${material.label.toLowerCase()}.`,
      ]),
    ];
  }

  if (material && use) {
    const materialSlice = rotate(
      [
        material.handFeel,
        material.constructionNotes,
        material.weightNotes,
        material.buyerNotes,
        material.fiberNotes,
      ],
      hash(use.id),
      2,
    );
    const useSlice = rotate(
      [
        use.weightGuidance,
        use.constructionGuidance,
        use.seasonalNotes,
        use.buyerNotes,
      ],
      hash(material.id),
      1,
    );
    return [
      section(
        `What a ${use.garmentLabel} asks of ${material.label.toLowerCase()}`,
        [
          `A ${use.garmentLabel} needs ${use.requirements.slice(0, 2).join(" and ")}. ${material.label} is not automatically that cloth.`,
          ...useSlice,
        ],
      ),
      section(`${material.label} facts that change this ${use.garmentLabel}`, [
        ...materialSlice,
        `Strength to test: ${material.strengths[0]}. Watchout that still applies: ${material.watchouts[0]}.`,
      ]),
      section(
        `Confirm ${material.label.toLowerCase()} before it is specified for ${use.label}`,
        [
          `Name the ${use.garmentLabel} in the inquiry, then read construction and weight on the fabric page. A missing cell stays missing.`,
          material.watchouts[1]
            ? `Also sample for ${material.watchouts[1].toLowerCase()}.`
            : material.buyerNotes,
        ],
      ),
    ];
  }

  if (material && attribute) {
    const materialSlice = rotate(
      [
        material.handFeel,
        material.constructionNotes,
        material.weightNotes,
        material.buyerNotes,
      ],
      hash(attribute.id),
      2,
    );
    return [
      section(`Judging ${attribute.label} on ${material.label.toLowerCase()}`, [
        attribute.howToJudge,
        attribute.whyItMatters,
        ...materialSlice,
      ]),
      section(`Where ${attribute.label} is the wrong assumption`, [
        attribute.tradeoffs,
        `Sample for ${material.watchouts[0]!.toLowerCase()}. A ${attribute.label} title does not prove it.`,
      ]),
    ];
  }

  if (use && attribute) {
    const useSlice = rotate(
      [
        use.weightGuidance,
        use.constructionGuidance,
        use.seasonalNotes,
        use.buyerNotes,
      ],
      hash(attribute.id),
      2,
    );
    return [
      section(`Why ${attribute.label} matters for ${use.label}`, [
        `A ${use.garmentLabel} needs ${use.requirements.slice(0, 2).join(" and ")}.`,
        attribute.whyItMatters,
        ...useSlice,
      ]),
      section(`How ${attribute.label} can fail a ${use.garmentLabel}`, [
        attribute.howToJudge,
        attribute.tradeoffs,
      ]),
    ];
  }

  if (material) {
    return [
      section(
        `How ${material.label.toLowerCase()} behaves`,
        [material.fiberNotes, material.handFeel],
        [...material.strengths],
      ),
      section("Construction and weight change it more than the family name", [
        material.constructionNotes,
        material.weightNotes,
      ]),
      section("Where it is used, and what to watch", [
        `Documented directions include ${material.typicalUses.join(", ")}.`,
        material.buyerNotes,
        `Watchouts: ${material.watchouts.join("; ")}. Compare with ${material.relatedMaterials.join(", ")} only after construction is fixed.`,
      ]),
    ];
  }

  if (use) {
    return [
      section(`What ${use.label} require from cloth`, [
        `Start with the garment, not a fibre name. The constraints are ${use.requirements.join(", ")}.`,
        `Useful traits, when the fabric page supports them: ${use.preferredTraits.join(", ")}.`,
      ]),
      section("Weight and construction for this garment", [
        use.weightGuidance,
        use.constructionGuidance,
        use.seasonalNotes,
      ]),
      section("How to write the brief", [
        use.buyerNotes,
        `Neighbouring garment families, not substitutes: ${use.relatedUses.join(", ")}.`,
      ]),
    ];
  }

  if (attribute) {
    return [
      section(`What ${attribute.label} means on a cloth`, [
        attribute.definition,
        attribute.whyItMatters,
      ]),
      section("How to judge it without trusting the title", [
        attribute.howToJudge,
      ]),
      section("Trade-offs and neighbouring checks", [
        attribute.tradeoffs,
        `Read these beside ${attribute.label}: ${attribute.relatedAttributes.join(", ")}.`,
      ]),
    ];
  }

  if (construction) {
    return [
      section(cap(construction.label), [
        construction.definition,
        construction.behaviour,
      ]),
      section("Where it is used", [
        construction.buyerNotes,
        `Common applications: ${construction.typicalUses.join(", ")}.`,
      ]),
    ];
  }

  return [
    section(topic.primaryKeyword, [
      `This page is about ${topic.primaryKeyword}. Use the linked collection or the marketplace to see a published fabric, and do not treat a missing spec as a zero.`,
    ]),
  ];
}

function comparisonTable(topic: SemanticTopic): SemanticTable | undefined {
  const material = topic.material;
  const peer = topic.comparisonPeer;
  if (topic.pageType !== "comparison" || !material || !peer) return undefined;
  return {
    caption: `${material.label} and ${peer.label} on a sourcing shortlist`,
    headers: ["", material.label, peer.label],
    rows: [
      ["Family", material.family, peer.family],
      [
        "A strength to test",
        material.strengths[0] ?? "",
        peer.strengths[0] ?? "",
      ],
      ["A watchout", material.watchouts[0] ?? "", peer.watchouts[0] ?? ""],
      [
        "Often considered for",
        material.typicalUses.slice(0, 3).join(", "),
        peer.typicalUses.slice(0, 3).join(", "),
      ],
    ],
  };
}

function composeFaqs(topic: SemanticTopic, seed: number): SemanticFaq[] {
  const faqs: SemanticFaq[] = [];
  const material = topic.material;
  const use = topic.use;
  const attribute = topic.attribute;

  if (material) {
    faqs.push({
      question: `What should I check first on a ${material.label.toLowerCase()} fabric page?`,
      answer: `Start with composition, construction and published weight, then read Best For uses. ${material.buyerNotes}`,
    });
  }
  if (use) {
    faqs.push({
      question: `What makes a fabric suitable for ${use.label}?`,
      answer: `Look for ${use.requirements.slice(0, 3).join(", ")}. ${use.weightGuidance}`,
    });
  }
  if (attribute) {
    faqs.push({
      question: `How do I know if a fabric is truly ${attribute.label}?`,
      answer: attribute.howToJudge,
    });
  }
  if (topic.pageType === "comparison" && material && topic.comparisonPeer) {
    faqs.push({
      question: `Is ${material.label.toLowerCase()} better than ${topic.comparisonPeer.label.toLowerCase()}?`,
      answer: `Neither is universally better. Compare construction, weight and garment requirements. ${material.label} often suits ${material.typicalUses.slice(0, 2).join(" and ")}, while ${topic.comparisonPeer.label} often suits ${topic.comparisonPeer.typicalUses.slice(0, 2).join(" and ")}.`,
    });
  }
  faqs.push({
    question: `Where does a ${topic.primaryKeyword} search go next?`,
    answer: material
      ? `Open published ${material.label.toLowerCase()} fabrics and compare construction before weight. ${material.buyerNotes}`
      : use
        ? `Use the ${use.label} brief on this page, then open a fabric page. ${use.buyerNotes}`
        : attribute
          ? attribute.howToJudge
          : `Follow the links to a collection, a guide, or the marketplace. This page is not itself a cloth.`,
  });

  if (faqs.length > 4) {
    const start = seed % Math.max(1, faqs.length - 3);
    return faqs.slice(start, start + 4);
  }
  return faqs.slice(0, 4);
}

function composeTitle(topic: SemanticTopic, seed: number): string {
  const material = topic.material?.label;
  const use = topic.use;
  const attribute = topic.attribute?.label;
  const peer = topic.comparisonPeer?.label;
  const construction = topic.construction?.label;

  if (topic.pageType === "comparison" && material && peer) {
    return `${material} vs ${peer} Fabric: Differences & Uses`;
  }
  if (topic.educationKey === "buy-online" && material) {
    return `Buy ${material} Fabric Online | FabStitch Discovery`;
  }
  if (topic.educationKey === "bulk" && material) {
    return `Bulk ${material} Fabric for Apparel Programmes`;
  }
  if (topic.educationKey === "buy-use-online" && use) {
    return `Buy ${use.garmentLabel[0]!.toUpperCase()}${use.garmentLabel.slice(1)} Fabric Online`;
  }
  if (material && use && attribute) {
    return `${attribute[0]!.toUpperCase()}${attribute.slice(1)} ${material} for ${use.label[0]!.toUpperCase()}${use.label.slice(1)}`;
  }
  if (material && construction) {
    return `${construction[0]!.toUpperCase()}${construction.slice(1)} ${material} Fabric`;
  }
  if (material && use) {
    return pick(
      [
        `${material} Fabric for ${use.label[0]!.toUpperCase()}${use.label.slice(1)}`,
        `${material} ${use.garmentLabel[0]!.toUpperCase()}${use.garmentLabel.slice(1)} Fabric`,
      ],
      seed,
      3,
    );
  }
  if (material && attribute) {
    return `${attribute[0]!.toUpperCase()}${attribute.slice(1)} ${material} Fabric`;
  }
  if (use && attribute) {
    return `${attribute[0]!.toUpperCase()}${attribute.slice(1)} Fabric for ${use.label[0]!.toUpperCase()}${use.label.slice(1)}`;
  }
  if (topic.pageType === "education" && material) {
    return `${material} Fabric Guide: How to Choose & Compare`;
  }
  if (topic.pageType === "education" && use) {
    return `${use.garmentLabel[0]!.toUpperCase()}${use.garmentLabel.slice(1)} Fabric Guide`;
  }
  if (topic.pageType === "education" && attribute) {
    return `Understanding ${attribute[0]!.toUpperCase()}${attribute.slice(1)} Fabric`;
  }
  if (material) {
    return `${material} Fabric: Properties, Uses & Selection`;
  }
  if (use) {
    return `Fabric for ${use.label[0]!.toUpperCase()}${use.label.slice(1)}: What to Specify`;
  }
  if (attribute) {
    return `${attribute[0]!.toUpperCase()}${attribute.slice(1)} Fabric Explained`;
  }
  if (construction) {
    return `${construction[0]!.toUpperCase()}${construction.slice(1)} Fabric Guide`;
  }
  return topic.primaryKeyword
    .split(" ")
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join(" ");
}

function composeH1(topic: SemanticTopic, title: string): string {
  if (topic.pageType === "education") {
    return title.replace(/\s*\|\s*FabStitch$/, "");
  }
  return title.replace(/\s*\|\s*FabStitch$/, "");
}

function composeIntro(topic: SemanticTopic, seed: number): string {
  const material = topic.material;
  const use = topic.use;
  const attribute = topic.attribute;

  if (topic.pageType === "comparison" && material && topic.comparisonPeer) {
    return pick(
      [
        `Comparing ${material.label.toLowerCase()} and ${topic.comparisonPeer.label.toLowerCase()} only helps when you anchor the decision in garment constraints — silhouette, climate, opacity and care — then read published construction and weight on real FabStitch fabrics.`,
        `${material.label} vs ${topic.comparisonPeer.label} is a frequent sourcing question. This page separates fibre marketing from practical selection so you can shortlist with evidence.`,
      ],
      seed,
      1,
    );
  }

  if (material && use && attribute) {
    return `This page focuses on ${attribute.label} ${material.label.toLowerCase()} options for ${use.label}. It explains the garment requirements, how ${attribute.label} should be judged, and how to move from a clear brief into FabStitch discovery without inventing unlisted specs.`;
  }

  if (material && use) {
    return pick(
      [
        `${material.label} can support ${use.label} when construction and weight match the silhouette. Use this page to frame the brief, then compare named FabStitch fabrics with documented properties.`,
        `Choosing ${material.label.toLowerCase()} fabric for ${use.label} is a product decision first. Start from ${use.garmentLabel} requirements, then filter ${material.label.toLowerCase()} constructions that actually fit.`,
      ],
      seed,
      2,
    );
  }

  if (material && attribute) {
    return `${attribute.label[0]!.toUpperCase()}${attribute.label.slice(1)} ${material.label.toLowerCase()} fabric is a useful filter only when the attribute is evidenced by construction and published weight. This page explains both the material family and the attribute so your shortlist stays honest.`;
  }

  if (use && attribute) {
    return `For ${use.label}, “${attribute.label}” only matters when it serves the garment. This page connects ${use.garmentLabel} requirements with a practical reading of ${attribute.label} fabric traits.`;
  }

  if (material && topic.construction) {
    return `${topic.construction.label} ${material.label.toLowerCase()} is a construction decision. ${topic.construction.definition} The fibre notes still apply, but weave or knit changes the cloth more than the family name.`;
  }

  if (material) {
    return `${material.fiberNotes} On FabStitch, treat ${material.label.toLowerCase()} as a family to explore through construction, weight and documented uses — not as a single interchangeable cloth.`;
  }

  if (use) {
    return `Fabric for ${use.label} should be chosen from garment constraints first: ${use.requirements.slice(0, 3).join(", ")}. This page outlines those requirements and points you into FabStitch collections, Best For edits and marketplace filters.`;
  }

  if (attribute) {
    return attribute.definition;
  }

  if (topic.construction) {
    return topic.construction.definition;
  }

  return `Explore ${topic.primaryKeyword} with practical selection guidance and pathways into the FabStitch catalog.`;
}

function composeMeta(topic: SemanticTopic, intro: string): string {
  const base = intro.split(/(?<=\.)\s+/)[0] ?? intro;
  const topicCue = topic.primaryKeyword;
  const suffix =
    topic.intent === "commercial"
      ? ` Explore ${topicCue} on FabStitch and inquire on matching cloths.`
      : ` Learn ${topicCue}, then compare real FabStitch fabrics.`;
  return clampMeta(`${base}${suffix}`);
}

function topUpSemantic(
  topic: SemanticTopic,
  sections: SemanticSection[],
): SemanticSection[] {
  const count = words(
    ...sections.flatMap((item) => [item.heading, ...item.body]),
    topic.primaryKeyword,
  );
  if (count >= 80) return sections;
  const material = topic.material;
  const use = topic.use;
  if (material) {
    return [
      ...sections,
      section(`Buyer note for ${material.label.toLowerCase()}`, [
        material.buyerNotes,
        material.weightNotes,
      ]),
    ];
  }
  if (use) {
    return [
      ...sections,
      section(`Brief for ${use.label}`, [use.buyerNotes, use.weightGuidance]),
    ];
  }
  return sections;
}

export function composeSemanticPage(topic: SemanticTopic): SemanticPage {
  const seed = hash(topic.slug);
  const title = composeTitle(topic, seed);
  const h1 = composeH1(topic, title);
  const intro = composeIntro(topic, seed);
  const sections = composeSections(topic, seed);
  const faqs = composeFaqs(topic, seed);
  const table = comparisonTable(topic);
  const topped = topUpSemantic(topic, sections);
  const metaDescription = composeMeta(topic, intro);
  const relatedPaths = relatedPathsFor(topic);

  const collectionSlugs = [
    topic.material?.collectionSlug,
    topic.comparisonPeer?.collectionSlug,
  ].filter((slug): slug is string => Boolean(slug));
  const bestForSlugs = topic.use?.bestForSlug ? [topic.use.bestForSlug] : [];
  const fabricQueryHints = [
    topic.material?.label.toLowerCase(),
    topic.use?.label,
    topic.attribute?.label,
  ].filter(Boolean) as string[];

  const wordCount = words(
    title,
    h1,
    intro,
    metaDescription,
    ...topped.flatMap((section) => [
      section.heading,
      ...section.body,
      ...(section.keyPoints ?? []),
    ]),
    ...faqs.flatMap((faq) => [faq.question, faq.answer]),
  );

  const qualityNotes: string[] = [];
  if (wordCount < 80) qualityNotes.push("insufficient_word_count");
  if (sections.length < 2) qualityNotes.push("too_few_sections");
  if (!title.trim() || !h1.trim() || !metaDescription.trim()) {
    qualityNotes.push("missing_metadata");
  }

  const qualityGatePassed = qualityNotes.length === 0;
  const picture = illustrativeImage({
    materialHint: topic.material?.imageHint,
    peerHint: topic.comparisonPeer?.imageHint,
    useId: topic.use?.id,
    attributeId: topic.attribute?.id,
    constructionId: topic.construction?.id,
  });

  const composed: SemanticPage = {
    ...topic,
    title,
    h1,
    metaDescription,
    eyebrow:
      topic.pageType === "education"
        ? "Fabric education"
        : topic.pageType === "comparison"
          ? "Fabric comparison"
          : topic.pageType === "commercial"
            ? "Fabric discovery"
            : "Fabric topic",
    intro,
    sections: topped,
    comparisonTable: table,
    faqs,
    relatedPaths,
    collectionSlugs,
    bestForSlugs,
    fabricQueryHints,
    ctaHeading: `Next step for ${topic.primaryKeyword}`,
    ctaBody: topic.material
      ? `Open a published ${topic.material.label.toLowerCase()} fabric and inquire on that URL. This page does not add a price or a certificate.`
      : topic.use
        ? `Open a fabric whose page supports the ${topic.use.garmentLabel} brief, then inquire there.`
        : "Open a fabric page from the links on this note, then inquire on that URL.",
    wordCount,
    indexable: qualityGatePassed,
    qualityGatePassed,
    qualityNotes,
    imagePath: picture.path,
    imageAlt: picture.alt,
  };

  return applyCuratedAttributeHub(composed);
}
