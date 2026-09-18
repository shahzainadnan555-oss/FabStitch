import Link from "next/link";
import Image from "next/image";
import { ArticleJsonLd, FaqJsonLd } from "@/components/seo/structured-data";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icon";
import { Container } from "@/components/ui/layout";
import { Heading, Label, Prose } from "@/components/ui/typography";
import type { MarketplaceTopicView } from "@/domain/seo/marketplace-thousand";

function linkLabel(path: string): string {
  if (path === "/marketplace/") return "Browse the fabric marketplace";
  if (path === "/fabrics/") return "Explore fabrics";
  if (path === "/collections/") return "Fabric collections";
  if (path === "/guides/") return "Fabric guides";
  if (path === "/guides/fabric-weight-and-gsm/") return "Fabric weight and GSM";
  if (path === "/guides/woven-vs-knit-fabrics/")
    return "Woven and knit fabrics";
  const slug = path.split("/").filter(Boolean).pop() ?? path;
  return slug.replace(/-/g, " ");
}

export function MarketplaceTopicArticle({
  page,
}: {
  page: MarketplaceTopicView;
}) {
  const related = page.relatedPaths.filter(
    (path) =>
      path !== page.path && !page.directory?.some((item) => item.href === path),
  );

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
            { label: page.hubLabel, href: page.hubPath },
            { label: page.h1 },
          ]}
        />
      </Container>
      <Container className="py-8 sm:py-12">
        <article className="mx-auto max-w-[52rem]">
          <Label>{page.hubLabel}</Label>
          <Heading level={1} className="mt-3 text-balance">
            {page.h1}
          </Heading>
          <Prose className="mt-5 text-ink-2">{page.intro}</Prose>
          <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-md bg-paper-raised">
            <Image
              src={page.imagePath}
              alt={page.imageAlt}
              fill
              sizes="(min-width: 768px) 52rem, 100vw"
              className="object-cover"
              priority
            />
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
                    <Prose key={paragraph.slice(0, 80)} className="text-ink-2">
                      {paragraph}
                    </Prose>
                  ))}
                </div>
              </section>
            ))}
          </div>
          {page.table ? (
            <div className="mt-10 overflow-x-auto rounded-md border border-rule">
              <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                <caption className="sr-only">{page.table.caption}</caption>
                <thead className="bg-paper-raised text-ink">
                  <tr>
                    {page.table.headers.map((header) => (
                      <th key={header} className="px-4 py-3 font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {page.table.rows.map((row) => (
                    <tr key={row[0]} className="border-t border-rule">
                      {row.map((cell, index) => (
                        <td
                          key={`${row[0]}-${index}`}
                          className="px-4 py-3 align-top text-ink-2"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {page.directory?.length ? (
            <nav aria-label={page.hubLabel} className="mt-12">
              <Heading level={2}>Topics in this group</Heading>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {page.directory.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ink-2 hover:text-indigo"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          {page.faqs.length ? (
            <section className="mt-12">
              <Heading level={2}>Questions</Heading>
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
          <nav aria-label="Related pages" className="mt-12">
            <Heading level={2}>Continue from here</Heading>
            <ul className="mt-4 space-y-2">
              {related.slice(0, 8).map((path) => (
                <li key={path}>
                  <Link
                    href={path}
                    className="text-indigo underline-offset-4 hover:underline"
                  >
                    {linkLabel(path)}
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
