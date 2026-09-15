import type { Metadata } from "next";
import { InquiryDetailPage } from "@/features/inquiries/inquiry-detail-page";

export const metadata: Metadata = {
  title: "Inquiry",
  robots: { index: false, follow: false },
};

export default async function InquiryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InquiryDetailPage id={id} />;
}
