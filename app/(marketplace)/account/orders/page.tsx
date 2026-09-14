import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/marketplace/page-header";
import { Container } from "@/components/ui/layout";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Alert, EmptyState } from "@/components/ui/state";
import { listCustomerOrders } from "@/repositories/customer-commerce";

export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

function pageNumber(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function statusPresentation(status: string): {
  label: string;
  tone: BadgeTone;
} {
  const normalized = status.toLowerCase();
  if (normalized === "delivered")
    return { label: "Delivered", tone: "verified" };
  if (normalized === "cancelled")
    return { label: "Cancelled", tone: "neutral" };
  if (normalized === "failed") return { label: "Failed", tone: "alert" };
  if (normalized === "draft") return { label: "Draft", tone: "neutral" };
  if (normalized === "pending") return { label: "Pending", tone: "caution" };
  return { label: status.replaceAll("_", " "), tone: "indigo" };
}

function shortDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export default async function AccountOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const query = await searchParams;
  const page = pageNumber(query.page);
  const result = await listCustomerOrders({
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Account", href: "/account/" }, { label: "Orders" }]}
        title="Orders"
        intro="Orders recorded for your FabStitch account."
      />
      <Container className="py-8 sm:py-10">
        {!result.ok ? (
          <div>
            <Alert tone="alert" title="We couldn't load your orders">
              <p>Please try again.</p>
            </Alert>
            <ButtonLink
              href={
                page > 1 ? `/account/orders/?page=${page}` : "/account/orders/"
              }
              variant="secondary"
              className="mt-5"
            >
              Try again
            </ButtonLink>
          </div>
        ) : result.data.items.length === 0 ? (
          <EmptyState
            eyebrow="Orders"
            title="No orders yet"
            description="When an order is recorded for your account, it will appear here."
            action={
              <ButtonLink href="/marketplace/" variant="primary">
                Explore Fabrics
              </ButtonLink>
            }
          />
        ) : (
          <ul className="divide-y divide-rule border-y border-rule">
            {result.data.items.map((order) => {
              const status = statusPresentation(order.status);
              return (
                <li key={order.order_number}>
                  <Link
                    href={`/account/orders/${encodeURIComponent(order.order_number)}/`}
                    className="group grid gap-3 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                  >
                    <div>
                      <p className="font-mono text-label tracking-[0.1em] text-ink-4 uppercase">
                        {order.order_number}
                      </p>
                      <p className="mt-1.5 text-h3 font-semibold text-ink group-hover:text-indigo">
                        {order.primary_item_summary ?? "Order"}
                      </p>
                      <p className="mt-1 text-sm text-ink-3">
                        {shortDate(order.submitted_at)}
                      </p>
                    </div>
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </>
  );
}
