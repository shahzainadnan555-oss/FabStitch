"use server";

import { revalidatePath } from "next/cache";
import type { components } from "@/lib/api/schema";
import { apiErrorMessage } from "@/lib/api/errors";
import { serverApi } from "@/lib/api/server";
import type {
  AdminActionState,
  AdminCustomer,
  AdminFabric,
  AdminFabricCreate,
  AdminFabricUpdate,
  AdminInquiry,
  AdminOrder,
  AdminSession,
  AdminSupplier,
  SupplierVerification,
} from "./types";

type Schema = components["schemas"];

function text(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function optionalText(formData: FormData, name: string): string | null {
  return text(formData, name) || null;
}

async function requireAdmin() {
  await serverApi.get<AdminSession>("/admin/me");
}

async function runMutation(
  mutation: () => Promise<unknown>,
  successMessage: string,
  paths: string[],
): Promise<AdminActionState> {
  try {
    await requireAdmin();
    await mutation();
    for (const path of paths) revalidatePath(path);
    revalidatePath("/admin/dashboard");
    return { status: "success", message: successMessage };
  } catch (error) {
    return {
      status: "error",
      message: apiErrorMessage(
        error,
        "The admin request could not be completed.",
      ),
    };
  }
}

export async function updateOrderStatus(
  orderNumber: string,
  _previous: AdminActionState,
  formData: FormData,
) {
  const body: Schema["AdminTransitionRequest"] = {
    status: text(formData, "status"),
    reason: optionalText(formData, "reason"),
    sync_fulfillment: formData.get("sync_fulfillment") === "on",
  };
  return runMutation(
    () =>
      serverApi.post<AdminOrder, typeof body>(
        `/admin/orders/${encodeURIComponent(orderNumber)}/transition`,
        { body },
      ),
    `Order ${orderNumber} status updated.`,
    ["/admin/orders", `/admin/orders/${orderNumber}`],
  );
}

export async function updateFulfillmentStatus(
  orderNumber: string,
  _previous: AdminActionState,
  formData: FormData,
) {
  const body: Schema["AdminFulfillmentTransitionRequest"] = {
    fulfillment_status: text(formData, "fulfillment_status"),
    reason: optionalText(formData, "reason"),
  };
  return runMutation(
    () =>
      serverApi.post<AdminOrder, typeof body>(
        `/admin/orders/${encodeURIComponent(orderNumber)}/fulfillment`,
        { body },
      ),
    `Order ${orderNumber} fulfillment updated.`,
    ["/admin/orders", `/admin/orders/${orderNumber}`],
  );
}

export async function updateOrderTracking(
  orderNumber: string,
  _previous: AdminActionState,
  formData: FormData,
) {
  const body: Schema["AdminTrackingUpsertRequest"] = {
    carrier: optionalText(formData, "carrier"),
    tracking_number: optionalText(formData, "tracking_number"),
    tracking_url: optionalText(formData, "tracking_url"),
    shipped_at: optionalText(formData, "shipped_at"),
    estimated_delivery_at: optionalText(formData, "estimated_delivery_at"),
    delivered_at: optionalText(formData, "delivered_at"),
  };
  return runMutation(
    () =>
      serverApi.put<AdminOrder, typeof body>(
        `/admin/orders/${encodeURIComponent(orderNumber)}/tracking`,
        { body },
      ),
    `Tracking for ${orderNumber} updated.`,
    [`/admin/orders/${orderNumber}`],
  );
}

export async function addOrderNote(
  orderNumber: string,
  _previous: AdminActionState,
  formData: FormData,
) {
  const body: Schema["AdminNoteCreateRequest"] = {
    body: text(formData, "body"),
    visibility: text(formData, "visibility") || "internal",
  };
  return runMutation(
    () =>
      serverApi.post<AdminOrder, typeof body>(
        `/admin/orders/${encodeURIComponent(orderNumber)}/notes`,
        { body },
      ),
    `Note added to ${orderNumber}.`,
    [`/admin/orders/${orderNumber}`],
  );
}

export async function refundOrder(
  orderNumber: string,
  _previous: AdminActionState,
  formData: FormData,
) {
  const amount = optionalText(formData, "amount");
  const body: Schema["AdminRefundRequest"] = {
    amount,
    reason: optionalText(formData, "reason"),
  };
  return runMutation(
    () =>
      serverApi.post<Schema["RefundOut"], typeof body>(
        `/admin/orders/${encodeURIComponent(orderNumber)}/refunds`,
        { body },
      ),
    `Refund request for ${orderNumber} accepted.`,
    ["/admin/orders", `/admin/orders/${orderNumber}`],
  );
}

export async function changeCustomerStatus(
  customerId: string,
  operation: "suspend" | "disable" | "reactivate",
  _previous: AdminActionState,
  formData: FormData,
) {
  const body: Schema["CustomerActionRequest"] = {
    reason: optionalText(formData, "reason"),
  };
  return runMutation(
    () =>
      serverApi.post<AdminCustomer, typeof body>(
        `/admin/customers/${encodeURIComponent(customerId)}/${operation}`,
        { body },
      ),
    `Customer ${operation} action completed.`,
    ["/admin/customers", `/admin/customers/${customerId}`],
  );
}

export async function createFabric(
  _previous: AdminActionState,
  formData: FormData,
) {
  const body: AdminFabricCreate = {
    name: text(formData, "name"),
    slug: optionalText(formData, "slug"),
    family_code: text(formData, "family_code"),
    summary: optionalText(formData, "summary"),
    description: optionalText(formData, "description"),
    status: text(formData, "status") || "draft",
  };
  return runMutation(
    () =>
      serverApi.post<AdminFabric, AdminFabricCreate>("/admin/fabrics", {
        body,
      }),
    "Fabric listing created.",
    ["/admin/fabrics"],
  );
}

export async function updateFabric(
  listingId: string,
  _previous: AdminActionState,
  formData: FormData,
) {
  const weightClass = optionalText(formData, "weight_class");
  const body: AdminFabricUpdate = {
    name: optionalText(formData, "name"),
    slug: optionalText(formData, "slug"),
    summary: optionalText(formData, "summary"),
    description: optionalText(formData, "description"),
    is_featured: formData.get("is_featured") === "on",
    ...(weightClass ? { weight_class: weightClass } : {}),
  };
  return runMutation(
    () =>
      serverApi.patch<AdminFabric, AdminFabricUpdate>(
        `/admin/fabrics/${encodeURIComponent(listingId)}`,
        { body },
      ),
    "Fabric listing updated.",
    ["/admin/fabrics", `/admin/fabrics/${listingId}`],
  );
}

export async function changeFabricPublication(
  listingId: string,
  operation: "publish" | "unpublish" | "archive",
  _previous: AdminActionState,
  _formData: FormData,
) {
  return runMutation(
    () =>
      serverApi.post<AdminFabric>(
        `/admin/fabrics/${encodeURIComponent(listingId)}/${operation}`,
      ),
    `Fabric ${operation} action completed.`,
    ["/admin/fabrics", `/admin/fabrics/${listingId}`],
  );
}

export async function updateInquiryStatus(
  inquiryId: string,
  _previous: AdminActionState,
  formData: FormData,
) {
  const body: Schema["UpdateInquiryStatusRequest"] = {
    status: text(formData, "status"),
    note: optionalText(formData, "note"),
  };
  return runMutation(
    () =>
      serverApi.patch<AdminInquiry, typeof body>(
        `/admin/inquiries/${encodeURIComponent(inquiryId)}/status`,
        { body },
      ),
    "Inquiry status updated.",
    ["/admin/inquiries", `/admin/inquiries/${inquiryId}`],
  );
}

export async function createSupplier(
  _previous: AdminActionState,
  formData: FormData,
) {
  const contactEmail = optionalText(formData, "contact_email");
  const contactName = optionalText(formData, "contact_name");
  const body: Schema["SupplierCreateRequest"] = {
    legal_name: text(formData, "legal_name"),
    display_name: optionalText(formData, "display_name"),
    country_code: optionalText(formData, "country_code"),
    business_type: optionalText(formData, "business_type"),
    website: optionalText(formData, "website"),
    contact:
      contactEmail || contactName
        ? {
            contact_name: contactName,
            email: contactEmail,
            phone: optionalText(formData, "contact_phone"),
            address_line1: null,
            address_line2: null,
            city: null,
            region: null,
            postal_code: null,
            country_code: optionalText(formData, "country_code"),
            is_primary: true,
          }
        : null,
  };
  return runMutation(
    () =>
      serverApi.post<AdminSupplier, typeof body>("/admin/suppliers", { body }),
    "Supplier prospect created.",
    ["/admin/suppliers"],
  );
}

export async function changeSupplierStatus(
  supplierId: string,
  operation: "suspend" | "reactivate",
  _previous: AdminActionState,
  formData: FormData,
) {
  const path = `/admin/suppliers/${encodeURIComponent(supplierId)}/${operation}`;
  return runMutation(
    () =>
      operation === "suspend"
        ? serverApi.post<AdminSupplier, Schema["SuspendRequest"]>(path, {
            body: { reason: optionalText(formData, "reason") },
          })
        : serverApi.post<AdminSupplier>(path),
    `Supplier ${operation} action completed.`,
    ["/admin/suppliers", `/admin/suppliers/${supplierId}`],
  );
}

export async function submitSupplierVerification(
  supplierId: string,
  _previous: AdminActionState,
  formData: FormData,
) {
  const body: Schema["VerificationSubmitRequest"] = {
    internal_notes: optionalText(formData, "internal_notes"),
  };
  return runMutation(
    () =>
      serverApi.post<SupplierVerification, typeof body>(
        `/admin/suppliers/${encodeURIComponent(supplierId)}/verification`,
        { body },
      ),
    "Verification packet submitted.",
    [`/admin/suppliers/${supplierId}`],
  );
}

export async function reviewSupplierVerification(
  supplierId: string,
  _previous: AdminActionState,
  formData: FormData,
) {
  const body: Schema["VerificationReviewRequest"] = {
    action: text(formData, "action"),
    rejection_reason: optionalText(formData, "rejection_reason"),
    internal_notes: optionalText(formData, "internal_notes"),
    expires_at: optionalText(formData, "expires_at"),
  };
  return runMutation(
    () =>
      serverApi.patch<SupplierVerification, typeof body>(
        `/admin/suppliers/${encodeURIComponent(supplierId)}/verification`,
        { body },
      ),
    "Supplier verification reviewed.",
    ["/admin/suppliers", `/admin/suppliers/${supplierId}`],
  );
}
