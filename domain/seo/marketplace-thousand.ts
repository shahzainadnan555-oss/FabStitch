import { COLLECTION_BY_SLUG, SEO_USE_CASES } from "@/catalog";
import {
  ATTRIBUTES,
  CONSTRUCTIONS,
  MATERIALS,
  USES,
  materialById,
  type AttributeEntity,
  type ConstructionEntity,
  type MaterialEntity,
  type UseEntity,
} from "@/domain/seo/semantic/ontology";
import { MARKETPLACE_SUPPORT_PAGES } from "@/domain/seo/marketplace-cluster";
import { getSemanticPage } from "@/domain/seo/semantic";
import { illustrativeImage } from "@/domain/seo/topic-image";
import { imageAlt } from "@/domain/seo/image-assets";

/**
 * Exactly 1,000 marketplace topic pages.
 * Ten of them are crawl hubs. The other 990 are entity-specific sourcing notes.
 * /marketplace/ stays the commercial canonical and is not one of these pages.
 */
export const MARKETPLACE_TOPIC_TARGET = 1000;

export type TopicFamily =
  | "education"
  | "b2b"
  | "buying"
  | "sourcing"
  | "materials"
  | "comparisons"
  | "attributes"
  | "weight"
  | "use-cases"
  | "buyers";

type TopicKind =
  | "material-use"
  | "material-attribute"
  | "use-attribute"
  | "material-construction"
  | "use-construction"
  | "material-buyer"
  | "use-gsm"
  | "comparison"
  | "hub";

type Buyer = { id: string; label: string; job: string };
type GsmBand = { id: string; label: string; note: string };

export type MarketplaceTopicRecord = {
  slug: string;
  path: string;
  family: TopicFamily;
  kind: TopicKind;
  title: string;
  h1: string;
  description: string;
  primaryKeyword: string;
  secondaryKeywords: readonly string[];
  imagePath: string;
  imageAlt: string;
  relatedPaths: readonly string[];
  wordCount: number;
};

export type TopicSection = { heading: string; body: string[] };
export type TopicTable = {
  caption: string;
  headers: [string, string, string];
  rows: [string, string, string][];
};

export type MarketplaceTopicView = MarketplaceTopicRecord & {
  intro: string;
  sections: TopicSection[];
  table?: TopicTable;
  faqs: { question: string; answer: string }[];
  hubPath: string;
  hubLabel: string;
  directory?: { href: string; label: string }[];
};

const BUYERS: readonly Buyer[] = [
  {
    id: "clothing-brands",
    label: "clothing brands",
    job: "a line that design and production can both name",
  },
  {
    id: "manufacturers",
    label: "manufacturers",
    job: "a cutting ticket with construction and weight written down",
  },
  {
    id: "boutiques",
    label: "boutiques",
    job: "a small run where hand and colour are visible on the cloth",
  },
  {
    id: "designers",
    label: "fashion designers",
    job: "a silhouette matched to a cloth that can be cut",
  },
  {
    id: "apparel-startups",
    label: "apparel startups",
    job: "a first production spec the team can explain",
  },
  {
    id: "production-teams",
    label: "production teams",
    job: "the same construction next season, not a new mood board",
  },
  {
    id: "sourcing-teams",
    label: "sourcing teams",
    job: "a shortlist of fabric URLs other departments can open",
  },
  {
    id: "apparel-companies",
    label: "apparel companies",
    job: "separate shirtings, dress cloths and outerwear before comparing weight",
  },
];

const GSM_BANDS: readonly GsmBand[] = [
  {
    id: "under-100",
    label: "under 100 GSM",
    note: "Very light cloth. Opacity and lining come before fibre branding.",
  },
  {
    id: "100-150",
    label: "100 to 150 GSM",
    note: "A light apparel band. A poplin and a jersey can share it and still be different cloths.",
  },
  {
    id: "150-200",
    label: "150 to 200 GSM",
    note: "Mid-light apparel. Use it only after construction is fixed.",
  },
  {
    id: "200-280",
    label: "200 to 280 GSM",
    note: "Mid-weight territory for trousers, denser shirtings and some light jackets.",
  },
  {
    id: "280-400",
    label: "280 to 400 GSM",
    note: "Heavier apparel and lighter work layers. Heat retention rises with the mass.",
  },
  {
    id: "over-400",
    label: "over 400 GSM",
    note: "Dense cloth for outer or work layers. It is not a classic shirt weight.",
  },
];

