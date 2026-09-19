import Link from "next/link";
import { SeoImage } from "@/components/seo/seo-image";
import { ArticleJsonLd, FaqJsonLd } from "@/components/seo/structured-data";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icon";
import { Container } from "@/components/ui/layout";
import { Heading, Label, Prose } from "@/components/ui/typography";
import {
  MARKETPLACE_SUPPORT_PAGES,
  type MarketplaceFamily,
  type MarketplaceSupportPage,
} from "@/domain/seo/marketplace-cluster";

const FAMILY_LABEL: Record<MarketplaceFamily, string> = {
  education: "Marketplace education",
  b2b: "B2B sourcing",
  buying: "Buying guides",
  sourcing: "Sourcing guides",
  journey: "Using the marketplace",
  brand: "Why FabStitch",
};

function linkLabel(path: string): string {
  if (path === "/") return "FabStitch home";
  if (path === "/marketplace/") return "Browse the fabric marketplace";
  if (path === "/fabrics/") return "Explore fabrics";
  if (path === "/collections/") return "Fabric collections";
  if (path === "/guides/") return "Fabric guides";
  if (path === "/fabric-sourcing/") return "Fabric sourcing";
  if (path === "/wholesale-fabric/") return "Wholesale fabric";
  if (path === "/how-it-works/") return "How FabStitch works";
  if (path === "/fabrics/best-for/") return "Best For fabrics";
  if (path === "/discover/") return "Fabric discovery topics";
  const slug = path.split("/").filter(Boolean).pop() ?? path;
  return slug.replace(/-/g, " ");
}

export function MarketplaceSupportArticle({
  page,
}: {
  page: MarketplaceSupportPage;
}) {
  const siblings = MARKETPLACE_SUPPORT_PAGES.filter(
    (candidate) =>
      candidate.family === page.family && candidate.slug !== page.slug,
  ).slice(0, 4);

  return (
    <>
      <ArticleJsonLd
        headline={page.h1}
        description={page.description}
        path={page.path}
        image={page.imagePath}
      />
      <FaqJsonLd faqs={page.faqs} />
      <Container className="pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Marketplace", href: "/marketplace/" },
            { label: FAMILY_LABEL[page.family] },
            { label: page.h1 },
          ]}
        />
      </Container>
      <Container className="py-8 sm:py-12">
        <article className="mx-auto max-w-[52rem]">
          <Label>{FAMILY_LABEL[page.family]}</Label>
          <Heading level={1} className="mt-3 text-balance">
            {page.h1}
          </Heading>
          <Prose className="mt-5 text-ink-2">{page.intro}</Prose>
          <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-md bg-paper-raised">
            <SeoImage src={page.imagePath} alt={page.imageAlt} />
          </div>
          <div className="mt-8">
            <ButtonLink
              href="/marketplace/"
              variant="primary"
              trailing={<IconArrowRight width={14} height={14} />}
            >
              Explore fabrics
            </ButtonLink>
          </div>
          <div className="mt-12 space-y-10">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <Heading level={2} className="text-balance">
                  {section.heading}
                </Heading>
                <div className="mt-4 space-y-3">
                  {section.body.map((paragraph) => (
                    <Prose key={paragraph.slice(0, 64)} className="text-ink-2">
                      {paragraph}
                    </Prose>
                  ))}
                </div>
              </section>
            ))}
          </div>
          {page.faqs.length ? (
            <section className="mt-12">
              <Heading level={2}>Questions about this step</Heading>
              <dl className="mt-4 space-y-5">
                {page.faqs.map((faq) => (
                  <div key={faq.question}>
                    <dt className="font-semibold text-ink">{faq.question}</dt>
                    <dd className="mt-1 text-ink-2">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
          <nav aria-label="Related marketplace pages" className="mt-12">
            <Heading level={2}>Continue from here</Heading>
            <ul className="mt-4 space-y-2">
              {page.relatedPaths.map((path) => (
                <li key={path}>
                  <Link
                    href={path}
                    className="text-indigo underline-offset-4 hover:underline"
                  >
                    {linkLabel(path)}
                  </Link>
                </li>
              ))}
              {siblings.map((sibling) => (
                <li key={sibling.path}>
                  <Link
                    href={sibling.path}
                    className="text-indigo underline-offset-4 hover:underline"
                  >
                    {sibling.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </article>
      </Container>
    </>
  );
}
