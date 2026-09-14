import "server-only";

import type { components, operations } from "@/lib/api/schema";
import { ApiError } from "@/lib/api/errors";
import { serverApi } from "@/lib/api/server";

type Schema = components["schemas"];

export type SeoPage = Schema["SeoPageAdminOut"];
export type SeoAudit = Schema["SeoAuditSummaryOut"];
export type SeoClusterAuthority = Schema["ClusterAuthorityReportOut"];
export type SeoPublishingCalendar = Schema["PublishingCalendarOut"];
export type SeoCalendarQuery =
  operations["admin_publishing_calendar_api_v1_admin_seo_publishing_calendar_get"]["parameters"]["query"];

export type AdminSeoError = {
  message: string;
  requestId?: string;
};

export function adminSeoError(
  error: unknown,
  fallback = "The SEO request could not be completed.",
): AdminSeoError {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      requestId: error.requestId,
    };
  }
  return { message: fallback };
}

export function getAdminSeoAudit() {
  return serverApi.get<SeoAudit>("/admin/seo/audit");
}

export function getAdminSeoClusterAuthority() {
  return serverApi.get<SeoClusterAuthority>("/admin/seo/clusters/authority");
}

export function getAdminSeoPublishingCalendar(query: SeoCalendarQuery = {}) {
  return serverApi.get<SeoPublishingCalendar>(
    "/admin/seo/publishing-calendar",
    { query: { ...query } },
  );
}

export function getAdminSeoPage(pageId: string) {
  return serverApi.get<SeoPage>(
    `/admin/seo/pages/${encodeURIComponent(pageId)}`,
  );
}
