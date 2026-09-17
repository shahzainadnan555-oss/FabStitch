import type { Metadata } from "next";
import { Suspense } from "react";
import { FabStitchLoader } from "@/components/brand/fabstitch-loader";
import { AccountPreferencesPage } from "@/features/account/account-preferences-page";

export const metadata: Metadata = {
  title: "Fabric preferences",
  robots: { index: false, follow: false },
};

export default function PreferencesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[12rem] items-center justify-center py-16">
          <FabStitchLoader
            variant="content"
            label="Preparing your preferences"
          />
        </div>
      }
    >
      <AccountPreferencesPage />
    </Suspense>
  );
}
