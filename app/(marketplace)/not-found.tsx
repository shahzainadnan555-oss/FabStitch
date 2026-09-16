import type { Metadata } from "next";
import { NotFoundBody } from "@/components/marketplace/not-found-body";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "This FabStitch page could not be found. Continue to the marketplace, collections, or fabric guides.",
  robots: { index: false, follow: true },
};

export default function MarketplaceNotFound() {
  return <NotFoundBody />;
}
