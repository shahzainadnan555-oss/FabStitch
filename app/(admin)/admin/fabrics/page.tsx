import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import {
  DataTable,
  WorkspaceSection,
} from "@/components/marketplace/workspace-blocks";
import { Button, ButtonLink } from "@/components/ui/button";
import { getAdminFabrics } from "@/features/admin/api";
import {
  AdminPager,
  AdminRecordLink,
  DateTime,
  StatusBadge,
} from "@/features/admin/components";

export const metadata: Metadata = { title: "Admin fabrics" };

type Query = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminFabricsPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const q = one(query.q);
  const status = one(query.status);
  const family = one(query.family);
  const currentOffset = Math.max(0, Number(one(query.offset)) || 0);
  const fabrics = await getAdminFabrics({
    limit: 50,
    offset: currentOffset,
    q,
    status,
    family,
  });

  return (
    <>
      <WorkspaceHeader
        title="Fabrics"
        description="Create, edit and control publication of authoritative catalog listings."
        action={
          <ButtonLink href="/admin/fabrics/new" variant="primary">
            New fabric
          </ButtonLink>
        }
      />
      <WorkspaceSection title="Catalog register">
        <form
          method="get"
          className="mb-4 grid gap-3 rounded-md border border-rule-2 bg-paper-raised p-4 md:grid-cols-4"
        >
          <input
            aria-label="Search fabrics"
            name="q"
            defaultValue={q}
            placeholder="Name or slug"
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm"
          />
          <input
            aria-label="Fabric status"
            name="status"
            defaultValue={status}
            placeholder="Status"
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm"
          />
          <input
            aria-label="Fabric family"
            name="family"
            defaultValue={family}
            placeholder="Family code"
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm"
          />
          <Button type="submit">Apply filters</Button>
        </form>
        <DataTable
          columns={[
            "Fabric",
            "Family",
            "Status",
            "Featured",
            "Published",
            "Updated",
          ]}
          rows={fabrics.items.map((fabric) => [
            <AdminRecordLink key="fabric" href={`/admin/fabrics/${fabric.id}`}>
              {fabric.name}
              <span className="block text-xs font-normal text-ink-4">
                {fabric.slug}
              </span>
            </AdminRecordLink>,
            fabric.family_code || "—",
            <StatusBadge key="status" status={fabric.status} />,
            fabric.is_featured ? "Yes" : "No",
            <DateTime key="published" value={fabric.published_at} />,
            <DateTime key="updated" value={fabric.updated_at} />,
          ])}
          empty={{
            title: "No fabrics matched",
            body: "No authoritative fabric records matched the current filters.",
            cta: { label: "Create fabric", href: "/admin/fabrics/new" },
          }}
        />
        <AdminPager
          path="/admin/fabrics"
          total={fabrics.total}
          limit={fabrics.limit}
          offset={fabrics.offset}
          query={{ q, status, family }}
        />
      </WorkspaceSection>
    </>
  );
}
