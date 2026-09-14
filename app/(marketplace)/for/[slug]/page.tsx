import { permanentRedirect } from "next/navigation";

export default async function BuyerCategoryRedirect({
  params,
}: PageProps<"/for/[slug]">) {
  const { slug } = await params;
  permanentRedirect(`/fabrics/best-for/${encodeURIComponent(slug)}/`);
}
