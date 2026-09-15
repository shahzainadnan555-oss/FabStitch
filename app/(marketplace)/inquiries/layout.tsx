import { RequireCustomer } from "@/features/auth/require-customer";

export default function InquiriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireCustomer returnTo="/inquiries/">{children}</RequireCustomer>;
}
