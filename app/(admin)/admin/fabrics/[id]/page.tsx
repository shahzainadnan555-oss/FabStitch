import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import { WorkspaceSection } from "@/components/marketplace/workspace-blocks";
import { Panel } from "@/components/ui/layout";
import { AdminActionForm } from "@/features/admin/action-form";
import {
  changeFabricPublication,
  updateFabric,
} from "@/features/admin/actions";
import { getAdminFabric } from "@/features/admin/api";
import {
  DateTime,
  DefinitionGrid,
  StatusBadge,
} from "@/features/admin/components";

export const metadata: Metadata = { title: "Edit fabric" };

const inputClass =
  "mt-1.5 h-10 w-full rounded-sm border border-border bg-paper px-3 text-sm";
const textareaClass =
  "mt-1.5 min-h-28 w-full rounded-sm border border-border bg-paper px-3 py-2 text-sm";
const labelClass = "block font-mono text-label uppercase text-ink-3";

export default async function AdminFabricDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fabric = await getAdminFabric(id);

  return (
    <>
      <WorkspaceHeader
        title={fabric.name}
        description="Edit supported catalog fields and submit publication transitions to the backend."
      />
      <WorkspaceSection title="Record">
        <DefinitionGrid
          items={[
            { label: "Status", value: <StatusBadge status={fabric.status} /> },
            { label: "Slug", value: fabric.slug },
            { label: "Family", value: fabric.family_code },
            { label: "Identity slug", value: fabric.identity_slug },
            {
              label: "Published",
              value: <DateTime value={fabric.published_at} />,
            },
            {
              label: "Updated",
              value: <DateTime value={fabric.updated_at} />,
            },
          ]}
        />
      </WorkspaceSection>

      <WorkspaceSection title="Editable fields">
        <Panel className="max-w-4xl p-5">
          <AdminActionForm
            action={updateFabric.bind(null, fabric.id)}
            submitLabel="Save changes"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Name
                <input
                  name="name"
                  defaultValue={fabric.name}
                  required
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Slug
                <input
                  name="slug"
                  defaultValue={fabric.slug}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Weight class
                <input name="weight_class" className={inputClass} />
              </label>
              <label className="flex items-center gap-2 self-end pb-3 text-sm text-ink-2">
                <input
                  type="checkbox"
                  name="is_featured"
                  defaultChecked={fabric.is_featured}
                />
                Featured in catalog
              </label>
            </div>
            <label className={labelClass}>
              Summary
              <textarea
                name="summary"
                defaultValue={fabric.summary ?? ""}
                className={textareaClass}
              />
            </label>
            <label className={labelClass}>
              Description
              <textarea
                name="description"
                defaultValue={fabric.description ?? ""}
                className={textareaClass}
              />
            </label>
          </AdminActionForm>
        </Panel>
      </WorkspaceSection>

      <WorkspaceSection
        title="Publication"
        description="Publication is explicit and separate from editing. The backend owns eligibility and final state."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {(["publish", "unpublish", "archive"] as const).map((operation) => (
            <Panel
              key={operation}
              className={
                operation === "archive" ? "border-alert/25 p-4" : "p-4"
              }
            >
              <h3 className="mb-2 font-semibold capitalize text-ink">
                {operation}
              </h3>
              <AdminActionForm
                action={changeFabricPublication.bind(
                  null,
                  fabric.id,
                  operation,
                )}
                submitLabel={`${operation[0].toUpperCase()}${operation.slice(1)}`}
                danger={operation === "archive"}
              />
            </Panel>
          ))}
        </div>
      </WorkspaceSection>
    </>
  );
}
