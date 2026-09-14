import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { PageHeader } from "@/components/marketplace/page-header";
import { Heading, Label, Prose } from "@/components/ui/typography";
import { ButtonLink } from "@/components/ui/button";
import { ResourceNav } from "@/components/resources/resource-nav";
import { getGuide, guideLinks, listGuides } from "@/repositories/guides";
import { findHub } from "@/domain/seo/guide-hubs";
import { ArticleJsonLd, FaqJsonLd } from "@/components/seo/structured-data";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

const HUB_CATEGORY: Record<string, string> = {
  "2027-fabric-directions": "sourcing-buying",
  "fabric-education": "fabric-basics",
  "choosing-fabrics": "fabric-applications",
};

export async function generateStaticParams() {
  const guides = await listGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (findHub(slug)) {
    return { title: "Guides", robots: { index: false, follow: true } };
  }
  const guide = await getGuide(slug);
  if (!guide) return { title: "Guide not found", robots: { index: false } };
  return registeredStorefrontMetadata(guide.path, {
    title: guide.title,
    description: guide.metaDescription ?? guide.summary ?? undefined,
    type: "article",
    index: true,
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hub = findHub(slug);
  if (hub) {
    const category = HUB_CATEGORY[hub.slug];
    redirect(category ? `/guides/?category=${category}` : "/guides/");
  }

  const guide = await getGuide(slug);
  if (!guide) notFound();

  const links = guideLinks(guide);
  const related = (await listGuides()).filter((item) =>
    guide.relatedGuides.includes(item.slug),
  );

  return (
    <>
      <ArticleJsonLd
        headline={guide.heading}
        description={guide.metaDescription}
        path={guide.path}
        author={guide.author}
        publishedAt={guide.publishedAt}
        updatedAt={guide.updatedAt}
      />
      <FaqJsonLd faqs={guide.faqs} />

      <Container className="pt-8">
        <ResourceNav current="guides" />
      </Container>

      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides/" },
          {
            label: guide.categoryLabel,
            href: `/guides/?category=${guide.category}`,
          },
          { label: guide.title },
        ]}
        eyebrow={guide.categoryLabel}
        title={guide.heading}
        intro={guide.summary ?? undefined}
      />

      <Container className="py-8 sm:py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <article className="min-w-0">
            {guide.sections.length > 2 ? (
              <nav aria-label="On this page" className="mb-8">
                <Label className="mb-2">On this page</Label>
                <ol className="grid gap-1.5">
                  {guide.sections.map((section, index) => (
                    <li key={section.heading}>
                      <a
                        href={`#section-${index}`}
                        className="text-sm text-ink-2 underline-offset-4 hover:text-indigo hover:underline"
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}

            {guide.sections.map((section, index) => (
              <section
                key={section.heading}
                id={`section-${index}`}
                className="mb-8 scroll-mt-24"
              >
                <Heading level={2} className="mb-3">
                  {section.heading}
                </Heading>
                <Prose>
                  {section.body.split("\n\n").map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="mb-3">
                      {paragraph}
                    </p>
                  ))}
                </Prose>
                {section.keyPoints.length ? (
                  <ul className="mt-3 grid gap-1.5 border-l-2 border-rule-2 pl-4">
                    {section.keyPoints.map((point) => (
                      <li key={point} className="text-sm text-ink-2">
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            {guide.faqs.length ? (
              <section className="mb-8">
                <Heading level={2} className="mb-3">
                  Questions this guide answers
                </Heading>
                <dl className="grid gap-4">
                  {guide.faqs.map((faq) => (
                    <div key={faq.question}>
                      <dt className="font-medium text-ink">{faq.question}</dt>
                      <dd className="mt-1 text-body text-ink-2">
                        {faq.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            <div className="border-t border-rule pt-8">
              <h2 className="text-h3 font-semibold text-ink">
                Continue with the catalog
              </h2>
              <p className="mt-2 max-w-[48ch] text-sm text-ink-3">
                Compare named fabrics, then send an inquiry with the quantity
                you need.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <ButtonLink href="/marketplace/" variant="primary">
                  Explore fabrics
                </ButtonLink>
                <ButtonLink href="/help/" variant="secondary">
                  Help
                </ButtonLink>
              </div>
            </div>
          </article>

          <aside className="min-w-0 lg:border-l lg:border-rule lg:pl-8">
            {links.length ? (
              <>
                <Label className="mb-2">On FabStitch</Label>
                <ul className="mb-6 grid gap-1.5">
                  {links.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        prefetch={false}
                        className="text-sm text-ink-2 underline-offset-4 hover:text-indigo hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {related.length ? (
              <>
                <Label className="mb-2">Related guides</Label>
                <ul className="mb-6 grid gap-2">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={item.path}
                        prefetch={false}
                        className="text-sm font-medium text-ink hover:text-indigo"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <ButtonLink href="/support/" variant="secondary">
              Need support?
            </ButtonLink>
          </aside>
        </div>
      </Container>
    </>
  );
}
