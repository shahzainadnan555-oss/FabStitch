import { permanentRedirect } from "next/navigation";

export default async function LegacyMarketplaceFabricPage({
  params,
}: PageProps<"/marketplace/fabrics/[slug]">) {
  const { slug } = await params;
  permanentRedirect(`/fabrics/${slug}/`);
}
