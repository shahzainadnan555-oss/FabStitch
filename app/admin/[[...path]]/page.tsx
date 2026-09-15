import { redirect } from "next/navigation";

/**
 * Admin UI is temporarily disabled on the customer-facing frontend.
 * All former `/admin/*` routes redirect to the storefront home.
 */
export default function AdminUnavailable() {
  redirect("/");
}
