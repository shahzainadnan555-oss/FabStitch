import Link from "next/link";
import { PageHeader } from "@/components/marketplace/page-header";
import { Container } from "@/components/ui/layout";
import { IconArrowRight } from "@/components/ui/icon";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";
import { CollectionPageJsonLd } from "@/components/seo/structured-data";
import { SEO_USE_CASES, fabricsForUseCase } from "@/catalog";
import { pillarReading } from "@/domain/seo/visible-reading";
import { PillarReadingBlock } from "@/components/seo/visible-reading";

export async function generateMetadata() {
  return registeredStorefrontMetadata("/fabrics/best-for/", {
    title: "Fabrics by Use",
  });
}

/**
 * Best For hub lists SEO use-case URLs only.
 * Application aliases (shirting, swimwear, curtains, …) redirect to these hubs
 * and must not appear as competing indexable cards.
 */
export default function BestForHubPage() {
  const useCases = SEO_USE_CASES.map((useCase) => ({
    slug: useCase.slug,
    name: useCase.label,
    description: useCase.description,
    fabricCount: fabricsForUseCase(useCase).length,
  }));

  return (
    <>
      <CollectionPageJsonLd
        name="Fabrics by Use | FabStitch"
        description="Choose FabStitch fabrics by end use — shirts, dresses, activewear, outerwear, bedding, and more."
        path="/fabrics/best-for/"
        items={useCases.map((useCase) => ({
          name: useCase.name,
          path: `/fabrics/best-for/${useCase.slug}/`,
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

      <Container className="border-b border-rule py-10">
        <PillarReadingBlock
          reading={pillarReading("/fabrics/best-for/")!}
          id="best-for-reading"
        />
      </Container>

      <Container className="py-10 sm:py-14">
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
        <nav aria-label="Best For index" className="mt-10">
          <h2 className="text-sm font-semibold text-ink">All use edits</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {useCases.map((useCase) => (
              <li key={useCase.slug}>
                <Link
                  href={`/fabrics/best-for/${useCase.slug}/`}
                  prefetch={false}
                  className="inline-flex rounded-sm border border-rule-2 bg-paper-raised px-3 py-1.5 text-sm text-ink hover:border-indigo hover:text-indigo"
                >
                  {useCase.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </>
  );
}
