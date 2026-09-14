import type { Metadata } from "next";
import { PublicHeader } from "@/components/layout/public-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { NotFoundBody } from "@/components/marketplace/not-found-body";
import { MarketPreferenceProvider } from "@/features/preferences/market-preferences";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <MarketPreferenceProvider>
      <PublicHeader />
      <main id="main" className="flex-1">
        <NotFoundBody />
      </main>
      <SiteFooter />
    </MarketPreferenceProvider>
  );
}
