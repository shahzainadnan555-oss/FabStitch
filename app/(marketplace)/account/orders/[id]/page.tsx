import type { Metadata } from "next";
import { PageHeader } from "@/components/marketplace/page-header";
import { Container } from "@/components/ui/layout";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Alert, EmptyState } from "@/components/ui/state";
import { CustomerOrderActions } from "@/features/orders/customer-order-actions";
import { getCustomerOrder } from "@/repositories/customer-commerce";

export const metadata: Metadata = {
  title: "Order",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function statusPresentation(status: string): {
  label: string;
  tone: BadgeTone;
} {
  const normalized = status.toLowerCase();
  if (normalized === "delivered" || normalized === "paid")
    return { label: status.replaceAll("_", " "), tone: "verified" };
  if (normalized === "cancelled")
    return { label: "Cancelled", tone: "neutral" };
  if (
    normalized === "failed" ||
    normalized === "exception" ||
    normalized === "refunded"
  ) {
    return { label: status.replaceAll("_", " "), tone: "alert" };
  }
  if (normalized === "pending") return { label: "Pending", tone: "caution" };
  return { label: status.replaceAll("_", " "), tone: "neutral" };
}

function fullDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getCustomerOrder(id);

  if (
    !result.ok &&
    (result.error.status === 404 || result.error.status === 403)
  ) {
    return (
      <>
        <PageHeader
          crumbs={[
            { label: "Account", href: "/account/" },
            { label: "Orders", href: "/account/orders/" },
            { label: "Not found" },
          ]}
          title="Order not found"
        />
        <Container className="py-8 sm:py-10">
          <EmptyState
            title="Order not found"
            description="This order is not available on your account."
            action={
              <ButtonLink href="/account/orders/" variant="primary">
                All orders
              </ButtonLink>
            }
          />
        </Container>
      </>
    );
  }

  if (!result.ok) {
    return (
      <>
        <PageHeader title="Order" />
        <Container className="py-8 sm:py-10">
          <Alert tone="alert" title="We couldn't load this order">
            <p>Please try again.</p>
          </Alert>
        </Container>
      </>
    );
  }

  const order = result.data;
  const status = statusPresentation(order.status);

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Account", href: "/account/" },
          { label: "Orders", href: "/account/orders/" },
          { label: order.order_number },
        ]}
        title={order.order_number}
        action={
          <ButtonLink href="/account/orders/" variant="secondary">
            All orders
          </ButtonLink>
        }
      />
      <Container className="py-8 sm:py-10">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={status.tone}>{status.label}</Badge>
          <p className="text-sm text-ink-3">
            Submitted {fullDate(order.submitted_at)}
          </p>
        </div>
        <ul className="mt-8 divide-y divide-rule border-y border-rule">
          {order.items.map((item) => (
            <li key={`${item.listing_id}-${item.fabric_slug}`} className="py-4">
              <p className="font-semibold text-ink">{item.fabric_name}</p>
              <p className="mt-1 text-sm text-ink-3">
                {item.quantity} {item.quantity_unit}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <CustomerOrderActions
            orderNumber={order.order_number}
            status={order.status}
          />
        </div>
      </Container>
    </>
  );
}
