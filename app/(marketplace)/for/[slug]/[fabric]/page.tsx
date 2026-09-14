import { permanentRedirect } from "next/navigation";

export default async function BuyerFabricRedirect({
  params,
}: PageProps<"/for/[slug]/[fabric]">) {
  const { fabric } = await params;
  permanentRedirect(`/fabrics/${encodeURIComponent(fabric)}/`);
}
