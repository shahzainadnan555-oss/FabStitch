import { FABRIC_QUESTION_DRAFTS, buildQuestion } from "./drafts-a";
import { FABRIC_QUESTION_DRAFTS_B } from "./drafts-b";
import { FABRIC_QUESTION_DRAFTS_C } from "./drafts-c";
import { FABRIC_QUESTION_SOURCES } from "./inventory";
import type { FabricQuestionCategory, FabricQuestionPage } from "./types";

export const FABRIC_QUESTION_INDEX_PATH = "/guides/fabric-questions/";

const COTTON = "/media/fabrics/cotton-poplin-primary.webp";

const CATEGORIES: readonly {
  slug: FabricQuestionCategory;
  label: string;
  title: string;
  h1: string;
  description: string;
  answer: string;
}[] = [
  {
    slug: "definitions",
    label: "Fabric definitions",
    title: "Fabric Definition Questions",
    h1: "Fabric definitions",
    description:
      "Short answers on what fabric, cloth, textile, warp, weft, fiber, and yarn mean.",
    answer:
      "These pages define the words buyers mix up: fabric, textile, cloth, fiber, yarn, warp, and weft. Each page answers one term.",
  },
  {
    slug: "materials",
    label: "Fabric materials",
    title: "Fabric Material Questions",
    h1: "Fabric materials",
    description:
      "Answers on lyocell, satin, sheers, ripstop, cork, Aida, and linings, tied to real cloth names.",
    answer:
      "Material pages name one cloth family or construction. They do not replace the fabric record.",
  },
  {
    slug: "comparisons",
    label: "Fabric comparisons",
    title: "Fabric Comparison Questions",
    h1: "Fabric comparisons",
    description:
      "Side-by-side answers for polyester and cotton, sheers, voile, crepe, lyocell, and viscose.",
    answer:
      "Comparison pages keep two or three names apart. They do not declare a universal winner.",
  },
  {
    slug: "quality",
    label: "Fabric quality",
    title: "Fabric Quality Questions",
    h1: "Fabric quality",
    description:
      "Thread count, colour, seams, prints, and how to verify a cloth without a fake score.",
    answer:
      "Quality pages explain a metric or a failure. They do not score the catalog.",
  },
  {
    slug: "identification",
    label: "Fabric identification",
    title: "Fabric Identification Questions",
    h1: "Fabric identification",
    description:
      "How to read hand and construction, and why a burn test is not a home method.",
    answer:
      "Identification pages start with labels and structure. Laboratory tests stay in a lab.",
  },
  {
    slug: "sustainability",
    label: "Fabric sustainability",
    title: "Fabric Sustainability Questions",
    h1: "Fabric sustainability",
    description:
      "Organic cotton, lyocell, OEKO-TEX, and why a fiber name is not a certificate.",
    answer:
      "Sustainability pages explain a claim's scope. They do not stamp certifications onto cloth.",
  },
  {
    slug: "use-cases",
    label: "Fabric use cases",
    title: "Fabric Use-Case Questions",
    h1: "Fabric use cases",
    description:
      "Hot weather, winter, upholstery, children's clothing, and how to choose without a best-fabric claim.",
    answer:
      "Use-case pages start from the garment or the room. Tradeoffs stay visible.",
  },
  {
    slug: "care",
    label: "Fabric care",
    title: "Fabric Care Questions",
    h1: "Fabric care",
    description:
      "Labels, laundry, stains, storage, and why one wash cycle does not fit every cloth.",
    answer:
      "Care pages follow the label. They do not publish a universal recipe.",
  },
  {
    slug: "marketplace",
    label: "Marketplace and sourcing",
    title: "Fabric Marketplace Questions",
    h1: "Marketplace and sourcing",
    description:
      "MOQ, samples, wholesale context, and what FabStitch's marketplace is for.",
    answer:
      "Sourcing pages explain a buying term and, when it fits, point to the marketplace. They do not invent supplier terms.",
  },
];

