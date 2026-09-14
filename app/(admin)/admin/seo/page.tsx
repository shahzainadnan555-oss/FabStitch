import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import {
  DataTable,
  MetricRow,
  WorkspaceSection,
} from "@/components/marketplace/workspace-blocks";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/state";
import {
  AdminPager,
  AdminRecordLink,
  DateTime,
  StatusBadge,
} from "@/features/admin/components";
import {
  SeoCreatePageForm,
  SeoPageDetail,
  SeoPageEmpty,
  SeoPageLookup,
  SeoPublishingForms,
  SeoReadError,
  SeoTaxonomyForms,
} from "@/features/admin/seo-components";
import {
  adminSeoError,
  getAdminSeoAudit,
  getAdminSeoClusterAuthority,
  getAdminSeoPage,
  getAdminSeoPublishingCalendar,
  type AdminSeoError,
} from "@/features/admin/seo-api";

export const metadata: Metadata = {
  title: "SEO publication controls",
  robots: { index: false, follow: false },
};

type Query = Record<string, string | string[] | undefined>;
type LoadResult<T> =
  { data: T; error?: never } | { data?: never; error: AdminSeoError };

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function offset(value: string | undefined) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
}

async function load<T>(request: Promise<T>): Promise<LoadResult<T>> {
  try {
    return { data: await request };
  } catch (error) {
    return { error: adminSeoError(error) };
  }
}

