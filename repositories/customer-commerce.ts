import "server-only";

import { ApiError } from "@/lib/api/errors";
import { serverApi } from "@/lib/api/server";
import type { Inquiry, InquiryPage, Order, OrderPage } from "@/lib/api/types";

export type CommerceFailure = {
  status: number;
  code: string;
  message: string;
  requestId?: string;
};

export type CommerceResult<T> =
  { ok: true; data: T } | { ok: false; error: CommerceFailure };

function failed(error: unknown, fallback: string): CommerceResult<never> {
  if (error instanceof ApiError) {
    return {
      ok: false,
      error: {
        status: error.status,
        code: error.code,
        message: error.message,
        requestId: error.requestId,
      },
    };
  }

  return {
    ok: false,
    error: {
      status: 0,
      code: "request_failed",
      message: fallback,
    },
  };
}

export async function listCustomerInquiries(options: {
  limit: number;
  offset: number;
}): Promise<CommerceResult<InquiryPage>> {
  try {
    const data = await serverApi.get<InquiryPage>("/me/inquiries", {
      query: options,
    });
    return { ok: true, data };
  } catch (error) {
    return failed(error, "FabStitch could not load your inquiries.");
  }
}

export async function getCustomerInquiry(
  inquiryId: string,
): Promise<CommerceResult<Inquiry>> {
  try {
    const data = await serverApi.get<Inquiry>(
      `/me/inquiries/${encodeURIComponent(inquiryId)}`,
    );
    return { ok: true, data };
  } catch (error) {
    return failed(error, "FabStitch could not load this inquiry.");
  }
}

export async function listCustomerOrders(options: {
  limit: number;
  offset: number;
}): Promise<CommerceResult<OrderPage>> {
  try {
    const data = await serverApi.get<OrderPage>("/orders", {
      query: options,
    });
    return { ok: true, data };
  } catch (error) {
    return failed(error, "FabStitch could not load your orders.");
  }
}

export async function getCustomerOrder(
  orderNumber: string,
): Promise<CommerceResult<Order>> {
  try {
    const data = await serverApi.get<Order>(
      `/orders/${encodeURIComponent(orderNumber)}`,
    );
    return { ok: true, data };
  } catch (error) {
    return failed(error, "FabStitch could not load this order.");
  }
}