const HUBS: readonly {
  family: TopicFamily;
  slug: string;
  label: string;
  intro: string;
}[] = [
  {
    family: "education",
    slug: "topic-education",
    label: "Marketplace education",
    intro:
      "These notes explain how to read a FabStitch marketplace result. They do not replace the catalog at /marketplace/.",
  },
  {
    family: "b2b",
    slug: "topic-b2b",
    label: "B2B sourcing",
    intro:
      "Business sourcing notes for teams who need a fabric URL, not a private mood board. The commercial catalog stays on the marketplace.",
  },
  {
    family: "buying",
    slug: "topic-buying",
    label: "Buying guides",
    intro:
      "Buying notes for choosing cloth on FabStitch before an inquiry. Each page is one garment-and-attribute question.",
  },
  {
    family: "sourcing",
    slug: "topic-sourcing",
    label: "Sourcing guides",
    intro:
      "Sourcing notes for building a marketplace shortlist. Start here when the question is where to look, not what a fibre is called.",
  },
  {
    family: "materials",
    slug: "topic-materials",
    label: "Materials",
    intro:
      "Material notes tied to woven or knit construction on the marketplace. Fibre essays on discover stay the reference; these pages are the search step.",
  },
  {
    family: "comparisons",
    slug: "topic-comparisons",
    label: "Comparisons",
    intro:
      "Side-by-side notes for two real FabStitch materials. Neither page crowns a universal winner.",
  },
  {
    family: "attributes",
    slug: "topic-attributes",
    label: "Attributes",
    intro:
      "Attribute notes for marketplace filters such as weight class, hand and cover. The attribute is a constraint, not a ranking.",
  },
  {
    family: "weight",
    slug: "topic-weight",
    label: "GSM and weight",
    intro:
      "Weight notes for planning a marketplace search. GSM bands are planning ranges, not a quality score and not a promise that every cloth publishes that number.",
  },
  {
    family: "use-cases",
    slug: "topic-use-cases",
    label: "Use cases",
    intro:
      "Use-case notes for matching construction to a garment family on the marketplace.",
  },
  {
    family: "buyers",
    slug: "topic-buyers",
    label: "Buyer types",
    intro:
      "Notes for real buying roles. They describe how that role can use the marketplace. They do not invent certifications, minimums or prices.",
  },
];

const HUB_BY_FAMILY = new Map(HUBS.map((hub) => [hub.family, hub]));
const RESERVED = new Set([
  "fabrics",
  ...MARKETPLACE_SUPPORT_PAGES.map((page) => page.slug),
  ...HUBS.map((hub) => hub.slug),
]);

const COTTON = "/media/fabrics/cotton-poplin-primary.webp";

