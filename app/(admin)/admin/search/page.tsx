import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import {
  DataTable,
  WorkspaceSection,
} from "@/components/marketplace/workspace-blocks";
import { Button } from "@/components/ui/button";
import { getAdminSearch } from "@/features/admin/api";
import { AdminRecordLink } from "@/features/admin/components";

export const metadata: Metadata = { title: "Admin search" };

function recordHref(entityType: string, id: string) {
  const type = entityType.toLowerCase();
  if (type.includes("order")) return `/admin/orders/${id}`;
  if (type.includes("customer")) return `/admin/customers/${id}`;
  if (type.includes("fabric") || type.includes("listing"))
    return `/admin/fabrics/${id}`;
  if (type.includes("supplier")) return `/admin/suppliers/${id}`;
  if (type.includes("inquiry")) return `/admin/inquiries/${id}`;
  return null;
}

export default async function AdminSearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const q = rawQuery?.trim() ?? "";
  const results = q ? await getAdminSearch(q) : null;

  return (
    <>
      <WorkspaceHeader
        title="Admin search"
        description="Cross-entity search across records exposed by the protected admin API."
      />
      <WorkspaceSection title="Find a record">
        <form method="get" className="mb-5 flex max-w-3xl gap-3">
          <input
            aria-label="Admin search query"
            name="q"
            defaultValue={q}
            required
            placeholder="Order, customer, fabric, supplier or inquiry"
            className="h-10 min-w-0 flex-1 rounded-sm border border-border bg-paper px-3 text-sm"
          />
          <Button type="submit">Search</Button>
        </form>
        <DataTable
          columns={["Type", "Record", "Metadata"]}
          rows={(results?.items ?? []).map((hit) => {
            const href = recordHref(hit.entity_type, hit.id);
            return [
              hit.entity_type.replaceAll("_", " "),
              href ? (
                <AdminRecordLink key="record" href={href}>
                  {hit.label}
                </AdminRecordLink>
              ) : (
                hit.label
              ),
              hit.meta && Object.keys(hit.meta).length
                ? JSON.stringify(hit.meta)
                : "—",
            ];
          })}
          empty={{
            title: q ? "No records matched" : "Enter a search",
            body: q
              ? `The admin search API returned no results for “${q}”.`
              : "Search uses the backend cross-entity index and does not expose results publicly.",
          }}
        />
      </WorkspaceSection>
    </>
  );
}
