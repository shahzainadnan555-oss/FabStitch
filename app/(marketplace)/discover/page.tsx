import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { Heading, Label, Prose } from "@/components/ui/typography";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  INDEXABLE_SEMANTIC_PAGES,
  SEMANTIC_BUILD_REPORT,
} from "@/domain/seo/semantic";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return registeredStorefrontMetadata("/discover/", {
    title: "Fabric Discovery Topics",
    description:
      "Explore FabStitch fabric discovery topics spanning materials, garment uses, attributes, guides and commercial pathways into the marketplace.",
    index: true,
  });
}

export default function DiscoverHubPage() {
  const byCluster = Object.entries(SEMANTIC_BUILD_REPORT.byCluster).sort(
    (a, b) => b[1] - a[1],
  );

  const samples = INDEXABLE_SEMANTIC_PAGES.slice(0, 48);

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Discover" }]}
        />
      </Container>
      <Container className="py-8 sm:py-12">
        <Label>Semantic discovery</Label>
        <Heading level={1} className="mt-3">
          Fabric discovery topics
        </Heading>
        <Prose className="mt-4 max-w-[52rem] text-ink-2">
          A structured library of fabric materials, garment uses, attributes,
          comparisons and commercial pathways. Each topic links into FabStitch
          collections, Best For edits, guides and the marketplace — without
          duplicating existing canonical hubs.
        </Prose>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {byCluster.map(([cluster, count]) => (
            <div
              key={cluster}
              className="rounded-md border border-rule-2 bg-paper-raised px-4 py-3"
            >
              <p className="font-mono text-label uppercase text-ink-3">
                {cluster.replace(/_/g, " ")}
              </p>
              <p className="mt-1 text-h3 font-semibold tabular-nums text-ink">
                {count}
              </p>
            </div>
          ))}
        </div>

        <Heading level={2} className="mt-12">
          Featured topics
        </Heading>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {samples.map((page) => (
            <li key={page.slug}>
              <Link
                href={page.path}
                className="text-sm font-medium text-indigo underline-offset-2 hover:underline"
              >
                {page.h1}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-ink-3">
          {INDEXABLE_SEMANTIC_PAGES.length} indexable discovery topics currently
          published.
        </p>
      </Container>
    </>
  );
}
