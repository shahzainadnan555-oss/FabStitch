import { permanentRedirect } from "next/navigation";

export default async function LegacyBuyerInquiryRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  permanentRedirect(`/inquiries/${encodeURIComponent(id)}/`);
}
