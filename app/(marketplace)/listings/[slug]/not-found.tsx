import type { Metadata } from "next";
import { NotFoundBody } from "@/components/marketplace/not-found-body";

export const metadata: Metadata = {
  title: "Listing not found",
  description:
    "This fabric listing is no longer available. Browse the FabStitch marketplace or fabric collections instead.",
  robots: { index: false, follow: true },
};

export default function ListingNotFound() {
  return (
    <NotFoundBody
      title="This listing is no longer available"
      body="Availability changes as production runs move. The fabric itself may still be available in the FabStitch catalogue."
      suggestions={[
        {
          label: "Browse every fabric family",
          href: "/fabrics/",
          hint: "Find the same construction in the catalogue",
        },
        {
          label: "Search the marketplace",
          href: "/marketplace/",
          hint: "Filter by material, construction, and use",
        },
        {
          label: "Browse collections",
          href: "/collections/",
          hint: "Linen, cotton, silk, denim, and more",
        },
      ]}
    />
  );
}
