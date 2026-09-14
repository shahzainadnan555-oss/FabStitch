import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { PageHeader } from "@/components/marketplace/page-header";
import { ContactSupport } from "@/components/marketplace/contact-support";
import { ResourceNav } from "@/components/resources/resource-nav";
import { getHelpArticle, HELP_ARTICLES } from "@/features/help/content";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

type Props = PageProps<"/help/[slug]">;

export function generateStaticParams() {
  return HELP_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getHelpArticle(slug);
  if (!article)
    return { title: "Help article not found", robots: { index: false } };
  return registeredStorefrontMetadata(`/help/${slug}/`, {
    title: article.title,
    description: article.summary,
    index: article.indexable,
  });
}

export default async function HelpArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getHelpArticle(slug);
  if (!article) notFound();
  const related = article.related;
  const moreInCategory = HELP_ARTICLES.filter(
    (candidate) =>
      candidate.category === article.category &&
      candidate.slug !== article.slug,
  ).slice(0, 5);

  return (
    <>
      <Container className="pt-8">
        <ResourceNav current="help" />
      </Container>
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Help", href: "/help/" },
          { label: article.title },
        ]}
        eyebrow={article.category}
        title={article.title}
        intro={article.summary}
      />
      <Container className="py-9 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,44rem)_16rem] lg:justify-between">
          <article className="min-w-0 space-y-9">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-h2 font-semibold text-ink">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-body leading-relaxed text-ink-2 text-pretty"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            {related.length ? (
              <nav
                aria-label="Related FabStitch pages"
                className="border-t border-rule pt-6"
              >
                <h2 className="text-h3 font-semibold text-ink">
                  Continue on FabStitch
                </h2>
                <ul className="mt-3 grid gap-2">
                  {related.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        className="font-medium text-indigo underline-offset-4 hover:underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            <ContactSupport compact />
          </article>

          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <p className="font-mono text-label tracking-[0.09em] text-ink-4 uppercase">
              More help
            </p>
            <nav aria-label="Related help articles">
              <ul className="mt-3 border-t border-rule">
                {moreInCategory.map((candidate) => (
                  <li
                    key={candidate.slug}
                    className="border-b border-rule py-2.5"
                  >
                    <Link
                      href={`/help/${candidate.slug}/`}
                      prefetch={false}
                      className="text-sm font-medium text-ink-2 hover:text-indigo"
                    >
                      {candidate.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Link
              href="/support/"
              className="mt-6 inline-flex text-sm font-semibold text-indigo hover:underline"
            >
              Need support?
            </Link>
          </aside>
        </div>
      </Container>
    </>
  );
}
