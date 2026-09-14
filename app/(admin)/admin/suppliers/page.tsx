import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import {
  DataTable,
  WorkspaceSection,
} from "@/components/marketplace/workspace-blocks";
import { Button, ButtonLink } from "@/components/ui/button";
import { getAdminSuppliers } from "@/features/admin/api";
import {
  AdminPager,
  AdminRecordLink,
  DateTime,
  StatusBadge,
} from "@/features/admin/components";

export const metadata: Metadata = { title: "Admin suppliers" };

type Query = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminSuppliersPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const q = one(query.q);
  const status = one(query.status);
  const verificationStatus = one(query.verification_status);
  const countryCode = one(query.country_code);
  const currentOffset = Math.max(0, Number(one(query.offset)) || 0);
  const suppliers = await getAdminSuppliers({
    limit: 50,
    offset: currentOffset,
    q,
    status,
    verification_status: verificationStatus,
    country_code: countryCode,
  });

  return (
    <>
      <WorkspaceHeader
        title="Suppliers"
        description="Private supply-partner records and FabStitch verification controls."
        action={
          <ButtonLink href="/admin/suppliers/new" variant="primary">
            New prospect
          </ButtonLink>
        }
      />
      <WorkspaceSection title="Supplier register">
        <form
          method="get"
          className="mb-4 grid gap-3 rounded-md border border-rule-2 bg-paper-raised p-4 md:grid-cols-6"
        >
          <input
            aria-label="Search suppliers"
            name="q"
            defaultValue={q}
            placeholder="Name or business"
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm md:col-span-2"
          />
          <input
            aria-label="Supplier status"
            name="status"
            defaultValue={status}
            placeholder="Supplier status"
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm"
          />
          <input
            aria-label="Verification status"
            name="verification_status"
            defaultValue={verificationStatus}
            placeholder="Verification status"
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm"
          />
          <input
            aria-label="Country code"
            name="country_code"
            defaultValue={countryCode}
            placeholder="Country"
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm"
          />
          <Button type="submit">Apply filters</Button>
        </form>
        <DataTable
          columns={[
            "Supplier",
            "Country",
            "Business type",
            "Supplier status",
            "Verification",
            "Expires",
            "Updated",
          ]}
          rows={suppliers.items.map((supplier) => [
            <AdminRecordLink
              key="supplier"
              href={`/admin/suppliers/${supplier.id}`}
            >
              {supplier.display_name}
              {supplier.display_name !== supplier.legal_name ? (
                <span className="block text-xs font-normal text-ink-4">
                  {supplier.legal_name}
                </span>
              ) : null}
            </AdminRecordLink>,
            supplier.country_code || "—",
            supplier.business_type || "—",
            <StatusBadge key="status" status={supplier.status} />,
            <StatusBadge
              key="verification"
              status={supplier.verification_status}
            />,
            <DateTime key="expires" value={supplier.verification_expires_at} />,
            <DateTime key="updated" value={supplier.updated_at} />,
          ])}
          empty={{
            title: "No suppliers matched",
            body: "No private supplier records matched the current filters.",
            cta: { label: "Create prospect", href: "/admin/suppliers/new" },
          }}
        />
        <AdminPager
          path="/admin/suppliers"
          total={suppliers.total}
          limit={suppliers.limit}
          offset={suppliers.offset}
          query={{
            q,
            status,
            verification_status: verificationStatus,
            country_code: countryCode,
          }}
        />
      </WorkspaceSection>
    </>
  );
}
