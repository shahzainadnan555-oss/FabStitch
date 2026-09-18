import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketplaceSupportArticle } from "@/components/marketplace/marketplace-support-article";
import {
  MARKETPLACE_SUPPORT_PAGES,
  getMarketplaceSupportPage,
} from "@/domain/seo/marketplace-cluster";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return MARKETPLACE_SUPPORT_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "fabrics")
    return { title: "Not found", robots: { index: false } };
  const page = getMarketplaceSupportPage(slug);
  if (!page?.indexable) {
    return { title: "Not found", robots: { index: false } };
  }
  return registeredStorefrontMetadata(page.path, {
    title: page.title,
    description: page.description,
    index: true,
    type: "article",
    image: page.imagePath,
  });
}

export default async function MarketplaceSupportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "fabrics") notFound();
  const page = getMarketplaceSupportPage(slug);
  if (!page?.indexable) notFound();
  return <MarketplaceSupportArticle page={page} />;
}
