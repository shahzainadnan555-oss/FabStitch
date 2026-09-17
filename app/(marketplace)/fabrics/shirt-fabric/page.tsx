import type { Metadata } from "next";
import { SeoIntentLanding } from "@/components/seo/seo-intent-landing";
import { MATERIAL_LANDING_BY_SLUG } from "@/content/material-landing-pages";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

const page = MATERIAL_LANDING_BY_SLUG["shirt-fabric"];

export async function generateMetadata(): Promise<Metadata> {
  return registeredStorefrontMetadata(page.path, {
    title: page.title,
    description: page.metaDescription,
    image: page.image,
    index: true,
  });
}

export default function ShirtFabricPage() {
  return <SeoIntentLanding page={page} />;
}
