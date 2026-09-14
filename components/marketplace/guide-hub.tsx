import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { PageHeader } from "@/components/marketplace/page-header";
import { Label } from "@/components/ui/typography";
import { ButtonLink } from "@/components/ui/button";
import type { Guide } from "@/repositories/guides";
import type { GuideHub } from "@/domain/seo/guide-hubs";
import { CollectionPageJsonLd } from "@/components/seo/structured-data";

/**
 * A topical hub over published guides.
 *
 * Uses `PageHeader`, `Container`, `Label` and `ButtonLink` — the same
 * components the guides index and every marketplace hub already use. No new
 * visual language, no new spacing, no new type scale.
 *
 * It renders whatever currently matches the hub's predicate. There is no
 * hand-written list of links, so the hub cannot promise an article that has
 * been archived, and it cannot go stale in the direction that matters.
 */
export function GuideHubPage({
  hub,
  guides,
}: {
  hub: GuideHub;
  guides: Guide[];
}) {
  return (
    <>
      <CollectionPageJsonLd
        name={hub.title}
        description={hub.intro}
        path={`/guides/${hub.slug}/`}
        items={guides.map((guide) => ({
          name: guide.title,
          path: guide.path,
        }))}
      />
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides/" },
          { label: hub.title },
        ]}
        title={hub.heading}
        intro={hub.intro}
        meta={[{ label: "Guides", value: guides.length }]}
      />

      <Container className="py-9">
        <ul className="grid gap-px border border-rule-2 bg-rule-2">
          {guides.map((guide) => (
            <li key={guide.slug} className="bg-paper-raised px-4 py-4">
              <Link
                href={guide.path}
                prefetch={false}
                className="text-body font-medium text-ink underline-offset-4 hover:text-indigo hover:underline"
              >
                {guide.title}
              </Link>
              {guide.summary ? (
                <p className="mt-1 max-w-[70ch] text-sm text-ink-2 text-pretty">
                  {guide.summary}
                </p>
              ) : null}
              <Label className="mt-2" tone="ink">
                {guide.type.replace(/_/g, " ")} · {guide.wordCount} words
              </Label>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink href="/guides/" variant="secondary">
            All guides
          </ButtonLink>
          <ButtonLink href="/marketplace/" variant="primary">
            Browse fabrics
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
