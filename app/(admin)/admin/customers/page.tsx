import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import {
  DataTable,
  WorkspaceSection,
} from "@/components/marketplace/workspace-blocks";
import { Button } from "@/components/ui/button";
import { getAdminCustomers } from "@/features/admin/api";
import {
  AdminPager,
  AdminRecordLink,
  DateTime,
  StatusBadge,
} from "@/features/admin/components";

export const metadata: Metadata = { title: "Admin customers" };

type Query = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const q = one(query.q);
  const status = one(query.status);
  const country = one(query.country);
  const currentOffset = Math.max(0, Number(one(query.offset)) || 0);
  const customers = await getAdminCustomers({
    limit: 50,
    offset: currentOffset,
    q,
    status,
    country,
  });

  return (
    <>
      <WorkspaceHeader
        title="Customers"
        description="Customer account state and activity, with audited suspension, disable and reactivation actions."
      />
      <WorkspaceSection title="Customer register">
        <form
          method="get"
          className="mb-4 grid gap-3 rounded-md border border-rule-2 bg-paper-raised p-4 md:grid-cols-4"
        >
          <input
            aria-label="Search customers"
            name="q"
            defaultValue={q}
            placeholder="Name or email"
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm"
          />
          <input
            aria-label="Customer status"
            name="status"
            defaultValue={status}
            placeholder="Status"
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm"
          />
          <input
            aria-label="Country"
            name="country"
            defaultValue={country}
            placeholder="Country code"
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm"
          />
          <Button type="submit">Apply filters</Button>
        </form>
        <DataTable
          columns={[
            "Customer",
            "Status",
            "Role",
            "Country",
            "Onboarded",
            "Orders",
            "Created",
          ]}
          rows={customers.items.map((customer) => [
            <AdminRecordLink
              key="customer"
              href={`/admin/customers/${customer.id}`}
            >
              {customer.full_name || customer.email}
              {customer.full_name ? (
                <span className="block text-xs font-normal text-ink-4">
                  {customer.email}
                </span>
              ) : null}
            </AdminRecordLink>,
            <StatusBadge key="status" status={customer.status} />,
            customer.role,
            customer.country || "—",
            customer.onboarding_completed ? "Yes" : "No",
            customer.order_count,
            <DateTime key="created" value={customer.created_at} />,
          ])}
          empty={{
            title: "No customers matched",
            body: "No customer records matched the current filters.",
          }}
        />
        <AdminPager
          path="/admin/customers"
          total={customers.total}
          limit={customers.limit}
          offset={customers.offset}
          query={{ q, status, country }}
        />
      </WorkspaceSection>
    </>
  );
}
