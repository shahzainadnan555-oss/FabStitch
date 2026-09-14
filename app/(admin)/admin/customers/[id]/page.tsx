import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import { WorkspaceSection } from "@/components/marketplace/workspace-blocks";
import { Panel } from "@/components/ui/layout";
import { AdminActionForm } from "@/features/admin/action-form";
import { changeCustomerStatus } from "@/features/admin/actions";
import { getAdminCustomer, getAdminInquiries } from "@/features/admin/api";
import {
  AdminRecordLink,
  DateTime,
  DefinitionGrid,
  StatusBadge,
} from "@/features/admin/components";
import { DataTable } from "@/components/marketplace/workspace-blocks";
import { isCountryCode, marketForCountry } from "@/features/preferences/market";

export const metadata: Metadata = { title: "Admin customer detail" };

const inputClass =
  "mt-1.5 h-10 w-full rounded-sm border border-border bg-paper px-3 text-sm";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getAdminCustomer(id);
  const inquiries = await getAdminInquiries({
    q: customer.email,
    limit: 20,
    offset: 0,
  });
  const country =
    customer.country && isCountryCode(customer.country)
      ? marketForCountry(customer.country).countryName
      : customer.country || "—";

  return (
    <>
      <WorkspaceHeader
        title={customer.full_name || customer.email}
        description="Private customer account detail. This route is rendered only behind the admin session probe."
      />
      <WorkspaceSection title="Account">
        <DefinitionGrid
          items={[
            { label: "Email", value: customer.email },
            {
              label: "Email verified",
              value: customer.email_verified ? "Yes" : "No",
            },
            {
              label: "Status",
              value: <StatusBadge status={customer.status} />,
            },
            { label: "Role", value: customer.role },
            { label: "Phone", value: customer.phone || "—" },
            { label: "Country", value: country },
            { label: "Currency", value: customer.currency || "—" },
            {
              label: "Onboarding",
              value: customer.onboarding_completed ? "Completed" : "Incomplete",
            },
            { label: "Orders", value: customer.order_count },
            {
              label: "Orders · 30d",
              value: customer.recent_order_count_30d,
            },
            {
              label: "Last login",
              value: <DateTime value={customer.last_login_at} />,
            },
            {
              label: "Created",
              value: <DateTime value={customer.created_at} />,
            },
          ]}
        />
      </WorkspaceSection>

      <WorkspaceSection
        title="Inquiry history"
        description="Inquiries associated with this customer email on the admin inquiry API."
      >
        <DataTable
          columns={["Inquiry", "Fabric", "Quantity", "Status", "Submitted"]}
          rows={inquiries.items
            .filter((inquiry) => inquiry.customer_id === customer.id)
            .map((inquiry) => [
              <AdminRecordLink
                key="inquiry"
                href={`/admin/inquiries/${inquiry.id}`}
              >
                {inquiry.inquiry_number}
              </AdminRecordLink>,
              inquiry.fabric.name,
              `${inquiry.quantity} ${inquiry.quantity_unit}`,
              <StatusBadge key="status" status={inquiry.status} />,
              <DateTime key="created" value={inquiry.created_at} />,
            ])}
          empty={{
            title: "No inquiries",
            body: "This customer has no recorded fabric inquiries.",
          }}
        />
      </WorkspaceSection>

      <WorkspaceSection
        title="Account actions"
        description="Every action is re-authorized server-side and recorded by the backend audit log."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {(["suspend", "disable", "reactivate"] as const).map((operation) => (
            <Panel
              key={operation}
              className={
                operation === "reactivate" ? "p-4" : "border-alert/25 p-4"
              }
            >
              <h3 className="font-semibold capitalize text-ink">{operation}</h3>
              <p className="mt-1 mb-3 text-xs text-ink-3">
                {operation === "reactivate"
                  ? "Return an eligible account to active status."
                  : `${operation[0].toUpperCase()}${operation.slice(1)} access through the controlled account endpoint.`}
              </p>
              <AdminActionForm
                action={changeCustomerStatus.bind(null, customer.id, operation)}
                submitLabel={`${operation[0].toUpperCase()}${operation.slice(1)} customer`}
                danger={operation !== "reactivate"}
              >
                <label className="block font-mono text-label uppercase text-ink-3">
                  Reason
                  <input name="reason" className={inputClass} />
                </label>
              </AdminActionForm>
            </Panel>
          ))}
        </div>
      </WorkspaceSection>
    </>
  );
}
