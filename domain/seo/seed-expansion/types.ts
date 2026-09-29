import type {
  SemanticCluster,
  SemanticIntent,
  SemanticPageType,
} from "@/domain/seo/semantic/ontology";

export type SeedGroup =
  | "material"
  | "property"
  | "construction"
  | "commercial"
  | "wholesale-type"
  | "application"
  | "performance"
  | "sourcing";

export type ExpansionKind =
  | "seed_support"
  | "education"
  | "application"
  | "buyer_spec"
  | "commercial"
  | "comparison"
  | "question";

export type SeedRecord = {
  id: number;
  keyword: string;
  slug: string;
  group: SeedGroup;
  topic: string;
  existingCanonical: string;
  peerKeyword: string;
  peerSlug: string;
  peer2Keyword?: string;
  peer2Slug?: string;
  primaryUse: string;
  useSlug: string;
  collectionPath?: string;
  bestForPath?: string;
  image: string;
  imageAlt: string;
  definition: string;
  makeup: string;
  feel: string;
  weight: string;
  uses: string;
  strengths: string;
  limits: string;
  care: string;
  sampling: string;
  climate: string;
  mistake: string;
  specCheck: string;
};

export type ExpansionPlan = {
  pageId: string;
  slug: string;
  kind: ExpansionKind;
  seedId: number;
  seedKeyword: string;
  primaryKeyword: string;
  secondaryKeywords: readonly string[];
  peerKeyword?: string;
  useLabel?: string;
  question?: string;
};

export type ExpansionMeta = {
  pageType: SemanticPageType;
  cluster: SemanticCluster;
  intent: SemanticIntent;
};
