import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { Heading, Label, Prose } from "@/components/ui/typography";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  INDEXABLE_SEMANTIC_PAGES,
  SEMANTIC_BUILD_REPORT,
} from "@/domain/seo/semantic";
import {
  DISCOVER_CLUSTER_META,
  discoverClusterPath,
  pagesForDiscoverCluster,
} from "@/lib/discover-directory";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return registeredStorefrontMetadata("/discover/", {
    title: "Fabric Discovery Topics",
    description:
      "Explore FabStitch fabric discovery topics spanning materials, garment uses, attributes, guides and commercial pathways into the marketplace.",
    index: true,
  });
}

const FEATURED_PER_CLUSTER = 8;

export default function DiscoverHubPage() {
  const clusters = DISCOVER_CLUSTER_META.map((meta) => {
    const pages = pagesForDiscoverCluster(meta.cluster);
    return {
      ...meta,
      count: pages.length,
      samples: pages.slice(0, FEATURED_PER_CLUSTER),
      path: discoverClusterPath(meta.cluster),
    };
  }).filter((cluster) => cluster.count > 0);

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

        <Heading level={2} className="mt-12">
          Browse by topic group
        </Heading>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clusters.map((cluster) => (
            <Link
              key={cluster.cluster}
              href={cluster.path}
              className="rounded-md border border-rule-2 bg-paper-raised px-4 py-3 transition hover:border-indigo/40"
            >
              <p className="font-mono text-label uppercase text-ink-3">
                {cluster.label}
              </p>
              <p className="mt-1 text-h3 font-semibold tabular-nums text-ink">
                {cluster.count}
              </p>
              <p className="mt-2 text-sm text-ink-2">{cluster.description}</p>
            </Link>
          ))}
        </div>

        {clusters.map((cluster) => (
          <section key={cluster.cluster} className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <Heading level={2}>{cluster.label}</Heading>
              <Link
                href={cluster.path}
                className="text-sm font-medium text-indigo underline-offset-2 hover:underline"
              >
                View all {cluster.count} topics
              </Link>
            </div>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {cluster.samples.map((page) => (
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
          </section>
        ))}

        <section className="mt-14 rounded-md border border-rule-2 bg-chrome px-5 py-6">
          <Heading level={2}>Continue into FabStitch</Heading>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/marketplace/", label: "Fabric marketplace" },
              { href: "/fabrics/", label: "Explore fabrics" },
              { href: "/collections/", label: "Collections" },
              { href: "/fabrics/best-for/", label: "Best For" },
              { href: "/guides/", label: "Fabric guides" },
              { href: "/fabric-sourcing/", label: "Fabric sourcing" },
              { href: "/wholesale-fabric/", label: "Wholesale fabric" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-indigo underline-offset-2 hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-8 text-sm text-ink-3">
          {INDEXABLE_SEMANTIC_PAGES.length} indexable discovery topics across{" "}
          {Object.keys(SEMANTIC_BUILD_REPORT.byCluster).length} topic groups.
        </p>
      </Container>
    </>
  );
}
