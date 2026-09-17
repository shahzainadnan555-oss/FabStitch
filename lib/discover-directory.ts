import {
  INDEXABLE_SEMANTIC_PAGES,
  type SemanticPage,
} from "@/domain/seo/semantic";
import type { SemanticCluster } from "@/domain/seo/semantic/ontology";

export const DISCOVER_DIRECTORY_PAGE_SIZE = 100;

export type DiscoverClusterMeta = {
  cluster: SemanticCluster;
  slug: string;
  label: string;
  description: string;
  hubTitle: string;
};

export const DISCOVER_CLUSTER_META: readonly DiscoverClusterMeta[] = [
  {
    cluster: "material",
    slug: "material",
    label: "Materials",
    description:
      "Fibre and fabric material topics spanning cotton, linen, silk, wool, denim and technical cloth.",
    hubTitle: "Material fabric topics",
  },
  {
    cluster: "use_case",
    slug: "use-case",
    label: "Clothing & use cases",
    description:
      "Garment and product use topics for shirts, dresses, trousers, knitwear, home and performance.",
    hubTitle: "Clothing and use-case fabric topics",
  },
  {
    cluster: "attribute",
    slug: "attribute",
    label: "Fabric characteristics",
    description:
      "Hand-feel, drape, opacity, stretch and other fabric characteristic topics buyers search for.",
    hubTitle: "Fabric characteristic topics",
  },
  {
    cluster: "material_use",
    slug: "material-use",
    label: "Shirt, dress & garment fabrics",
    description:
      "Material-and-use pairings such as cotton for shirts or linen for dresses.",
    hubTitle: "Material and garment fabric topics",
  },
  {
    cluster: "material_attribute",
    slug: "material-attribute",
    label: "Material characteristics",
    description:
      "Material paired with weight, sheerness, stretch and related attributes.",
    hubTitle: "Material characteristic topics",
  },
  {
    cluster: "use_attribute",
    slug: "use-attribute",
    label: "Use-case characteristics",
    description:
      "Use-case topics refined by drape, weight, stretch and related buying attributes.",
    hubTitle: "Use-case characteristic topics",
  },
  {
    cluster: "construction",
    slug: "construction",
    label: "Weave & construction",
    description:
      "Weave, knit and construction topics that explain how cloth is built.",
    hubTitle: "Weave and construction topics",
  },
  {
    cluster: "education",
    slug: "education",
    label: "Fabric weight & education",
    description:
      "Educational fabric topics covering GSM, care, selection and textile fundamentals.",
    hubTitle: "Fabric education topics",
  },
  {
    cluster: "comparison",
    slug: "comparison",
    label: "Comparisons",
    description:
      "Side-by-side fabric comparisons that help buyers choose between materials.",
    hubTitle: "Fabric comparison topics",
  },
  {
    cluster: "commercial",
    slug: "commercial",
    label: "Buying, sourcing & wholesale",
    description:
      "Commercial discovery pathways into fabric sourcing, wholesale and marketplace buying.",
    hubTitle: "Buying and sourcing fabric topics",
  },
] as const;

const META_BY_CLUSTER = Object.fromEntries(
  DISCOVER_CLUSTER_META.map((meta) => [meta.cluster, meta]),
) as Record<SemanticCluster, DiscoverClusterMeta>;

const META_BY_SLUG = Object.fromEntries(
  DISCOVER_CLUSTER_META.map((meta) => [meta.slug, meta]),
) as Record<string, DiscoverClusterMeta>;

export function discoverClusterMeta(
  clusterOrSlug: string,
): DiscoverClusterMeta | undefined {
  return (
    META_BY_CLUSTER[clusterOrSlug as SemanticCluster] ??
    META_BY_SLUG[clusterOrSlug]
  );
}

export function pagesForDiscoverCluster(
  cluster: SemanticCluster,
): SemanticPage[] {
  return INDEXABLE_SEMANTIC_PAGES.filter(
    (page) => page.cluster === cluster,
  ).sort((a, b) => a.h1.localeCompare(b.h1));
}

export function discoverClusterPageCount(cluster: SemanticCluster): number {
  const total = pagesForDiscoverCluster(cluster).length;
  return Math.max(1, Math.ceil(total / DISCOVER_DIRECTORY_PAGE_SIZE));
}

export function discoverClusterPath(
  cluster: SemanticCluster,
  page = 1,
): string {
  const meta = META_BY_CLUSTER[cluster];
  if (!meta) return "/discover/";
  if (page <= 1) return `/discover/topics/${meta.slug}/`;
  return `/discover/topics/${meta.slug}/page/${page}/`;
}

export function paginateDiscoverCluster(
  cluster: SemanticCluster,
  page: number,
): {
  meta: DiscoverClusterMeta;
  page: number;
  totalPages: number;
  totalItems: number;
  items: SemanticPage[];
  path: string;
} | null {
  const meta = META_BY_CLUSTER[cluster];
  if (!meta) return null;
  const all = pagesForDiscoverCluster(cluster);
  const totalPages = Math.max(
    1,
    Math.ceil(all.length / DISCOVER_DIRECTORY_PAGE_SIZE),
  );
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * DISCOVER_DIRECTORY_PAGE_SIZE;
  return {
    meta,
    page: safePage,
    totalPages,
    totalItems: all.length,
    items: all.slice(start, start + DISCOVER_DIRECTORY_PAGE_SIZE),
    path: discoverClusterPath(cluster, safePage),
  };
}

export function listDiscoverDirectoryPaths(): string[] {
  const paths: string[] = [];
  for (const meta of DISCOVER_CLUSTER_META) {
    const totalPages = discoverClusterPageCount(meta.cluster);
    for (let page = 1; page <= totalPages; page += 1) {
      paths.push(discoverClusterPath(meta.cluster, page));
    }
  }
  return paths;
}
