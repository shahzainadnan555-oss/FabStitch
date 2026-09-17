import Link from "next/link";
import {
  CollectionPageJsonLd,
  FaqJsonLd,
} from "@/components/seo/structured-data";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icon";
import { Container } from "@/components/ui/layout";
import { Heading, Label, Prose } from "@/components/ui/typography";
import { COLLECTION_BY_SLUG, SEO_USE_CASE_BY_SLUG } from "@/catalog";
import {
  INDEXABLE_SEMANTIC_PAGES,
  type SemanticPage,
} from "@/domain/seo/semantic";
import {
  discoverClusterMeta,
  discoverClusterPath,
} from "@/lib/discover-directory";

function relatedLabel(path: string): string {
  if (path === "/marketplace/") return "Fabric marketplace";
  if (path === "/fabrics/") return "Explore fabrics";
  if (path === "/collections/") return "Collections";
  if (path === "/fabric-sourcing/") return "Fabric sourcing";
  if (path === "/wholesale-fabric/") return "Wholesale fabric";
  if (path === "/guides/") return "Fabric guides";
  if (path === "/discover/") return "All discovery topics";
  if (path.startsWith("/discover/topics/")) {
    const slug = path.split("/").filter(Boolean)[2] ?? "";
    return discoverClusterMeta(slug)?.label ?? "Discovery topics";
  }
  if (path.startsWith("/collections/")) {
    const slug = path.split("/").filter(Boolean).pop() ?? "";
    return COLLECTION_BY_SLUG[slug as keyof typeof COLLECTION_BY_SLUG]?.label
      ? `${COLLECTION_BY_SLUG[slug as keyof typeof COLLECTION_BY_SLUG]!.label} collection`
      : "Collection";
  }
  if (path.includes("/best-for/")) {
    const slug = path.split("/").filter(Boolean).pop() ?? "";
    return (
      SEO_USE_CASE_BY_SLUG[slug as keyof typeof SEO_USE_CASE_BY_SLUG]?.title ??
      "Best For"
    );
  }
  return path.replace(/^\/|\/$/g, "").replace(/-/g, " ");
}

export function SemanticLandingPage({ page }: { page: SemanticPage }) {
  const collections = page.collectionSlugs
    .map((slug) => COLLECTION_BY_SLUG[slug as keyof typeof COLLECTION_BY_SLUG])
    .filter(Boolean);
  const bestFor = page.bestForSlugs
    .map(
      (slug) => SEO_USE_CASE_BY_SLUG[slug as keyof typeof SEO_USE_CASE_BY_SLUG],
    )
    .filter(Boolean);

  const clusterMeta = discoverClusterMeta(page.cluster);
  const clusterPath = clusterMeta
    ? discoverClusterPath(clusterMeta.cluster)
    : "/discover/";

  const relatedDiscover = INDEXABLE_SEMANTIC_PAGES.filter(
    (candidate) =>
      candidate.cluster === page.cluster && candidate.slug !== page.slug,
  ).slice(0, 6);

  const schemaItems = [
    ...collections.map((collection) => ({
      name: `${collection!.label} fabrics`,
      path: `/collections/${collection!.slug}/`,
    })),
    ...bestFor.map((useCase) => ({
      name: useCase!.title,
      path: `/fabrics/best-for/${useCase!.slug}/`,
    })),
  ];

  const relatedPaths = [...page.relatedPaths, clusterPath, "/discover/"].filter(
    (path, index, all) => all.indexOf(path) === index,
  );

  return (
    <>
      <CollectionPageJsonLd
        name={page.h1}
        description={page.metaDescription}
        path={page.path}
        items={schemaItems}
      />
      <FaqJsonLd faqs={[...page.faqs]} />

      <Container className="pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Discover", href: "/discover/" },
            ...(clusterMeta
              ? [{ label: clusterMeta.label, href: clusterPath }]
              : []),
            { label: page.h1 },
          ]}
        />
      </Container>

      <Container className="py-8 sm:py-12">
        <div className="mx-auto max-w-[52rem]">
          <Label>{page.eyebrow}</Label>
          <Heading level={1} className="mt-3 text-balance">
            {page.h1}
          </Heading>
          <Prose className="mt-5 text-ink-2">{page.intro}</Prose>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink
              href="/marketplace/"
              variant="primary"
              trailing={<IconArrowRight width={14} height={14} />}
            >
              Browse marketplace
            </ButtonLink>
            {collections[0] ? (
              <ButtonLink
                href={`/collections/${collections[0].slug}/`}
                variant="secondary"
              >
                Open {collections[0].label} collection
              </ButtonLink>
            ) : null}
            {bestFor[0] ? (
              <ButtonLink
                href={`/fabrics/best-for/${bestFor[0].slug}/`}
                variant="secondary"
              >
                {bestFor[0].title}
              </ButtonLink>
            ) : null}
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-[52rem] space-y-10">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <Heading level={2} className="text-balance">
                {section.heading}
              </Heading>
              <div className="mt-4 space-y-3">
                {section.body.map((paragraph) => (
                  <Prose key={paragraph.slice(0, 48)} className="text-ink-2">
                    {paragraph}
                  </Prose>
                ))}
              </div>
              {section.keyPoints?.length ? (
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-ink-2">
                  {section.keyPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          {page.faqs.length ? (
            <section>
              <Heading level={2}>Frequently asked questions</Heading>
              <div className="mt-5 space-y-4">
                {page.faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-md border border-rule-2 bg-paper-raised px-4 py-3"
                  >
                    <p className="font-semibold text-ink">{faq.question}</p>
                    <p className="mt-2 text-sm text-ink-2 text-pretty">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-md border border-rule-2 bg-chrome px-5 py-6">
            <Heading level={2}>{page.ctaHeading}</Heading>
            <Prose className="mt-3 text-ink-2">{page.ctaBody}</Prose>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href="/marketplace/" variant="primary">
                Open marketplace
              </ButtonLink>
              <ButtonLink href="/fabric-sourcing/" variant="secondary">
                Fabric sourcing
              </ButtonLink>
            </div>
          </section>

          <section>
            <Heading level={2}>Related pages</Heading>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {relatedPaths.map((path) => (
                <li key={path}>
                  <Link
                    href={path}
                    className="text-sm font-medium text-indigo underline-offset-2 hover:underline"
                  >
                    {relatedLabel(path)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {relatedDiscover.length ? (
            <section>
              <Heading level={2}>
                More {clusterMeta?.label.toLowerCase() ?? "related"} topics
              </Heading>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {relatedDiscover.map((related) => (
                  <li key={related.slug}>
                    <Link
                      href={related.path}
                      className="text-sm font-medium text-indigo underline-offset-2 hover:underline"
                    >
                      {related.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </Container>
    </>
  );
}
