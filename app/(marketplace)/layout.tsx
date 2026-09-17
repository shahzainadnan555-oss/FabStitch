import { PublicHeader } from "@/components/layout/public-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CatalogNavigationProvider } from "@/components/marketplace/catalog-navigation";
import { CompareProvider } from "@/components/marketplace/compare";
import { MarketPreferenceProvider } from "@/features/preferences/market-preferences";

/**
 * Static public shell.
 *
 * Public SEO routes must not call session or OAuth endpoints before rendering.
 * Account links lead to the dedicated auth flow; product and editorial content
 * stays server-renderable without per-request customer data.
 */
export default function MarketplaceLayout({ children }: LayoutProps<"/">) {
  return (
    <MarketPreferenceProvider>
      <CatalogNavigationProvider>
        <CompareProvider>
          <PublicHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </CompareProvider>
      </CatalogNavigationProvider>
    </MarketPreferenceProvider>
  );
}
