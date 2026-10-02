import { permanentRedirect } from "next/navigation";
import { bestForPathForApplication } from "@/lib/storefront-redirects";

export default async function BuyerCategoryRedirect({
  params,
}: PageProps<"/for/[slug]">) {
  const { slug } = await params;
  permanentRedirect(bestForPathForApplication(slug));
}
