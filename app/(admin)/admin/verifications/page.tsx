import { redirect } from "next/navigation";

export default function AdminVerificationsPage() {
  redirect("/admin/suppliers?verification_status=pending");
}
