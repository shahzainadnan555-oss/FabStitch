import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiscoverDirectoryView } from "@/components/seo/discover-directory-view";
import {
  DISCOVER_CLUSTER_META,
  discoverClusterMeta,
  discoverClusterPageCount,
  discoverClusterPath,
  paginateDiscoverCluster,
} from "@/lib/discover-directory";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

export function generateStaticParams() {
  const params: { cluster: string; page: string }[] = [];
  for (const meta of DISCOVER_CLUSTER_META) {
    const totalPages = discoverClusterPageCount(meta.cluster);
    for (let page = 2; page <= totalPages; page += 1) {
      params.push({ cluster: meta.slug, page: String(page) });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cluster: string; page: string }>;
}): Promise<Metadata> {
  const { cluster: slug, page: pageRaw } = await params;
  const meta = discoverClusterMeta(slug);
  const pageNum = Number(pageRaw);
  if (!meta || !Number.isInteger(pageNum) || pageNum < 2) {
    return { title: "Topics not found", robots: { index: false } };
  }
  const path = discoverClusterPath(meta.cluster, pageNum);
  return registeredStorefrontMetadata(path, {
    title: `${meta.label} | Fabric Discovery (page ${pageNum})`,
    description: `Continued ${meta.label.toLowerCase()} fabric discovery topics on FabStitch.`,
    index: true,
  });
}

export default async function DiscoverClusterPaginatedPage({
  params,
}: {
  params: Promise<{ cluster: string; page: string }>;
}) {
  const { cluster: slug, page: pageRaw } = await params;
  const meta = discoverClusterMeta(slug);
  const pageNum = Number(pageRaw);
  if (!meta || !Number.isInteger(pageNum) || pageNum < 2) notFound();

  const totalPages = discoverClusterPageCount(meta.cluster);
  if (pageNum > totalPages) notFound();

  const page = paginateDiscoverCluster(meta.cluster, pageNum);
  if (!page) notFound();

  return (
    <DiscoverDirectoryView
      cluster={meta.cluster}
      page={page.page}
      totalPages={page.totalPages}
      totalItems={page.totalItems}
      items={page.items}
      label={meta.label}
      hubTitle={meta.hubTitle}
      description={meta.description}
    />
  );
}
