import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import {
  DataTable,
  MetricRow,
  WorkspaceSection,
} from "@/components/marketplace/workspace-blocks";
import { getAdminDashboard, getAdminInquiries } from "@/features/admin/api";
import {
  AdminRecordLink,
  DateTime,
  MetricDisplay,
  Money,
  StatusBadge,
} from "@/features/admin/components";

export const metadata: Metadata = { title: "Admin overview" };

export default async function AdminDashboardPage() {
  const [dashboard, inquiries] = await Promise.all([
    getAdminDashboard(),
    getAdminInquiries({ limit: 8, offset: 0 }),
  ]);
  return (
    <>
      <WorkspaceHeader
        title="Overview"
        description="Authoritative marketplace and operations snapshot from the admin API."
      />

      <div className="px-4 pt-6 sm:px-6">
        <MetricRow
          metrics={[
            {
              label: "Total orders",
              value: <MetricDisplay metric={dashboard.total_orders} />,
              href: "/admin/orders",
            },
            {
              label: "Orders today",
              value: <MetricDisplay metric={dashboard.todays_orders} />,
              href: "/admin/orders",
            },
            {
              label: "Total customers",
              value: <MetricDisplay metric={dashboard.total_customers} />,
              href: "/admin/customers",
            },
            {
              label: "New customers · 30d",
              value: <MetricDisplay metric={dashboard.new_customers_30d} />,
              href: "/admin/customers",
            },
          ]}
        />
      </div>

      <WorkspaceSection
        title="Supply controls"
        description="Unavailable aggregates are reported as unavailable, never coerced to zero."
      >
        <MetricRow
          metrics={[
            {
              label: "Verified suppliers",
              value: <MetricDisplay metric={dashboard.verified_suppliers} />,
              href: "/admin/suppliers?verification_status=verified",
            },
            {
              label: "Suppliers pending",
              value: (
                <MetricDisplay metric={dashboard.suppliers_pending_review} />
              ),
              href: "/admin/suppliers?verification_status=pending",
            },
            {
              label: "Published fabrics",
              value: (
                <MetricDisplay metric={dashboard.catalog_published_listings} />
              ),
              href: "/admin/fabrics?status=published",
            },
            {
              label: "Draft fabrics",
              value: (
                <MetricDisplay metric={dashboard.catalog_draft_listings} />
              ),
              href: "/admin/fabrics?status=draft",
            },
          ]}
        />
      </WorkspaceSection>

      <WorkspaceSection
        title="Recent orders"
        description="Newest order activity returned by GET /admin/dashboard."
      >
        <DataTable
          columns={[
            "Order",
            "Customer",
            "Status",
            "Payment",
            "Total",
            "Submitted",
          ]}
          rows={dashboard.recent_orders.map((order) => [
            <AdminRecordLink
              key="order"
              href={`/admin/orders/${order.order_number}`}
            >
              {order.order_number}
            </AdminRecordLink>,
            order.customer_email,
            <StatusBadge key="status" status={order.status} />,
            <StatusBadge key="payment" status={order.payment_status} />,
            <Money
              key="total"
              amount={order.total_amount}
              currency={order.currency}
            />,
            <DateTime key="submitted" value={order.submitted_at} />,
          ])}
          empty={{
            title: "No orders recorded",
            body: "The dashboard API returned no recent orders.",
          }}
        />
      </WorkspaceSection>

      <WorkspaceSection
        title="Recent inquiries"
        description={`${inquiries.total} inquiries on the admin inquiry API.`}
        action={
          <AdminRecordLink href="/admin/inquiries">View all</AdminRecordLink>
        }
      >
        <DataTable
          columns={["Inquiry", "Customer", "Fabric", "Status", "Submitted"]}
          rows={inquiries.items.map((inquiry) => [
            <AdminRecordLink
              key="inquiry"
              href={`/admin/inquiries/${inquiry.id}`}
            >
              {inquiry.inquiry_number}
            </AdminRecordLink>,
            inquiry.customer_email,
            inquiry.fabric.name,
            <StatusBadge key="status" status={inquiry.status} />,
            <DateTime key="created" value={inquiry.created_at} />,
          ])}
          empty={{
            title: "No inquiries recorded",
            body: "The inquiry API returned no recent inquiries.",
          }}
        />
      </WorkspaceSection>
    </>
  );
}
