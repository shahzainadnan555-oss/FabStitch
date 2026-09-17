/**
 * Onboarding fabric imagery with guaranteed uniqueness within a question.
 *
 * Root cause of prior duplicates: per-option keyword/hash resolution could map
 * several taxonomy codes onto the same asset. Assignment is now batch-scoped.
 */

import { MEDIA_BY_FABRIC_SLUG } from "@/catalog/media";

export type OnboardingImageOption = {
  code: string;
  display_name: string;
};

type CategoryKey =
  | "cotton"
  | "silk"
  | "linen"
  | "denim"
  | "knit"
  | "wool"
  | "tailoring"
  | "performance"
  | "velvet"
  | "home"
  | "cellulosic"
  | "general";

const CATEGORY_MATCHERS: Array<{ key: CategoryKey; match: RegExp }> = [
  {
    key: "cotton",
    match:
      /cotton|poplin|voile|organdy|seersucker|oxford|broadcloth|percale|lawn|batiste|flannel|pique|terry/i,
  },
  {
    key: "silk",
    match: /silk|chiffon|georgette|organza|crepe|satin|habotai|dupion|taffeta/i,
  },
  { key: "linen", match: /linen|flax|ramie/i },
  { key: "denim", match: /denim|jean|indigo|selvedge/i },
  {
    key: "knit",
    match: /knit|jersey|french.?terry|interlock|rib|pointelle|ponte/i,
  },
  {
    key: "wool",
    match: /wool|tweed|cashmere|alpaca|melton|boiled|merino|casentino/i,
  },
  {
    key: "tailoring",
    match: /tailor|suit|twill|gabardine|canvas|drill|herringbone/i,
  },
  {
    key: "performance",
    match: /performance|polyester|nylon|active|sport|swim|ripstop|membrane/i,
  },
  { key: "velvet", match: /velvet|velveteen|corduroy|pile/i },
  {
    key: "home",
    match: /home|contract|upholstery|drape|curtain|bedding|acoustic/i,
  },
  {
    key: "cellulosic",
    match: /viscose|lyocell|modal|rayon|tencel/i,
  },
];

/** Explicit primary images for known interest codes. */
const EXPLICIT_BY_CODE: Record<string, string> = {
  cotton: "/media/fabrics/cotton-poplin-primary.webp",
  silk: "/media/fabrics/silk-chiffon-primary.webp",
  linen: "/media/fabrics/european-flax-linen-primary.webp",
  denim: "/media/fabrics/denim.jpg",
  knitwear: "/media/fabrics/french-terry-classic-primary.webp",
  knit: "/media/fabrics/pointelle-knit-primary.webp",
  tailoring: "/media/fabrics/tropical-wool-super-110s-130s-primary.webp",
  performance: "/media/fabrics/stretch-woven-compression-primary.webp",
  "home-contract": "/media/fabrics/heavy-linen-upholstery-primary.webp",
  wool: "/media/fabrics/boiled-wool-primary.webp",
  velvet: "/media/fabrics/crushed-velvet-primary.webp",
};

