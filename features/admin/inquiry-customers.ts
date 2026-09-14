import "server-only";

import { ApiError } from "@/lib/api/errors";
import { getAdminCustomer } from "./api";
import type { AdminCustomer } from "./types";

export async function loadInquiryCustomers(
  customerIds: string[],
): Promise<Map<string, AdminCustomer>> {
  const unique = [...new Set(customerIds.filter(Boolean))];
  const entries = await Promise.all(
    unique.map(async (id) => {
      try {
        return [id, await getAdminCustomer(id)] as const;
      } catch (error) {
        if (error instanceof ApiError) {
          return [id, null] as const;
        }
        throw error;
      }
    }),
  );
  return new Map(
    entries.flatMap(([id, customer]) => (customer ? [[id, customer]] : [])),
  );
}
