import { CATALOG_GUIDES } from "@/content/guides";
import { HELP_ARTICLES } from "@/features/help/content";
import { canonicalSeoPath } from "@/domain/seo/publication";

/**
 * Paths that already own commercial or educational intent.
 * Semantic generation must not recreate these as doorway duplicates.
 */
const STATIC_RESERVED = [
  "/",
  "/marketplace/",
  "/fabrics/",
  "/collections/",
  "/fabrics/best-for/",
  "/guides/",
  "/fabric-sourcing/",
  "/wholesale-fabric/",
  "/fabrics/clothing/",
  "/fabrics/apparel/",
  "/fabrics/fashion/",
  "/fabrics/shirt-fabric/",
  "/fabrics/dress-fabric/",
  "/fabrics/wool-fabric/",
  "/collections/cotton/",
  "/collections/linen-lightweight/",
  "/collections/silk-sheer/",
  "/collections/denim/",
  "/collections/tailoring/",
  "/collections/knitwear/",
  "/collections/performance/",
  "/collections/aw-textures/",
  "/collections/velvet-pile/",
  "/collections/structured-classics/",
  "/collections/technical-outerwear/",
  "/collections/home-contract/",
  "/about/",
  "/contact/",
  "/how-it-works/",
  "/support/",
  "/help/",
] as const;

/** Material hubs that already canonicalize to collections. */
const MATERIAL_CANONICAL_ALIASES = new Set([
  "cotton-fabric",
  "linen-fabric",
  "silk-fabric",
  "denim-fabric",
  "cotton",
  "linen",
  "silk",
  "denim",
]);

const GUIDE_SLUGS = new Set(CATALOG_GUIDES.map((guide) => guide.slug));
const HELP_SLUGS = new Set(HELP_ARTICLES.map((article) => article.slug));

export function reservedPathSet(): Set<string> {
  const paths = new Set<string>(STATIC_RESERVED.map(canonicalSeoPath));
  for (const guide of CATALOG_GUIDES) {
    paths.add(canonicalSeoPath(guide.path));
  }
  for (const article of HELP_ARTICLES) {
    paths.add(canonicalSeoPath(`/help/${article.slug}/`));
  }
  return paths;
}

export function isReservedSemanticSlug(slug: string): boolean {
  const normalized = slug.toLowerCase().replace(/\/+/g, "");
  if (MATERIAL_CANONICAL_ALIASES.has(normalized)) return true;
  if (GUIDE_SLUGS.has(normalized)) return true;
  if (HELP_SLUGS.has(normalized)) return true;
  if (
    [
      "clothing",
      "apparel",
      "fashion",
      "shirt-fabric",
      "dress-fabric",
      "wool-fabric",
      "fabric-sourcing",
      "wholesale-fabric",
      "marketplace",
      "fabrics",
      "collections",
      "best-for",
      "topics",
      "discover",
      // Consolidated onto understanding-* education URLs (Ryze ranking pages).
      "opaque-fabric",
      "flowy-fabric",
    ].includes(normalized)
  ) {
    return true;
  }
  return false;
}

export function isDoorwayKeyword(keyword: string): boolean {
  const value = keyword.toLowerCase();
  return (
    /\bnear me\b/.test(value) ||
    /\b(in|for) (usa|uk|india|pakistan|china|dubai)\b/.test(value) ||
    /\bbest\b.*\bbest\b/.test(value) ||
    /\b(job|salary|course|degree)\b/.test(value) ||
    /\b(free download|pdf)\b/.test(value)
  );
}
