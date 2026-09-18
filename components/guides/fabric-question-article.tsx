import Link from "next/link";
import Image from "next/image";
import {
  ArticleJsonLd,
  CollectionPageJsonLd,
  FaqJsonLd,
} from "@/components/seo/structured-data";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icon";
import { Container } from "@/components/ui/layout";
import { Heading, Label, Prose } from "@/components/ui/typography";
import {
  FABRIC_QUESTION_CATEGORIES,
  FABRIC_QUESTION_PAGES,
  type FabricQuestionPage,
} from "@/domain/seo/fabric-questions";

function labelFor(path: string): string {
  if (path === "/marketplace/") return "Browse the marketplace";
  if (path === "/guides/") return "All fabric guides";
  if (path === "/guides/fabric-questions/") return "Fabric questions";
  if (path === "/wholesale-fabric/") return "Wholesale fabric";
  if (path === "/fabric-sourcing/") return "Fabric sourcing";
  if (path === "/fabrics/") return "Explore fabrics";
  const page = FABRIC_QUESTION_PAGES.find((item) => item.path === path);
  if (page) return page.h1;
  const slug = path.split("/").filter(Boolean).pop() ?? path;
  return slug.replace(/-/g, " ");
}

export function FabricQuestionArticle({ page }: { page: FabricQuestionPage }) {
  const category = FABRIC_QUESTION_CATEGORIES.find(
    (item) => item.slug === page.category,
  );
  const children =
    page.kind === "index"
      ? FABRIC_QUESTION_PAGES.filter((item) => item.kind === "category")
      : page.kind === "category"
        ? FABRIC_QUESTION_PAGES.filter(
            (item) =>
              item.kind === "question" && item.category === page.category,
          )
        : [];
  const related = page.relatedPaths.filter(
    (path) =>
      path !== page.path && !children.some((item) => item.path === path),
  );

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides/" },
    { label: "Fabric questions", href: "/guides/fabric-questions/" },
    ...(page.kind === "question" && category
      ? [
          {
            label: category.label,
            href: `/guides/fabric-questions/${category.slug}/`,
          },
        ]
      : []),
    { label: page.h1 },
  ];

  return (
    <>
      {page.kind === "question" ? (
        <ArticleJsonLd
          headline={page.h1}
          description={page.description}
          path={page.path}
          image={page.imagePath}
        />
      ) : (
        <CollectionPageJsonLd
          name={page.h1}
          description={page.description}
          path={page.path}
          items={children.map((item) => ({ name: item.h1, path: item.path }))}
        />
      )}
      {page.faqs.length ? <FaqJsonLd faqs={[...page.faqs]} /> : null}
      <Container className="pt-8">
        <Breadcrumbs items={crumbs} />
      </Container>
      <Container className="py-8 sm:py-12">
        <article className="mx-auto max-w-[52rem]">
          <Label>
            {page.kind === "question"
              ? (category?.label ?? "Fabric question")
              : "Fabric questions"}
          </Label>
          <Heading level={1} className="mt-3 text-balance">
            {page.h1}
          </Heading>
          <Prose className="mt-5 text-ink-2">{page.answer}</Prose>
          <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-md bg-paper-raised">
            <Image
              src={page.imagePath}
              alt={page.imageAlt}
              fill
              sizes="(min-width: 768px) 52rem, 100vw"
              className="object-cover"
            />
          </div>
          {page.commercial ? (
            <div className="mt-8">
              <ButtonLink
                href="/marketplace/"
                variant="primary"
                trailing={<IconArrowRight width={14} height={14} />}
              >
                Explore fabrics
              </ButtonLink>
            </div>
          ) : null}
          {page.points.length ? (
            <ul className="mt-8 list-disc space-y-2 pl-5 text-sm text-ink-2">
              {page.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          ) : null}
          <div className="mt-12 space-y-10">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <Heading level={2} className="text-balance">
                  {section.heading}
                </Heading>
                <div className="mt-4 space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <Prose key={paragraph.slice(0, 64)} className="text-ink-2">
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
                      <th
                        key={header || "aspect"}
                        className="px-4 py-3 font-semibold"
                      >
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
          {children.length ? (
            <nav className="mt-12" aria-label="Questions in this group">
              <Heading level={2}>
                {page.kind === "index" ? "Question groups" : "Questions"}
              </Heading>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {children.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className="block rounded-md border border-rule bg-paper-raised px-4 py-3 text-sm text-ink hover:border-indigo"
                    >
                      {item.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          {page.faqs.length ? (
            <section className="mt-12">
              <Heading level={2}>Related questions</Heading>
              <div className="mt-4 space-y-4">
                {page.faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-md border border-rule bg-paper-raised px-4 py-3"
                  >
                    <p className="font-semibold text-ink">{faq.question}</p>
                    <p className="mt-2 text-sm text-ink-2">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          {related.length ? (
            <nav className="mt-12" aria-label="Related reading">
              <Heading level={2}>Related reading</Heading>
              <ul className="mt-4 space-y-2">
                {related.slice(0, 8).map((path) => (
                  <li key={path}>
                    <Link href={path} className="text-indigo hover:underline">
                      {labelFor(path)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </article>
      </Container>
    </>
  );
}
