import type { Metadata } from "next";
import { FabricQuestionArticle } from "@/components/guides/fabric-question-article";
import { FABRIC_QUESTION_PAGES } from "@/domain/seo/fabric-questions";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

const page = FABRIC_QUESTION_PAGES.find((item) => item.kind === "index")!;

export async function generateMetadata(): Promise<Metadata> {
  return registeredStorefrontMetadata(page.path, {
    title: page.title,
    description: page.description,
    index: true,
    type: "website",
    image: page.imagePath,
  });
}

export default function FabricQuestionsIndexPage() {
  return <FabricQuestionArticle page={page} />;
}
