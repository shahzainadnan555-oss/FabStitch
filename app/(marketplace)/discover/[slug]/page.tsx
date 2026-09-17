import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SemanticLandingPage } from "@/components/seo/semantic-landing";
import {
  INDEXABLE_SEMANTIC_PAGES,
  getSemanticPage,
  listSemanticSlugs,
} from "@/domain/seo/semantic";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

export function generateStaticParams() {
  return listSemanticSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getSemanticPage(slug);
  if (!page || !page.qualityGatePassed) {
    return { title: "Topic not found", robots: { index: false } };
  }
  return registeredStorefrontMetadata(page.path, {
    title: page.title,
    description: page.metaDescription,
    index: page.indexable,
    image: page.material?.imageHint ?? "/media/hero-navy-jersey.jpg",
  });
}

export default async function DiscoverTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getSemanticPage(slug);
  if (!page || !page.qualityGatePassed) notFound();
  return <SemanticLandingPage page={page} />;
}

/** Optional helper export for hub page generation counts. */
export function discoverIndexableCount(): number {
  return INDEXABLE_SEMANTIC_PAGES.length;
}
