import {
  SUPPORTED_CURRENCIES,
  type CurrencyCode,
} from "@/features/preferences/market";

export const DISPLAY_CURRENCIES = SUPPORTED_CURRENCIES;
export type DisplayCurrency = CurrencyCode;

export type PurchaseIntent = {
  listingSlug: string;
  application?: string;
  quantity: string;
  unit: string;
  currency: DisplayCurrency;
};

/**
 * Direct payment is not a backend capability yet. A Buy Now action therefore
 * enters the real RFQ contract with its product and quantity intact. An order
 * can only be created later from an accepted quote.
 */
export function purchaseIntentHref(intent: PurchaseIntent): string {
  const query = new URLSearchParams({
    listing: intent.listingSlug,
    quantity: intent.quantity,
    unit: intent.unit,
    currency: intent.currency,
    intent: "purchase",
  });
  if (intent.application) query.set("application", intent.application);
  return `/rfq/?${query.toString()}`;
}
