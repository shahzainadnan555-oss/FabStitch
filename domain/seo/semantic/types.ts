import type {
  AttributeEntity,
  ConstructionEntity,
  MaterialEntity,
  SemanticCluster,
  SemanticIntent,
  SemanticPageType,
  UseEntity,
} from "./ontology";

export type SemanticFaq = {
  question: string;
  answer: string;
};

export type SemanticSection = {
  heading: string;
  body: string[];
  keyPoints?: string[];
};

export type SemanticTable = {
  caption: string;
  headers: readonly string[];
  rows: readonly (readonly string[])[];
};

export type SemanticTopic = {
  slug: string;
  path: string;
  pageType: SemanticPageType;
  cluster: SemanticCluster;
  intent: SemanticIntent;
  primaryKeyword: string;
  secondaryKeywords: readonly string[];
  material?: MaterialEntity;
  use?: UseEntity;
  attribute?: AttributeEntity;
  construction?: ConstructionEntity;
  comparisonPeer?: MaterialEntity;
  educationKey?: string;
  signature: string;
};

export type SemanticPage = SemanticTopic & {
  title: string;
  h1: string;
  metaDescription: string;
  eyebrow: string;
  intro: string;
  sections: readonly SemanticSection[];
  comparisonTable?: SemanticTable;
  faqs: readonly SemanticFaq[];
  relatedPaths: readonly string[];
  collectionSlugs: readonly string[];
  bestForSlugs: readonly string[];
  fabricQueryHints: readonly string[];
  ctaHeading: string;
  ctaBody: string;
  wordCount: number;
  indexable: boolean;
  qualityGatePassed: boolean;
  qualityNotes: readonly string[];
  imagePath?: string;
  imageAlt?: string;
};
