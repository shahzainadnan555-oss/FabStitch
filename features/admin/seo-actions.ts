"use server";

import { revalidatePath } from "next/cache";
import type { components } from "@/lib/api/schema";
import { serverApi } from "@/lib/api/server";
import type { AdminActionState, AdminSession } from "./types";
import { adminSeoError } from "./seo-api";

type Schema = components["schemas"];

class FormInputError extends Error {}

function text(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function requiredText(formData: FormData, name: string, label: string): string {
  const value = text(formData, name);
  if (!value) throw new FormInputError(`${label} is required.`);
  return value;
}

function optionalText(formData: FormData, name: string): string | null {
  return text(formData, name) || null;
}

function nonNegativeInteger(
  formData: FormData,
  name: string,
  label: string,
  fallback?: number,
): number {
  const raw = text(formData, name);
  if (!raw && fallback !== undefined) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) {
    throw new FormInputError(`${label} must be a non-negative integer.`);
  }
  return value;
}

function optionalNonNegativeInteger(
  formData: FormData,
  name: string,
  label: string,
): number | null {
  return text(formData, name)
    ? nonNegativeInteger(formData, name, label)
    : null;
}

function isoDateTime(formData: FormData, name: string, label: string): string {
  const raw = requiredText(formData, name, label);
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.valueOf())) {
    throw new FormInputError(`${label} must be a valid ISO 8601 date-time.`);
  }
  return parsed.toISOString();
}

