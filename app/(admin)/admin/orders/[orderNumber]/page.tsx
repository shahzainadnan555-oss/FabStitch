import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import { WorkspaceSection } from "@/components/marketplace/workspace-blocks";
import { Panel } from "@/components/ui/layout";
import { getAdminOrder } from "@/features/admin/api";
import { AdminActionForm } from "@/features/admin/action-form";
import {
  addOrderNote,
  refundOrder,
  updateFulfillmentStatus,
  updateOrderStatus,
  updateOrderTracking,
} from "@/features/admin/actions";
import {
  DateTime,
  DefinitionGrid,
  Money,
  StatusBadge,
} from "@/features/admin/components";

export const metadata: Metadata = { title: "Admin order detail" };

const inputClass =
  "h-10 w-full rounded-sm border border-border bg-paper px-3 text-sm";
const textareaClass =
  "min-h-24 w-full rounded-sm border border-border bg-paper px-3 py-2 text-sm";
const labelClass = "block font-mono text-label uppercase text-ink-3";

const ORDER_STATUSES = [
  "draft",
  "pending",
  "confirmed",
  "processing",
  "ready_to_ship",
  "shipped",
  "delivered",
  "cancelled",
  "failed",
];

const FULFILLMENT_STATUSES = [
  "unfulfilled",
  "allocated",
  "processing",
  "ready_to_ship",
  "shipped",
  "delivered",
  "exception",
  "cancelled",
];

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getAdminOrder(orderNumber);
  const address = order.shipping_address;

  return (
    <>
      <WorkspaceHeader
        title={`Order ${order.order_number}`}
        description="All mutations are submitted to controlled admin lifecycle endpoints; the API remains authoritative."
      />

      <WorkspaceSection title="Order snapshot">
        <DefinitionGrid
          items={[
            {
              label: "Order status",
              value: <StatusBadge status={order.status} />,
            },
            {
              label: "Payment status",
              value: <StatusBadge status={order.payment_status} />,
            },
            {
              label: "Fulfillment",
              value: <StatusBadge status={order.fulfillment_status} />,
            },
            {
              label: "Total",
              value: (
                <Money amount={order.total_amount} currency={order.currency} />
              ),
            },
            {
              label: "Customer",
              value: (
                <>
                  {order.customer_name}
                  <span className="block text-xs text-ink-4">
                    {order.customer_email}
                  </span>
                </>
              ),
            },
            {
              label: "Submitted",
              value: <DateTime value={order.submitted_at} />,
            },
          ]}
        />
      </WorkspaceSection>

      <WorkspaceSection title="Items">
        <Panel className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-rule">
                {[
                  "Fabric",
                  "Quantity",
                  "Unit price",
                  "Line total",
                  "Status",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="bg-paper-sunk px-3 py-2.5 font-mono text-label uppercase text-ink-3"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr
                  key={`${item.listing_id}-${item.line_position}`}
                  className="border-b border-rule"
                >
                  <td className="px-3 py-2.5 text-sm">
                    {item.fabric_name}
                    <span className="block text-xs text-ink-4">
                      {item.fabric_slug}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-sm">
                    {item.quantity} {item.quantity_unit}
                  </td>
                  <td className="px-3 py-2.5 text-sm">
                    <Money
                      amount={item.unit_price_snapshot}
                      currency={order.currency}
                    />
                  </td>
                  <td className="px-3 py-2.5 text-sm">
                    <Money
                      amount={item.line_total_snapshot}
                      currency={order.currency}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={item.item_status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </WorkspaceSection>

      <WorkspaceSection title="Customer and shipping">
        <DefinitionGrid
          items={[
            { label: "Recipient", value: address.recipient_name },
            {
              label: "Address",
              value: [address.line1, address.line2].filter(Boolean).join(", "),
            },
            {
              label: "Locality",
              value: [address.city, address.region, address.postal_code]
                .filter(Boolean)
                .join(", "),
            },
            { label: "Country", value: address.country },
            { label: "Customer phone", value: order.customer_phone || "—" },
            {
              label: "Shipping method",
              value: order.shipping_method_name || "Unavailable",
            },
          ]}
        />
      </WorkspaceSection>

      <WorkspaceSection
        title="Lifecycle actions"
        description="The backend validates every transition; these controls do not infer or bypass allowed next states."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel className="p-4">
            <h3 className="mb-3 font-semibold text-ink">Order status</h3>
            <AdminActionForm
              action={updateOrderStatus.bind(null, order.order_number)}
              submitLabel="Update order status"
            >
              <label className={labelClass}>
                New status
                <select
                  name="status"
                  defaultValue={order.status}
                  className={`${inputClass} mt-1.5`}
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Reason
                <input name="reason" className={`${inputClass} mt-1.5`} />
              </label>
              <label className="flex items-center gap-2 text-sm text-ink-2">
                <input type="checkbox" name="sync_fulfillment" defaultChecked />
                Sync fulfillment when backend rules allow
              </label>
            </AdminActionForm>
          </Panel>

          <Panel className="p-4">
            <h3 className="mb-3 font-semibold text-ink">Fulfillment status</h3>
            <AdminActionForm
              action={updateFulfillmentStatus.bind(null, order.order_number)}
              submitLabel="Update fulfillment"
            >
              <label className={labelClass}>
                New status
                <select
                  name="fulfillment_status"
                  defaultValue={order.fulfillment_status}
                  className={`${inputClass} mt-1.5`}
                >
                  {FULFILLMENT_STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Reason
                <input name="reason" className={`${inputClass} mt-1.5`} />
              </label>
            </AdminActionForm>
          </Panel>

          <Panel className="p-4">
            <h3 className="mb-3 font-semibold text-ink">Tracking</h3>
            <AdminActionForm
              action={updateOrderTracking.bind(null, order.order_number)}
              submitLabel="Save tracking"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={labelClass}>
                  Carrier
                  <input
                    name="carrier"
                    defaultValue={order.tracking?.carrier ?? ""}
                    className={`${inputClass} mt-1.5`}
                  />
                </label>
                <label className={labelClass}>
                  Tracking number
                  <input
                    name="tracking_number"
                    defaultValue={order.tracking?.tracking_number ?? ""}
                    className={`${inputClass} mt-1.5`}
                  />
                </label>
              </div>
              <label className={labelClass}>
                Tracking URL
                <input
                  type="url"
                  name="tracking_url"
                  defaultValue={order.tracking?.tracking_url ?? ""}
                  className={`${inputClass} mt-1.5`}
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                {([
                  ["shipped_at", "Shipped at", order.tracking?.shipped_at],
                  [
                    "estimated_delivery_at",
                    "Estimated delivery",
                    order.tracking?.estimated_delivery_at,
                  ],
                  [
                    "delivered_at",
                    "Delivered at",
                    order.tracking?.delivered_at,
                  ],
                ] satisfies ReadonlyArray<
                  readonly [string, string, string | null | undefined]
                >).map(([name, label, value]) => (
                  <label key={name} className={labelClass}>
                    {label}
                    <input
                      type="text"
                      name={name}
                      defaultValue={value ?? ""}
                      placeholder="ISO 8601 timestamp"
                      className={`${inputClass} mt-1.5`}
                    />
                  </label>
                ))}
              </div>
            </AdminActionForm>
          </Panel>

          <Panel className="p-4">
            <h3 className="mb-3 font-semibold text-ink">Add note</h3>
            <AdminActionForm
              action={addOrderNote.bind(null, order.order_number)}
              submitLabel="Add note"
            >
              <label className={labelClass}>
                Visibility
                <select
                  name="visibility"
                  defaultValue="internal"
                  className={`${inputClass} mt-1.5`}
                >
                  <option value="internal">Internal</option>
                  <option value="customer">Customer</option>
                </select>
              </label>
              <label className={labelClass}>
                Note
                <textarea
                  name="body"
                  required
                  className={`${textareaClass} mt-1.5`}
                />
              </label>
            </AdminActionForm>
          </Panel>

          <Panel className="border-alert/25 p-4">
            <h3 className="mb-1 font-semibold text-alert">Refund</h3>
            <p className="mb-3 text-xs text-ink-3">
              Leave amount blank only for a full refund. Payment state remains
              backend-authoritative.
            </p>
            <AdminActionForm
              action={refundOrder.bind(null, order.order_number)}
              submitLabel="Submit refund"
              danger
            >
              <label className={labelClass}>
                Amount · {order.currency}
                <input
                  inputMode="decimal"
                  name="amount"
                  className={`${inputClass} mt-1.5`}
                />
              </label>
              <label className={labelClass}>
                Reason
                <input name="reason" className={`${inputClass} mt-1.5`} />
              </label>
            </AdminActionForm>
          </Panel>
        </div>
      </WorkspaceSection>
    </>
  );
}
