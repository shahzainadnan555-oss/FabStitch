/**
 * Distinct onboarding fabric imagery.
 * Avoid cycling the same few assets when taxonomy codes do not match exactly.
 */

const KEYWORD_IMAGES: Array<{ match: RegExp; src: string }> = [
  {
    match:
      /cotton|poplin|voile|organdy|seersucker|oxford|broadcloth|percale|sateen|lawn|batiste|flannel|pique|terry|jersey/i,
    src: "/media/fabrics/cotton-poplin-primary.webp",
  },
  {
    match: /silk|chiffon|georgette|organza|crepe|satin/i,
    src: "/media/fabrics/silk-chiffon-primary.webp",
  },
  {
    match: /linen|flax|ramie/i,
    src: "/media/fabrics/european-flax-linen-primary.webp",
  },
  { match: /denim|jean|indigo/i, src: "/media/fabrics/denim.jpg" },
  {
    match: /wool|tweed|cashmere|alpaca|melton|boiled/i,
    src: "/media/fabrics/boiled-wool-primary.webp",
  },
  {
    match: /knit|jersey|french.?terry|interlock|rib/i,
    src: "/media/fabrics/french-terry-classic-primary.webp",
  },
  {
    match: /tailor|suit|twill|gabardine|canvas|drill/i,
    src: "/media/fabrics/twill.jpg",
  },
  {
    match: /performance|polyester|nylon|active|sport|swim/i,
    src: "/media/fabrics/polyester.jpg",
  },
  {
    match: /home|contract|upholstery|drape|curtain|bedding/i,
    src: "/media/fabrics/canvas.jpg",
  },
  {
    match: /velvet|velveteen|corduroy/i,
    src: "/media/fabrics/crushed-velvet-primary.webp",
  },
  { match: /fleece|sherpa|polar/i, src: "/media/fabrics/fleece.jpg" },
  {
    match: /viscose|lyocell|modal|rayon|tencel/i,
    src: "/media/fabrics/linen-viscose-primary.webp",
  },
];

/** Curated pool of visually distinct approved assets for unmatched options. */
export const ONBOARDING_IMAGE_POOL = [
  "/media/fabrics/cotton-poplin-primary.webp",
  "/media/fabrics/silk-chiffon-primary.webp",
  "/media/fabrics/european-flax-linen-primary.webp",
  "/media/fabrics/denim.jpg",
  "/media/fabrics/french-terry-classic-primary.webp",
  "/media/fabrics/twill.jpg",
  "/media/fabrics/polyester.jpg",
  "/media/fabrics/canvas.jpg",
  "/media/fabrics/crushed-velvet-primary.webp",
  "/media/fabrics/fleece.jpg",
  "/media/fabrics/linen-viscose-primary.webp",
  "/media/fabrics/boiled-wool-primary.webp",
  "/media/fabrics/donegal-tweed-primary.webp",
  "/media/fabrics/cotton-seersucker-primary.webp",
  "/media/fabrics/silk-georgette-primary.webp",
  "/media/fabrics/classic-oxford-cotton-primary.webp",
] as const;

export const FABRIC_OPTIONS = [
  {
    value: "cotton",
    label: "Cotton",
    image: "/media/fabrics/cotton-poplin-primary.webp",
  },
  {
    value: "silk",
    label: "Silk",
    image: "/media/fabrics/silk-chiffon-primary.webp",
  },
  {
    value: "linen",
    label: "Linen",
    image: "/media/fabrics/european-flax-linen-primary.webp",
  },
  { value: "denim", label: "Denim", image: "/media/fabrics/denim.jpg" },
  {
    value: "knitwear",
    label: "Knitwear",
    image: "/media/fabrics/french-terry-classic-primary.webp",
  },
  { value: "tailoring", label: "Tailoring", image: "/media/fabrics/twill.jpg" },
  {
    value: "performance",
    label: "Performance",
    image: "/media/fabrics/polyester.jpg",
  },
  {
    value: "home-contract",
    label: "Home & Contract",
    image: "/media/fabrics/canvas.jpg",
  },
] as const;

function hashCode(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

/**
 * Resolve a unique-feeling image for an onboarding fabric interest option.
 * Prefer explicit mapping, then keyword match, then a stable hash into the pool.
 */
export function resolveOnboardingFabricImage(
  code: string,
  displayName: string,
  index: number,
): string {
  const explicit = FABRIC_OPTIONS.find(
    (item) =>
      item.value === code ||
      item.value === code.replaceAll("_", "-") ||
      item.label.toLowerCase() === displayName.toLowerCase(),
  );
  if (explicit) return explicit.image;

  const haystack = `${code} ${displayName}`;
  for (const entry of KEYWORD_IMAGES) {
    if (entry.match.test(haystack)) return entry.src;
  }

  // Spread unmatched options across the pool so adjacent cards differ.
  const offset =
    (hashCode(code || displayName) + index * 3) % ONBOARDING_IMAGE_POOL.length;
  return ONBOARDING_IMAGE_POOL[offset]!;
}
