import type { Metadata } from "next";
import { AccountProfilePage } from "@/features/account/account-profile-page";

export const metadata: Metadata = {
  title: "Account profile",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountProfilePage />;
}
