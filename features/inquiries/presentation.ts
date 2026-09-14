import type { BadgeTone } from "@/components/ui/badge";

export function inquiryStatus(status: string): {
  label: string;
  tone: BadgeTone;
} {
  switch (status.toUpperCase()) {
    case "NEW":
      return { label: "NEW", tone: "caution" };
    case "CONTACTED":
      return { label: "CONTACTED", tone: "indigo" };
    case "IN_PROGRESS":
      return { label: "IN_PROGRESS", tone: "indigo" };
    case "COMPLETED":
      return { label: "COMPLETED", tone: "verified" };
    case "CANCELLED":
      return { label: "CANCELLED", tone: "neutral" };
    default:
      return { label: status.replaceAll("_", " "), tone: "neutral" };
  }
}

export function inquiryDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export function inquiryDateTime(value: string | null | undefined): string {
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
