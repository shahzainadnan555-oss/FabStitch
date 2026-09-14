import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import { WorkspaceSection } from "@/components/marketplace/workspace-blocks";
import { Panel } from "@/components/ui/layout";
import { AdminActionForm } from "@/features/admin/action-form";
import { updateInquiryStatus } from "@/features/admin/actions";
import { getAdminInquiry } from "@/features/admin/api";
import { loadInquiryCustomers } from "@/features/admin/inquiry-customers";
import {
  AdminRecordLink,
  DateTime,
  DefinitionGrid,
  StatusBadge,
} from "@/features/admin/components";
import { isCountryCode, marketForCountry } from "@/features/preferences/market";

export const metadata: Metadata = { title: "Admin inquiry detail" };

const NEXT_STATUSES: Record<string, string[]> = {
  NEW: ["CONTACTED", "IN_PROGRESS", "CANCELLED"],
  CONTACTED: ["IN_PROGRESS", "COMPLETED", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

function countryLabel(code?: string | null) {
  if (!code) return "—";
  return isCountryCode(code) ? marketForCountry(code).countryName : code;
}

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await getAdminInquiry(id);
  const customers = await loadInquiryCustomers([inquiry.customer_id]);
  const customer = customers.get(inquiry.customer_id);
  const nextStatuses = NEXT_STATUSES[inquiry.status] ?? [
    "CONTACTED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ];

  return (
    <>
      <WorkspaceHeader
        title={inquiry.inquiry_number}
        description="Private inquiry detail. Customer contact comes from the customer account, not from invented inquiry fields."
      />

      <WorkspaceSection title="Inquiry">
        <DefinitionGrid
          items={[
            { label: "Inquiry number", value: inquiry.inquiry_number },
            { label: "Status", value: <StatusBadge status={inquiry.status} /> },
            {
              label: "Submitted",
              value: <DateTime value={inquiry.created_at} />,
            },
          ]}
        />
      </WorkspaceSection>

      <WorkspaceSection title="Customer">
        <DefinitionGrid
          items={[
            {
              label: "Customer name",
              value: customer?.full_name || "—",
            },
            { label: "Customer email", value: inquiry.customer_email },
            {
              label: "Customer country",
              value: countryLabel(customer?.country),
            },
            { label: "Customer phone", value: customer?.phone || "—" },
            {
              label: "Customer record",
              value: (
                <AdminRecordLink
                  href={`/admin/customers/${inquiry.customer_id}`}
                >
                  Open customer
                </AdminRecordLink>
              ),
            },
          ]}
        />
      </WorkspaceSection>

      <WorkspaceSection title="Inquiry details">
        <DefinitionGrid
          items={[
            { label: "Fabric", value: inquiry.fabric.name },
            {
              label: "Variant",
              value: inquiry.fabric.variant_id || "—",
            },
            { label: "Quantity", value: inquiry.quantity },
            { label: "Quantity unit", value: inquiry.quantity_unit },
            {
              label: "Updated",
              value: <DateTime value={inquiry.updated_at} />,
            },
          ]}
        />
        {inquiry.customer_note ? (
          <Panel className="mt-4 p-4">
            <h3 className="font-mono text-label uppercase text-ink-3">
              Customer note
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-sm text-ink-2">
              {inquiry.customer_note}
            </p>
          </Panel>
        ) : null}
      </WorkspaceSection>

      {nextStatuses.length ? (
        <WorkspaceSection
          title="Update handling status"
          description="The backend rejects transitions that are not valid from the current state."
        >
          <Panel className="max-w-xl p-5">
            <AdminActionForm
              action={updateInquiryStatus.bind(null, inquiry.id)}
              submitLabel="Update inquiry"
            >
              <label className="block font-mono text-label uppercase text-ink-3">
                New status
                <select
                  name="status"
                  defaultValue={nextStatuses[0]}
                  className="mt-1.5 h-10 w-full rounded-sm border border-border bg-paper px-3 text-sm"
                >
                  {nextStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block font-mono text-label uppercase text-ink-3">
                Internal note
                <textarea
                  name="note"
                  className="mt-1.5 min-h-28 w-full rounded-sm border border-border bg-paper px-3 py-2 text-sm"
                />
              </label>
            </AdminActionForm>
          </Panel>
        </WorkspaceSection>
      ) : null}
    </>
  );
}
