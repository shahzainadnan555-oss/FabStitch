import { existsSync } from "node:fs";
import path from "node:path";
import type { SeoSitemapPage } from "@/lib/api/types";
import {
  SITEMAP_ELIGIBLE_SEO_PAGES,
  type SeoPageRecord,
  type StorefrontPageType,
  seoPage,
} from "@/domain/seo/storefront-registry";
import { absoluteAssetUrl, absoluteSitemapUrl } from "@/lib/sitemaps";
import { sanitizeSitemapUrls } from "@/lib/sitemap-sanitize";
import { getSeoSitemapIndex, getSeoSitemapPage } from "@/repositories/seo";

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
  pageType: StorefrontPageType | "unknown";
};

export type SitemapChildFile = {
  id: string;
  path: string;
  partition: SitemapPartitionId;
  urls: readonly SitemapUrlEntry[];
};

const DISCOVER_CHUNK_SIZE = 500;
const PRODUCTION_HOST = "fabstitch.net";

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

function partitionFor(
  pageType: StorefrontPageType | "unknown",
): SitemapPartitionId {
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
 * Final sitemap eligibility gate for a registry page.
 * Sitemap URL must equal the self-canonical indexable public path.
 */
export function passesSitemapEligibilityGate(page: SeoPageRecord): boolean {
  if (!page.isPublic) return false;
  if (!page.indexable) return false;
  if (!page.sitemapEligible) return false;
  if (!page.qualityGatePassed) return false;
  if (page.type === "private") return false;
  if (page.path !== page.canonicalPath) return false;
  if (page.path.includes("?")) return false;
  if (!page.title.trim() || !page.description.trim() || !page.h1.trim()) {
    return false;
  }
  if (
    page.indexable &&
    (page.wordCount ?? 0) > 0 &&
    (page.wordCount ?? 0) < 40
  ) {
    return false;
  }
  return true;
}

function imagesForPage(page: SeoPageRecord): string[] {
  if (!IMAGE_ELIGIBLE_TYPES.has(page.type)) return [];
  const image = resolveSitemapImage(page.image);
  return image ? [image] : [];
}

function entryFromPage(page: SeoPageRecord): SitemapUrlEntry | null {
  if (!passesSitemapEligibilityGate(page)) return null;
  return {
    path: page.canonicalPath,
    loc: absoluteSitemapUrl(page.canonicalPath),
    lastmod: null,
    images: imagesForPage(page),
    partition: partitionFor(page.type),
    pageType: page.type,
  };
}

function entryFromSanitizedApi(
  entry: SeoSitemapPage["urls"][number],
): SitemapUrlEntry | null {
  const pathname = entry.path || new URL(entry.loc).pathname;
  const record = seoPage(pathname);
  if (record) return entryFromPage(record);

  // Unknown paths that survived sanitize are public hubs only.
  const loc = absoluteSitemapUrl(pathname);
  try {
    const host = new URL(loc).hostname;
    if (host !== PRODUCTION_HOST) return null;
  } catch {
    return null;
  }

  return {
    path: pathname,
    loc,
    lastmod: entry.lastmod ?? null,
    images: [],
    partition: "core",
    pageType: "unknown",
  };
}

/**
 * Build the authoritative sitemap inventory from the curated registry,
 * optionally unioned with a sanitized API feed.
 */
export function buildSitemapInventory(
  apiUrls: SeoSitemapPage["urls"] = [],
): SitemapUrlEntry[] {
  const byPath = new Map<string, SitemapUrlEntry>();

  for (const page of SITEMAP_ELIGIBLE_SEO_PAGES) {
    const entry = entryFromPage(page);
    if (!entry) continue;
    byPath.set(entry.path, entry);
  }

  if (apiUrls.length > 0) {
    for (const raw of sanitizeSitemapUrls(apiUrls)) {
      const entry = entryFromSanitizedApi(raw);
      if (!entry) continue;
      const existing = byPath.get(entry.path);
      if (!existing) {
        byPath.set(entry.path, entry);
        continue;
      }
      // Prefer accurate lastmod from API when the registry has none.
      if (!existing.lastmod && entry.lastmod) {
        byPath.set(entry.path, { ...existing, lastmod: entry.lastmod });
      }
    }
  }

  return [...byPath.values()].sort((a, b) => a.path.localeCompare(b.path));
}

function chunkDiscover(
  entries: readonly SitemapUrlEntry[],
): SitemapChildFile[] {
  const files: SitemapChildFile[] = [];
  for (let offset = 0; offset < entries.length; offset += DISCOVER_CHUNK_SIZE) {
    const slice = entries.slice(offset, offset + DISCOVER_CHUNK_SIZE);
    const index = Math.floor(offset / DISCOVER_CHUNK_SIZE) + 1;
    const id = `sitemap-discover-${String(index).padStart(3, "0")}`;
    files.push({
      id,
      path: `/sitemaps/${id}/`,
      partition: "discover",
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
 * Empty partitions are omitted.
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
    const urls = grouped.get(partition) ?? [];
    if (urls.length === 0) continue;
    if (partition === "discover") {
      files.push(...chunkDiscover(urls));
      continue;
    }
    const id = `sitemap-${partition}`;
    files.push({
      id,
      path: `/sitemaps/${id}/`,
      partition,
      urls,
    });
  }
  return files;
}

export async function resolveSitemapInventory(): Promise<SitemapUrlEntry[]> {
  try {
    const index = await getSeoSitemapIndex();
    if (index.page_count > 0 && index.total_urls > 0) {
      const pages = await Promise.all(
        Array.from({ length: index.page_count }, (_, offset) =>
          getSeoSitemapPage(offset + 1),
        ),
      );
      const urls = pages
        .flatMap((page) => page.urls)
        .filter((entry) => entry.loc);
      if (urls.length > 0) {
        return buildSitemapInventory(urls);
      }
    }
  } catch {
    // Fall through to local registry only.
  }
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
