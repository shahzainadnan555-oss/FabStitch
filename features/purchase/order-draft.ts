import {
  isCountryCode,
  isCurrencyCode,
  marketForCountry,
  type CountryCode,
  type CurrencyCode,
} from "@/features/preferences/market";

export type OrderFabricIdentity = {
  id: string;
  slug: string;
  name: string;
  listingSlug: string | null;
};

export type OrderQuantity = {
  value: string;
  unit: "kg" | "m" | "yard" | "piece" | "roll" | null;
  minimum: number | null;
};

export type OrderContact = {
  accountId: string | null;
  name: string | null;
  email: string;
  phone: {
    countryCode: CountryCode;
    dialCode: string;
    nationalNumber: string;
  };
};

export type OrderShippingAddress = {
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  countryCode: CountryCode;
};

/**
 * Frontend-only order draft.
 *
 * This is intentionally not a network request body. A future service adapter
 * must map this view model to its approved contract rather than changing the
 * form state shape.
 */
export type OrderDraft = {
  fabric: OrderFabricIdentity;
  quantity: OrderQuantity;
  customer: OrderContact;
  shippingAddress: OrderShippingAddress;
  currency: CurrencyCode;
};

export type FutureOrderRecord = {
  orderId: string | null;
  customerId: string | null;
  customerName: string | null;
  customerEmail: string;
  customerPhone: {
    countryCode: CountryCode;
    dialCode: string;
    nationalNumber: string;
  };
  fabric: OrderFabricIdentity;
  quantity: OrderQuantity;
  shippingAddress: OrderShippingAddress;
  currency: CurrencyCode;
  amount: string | null;
  orderStatus: string | null;
  paymentStatus: string | null;
  createdAt: string | null;
};

export type OrderDraftField =
  | "fabric"
  | "quantity"
  | "email"
  | "phone"
  | "line1"
  | "city"
  | "region"
  | "postalCode"
  | "country"
  | "currency";

export type OrderDraftErrors = Partial<Record<OrderDraftField, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const POSTAL_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N}\s-]{2,14}$/u;

function digitCount(value: string): number {
  return value.replace(/\D/g, "").length;
}

export function validateOrderDraft(draft: OrderDraft): OrderDraftErrors {
  const errors: OrderDraftErrors = {};
  const quantity = Number(draft.quantity.value);

  if (!draft.fabric.id || !draft.fabric.slug || !draft.fabric.name) {
    errors.fabric = "The selected fabric is unavailable.";
  }
  if (!Number.isFinite(quantity) || quantity <= 0) {
    errors.quantity = "Enter a quantity greater than zero.";
  } else if (
    draft.quantity.minimum !== null &&
    quantity < draft.quantity.minimum
  ) {
    errors.quantity = `Enter at least ${draft.quantity.minimum}.`;
  }
  if (!EMAIL_PATTERN.test(draft.customer.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  const phoneDigits = digitCount(draft.customer.phone.nationalNumber);
  if (
    phoneDigits < 6 ||
    phoneDigits > 15 ||
    /[A-Za-z]/.test(draft.customer.phone.nationalNumber)
  ) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!draft.shippingAddress.line1.trim()) {
    errors.line1 = "Enter the delivery address.";
  }
  if (!draft.shippingAddress.city.trim()) {
    errors.city = "Enter the delivery city.";
  }
  if (!isCountryCode(draft.shippingAddress.countryCode)) {
    errors.country = "Select a supported country.";
  } else {
    const market = marketForCountry(draft.shippingAddress.countryCode);
    if (market.address.regionRequired && !draft.shippingAddress.region.trim()) {
      errors.region = `Enter the ${market.address.regionLabel?.toLowerCase() ?? "region"}.`;
    }
  }
  if (!POSTAL_PATTERN.test(draft.shippingAddress.postalCode.trim())) {
    errors.postalCode = "Enter a valid postal or ZIP code.";
  }
  if (!isCurrencyCode(draft.currency)) {
    errors.currency = "Select a supported currency.";
  }

  return errors;
}

export function futureOrderRecord(draft: OrderDraft): FutureOrderRecord {
  return {
    orderId: null,
    customerId: draft.customer.accountId,
    customerName: draft.customer.name,
    customerEmail: draft.customer.email.trim(),
    customerPhone: {
      ...draft.customer.phone,
      nationalNumber: draft.customer.phone.nationalNumber.trim(),
    },
    fabric: draft.fabric,
    quantity: draft.quantity,
    shippingAddress: {
      ...draft.shippingAddress,
      line1: draft.shippingAddress.line1.trim(),
      line2: draft.shippingAddress.line2.trim(),
      city: draft.shippingAddress.city.trim(),
      region: draft.shippingAddress.region.trim(),
      postalCode: draft.shippingAddress.postalCode.trim(),
    },
    currency: draft.currency,
    amount: null,
    orderStatus: null,
    paymentStatus: null,
    createdAt: null,
  };
}

export type OrderSubmissionResult = {
  ok: false;
  code: "ORDER_SERVICE_NOT_READY";
  draft: FutureOrderRecord;
};

/**
 * Fail closed until a future purchasing service can accept this order shape.
 * This function performs no network request and creates no local success.
 */
export async function submitOrderDraft(
  draft: OrderDraft,
): Promise<OrderSubmissionResult> {
  return {
    ok: false,
    code: "ORDER_SERVICE_NOT_READY",
    draft: futureOrderRecord(draft),
  };
}
