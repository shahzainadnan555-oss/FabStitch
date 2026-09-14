import { permanentRedirect } from "next/navigation";

export default async function LegacyBuyerOrderRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  permanentRedirect(`/account/orders/${encodeURIComponent(id)}/`);
}
