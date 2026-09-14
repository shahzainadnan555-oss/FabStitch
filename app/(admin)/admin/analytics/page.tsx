import type { Metadata } from "next";
import { WorkspaceHeader } from "@/components/layout/workspace-shell";
import {
  MetricRow,
  WorkspaceSection,
} from "@/components/marketplace/workspace-blocks";
import { getAdminAnalytics } from "@/features/admin/api";
import { CountList } from "@/features/admin/components";

export const metadata: Metadata = { title: "Admin analytics" };

export default async function AdminAnalyticsPage() {
  const [orders, customers, fabrics, countries, payments] =
    await getAdminAnalytics();

  return (
    <>
      <WorkspaceHeader
        title="Analytics"
        description="Backend aggregates only. No traffic, conversion or revenue claims are inferred on the frontend."
      />
      <div className="px-4 pt-6 sm:px-6">
        <MetricRow
          metrics={[
            { label: "Orders · all time", value: orders.total },
            { label: "Orders · today", value: orders.today },
            { label: "Customers · all time", value: customers.total },
            { label: "Active customers · 30d", value: customers.active_30d },
          ]}
        />
      </div>
      <WorkspaceSection title="Orders">
        <div className="grid gap-4 lg:grid-cols-3">
          <CountList
            title="By status"
            items={orders.by_status.map((item) => ({
              key: item.status,
              label: item.status.replaceAll("_", " "),
              count: item.count,
            }))}
          />
          <CountList title="Daily trend" items={orders.trend_daily} />
          <CountList
            title="Payment status"
            items={payments.by_status.map((item) => ({
              key: item.status,
              label: item.status.replaceAll("_", " "),
              count: item.count,
            }))}
          />
        </div>
      </WorkspaceSection>
      <WorkspaceSection title="Customers and countries">
        <div className="grid gap-4 lg:grid-cols-3">
          <CountList
            title="Customers by country"
            items={customers.by_country}
          />
          <CountList
            title="Orders by country"
            items={countries.orders_by_country}
          />
          <CountList
            title="Customer distribution"
            items={countries.customers_by_country}
          />
        </div>
      </WorkspaceSection>
      <WorkspaceSection title="Catalog demand">
        <div className="grid gap-4 lg:grid-cols-3">
          <CountList
            title="Most ordered fabrics"
            items={fabrics.most_ordered}
          />
          <CountList title="Fabrics by family" items={fabrics.by_family} />
          <CountList
            title="Paid amount by currency · raw API units"
            items={payments.paid_amount_by_currency}
          />
        </div>
      </WorkspaceSection>
    </>
  );
}
