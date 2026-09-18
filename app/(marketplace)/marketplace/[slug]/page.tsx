import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketplaceSupportArticle } from "@/components/marketplace/marketplace-support-article";
import { MarketplaceTopicArticle } from "@/components/marketplace/marketplace-topic-article";
import {
  MARKETPLACE_SUPPORT_PAGES,
  getMarketplaceSupportPage,
} from "@/domain/seo/marketplace-cluster";
import {
  MARKETPLACE_TOPIC_PAGES,
  getMarketplaceTopic,
} from "@/domain/seo/marketplace-thousand";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...MARKETPLACE_SUPPORT_PAGES.map((page) => ({ slug: page.slug })),
    ...MARKETPLACE_TOPIC_PAGES.map((page) => ({ slug: page.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "fabrics")
    return { title: "Not found", robots: { index: false } };
  const support = getMarketplaceSupportPage(slug);
  if (support?.indexable) {
    return registeredStorefrontMetadata(support.path, {
      title: support.title,
      description: support.description,
      index: true,
      type: "article",
      image: support.imagePath,
    });
  }
  const topic = getMarketplaceTopic(slug);
  if (!topic) return { title: "Not found", robots: { index: false } };
  return registeredStorefrontMetadata(topic.path, {
    title: topic.title,
    description: topic.description,
    index: true,
    type: "article",
    image: topic.imagePath,
  });
}

export default async function MarketplaceSupportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "fabrics") notFound();
  const support = getMarketplaceSupportPage(slug);
  if (support?.indexable) return <MarketplaceSupportArticle page={support} />;
  const topic = getMarketplaceTopic(slug);
  if (!topic) notFound();
  return <MarketplaceTopicArticle page={topic} />;
}