function stringList(formData: FormData, name: string): string[] {
  return text(formData, name)
    .split(/[\s,]+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function checked(formData: FormData, name: string): boolean {
  const value = formData.get(name);
  return value === "on" || value === "true" || value === "1";
}

async function requireAdmin() {
  await serverApi.get<AdminSession>("/admin/me");
}

async function runSeoMutation<T>(
  mutation: () => Promise<T>,
  success: (result: T) => Omit<AdminActionState, "status">,
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    const result = await mutation();
    revalidatePath("/admin/seo");
    return { status: "success", ...success(result) };
  } catch (error) {
    if (error instanceof FormInputError) {
      return { status: "error", message: error.message };
    }
    const failure = adminSeoError(error);
    return {
      status: "error",
      message: failure.message,
      requestId: failure.requestId,
    };
  }
}

export async function createSeoTopic(
  _previous: AdminActionState,
  formData: FormData,
) {
  return runSeoMutation(
    () => {
      const body: Schema["SeoTopicCreate"] = {
        slug: requiredText(formData, "slug", "Slug"),
        name: requiredText(formData, "name", "Name"),
        kind: requiredText(formData, "kind", "Kind"),
        parent_id: optionalText(formData, "parent_id"),
        description: optionalText(formData, "description"),
      };
      return serverApi.post<Schema["SeoTopicOut"], typeof body>(
        "/admin/seo/topics",
        { body },
      );
    },
    (topic) => ({
      message: `Topic created: ${topic.name} (${topic.id}).`,
    }),
  );
}

export async function createSeoCluster(
  _previous: AdminActionState,
  formData: FormData,
) {
  return runSeoMutation(
    () => {
      const body: Schema["SeoClusterCreate"] = {
        slug: requiredText(formData, "slug", "Slug"),
        name: requiredText(formData, "name", "Name"),
        description: optionalText(formData, "description"),
        primary_topic_id: optionalText(formData, "primary_topic_id"),
        pillar_page_id: optionalText(formData, "pillar_page_id"),
      };
      return serverApi.post<Schema["SeoClusterOut"], typeof body>(
        "/admin/seo/clusters",
        { body },
      );
    },
    (cluster) => ({
      message: `Cluster created: ${cluster.name} (${cluster.id}).`,
    }),
  );
}

export async function addSeoClusterMember(
  _previous: AdminActionState,
  formData: FormData,
) {
  return runSeoMutation(
    async () => {
      const clusterId = requiredText(formData, "cluster_id", "Cluster ID");
      const pageId = requiredText(formData, "page_id", "Page ID");
      await serverApi.post<void>(
        `/admin/seo/clusters/${encodeURIComponent(clusterId)}/members/${encodeURIComponent(pageId)}`,
      );
      return { clusterId, pageId };
    },
    ({ clusterId, pageId }) => ({
      message: `Page ${pageId} attached to cluster ${clusterId}.`,
    }),
  );
}

export async function createSeoPage(
  _previous: AdminActionState,
  formData: FormData,
) {
  return runSeoMutation(
    () => {
      const body: Schema["SeoPageCreate"] = {
        page_type: requiredText(formData, "page_type", "Page type"),
        source_type: requiredText(formData, "source_type", "Source type"),
        source_id: optionalText(formData, "source_id"),
        slug: requiredText(formData, "slug", "Slug"),
        canonical_path: requiredText(
          formData,
          "canonical_path",
          "Canonical path",
        ),
        title: requiredText(formData, "title", "Title"),
        purpose: optionalText(formData, "purpose"),
        content_summary: optionalText(formData, "content_summary"),
        content_word_count: nonNegativeInteger(
          formData,
          "content_word_count",
          "Content word count",
          0,
        ),
        seo_title: optionalText(formData, "seo_title"),
        meta_description: optionalText(formData, "meta_description"),
        og_title: optionalText(formData, "og_title"),
        og_description: optionalText(formData, "og_description"),
        og_image_path: optionalText(formData, "og_image_path"),
        robots_directives: optionalText(formData, "robots_directives"),
        topic_id: optionalText(formData, "topic_id"),
        cluster_id: optionalText(formData, "cluster_id"),
        parent_page_id: optionalText(formData, "parent_page_id"),
        batch_id: optionalText(formData, "batch_id"),
        priority: requiredText(formData, "priority", "Priority"),
        schema_data_available: checked(formData, "schema_data_available"),
        intended_indexability: requiredText(
          formData,
          "intended_indexability",
          "Intended indexability",
        ),
      };
      return serverApi.post<Schema["SeoPageAdminOut"], typeof body>(
        "/admin/seo/pages",
        { body },
      );
    },
    (page) => ({
      message: `Draft SEO page created: ${page.title}.`,
      href: `/admin/seo?page_id=${encodeURIComponent(page.id)}`,
      linkLabel: "Open created page",
    }),
  );
}

export async function updateSeoPage(
  pageId: string,
  _previous: AdminActionState,
  formData: FormData,
) {
  return runSeoMutation(
    () => {
      const body: Schema["SeoPageUpdate"] = {
        title: optionalText(formData, "title"),
        purpose: optionalText(formData, "purpose"),
        content_summary: optionalText(formData, "content_summary"),
        content_word_count: optionalNonNegativeInteger(
          formData,
          "content_word_count",
          "Content word count",
        ),
        seo_title: optionalText(formData, "seo_title"),
        meta_description: optionalText(formData, "meta_description"),
        og_title: optionalText(formData, "og_title"),
        og_description: optionalText(formData, "og_description"),
        og_image_path: optionalText(formData, "og_image_path"),
        robots_directives: optionalText(formData, "robots_directives"),
        topic_id: optionalText(formData, "topic_id"),
        cluster_id: optionalText(formData, "cluster_id"),
        parent_page_id: optionalText(formData, "parent_page_id"),
        priority: optionalText(formData, "priority"),
        schema_data_available: checked(formData, "schema_data_available"),
        intended_indexability: optionalText(formData, "intended_indexability"),
        canonical_path: optionalText(formData, "canonical_path"),
      };
      return serverApi.patch<Schema["SeoPageAdminOut"], typeof body>(
        `/admin/seo/pages/${encodeURIComponent(pageId)}`,
        { body },
      );
    },
    (page) => ({ message: `SEO page updated: ${page.title}.` }),
  );
}

export async function scheduleSeoPage(
  pageId: string,
  _previous: AdminActionState,
  formData: FormData,
) {
  return runSeoMutation(
    () => {
      const publishNow = checked(formData, "publish_now");
      const body: Schema["SchedulePageRequest"] = {
        schedule_publish_at: publishNow
          ? null
          : isoDateTime(formData, "schedule_publish_at", "Schedule publish at"),
        publish_now: publishNow,
        intended_indexability: requiredText(
          formData,
          "intended_indexability",
          "Intended indexability",
        ),
      };
      return serverApi.post<Schema["SeoPageAdminOut"], typeof body>(
        `/admin/seo/pages/${encodeURIComponent(pageId)}/schedule`,
        { body },
      );
    },
    (page) => ({
      message: `Publication state updated to ${page.publication_status}.`,
    }),
  );
}

export async function setSeoPageIndexability(
  pageId: string,
  _previous: AdminActionState,
  formData: FormData,
) {
  return runSeoMutation(
    () => {
      const body: Schema["SetIndexabilityRequest"] = {
        indexability: requiredText(formData, "indexability", "Indexability"),
        force: checked(formData, "force"),
      };
      return serverApi.post<Schema["SeoPageAdminOut"], typeof body>(
        `/admin/seo/pages/${encodeURIComponent(pageId)}/indexability`,
        { body },
      );
    },
    (page) => ({
      message: `Indexability updated to ${page.indexability}.`,
    }),
  );
}

export async function createSeoInternalLink(
  _previous: AdminActionState,
  formData: FormData,
) {
  return runSeoMutation(
    () => {
      const body: Schema["InternalLinkCreate"] = {
        source_page_id: requiredText(
          formData,
          "source_page_id",
          "Source page ID",
        ),
        destination_page_id: requiredText(
          formData,
          "destination_page_id",
          "Destination page ID",
        ),
        relationship_type: requiredText(
          formData,
          "relationship_type",
          "Relationship type",
        ),
        anchor_text: optionalText(formData, "anchor_text"),
        sort_order: nonNegativeInteger(formData, "sort_order", "Sort order", 0),
        is_active: checked(formData, "is_active"),
      };
      return serverApi.post<Schema["InternalLinkOut"], typeof body>(
        "/admin/seo/links",
        { body },
      );
    },
    (link) => ({ message: `Internal link created: ${link.id}.` }),
  );
}

export async function createSeoPublishingBatch(
  _previous: AdminActionState,
  formData: FormData,
) {
  return runSeoMutation(
    () => {
      const pageIds = stringList(formData, "page_ids");
      const body: Schema["PublishingBatchCreate"] = {
        name: requiredText(formData, "name", "Name"),
        description: optionalText(formData, "description"),
        target_date: optionalText(formData, "target_date"),
        ...(pageIds.length ? { page_ids: pageIds } : {}),
      };
      return serverApi.post<Schema["PublishingBatchOut"], typeof body>(
        "/admin/seo/publishing-batches",
        { body },
      );
    },
    (batch) => ({
      message: `Publishing batch created: ${batch.name} (${batch.id}).`,
    }),
  );
}

export async function scheduleSeoPublishingBatch(
  _previous: AdminActionState,
  formData: FormData,
) {
  return runSeoMutation(
    () => {
      const batchId = requiredText(formData, "batch_id", "Batch ID");
      const body: Schema["ScheduleBatchRequest"] = {
        schedule_publish_at: isoDateTime(
          formData,
          "schedule_publish_at",
          "Schedule publish at",
        ),
        intended_indexability: requiredText(
          formData,
          "intended_indexability",
          "Intended indexability",
        ),
      };
      return serverApi.post<Schema["PublishingBatchOut"], typeof body>(
        `/admin/seo/publishing-batches/${encodeURIComponent(batchId)}/schedule`,
        { body },
      );
    },
    (batch) => ({
      message: `Publishing batch scheduled: ${batch.name}.`,
    }),
  );
}

export async function applyDueSeoPublications(
  _previous: AdminActionState,
  _formData: FormData,
) {
  return runSeoMutation(
    () => serverApi.post<Record<string, number>>("/admin/seo/apply-due"),
    (counts) => {
      const summary = Object.entries(counts)
        .map(([key, value]) => `${key.replaceAll("_", " ")}: ${value}`)
        .join(", ");
      return {
        message: summary
          ? `Due publications applied (${summary}).`
          : "Due publications applied.",
      };
    },
  );
}
