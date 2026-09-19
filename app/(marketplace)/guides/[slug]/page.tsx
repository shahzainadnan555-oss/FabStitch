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
import { MEDIA_BY_FABRIC_SLUG } from "@/catalog";
import { SeoImage } from "@/components/seo/seo-image";
import { imageAlt } from "@/domain/seo/image-assets";

const HUB_CATEGORY: Record<string, string> = {
  "2027-fabric-directions": "sourcing-buying",
  "fabric-education": "fabric-basics",
  "choosing-fabrics": "fabric-applications",
};

function guidePicture(guide: {
  heading: string;
  fabricSlugs: readonly string[];
}): { src: string; alt: string } {
  for (const slug of guide.fabricSlugs) {
    const media = MEDIA_BY_FABRIC_SLUG[slug];
    if (media?.status === "final" && media.src) {
      return { src: media.src, alt: media.alt ?? imageAlt(media.src) };
    }
  }
  const heading = guide.heading.toLowerCase();
  const src = heading.includes("linen")
    ? "/media/fabrics/european-flax-linen-primary.webp"
    : heading.includes("silk")
      ? "/media/fabrics/silk-chiffon-primary.webp"
      : heading.includes("wool")
        ? "/media/fabrics/tropical-wool-super-110s-130s-primary.webp"
        : heading.includes("denim")
          ? "/media/fabrics/lightweight-denim-primary.webp"
          : heading.includes("knit")
            ? "/media/fabrics/mercerized-cotton-jersey-primary.webp"
            : "/media/fabrics/cotton-poplin-primary.webp";
  return { src, alt: imageAlt(src) };
}

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
    image: guidePicture(guide).src,
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
        image={guidePicture(guide).src}
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
          { label: guide.categoryLabel, href: "/guides/" },
          { label: guide.title },
        ]}
        eyebrow={guide.categoryLabel}
        title={guide.heading}
        intro={guide.summary ?? undefined}
      />
      <Container className="pb-2">
        <div className="relative mx-auto aspect-[16/10] max-w-[52rem] overflow-hidden rounded-md bg-paper-raised">
          <SeoImage
            src={guidePicture(guide).src}
            alt={guidePicture(guide).alt}
            priority
            sizes="(min-width: 768px) 52rem, 100vw"
          />
        </div>
      </Container>

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
                  Open marketplace
                </ButtonLink>
                <ButtonLink href="/collections/" variant="secondary">
                  Browse collections
                </ButtonLink>
                <ButtonLink href="/fabrics/best-for/" variant="secondary">
                  Fabrics by use
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
