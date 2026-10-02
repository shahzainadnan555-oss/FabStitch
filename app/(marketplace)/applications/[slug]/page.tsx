import { permanentRedirect } from "next/navigation";
import { bestForPathForApplication } from "@/lib/storefront-redirects";

export default async function ApplicationRedirect({
  params,
}: PageProps<"/applications/[slug]">) {
  const { slug } = await params;
  permanentRedirect(bestForPathForApplication(slug));
}
