import { AdminActionForm } from "@/features/admin/action-form";
import {
  addSeoClusterMember,
  applyDueSeoPublications,
  createSeoCluster,
  createSeoInternalLink,
  createSeoPage,
  createSeoPublishingBatch,
  createSeoTopic,
  scheduleSeoPage,
  scheduleSeoPublishingBatch,
  setSeoPageIndexability,
  updateSeoPage,
} from "@/features/admin/seo-actions";
import { DateTime, DefinitionGrid, StatusBadge } from "./components";
import type { AdminSeoError, SeoPage } from "./seo-api";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/layout";
import { Alert, EmptyState } from "@/components/ui/state";

const inputClass =
  "mt-1.5 h-10 w-full rounded-sm border border-border bg-paper px-3 text-sm";
const textareaClass =
  "mt-1.5 min-h-24 w-full rounded-sm border border-border bg-paper px-3 py-2 text-sm";
const labelClass = "block font-mono text-label uppercase text-ink-3";
const formGridClass = "grid gap-4 sm:grid-cols-2";

function OptionalIdHint() {
  return (
    <span className="mt-1 block font-sans text-xs normal-case text-ink-4">
      Backend UUID; leave blank when unassigned.
    </span>
  );
}

export function SeoReadError({
  title,
  error,
}: {
  title: string;
  error: AdminSeoError;
}) {
  return (
    <Alert tone="alert" title={title}>
      <p>{error.message}</p>
      {error.requestId ? (
        <p className="mt-1 font-mono text-xs">Request ID: {error.requestId}</p>
      ) : null}
    </Alert>
  );
}

export function SeoPageLookup({ pageId }: { pageId?: string }) {
  return (
    <form
      method="get"
      className="grid gap-3 rounded-md border border-rule-2 bg-paper-raised p-4 sm:grid-cols-[minmax(0,1fr)_auto]"
    >
      <label className={labelClass}>
        Page ID
        <input
          name="page_id"
          defaultValue={pageId}
          placeholder="Backend page UUID"
          required
          className={inputClass}
        />
      </label>
      <Button type="submit" variant="primary" className="self-end">
        Load page
      </Button>
    </form>
  );
}

