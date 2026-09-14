import "server-only";

import { ApiError } from "@/lib/api/errors";
import { serverApi } from "@/lib/api/server";
import type {
  AdminAudit,
  AdminCustomer,
  AdminCustomerList,
  AdminCustomersQuery,
  AdminFabric,
  AdminFabricList,
  AdminFabricsQuery,
  AdminInquiriesQuery,
  AdminInquiry,
  AdminInquiryList,
  AdminOrder,
  AdminOrderList,
  AdminOrdersQuery,
  AdminSearchResults,
  AdminSession,
  AdminSupplier,
  AdminSupplierList,
  AdminSuppliersQuery,
  AnalyticsCountries,
  AnalyticsCustomers,
  AnalyticsFabrics,
  AnalyticsOrders,
  AnalyticsPayments,
  DashboardOverview,
  SupplierVerification,
} from "./types";

export function getAdminSession() {
  return serverApi.get<AdminSession>("/admin/me");
}

export function getAdminDashboard() {
  return serverApi.get<DashboardOverview>("/admin/dashboard");
}

export function getAdminOrders(query: AdminOrdersQuery = {}) {
  return serverApi.get<AdminOrderList>("/admin/orders", {
    query: { ...query },
  });
}

export function getAdminOrder(orderNumber: string) {
  return serverApi.get<AdminOrder>(
    `/admin/orders/${encodeURIComponent(orderNumber)}`,
  );
}

export function getAdminCustomers(query: AdminCustomersQuery = {}) {
  return serverApi.get<AdminCustomerList>("/admin/customers", {
    query: { ...query },
  });
}

export function getAdminCustomer(customerId: string) {
  return serverApi.get<AdminCustomer>(
    `/admin/customers/${encodeURIComponent(customerId)}`,
  );
}

export function getAdminFabrics(query: AdminFabricsQuery = {}) {
  return serverApi.get<AdminFabricList>("/admin/fabrics", {
    query: { ...query },
  });
}

export function getAdminFabric(listingId: string) {
  return serverApi.get<AdminFabric>(
    `/admin/fabrics/${encodeURIComponent(listingId)}`,
  );
}

export function getAdminInquiries(query: AdminInquiriesQuery = {}) {
  return serverApi.get<AdminInquiryList>("/admin/inquiries", {
    query: { ...query },
  });
}

export function getAdminInquiry(inquiryId: string) {
  return serverApi.get<AdminInquiry>(
    `/admin/inquiries/${encodeURIComponent(inquiryId)}`,
  );
}

export function getAdminSuppliers(query: AdminSuppliersQuery = {}) {
  return serverApi.get<AdminSupplierList>("/admin/suppliers", {
    query: { ...query },
  });
}

export function getAdminSupplier(supplierId: string) {
  return serverApi.get<AdminSupplier>(
    `/admin/suppliers/${encodeURIComponent(supplierId)}`,
  );
}

export async function getAdminVerification(
  supplierId: string,
): Promise<SupplierVerification | null> {
  try {
    return await serverApi.get<SupplierVerification>(
      `/admin/suppliers/${encodeURIComponent(supplierId)}/verification`,
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function getAdminSearch(query: string, limit = 30) {
  return serverApi.get<AdminSearchResults>("/admin/search", {
    query: { q: query, limit },
  });
}

export function getAdminAudit(limit = 50, offset = 0) {
  return serverApi.get<AdminAudit>("/admin/audit", {
    query: { limit, offset },
  });
}

export function getAdminAnalytics() {
  return Promise.all([
    serverApi.get<AnalyticsOrders>("/admin/analytics/orders"),
    serverApi.get<AnalyticsCustomers>("/admin/analytics/customers"),
    serverApi.get<AnalyticsFabrics>("/admin/analytics/fabrics"),
    serverApi.get<AnalyticsCountries>("/admin/analytics/countries"),
    serverApi.get<AnalyticsPayments>("/admin/analytics/payments"),
  ]);
}

export async function getBackendHealth() {
  const probes = [
    ["Liveness", "/health/live"],
    ["Readiness", "/ready"],
    ["Database readiness", "/health"],
    ["Admin module", "/admin/_ready"],
    ["Realtime module", "/realtime/_ready"],
    ["Health metrics", "/health/metrics"],
    ["Realtime metrics", "/admin/realtime/metrics"],
  ] as const;

  return Promise.all(
    probes.map(async ([label, path]) => {
      try {
        const value = await serverApi.get<unknown>(path);
        return { label, path, available: true as const, value };
      } catch (error) {
        return {
          label,
          path,
          available: false as const,
          error:
            error instanceof ApiError
              ? `${error.message}${error.requestId ? ` (${error.requestId})` : ""}`
              : "Probe unavailable",
        };
      }
    }),
  );
}