export default async function SeoControlsPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const pageId = one(query.page_id)?.trim() || undefined;
  const from = one(query.from)?.trim() || undefined;
  const to = one(query.to)?.trim() || undefined;
  const currentOffset = offset(one(query.offset));
  const limit = 50;

  const [audit, authority, calendar, page] = await Promise.all([
    load(getAdminSeoAudit()),
    load(getAdminSeoClusterAuthority()),
    load(
      getAdminSeoPublishingCalendar({
        from,
        to,
        limit,
        offset: currentOffset,
      }),
    ),
    pageId ? load(getAdminSeoPage(pageId)) : Promise.resolve(undefined),
  ]);

  return (
    <>
      <WorkspaceHeader
        title="SEO publication controls"
        description="Backend-authoritative publication, indexability, topical authority and rollout controls."
      />

      <WorkspaceSection title="Contract coverage">
        <Alert tone="neutral">
          Every control below maps to an operation in the generated OpenAPI
          schema. The contract does not currently expose a general SEO page
          list, archive, unpublish, delete, template, configuration or redirect
          operation, so this console does not fabricate those capabilities.
        </Alert>
      </WorkspaceSection>

      <WorkspaceSection
        title="Publication health"
        description="Aggregate lifecycle and quality counts from the admin SEO audit."
      >
        {audit.error ? (
          <SeoReadError title="SEO audit unavailable" error={audit.error} />
        ) : (
          <div className="space-y-4">
            <MetricRow
              metrics={[
                {
                  label: "Published",
                  value: audit.data.published_pages.toLocaleString(),
                },
                {
                  label: "Indexable",
                  value: audit.data.indexable_pages.toLocaleString(),
                },
                {
                  label: "Noindex",
                  value: audit.data.noindex_pages.toLocaleString(),
                },
                {
                  label: "Scheduled",
                  value: audit.data.scheduled_pages.toLocaleString(),
                },
                {
                  label: "Draft",
                  value: audit.data.draft_pages.toLocaleString(),
                },
                {
                  label: "Archived",
                  value: audit.data.archived_pages.toLocaleString(),
                },
                {
                  label: "Orphan pages",
                  value: audit.data.orphan_pages.toLocaleString(),
                },
                {
                  label: "Missing metadata",
                  value: audit.data.missing_metadata.toLocaleString(),
                },
                {
                  label: "Duplicate titles",
                  value: audit.data.duplicate_titles.toLocaleString(),
                },
                {
                  label: "Duplicate descriptions",
                  value: audit.data.duplicate_descriptions.toLocaleString(),
                },
                {
                  label: "Canonical problems",
                  value: audit.data.canonical_problems.toLocaleString(),
                },
                {
                  label: "Missing topic",
                  value: audit.data.missing_topic.toLocaleString(),
                },
                {
                  label: "Missing cluster",
                  value: audit.data.missing_cluster.toLocaleString(),
                },
                {
                  label: "Missing links",
                  value: audit.data.missing_internal_links.toLocaleString(),
                },
                {
                  label: "Sitemap issues",
                  value:
                    audit.data.sitemap_eligibility_problems.toLocaleString(),
                },
                {
                  label: "Schema missing",
                  value: audit.data.schema_missing.toLocaleString(),
                },
              ]}
            />
            <p className="text-xs text-ink-4">
              Generated <DateTime value={audit.data.generated_at} />
            </p>
          </div>
        )}
      </WorkspaceSection>

      <WorkspaceSection
        title="Scheduled publication"
        description="The publishing calendar is the only list-style SEO page read exposed by the contract."
      >
        <form
          method="get"
          className="mb-4 grid gap-3 rounded-md border border-rule-2 bg-paper-raised p-4 sm:grid-cols-[1fr_1fr_auto]"
        >
          {pageId ? (
            <input type="hidden" name="page_id" value={pageId} />
          ) : null}
          <label className="font-mono text-label uppercase text-ink-3">
            From
            <input
              type="date"
              name="from"
              defaultValue={from}
              className="mt-1.5 h-10 w-full rounded-sm border border-border bg-paper px-3 text-sm"
            />
          </label>
          <label className="font-mono text-label uppercase text-ink-3">
            To
            <input
              type="date"
              name="to"
              defaultValue={to}
              className="mt-1.5 h-10 w-full rounded-sm border border-border bg-paper px-3 text-sm"
            />
          </label>
          <Button type="submit" className="self-end">
            Apply range
          </Button>
        </form>
        {calendar.error ? (
          <SeoReadError
            title="Publishing calendar unavailable"
            error={calendar.error}
          />
        ) : (
          <>
            <DataTable
              columns={[
                "Page",
                "Type",
                "Publication",
                "Indexability",
                "Scheduled",
                "Batch",
                "Topic",
              ]}
              rows={calendar.data.items.map((item) => [
                <AdminRecordLink
                  key="page"
                  href={`/admin/seo?page_id=${encodeURIComponent(item.page_id)}`}
                >
                  {item.title}
                </AdminRecordLink>,
                item.page_type,
                <StatusBadge
                  key="publication"
                  status={item.publication_status}
                />,
                <StatusBadge key="indexability" status={item.indexability} />,
                <DateTime key="scheduled" value={item.scheduled_publish_at} />,
                item.batch_name || item.batch_id || "—",
                item.topic_name || "—",
              ])}
              empty={{
                title: "No scheduled pages",
                body: "The backend publishing calendar returned no pages in this range.",
              }}
            />
            <AdminPager
              path="/admin/seo"
              total={calendar.data.total}
              limit={limit}
              offset={currentOffset}
              query={{ from, to, page_id: pageId }}
            />
          </>
        )}
      </WorkspaceSection>

      <WorkspaceSection
        title="Page detail"
        description="Load an authoritative page record by backend UUID, then update metadata or request lifecycle transitions."
      >
        <SeoPageLookup pageId={pageId} />
        {!pageId ? (
          <SeoPageEmpty />
        ) : page?.error ? (
          <div className="mt-4">
            <SeoReadError title="SEO page unavailable" error={page.error} />
          </div>
        ) : page?.data ? (
          <SeoPageDetail page={page.data} />
        ) : null}
      </WorkspaceSection>

      <WorkspaceSection
        title="Create SEO page"
        description="Creates a backend-owned draft/noindex page using the complete SeoPageCreate DTO."
      >
        <SeoCreatePageForm />
      </WorkspaceSection>

      <WorkspaceSection
        title="Publishing batches"
        description="Create and schedule explicit page batches, or apply publications that are due on backend server time."
      >
        <SeoPublishingForms />
      </WorkspaceSection>

      <WorkspaceSection
        title="Topics, clusters and links"
        description="Create taxonomy records and explicit page relationships represented by the admin SEO contract."
      >
        <SeoTaxonomyForms />
      </WorkspaceSection>

      <WorkspaceSection
        title="Cluster authority"
        description="Per-cluster coverage and completeness, computed by the backend."
      >
        {authority.error ? (
          <SeoReadError
            title="Cluster authority unavailable"
            error={authority.error}
          />
        ) : (
          <div className="space-y-4">
            <DataTable
              columns={[
                "Cluster",
                "Pillar",
                "Supporting",
                "Published",
                "Indexable",
                "Noindex",
                "Orphans",
                "Inbound coverage",
                "Outbound coverage",
                "Notes",
              ]}
              rows={authority.data.clusters.map((cluster) => [
                <span key="cluster">
                  {cluster.cluster_name}
                  <span className="block font-mono text-xs text-ink-4">
                    {cluster.cluster_slug}
                  </span>
                </span>,
                cluster.pillar_exists
                  ? cluster.pillar_status || "Present"
                  : "Missing",
                cluster.supporting_page_count.toLocaleString(),
                cluster.published_count.toLocaleString(),
                cluster.indexable_count.toLocaleString(),
                cluster.noindex_count.toLocaleString(),
                cluster.orphan_count.toLocaleString(),
                cluster.inbound_link_coverage.toLocaleString(),
                cluster.outbound_link_coverage.toLocaleString(),
                cluster.completeness_notes?.join(" · ") || "—",
              ])}
              empty={{
                title: "No cluster authority records",
                body: "The backend authority report returned no clusters.",
              }}
            />
            <p className="text-xs text-ink-4">
              Generated <DateTime value={authority.data.generated_at} />
            </p>
          </div>
        )}
      </WorkspaceSection>

      <WorkspaceSection
        title="Audit findings"
        description="Page-level quality findings returned by the aggregate SEO audit."
      >
        {audit.error ? (
          <SeoReadError title="SEO findings unavailable" error={audit.error} />
        ) : (
          <DataTable
            columns={["Severity", "Code", "Page", "Canonical path", "Finding"]}
            rows={(audit.data.findings ?? []).map((finding) => [
              <StatusBadge key="severity" status={finding.severity} />,
              finding.code,
              finding.page_id ? (
                <AdminRecordLink
                  key="page"
                  href={`/admin/seo?page_id=${encodeURIComponent(finding.page_id)}`}
                >
                  {finding.page_id}
                </AdminRecordLink>
              ) : (
                "—"
              ),
              finding.canonical_path || "—",
              finding.message,
            ])}
            empty={{
              title: "No SEO audit findings",
              body: "The backend SEO audit returned no page-level findings.",
            }}
          />
        )}
      </WorkspaceSection>
    </>
  );
}
