import type { components, operations } from "@/lib/api/schema";

type Schema = components["schemas"];

export type AdminSession = Schema["AdminSessionOut"];
export type DashboardOverview = Schema["DashboardOverview"];
export type MetricValue = Schema["MetricValue"];
export type AdminOrderList = Schema["AdminOrderListResponse"];
export type AdminOrder = Schema["OrderOut"];
export type AdminCustomerList = Schema["AdminCustomerListResponse"];
export type AdminCustomer = Schema["AdminCustomerDetail"];
export type AdminFabricList = Schema["AdminFabricListResponse"];
export type AdminFabric = Schema["AdminFabricDetail"];
export type AdminFabricCreate = Schema["AdminFabricCreateRequest"];
export type AdminFabricUpdate = Schema["AdminFabricUpdateRequest"];
export type AdminInquiryList = Schema["AdminInquiryListResponse"];
export type AdminInquiry = Schema["AdminInquiryOut"];
export type AdminSupplierList = Schema["SupplierListResponse"];
export type AdminSupplier = Schema["SupplierOut"];
export type SupplierVerification = Schema["VerificationOut"];
export type AdminSearchResults = Schema["AdminSearchResponse"];
export type AdminAudit = Schema["AdminAuditListResponse"];
export type RealtimeEvent = Schema["RealtimeEnvelope"];
export type AnalyticsOrders = Schema["AnalyticsOrdersOut"];
export type AnalyticsCustomers = Schema["AnalyticsCustomersOut"];
export type AnalyticsFabrics = Schema["AnalyticsFabricsOut"];
export type AnalyticsCountries = Schema["AnalyticsCountriesOut"];
export type AnalyticsPayments = Schema["AnalyticsPaymentsOut"];

export type AdminOrdersQuery =
  operations["admin_list_orders_api_v1_admin_orders_get"]["parameters"]["query"];
export type AdminCustomersQuery =
  operations["admin_list_customers_api_v1_admin_customers_get"]["parameters"]["query"];
export type AdminFabricsQuery =
  operations["admin_list_fabrics_api_v1_admin_fabrics_get"]["parameters"]["query"];
export type AdminInquiriesQuery =
  operations["admin_list_inquiries_api_v1_admin_inquiries_get"]["parameters"]["query"];
export type AdminSuppliersQuery =
  operations["admin_list_suppliers_api_v1_admin_suppliers_get"]["parameters"]["query"];

export type AdminActionState = {
  status: "idle" | "success" | "error";
  message: string;
  requestId?: string;
  href?: string;
  linkLabel?: string;
};

export const INITIAL_ADMIN_ACTION_STATE: AdminActionState = {
  status: "idle",
  message: "",
};