const CATEGORY_FALLBACKS: Record<CategoryKey, readonly string[]> = {
  cotton: [
    "/media/fabrics/cotton-poplin-primary.webp",
    "/media/fabrics/cotton-voile-primary.webp",
    "/media/fabrics/cotton-seersucker-primary.webp",
    "/media/fabrics/classic-oxford-cotton-primary.webp",
    "/media/fabrics/egyptian-cotton-poplin-primary.webp",
    "/media/fabrics/slub-cotton-primary.webp",
    "/media/fabrics/cotton-organdy-primary.webp",
    "/media/fabrics/organic-cotton-lawn-primary.webp",
  ],
  silk: [
    "/media/fabrics/silk-chiffon-primary.webp",
    "/media/fabrics/silk-georgette-primary.webp",
    "/media/fabrics/silk-organza-primary.webp",
    "/media/fabrics/crepe-de-chine-primary.webp",
    "/media/fabrics/silk-taffeta-primary.webp",
    "/media/fabrics/silk-satin-primary.webp",
    "/media/fabrics/silk-habotai-primary.webp",
  ],
  linen: [
    "/media/fabrics/european-flax-linen-primary.webp",
    "/media/fabrics/linen-cotton-primary.webp",
    "/media/fabrics/linen-silk-primary.webp",
    "/media/fabrics/linen-viscose-primary.webp",
    "/media/fabrics/linen-lyocell-primary.webp",
    "/media/fabrics/linen.jpg",
  ],
  denim: [
    "/media/fabrics/denim.jpg",
    "/media/fabrics/lightweight-denim-primary.webp",
    "/media/fabrics/premium-weight-denim-primary.webp",
    "/media/fabrics/selvedge-rigid-denim-primary.webp",
    "/media/fabrics/recycled-cotton-denim-primary.webp",
  ],
  knit: [
    "/media/fabrics/french-terry-classic-primary.webp",
    "/media/fabrics/pointelle-knit-primary.webp",
    "/media/fabrics/open-stitch-knit-primary.webp",
    "/media/fabrics/jersey.jpg",
    "/media/fabrics/ponte-structured-primary.webp",
    "/media/fabrics/lightweight-merino-knit-primary.webp",
  ],
  wool: [
    "/media/fabrics/boiled-wool-primary.webp",
    "/media/fabrics/melton-primary.webp",
    "/media/fabrics/double-face-wool-primary.webp",
    "/media/fabrics/donegal-tweed-primary.webp",
    "/media/fabrics/tropical-wool-super-110s-130s-primary.webp",
    "/media/fabrics/wool-silk-bi-stretch-primary.webp",
  ],
  tailoring: [
    "/media/fabrics/tropical-wool-super-110s-130s-primary.webp",
    "/media/fabrics/merino-roica-stretch-tailoring-primary.webp",
    "/media/fabrics/wool-linen-open-weave-primary.webp",
    "/media/fabrics/twill.jpg",
    "/media/fabrics/wool-viscose-twill-primary.webp",
  ],
  performance: [
    "/media/fabrics/stretch-woven-compression-primary.webp",
    "/media/fabrics/cooling-performance-construction-primary.webp",
    "/media/fabrics/recycled-nylon-ripstop-primary.webp",
    "/media/fabrics/polyester.jpg",
    "/media/fabrics/crossover-swimwear-fabric-primary.webp",
  ],
  velvet: [
    "/media/fabrics/crushed-velvet-primary.webp",
    "/media/fabrics/silk-viscose-velvet-primary.webp",
    "/media/fabrics/fine-wale-corduroy-primary.webp",
    "/media/fabrics/jumbo-corduroy-primary.webp",
  ],
  home: [
    "/media/fabrics/heavy-linen-upholstery-primary.webp",
    "/media/fabrics/canvas.jpg",
    "/media/fabrics/acoustic-rated-drape-primary.webp",
    "/media/fabrics/lyocell-blend-bedding-primary.webp",
  ],
  cellulosic: [
    "/media/fabrics/linen-viscose-primary.webp",
    "/media/fabrics/tencel-jersey-primary.webp",
    "/media/fabrics/tencel-sateen-primary.webp",
    "/media/fabrics/linen-lyocell-primary.webp",
  ],
  general: [
    "/media/fabrics/cotton-poplin-primary.webp",
    "/media/fabrics/silk-chiffon-primary.webp",
    "/media/fabrics/european-flax-linen-primary.webp",
    "/media/fabrics/denim.jpg",
    "/media/fabrics/boiled-wool-primary.webp",
    "/media/fabrics/french-terry-classic-primary.webp",
  ],
};

const CATALOG_IMAGE_POOL: readonly string[] = Object.values(
  MEDIA_BY_FABRIC_SLUG,
)
  .filter(
    (media): media is typeof media & { src: string } =>
      media.status === "final" &&
      typeof media.src === "string" &&
      media.src.length > 0,
  )
  .map((media) => media.src)
  .filter((src, index, all) => all.indexOf(src) === index);

function normalizeCode(code: string): string {
  return code.trim().toLowerCase().replaceAll("_", "-");
}

function categoryFor(code: string, displayName: string): CategoryKey {
  const haystack = `${code} ${displayName}`;
  for (const entry of CATEGORY_MATCHERS) {
    if (entry.match.test(haystack)) return entry.key;
  }
  return "general";
}

function preferredCandidates(
  code: string,
  displayName: string,
): readonly string[] {
  const normalized = normalizeCode(code);
  const category = categoryFor(code, displayName);
  const explicit = EXPLICIT_BY_CODE[normalized];
  const ranked = [
    ...(explicit ? [explicit] : []),
    ...CATEGORY_FALLBACKS[category],
    ...CATALOG_IMAGE_POOL,
  ];
  return ranked.filter((src, index, all) => all.indexOf(src) === index);
}

