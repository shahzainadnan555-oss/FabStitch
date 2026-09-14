import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

/**
 * Compatibility route for shared and bookmarked search URLs.
 *
 * Search now belongs to the paginated fabric catalogue. Keeping this redirect
 * preserves every supported query parameter without retaining the former
 * cross-entity supplier search and full-catalogue zero-result fallback.
 */
export default async function SearchPage({
  searchParams,
}: PageProps<"/search">) {
  const query = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item !== undefined) params.append(key, item);
    }
  }
  redirect(`/marketplace/${params.size ? `?${params}` : ""}`);
}