function words(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function unique(paths: readonly string[]): string[] {
  return paths.filter((path, index) => path && paths.indexOf(path) === index);
}

const questions = [
  ...FABRIC_QUESTION_DRAFTS,
  ...FABRIC_QUESTION_DRAFTS_B,
  ...FABRIC_QUESTION_DRAFTS_C,
].map(buildQuestion);

const categories: FabricQuestionPage[] = CATEGORIES.map((category) => {
  const children = questions.filter((page) => page.category === category.slug);
  const path = `/guides/fabric-questions/${category.slug}/`;
  return {
    slug: category.slug,
    kind: "category",
    category: category.slug,
    path,
    question: category.h1,
    normalizedQuestion: category.h1.toLowerCase(),
    intent: "informational",
    primaryKeyword: category.h1.toLowerCase(),
    secondaryKeywords: ["fabric questions"],
    title: category.title,
    h1: category.h1,
    description: category.description,
    answer: category.answer,
    sections: [
      {
        heading: "Questions in this group",
        paragraphs: children.map(
          (page) =>
            `${page.h1} ${page.answer} Open that page when it is the decision in front of you, then use the marketplace if you need a published fabric.`,
        ),
      },
      {
        heading: `How to use ${category.label.toLowerCase()}`,
        paragraphs: [
          category.answer,
          `The titles in this group are ${children.map((page) => page.h1).join(", ")}. Each one answers a different question. Do not treat the group page as the answer.`,
          "These pages do not add a price, a certificate, or a supplier count. If the next step is cloth, open the fabric, collection, or marketplace link on the question page.",
          `${category.label} is finished when the answer matches the decision in front of you. ${category.answer} If it does not, leave this group instead of stretching ${children[0]?.h1 ?? category.h1} across care, sourcing, or a comparison that already has its own page.`,
          `The separate questions here are ${children.map((page) => page.h1).join("; ")}. Read one, then stop. The marketplace is the catalog after the question is answered, not a replacement for the answer.`,
        ],
      },
    ],
    points: children.slice(0, 4).map((page) => page.h1),
    faqs: [],
    imagePath: COTTON,
    imageAlt: "Cotton fabric used to illustrate fabric question guides",
    relatedPaths: unique([
      FABRIC_QUESTION_INDEX_PATH,
      "/guides/",
      ...children.map((page) => page.path),
    ]),
    commercial: category.slug === "marketplace",
    sourceIds: [],
    wordCount: words(
      [
        category.answer,
        category.description,
        ...children.flatMap((page) => [
          page.h1,
          page.answer,
          "Open that page when it is the decision in front of you, then use the marketplace if you need a published fabric.",
        ]),
        `The titles in this group are ${children.map((page) => page.h1).join(", ")}. Each one answers a different question. Do not treat the group page as the answer.`,
        "These pages do not add a price, a certificate, or a supplier count. If the next step is cloth, open the fabric, collection, or marketplace link on the question page.",
        `${category.label} is finished when the answer matches the decision in front of you. ${category.answer} If it does not, leave this group instead of stretching ${children[0]?.h1 ?? category.h1} across care, sourcing, or a comparison that already has its own page.`,
        `The separate questions here are ${children.map((page) => page.h1).join("; ")}. Read one, then stop. The marketplace is the catalog after the question is answered, not a replacement for the answer.`,
      ].join(" "),
    ),
  };
});

const indexPage: FabricQuestionPage = {
  slug: "index",
  kind: "index",
  category: "index",
  path: FABRIC_QUESTION_INDEX_PATH,
  question: "Fabric questions",
  normalizedQuestion: "fabric questions",
  intent: "informational",
  primaryKeyword: "fabric questions",
  secondaryKeywords: ["textile questions", "fabric guides"],
  title: "Fabric Questions",
  h1: "Fabric questions",
  description:
    "Direct answers to fabric, textile, care, and sourcing questions. Each page covers one question and links to the FabStitch page that already owns a topic.",
  answer:
    "This hub collects one page per distinct fabric question from the research inventory. Duplicates point at the page that already answers them. Off-topic items, including Microsoft Fabric, are not published.",
  sections: [
    {
      heading: "How to use it",
      paragraphs: [
        "Start with the group that matches the decision: a definition, a comparison, care, or a sourcing term.",
        "The marketplace remains the place to look at documented cloth. These pages do not replace it and they do not add a price, a certificate, or a supplier count.",
        ...categories.map(
          (page) =>
            `${page.h1}: ${page.answer} The questions in that group stay on their own pages.`,
        ),
      ],
    },
  ],
  points: CATEGORIES.map((category) => category.label),
  faqs: [
    {
      question: "Are trend scores on these pages?",
      answer:
        "No. Estimated scores in the source report are not treated as search volume.",
    },
  ],
  imagePath: COTTON,
  imageAlt: "Cotton fabric representing the fabric question hub",
  relatedPaths: unique([
    "/guides/",
    "/marketplace/",
    ...categories.map((page) => page.path),
  ]),
  commercial: false,
  sourceIds: [],
  wordCount: words(
    [
      "This hub collects one page per distinct fabric question from the research inventory. Duplicates point at the page that already answers them. Off-topic items, including Microsoft Fabric, are not published.",
      "Start with the group that matches the decision: a definition, a comparison, care, or a sourcing term.",
      "The marketplace remains the place to look at documented cloth. These pages do not replace it and they do not add a price, a certificate, or a supplier count.",
      ...categories.flatMap((page) => [page.h1, page.answer]),
      ...questions.map((page) => page.h1),
    ].join(" "),
  ),
};

export const FABRIC_QUESTION_PAGES: readonly FabricQuestionPage[] = [
  indexPage,
  ...categories,
  ...questions,
];

const bySlug = new Map(
  FABRIC_QUESTION_PAGES.filter((page) => page.kind !== "index").map((page) => [
    page.slug,
    page,
  ]),
);

export function getFabricQuestion(
  slug: string,
): FabricQuestionPage | undefined {
  return bySlug.get(slug);
}

export function fabricQuestionParent(path: string): string | undefined {
  const page = FABRIC_QUESTION_PAGES.find((item) => item.path === path);
  if (!page) return undefined;
  if (page.kind === "index") return "/guides/";
  if (page.kind === "category") return FABRIC_QUESTION_INDEX_PATH;
  return `/guides/fabric-questions/${page.category}/`;
}

function assertInventory(): void {
  const slugs = new Set(questions.map((page) => page.slug));
  for (const source of FABRIC_QUESTION_SOURCES) {
    if (source.status === "REJECTED-OFF-TOPIC") continue;
    if (!source.destination) {
      throw new Error(`Question ${source.id} has no destination`);
    }
    if (source.destination.startsWith("/")) continue;
    if (!slugs.has(source.destination)) {
      throw new Error(
        `Question ${source.id} points at missing slug ${source.destination}`,
      );
    }
  }
  const titles = new Set<string>();
  for (const page of FABRIC_QUESTION_PAGES) {
    const key = page.title.toLowerCase();
    if (titles.has(key))
      throw new Error(`Duplicate question title ${page.title}`);
    titles.add(key);
  }
}

assertInventory();

export { FABRIC_QUESTION_SOURCES, CATEGORIES as FABRIC_QUESTION_CATEGORIES };
export type {
  FabricQuestionPage,
  FabricQuestionSource,
  FabricQuestionCategory,
} from "./types";
