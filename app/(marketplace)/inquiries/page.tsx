import type { Metadata } from "next";
import { Suspense } from "react";
import { FabStitchLoader } from "@/components/brand/fabstitch-loader";
import { InquiriesListPage } from "@/features/inquiries/inquiries-list-page";

export const metadata: Metadata = {
  title: "My Inquiries",
  robots: { index: false, follow: false },
};

export default function InquiriesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[12rem] items-center justify-center py-16">
          <FabStitchLoader variant="content" label="Loading your inquiries" />
        </div>
      }
    >
      <InquiriesListPage />
    </Suspense>
  );
}
