import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  WorkspaceShell,
  type WorkspaceNavGroup,
} from "@/components/layout/workspace-shell";
import { ApiError } from "@/lib/api/errors";
import { getAdminSession } from "@/features/admin/api";
import { AdminRealtime } from "@/features/admin/realtime";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const GROUPS: WorkspaceNavGroup[] = [
  {
    heading: "Operations",
    items: [
      { label: "Overview", href: "/admin/dashboard" },
      { label: "Orders", href: "/admin/orders" },
      { label: "Inquiries", href: "/admin/inquiries" },
      { label: "Customers", href: "/admin/customers" },
    ],
  },
  {
    heading: "Supply",
    items: [
      { label: "Fabrics", href: "/admin/fabrics" },
      { label: "Suppliers", href: "/admin/suppliers" },
    ],
  },
  {
    heading: "Intelligence",
    items: [
      { label: "Analytics", href: "/admin/analytics" },
      { label: "Search", href: "/admin/search" },
      { label: "Audit log", href: "/admin/audit" },
    ],
  },
  {
    heading: "System",
    items: [
      { label: "SEO", href: "/admin/seo" },
      { label: "Backend health", href: "/admin/backend-health" },
    ],
  },
];

export default async function AdminLayout({ children }: LayoutProps<"/">) {
  let session;
  try {
    session = await getAdminSession();
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      redirect("/login/?next=%2Fadmin%2Fdashboard%2F");
    }
    throw error;
  }

  return (
    <WorkspaceShell workspace="Admin" email={session.email} groups={GROUPS}>
      <AdminRealtime />
      {children}
    </WorkspaceShell>
  );
}
