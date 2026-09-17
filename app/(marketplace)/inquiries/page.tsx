import type { Metadata } from "next";
import { Suspense } from "react";
import { FabStitchPageLoader } from "@/components/brand/fabstitch-loader";
import { InquiriesListPage } from "@/features/inquiries/inquiries-list-page";

export const metadata: Metadata = {
  title: "My Inquiries",
  robots: { index: false, follow: false },
};

export default function InquiriesPage() {
  return (
    <Suspense fallback={<FabStitchPageLoader label="Loading your inquiries" />}>
      <InquiriesListPage />
    </Suspense>
  );
}