export function SeoPageDetail({ page }: { page: SeoPage }) {
  return (
    <div className="mt-4 space-y-5">
      <DefinitionGrid
        items={[
          {
            label: "Publication",
            value: <StatusBadge status={page.publication_status} />,
          },
          {
            label: "Indexability",
            value: <StatusBadge status={page.indexability} />,
          },
          { label: "Canonical path", value: page.canonical_path },
          { label: "Page type", value: page.page_type },
          { label: "Source type", value: page.source_type },
          {
            label: "Scheduled",
            value: <DateTime value={page.scheduled_publish_at} />,
          },
          {
            label: "Published",
            value: <DateTime value={page.published_at} />,
          },
          {
            label: "Updated",
            value: <DateTime value={page.updated_at} />,
          },
          {
            label: "Public",
            value: page.is_public ? "Yes" : "No",
          },
          {
            label: "Indexable",
            value: page.is_indexable ? "Yes" : "No",
          },
          {
            label: "Sitemap eligible",
            value: page.sitemap_eligible ? "Yes" : "No",
          },
          {
            label: "Publication issue",
            value: page.publication_issue || "—",
          },
        ]}
      />

      <DefinitionGrid
        items={[
          {
            label: "Content complete",
            value: page.content_complete ? "Yes" : "No",
          },
          {
            label: "Metadata complete",
            value: page.metadata_complete ? "Yes" : "No",
          },
          {
            label: "Internally linked",
            value: page.internally_linked ? "Yes" : "No",
          },
          {
            label: "Topic assigned",
            value: page.topic_assigned ? "Yes" : "No",
          },
          {
            label: "Cluster assigned",
            value: page.cluster_assigned ? "Yes" : "No",
          },
          {
            label: "Canonical valid",
            value: page.canonical_valid ? "Yes" : "No",
          },
          {
            label: "Indexability valid",
            value: page.indexability_valid ? "Yes" : "No",
          },
          {
            label: "Schema data",
            value: page.schema_data_available ? "Available" : "Missing",
          },
          {
            label: "Word count",
            value: page.content_word_count.toLocaleString(),
          },
        ]}
      />

      <Panel className="p-5">
        <h3 className="mb-4 text-body font-semibold text-ink">
          Metadata and quality inputs
        </h3>
        <AdminActionForm
          action={updateSeoPage.bind(null, page.id)}
          submitLabel="Save page changes"
        >
          <div className={formGridClass}>
            <label className={labelClass}>
              Title
              <input
                name="title"
                defaultValue={page.title}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Canonical path
              <input
                name="canonical_path"
                defaultValue={page.canonical_path}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              SEO title
              <input
                name="seo_title"
                defaultValue={page.seo_title ?? ""}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              OG title
              <input
                name="og_title"
                defaultValue={page.og_title ?? ""}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Topic ID
              <input
                name="topic_id"
                defaultValue={page.topic_id ?? ""}
                className={inputClass}
              />
              <OptionalIdHint />
            </label>
            <label className={labelClass}>
              Cluster ID
              <input
                name="cluster_id"
                defaultValue={page.cluster_id ?? ""}
                className={inputClass}
              />
              <OptionalIdHint />
            </label>
            <label className={labelClass}>
              Parent page ID
              <input
                name="parent_page_id"
                defaultValue={page.parent_page_id ?? ""}
                className={inputClass}
              />
              <OptionalIdHint />
            </label>
            <label className={labelClass}>
              Priority
              <input
                name="priority"
                defaultValue={page.priority}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Content word count
              <input
                type="number"
                min="0"
                step="1"
                name="content_word_count"
                defaultValue={page.content_word_count}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Intended indexability
              <select
                name="intended_indexability"
                defaultValue={page.intended_indexability}
                className={inputClass}
              >
                <option value="noindex">Noindex</option>
                <option value="index">Index</option>
              </select>
            </label>
            <label className={labelClass}>
              Robots directives
              <input
                name="robots_directives"
                defaultValue={page.robots_directives ?? ""}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              OG image path
              <input
                name="og_image_path"
                defaultValue={page.og_image_path ?? ""}
                className={inputClass}
              />
            </label>
          </div>
          <label className={labelClass}>
            Purpose
            <textarea
              name="purpose"
              defaultValue={page.purpose ?? ""}
              className={textareaClass}
            />
          </label>
          <label className={labelClass}>
            Content summary
            <textarea
              name="content_summary"
              defaultValue={page.content_summary ?? ""}
              className={textareaClass}
            />
          </label>
          <label className={labelClass}>
            Meta description
            <textarea
              name="meta_description"
              defaultValue={page.meta_description ?? ""}
              className={textareaClass}
            />
          </label>
          <label className={labelClass}>
            OG description
            <textarea
              name="og_description"
              defaultValue={page.og_description ?? ""}
              className={textareaClass}
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-2">
            <input
              type="checkbox"
              name="schema_data_available"
              defaultChecked={page.schema_data_available}
            />
            Structured-data inputs are available
          </label>
        </AdminActionForm>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="p-4">
          <h3 className="mb-2 font-semibold text-ink">Publish now</h3>
          <p className="mb-3 text-xs text-ink-3">
            Quality gates remain backend-controlled.
          </p>
          <AdminActionForm
            action={scheduleSeoPage.bind(null, page.id)}
            submitLabel="Publish now"
          >
            <input type="hidden" name="publish_now" value="true" />
            <label className={labelClass}>
              Intended indexability
              <select
                name="intended_indexability"
                defaultValue="index"
                className={inputClass}
              >
                <option value="index">Index</option>
                <option value="noindex">Noindex</option>
              </select>
            </label>
          </AdminActionForm>
        </Panel>

        <Panel className="p-4">
          <h3 className="mb-2 font-semibold text-ink">Schedule publication</h3>
          <AdminActionForm
            action={scheduleSeoPage.bind(null, page.id)}
            submitLabel="Schedule page"
          >
            <input type="hidden" name="publish_now" value="false" />
            <label className={labelClass}>
              ISO publish time
              <input
                name="schedule_publish_at"
                placeholder="2026-09-14T09:00:00Z"
                required
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Intended indexability
              <select
                name="intended_indexability"
                defaultValue="index"
                className={inputClass}
              >
                <option value="index">Index</option>
                <option value="noindex">Noindex</option>
              </select>
            </label>
          </AdminActionForm>
        </Panel>

        <Panel className="p-4">
          <h3 className="mb-2 font-semibold text-ink">Indexability</h3>
          <AdminActionForm
            action={setSeoPageIndexability.bind(null, page.id)}
            submitLabel="Set indexability"
          >
            <label className={labelClass}>
              Indexability
              <select
                name="indexability"
                defaultValue={page.indexability}
                className={inputClass}
              >
                <option value="noindex">Noindex</option>
                <option value="index">Index</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-2">
              <input type="checkbox" name="force" />
              Force when the backend permits it
            </label>
          </AdminActionForm>
        </Panel>
      </div>

      <Alert tone="neutral">
        The generated contract has no archive or unpublish operation for SEO
        pages. This console does not simulate those transitions.
      </Alert>
    </div>
  );
}

