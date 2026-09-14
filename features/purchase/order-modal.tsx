"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/field";
import { IconClose } from "@/components/ui/icon";
import { FabricMedia } from "@/components/marketplace/fabric-media";
import {
  SUPPORTED_MARKETS,
  marketForCountry,
  type CountryCode,
} from "@/features/preferences/market";
import { useMarketPreferences } from "@/features/preferences/market-preferences";
import {
  submitOrderDraft,
  validateOrderDraft,
  type OrderDraft,
  type OrderDraftErrors,
} from "./order-draft";
import type { OrderFlowFabric } from "./order-flow";

type FormValues = {
  quantity: string;
  email: string;
  phoneCountry: CountryCode;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  shippingCountry: CountryCode;
};

function nationalPhone(phone: string, dialCode: string): string {
  const trimmed = phone.trim();
  if (trimmed.startsWith(dialCode)) {
    return trimmed.slice(dialCode.length).trim();
  }
  return trimmed;
}

export function OrderModal({
  open,
  onClose,
  fabric,
}: {
  open: boolean;
  onClose: () => void;
  fabric: OrderFlowFabric;
}) {
  const { country, currency, contactPrefill } = useMarketPreferences();
  const [values, setValues] = useState<FormValues>(() => ({
    quantity: String(fabric.minimum ?? 1),
    email: "",
    phoneCountry: country,
    phone: "",
    line1: "",
    line2: "",
    city: "",
    region: "",
    postalCode: "",
    shippingCountry: country,
  }));
  const [errors, setErrors] = useState<OrderDraftErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const shippingCountryTouched = useRef(false);
  const phoneCountryTouched = useRef(false);

  const shippingMarket = useMemo(
    () => marketForCountry(values.shippingCountry),
    [values.shippingCountry],
  );
  const phoneMarket = useMemo(
    () => marketForCountry(values.phoneCountry),
    [values.phoneCountry],
  );

  useEffect(() => {
    if (!open) return;
    setValues((current) => {
      const selectedPhoneCountry = phoneCountryTouched.current
        ? current.phoneCountry
        : country;
      const selectedPhoneMarket = marketForCountry(selectedPhoneCountry);
      return {
        ...current,
        shippingCountry: shippingCountryTouched.current
          ? current.shippingCountry
          : country,
        phoneCountry: selectedPhoneCountry,
        email: current.email || contactPrefill?.email || "",
        phone:
          current.phone ||
          nationalPhone(
            contactPrefill?.phone ?? "",
            selectedPhoneMarket.dialCode,
          ),
      };
    });
  }, [contactPrefill, country, open]);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmissionError(null);
  }

  function quantityBy(delta: number) {
    const current = Number(values.quantity);
    const floor = fabric.minimum ?? 1;
    const next = Math.max(
      floor,
      (Number.isFinite(current) ? current : floor) + delta,
    );
    update("quantity", String(next));
  }

  function draft(): OrderDraft {
    return {
      fabric: {
        id: fabric.id,
        slug: fabric.slug,
        name: fabric.name,
        listingSlug: fabric.listingSlug,
      },
      quantity: {
        value: values.quantity,
        unit: fabric.quantityUnit,
        minimum: fabric.minimum,
      },
      customer: {
        accountId: contactPrefill?.accountId ?? null,
        name: contactPrefill?.name ?? null,
        email: values.email,
        phone: {
          countryCode: values.phoneCountry,
          dialCode: phoneMarket.dialCode,
          nationalNumber: values.phone,
        },
      },
      shippingAddress: {
        line1: values.line1,
        line2: values.line2,
        city: values.city,
        region: values.region,
        postalCode: values.postalCode,
        countryCode: values.shippingCountry,
      },
      currency,
    };
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const orderDraft = draft();
    const nextErrors = validateOrderDraft(orderDraft);
    setErrors(nextErrors);
    setSubmissionError(null);
    if (Object.keys(nextErrors).length > 0) {
      requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus();
      });
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitOrderDraft(orderDraft);
      if (!result.ok) {
        setSubmissionError(
          "Frontend preview complete. Ordering and payment are not connected, so nothing was submitted, charged or recorded.",
        );
      }
    } catch {
      setSubmissionError(
        "We couldn't submit your order. Please try again. Your details are still in this form.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const asset = fabric.imageSrc
    ? { src: fabric.imageSrc, alt: fabric.imageAlt }
    : undefined;

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!submitting) onClose();
      }}
      label={`Order ${fabric.name}`}
      dismissOnBackdrop={!submitting}
      className="h-[100dvh] max-w-[46rem] rounded-none sm:h-auto sm:rounded-lg"
    >
      <div className="flex min-h-0 w-full flex-col">
        <div className="flex items-start justify-between gap-5 border-b border-rule px-5 py-4 sm:px-6">
          <div>
            <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
              Order details
            </p>
            <h2 className="mt-1 text-h2 font-semibold text-ink">
              Order {fabric.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="grid size-9 shrink-0 place-items-center rounded-sm text-ink-3 hover:bg-paper-sunk hover:text-ink disabled:cursor-wait"
          >
            <span className="sr-only">Close order form</span>
            <IconClose width={17} height={17} aria-hidden />
          </button>
        </div>

        <form
          ref={formRef}
          noValidate
          onSubmit={submit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <div
              data-order-fabric-slug={fabric.slug}
              className="grid grid-cols-[5.75rem_1fr] gap-4 rounded-sm border border-rule bg-paper-sunk p-3"
            >
              <FabricMedia
                listing={fabric.mediaSubject}
                asset={asset}
                aspect="4/3"
                showLabel={false}
                sizes="92px"
                className="overflow-hidden rounded-xs"
              />
              <div className="min-w-0 self-center">
                <p className="font-mono text-label text-ink-4 uppercase">
                  Selected fabric
                </p>
                <p className="mt-1 font-semibold text-ink">{fabric.name}</p>
                <p className="mt-1 text-xs text-ink-3">
                  {fabric.quantityUnit
                    ? `Quantity unit: ${fabric.quantityUnit}`
                    : "Commercial unit pending; none has been assumed."}
                </p>
              </div>
            </div>

            <section className="mt-5" aria-labelledby="order-quantity-heading">
              <h3
                id="order-quantity-heading"
                className="text-sm font-semibold text-ink"
              >
                Quantity
              </h3>
              <Field
                label="Quantity"
                labelHidden
                error={errors.quantity}
                hint={
                  fabric.minimum !== null && fabric.quantityUnit
                    ? `Published minimum: ${fabric.minimum} ${fabric.quantityUnit}`
                    : "Enter the amount you need. The unit must be confirmed before a real order can be created."
                }
              >
                {({ id, describedBy, invalid }) => (
                  <div className="grid grid-cols-[2.75rem_1fr_2.75rem_auto] gap-2">
                    <button
                      type="button"
                      onClick={() => quantityBy(-1)}
                      className="grid h-10 place-items-center rounded-sm border border-border bg-paper-raised text-lg text-ink hover:border-indigo"
                    >
                      <span aria-hidden>−</span>
                      <span className="sr-only">Decrease quantity</span>
                    </button>
                    <Input
                      id={id}
                      name="quantity"
                      type="number"
                      inputMode="decimal"
                      min={fabric.minimum ?? "0.01"}
                      step="any"
                      value={values.quantity}
                      onChange={(event) =>
                        update("quantity", event.target.value)
                      }
                      aria-describedby={describedBy}
                      invalid={invalid}
                    />
                    <button
                      type="button"
                      onClick={() => quantityBy(1)}
                      className="grid h-10 place-items-center rounded-sm border border-border bg-paper-raised text-lg text-ink hover:border-indigo"
                    >
                      <span aria-hidden>+</span>
                      <span className="sr-only">Increase quantity</span>
                    </button>
                    <span className="grid h-10 min-w-16 place-items-center rounded-sm bg-paper-sunk px-3 font-mono text-xs text-ink-3">
                      {fabric.quantityUnit ?? "Unit pending"}
                    </span>
                  </div>
                )}
              </Field>
            </section>

            <section className="mt-6" aria-labelledby="order-contact-heading">
              <h3
                id="order-contact-heading"
                className="text-sm font-semibold text-ink"
              >
                Contact
              </h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="Email" error={errors.email}>
                  {({ id, describedBy, invalid }) => (
                    <Input
                      id={id}
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(event) => update("email", event.target.value)}
                      aria-describedby={describedBy}
                      invalid={invalid}
                    />
                  )}
                </Field>
                <Field
                  label="Phone number"
                  error={errors.phone}
                  hint="For order contact only. No verification code is sent."
                >
                  {({ id, describedBy, invalid }) => (
                    <div className="grid grid-cols-[7.25rem_1fr] gap-2">
                      <Select
                        aria-label="Phone country code"
                        value={values.phoneCountry}
                        onChange={(event) => {
                          phoneCountryTouched.current = true;
                          update(
                            "phoneCountry",
                            event.target.value as CountryCode,
                          );
                        }}
                      >
                        {SUPPORTED_MARKETS.map((market) => (
                          <option
                            key={market.countryCode}
                            value={market.countryCode}
                          >
                            {market.countryCode} {market.dialCode}
                          </option>
                        ))}
                      </Select>
                      <Input
                        id={id}
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder="Phone number"
                        value={values.phone}
                        onChange={(event) =>
                          update("phone", event.target.value)
                        }
                        aria-describedby={describedBy}
                        invalid={invalid}
                      />
                    </div>
                  )}
                </Field>
              </div>
            </section>

            <section className="mt-6" aria-labelledby="order-delivery-heading">
              <h3
                id="order-delivery-heading"
                className="text-sm font-semibold text-ink"
              >
                Delivery
              </h3>
              <p className="mt-1 text-sm text-ink-3">
                Where should we deliver your order?
              </p>

              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Address line 1" error={errors.line1}>
                    {({ id, describedBy, invalid }) => (
                      <Input
                        id={id}
                        name="address-line-1"
                        autoComplete="shipping address-line1"
                        value={values.line1}
                        onChange={(event) =>
                          update("line1", event.target.value)
                        }
                        aria-describedby={describedBy}
                        invalid={invalid}
                      />
                    )}
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Address line 2 (optional)">
                    {({ id, describedBy, invalid }) => (
                      <Input
                        id={id}
                        name="address-line-2"
                        autoComplete="shipping address-line2"
                        value={values.line2}
                        onChange={(event) =>
                          update("line2", event.target.value)
                        }
                        aria-describedby={describedBy}
                        invalid={invalid}
                      />
                    )}
                  </Field>
                </div>
                <Field label="Country" error={errors.country}>
                  {({ id, describedBy, invalid }) => (
                    <Select
                      id={id}
                      name="shipping-country"
                      autoComplete="shipping country"
                      value={values.shippingCountry}
                      onChange={(event) => {
                        shippingCountryTouched.current = true;
                        const shippingCountry = event.target
                          .value as CountryCode;
                        const nextMarket = marketForCountry(shippingCountry);
                        setValues((current) => ({
                          ...current,
                          shippingCountry,
                          region: nextMarket.address.regionLabel
                            ? current.region
                            : "",
                        }));
                        setErrors((current) => ({
                          ...current,
                          country: undefined,
                          region: undefined,
                          postalCode: undefined,
                        }));
                        setSubmissionError(null);
                      }}
                      aria-describedby={describedBy}
                      invalid={invalid}
                    >
                      {SUPPORTED_MARKETS.map((market) => (
                        <option
                          key={market.countryCode}
                          value={market.countryCode}
                        >
                          {market.countryName}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
                <Field
                  label={shippingMarket.address.cityLabel}
                  error={errors.city}
                >
                  {({ id, describedBy, invalid }) => (
                    <Input
                      id={id}
                      name="city"
                      autoComplete="shipping address-level2"
                      value={values.city}
                      onChange={(event) => update("city", event.target.value)}
                      aria-describedby={describedBy}
                      invalid={invalid}
                    />
                  )}
                </Field>
                {shippingMarket.address.regionLabel ? (
                  <Field
                    label={`${shippingMarket.address.regionLabel}${shippingMarket.address.regionRequired ? "" : " (optional)"}`}
                    error={errors.region}
                  >
                    {({ id, describedBy, invalid }) => (
                      <Input
                        id={id}
                        name="region"
                        autoComplete="shipping address-level1"
                        value={values.region}
                        onChange={(event) =>
                          update("region", event.target.value)
                        }
                        aria-describedby={describedBy}
                        invalid={invalid}
                      />
                    )}
                  </Field>
                ) : null}
                <Field
                  label={shippingMarket.address.postalLabel}
                  error={errors.postalCode}
                >
                  {({ id, describedBy, invalid }) => (
                    <Input
                      id={id}
                      name="postal-code"
                      inputMode={
                        values.shippingCountry === "US" ||
                        values.shippingCountry === "IN" ||
                        values.shippingCountry === "SG"
                          ? "numeric"
                          : "text"
                      }
                      autoComplete="shipping postal-code"
                      value={values.postalCode}
                      onChange={(event) =>
                        update("postalCode", event.target.value)
                      }
                      aria-describedby={describedBy}
                      invalid={invalid}
                    />
                  )}
                </Field>
              </div>
            </section>

            <div className="mt-5 rounded-sm border border-rule bg-paper-sunk px-3 py-2.5">
              <p className="font-mono text-label text-ink-4 uppercase">
                Order currency
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">{currency}</p>
              <p className="mt-1 text-xs text-ink-3">
                Display preference only. No exchange rate or payment is applied.
              </p>
            </div>
          </div>

          <div className="border-t border-rule bg-paper-raised px-5 py-4 sm:px-6">
            {submissionError ? (
              <p
                className="mb-3 rounded-sm border border-alert/25 bg-alert-wash px-3 py-2 text-sm text-alert"
                role="alert"
                aria-live="assertive"
              >
                {submissionError}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 w-full items-center justify-center rounded-sm bg-indigo px-5 text-sm font-semibold text-white hover:bg-indigo-hover disabled:cursor-wait disabled:opacity-70"
            >
              {submitting ? "Checking…" : "Review order preview"}
            </button>
            <p className="mt-2 text-center text-xs text-ink-3">
              No payment details are collected and no payment is taken.
            </p>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