function hashCode(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function assertUniqueImages(
  assignments: ReadonlyMap<string, string>,
  context: string,
): void {
  const sources = [...assignments.values()];
  const unique = new Set(sources);
  if (sources.length !== unique.size) {
    const duplicates = sources.filter(
      (src, index) => sources.indexOf(src) !== index,
    );
    throw new Error(
      `Onboarding image duplication in ${context}: ${[...new Set(duplicates)].join(", ")}`,
    );
  }
}

/**
 * Assign one unique image per option for a single onboarding question.
 * Deterministic for a given options list order + codes.
 */
export function assignUniqueOnboardingFabricImages(
  options: readonly OnboardingImageOption[],
): Map<string, string> {
  const used = new Set<string>();
  const assignments = new Map<string, string>();
  const globalPool = [
    ...new Set([...Object.values(EXPLICIT_BY_CODE), ...CATALOG_IMAGE_POOL]),
  ];

  // First pass: try preferred category/explicit images without collisions.
  for (const option of options) {
    const code = option.code;
    const candidates = preferredCandidates(code, option.display_name);
    const preferred = candidates.find((src) => !used.has(src));
    if (preferred) {
      used.add(preferred);
      assignments.set(code, preferred);
    }
  }

  // Second pass: fill remaining from the global catalog pool stably.
  for (const option of options) {
    if (assignments.has(option.code)) continue;
    const start =
      hashCode(`${option.code}:${option.display_name}`) % globalPool.length;
    let chosen: string | undefined;
    for (let offset = 0; offset < globalPool.length; offset += 1) {
      const src = globalPool[(start + offset) % globalPool.length]!;
      if (!used.has(src)) {
        chosen = src;
        break;
      }
    }
    if (!chosen) {
      // Not enough unique assets — stop assigning rather than duplicate.
      break;
    }
    used.add(chosen);
    assignments.set(option.code, chosen);
  }

  assertUniqueImages(assignments, "assignUniqueOnboardingFabricImages");
  return assignments;
}

/**
 * Options that received a unique image. Drop any that could not be assigned
 * without reusing an image source.
 */
export function uniqueImagedOnboardingOptions<T extends OnboardingImageOption>(
  options: readonly T[],
): Array<T & { image: string }> {
  const assignments = assignUniqueOnboardingFabricImages(options);
  const imaged = options
    .map((option) => {
      const image = assignments.get(option.code);
      return image ? { ...option, image } : null;
    })
    .filter((option): option is T & { image: string } => Boolean(option));

  const sources = imaged.map((option) => option.image);
  if (sources.length !== new Set(sources).size) {
    throw new Error(
      "Onboarding fabric interest images are not unique after assignment.",
    );
  }
  return imaged;
}

/** @deprecated Prefer assignUniqueOnboardingFabricImages for question grids. */
export function resolveOnboardingFabricImage(
  code: string,
  displayName: string,
  index: number,
): string {
  const assignments = assignUniqueOnboardingFabricImages([
    { code, display_name: displayName },
  ]);
  return (
    assignments.get(code) ??
    CATALOG_IMAGE_POOL[
      (hashCode(code || displayName) + index) % CATALOG_IMAGE_POOL.length
    ]!
  );
}

export const FABRIC_OPTIONS = [
  {
    value: "cotton",
    label: "Cotton",
    image: EXPLICIT_BY_CODE.cotton!,
  },
  {
    value: "silk",
    label: "Silk",
    image: EXPLICIT_BY_CODE.silk!,
  },
  {
    value: "linen",
    label: "Linen",
    image: EXPLICIT_BY_CODE.linen!,
  },
  { value: "denim", label: "Denim", image: EXPLICIT_BY_CODE.denim! },
  {
    value: "knitwear",
    label: "Knitwear",
    image: EXPLICIT_BY_CODE.knitwear!,
  },
  {
    value: "tailoring",
    label: "Tailoring",
    image: EXPLICIT_BY_CODE.tailoring!,
  },
  {
    value: "performance",
    label: "Performance",
    image: EXPLICIT_BY_CODE.performance!,
  },
  {
    value: "home-contract",
    label: "Home & Contract",
    image: EXPLICIT_BY_CODE["home-contract"]!,
  },
] as const;

export const ONBOARDING_IMAGE_POOL = CATALOG_IMAGE_POOL;
