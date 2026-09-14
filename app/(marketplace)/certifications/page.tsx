import { redirect } from "next/navigation";

/**
 * Certification records remain part of internal verification, but are no
 * longer a buyer-facing discovery category.
 */
export default function CertificationsPage() {
  redirect("/marketplace/");
}