export function SeoPageEmpty() {
  return (
    <EmptyState
      className="mt-4"
      eyebrow="Page detail"
      title="No SEO page selected"
      description="Enter a backend page UUID above. The current OpenAPI contract does not expose a general SEO page-list endpoint."
    />
  );
}

export function SeoCreatePageForm() {
  return (
    <Panel className="p-5">
      <AdminActionForm
        action={createSeoPage}
        submitLabel="Create draft SEO page"
      >
        <div className={formGridClass}>
          <label className={labelClass}>
            Title
            <input name="title" required className={inputClass} />
          </label>
          <label className={labelClass}>
            Page type
            <input name="page_type" required className={inputClass} />
          </label>
          <label className={labelClass}>
            Slug
            <input name="slug" required className={inputClass} />
          </label>
          <label className={labelClass}>
            Canonical path
            <input
              name="canonical_path"
              placeholder="/fabrics/example/"
              required
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Source type
            <input
              name="source_type"
              defaultValue="standalone"
              required
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Source ID
            <input name="source_id" className={inputClass} />
            <OptionalIdHint />
          </label>
          <label className={labelClass}>
            SEO title
            <input name="seo_title" className={inputClass} />
          </label>
          <label className={labelClass}>
            OG title
            <input name="og_title" className={inputClass} />
          </label>
          <label className={labelClass}>
            OG image path
            <input name="og_image_path" className={inputClass} />
          </label>
          <label className={labelClass}>
            Robots directives
            <input name="robots_directives" className={inputClass} />
          </label>
          <label className={labelClass}>
            Topic ID
            <input name="topic_id" className={inputClass} />
            <OptionalIdHint />
          </label>
          <label className={labelClass}>
            Cluster ID
            <input name="cluster_id" className={inputClass} />
            <OptionalIdHint />
          </label>
          <label className={labelClass}>
            Parent page ID
            <input name="parent_page_id" className={inputClass} />
            <OptionalIdHint />
          </label>
          <label className={labelClass}>
            Batch ID
            <input name="batch_id" className={inputClass} />
            <OptionalIdHint />
          </label>
          <label className={labelClass}>
            Priority
            <input
              name="priority"
              defaultValue="normal"
              required
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Intended indexability
            <select
              name="intended_indexability"
              defaultValue="noindex"
              className={inputClass}
            >
              <option value="noindex">Noindex</option>
              <option value="index">Index</option>
            </select>
          </label>
          <label className={labelClass}>
            Content word count
            <input
              type="number"
              min="0"
              step="1"
              name="content_word_count"
              defaultValue="0"
              className={inputClass}
            />
          </label>
        </div>
        <label className={labelClass}>
          Purpose
          <textarea name="purpose" className={textareaClass} />
        </label>
        <label className={labelClass}>
          Content summary
          <textarea name="content_summary" className={textareaClass} />
        </label>
        <label className={labelClass}>
          Meta description
          <textarea name="meta_description" className={textareaClass} />
        </label>
        <label className={labelClass}>
          OG description
          <textarea name="og_description" className={textareaClass} />
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-2">
          <input type="checkbox" name="schema_data_available" />
          Structured-data inputs are available
        </label>
      </AdminActionForm>
    </Panel>
  );
}

