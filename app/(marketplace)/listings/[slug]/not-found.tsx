import type { Metadata } from "next";
import { NotFoundBody } from "@/components/marketplace/not-found-body";

export const metadata: Metadata = {
  title: "Listing not found",
  robots: { index: false, follow: true },
};

export default function ListingNotFound() {
  return (
    <NotFoundBody
      title="This listing is no longer available"
      body="Availability changes as production runs move. The fabric itself may still be available elsewhere in the FabStitch catalogue."
      suggestions={[
        {
          label: "Browse every fabric family",
          href: "/fabrics/",
          hint: "Find the same construction in the catalogue",
        },
        {
          label: "Search by specification",
          href: "/search/",
          hint: "Weight, width, composition and MOQ",
        },
        { label: "Open marketplace", href: "/marketplace/" },
      ]}
    />
  );
}