function hash(value: string): number {
  let h = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    h ^= value.charCodeAt(index);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(items: readonly T[], seed: string, salt = 0): T {
  return items[(hash(`${seed}:${salt}`) + salt) % items.length]!;
}

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function pathFor(slug: string): string {
  return `/marketplace/${slug}/`;
}

function collectionPath(slug?: string): string | undefined {
  if (!slug) return undefined;
  return slug in COLLECTION_BY_SLUG ? `/collections/${slug}/` : undefined;
}

const USE_CASE_SLUGS = new Set<string>(SEO_USE_CASES.map((item) => item.slug));

function bestForPath(useId?: string): string | undefined {
  if (!useId || !USE_CASE_SLUGS.has(useId)) return undefined;
  return `/fabrics/best-for/${useId}/`;
}

function topicPicture(partial: {
  material?: MaterialEntity;
  other?: MaterialEntity;
  use?: UseEntity;
  attribute?: AttributeEntity;
  construction?: ConstructionEntity;
}): { path: string; alt: string } {
  return illustrativeImage({
    materialHint: partial.material?.imageHint,
    peerHint: partial.other?.imageHint,
    useId: partial.use?.id,
    attributeId: partial.attribute?.id,
    constructionId: partial.construction?.id,
  });
}

type Draft = {
  slug: string;
  family: TopicFamily;
  kind: TopicKind;
  title: string;
  h1: string;
  description: string;
  keyword: string;
  imagePath: string;
  imageAlt: string;
  material?: MaterialEntity;
  other?: MaterialEntity;
  use?: UseEntity;
  attribute?: AttributeEntity;
  construction?: ConstructionEntity;
  buyer?: Buyer;
  gsm?: GsmBand;
};

function draftBase(
  partial: Omit<Draft, "imagePath" | "imageAlt"> & {
    imagePath?: string;
    imageAlt?: string;
  },
): Draft {
  const image = topicPicture(partial);
  return {
    ...partial,
    imagePath: partial.imagePath ?? image.path,
    imageAlt: partial.imageAlt ?? image.alt,
  };
}

function materialUseDrafts(): Draft[] {
  const lenses: TopicFamily[] = ["education", "b2b", "sourcing"];
  return MATERIALS.flatMap((material) =>
    USES.map((use) => {
      const slug = `source-${material.id}-for-${use.id}`;
      return draftBase({
        slug,
        family: lenses[hash(slug) % lenses.length]!,
        kind: "material-use",
        title: `Source ${material.label} for ${titleCase(use.label)}`,
        h1: `How to source ${material.label.toLowerCase()} for ${use.label}`,
        description: `Search the FabStitch marketplace for ${material.label.toLowerCase()} ${use.label}. Read construction before GSM, then inquire on one fabric URL.`,
        keyword: `source ${material.label.toLowerCase()} for ${use.label}`,
        material,
        use,
      });
    }),
  );
}

function materialAttributeDrafts(): Draft[] {
  return MATERIALS.flatMap((material) =>
    ATTRIBUTES.map((attribute) =>
      draftBase({
        slug: `${attribute.id}-${material.id}-marketplace`,
        family: "attributes",
        kind: "material-attribute",
        title: `${titleCase(attribute.label)} ${material.label} on the Marketplace`,
        h1: `Finding ${attribute.label} ${material.label.toLowerCase()}`,
        description: `Use the FabStitch marketplace to look for ${attribute.label} ${material.label.toLowerCase()}. Treat the attribute as a constraint and confirm it on the fabric page.`,
        keyword: `${attribute.label} ${material.label.toLowerCase()} marketplace`,
        material,
        attribute,
      }),
    ),
  );
}

function attributeUseDrafts(): Draft[] {
  return USES.flatMap((use) =>
    ATTRIBUTES.map((attribute) =>
      draftBase({
        slug: `${attribute.id}-for-${use.id}-buying`,
        family: "buying",
        kind: "use-attribute",
        title: `Buying ${titleCase(attribute.label)} ${titleCase(use.label)} Cloth`,
        h1: `How to buy ${attribute.label} cloth for ${use.label}`,
        description: `Buy ${use.label} fabric on FabStitch with ${attribute.label} as the constraint. Compare cloths that share a construction.`,
        keyword: `buy ${attribute.label} fabric for ${use.label}`,
        use,
        attribute,
      }),
    ),
  );
}

function materialConstructionDrafts(): Draft[] {
  return MATERIALS.flatMap((material) =>
    CONSTRUCTIONS.map((construction) =>
      draftBase({
        slug: `${construction.id}-${material.id}-marketplace-notes`,
        family: "materials",
        kind: "material-construction",
        title: `${titleCase(construction.label)} ${material.label} Marketplace Notes`,
        h1: `${titleCase(construction.label)} ${material.label.toLowerCase()} on the marketplace`,
        description: `Review ${construction.label} ${material.label.toLowerCase()} on the FabStitch marketplace. Construction changes the cloth more than the fibre name alone.`,
        keyword: `${construction.label} ${material.label.toLowerCase()} marketplace`,
        material,
        construction,
      }),
    ),
  );
}

function constructionUseDrafts(): Draft[] {
  return USES.flatMap((use) =>
    CONSTRUCTIONS.map((construction) =>
      draftBase({
        slug: `${construction.id}-cloth-for-${use.id}`,
        family: "use-cases",
        kind: "use-construction",
        title: `${titleCase(construction.label)} Cloth for ${titleCase(use.label)}`,
        h1: `When ${use.label} need a ${construction.label}`,
        description: `Decide whether ${use.label} on FabStitch should start as a ${construction.label}. Then open fabric pages and compare published specs.`,
        keyword: `${construction.label} fabric for ${use.label}`,
        use,
        construction,
      }),
    ),
  );
}

function materialBuyerDrafts(): Draft[] {
  return BUYERS.flatMap((buyer) =>
    MATERIALS.map((material) =>
      draftBase({
        slug: `${buyer.id}-sourcing-${material.id}`,
        family: "buyers",
        kind: "material-buyer",
        title: `${titleCase(buyer.label)} Sourcing ${material.label}`,
        h1: `How ${buyer.label} can source ${material.label.toLowerCase()}`,
        description: `${titleCase(buyer.label)} can shortlist ${material.label.toLowerCase()} on the FabStitch marketplace, then inquire with quantity and end use.`,
        keyword: `${buyer.label} sourcing ${material.label.toLowerCase()}`,
        material,
        buyer,
      }),
    ),
  );
}

function gsmDrafts(): Draft[] {
  return USES.flatMap((use) =>
    GSM_BANDS.map((gsm) =>
      draftBase({
        slug: `${use.id}-fabric-${gsm.id}`,
        family: "weight",
        kind: "use-gsm",
        title: `${titleCase(use.label)} Fabric ${gsm.label}`,
        h1: `Selecting ${use.label} fabric ${gsm.label.toLowerCase()}`,
        description: `Plan a FabStitch search for ${use.label} ${gsm.label.toLowerCase()}. The band is a planning range, not proof a cloth publishes that GSM.`,
        keyword: `${use.label} fabric ${gsm.label.toLowerCase()}`,
        use,
        gsm,
      }),
    ),
  );
}

function comparisonDrafts(): Draft[] {
  const seen = new Set<string>();
  const drafts: Draft[] = [];
  for (const material of MATERIALS) {
    for (const otherId of material.relatedMaterials) {
      const other = materialById(otherId);
      if (!other || other.id === material.id) continue;
      const [left, right] = [material, other].sort((a, b) =>
        a.id.localeCompare(b.id),
      );
      const key = `${left.id}:${right.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      drafts.push(
        draftBase({
          slug: `${left.id}-versus-${right.id}-marketplace`,
          family: "comparisons",
          kind: "comparison",
          title: `${left.label} versus ${right.label} for a Marketplace Shortlist`,
          h1: `Comparing ${left.label.toLowerCase()} and ${right.label.toLowerCase()}`,
          description: `Compare ${left.label.toLowerCase()} and ${right.label.toLowerCase()} before you inquire on FabStitch. Context decides, not a universal winner.`,
          keyword: `${left.label.toLowerCase()} versus ${right.label.toLowerCase()} marketplace`,
          material: left,
          other: right,
        }),
      );
    }
  }
  return drafts;
}

function words(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function sectionWords(sections: TopicSection[], extra: string[]): number {
  return words(
    [
      ...extra,
      ...sections.flatMap((section) => [section.heading, ...section.body]),
    ].join(" "),
  );
}

function deepenDraft(
  draft: Draft,
  composed: {
    intro: string;
    sections: TopicSection[];
    table?: TopicTable;
    faqs: { question: string; answer: string }[];
  },
) {
  const sections = [...composed.sections];
  const extras = extraTopicSections(draft);
  for (const section of extras) {
    const count = sectionWords(sections, [
      composed.intro,
      draft.h1,
      ...composed.faqs.flatMap((faq) => [faq.question, faq.answer]),
    ]);
    if (count >= 320) break;
    sections.push(section);
  }
  const count = sectionWords(sections, [
    composed.intro,
    draft.h1,
    draft.description,
    ...composed.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ]);
  if (count < 310) {
    sections.push({
      heading: "Before the inquiry",
      body: [
        `${draft.h1} should end with a fabric URL. Write the construction, the composition, and the weight only if the fabric page publishes it.`,
        `The search words for this note are “${draft.keyword}”. Do not widen them until this constraint is either met or dropped.`,
        draft.description,
      ],
    });
  }
  return { ...composed, sections };
}

function extraTopicSections(draft: Draft): TopicSection[] {
  const name = draft.h1;
  const material = draft.material;
  const other = draft.other;
  const use = draft.use;
  const attribute = draft.attribute;
  const construction = draft.construction;
  const sections: TopicSection[] = [];
  if (material) {
    sections.push({
      heading: `Reading ${material.label.toLowerCase()} on a fabric page`,
      body: [
        material.fiberNotes,
        material.handFeel,
        material.constructionNotes,
        material.weightNotes,
        material.buyerNotes,
      ],
    });
    sections.push({
      heading: `Where ${material.label.toLowerCase()} helps and where it does not`,
      body: [
        `${material.label} is often chosen because ${material.strengths.join(", ").toLowerCase()}.`,
        `Sample before you commit when ${material.watchouts.join(", ").toLowerCase()}.`,
        `Typical apparel uses named for this fibre are ${material.typicalUses.join(", ")}. ${name} does not add uses that the fabric page does not list.`,
      ],
    });
  }
  if (other) {
    sections.push({
      heading: `The other cloth in this comparison`,
      body: [
        other.fiberNotes,
        other.buyerNotes,
        `Strengths to test for ${other.label.toLowerCase()}: ${other.strengths.join(", ").toLowerCase()}.`,
        `Watchouts: ${other.watchouts.join(", ").toLowerCase()}.`,
      ],
    });
  }
  if (use) {
    sections.push({
      heading: `What ${use.label} asks of the cloth`,
      body: [
        use.weightGuidance,
        use.constructionGuidance,
        use.seasonalNotes,
        use.buyerNotes,
        `Requirements that show up in this brief: ${use.requirements.join(", ")}. Useful traits include ${use.preferredTraits.join(", ")}.`,
      ],
    });
  }
  if (attribute) {
    sections.push({
      heading: `How to judge ${attribute.label}`,
      body: [
        attribute.definition,
        attribute.whyItMatters,
        attribute.howToJudge,
        attribute.tradeoffs,
      ],
    });
  }
  if (construction) {
    sections.push({
      heading: `${construction.label} as a starting filter`,
      body: [
        `${construction.label} is a construction, not a fibre. ${name} only helps if the fabric page agrees with that construction.`,
        construction.id === "woven"
          ? "Woven cloth interlaces warp and weft. It is usually the more stable starting point when a pattern needs to hold a line."
          : "Knit cloth is built from loops. It usually moves more, so GSM comparisons with a woven are not fair.",
      ],
    });
  }
  if (draft.buyer) {
    sections.push({
      heading: `What ${draft.buyer.label} should bring back`,
      body: [
        `The job is ${draft.buyer.job}. Bring a fabric URL and the published composition, not an unnamed swatch.`,
        `${name} does not set a price, a certificate, or a factory minimum.`,
      ],
    });
  }
  if (draft.gsm) {
    sections.push({
      heading: `Using the ${draft.gsm.label} band`,
      body: [
        draft.gsm.note,
        "Heavier is not better. Compare the band only after construction is fixed, and leave the cell blank if the fabric page omits weight.",
      ],
    });
  }
  sections.push({
    heading: "What to do with this note",
    body: [
      `${name} is a search note for “${draft.keyword}”. Open the marketplace, keep one construction, and read the fabric page before you inquire.`,
      "Filtered marketplace URLs stay noindex. Share either the marketplace or a specific fabric URL.",
    ],
  });
  return sections;
}

function hubCopy(
  hub: (typeof HUBS)[number],
  children: readonly { h1: string }[],
): { heading: string; body: string[] }[] {
  const names = children.map((child) => child.h1);
  return [
    {
      heading: "How to use this list",
      body: [
        hub.intro,
        `The notes in ${hub.label} are separate questions. Start with ${names[0] ?? hub.label} only if that title matches the brief.`,
        "Open a note, then return to the marketplace to see published fabrics. A topic page is not a product and it is not a second catalog.",
        "Filtered marketplace URLs stay noindex. Share either the marketplace or a specific fabric page.",
      ],
    },
    {
      heading: `Notes in ${hub.label}`,
      body: names
        .slice(0, 12)
        .map(
          (name) =>
            `${name} is one note in this directory. It explains a search question. It does not replace the fabric page you inquire on, and it does not add a price or a certificate.`,
        ),
    },
  ];
}

function materialFact(material: MaterialEntity, seed: string): string {
  const strength = pick(material.strengths, seed, 1);
  const watch = pick(material.watchouts, seed, 2);
  return `${material.label} is filed here as ${material.family}. One reason to open it is ${strength.toLowerCase()}. One reason to sample is ${watch.toLowerCase()}.`;
}

function garmentFact(use: UseEntity, seed: string): string {
  const requirement = pick(use.requirements, seed, 3);
  const trait = pick(use.preferredTraits, seed, 4);
  return `For ${use.label}, the brief needs ${requirement}. A useful hand note is ${trait}.`;
}

function composeDraft(draft: Draft): {
  intro: string;
  sections: TopicSection[];
  table?: TopicTable;
  faqs: { question: string; answer: string }[];
} {
  const seed = draft.slug;
  const material = draft.material;
  const use = draft.use;
  const attribute = draft.attribute;
  const construction = draft.construction;
  const buyer = draft.buyer;
  const gsm = draft.gsm;
  const other = draft.other;

  if (draft.kind === "comparison" && material && other) {
    return {
      intro: `A marketplace shortlist can hold ${material.label.toLowerCase()} and ${other.label.toLowerCase()} at the same time. They are not interchangeable just because both can be cut into apparel.`,
      sections: [
        {
          heading: `What ${material.label.toLowerCase()} contributes`,
          body: [
            materialFact(material, seed),
            `${material.label} pages should be read for construction and weight, not only for the fibre name.`,
          ],
        },
        {
          heading: `What ${other.label.toLowerCase()} contributes`,
          body: [
            materialFact(other, `${seed}:b`),
            `${other.label} belongs in the shortlist only when its published construction fits the garment.`,
          ],
        },
        {
          heading: "How to choose without a winner",
          body: [
            `Keep ${material.label.toLowerCase()} when ${pick(material.strengths, seed, 5).toLowerCase()} is the constraint you cannot drop.`,
            `Keep ${other.label.toLowerCase()} when ${pick(other.strengths, `${seed}:b`, 5).toLowerCase()} matters more. Leave GSM blank if the fabric page does not publish it.`,
          ],
        },
        {
          heading: "Hand and weight",
          body: [
            material.handFeel,
            other.handFeel,
            `${material.weightNotes} ${other.weightNotes}`,
          ],
        },
        {
          heading: "Sourcing the shortlist",
          body: [
            material.buyerNotes,
            other.buyerNotes,
            "Open both families in the marketplace, then inquire with the garment and quantity. Do not treat either fibre as cheaper, larger, or universally better.",
          ],
        },
      ],
      table: {
        caption: `${material.label} and ${other.label} on a marketplace shortlist`,
        headers: ["", material.label, other.label],
        rows: [
          ["Family", material.family, other.family],
          [
            "Often considered for",
            material.typicalUses.slice(0, 3).join(", "),
            other.typicalUses.slice(0, 3).join(", "),
          ],
          [
            "A strength to test",
            pick(material.strengths, seed, 6),
            pick(other.strengths, `${seed}:b`, 6),
          ],
          [
            "A watchout",
            pick(material.watchouts, seed, 7),
            pick(other.watchouts, `${seed}:b`, 7),
          ],
        ],
      },
      faqs: [
        {
          question: `Is ${material.label.toLowerCase()} always better than ${other.label.toLowerCase()}?`,
          answer:
            "No. The garment, construction and published weight decide. Reputation is not a spec.",
        },
      ],
    };
  }

  if (draft.kind === "material-use" && material && use) {
    const lens =
      draft.family === "education"
        ? "Read the fabric page as a spec sheet: composition, construction, then weight."
        : draft.family === "b2b"
          ? "Share the fabric URL with the team. A screenshot does not carry the spec."
          : "Build a shortlist of two cloths in the same construction before you inquire.";
    return {
      intro: `Sourcing ${material.label.toLowerCase()} for ${use.label} on FabStitch starts in the marketplace, not in a second essay about the fibre.`,
      sections: [
        {
          heading: "Search",
          body: [
            `Filter toward ${material.label.toLowerCase()} and open only cards that can serve ${use.label}. ${garmentFact(use, seed)}`,
            lens,
          ],
        },
        {
          heading: "Read the cloth",
          body: [
            materialFact(material, seed),
            `Related materials buyers also open include ${material.relatedMaterials.slice(0, 3).join(", ")}. They are neighbours, not substitutes.`,
          ],
        },
        {
          heading: "Inquire",
          body: [
            `Name the ${use.garmentLabel}, the quantity and the fabric URL. Ask about ${pick(material.watchouts, seed, 8).toLowerCase()} if the page is silent.`,
            "Do not invent a price, a lead time or a test report.",
          ],
        },
      ],
      faqs: [
        {
          question: `Does every ${material.label.toLowerCase()} work for ${use.label}?`,
          answer: `No. ${pick(use.requirements, seed, 9)} still has to match the published construction.`,
        },
      ],
    };
  }

  if (draft.kind === "material-attribute" && material && attribute) {
    return {
      intro: `${titleCase(attribute.label)} is a constraint on ${material.label.toLowerCase()}, not a separate fibre. Confirm it on the fabric page after you filter.`,
      sections: [
        {
          heading: "Marketplace check",
          body: [
            materialFact(material, seed),
            `Judge ${attribute.label} together with construction. ${attribute.tradeoffs}`,
          ],
        },
        {
          heading: "What not to assume",
          body: [
            `A ${attribute.label} filter does not certify the cloth. ${material.typicalUses.slice(0, 3).join(", ")} are common places buyers test ${material.label.toLowerCase()}, and some of those garments will reject this attribute.`,
          ],
        },
      ],
      faqs: [
        {
          question: `Does ${attribute.label} ${material.label.toLowerCase()} mean every listing qualifies?`,
          answer:
            "No. Open the fabric page. If the spec does not support the attribute, drop the card.",
        },
      ],
    };
  }

  if (draft.kind === "use-attribute" && use && attribute) {
    return {
      intro: `Buying ${use.label} with a ${attribute.label} constraint means rejecting cloths that only match the adjective.`,
      sections: [
        {
          heading: "The garment test",
          body: [
            garmentFact(use, seed),
            `For ${use.garmentLabel}s, ${attribute.label} matters because ${attribute.whyItMatters.charAt(0).toLowerCase()}${attribute.whyItMatters.slice(1)}`,
          ],
        },
        {
          heading: "Keep the comparison fair",
          body: [
            `Stay inside one construction while you test ${attribute.label} for ${use.label}. ${attribute.tradeoffs}`,
          ],
        },
      ],
      faqs: [
        {
          question: `Can one ${attribute.label} cloth cover every ${use.garmentLabel}?`,
          answer: `Only if the fabric page also meets ${pick(use.requirements, seed, 9)}. Otherwise keep looking.`,
        },
      ],
    };
  }

  if (draft.kind === "material-construction" && material && construction) {
    return {
      intro: `${titleCase(construction.label)} ${material.label.toLowerCase()} is a construction decision. The fibre name does not tell you whether the cloth is stable or looped.`,
      sections: [
        {
          heading: "Start with construction",
          body: [
            `${construction.label} cloth ${construction.id === "woven" ? "interlaces warp and weft, so it is usually more stable" : "is built from loops, so it usually moves more"}. ${material.label} can still be made the other way.`,
            materialFact(material, seed),
          ],
        },
        {
          heading: "Inquiry limit",
          body: [
            `Ask whether this ${material.label.toLowerCase()} card is actually ${construction.label}. If the page names a different construction, it is a different search.`,
          ],
        },
      ],
      faqs: [
        {
          question: `Should ${material.label.toLowerCase()} always be ${construction.label}?`,
          answer: `No. Check the fabric page. ${pick(material.watchouts, seed, 4)} still applies.`,
        },
      ],
    };
  }

  if (draft.kind === "use-construction" && use && construction) {
    return {
      intro: `${titleCase(use.label)} can be cut from more than one construction. This note is only about starting with a ${construction.label}.`,
      sections: [
        {
          heading: "Why start here",
          body: [
            garmentFact(use, seed),
            `A ${construction.label} is the right first filter when ${pick(use.preferredTraits, seed, 6)} matters for the ${use.garmentLabel}.`,
          ],
        },
        {
          heading: "When to switch",
          body: [
            `If the ${use.garmentLabel} needs the other construction, start a separate marketplace search. Mixing ${construction.label} and the alternative in one grid makes GSM meaningless.`,
          ],
        },
      ],
      faqs: [
        {
          question: `Is a ${construction.label} required for ${use.label}?`,
          answer: `No. It is a starting constraint. ${pick(use.requirements, seed, 8)} can still rule it out.`,
        },
      ],
    };
  }

  if (draft.kind === "material-buyer" && material && buyer) {
    return {
      intro: `${titleCase(buyer.label)} use the marketplace to find ${material.label.toLowerCase()} they can specify. The job in front of them is ${buyer.job}.`,
      sections: [
        {
          heading: "What to bring back",
          body: [
            materialFact(material, seed),
            "Bring a fabric URL and the published composition. Do not bring an unnamed swatch photo as the spec.",
          ],
        },
        {
          heading: "What this role should not assume",
          body: [
            `${titleCase(buyer.label)} still need sampling for ${pick(material.watchouts, seed, 2).toLowerCase()}.`,
            "FabStitch does not add a price, a certificate or a factory minimum on this page.",
          ],
        },
      ],
      faqs: [
        {
          question: `Where should ${buyer.label} start?`,
          answer: `Open the marketplace, search ${material.label.toLowerCase()}, and keep one construction before comparing weight.`,
        },
      ],
    };
  }

  if (draft.kind === "use-gsm" && use && gsm) {
    return {
      intro: `${gsm.label} is a planning band for ${use.label}. It is not a score, and it is not evidence that a FabStitch fabric publishes that exact number.`,
      sections: [
        {
          heading: "How to use the band",
          body: [gsm.note, garmentFact(use, seed)],
        },
        {
          heading: "What still matters more",
          body: [
            `Compare GSM only inside one construction. ${use.constructionGuidance.split(".")[0]}.`,
            "If the fabric page omits weight, leave the cell blank and ask in the inquiry.",
          ],
        },
      ],
      table: {
        caption: `${use.label} planned ${gsm.label}`,
        headers: ["Question", "On this page", "On the fabric page"],
        rows: [
          ["Band", gsm.label, "Only if GSM is published"],
          ["Garment", use.label, use.garmentLabel],
          [
            "First requirement",
            pick(use.requirements, seed, 1),
            "Must match the written spec",
          ],
        ],
      },
      faqs: [
        {
          question: `Does ${gsm.label} mean better ${use.label}?`,
          answer: "No. Heavier is not better. It is only heavier.",
        },
      ],
    };
  }

  return {
    intro: draft.description,
    sections: [{ heading: "Marketplace", body: [draft.description] }],
    faqs: [],
  };
}

function hubPath(family: TopicFamily): string {
  return pathFor(HUB_BY_FAMILY.get(family)!.slug);
}

function discoverPath(draft: Draft): string | undefined {
  if (draft.kind === "comparison" && draft.material && draft.other) {
    const [left, right] = [draft.material.id, draft.other.id].sort();
    const page = getSemanticPage(`${left}-vs-${right}`);
    return page?.indexable ? page.path : undefined;
  }
  if (draft.material) {
    const page = getSemanticPage(`${draft.material.id}-fabric`);
    if (page?.indexable) return page.path;
    return draft.material.collectionSlug
      ? `/collections/${draft.material.collectionSlug}/`
      : undefined;
  }
  return undefined;
}

function secondaryKeywords(draft: Draft): string[] {
  const terms = [
    draft.material ? `${draft.material.label.toLowerCase()} fabric` : "",
    draft.other ? `${draft.other.label.toLowerCase()} fabric` : "",
    draft.use ? `fabric for ${draft.use.label}` : "",
    draft.attribute ? `${draft.attribute.label} fabric` : "",
    draft.construction ? `${draft.construction.label} fabric` : "",
    draft.buyer ? `${draft.buyer.label} fabric sourcing` : "",
    draft.gsm ? "fabric gsm" : "",
    draft.kind === "comparison" ? "fabric comparison" : "fabric sourcing",
  ].filter((term) => term && term !== draft.keyword);
  return [...new Set(terms)].slice(0, 5);
}

function relatedFor(draft: Draft, sibling?: string): string[] {
  const paths = [
    "/marketplace/",
    hubPath(draft.family),
    "/fabrics/",
    "/guides/",
    collectionPath(draft.material?.collectionSlug),
    collectionPath(draft.other?.collectionSlug),
    bestForPath(draft.use?.id),
    discoverPath(draft),
    draft.kind === "use-gsm" ? "/guides/fabric-weight-and-gsm/" : undefined,
    draft.kind === "material-construction" || draft.kind === "use-construction"
      ? "/guides/woven-vs-knit-fabrics/"
      : undefined,
    sibling,
  ];
  return paths.filter(
    (path, index, all): path is string =>
      Boolean(path) && all.indexOf(path) === index,
  );
}

function buildArticles(): Draft[] {
  const comparisons = comparisonDrafts();
  const buyers = materialBuyerDrafts().slice(0, 110);
  const gsm = gsmDrafts();
  const attributes = materialAttributeDrafts();
  const useAttributes = attributeUseDrafts();
  const constructions = materialConstructionDrafts();
  const useConstructions = constructionUseDrafts();
  const fixed =
    comparisons.length +
    buyers.length +
    gsm.length +
    attributes.length +
    useAttributes.length +
    constructions.length +
    useConstructions.length;
  const materialUses = materialUseDrafts();
  const need = 990 - fixed;
  if (need < 1 || need > materialUses.length) {
    throw new Error(
      `Marketplace topic mix is ${fixed} fixed pages; need ${need} material-use pages`,
    );
  }
  return [
    ...materialUses.slice(0, need),
    ...attributes,
    ...useAttributes,
    ...constructions,
    ...useConstructions,
    ...buyers,
    ...gsm,
    ...comparisons,
  ];
}

function assertUnique(label: string, values: string[]) {
  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const value of values) {
    const key = value.toLowerCase();
    if (seen.has(key)) dupes.push(value);
    seen.add(key);
  }
  if (dupes.length) {
    throw new Error(
      `Duplicate marketplace topic ${label}: ${dupes.slice(0, 8).join(" | ")}`,
    );
  }
}

function finish(drafts: Draft[]): MarketplaceTopicRecord[] {
  const slugs = drafts.map((draft) => draft.slug);
  if (slugs.some((slug) => RESERVED.has(slug))) {
    throw new Error("Marketplace topic slug collides with a reserved slug");
  }
  assertUnique("slug", slugs);
  assertUnique(
    "title",
    drafts.map((draft) => draft.title),
  );
  assertUnique(
    "h1",
    drafts.map((draft) => draft.h1),
  );
  assertUnique(
    "description",
    drafts.map((draft) => draft.description),
  );
  assertUnique(
    "keyword",
    drafts.map((draft) => draft.keyword),
  );

  const byFamily = new Map<TopicFamily, Draft[]>();
  for (const draft of drafts) {
    const list = byFamily.get(draft.family) ?? [];
    list.push(draft);
    byFamily.set(draft.family, list);
  }

  const articles: MarketplaceTopicRecord[] = drafts.map((draft) => {
    const familyDrafts = byFamily.get(draft.family)!;
    const localIndex = familyDrafts.indexOf(draft);
    const sibling = familyDrafts[(localIndex + 1) % familyDrafts.length];
    const siblingPath =
      sibling && sibling.slug !== draft.slug
        ? pathFor(sibling.slug)
        : undefined;
    const composed = deepenDraft(draft, composeDraft(draft));
    const count = sectionWords(composed.sections, [
      draft.title,
      draft.h1,
      draft.description,
      composed.intro,
      ...composed.faqs.flatMap((faq) => [faq.question, faq.answer]),
    ]);
    if (count < 300) {
      throw new Error(`Thin marketplace topic ${draft.slug} (${count})`);
    }
    return {
      slug: draft.slug,
      path: pathFor(draft.slug),
      family: draft.family,
      kind: draft.kind,
      title: draft.title,
      h1: draft.h1,
      description: draft.description,
      primaryKeyword: draft.keyword,
      secondaryKeywords: secondaryKeywords(draft),
      imagePath: draft.imagePath,
      imageAlt: draft.imageAlt,
      relatedPaths: relatedFor(draft, siblingPath),
      wordCount: count,
    };
  });

  const hubs: MarketplaceTopicRecord[] = HUBS.map((hub) => {
    const children = articles.filter((page) => page.family === hub.family);
    if (!children.length)
      throw new Error(`Empty marketplace hub ${hub.family}`);
    return {
      slug: hub.slug,
      path: pathFor(hub.slug),
      family: hub.family,
      kind: "hub",
      title: `${hub.label} Topics`,
      h1: hub.label,
      description: hub.intro,
      primaryKeyword: `${hub.label.toLowerCase()} marketplace topics`,
      secondaryKeywords: [hub.label.toLowerCase(), "fabric sourcing"],
      imagePath: COTTON,
      imageAlt: imageAlt(COTTON),
      relatedPaths: [
        "/marketplace/",
        "/fabrics/",
        "/collections/",
        "/guides/",
        ...children.map((child) => child.path),
      ],
      wordCount: sectionWords(
        hubCopy(hub, children).map((section) => ({
          heading: section.heading,
          body: section.body,
        })),
        children.map((child) => child.h1),
      ),
    };
  });

  const pages = [...hubs, ...articles];
  if (pages.length !== MARKETPLACE_TOPIC_TARGET) {
    throw new Error(
      `Expected ${MARKETPLACE_TOPIC_TARGET} marketplace topics, received ${pages.length} from ${drafts.length} articles`,
    );
  }
  assertUnique(
    "slug",
    pages.map((page) => page.slug),
  );
  assertUnique(
    "title",
    pages.map((page) => page.title),
  );
  assertUnique(
    "keyword",
    pages.map((page) => page.primaryKeyword),
  );
  return pages;
}

const DRAFTS = buildArticles();
const DRAFT_BY_SLUG = new Map(DRAFTS.map((draft) => [draft.slug, draft]));

export const MARKETPLACE_TOPIC_PAGES: readonly MarketplaceTopicRecord[] =
  finish(DRAFTS);

const RECORD_BY_SLUG = new Map(
  MARKETPLACE_TOPIC_PAGES.map((page) => [page.slug, page]),
);

export const MARKETPLACE_TOPIC_HUBS = HUBS.map((hub) => ({
  ...hub,
  path: pathFor(hub.slug),
}));

export function getMarketplaceTopic(
  slug: string,
): MarketplaceTopicView | undefined {
  const record = RECORD_BY_SLUG.get(slug);
  if (!record) return undefined;
  const hub = HUB_BY_FAMILY.get(record.family)!;
  if (record.kind === "hub") {
    const directory = MARKETPLACE_TOPIC_PAGES.filter(
      (page) => page.family === record.family && page.kind !== "hub",
    ).map((page) => ({ href: page.path, label: page.h1 }));
    return {
      ...record,
      intro: hub.intro,
      sections: hubCopy(
        hub,
        directory.map((item) => ({ h1: item.label })),
      ),
      faqs: [
        {
          question: "Do these pages replace the marketplace?",
          answer:
            "No. They explain a search question. The commercial catalog remains /marketplace/.",
        },
      ],
      hubPath: record.path,
      hubLabel: hub.label,
      directory,
    };
  }
  const draft = DRAFT_BY_SLUG.get(slug);
  if (!draft) return undefined;
  const composed = composeDraft(draft);
  return {
    ...record,
    ...composed,
    hubPath: hubPath(record.family),
    hubLabel: hub.label,
  };
}
