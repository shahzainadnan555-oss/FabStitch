import type { Metadata } from "next";
import { CommercialIntentLanding } from "@/components/seo/commercial-intent-landing";
import { COMMERCIAL_LANDING_BY_SLUG } from "@/content/commercial-landing-pages";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

const page = COMMERCIAL_LANDING_BY_SLUG["fabric-sourcing"];

export async function generateMetadata(): Promise<Metadata> {
  return registeredStorefrontMetadata(page.path, {
    title: page.title,
    description: page.metaDescription,
    image: page.image,
    index: true,
  });
}

export default function FabricSourcingPage() {
  return <CommercialIntentLanding page={page} />;
}
