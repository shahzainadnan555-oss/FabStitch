import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import {
  DataTable,
  WorkspaceSection,
} from "@/components/marketplace/workspace-blocks";
import { getAdminAudit } from "@/features/admin/api";
import { AdminPager, DateTime } from "@/features/admin/components";

export const metadata: Metadata = { title: "Admin audit log" };

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const rawOffset = Array.isArray(query.offset)
    ? query.offset[0]
    : query.offset;
  const currentOffset = Math.max(0, Number(rawOffset) || 0);
  const audit = await getAdminAudit(50, currentOffset);

  return (
    <>
      <WorkspaceHeader
        title="Audit log"
        description="Backend-recorded administrative actions. Entries are read-only in this control plane."
      />
      <WorkspaceSection title="Administrative events">
        <DataTable
          columns={["When", "Action", "Target", "Actor", "Reason"]}
          rows={audit.items.map((event) => [
            <DateTime key="when" value={event.created_at} />,
            event.action,
            [event.target_type, event.target_id].filter(Boolean).join(" · ") ||
              "—",
            event.actor_user_id || "System",
            event.reason || "—",
          ])}
          empty={{
            title: "No audit entries",
            body: "The admin audit API returned no recorded actions.",
          }}
        />
        <AdminPager
          path="/admin/audit"
          total={audit.total}
          limit={audit.limit}
          offset={audit.offset}
        />
      </WorkspaceSection>
    </>
  );
}
