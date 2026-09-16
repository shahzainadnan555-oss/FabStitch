import Link from "next/link";
import { PageHeader } from "@/components/marketplace/page-header";
import { Container } from "@/components/ui/layout";
import { IconArrowRight } from "@/components/ui/icon";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";
import { CollectionPageJsonLd } from "@/components/seo/structured-data";
import { getCustomerBestFor } from "@/repositories/customer-catalog";

export async function generateMetadata() {
  return registeredStorefrontMetadata("/fabrics/best-for/", {
    title: "Fabrics by Use",
  });
}

export default async function BestForHubPage() {
  const useCases = await getCustomerBestFor();

  return (
    <>
      <CollectionPageJsonLd
        name="Fabrics by Use | FabStitch"
        description="Choose FabStitch fabrics by end use — shirts, dresses, activewear, outerwear, bedding, and more."
        path="/fabrics/best-for/"
        items={useCases.map((useCase) => ({
          name: useCase.name,
          path: `/fabrics/best-for/${useCase.slug}/`,
          image: useCase.imageUrl,
        }))}
      />
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Fabrics", href: "/fabrics/" },
          { label: "Best For" },
        ]}
        eyebrow="Start with the product"
        title="Find fabric for what you are making."
        intro="Best For edits group fabrics by a documented end use. Pick the product you are building — a shirt, dress, knit, outer layer, or home textile — then compare the fabrics FabStitch has already mapped to that use."
        meta={[{ label: "Published edits", value: useCases.length }]}
      />

      <Container className="py-10 sm:py-14">
        {useCases.length ? (
          <ul className="grid gap-px border border-rule-2 bg-rule-2 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <li key={useCase.slug}>
                <Link
                  href={`/fabrics/best-for/${useCase.slug}/`}
                  prefetch={false}
                  className="group flex h-full min-h-52 flex-col justify-between bg-paper-raised p-5 transition-colors hover:bg-indigo-wash"
                >
                  <span>
                    <span className="font-mono text-label text-gold-ink uppercase">
                      {useCase.fabricCount} documented{" "}
                      {useCase.fabricCount === 1 ? "fabric" : "fabrics"}
                    </span>
                    <span className="mt-4 block text-h3 font-semibold text-ink group-hover:text-indigo">
                      {useCase.name}
                    </span>
                    {useCase.description ? (
                      <span className="mt-2 block text-sm leading-relaxed text-ink-3">
                        {useCase.description}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo">
                    Explore {useCase.name.toLowerCase()}
                    <IconArrowRight width={14} height={14} aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-sm border border-rule-2 bg-paper-raised p-5 text-sm text-ink-3">
            No Best For edits are published yet.
          </p>
        )}
      </Container>
    </>
  );
}
