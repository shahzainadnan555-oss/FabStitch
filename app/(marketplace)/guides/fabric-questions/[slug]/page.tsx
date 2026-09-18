import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FabricQuestionArticle } from "@/components/guides/fabric-question-article";
import {
  FABRIC_QUESTION_PAGES,
  getFabricQuestion,
} from "@/domain/seo/fabric-questions";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return FABRIC_QUESTION_PAGES.filter((page) => page.kind !== "index").map(
    (page) => ({ slug: page.slug }),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getFabricQuestion(slug);
  if (!page) return { title: "Not found", robots: { index: false } };
  return registeredStorefrontMetadata(page.path, {
    title: page.title,
    description: page.description,
    index: true,
    type: page.kind === "question" ? "article" : "website",
    image: page.imagePath,
  });
}

export default async function FabricQuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getFabricQuestion(slug);
  if (!page) notFound();
  return <FabricQuestionArticle page={page} />;
}
