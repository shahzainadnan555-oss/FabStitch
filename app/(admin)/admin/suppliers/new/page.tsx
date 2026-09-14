import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import { WorkspaceSection } from "@/components/marketplace/workspace-blocks";
import { Panel } from "@/components/ui/layout";
import { AdminActionForm } from "@/features/admin/action-form";
import { createSupplier } from "@/features/admin/actions";

export const metadata: Metadata = { title: "Create supplier prospect" };

const inputClass =
  "mt-1.5 h-10 w-full rounded-sm border border-border bg-paper px-3 text-sm";
const labelClass = "block font-mono text-label uppercase text-ink-3";

export default function NewAdminSupplierPage() {
  return (
    <>
      <WorkspaceHeader
        title="Create supplier prospect"
        description="Private supplier records never appear in public responses; only the catalog verification boolean may be public."
      />
      <WorkspaceSection title="Supplier identity">
        <Panel className="max-w-3xl p-5">
          <AdminActionForm
            action={createSupplier}
            submitLabel="Create prospect"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Legal name
                <input name="legal_name" required className={inputClass} />
              </label>
              <label className={labelClass}>
                Display name
                <input name="display_name" className={inputClass} />
              </label>
              <label className={labelClass}>
                Country code
                <input
                  name="country_code"
                  maxLength={2}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Business type
                <input name="business_type" className={inputClass} />
              </label>
              <label className={labelClass}>
                Website
                <input type="url" name="website" className={inputClass} />
              </label>
            </div>
            <fieldset className="grid gap-4 border-t border-rule pt-4 sm:grid-cols-2">
              <legend className="mb-3 font-semibold text-ink">
                Primary contact
              </legend>
              <label className={labelClass}>
                Contact name
                <input name="contact_name" className={inputClass} />
              </label>
              <label className={labelClass}>
                Contact email
                <input
                  type="email"
                  name="contact_email"
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Contact phone
                <input name="contact_phone" className={inputClass} />
              </label>
            </fieldset>
          </AdminActionForm>
        </Panel>
      </WorkspaceSection>
    </>
  );
}
