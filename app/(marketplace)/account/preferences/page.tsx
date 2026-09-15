import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountPreferencesPage } from "@/features/account/account-preferences-page";

export const metadata: Metadata = {
  title: "Fabric preferences",
  robots: { index: false, follow: false },
};

export default function PreferencesPage() {
  return (
    <Suspense
      fallback={
        <p aria-busy="true" aria-live="polite" className="text-body text-ink-2">
          Preparing your preferences…
        </p>
      }
    >
      <AccountPreferencesPage />
    </Suspense>
  );
}
