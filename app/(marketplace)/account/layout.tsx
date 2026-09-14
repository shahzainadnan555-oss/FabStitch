import { requireCustomer } from "@/features/auth/server-session";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireCustomer("/account/");
  return children;
}
