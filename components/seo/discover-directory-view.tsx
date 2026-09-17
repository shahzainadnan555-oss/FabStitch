import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { Heading, Label, Prose } from "@/components/ui/typography";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { discoverClusterPath } from "@/lib/discover-directory";
import type { SemanticCluster } from "@/domain/seo/semantic/ontology";

export function DiscoverDirectoryView({
  cluster,
  page,
  totalPages,
  totalItems,
  items,
  label,
  hubTitle,
  description,
}: {
  cluster: SemanticCluster;
  page: number;
  totalPages: number;
  totalItems: number;
  items: { slug: string; path: string; h1: string }[];
  label: string;
  hubTitle: string;
  description: string;
}) {
  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Discover", href: "/discover/" },
            { label: page > 1 ? `${label} (page ${page})` : label },
          ]}
        />
      </Container>
      <Container className="py-8 sm:py-12">
        <Label>Discovery directory</Label>
        <Heading level={1} className="mt-3">
          {page > 1 ? `${hubTitle} — page ${page}` : hubTitle}
        </Heading>
        <Prose className="mt-4 max-w-[52rem] text-ink-2">{description}</Prose>
        <p className="mt-3 text-sm text-ink-3">
          {totalItems} topics in this group
          {totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}.
        </p>

        <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={item.path}
                className="text-sm font-medium text-indigo underline-offset-2 hover:underline"
              >
                {item.h1}
              </Link>
            </li>
          ))}
        </ul>

        {totalPages > 1 ? (
          <nav
            className="mt-10 flex flex-wrap items-center gap-3"
            aria-label="Directory pagination"
          >
            {page > 1 ? (
              <Link
                href={discoverClusterPath(cluster, page - 1)}
                className="text-sm font-medium text-indigo underline-offset-2 hover:underline"
              >
                Previous
              </Link>
            ) : null}
            {Array.from({ length: totalPages }, (_, offset) => offset + 1).map(
              (pageNum) => (
                <Link
                  key={pageNum}
                  href={discoverClusterPath(cluster, pageNum)}
                  className={
                    pageNum === page
                      ? "text-sm font-semibold text-ink"
                      : "text-sm font-medium text-indigo underline-offset-2 hover:underline"
                  }
                  aria-current={pageNum === page ? "page" : undefined}
                >
                  {pageNum}
                </Link>
              ),
            )}
            {page < totalPages ? (
              <Link
                href={discoverClusterPath(cluster, page + 1)}
                className="text-sm font-medium text-indigo underline-offset-2 hover:underline"
              >
                Next
              </Link>
            ) : null}
          </nav>
        ) : null}

        <p className="mt-8 text-sm text-ink-3">
          <Link
            href="/discover/"
            className="font-medium text-indigo underline-offset-2 hover:underline"
          >
            All discovery topic groups
          </Link>
        </p>
      </Container>
    </>
  );
}
