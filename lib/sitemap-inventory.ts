import { existsSync } from "node:fs";
import path from "node:path";
import {
  SEO_PAGE_REGISTRY,
  type SeoPageRecord,
  type StorefrontPageType,
} from "@/domain/seo/storefront-registry";
import { absoluteAssetUrl, absoluteSitemapUrl } from "@/lib/sitemaps";
import { isPathAllowedByRobots } from "@/lib/robots-policy";
import { storefrontRedirect } from "@/lib/storefront-redirects";

/**
 * Frontend sitemap source of truth.
 *
 * URLs come only from the storefront SEO registry (static pages, published
 * fabrics, collections, guides, and the semantic discover corpus). The backend
 * sitemap / route-classes APIs are not an authority for inclusion.
 */

/** Logical Search Console groups for the sitemap index. */
export type SitemapPartitionId =
  | "core"
  | "fabrics"
  | "collections"
  | "best-for"
  | "guides"
  | "products"
  | "discover";

export type SitemapUrlEntry = {
  path: string;
  loc: string;
  lastmod: string | null;
  images: readonly string[];
  partition: SitemapPartitionId;
  pageType: StorefrontPageType;
};

export type SitemapChildFile = {
  id: string;
  path: string;
  partition: SitemapPartitionId;
  urls: readonly SitemapUrlEntry[];
};

/** Stay under Google's 50,000 URL limit with room to spare. */
const SITEMAP_URL_LIMIT = 45_000;
const DISCOVER_CHUNK_SIZE = 500;
const PRODUCTION_ORIGIN = "https://fabstitch.net";

const PRIVATE_PREFIXES = [
  "/admin/",
  "/auth/",
  "/account/",
  "/login/",
  "/signup/",
  "/checkout/",
  "/cart/",
  "/inquiries/",
  "/buyer/",
  "/onboarding/",
  "/supplier/",
  "/rfq/",
  "/compare/",
  "/forgot-password/",
  "/reset-password/",
  "/orders/",
  "/api/",
  "/search/",
] as const;

const IMAGE_ELIGIBLE_TYPES = new Set<StorefrontPageType>([
  "home",
  "fabric",
  "collection",
  "seasonal_collection",
  "commercial_landing",
  "intent_hub",
  "semantic_landing",
  "best_for",
  "fabric_hub",
  "collection_hub",
]);

const ISO_LASTMOD =
  /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/;

function partitionFor(pageType: StorefrontPageType): SitemapPartitionId {
  switch (pageType) {
    case "fabric":
      return "products";
    case "fabric_hub":
    case "intent_hub":
      return "fabrics";
    case "collection":
    case "seasonal_collection":
    case "collection_hub":
      return "collections";
    case "best_for":
    case "best_for_hub":
      return "best-for";
    case "guide":
    case "guide_hub":
      return "guides";
    case "semantic_landing":
      return "discover";
    default:
      return "core";
  }
}

function isPrivatePath(pathname: string): boolean {
  return PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix),
  );
}

function publicImageExists(imagePath: string): boolean {
  if (!imagePath.startsWith("/media/")) return false;
  if (imagePath.includes("..")) return false;
  const absolute = path.join(process.cwd(), "public", imagePath);
  return existsSync(absolute);
}

/**
 * Resolve a registry image to a public HTTPS asset URL.
 * Returns null when the file is missing, decorative, or invalid.
 */
export function resolveSitemapImage(
  imagePath: string | undefined,
): string | null {
  if (!imagePath) return null;
  const normalized = imagePath.trim();
  if (!normalized.startsWith("/media/")) return null;
  if (
    /icon|logo|mark|sprite|placeholder|avatar/i.test(normalized) &&
    !normalized.includes("/fabrics/") &&
    !normalized.includes("hero-")
  ) {
    return null;
  }
  if (!publicImageExists(normalized)) return null;
  return absoluteAssetUrl(normalized);
}

/**
 * Trustworthy lastmod only. The registry does not currently store content
 * modification dates, so callers pass null rather than a build timestamp.
 */
export function trustworthyLastmod(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!ISO_LASTMOD.test(trimmed)) return null;
  const parsed = Date.parse(trimmed);
  if (!Number.isFinite(parsed)) return null;
  return trimmed;
}

/**
 * Final sitemap eligibility gate.
 * A URL enters the sitemap only when it is a public, self-canonical,
 * indexable registry page that robots.txt allows and that does not redirect.
 */
