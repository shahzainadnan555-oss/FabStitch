import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { PageHeader } from "@/components/marketplace/page-header";
import { Label } from "@/components/ui/typography";
import { listPublishedCustomerCatalog } from "@/repositories/customer-catalog";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return registeredStorefrontMetadata("/fabrics/index/", {
    title: "Every fabric A-Z",
    description:
      "The published FabStitch fabric catalog, listed alphabetically.",
  });
}

export default async function FabricIndexPage() {
  const fabrics = await listPublishedCustomerCatalog({ sort: "name_asc" });
  const letters = new Map<string, typeof fabrics>();
  for (const fabric of fabrics) {
    const letter = fabric.name[0]?.toUpperCase() || "#";
    letters.set(letter, [...(letters.get(letter) ?? []), fabric]);
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Fabrics", href: "/fabrics/" }, { label: "A-Z" }]}
        title="Every fabric, alphabetically"
        intro="The flat view of the published catalog. Useful when you know the name and not the family."
        meta={[{ label: "Published fabrics", value: fabrics.length }]}
      />

      <Container className="py-8">
        {fabrics.length ? (
          <div className="columns-1 gap-x-10 sm:columns-2 lg:columns-3">
            {[...letters.entries()].map(([letter, nodes]) => (
              <section key={letter} className="mb-7 break-inside-avoid">
                <Label>{letter}</Label>
                <ul className="mt-2 border-t border-rule-2">
                  {nodes.map((fabric) => (
                    <li key={fabric.id} className="border-b border-rule-2">
                      <Link
                        href={`/fabrics/${fabric.slug}/`}
                        className="flex items-baseline justify-between gap-3 py-2 text-sm text-ink-2 transition-colors hover:text-indigo"
                      >
                        {fabric.name}
                        <span className="font-mono text-label uppercase text-ink-4">
                          {fabric.family.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <p className="rounded-sm border border-rule-2 bg-paper-raised p-5 text-sm text-ink-3">
            No published fabrics are available yet.
          </p>
        )}
      </Container>
    </>
  );
}
