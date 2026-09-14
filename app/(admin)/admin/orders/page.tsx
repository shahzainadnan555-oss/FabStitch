import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import {
  DataTable,
  WorkspaceSection,
} from "@/components/marketplace/workspace-blocks";
import { Button } from "@/components/ui/button";
import { getAdminOrders } from "@/features/admin/api";
import {
  AdminPager,
  AdminRecordLink,
  DateTime,
  Money,
  StatusBadge,
} from "@/features/admin/components";

export const metadata: Metadata = { title: "Admin orders" };

type Query = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function offset(value: string | undefined) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const q = one(query.q);
  const status = one(query.status);
  const paymentStatus = one(query.payment_status);
  const fulfillmentStatus = one(query.fulfillment_status);
  const currentOffset = offset(one(query.offset));
  const orders = await getAdminOrders({
    limit: 50,
    offset: currentOffset,
    q,
    status,
    payment_status: paymentStatus,
    fulfillment_status: fulfillmentStatus,
  });

  return (
    <>
      <WorkspaceHeader
        title="Orders"
        description="Inspect customer-safe order snapshots and execute backend-controlled lifecycle actions."
      />
      <WorkspaceSection title="Order register">
        <form
          method="get"
          className="mb-4 grid gap-3 rounded-md border border-rule-2 bg-paper-raised p-4 md:grid-cols-6"
        >
          <input
            aria-label="Search orders"
            name="q"
            defaultValue={q}
            placeholder="Order, customer, fabric"
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm md:col-span-2"
          />
          <input
            aria-label="Order status"
            name="status"
            defaultValue={status}
            placeholder="Order status"
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm"
          />
          <input
            aria-label="Payment status"
            name="payment_status"
            defaultValue={paymentStatus}
            placeholder="Payment status"
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm"
          />
          <input
            aria-label="Fulfillment status"
            name="fulfillment_status"
            defaultValue={fulfillmentStatus}
            placeholder="Fulfillment"
            className="h-10 rounded-sm border border-border bg-paper px-3 text-sm"
          />
          <Button type="submit">Apply filters</Button>
        </form>

        <DataTable
          columns={[
            "Order",
            "Customer",
            "Items",
            "Order status",
            "Payment",
            "Fulfillment",
            "Total",
            "Submitted",
          ]}
          rows={orders.items.map((order) => [
            <AdminRecordLink
              key="order"
              href={`/admin/orders/${order.order_number}`}
            >
              {order.order_number}
            </AdminRecordLink>,
            <span key="customer">
              {order.customer_name}
              <span className="block text-xs text-ink-4">
                {order.customer_email}
              </span>
            </span>,
            order.item_count,
            <StatusBadge key="order-status" status={order.status} />,
            <StatusBadge key="payment" status={order.payment_status} />,
            <StatusBadge key="fulfillment" status={order.fulfillment_status} />,
            <Money
              key="total"
              amount={order.total_amount}
              currency={order.currency}
            />,
            <DateTime key="date" value={order.submitted_at} />,
          ])}
          empty={{
            title: "No orders matched",
            body: "No authoritative order records matched the current filters.",
          }}
        />
        <AdminPager
          path="/admin/orders"
          total={orders.total}
          limit={orders.limit}
          offset={orders.offset}
          query={{
            q,
            status,
            payment_status: paymentStatus,
            fulfillment_status: fulfillmentStatus,
          }}
        />
      </WorkspaceSection>
    </>
  );
}
