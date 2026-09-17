import {
  ATTRIBUTES,
  CONSTRUCTIONS,
  MATERIALS,
  USES,
  type MaterialEntity,
  type SemanticCluster,
  type SemanticIntent,
  type SemanticPageType,
} from "./ontology";
import { isDoorwayKeyword, isReservedSemanticSlug } from "./reserved";
import type { SemanticTopic } from "./types";

function slugify(parts: string[]): string {
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function signatureFor(parts: {
  pageType: SemanticPageType;
  materialId?: string;
  useId?: string;
  attributeId?: string;
  constructionId?: string;
  peerId?: string;
  educationKey?: string;
}): string {
  return [
    parts.pageType,
    parts.materialId ?? "",
    parts.useId ?? "",
    parts.attributeId ?? "",
    parts.constructionId ?? "",
    parts.peerId ?? "",
    parts.educationKey ?? "",
  ].join("|");
}

function topic(input: {
  slug: string;
  pageType: SemanticPageType;
  cluster: SemanticCluster;
  intent: SemanticIntent;
  primaryKeyword: string;
  secondaryKeywords?: readonly string[];
  material?: MaterialEntity;
  useId?: string;
  attributeId?: string;
  constructionId?: string;
  peer?: MaterialEntity;
  educationKey?: string;
}): SemanticTopic | null {
  if (isReservedSemanticSlug(input.slug)) return null;
  if (isDoorwayKeyword(input.primaryKeyword)) return null;

  const use = input.useId
    ? USES.find((item) => item.id === input.useId)
    : undefined;
  const attribute = input.attributeId
    ? ATTRIBUTES.find((item) => item.id === input.attributeId)
    : undefined;
  const construction = input.constructionId
    ? CONSTRUCTIONS.find((item) => item.id === input.constructionId)
    : undefined;

  return {
    slug: input.slug,
    path: `/discover/${input.slug}/`,
    pageType: input.pageType,
    cluster: input.cluster,
    intent: input.intent,
    primaryKeyword: input.primaryKeyword,
    secondaryKeywords: input.secondaryKeywords ?? [],
    material: input.material,
    use,
    attribute,
    construction,
    comparisonPeer: input.peer,
    educationKey: input.educationKey,
    signature: signatureFor({
      pageType: input.pageType,
      materialId: input.material?.id,
      useId: use?.id,
      attributeId: attribute?.id,
      constructionId: construction?.id,
      peerId: input.peer?.id,
      educationKey: input.educationKey,
    }),
  };
}

function materialUseAllowed(material: MaterialEntity, useId: string): boolean {
  if (material.typicalUses.includes(useId)) return true;

  const extra: Record<string, readonly string[]> = {
    lyocell: ["shirts", "dresses", "blouses"],
    oxford: ["shirts", "blouses", "uniforms"],
    poplin: ["shirts", "blouses", "uniforms"],
    twill: ["trousers", "jackets", "uniforms", "workwear"],
    polyester: ["activewear", "uniforms", "outerwear", "dresses", "linings"],
    jersey: ["shirts", "dresses", "activewear", "loungewear", "knitwear"],
    viscose: ["dresses", "blouses", "shirts", "skirts"],
    rayon: ["dresses", "blouses", "skirts"],
    wool: ["suits", "jackets", "coats", "trousers", "blazers", "knitwear"],
    silk: ["dresses", "blouses", "scarves", "overlays", "linings", "skirts"],
    linen: ["shirts", "dresses", "trousers", "blouses", "skirts"],
    cotton: ["shirts", "dresses", "trousers", "blouses", "uniforms", "skirts"],
    denim: ["trousers", "jackets", "workwear"],
    velvet: ["dresses", "jackets", "blazers"],
    chiffon: ["dresses", "blouses", "overlays"],
    georgette: ["dresses", "blouses", "overlays"],
    satin: ["dresses", "blouses", "linings"],
    crepe: ["dresses", "blouses", "trousers", "suits"],
    canvas: ["workwear", "jackets", "trousers"],
    "french-terry": ["activewear", "loungewear", "knitwear"],
  };

  return Boolean(extra[material.id]?.includes(useId));
}

/**
 * Build the candidate universe from ontology combinations.
 * Near-duplicates and reserved hubs are filtered before composition.
 */
export function generateSemanticCandidates(): SemanticTopic[] {
  const out: SemanticTopic[] = [];
  const seenSignatures = new Set<string>();
  const seenSlugs = new Set<string>();

  const push = (candidate: SemanticTopic | null) => {
    if (!candidate) return;
    if (seenSignatures.has(candidate.signature)) return;
    if (seenSlugs.has(candidate.slug)) return;
    seenSignatures.add(candidate.signature);
    seenSlugs.add(candidate.slug);
    out.push(candidate);
  };

  for (const material of MATERIALS) {
    if (["cotton", "linen", "silk", "denim"].includes(material.id)) continue;
    push(
      topic({
        slug: slugify([material.id, "fabric"]),
        pageType: "material",
        cluster: "material",
        intent: "commercial_investigation",
        primaryKeyword: `${material.label.toLowerCase()} fabric`,
        secondaryKeywords: material.aliases,
        material,
      }),
    );
  }

  for (const use of USES) {
    push(
      topic({
        slug: slugify(["fabric-for", use.id]),
        pageType: "use_case",
        cluster: "use_case",
        intent: "commercial_investigation",
        primaryKeyword: `fabric for ${use.label}`,
        secondaryKeywords: [
          `${use.garmentLabel} fabric`,
          `fabrics for ${use.label}`,
        ],
        useId: use.id,
      }),
    );
  }

  for (const attribute of ATTRIBUTES) {
    push(
      topic({
        slug: slugify([attribute.id, "fabric"]),
        pageType: "attribute",
        cluster: "attribute",
        intent: "informational",
        primaryKeyword: `${attribute.label} fabric`,
        secondaryKeywords: [`${attribute.label} fabrics`],
        attributeId: attribute.id,
      }),
    );
  }

  for (const construction of CONSTRUCTIONS) {
    push(
      topic({
        slug: slugify([construction.id, "fabric"]),
        pageType: "construction",
        cluster: "construction",
        intent: "informational",
        primaryKeyword: `${construction.label} fabric`,
        secondaryKeywords: [`${construction.label} fabrics`],
        constructionId: construction.id,
      }),
    );
  }

  for (const material of MATERIALS) {
    for (const use of USES) {
      if (!materialUseAllowed(material, use.id)) continue;
      push(
        topic({
          slug: slugify([material.id, use.id]),
          pageType: "material_use",
          cluster: "material_use",
          intent: "commercial_investigation",
          primaryKeyword: `${material.label.toLowerCase()} fabric for ${use.label}`,
          secondaryKeywords: [
            `${material.label.toLowerCase()} ${use.garmentLabel} fabric`,
            `${use.garmentLabel} ${material.label.toLowerCase()} fabric`,
          ],
          material,
          useId: use.id,
        }),
      );
    }
  }

  for (const material of MATERIALS) {
    for (const attribute of ATTRIBUTES) {
      const nonsense =
        (attribute.id === "sheer" &&
          ["canvas", "denim", "twill", "oxford"].includes(material.id)) ||
        (attribute.id === "heavyweight" &&
          ["chiffon", "georgette"].includes(material.id)) ||
        (attribute.id === "flowy" && ["canvas", "denim"].includes(material.id));
      if (nonsense) continue;

      push(
        topic({
          slug: slugify([attribute.id, material.id, "fabric"]),
          pageType: "material_attribute",
          cluster: "material_attribute",
          intent: "commercial_investigation",
          primaryKeyword: `${attribute.label} ${material.label.toLowerCase()} fabric`,
          secondaryKeywords: [
            `${material.label.toLowerCase()} ${attribute.label} fabric`,
          ],
          material,
          attributeId: attribute.id,
        }),
      );
    }
  }

  for (const use of USES) {
    for (const attribute of ATTRIBUTES) {
      const nonsense =
        (attribute.id === "sheer" &&
          ["workwear", "uniforms", "coats"].includes(use.id)) ||
        (attribute.id === "flowy" &&
          ["workwear", "uniforms", "coats"].includes(use.id));
      if (nonsense) continue;

      push(
        topic({
          slug: slugify([attribute.id, use.garmentLabel, "fabric"]),
          pageType: "use_attribute",
          cluster: "use_attribute",
          intent: "commercial_investigation",
          primaryKeyword: `${attribute.label} ${use.garmentLabel} fabric`,
          secondaryKeywords: [`${attribute.label} fabric for ${use.label}`],
          useId: use.id,
          attributeId: attribute.id,
        }),
      );
    }
  }

  for (const material of MATERIALS) {
    push(
      topic({
        slug: slugify([material.id, "fabric-guide"]),
        pageType: "education",
        cluster: "education",
        intent: "informational",
        primaryKeyword: `${material.label.toLowerCase()} fabric guide`,
        secondaryKeywords: [
          `what is ${material.label.toLowerCase()} fabric`,
          `how to choose ${material.label.toLowerCase()} fabric`,
        ],
        material,
        educationKey: "material-guide",
      }),
    );
  }

  for (const use of USES) {
    push(
      topic({
        slug: slugify([use.garmentLabel, "fabric-guide"]),
        pageType: "education",
        cluster: "education",
        intent: "informational",
        primaryKeyword: `${use.garmentLabel} fabric guide`,
        secondaryKeywords: [
          `how to choose fabric for ${use.label}`,
          `types of ${use.garmentLabel} fabric`,
        ],
        useId: use.id,
        educationKey: "use-guide",
      }),
    );
  }

  for (const attribute of ATTRIBUTES) {
    push(
      topic({
        slug: slugify(["understanding", attribute.id, "fabric"]),
        pageType: "education",
        cluster: "education",
        intent: "informational",
        primaryKeyword: `what is ${attribute.label} fabric`,
        secondaryKeywords: [`${attribute.label} fabric meaning`],
        attributeId: attribute.id,
        educationKey: "attribute-guide",
      }),
    );
  }

  for (const left of MATERIALS) {
    for (const peerId of left.relatedMaterials) {
      const right = MATERIALS.find((item) => item.id === peerId);
      if (!right) continue;
      if (left.id >= right.id) continue;
      push(
        topic({
          slug: slugify([left.id, "vs", right.id]),
          pageType: "comparison",
          cluster: "comparison",
          intent: "informational",
          primaryKeyword: `${left.label.toLowerCase()} vs ${right.label.toLowerCase()}`,
          secondaryKeywords: [
            `${left.label.toLowerCase()} vs ${right.label.toLowerCase()} fabric`,
            `${right.label.toLowerCase()} vs ${left.label.toLowerCase()}`,
          ],
          material: left,
          peer: right,
          educationKey: "comparison",
        }),
      );
    }
  }

  for (const material of MATERIALS) {
    push(
      topic({
        slug: slugify(["buy", material.id, "fabric-online"]),
        pageType: "commercial",
        cluster: "commercial",
        intent: "commercial",
        primaryKeyword: `buy ${material.label.toLowerCase()} fabric online`,
        secondaryKeywords: [
          `${material.label.toLowerCase()} fabric online`,
          `order ${material.label.toLowerCase()} fabric`,
        ],
        material,
        educationKey: "buy-online",
      }),
    );
    push(
      topic({
        slug: slugify(["bulk", material.id, "fabric"]),
        pageType: "commercial",
        cluster: "commercial",
        intent: "commercial",
        primaryKeyword: `bulk ${material.label.toLowerCase()} fabric`,
        secondaryKeywords: [
          `${material.label.toLowerCase()} fabric wholesale`,
          `${material.label.toLowerCase()} fabric for wholesale`,
        ],
        material,
        educationKey: "bulk",
      }),
    );
  }

  for (const use of USES) {
    push(
      topic({
        slug: slugify(["buy", use.garmentLabel, "fabric-online"]),
        pageType: "commercial",
        cluster: "commercial",
        intent: "commercial",
        primaryKeyword: `buy ${use.garmentLabel} fabric online`,
        secondaryKeywords: [`${use.garmentLabel} fabric online`],
        useId: use.id,
        educationKey: "buy-use-online",
      }),
    );
  }

  const tripleAttributes = [
    "lightweight",
    "breathable",
    "soft",
    "stretch",
    "durable",
    "structured",
    "premium",
  ] as const;

  for (const material of MATERIALS) {
    for (const useId of material.typicalUses) {
      for (const attributeId of tripleAttributes) {
        push(
          topic({
            slug: slugify([attributeId, material.id, useId]),
            pageType: "material_use",
            cluster: "material_use",
            intent: "commercial_investigation",
            primaryKeyword: `${attributeId} ${material.label.toLowerCase()} fabric for ${useId}`,
            secondaryKeywords: [
              `${attributeId} ${material.label.toLowerCase()} ${
                USES.find((item) => item.id === useId)?.garmentLabel ?? useId
              } fabric`,
            ],
            material,
            useId,
            attributeId,
            educationKey: "triple",
          }),
        );
      }
    }
  }

  // material + construction where relevant
  for (const material of MATERIALS) {
    for (const construction of CONSTRUCTIONS) {
      if (
        construction.id === "knit" &&
        ["canvas", "oxford", "poplin", "denim", "twill"].includes(material.id)
      ) {
        continue;
      }
      if (
        construction.id === "woven" &&
        ["jersey", "french-terry"].includes(material.id)
      ) {
        continue;
      }
      push(
        topic({
          slug: slugify([construction.id, material.id, "fabric"]),
          pageType: "material_attribute",
          cluster: "construction",
          intent: "informational",
          primaryKeyword: `${construction.label} ${material.label.toLowerCase()} fabric`,
          secondaryKeywords: [
            `${material.label.toLowerCase()} ${construction.label} fabric`,
          ],
          material,
          constructionId: construction.id,
          educationKey: "material-construction",
        }),
      );
    }
  }

  return out;
}