export function SeoTaxonomyForms() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Panel className="p-5">
        <h3 className="mb-4 text-body font-semibold text-ink">Create topic</h3>
        <AdminActionForm action={createSeoTopic} submitLabel="Create topic">
          <div className={formGridClass}>
            <label className={labelClass}>
              Name
              <input name="name" required className={inputClass} />
            </label>
            <label className={labelClass}>
              Slug
              <input name="slug" required className={inputClass} />
            </label>
            <label className={labelClass}>
              Kind
              <input
                name="kind"
                defaultValue="topic"
                required
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Parent topic ID
              <input name="parent_id" className={inputClass} />
            </label>
          </div>
          <label className={labelClass}>
            Description
            <textarea name="description" className={textareaClass} />
          </label>
        </AdminActionForm>
      </Panel>

      <Panel className="p-5">
        <h3 className="mb-4 text-body font-semibold text-ink">
          Create cluster
        </h3>
        <AdminActionForm action={createSeoCluster} submitLabel="Create cluster">
          <div className={formGridClass}>
            <label className={labelClass}>
              Name
              <input name="name" required className={inputClass} />
            </label>
            <label className={labelClass}>
              Slug
              <input name="slug" required className={inputClass} />
            </label>
            <label className={labelClass}>
              Primary topic ID
              <input name="primary_topic_id" className={inputClass} />
            </label>
            <label className={labelClass}>
              Pillar page ID
              <input name="pillar_page_id" className={inputClass} />
            </label>
          </div>
          <label className={labelClass}>
            Description
            <textarea name="description" className={textareaClass} />
          </label>
        </AdminActionForm>
      </Panel>

      <Panel className="p-5">
        <h3 className="mb-4 text-body font-semibold text-ink">
          Attach cluster member
        </h3>
        <AdminActionForm action={addSeoClusterMember} submitLabel="Attach page">
          <div className={formGridClass}>
            <label className={labelClass}>
              Cluster ID
              <input name="cluster_id" required className={inputClass} />
            </label>
            <label className={labelClass}>
              Page ID
              <input name="page_id" required className={inputClass} />
            </label>
          </div>
        </AdminActionForm>
      </Panel>

      <Panel className="p-5">
        <h3 className="mb-4 text-body font-semibold text-ink">
          Create internal link
        </h3>
        <AdminActionForm
          action={createSeoInternalLink}
          submitLabel="Create link"
        >
          <div className={formGridClass}>
            <label className={labelClass}>
              Source page ID
              <input name="source_page_id" required className={inputClass} />
            </label>
            <label className={labelClass}>
              Destination page ID
              <input
                name="destination_page_id"
                required
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Relationship type
              <input
                name="relationship_type"
                defaultValue="related"
                required
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Anchor text
              <input name="anchor_text" className={inputClass} />
            </label>
            <label className={labelClass}>
              Sort order
              <input
                type="number"
                min="0"
                step="1"
                name="sort_order"
                defaultValue="0"
                className={inputClass}
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-2">
            <input type="checkbox" name="is_active" defaultChecked />
            Active link
          </label>
        </AdminActionForm>
      </Panel>
    </div>
  );
}

export function SeoPublishingForms() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Panel className="p-5">
        <h3 className="mb-2 text-body font-semibold text-ink">
          Apply due publications
        </h3>
        <p className="mb-4 text-sm text-ink-3">
          Applies scheduled publishes that are due according to backend time.
        </p>
        <AdminActionForm
          action={applyDueSeoPublications}
          submitLabel="Apply due now"
        />
      </Panel>

      <Panel className="p-5">
        <h3 className="mb-4 text-body font-semibold text-ink">
          Create publishing batch
        </h3>
        <AdminActionForm
          action={createSeoPublishingBatch}
          submitLabel="Create batch"
        >
          <label className={labelClass}>
            Name
            <input name="name" required className={inputClass} />
          </label>
          <label className={labelClass}>
            Description
            <textarea name="description" className={textareaClass} />
          </label>
          <label className={labelClass}>
            Target date
            <input type="date" name="target_date" className={inputClass} />
          </label>
          <label className={labelClass}>
            Page IDs
            <textarea
              name="page_ids"
              placeholder="Comma or newline separated UUIDs"
              className={textareaClass}
            />
          </label>
        </AdminActionForm>
      </Panel>

      <Panel className="p-5">
        <h3 className="mb-4 text-body font-semibold text-ink">
          Schedule publishing batch
        </h3>
        <AdminActionForm
          action={scheduleSeoPublishingBatch}
          submitLabel="Schedule batch"
        >
          <label className={labelClass}>
            Batch ID
            <input name="batch_id" required className={inputClass} />
          </label>
          <label className={labelClass}>
            ISO publish time
            <input
              name="schedule_publish_at"
              placeholder="2026-09-14T09:00:00Z"
              required
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Intended indexability
            <select
              name="intended_indexability"
              defaultValue="index"
              className={inputClass}
            >
              <option value="index">Index</option>
              <option value="noindex">Noindex</option>
            </select>
          </label>
        </AdminActionForm>
      </Panel>
    </div>
  );
}
