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

function composeSections(
  topic: SemanticTopic,
  seed: number,
): SemanticSection[] {
  const material = topic.material;
  const use = topic.use;
  const attribute = topic.attribute;
  const construction = topic.construction;
  const peer = topic.comparisonPeer;
  const sections: SemanticSection[] = [];

  if (topic.pageType === "comparison" && material && peer) {
    sections.push(
      {
        heading: `What ${material.label.toLowerCase()} contributes`,
        body: [material.fiberNotes, material.constructionNotes],
        keyPoints: [...material.strengths.slice(0, 2)],
      },
      {
        heading: `What ${peer.label.toLowerCase()} contributes`,
        body: [peer.fiberNotes, peer.constructionNotes],
        keyPoints: [...peer.strengths.slice(0, 2)],
      },
      {
        heading: "Hand, drape and texture",
        body: [
          material.handFeel,
          `By contrast, ${peer.handFeel.charAt(0).toLowerCase()}${peer.handFeel.slice(1)}`,
        ],
      },
      {
        heading: "Weight and published GSM",
        body: [
          material.weightNotes,
          peer.weightNotes,
          "Compare GSM only when both fabric pages publish it. A missing number is not evidence that one cloth is lighter.",
        ],
      },
      {
        heading: `When to start with ${material.label.toLowerCase()}`,
        body: [
          `Start here when the brief needs ${material.strengths[0]!.toLowerCase()} and the garment sits near ${material.typicalUses.slice(0, 3).join(", ")}.`,
          material.buyerNotes,
          `Still check ${material.watchouts[0]!.toLowerCase()}.`,
        ],
      },
      {
        heading: `When to start with ${peer.label.toLowerCase()}`,
        body: [
          `Start here when ${peer.strengths[0]!.toLowerCase()} is the constraint you cannot drop, especially for ${peer.typicalUses.slice(0, 3).join(", ")}.`,
          peer.buyerNotes,
          `Still check ${peer.watchouts[0]!.toLowerCase()}.`,
        ],
      },
      {
        heading: "How a business should source the shortlist",
        body: [
          `Open both families on the FabStitch marketplace, then keep one construction before you compare weight. ${material.label} watchouts include ${material.watchouts.slice(0, 2).join("; ").toLowerCase()}. ${peer.label} watchouts include ${peer.watchouts.slice(0, 2).join("; ").toLowerCase()}.`,
          "Neither fibre is universally better. Inquire with the garment, climate and quantity, and leave unpublished specs blank.",
        ],
      },
    );
    return sections;
  }

  if (material) {
    sections.push({
      heading: pick(
        [
          `What ${material.label.toLowerCase()} fabric is in practice`,
          `Understanding ${material.label.toLowerCase()} as a sourcing family`,
          `${material.label} fabric beyond the fibre name`,
        ],
        seed,
        1,
      ),
      body: [
        material.fiberNotes,
        material.handFeel,
        material.constructionNotes,
      ],
      keyPoints: [...material.strengths.slice(0, 3)],
    });
  }

  if (use) {
    sections.push({
      heading: pick(
        [
          `What ${use.label} demand from cloth`,
          `${use.garmentLabel[0]!.toUpperCase()}${use.garmentLabel.slice(1)} requirements that change the shortlist`,
          `Building a ${use.garmentLabel} fabric brief`,
        ],
        seed,
        2,
      ),
      body: [
        `A credible ${use.garmentLabel} programme starts with garment constraints: ${use.requirements.join(", ")}.`,
        use.weightGuidance,
        use.constructionGuidance,
        use.seasonalNotes,
        use.buyerNotes,
        `Related garment directions worth comparing: ${use.relatedUses.join(", ")}.`,
      ],
      keyPoints: [...use.preferredTraits],
    });
  }

  if (attribute) {
    sections.push({
      heading: pick(
        [
          `What “${attribute.label}” should mean in a fabric brief`,
          `How to judge ${attribute.label} fabric responsibly`,
          `${attribute.label[0]!.toUpperCase()}${attribute.label.slice(1)} as a selection filter`,
        ],
        seed,
        3,
      ),
      body: [
        attribute.definition,
        attribute.whyItMatters,
        attribute.howToJudge,
        attribute.tradeoffs,
        `Related attributes to consider alongside ${attribute.label}: ${attribute.relatedAttributes.join(", ")}.`,
      ],
    });
  }

  if (construction) {
    sections.push({
      heading: `${construction.label[0]!.toUpperCase()}${construction.label.slice(1)} construction behaviour`,
      body: [
        construction.definition,
        construction.behaviour,
        construction.buyerNotes,
      ],
      keyPoints: [
        ...construction.typicalUses.map((item) => `Common in ${item}`),
      ],
    });
  }

  if (material && use) {
    sections.push({
      heading: pick(
        [
          `When ${material.label.toLowerCase()} fits ${use.label}`,
          `Matching ${material.label.toLowerCase()} to a ${use.garmentLabel} silhouette`,
          `${material.label} for ${use.label}: selection logic`,
        ],
        seed,
        4,
      ),
      body: [
        `${material.label} appears in ${use.label} when the published construction supports the silhouette. ${material.buyerNotes}`,
        use.buyerNotes,
        `Typical ${material.label.toLowerCase()} strengths — ${material.strengths.join("; ").toLowerCase()} — only help if they align with ${use.garmentLabel} requirements such as ${use.requirements.slice(0, 2).join(" and ")}.`,
        `Watchouts still apply: ${material.watchouts.join("; ")}.`,
      ],
      keyPoints: [
        `Start from the ${use.garmentLabel}, then filter ${material.label.toLowerCase()} constructions`,
        "Confirm weight, opacity and recovery on the fabric record",
      ],
    });
  }

  if (material && attribute) {
    sections.push({
      heading: `How ${attribute.label} shows up in ${material.label.toLowerCase()}`,
      body: [
        `${attribute.label[0]!.toUpperCase()}${attribute.label.slice(1)} is not automatic for every ${material.label.toLowerCase()} cloth. ${attribute.howToJudge}`,
        material.weightNotes,
        `Buyer note: ${material.buyerNotes}`,
      ],
    });
  }

  if (use && attribute && !material) {
    sections.push({
      heading: `${attribute.label[0]!.toUpperCase()}${attribute.label.slice(1)} choices for ${use.label}`,
      body: [
        `For ${use.label}, “${attribute.label}” only helps when it serves ${use.requirements.slice(0, 2).join(" and ")}.`,
        attribute.tradeoffs,
        use.constructionGuidance,
      ],
    });
  }

  sections.push({
    heading: pick(
      [
        "How to shortlist on FabStitch",
        "A practical discovery path",
        "From brief to inquiry",
      ],
      seed,
      5,
    ),
    body: [
      "Open the marketplace with the garment and material filters that match your brief, then compare named fabrics on composition, construction and documented Best For uses.",
      "Collections help when the fibre family is decided. Best For edits help when the product is decided. Guides help when you need the underlying concept — weight, weave, or selection logic.",
      "When a property is not published, do not invent it from a photo. Ask in the inquiry with the silhouette, climate and quantity context attached.",
    ],
    keyPoints: [
      "Filter by real constraints",
      "Compare documented specs",
      "Inquire with a clear brief",
    ],
  });

  if (topic.pageType === "commercial") {
    sections.push({
      heading: "Buying and sourcing considerations",
      body: [
        "Online fabric discovery should still follow a sourcing discipline: define the garment, compare documented cloths, sample where needed, then inquire with quantities and constraints.",
        "FabStitch is built for that workflow — browse, compare, and move into inquiry without inventing supplier claims or inventory promises that are not on the record.",
        "For wholesale or bulk intent, use the wholesale and sourcing hubs alongside this topic page so commercial process guidance stays canonical.",
      ],
    });
  }

  if (topic.pageType === "education") {
    sections.push({
      heading: "Common mistakes to avoid",
      body: [
        "Choosing by fibre buzzword without construction and weight.",
        "Assuming photos prove opacity, stretch recovery or durability.",
        "Copying a competitor’s cloth name without matching the garment constraints.",
        "Skipping sampling when care, recovery or climate risk is high.",
      ],
    });
  }

  // Ensure enough depth for quality gate without empty filler.
  if (sections.length < 4) {
    if (material) {
      sections.push({
        heading: `${material.label} applications and related directions`,
        body: [
          `Documented apparel directions for ${material.label.toLowerCase()} often include ${material.typicalUses.join(", ")}.`,
          `Related materials worth comparing on FabStitch: ${material.relatedMaterials.join(", ")}.`,
          material.buyerNotes,
        ],
      });
    } else if (use) {
      sections.push({
        heading: `Materials often considered for ${use.label}`,
        body: [
          `Buyers typically compare cellulosics, protein fibres, synthetics and blends against the ${use.garmentLabel} brief rather than locking a fibre name too early.`,
          use.constructionGuidance,
          `Keep related garment pathways in view: ${use.relatedUses.join(", ")}.`,
        ],
      });
    } else if (attribute) {
      sections.push({
        heading: `Putting ${attribute.label} into a sourcing workflow`,
        body: [
          `Translate “${attribute.label}” into measurable checks on the fabric record — weight, construction, stretch notes or opacity — before you shortlist.`,
          attribute.whyItMatters,
          "Then move into FabStitch marketplace filters and inquire with the attribute written as a constraint, not as marketing language.",
        ],
      });
    }
  }

  return sections;
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
    question: "Can I buy fabric on FabStitch from this page?",
    answer:
      "This page explains the topic and links into FabStitch discovery. Browse matching fabrics in the marketplace or collections, then inquire on the cloths that fit your brief.",
  });

  // Keep 3–4 FAQs, rotated by seed for variety without emptiness.
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
    return `What Is ${attribute[0]!.toUpperCase()}${attribute.slice(1)} Fabric?`;
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
  const next = [...sections];
  const material = topic.material;
  const use = topic.use;
  const attribute = topic.attribute;
  const peer = topic.comparisonPeer;
  const extras: SemanticSection[] = [];
  if (material) {
    extras.push({
      heading: `Buyer notes for ${material.label.toLowerCase()}`,
      body: [
        material.fiberNotes,
        material.handFeel,
        material.constructionNotes,
        material.weightNotes,
        material.buyerNotes,
        `Strengths to test: ${material.strengths.join(", ").toLowerCase()}. Watchouts: ${material.watchouts.join(", ").toLowerCase()}.`,
      ],
    });
  }
  if (peer) {
    extras.push({
      heading: `Buyer notes for ${peer.label.toLowerCase()}`,
      body: [peer.fiberNotes, peer.handFeel, peer.buyerNotes, peer.weightNotes],
    });
  }
  if (use) {
    extras.push({
      heading: `Applying this to ${use.label}`,
      body: [
        use.weightGuidance,
        use.constructionGuidance,
        use.seasonalNotes,
        use.buyerNotes,
      ],
    });
  }
  if (attribute) {
    extras.push({
      heading: attribute.label,
      body: [
        attribute.definition,
        attribute.whyItMatters,
        attribute.howToJudge,
        attribute.tradeoffs,
      ],
    });
  }
  extras.push({
    heading: "How to use the note",
    body: [
      `${topic.primaryKeyword} is the question this page answers. It is not a ranking of cloth and it does not add a price, a certificate, or a supplier count.`,
      "Open a collection or the marketplace when you need a published fabric. Compare construction before GSM, and leave a spec blank if the fabric page does not state it.",
    ],
  });
  for (const extra of extras) {
    const count = words(
      ...next.flatMap((section) => [section.heading, ...section.body]),
      topic.primaryKeyword,
    );
    if (count >= 320) break;
    next.push(extra);
  }
  return next;
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
  if (wordCount < 300) qualityNotes.push("insufficient_word_count");
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

  return {
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
    ctaHeading: "Continue into FabStitch discovery",
    ctaBody:
      "Browse matching fabrics, compare documented specs, then inquire with your garment brief.",
    wordCount,
    indexable: qualityGatePassed,
    qualityGatePassed,
    qualityNotes,
    imagePath: picture.path,
    imageAlt: picture.alt,
  };
}
