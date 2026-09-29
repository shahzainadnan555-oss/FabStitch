import { SEED_RECORDS } from "./catalog";
import type { ExpansionKind, ExpansionPlan, SeedRecord } from "./types";

const EXTRA_USE: Record<number, string> = {
  1: "dresses",
  2: "shirts",
  3: "trousers",
  4: "dresses",
  5: "jackets",
  6: "blouses",
  7: "linings",
  8: "overlays",
  9: "jackets",
  10: "linings",
  11: "overlays",
  12: "lingerie",
  13: "jackets",
  14: "jackets",
  15: "overlays",
  16: "shirts",
  17: "blouses",
  18: "knit tees",
  19: "jackets",
  20: "underwear",
  21: "bags",
  22: "shirts",
  23: "dresses",
  24: "shirts",
  25: "denim",
  26: "bags",
  27: "dresses",
  28: "trousers",
  29: "loungewear",
  30: "blouses",
  31: "jackets",
  32: "linings",
  33: "trousers",
  34: "midlayers",
  35: "dresses",
  36: "baby cloth",
  37: "jackets",
  38: "trousers",
  39: "jackets",
  40: "blouses",
  41: "uniforms",
  42: "repeating styles",
  43: "reorder programs",
  44: "shortlists",
  45: "tech packs",
  46: "finished cloth",
  47: "vendor maps",
  48: "converter lots",
  49: "bulk lots",
  50: "mill-direct programs",
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function plan(
  seed: SeedRecord,
  kind: ExpansionKind,
  slug: string,
  primaryKeyword: string,
  extras?: Partial<ExpansionPlan>,
): ExpansionPlan {
  return {
    pageId: `seed-${seed.id}-${kind}-${slug}`,
    slug,
    kind,
    seedId: seed.id,
    seedKeyword: seed.keyword,
    primaryKeyword,
    secondaryKeywords: [
      seed.keyword,
      seed.topic,
      seed.primaryUse,
      kind.replace("_", " "),
    ],
    ...extras,
  };
}

let PLAN_CACHE: ExpansionPlan[] | undefined;

export function generateSeedExpansionPlans(): ExpansionPlan[] {
  if (PLAN_CACHE) return PLAN_CACHE;
  const plans: ExpansionPlan[] = [];
  const seen = new Set<string>();

  const add = (next: ExpansionPlan) => {
    if (seen.has(next.slug)) {
      throw new Error(`Duplicate expansion slug: ${next.slug}`);
    }
    seen.add(next.slug);
    plans.push(next);
  };

  for (const seed of SEED_RECORDS) {
    add(
      plan(
        seed,
        "seed_support",
        `hub-brief-${seed.slug}`,
        `${seed.keyword} production brief`,
      ),
    );
    add(
      plan(
        seed,
        "education",
        `hub-meaning-${seed.slug}`,
        `what ${seed.keyword} means`,
      ),
    );
    add(
      plan(
        seed,
        "application",
        `hub-use-${seed.slug}`,
        `${seed.keyword} for ${seed.primaryUse}`,
        { useLabel: seed.primaryUse },
      ),
    );
    add(
      plan(
        seed,
        "buyer_spec",
        `hub-specify-${seed.slug}`,
        `how to specify ${seed.keyword}`,
      ),
    );
    add(
      plan(
        seed,
        "commercial",
        `hub-source-${seed.slug}`,
        `sourcing ${seed.keyword}`,
      ),
    );
    add(
      plan(
        seed,
        "comparison",
        `hub-vs-${seed.slug}-${seed.peerSlug}`,
        `${seed.keyword} compared with ${seed.peerKeyword}`,
        { peerKeyword: seed.peerKeyword },
      ),
    );
  }

  for (const seed of SEED_RECORDS) {
    const peer2 = seed.peer2Keyword ?? seed.peerKeyword;
    const peer2Slug = seed.peer2Slug ?? seed.peerSlug;
    add(
      plan(
        seed,
        "comparison",
        `hub-versus-${seed.slug}-${peer2Slug}`,
        `${seed.keyword} versus ${peer2}`,
        { peerKeyword: peer2 },
      ),
    );
  }

  for (const seed of SEED_RECORDS) {
    if (seed.id > 80) continue;
    add(
      plan(
        seed,
        "education",
        `hub-limits-${seed.slug}`,
        `${seed.keyword} limits and trade-offs`,
      ),
    );
  }

  for (const seed of SEED_RECORDS) {
    if (seed.id > 50) continue;
    const extra = EXTRA_USE[seed.id] ?? "clothing";
    add(
      plan(
        seed,
        "application",
        `hub-use-${seed.slug}-${slugify(extra)}`,
        `${seed.keyword} for ${extra}`,
        { useLabel: extra },
      ),
    );
  }

  for (const seed of SEED_RECORDS) {
    if (seed.id > 40) continue;
    add(
      plan(
        seed,
        "buyer_spec",
        `hub-sample-${seed.slug}`,
        `sampling ${seed.keyword} before bulk`,
      ),
    );
  }

  for (const seed of SEED_RECORDS) {
    if (seed.id > 90) continue;
    add(
      plan(
        seed,
        "question",
        `hub-ask-${seed.slug}`,
        seed.keyword,
        {
          question: questionFor(seed),
        },
      ),
    );
  }

  for (const seed of SEED_RECORDS) {
    if (seed.id < 41 || seed.id > 80) continue;
    add(
      plan(
        seed,
        "commercial",
        `hub-wholesale-notes-${seed.slug}`,
        `${seed.keyword} wholesale notes`,
      ),
    );
  }

  if (plans.length !== 1000) {
    throw new Error(`Expected 1000 expansion plans, got ${plans.length}`);
  }

  PLAN_CACHE = plans;
  return plans;
}

function questionFor(seed: SeedRecord): string {
  if (seed.group === "material" || seed.group === "construction") {
    return `How do you judge ${seed.keyword} for ${seed.primaryUse}?`;
  }
  if (seed.group === "property" || seed.group === "performance") {
    return `When is ${seed.keyword} the right choice?`;
  }
  if (seed.group === "application") {
    return `What should you check when buying ${seed.keyword}?`;
  }
  return `What belongs in a brief for ${seed.keyword}?`;
}

export function clusterDiscoverPaths(
  seedId: number,
  currentSlug: string,
): string[] {
  return generateSeedExpansionPlans()
    .filter((plan) => plan.seedId === seedId && plan.slug !== currentSlug)
    .slice(0, 8)
    .map((plan) => `/discover/${plan.slug}/`);
}
