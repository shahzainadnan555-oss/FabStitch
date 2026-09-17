import Image from "next/image";
import Link from "next/link";
import { TextileBackdrop } from "@/components/landing/textile-backdrop";
import { Container } from "@/components/ui/layout";
import { ButtonLink } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  CollectionPageJsonLd,
  FaqJsonLd,
} from "@/components/seo/structured-data";
import type { CommercialLandingPage } from "@/content/commercial-landing-pages";
import {
  COLLECTION_BY_SLUG,
  FABRIC_2027_BY_SLUG,
  MEDIA_BY_FABRIC_SLUG,
  SEO_USE_CASE_BY_SLUG,
} from "@/catalog";

function relatedLabel(path: string): string {
  if (path.includes("wholesale")) return "Wholesale fabric";
  if (path.includes("fabric-sourcing")) return "Fabric sourcing";
  if (path.includes("clothing")) return "Clothing fabric";
  if (path.includes("apparel")) return "Apparel fabric";
  if (path.includes("fashion")) return "Fashion fabrics";
  if (path.includes("marketplace")) return "Fabric marketplace";
  return path.replace(/^\/|\/$/g, "").replace(/-/g, " ");
}

export function CommercialIntentLanding({
  page,
}: {
  page: CommercialLandingPage;
}) {
  const fabrics = page.fabricSlugs
    .map(
      (slug) => FABRIC_2027_BY_SLUG[slug as keyof typeof FABRIC_2027_BY_SLUG],
    )
    .filter(Boolean);
  const bestFor = page.bestForSlugs
    .map(
      (slug) => SEO_USE_CASE_BY_SLUG[slug as keyof typeof SEO_USE_CASE_BY_SLUG],
    )
    .filter(Boolean);
  const collections = page.collectionSlugs
    .map((slug) => COLLECTION_BY_SLUG[slug as keyof typeof COLLECTION_BY_SLUG])
    .filter(Boolean);

  const schemaItems = [
    ...collections.map((collection) => ({
      name: `${collection.label} fabrics`,
      path: `/collections/${collection.slug}/`,
    })),
    ...bestFor.map((useCase) => ({
      name: useCase.title,
      path: `/fabrics/best-for/${useCase.slug}/`,
    })),
    ...fabrics.map((fabric) => ({
      name: fabric.name,
      path: `/fabrics/${fabric.slug}/`,
      image: MEDIA_BY_FABRIC_SLUG[fabric.slug]?.src,
    })),
  ];

  return (
    <>
      <CollectionPageJsonLd
        name={page.title}
        description={page.metaDescription}
        path={page.path}
        items={schemaItems}
      />
      <FaqJsonLd faqs={[...page.faqs]} />

      <section className="relative overflow-hidden bg-navy-surface text-on-ink">
        <TextileBackdrop
          src={page.image}
          placement="right"
          opacity={0.18}
          objectPosition="62% center"
        />
        <Container className="relative py-10 sm:py-14 lg:py-20">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: page.eyebrow }]}
            className="mb-8 text-on-navy-2 [&_a]:text-on-navy-2 [&_a:hover]:text-on-ink"
          />
          <div className="grid items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-label tracking-[0.12em] text-gold-on-navy uppercase">
                {page.eyebrow}
              </p>
              <h1 className="mt-4 max-w-[18ch] text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95] font-semibold tracking-[-0.05em] text-balance">
                {page.h1}
              </h1>
              <p className="mt-5 max-w-[38rem] text-lead text-on-navy-2">
                {page.valueProposition}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/marketplace/" variant="primary" size="lg">
                  {page.heroCtaLabel}
                  <IconArrowRight width={15} height={15} aria-hidden />
                </ButtonLink>
                <ButtonLink
                  href={page.secondaryCtaHref}
                  variant="on-ink"
                  size="lg"
                >
                  {page.secondaryCtaLabel}
                </ButtonLink>
              </div>
            </div>
            <div className="relative hidden min-h-64 overflow-hidden rounded-md border border-white/15 lg:col-span-5 lg:block">
              <Image
                src={page.image}
                alt={page.imageAlt}
                fill
                priority
                sizes="36vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-rule-2 bg-paper">
        <Container className="py-12 sm:py-16">
          <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
            Selection checks
          </p>
          <h2 className="mt-2 max-w-[28ch] text-h2 font-semibold text-ink">
            {page.considerationsHeading}
          </h2>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-md border border-rule-2 bg-rule-2 sm:grid-cols-2 lg:grid-cols-3">
            {page.considerations.map((item) => (
              <li key={item.title} className="bg-paper-raised p-5 sm:p-6">
                <h3 className="text-h3 font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-3">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0">
            {page.sections.map((section) => (
              <section key={section.heading} className="mb-10 max-w-[70ch]">
                <h2 className="text-h2 font-semibold text-ink">
                  {section.heading}
                </h2>
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="mt-4 text-body leading-relaxed text-ink-2 text-pretty"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.keyPoints?.length ? (
                  <ul className="mt-4 grid gap-1.5 border-l-2 border-rule-2 pl-4">
                    {section.keyPoints.map((point) => (
                      <li key={point} className="text-sm text-ink-2">
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            {fabrics.length ? (
              <section className="mt-4" aria-labelledby="commercial-fabrics">
                <h2
                  id="commercial-fabrics"
                  className="text-h2 font-semibold text-ink"
                >
                  Relevant FabStitch fabrics
                </h2>
                <p className="mt-3 max-w-[60ch] text-sm text-ink-3">
                  Named fabrics from the published catalog. Open a product page
                  for composition, construction and inquiry.
                </p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {fabrics.map((fabric, index) => {
                    const media = MEDIA_BY_FABRIC_SLUG[fabric.slug];
                    const src = media?.src ?? page.image;
                    return (
                      <li key={fabric.slug}>
                        <Link
                          href={`/fabrics/${fabric.slug}/`}
                          prefetch={false}
                          className="group block overflow-hidden rounded-md border border-rule-2 bg-paper-raised transition-colors hover:border-indigo"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                              src={src}
                              alt={media?.alt ?? `${fabric.name} fabric`}
                              fill
                              priority={index === 0}
                              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 100vw"
                              className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                            />
                          </div>
                          <span className="flex items-center justify-between gap-3 p-4">
                            <span className="text-sm font-semibold text-ink group-hover:text-indigo">
                              {fabric.name}
                            </span>
                            <IconArrowRight
                              width={14}
                              height={14}
                              className="shrink-0 text-indigo"
                              aria-hidden
                            />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            {page.faqs.length ? (
              <section className="mt-14" aria-labelledby="commercial-faq">
                <h2
                  id="commercial-faq"
                  className="text-h2 font-semibold text-ink"
                >
                  Frequently asked questions
                </h2>
                <dl className="mt-6 grid gap-4">
                  {page.faqs.map((faq) => (
                    <div
                      key={faq.question}
                      className="rounded-md border border-rule-2 bg-paper-raised p-5"
                    >
                      <dt className="text-h3 font-semibold text-ink">
                        {faq.question}
                      </dt>
                      <dd className="mt-2 text-sm leading-relaxed text-ink-2">
                        {faq.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <nav
              aria-label="Related destinations"
              className="rounded-md border border-rule-2 bg-paper-raised p-5"
            >
              <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
                Continue exploring
              </p>
              <ul className="mt-4 grid gap-2">
                <li>
                  <Link
                    href="/marketplace/"
                    className="text-sm font-medium text-indigo hover:underline"
                  >
                    Fabric marketplace
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fabrics/"
                    className="text-sm font-medium text-indigo hover:underline"
                  >
                    Explore all fabrics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/"
                    className="text-sm font-medium text-indigo hover:underline"
                  >
                    Fabric collections
                  </Link>
                </li>
                <li>
                  <Link
                    href="/fabrics/best-for/"
                    className="text-sm font-medium text-indigo hover:underline"
                  >
                    Fabrics by use
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/"
                    className="text-sm font-medium text-indigo hover:underline"
                  >
                    Fabric guides
                  </Link>
                </li>
              </ul>
            </nav>

            {bestFor.length ? (
              <div className="rounded-md border border-rule-2 bg-paper-raised p-5">
                <h2 className="text-h3 font-semibold text-ink">Best For</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {bestFor.map((useCase) => (
                    <li key={useCase.slug}>
                      <Link
                        href={`/fabrics/best-for/${useCase.slug}/`}
                        className="inline-flex rounded-sm border border-rule-2 px-3 py-1.5 text-sm text-ink hover:border-indigo hover:text-indigo"
                      >
                        {useCase.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {collections.length ? (
              <div className="rounded-md border border-rule-2 bg-paper-raised p-5">
                <h2 className="text-h3 font-semibold text-ink">Collections</h2>
                <ul className="mt-3 grid gap-2">
                  {collections.map((collection) => (
                    <li key={collection.slug}>
                      <Link
                        href={`/collections/${collection.slug}/`}
                        className="text-sm font-medium text-indigo hover:underline"
                      >
                        {collection.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {page.guidePaths.length ? (
              <div className="rounded-md border border-rule-2 bg-paper-raised p-5">
                <h2 className="text-h3 font-semibold text-ink">Guides</h2>
                <ul className="mt-3 grid gap-2">
                  {page.guidePaths.map((path) => (
                    <li key={path}>
                      <Link
                        href={path}
                        className="text-sm font-medium text-indigo hover:underline"
                      >
                        {path
                          .replace(/^\/guides\//, "")
                          .replace(/\/$/, "")
                          .replace(/-/g, " ")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {page.relatedLandingPaths.length ? (
              <div className="rounded-md border border-rule-2 bg-paper-sunk p-5">
                <h2 className="text-h3 font-semibold text-ink">
                  Related topics
                </h2>
                <ul className="mt-3 grid gap-2">
                  {page.relatedLandingPaths.map((path) => (
                    <li key={path}>
                      <Link
                        href={path}
                        className="text-sm font-medium text-indigo hover:underline"
                      >
                        {relatedLabel(path)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </Container>

      <section className="bg-chrome">
        <Container className="flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-end sm:py-16">
          <div>
            <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
              Next step
            </p>
            <h2 className="mt-3 max-w-[18ch] text-h1 font-semibold text-ink text-balance">
              {page.finalCtaHeading}
            </h2>
            <p className="mt-3 max-w-[36rem] text-sm text-ink-3">
              {page.finalCtaBody}
            </p>
          </div>
          <ButtonLink href="/marketplace/" variant="primary" size="lg">
            Open marketplace
            <IconArrowRight width={16} height={16} aria-hidden />
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