export function passesSitemapEligibilityGate(page: SeoPageRecord): boolean {
  if (!page.isPublic) return false;
  if (!page.indexable) return false;
  if (!page.sitemapEligible) return false;
  if (!page.qualityGatePassed) return false;
  if (page.type === "private") return false;
  if (page.path !== page.canonicalPath) return false;
  if (page.path.includes("?") || page.path.includes("#")) return false;
  if (!page.title.trim() || !page.description.trim() || !page.h1.trim()) {
    return false;
  }
  if (isPrivatePath(page.path)) return false;
  if (storefrontRedirect(page.path)) return false;
  if (!isPathAllowedByRobots(page.path)) return false;

  const loc = absoluteSitemapUrl(page.canonicalPath);
  let parsed: URL;
  try {
    parsed = new URL(loc);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:") return false;
  if (parsed.hostname !== "fabstitch.net") return false;
  if (parsed.search || parsed.hash) return false;
  if (`${PRODUCTION_ORIGIN}${page.canonicalPath}` !== loc) return false;
  return true;
}

export function eligibleSitemapPages(): SeoPageRecord[] {
  return SEO_PAGE_REGISTRY.filter(passesSitemapEligibilityGate).sort((a, b) =>
    a.canonicalPath.localeCompare(b.canonicalPath),
  );
}

function imagesForPage(page: SeoPageRecord): string[] {
  if (!IMAGE_ELIGIBLE_TYPES.has(page.type)) return [];
  const image = resolveSitemapImage(page.image);
  return image ? [image] : [];
}

function entryFromPage(page: SeoPageRecord): SitemapUrlEntry {
  return {
    path: page.canonicalPath,
    loc: absoluteSitemapUrl(page.canonicalPath),
    lastmod: trustworthyLastmod(null),
    images: imagesForPage(page),
    partition: partitionFor(page.type),
    pageType: page.type,
  };
}

/**
 * Deterministic sitemap inventory from the storefront registry.
 * Backend sitemap feeds are intentionally ignored.
 */
export function buildSitemapInventory(): SitemapUrlEntry[] {
  const byPath = new Map<string, SitemapUrlEntry>();
  for (const page of eligibleSitemapPages()) {
    const entry = entryFromPage(page);
    if (byPath.has(entry.path)) continue;
    byPath.set(entry.path, entry);
  }
  return [...byPath.values()].sort((a, b) => a.path.localeCompare(b.path));
}

function chunkEntries(
  partition: SitemapPartitionId,
  entries: readonly SitemapUrlEntry[],
  chunkSize: number,
  numbered: boolean,
): SitemapChildFile[] {
  if (entries.length === 0) return [];
  if (!numbered && entries.length <= chunkSize) {
    const id = `sitemap-${partition}`;
    return [
      {
        id,
        path: `/sitemaps/${id}/`,
        partition,
        urls: entries,
      },
    ];
  }
  const files: SitemapChildFile[] = [];
  for (let offset = 0; offset < entries.length; offset += chunkSize) {
    const slice = entries.slice(offset, offset + chunkSize);
    const index = Math.floor(offset / chunkSize) + 1;
    const id = `sitemap-${partition}-${String(index).padStart(3, "0")}`;
    files.push({
      id,
      path: `/sitemaps/${id}/`,
      partition,
      urls: slice,
    });
  }
  return files;
}

const PARTITION_ORDER: SitemapPartitionId[] = [
  "core",
  "fabrics",
  "collections",
  "best-for",
  "guides",
  "products",
  "discover",
];

/**
 * Partition inventory into named child sitemap files.
 * Empty partitions are omitted. Discover (and any oversized group) is sharded
 * in stable path order. Child files are urlsets, never nested indexes.
 */
export function partitionSitemapInventory(
  inventory: readonly SitemapUrlEntry[],
): SitemapChildFile[] {
  const grouped = new Map<SitemapPartitionId, SitemapUrlEntry[]>();
  for (const entry of inventory) {
    const list = grouped.get(entry.partition) ?? [];
    list.push(entry);
    grouped.set(entry.partition, list);
  }

  const files: SitemapChildFile[] = [];
  for (const partition of PARTITION_ORDER) {
    const urls = (grouped.get(partition) ?? [])
      .slice()
      .sort((a, b) => a.path.localeCompare(b.path));
    if (urls.length === 0) continue;
    if (partition === "discover") {
      files.push(...chunkEntries(partition, urls, DISCOVER_CHUNK_SIZE, true));
      continue;
    }
    files.push(
      ...chunkEntries(
        partition,
        urls,
        SITEMAP_URL_LIMIT,
        urls.length > SITEMAP_URL_LIMIT,
      ),
    );
  }
  return files;
}

/** Registry-only inventory. Kept async for route callers. */
export async function resolveSitemapInventory(): Promise<SitemapUrlEntry[]> {
  return buildSitemapInventory();
}

export function childSitemapById(
  files: readonly SitemapChildFile[],
  batch: string,
): SitemapChildFile | undefined {
  const normalized = batch.replace(/\.xml$/i, "").replace(/\/+$/, "");
  return files.find((file) => file.id === normalized);
}

export function sitemapInventorySummary(inventory: readonly SitemapUrlEntry[]) {
  const byPartition: Record<string, number> = {};
  let withImages = 0;
  let withLastmod = 0;
  for (const entry of inventory) {
    byPartition[entry.partition] = (byPartition[entry.partition] ?? 0) + 1;
    if (entry.images.length) withImages += 1;
    if (entry.lastmod) withLastmod += 1;
  }
  return {
    total: inventory.length,
    byPartition,
    withImages,
    withLastmod,
  };
}
