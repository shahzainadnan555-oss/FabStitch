import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiscoverDirectoryView } from "@/components/seo/discover-directory-view";
import {
  DISCOVER_CLUSTER_META,
  discoverClusterMeta,
  discoverClusterPath,
  paginateDiscoverCluster,
} from "@/lib/discover-directory";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

export function generateStaticParams() {
  return DISCOVER_CLUSTER_META.map((meta) => ({ cluster: meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cluster: string }>;
}): Promise<Metadata> {
  const { cluster: slug } = await params;
  const meta = discoverClusterMeta(slug);
  if (!meta) return { title: "Topics not found", robots: { index: false } };
  const path = discoverClusterPath(meta.cluster, 1);
  return registeredStorefrontMetadata(path, {
    title: `${meta.label} | Fabric Discovery`,
    description: meta.description,
    index: true,
  });
}

export default async function DiscoverClusterPage({
  params,
}: {
  params: Promise<{ cluster: string }>;
}) {
  const { cluster: slug } = await params;
  const meta = discoverClusterMeta(slug);
  if (!meta) notFound();

  const page = paginateDiscoverCluster(meta.cluster, 1);
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
