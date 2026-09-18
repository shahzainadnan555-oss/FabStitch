export type FabricQuestionCategory =
  | "definitions"
  | "materials"
  | "comparisons"
  | "quality"
  | "identification"
  | "sustainability"
  | "use-cases"
  | "care"
  | "marketplace";

export type FabricQuestionStatus =
  "PUBLISHED" | "DUPLICATE" | "MERGED" | "REJECTED-OFF-TOPIC";

export type FabricQuestionSource = {
  id: string;
  question: string;
  sourceReport: "deep-research-report.md" | "deep-research-report (1).md";
  sourceSection: string;
  originalWording: string;
  normalizedQuestion: string;
  status: FabricQuestionStatus;
  reason: string;
  /** Published slug, or an existing canonical path when merged elsewhere. */
  destination?: string;
};

export type FabricQuestionSection = {
  heading: string;
  paragraphs: readonly string[];
};

export type FabricQuestionTable = {
  caption: string;
  headers: readonly string[];
  rows: readonly (readonly string[])[];
};

export type FabricQuestionPage = {
  slug: string;
  kind: "index" | "category" | "question";
  category: FabricQuestionCategory | "index";
  path: string;
  question: string;
  normalizedQuestion: string;
  intent: "informational" | "commercial_investigation" | "commercial";
  primaryKeyword: string;
  secondaryKeywords: readonly string[];
  title: string;
  h1: string;
  description: string;
  answer: string;
  sections: readonly FabricQuestionSection[];
  points: readonly string[];
  faqs: readonly { question: string; answer: string }[];
  imagePath: string;
  imageAlt: string;
  relatedPaths: readonly string[];
  commercial: boolean;
  table?: FabricQuestionTable;
  sourceIds: readonly string[];
  wordCount: number;
};
