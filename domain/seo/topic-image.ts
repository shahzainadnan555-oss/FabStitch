import { imageAlt } from "@/domain/seo/image-assets";

/** Photographs that actually show the cloth named in the file. */
const WOVEN = "/media/fabrics/cotton-poplin-primary.webp";
const KNIT = "/media/fabrics/mercerized-cotton-jersey-primary.webp";
const LINEN = "/media/fabrics/european-flax-linen-primary.webp";
const SILK = "/media/fabrics/silk-chiffon-primary.webp";
const WOOL = "/media/fabrics/tropical-wool-super-110s-130s-primary.webp";
const DENIM = "/media/fabrics/lightweight-denim-primary.webp";
const STRETCH = "/media/fabrics/stretch-woven-compression-primary.webp";
const VOILE = "/media/fabrics/cotton-voile-primary.webp";
const CANVAS = "/media/fabrics/wool-hemp-canvas-primary.webp";

const USE_IMAGE: Record<string, string> = {
  shirts: WOVEN,
  blouses: WOVEN,
  uniforms: WOVEN,
  dresses: SILK,
  skirts: LINEN,
  trousers: LINEN,
  jackets: WOOL,
  coats: WOOL,
  suits: WOOL,
  blazers: WOOL,
  outerwear: WOOL,
  activewear: STRETCH,
  loungewear: KNIT,
  knitwear: KNIT,
  workwear: DENIM,
};

const ATTRIBUTE_IMAGE: Record<string, string> = {
  lightweight: VOILE,
  heavyweight: DENIM,
  breathable: LINEN,
  stretch: STRETCH,
  soft: KNIT,
  durable: DENIM,
  premium: SILK,
  structured: WOOL,
  flowy: "/media/fabrics/silk-georgette-primary.webp",
  sheer: SILK,
  opaque: WOVEN,
  performance: STRETCH,
};

const CONSTRUCTION_IMAGE: Record<string, string> = {
  woven: WOVEN,
  knit: KNIT,
};

/**
 * Pick a real FabStitch photograph for a topic.
 * The alt describes that photograph, not the page keyword.
 */
export function clusterImage(cluster: string): string {
  if (cluster === "comparison")
    return "/media/fabrics/crepe-de-chine-primary.webp";
  if (cluster === "construction") return WOVEN;
  if (cluster === "use_case" || cluster === "use_attribute") return SILK;
  return LINEN;
}

export function illustrativeImage(input: {
  materialHint?: string;
  peerHint?: string;
  useId?: string;
  attributeId?: string;
  constructionId?: string;
}): { path: string; alt: string } {
  const path =
    input.materialHint ||
    input.peerHint ||
    (input.constructionId
      ? CONSTRUCTION_IMAGE[input.constructionId]
      : undefined) ||
    (input.useId ? USE_IMAGE[input.useId] : undefined) ||
    (input.attributeId ? ATTRIBUTE_IMAGE[input.attributeId] : undefined) ||
    CANVAS;
  return { path, alt: imageAlt(path) };
}
