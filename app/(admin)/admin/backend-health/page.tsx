import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import { WorkspaceSection } from "@/components/marketplace/workspace-blocks";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/layout";
import { getBackendHealth } from "@/features/admin/api";

export const metadata: Metadata = { title: "Backend health" };

function display(value: unknown) {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "No response body";
  return JSON.stringify(value, null, 2);
}

export default async function BackendHealthPage() {
  const probes = await getBackendHealth();

  return (
    <>
      <WorkspaceHeader
        title="Backend health"
        description="Live backend probes and admin-only metrics. A failed probe is shown as unavailable, never replaced with a healthy default."
      />
      <WorkspaceSection title="Service probes">
        <div className="grid gap-4 lg:grid-cols-2">
          {probes.map((probe) => (
            <Panel key={probe.path} className="overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3">
                <div>
                  <h3 className="font-semibold text-ink">{probe.label}</h3>
                  <code className="text-xs text-ink-4">{probe.path}</code>
                </div>
                <Badge tone={probe.available ? "verified" : "alert"}>
                  {probe.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-xs text-ink-2">
                {probe.available ? display(probe.value) : probe.error}
              </pre>
            </Panel>
          ))}
        </div>
      </WorkspaceSection>
    </>
  );
}
