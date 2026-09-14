import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import { WorkspaceSection } from "@/components/marketplace/workspace-blocks";
import { Panel } from "@/components/ui/layout";
import { AdminActionForm } from "@/features/admin/action-form";
import { createFabric } from "@/features/admin/actions";

export const metadata: Metadata = { title: "Create fabric" };

const inputClass =
  "mt-1.5 h-10 w-full rounded-sm border border-border bg-paper px-3 text-sm";
const textareaClass =
  "mt-1.5 min-h-28 w-full rounded-sm border border-border bg-paper px-3 py-2 text-sm";
const labelClass = "block font-mono text-label uppercase text-ink-3";

export default function NewAdminFabricPage() {
  return (
    <>
      <WorkspaceHeader
        title="Create fabric"
        description="New records default to a non-public draft. Publication remains a separate controlled action."
      />
      <WorkspaceSection title="Listing identity">
        <Panel className="max-w-3xl p-5">
          <AdminActionForm
            action={createFabric}
            submitLabel="Create draft fabric"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Name
                <input name="name" required className={inputClass} />
              </label>
              <label className={labelClass}>
                Slug
                <input name="slug" className={inputClass} />
              </label>
              <label className={labelClass}>
                Family code
                <input name="family_code" required className={inputClass} />
              </label>
              <label className={labelClass}>
                Initial status
                <select
                  name="status"
                  defaultValue="draft"
                  className={inputClass}
                >
                  <option value="draft">Draft</option>
                </select>
              </label>
            </div>
            <label className={labelClass}>
              Summary
              <textarea name="summary" className={textareaClass} />
            </label>
            <label className={labelClass}>
              Description
              <textarea name="description" className={textareaClass} />
            </label>
          </AdminActionForm>
        </Panel>
      </WorkspaceSection>
    </>
  );
}
