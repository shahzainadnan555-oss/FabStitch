import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { OrganizationJsonLd } from "@/components/seo/structured-data";
import { SessionProvider } from "@/features/auth/session";
import { BRAND_NAME, TITLE_TEMPLATE } from "@/lib/page-title";
import { SITE_URL } from "@/lib/seo";

/**
 * Root layout.
 *
 * Deliberately chrome-free: the three shells (marketplace, auth, workspace)
 * each own their own header and navigation, and they are chosen by route group
 * - see docs/ROUTE-MAP.md §1. Putting the site header here would force it onto
 * the sign-in page, which needs neither.
 *
 * IBM Plex - engineering-documentation heritage, and deliberately not the
 * Inter/Geist default (docs/DECISIONS.md R6). Plex Mono carries every numeric.
 */
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  // 700 is carried for the display headline only. It has to be a real cut:
  // asking for 700 without loading it makes the browser synthesise a bold by
  // smearing the 600, which at 52px is visibly furred on the stems.
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  // Every page in the app declares `alternates.canonical` as a root-relative
  // path. Without a base, Next emits them verbatim, so the whole site shipped
  // relative canonicals — valid, but they resolve against whatever host the
  // crawler used, which is the one thing a canonical exists to pin down.
  // `SITE_URL` is the origin the sitemap and `absolute()` already use, so this
  // makes the two agree rather than introducing a second source of truth.
  metadataBase: new URL(SITE_URL),
  title: {
    default: BRAND_NAME,
    template: TITLE_TEMPLATE,
  },
  description:
    "Discover FabStitch fabrics by material, construction and use. Search, filter, choose a quantity and buy from one focused storefront.",
  applicationName: BRAND_NAME,
  openGraph: {
    siteName: BRAND_NAME,
    type: "website",
    title: BRAND_NAME,
    description:
      "Discover FabStitch fabrics by material, construction and use.",
    images: [{ url: "/media/hero-navy-jersey.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_NAME,
    description:
      "Discover FabStitch fabrics by material, construction and use.",
    images: ["/media/hero-navy-jersey.jpg"],
  },
  icons: {
    icon: [
      {
        url: "/media/fabstitch-mark.png",
        type: "image/png",
        sizes: "600x600",
      },
    ],
    shortcut: "/media/fabstitch-mark.png",
    apple: [
      {
        url: "/media/fabstitch-mark.png",
        type: "image/png",
        sizes: "600x600",
      },
    ],
  },
  formatDetection: { telephone: false, address: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col">
        <OrganizationJsonLd />
        <SessionProvider>{children}</SessionProvider>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </body>
    </html>
  );
}
