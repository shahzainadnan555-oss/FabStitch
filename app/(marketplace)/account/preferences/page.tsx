import type { Metadata } from "next";
import { Suspense } from "react";
import { FabStitchPageLoader } from "@/components/brand/fabstitch-loader";
import { AccountPreferencesPage } from "@/features/account/account-preferences-page";

export const metadata: Metadata = {
  title: "Fabric preferences",
  robots: { index: false, follow: false },
};

export default function PreferencesPage() {
  return (
    <Suspense
      fallback={<FabStitchPageLoader label="Preparing your preferences" />}
    >
      <AccountPreferencesPage />
    </Suspense>
  );
}
