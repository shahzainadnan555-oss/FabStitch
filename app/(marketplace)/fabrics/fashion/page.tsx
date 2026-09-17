import type { Metadata } from "next";
import { SeoIntentLanding } from "@/components/seo/seo-intent-landing";
import { SEO_LANDING_BY_SLUG } from "@/content/seo-landing-pages";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

const page = SEO_LANDING_BY_SLUG.fashion;

export async function generateMetadata(): Promise<Metadata> {
  return registeredStorefrontMetadata(page.path, {
    title: page.title,
    description: page.metaDescription,
    image: page.image,
    index: true,
  });
}

export default function FashionFabricLandingPage() {
  return <SeoIntentLanding page={page} />;
}
