import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import {
  DataTable,
  WorkspaceSection,
} from "@/components/marketplace/workspace-blocks";
import { Button } from "@/components/ui/button";
import { getAdminInquiries } from "@/features/admin/api";
import { loadInquiryCustomers } from "@/features/admin/inquiry-customers";
import {
  AdminPager,
  AdminRecordLink,
  DateTime,
  StatusBadge,
} from "@/features/admin/components";
import { isCountryCode, marketForCountry } from "@/features/preferences/market";

export const metadata: Metadata = { title: "Admin inquiries" };

type Query = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const STATUSES = ["NEW", "CONTACTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

function countryLabel(code?: string | null) {
  if (!code) return "—";
  return isCountryCode(code) ? marketForCountry(code).countryName : code;
}

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const q = one(query.q);
  const status = one(query.status);
  const createdFrom = one(query.created_from);
  const createdTo = one(query.created_to);
  const currentOffset = Math.max(0, Number(one(query.offset)) || 0);
  const inquiries = await getAdminInquiries({
    limit: 50,
    offset: currentOffset,
    q,
    status,
    created_from: createdFrom,
    created_to: createdTo,
  });
  const customers = await loadInquiryCustomers(
    inquiries.items.map((inquiry) => inquiry.customer_id),
  );

  return (
    <>
      <WorkspaceHeader
        title="Inquiries"
        description="Customer fabric inquiries, linked to the authenticated customer account."
      />
      <WorkspaceSection title="Inquiry register">
        <form
          method="get"
          className="mb-4 grid gap-3 rounded-md border border-rule-2 bg-paper-raised p-4 md:grid-cols-6"
        >
          <input
            aria-label="Search inquiries"
            name="q"
            defaultValue={q}
            placeholder="Inquiry, customer, fabric"
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm md:col-span-2"
          />
          <select
            aria-label="Inquiry status"
            name="status"
            defaultValue={status ?? ""}
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm"
          >
            <option value="">All statuses</option>
            {STATUSES.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <input
            aria-label="Created from"
            type="date"
            name="created_from"
            defaultValue={createdFrom}
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm"
          />
          <input
            aria-label="Created to"
            type="date"
            name="created_to"
            defaultValue={createdTo}
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm"
          />
          <Button type="submit">Apply filters</Button>
        </form>
        <DataTable
          columns={[
            "Inquiry",
            "Customer",
            "Fabric",
            "Quantity",
            "Country",
            "Phone",
            "Email",
            "Status",
            "Submitted",
          ]}
          rows={inquiries.items.map((inquiry) => {
            const customer = customers.get(inquiry.customer_id);
            return [
              <AdminRecordLink
                key="inquiry"
                href={`/admin/inquiries/${inquiry.id}`}
              >
                {inquiry.inquiry_number}
              </AdminRecordLink>,
              customer ? (
                <AdminRecordLink
                  key="customer"
                  href={`/admin/customers/${customer.id}`}
                >
                  {customer.full_name || inquiry.customer_email}
                </AdminRecordLink>
              ) : (
                inquiry.customer_email
              ),
              inquiry.fabric.name,
              <span key="quantity" className="font-mono tabular-nums">
                {inquiry.quantity} {inquiry.quantity_unit}
              </span>,
              countryLabel(customer?.country),
              customer?.phone || "—",
              inquiry.customer_email,
              <StatusBadge key="status" status={inquiry.status} />,
              <DateTime key="created" value={inquiry.created_at} />,
            ];
          })}
          empty={{
            title: "No inquiries matched",
            body: "No authoritative inquiry records matched the current filters.",
          }}
        />
        <AdminPager
          path="/admin/inquiries"
          total={inquiries.total}
          limit={inquiries.limit}
          offset={inquiries.offset}
          query={{
            q,
            status,
            created_from: createdFrom,
            created_to: createdTo,
          }}
        />
      </WorkspaceSection>
    </>
  );
}
