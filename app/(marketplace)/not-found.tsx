import type { Metadata } from "next";
import { NotFoundBody } from "@/components/marketplace/not-found-body";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function MarketplaceNotFound() {
  return <NotFoundBody />;
}
