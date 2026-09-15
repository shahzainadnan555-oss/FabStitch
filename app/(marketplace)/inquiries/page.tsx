import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiriesListPage } from "@/features/inquiries/inquiries-list-page";

export const metadata: Metadata = {
  title: "My Inquiries",
  robots: { index: false, follow: false },
};

export default function InquiriesPage() {
  return (
    <Suspense
      fallback={
        <p aria-busy="true" aria-live="polite" className="text-body text-ink-2">
          Loading your inquiries…
        </p>
      }
    >
      <InquiriesListPage />
    </Suspense>
  );
}
