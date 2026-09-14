import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/state";
import { PageHeader } from "@/components/marketplace/page-header";
import {
  formatCatalogMeasurement,
  getCustomerCatalogFabrics,
} from "@/repositories/customer-catalog";
import { cn } from "@/lib/cn";
import { IconArrowRight } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Compare fabrics",
  description: "Compare selected FabStitch fabrics side by side.",
  robots: { index: false },
};

export default async function ComparePage({
  searchParams,
}: PageProps<"/compare">) {
  const query = await searchParams;
  const raw = Array.isArray(query.ids) ? query.ids[0] : query.ids;
  const ids = (raw ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 4);
  const fabrics = await getCustomerCatalogFabrics(ids);

  if (!fabrics.length) {
    return (
      <>
        <PageHeader title="Nothing selected yet." />
        <Container className="py-10">
          <EmptyState
            eyebrow="Empty"
            title="Add up to four fabrics to compare."
            description="Use the Compare control on a fabric card. Your selection follows you across the marketplace for this browser session."
            action={
              <ButtonLink
                href="/fabrics/"
                variant="primary"
                trailing={<IconArrowRight width={14} height={14} />}
              >
                Browse fabrics
              </ButtonLink>
            }
          />
        </Container>
      </>
    );
  }

  const rows = [
    {
      label: "Composition",
      values: fabrics.map(
        (item) => item.composition.join(" / ") || "Not stated",
      ),
    },
    {
      label: "Construction",
      values: fabrics.map(
        (item) => item.construction.join(" / ") || "Not stated",
      ),
    },
    {
      label: "Weight",
      values: fabrics.map(
        (item) =>
          item.measurements.map(formatCatalogMeasurement).join(" · ") ||
          "Not stated",
      ),
    },
    { label: "Family", values: fabrics.map((item) => item.family.label) },
    {
      label: "Collection",
      values: fabrics.map((item) => item.collection.label),
    },
    {
      label: "Best for",
      values: fabrics.map(
        (item) =>
          item.bestFor.map((application) => application.label).join(", ") ||
          "Not stated",
      ),
    },
    {
      label: "Characteristics",
      values: fabrics.map(
        (item) => item.characteristics.join(", ") || "Not stated",
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={`${fabrics.length} fabrics side by side`}
        intro="Compare declared catalogue characteristics. Commercial availability, pricing and delivery are not inferred."
        action={
          <ButtonLink
            href="/marketplace/"
            variant="primary"
            trailing={<IconArrowRight width={14} height={14} />}
          >
            Browse fabrics
          </ButtonLink>
        }
      />
      <Container className="py-8">
        <div className="overflow-x-auto rounded-md border border-rule-2 bg-paper-raised">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Comparison of selected fabrics
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-10 w-40 border-r border-b border-rule-2 bg-paper-sunk px-3 py-3 font-mono text-label tracking-[0.09em] text-ink-3 uppercase"
                >
                  Attribute
                </th>
                {fabrics.map((fabric) => (
                  <th
                    key={fabric.id}
                    scope="col"
                    className="min-w-56 border-b border-rule-2 bg-paper-sunk px-3 py-3 align-top"
                  >
                    <Link
                      href={`/fabrics/${fabric.slug}/`}
                      className="block text-sm font-semibold text-ink hover:text-indigo"
                    >
                      {fabric.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const differs = new Set(row.values).size > 1;
                return (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className={cn(
                        "sticky left-0 z-10 border-r border-b border-rule px-3 py-2.5 align-top",
                        differs ? "bg-indigo-soft" : "bg-paper-raised",
                      )}
                    >
                      <span className="font-mono text-label tracking-[0.09em] text-ink-3 uppercase">
                        {row.label}
                      </span>
                    </th>
                    {row.values.map((value, index) => (
                      <td
                        key={`${row.label}-${index}`}
                        className={cn(
                          "border-b border-rule px-3 py-2.5 align-top text-sm",
                          differs ? "bg-indigo-wash/45 text-ink" : "text-ink-2",
                        )}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </>
  );
}
