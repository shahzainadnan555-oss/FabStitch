import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import { WorkspaceSection } from "@/components/marketplace/workspace-blocks";
import { Alert } from "@/components/ui/state";
import { Panel } from "@/components/ui/layout";
import { AdminActionForm } from "@/features/admin/action-form";
import {
  changeSupplierStatus,
  reviewSupplierVerification,
  submitSupplierVerification,
} from "@/features/admin/actions";
import { getAdminSupplier, getAdminVerification } from "@/features/admin/api";
import {
  DateTime,
  DefinitionGrid,
  StatusBadge,
} from "@/features/admin/components";

export const metadata: Metadata = { title: "Admin supplier detail" };

const inputClass =
  "mt-1.5 h-10 w-full rounded-sm border border-border bg-paper px-3 text-sm";
const textareaClass =
  "mt-1.5 min-h-24 w-full rounded-sm border border-border bg-paper px-3 py-2 text-sm";
const labelClass = "block font-mono text-label uppercase text-ink-3";

export default async function AdminSupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [supplier, verification] = await Promise.all([
    getAdminSupplier(id),
    getAdminVerification(id),
  ]);

  return (
    <>
      <WorkspaceHeader
        title={supplier.display_name}
        description="Private supplier identity, contacts and FabStitch verification. Never rendered outside the protected admin route family."
      />
      <WorkspaceSection title="Supplier record">
        <DefinitionGrid
          items={[
            { label: "Legal name", value: supplier.legal_name },
            {
              label: "Supplier status",
              value: <StatusBadge status={supplier.status} />,
            },
            {
              label: "Verification",
              value: <StatusBadge status={supplier.verification_status} />,
            },
            { label: "Country", value: supplier.country_code || "—" },
            { label: "Business type", value: supplier.business_type || "—" },
            {
              label: "Verification expires",
              value: <DateTime value={supplier.verification_expires_at} />,
            },
          ]}
        />
      </WorkspaceSection>

      <WorkspaceSection title="Private contacts">
        {supplier.contacts?.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {supplier.contacts.map((contact) => (
              <Panel key={contact.id} className="p-4">
                <p className="font-semibold text-ink">
                  {contact.contact_name || "Unnamed contact"}
                </p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="text-xs text-ink-4">Email</dt>
                    <dd>{contact.email || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-4">Phone</dt>
                    <dd>{contact.phone || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-4">Address</dt>
                    <dd>
                      {[
                        contact.address_line1,
                        contact.city,
                        contact.region,
                        contact.postal_code,
                        contact.country_code,
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </dd>
                  </div>
                </dl>
              </Panel>
            ))}
          </div>
        ) : (
          <Alert tone="neutral">No contact records returned by the API.</Alert>
        )}
      </WorkspaceSection>

      <WorkspaceSection
        title="FabStitch verification"
        description="This review is separate from third-party product certifications."
      >
        {verification ? (
          <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
            <DefinitionGrid
              items={[
                {
                  label: "Packet status",
                  value: <StatusBadge status={verification.status} />,
                },
                { label: "Version", value: verification.version },
                {
                  label: "Submitted",
                  value: <DateTime value={verification.submitted_at} />,
                },
                {
                  label: "Reviewed",
                  value: <DateTime value={verification.reviewed_at} />,
                },
                {
                  label: "Expires",
                  value: <DateTime value={verification.expires_at} />,
                },
                {
                  label: "Rejection reason",
                  value: verification.rejection_reason || "—",
                },
              ]}
            />
            <Panel className="p-4">
              <h3 className="mb-3 font-semibold text-ink">Review packet</h3>
              <AdminActionForm
                action={reviewSupplierVerification.bind(null, supplier.id)}
                submitLabel="Submit review"
              >
                <label className={labelClass}>
                  Action
                  <select name="action" className={inputClass}>
                    <option value="approve">Approve</option>
                    <option value="reject">Reject</option>
                    <option value="expire">Expire</option>
                  </select>
                </label>
                <label className={labelClass}>
                  Expires at
                  <input
                    type="text"
                    name="expires_at"
                    defaultValue={verification.expires_at ?? ""}
                    placeholder="ISO 8601 timestamp"
                    className={inputClass}
                  />
                </label>
                <label className={labelClass}>
                  Rejection reason
                  <textarea name="rejection_reason" className={textareaClass} />
                </label>
                <label className={labelClass}>
                  Internal notes
                  <textarea
                    name="internal_notes"
                    defaultValue={verification.internal_notes ?? ""}
                    className={textareaClass}
                  />
                </label>
              </AdminActionForm>
            </Panel>
          </div>
        ) : (
          <Panel className="max-w-xl p-4">
            <h3 className="mb-1 font-semibold text-ink">
              Start verification packet
            </h3>
            <p className="mb-3 text-xs text-ink-3">
              No verification packet was returned for this supplier.
            </p>
            <AdminActionForm
              action={submitSupplierVerification.bind(null, supplier.id)}
              submitLabel="Submit packet"
            >
              <label className={labelClass}>
                Internal notes
                <textarea name="internal_notes" className={textareaClass} />
              </label>
            </AdminActionForm>
          </Panel>
        )}
      </WorkspaceSection>

      <WorkspaceSection title="Supplier access">
        <div className="grid gap-4 sm:grid-cols-2">
          {(["suspend", "reactivate"] as const).map((operation) => (
            <Panel
              key={operation}
              className={
                operation === "suspend" ? "border-alert/25 p-4" : "p-4"
              }
            >
              <h3 className="mb-3 font-semibold capitalize text-ink">
                {operation}
              </h3>
              <AdminActionForm
                action={changeSupplierStatus.bind(null, supplier.id, operation)}
                submitLabel={`${operation[0].toUpperCase()}${operation.slice(1)} supplier`}
                danger={operation === "suspend"}
              >
                {operation === "suspend" ? (
                  <label className={labelClass}>
                    Reason
                    <input name="reason" className={inputClass} />
                  </label>
                ) : null}
              </AdminActionForm>
            </Panel>
          ))}
        </div>
      </WorkspaceSection>
    </>
  );
}
