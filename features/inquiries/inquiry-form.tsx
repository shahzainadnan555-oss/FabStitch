"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/schema";
import type { Fabric, InquiryCreate } from "@/lib/api/types";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/field";
import { IconClose } from "@/components/ui/icon";
import { FabricMedia } from "@/components/marketplace/fabric-media";
import { cn } from "@/lib/cn";
import { loginHref } from "@/features/auth/return-to";
import { useSession } from "@/features/auth/session";
import { useMarketPreferences } from "@/features/preferences/market-preferences";
import { isCountryCode, marketForCountry } from "@/features/preferences/market";
import {
  trimmed,
  validateInquiryContact,
  type InquiryFieldErrors,
} from "./contact";
import type { InquiryFlowFabric } from "./types";

type InquiryCreateResponse = components["schemas"]["InquiryCreateResponse"];
type UserPublic = components["schemas"]["UserPublic"];
type ProfileUpdateRequest = components["schemas"]["ProfileUpdateRequest"];
type CustomerPreferencesOut = components["schemas"]["CustomerPreferencesOut"];
type CountryPreferenceUpdateRequest =
  components["schemas"]["CountryPreferenceUpdateRequest"];

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function fieldError(error: ApiError, field: string): string | undefined {
  return error.details.find((detail) => detail.loc?.at(-1) === field)?.msg;
}

async function backendFabricId(fabric: InquiryFlowFabric): Promise<string> {
  if (UUID_PATTERN.test(fabric.id)) return fabric.id;
  const record = await api.get<Fabric>(
    `/fabrics/${encodeURIComponent(fabric.slug)}`,
  );
  return record.id;
}

function countryName(
  code: string,
  countries: { code: string; name: string }[],
): string {
  const option = countries.find((item) => item.code === code);
  if (option) return option.name;
  return isCountryCode(code) ? marketForCountry(code).countryName : code;
}

export function InquiryDialog({
  open,
  onClose,
  fabric,
}: {
  open: boolean;
  onClose: () => void;
  fabric: InquiryFlowFabric;
}) {
  const {
    authenticated,
    status,
    profile,
    preferences,
    setProfile,
    setPreferences,
  } = useSession();
  const { countries } = useMarketPreferences();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<InquiryCreateResponse | null>(null);
  const [confirmedContact, setConfirmedContact] = useState<{
    email: string;
    country: string;
    phone: string;
  } | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const accountEmail = profile?.email ?? "";
  const storedName = trimmed(profile?.full_name ?? "");
  const initialCountry =
    (profile?.country && isCountryCode(profile.country)
      ? profile.country
      : null) ??
    (preferences?.country && isCountryCode(preferences.country)
      ? preferences.country
      : "");

  function resetAndClose() {
    if (submitting) return;
    setSuccess(null);
    setConfirmedContact(null);
    setError(null);
    onClose();
  }

  async function persistContact(input: {
    name: string;
    phone: string;
    country: string;
  }): Promise<UserPublic | null> {
    const nextName = storedName || trimmed(input.name);
    const nextPhone = trimmed(input.phone);
    const nextCountry = isCountryCode(input.country) ? input.country : "";
    const body: ProfileUpdateRequest = {};

    if (nextName && nextName !== (profile?.full_name ?? "")) {
      body.full_name = nextName;
    }
    if (nextPhone !== (profile?.phone ?? "")) {
      body.phone = nextPhone;
    }
    if (nextCountry && nextCountry !== (profile?.country ?? "")) {
      body.country = nextCountry;
    }

    let nextProfile = profile;
    if (Object.keys(body).length) {
      nextProfile = await api.patch<UserPublic, ProfileUpdateRequest>(
        "/account/profile",
        { body },
      );
      setProfile(nextProfile);
    }

    if (nextCountry && nextCountry !== (preferences?.country ?? "")) {
      const prefs = await api.put<
        CustomerPreferencesOut,
        CountryPreferenceUpdateRequest
      >("/me/preferences/country", {
        body: { country: nextCountry, apply_currency_default: false },
      });
      setPreferences(prefs);
    }

    return nextProfile;
  }

  const checkingSession = status === "loading";
  const needsSignIn = !authenticated && !checkingSession;

  return (
    <Dialog
      open={open}
      onClose={resetAndClose}
      label={`Inquire about ${fabric.name}`}
      dismissOnBackdrop={!submitting}
      className="max-w-[56rem]"
    >
      <div className="w-full">
        <div className="flex items-start justify-between gap-5 border-b border-rule px-5 py-4 sm:px-6">
          <div>
            <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
              Fabric inquiry
            </p>
            <h2 className="mt-1 text-h2 font-semibold text-ink">
              {success ? "Inquiry Submitted Successfully" : "Your inquiry"}
            </h2>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            disabled={submitting}
            className="grid size-9 shrink-0 place-items-center rounded-sm text-ink-3 hover:bg-paper-sunk hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo disabled:cursor-wait"
          >
            <span className="sr-only">Close inquiry form</span>
            <IconClose width={17} height={17} aria-hidden />
          </button>
        </div>

        {success ? (
          <div className="px-5 py-6 sm:px-6" role="status" aria-live="polite">
            <p className="text-body leading-relaxed text-ink-2">
              Your inquiry has been submitted successfully. Our team will
              contact you as soon as possible at your registered email address.
            </p>
            <p className="mt-5 font-mono text-h3 tracking-[0.04em] text-ink">
              Inquiry #{success.inquiry.inquiry_number}
            </p>
            <dl className="mt-5 grid gap-3 rounded-sm border border-rule bg-paper-sunk p-4 sm:grid-cols-2">
              <SummaryItem
                label="Inquiry number"
                value={success.inquiry.inquiry_number}
              />
              <SummaryItem label="Fabric" value={success.inquiry.fabric.name} />
              <SummaryItem
                label="Quantity"
                value={`${success.inquiry.quantity} ${success.inquiry.quantity_unit}`}
              />
              <SummaryItem
                label="Status"
                value={success.inquiry.status.replaceAll("_", " ")}
              />
              {confirmedContact?.email ? (
                <SummaryItem label="Email" value={confirmedContact.email} />
              ) : null}
              {confirmedContact?.country ? (
                <SummaryItem label="Country" value={confirmedContact.country} />
              ) : null}
              {confirmedContact?.phone ? (
                <SummaryItem label="Phone" value={confirmedContact.phone} />
              ) : null}
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={`/inquiries/${success.inquiry.id}/`}
                className="inline-flex h-10 items-center rounded-sm bg-indigo px-4 text-sm font-semibold text-white hover:bg-indigo-hover"
              >
                View My Inquiry
              </Link>
              <Link
                href="/marketplace/"
                className="inline-flex h-10 items-center rounded-sm border border-rule-2 px-4 text-sm font-semibold text-ink-2 hover:border-indigo hover:text-indigo"
              >
                Continue browsing fabrics
              </Link>
            </div>
          </div>
        ) : checkingSession ? (
          <div
            className="px-5 py-8 sm:px-6"
            aria-busy="true"
            aria-live="polite"
          >
            <p className="text-body text-ink-2">Checking your account…</p>
          </div>
        ) : needsSignIn ? (
          <div className="px-5 py-8 sm:px-6">
            <p className="text-body text-ink-2">
              Sign in to send a fabric inquiry. FabStitch uses your account
              email, country and phone for the request.
            </p>
            <Link
              href={loginHref(`/fabrics/${fabric.slug}/`)}
              className="mt-5 inline-flex h-11 items-center rounded-sm bg-indigo px-5 text-sm font-semibold text-white hover:bg-indigo-hover"
            >
              Sign in to continue
            </Link>
          </div>
        ) : open ? (
          <InquiryComposeForm
            key={`${profile?.id ?? "guest"}-${accountEmail}-${profile?.phone ?? ""}-${initialCountry}`}
            fabric={fabric}
            authenticated={authenticated}
            accountEmail={accountEmail}
            storedName={storedName}
            initialPhone={profile?.phone ?? ""}
            initialCountry={initialCountry}
            countries={countries}
            submitting={submitting}
            error={error}
            onSubmitting={setSubmitting}
            onError={setError}
            onSuccess={(response, contact) => {
              setConfirmedContact(contact);
              setSuccess(response);
            }}
            persistContact={persistContact}
          />
        ) : null}
      </div>
    </Dialog>
  );
}

function InquiryComposeForm({
  fabric,
  authenticated,
  accountEmail,
  storedName,
  initialPhone,
  initialCountry,
  countries,
  submitting,
  error,
  onSubmitting,
  onError,
  onSuccess,
  persistContact,
}: {
  fabric: InquiryFlowFabric;
  authenticated: boolean;
  accountEmail: string;
  storedName: string;
  initialPhone: string;
  initialCountry: string;
  countries: { code: string; name: string }[];
  submitting: boolean;
  error: ApiError | null;
  onSubmitting: (value: boolean) => void;
  onError: (error: ApiError | null) => void;
  onSuccess: (
    response: InquiryCreateResponse,
    contact: { email: string; country: string; phone: string },
  ) => void;
  persistContact: (input: {
    name: string;
    phone: string;
    country: string;
  }) => Promise<UserPublic | null>;
}) {
  const [quantity, setQuantity] = useState("1");
  const [name, setName] = useState(storedName);
  const [phone, setPhone] = useState(initialPhone);
  const [country, setCountry] = useState(initialCountry);
  const [note, setNote] = useState("");
  const [fieldErrors, setFieldErrors] = useState<InquiryFieldErrors>({});
  const idempotencyKey = useRef<string | null>(null);
  const nameRequired = !storedName;
  const quantityUnit = fabric.quantityUnit ?? "meters";
  const asset = fabric.imageSrc
    ? { src: fabric.imageSrc, alt: fabric.imageAlt }
    : undefined;

  const canSubmit = useMemo(() => {
    const errors = validateInquiryContact({
      quantity,
      email: accountEmail,
      country,
      phone,
      name: storedName || name,
      nameRequired,
    });
    return (
      authenticated &&
      Object.keys(errors).length === 0 &&
      Boolean(fabric.id || fabric.slug)
    );
  }, [
    accountEmail,
    authenticated,
    country,
    fabric.id,
    fabric.slug,
    name,
    nameRequired,
    phone,
    quantity,
    storedName,
  ]);

  function markDirty() {
    onError(null);
    idempotencyKey.current = null;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const errors = validateInquiryContact({
      quantity,
      email: accountEmail,
      country,
      phone,
      name: storedName || name,
      nameRequired,
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    onSubmitting(true);
    onError(null);

    try {
      await persistContact({ name, phone, country });
      const fabricId = await backendFabricId(fabric);
      const body: InquiryCreate = {
        fabricId,
        quantity: trimmed(quantity),
        quantityUnit,
        ...(fabric.variantId ? { variantId: fabric.variantId } : {}),
        ...(trimmed(note) ? { customerNote: trimmed(note) } : {}),
      };
      idempotencyKey.current ??= crypto.randomUUID();
      const response = await api.post<InquiryCreateResponse, InquiryCreate>(
        "/inquiries",
        {
          body,
          headers: { "Idempotency-Key": idempotencyKey.current },
        },
      );
      onSuccess(response, {
        email: accountEmail,
        country: countryName(country, countries),
        phone: trimmed(phone),
      });
    } catch (caught) {
      const next =
        caught instanceof ApiError
          ? caught
          : new ApiError({
              status: 0,
              code: "request_failed",
              message:
                "FabStitch could not submit your inquiry. Please try again.",
            });
      onError(next);
      setFieldErrors({
        quantity: fieldError(next, "quantity"),
        phone: fieldError(next, "phone"),
        country: fieldError(next, "country"),
        email: fieldError(next, "email"),
        name: fieldError(next, "full_name"),
      });
    } finally {
      onSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={submit}>
      <div className="grid gap-8 px-5 py-5 sm:px-6 lg:grid-cols-2 lg:gap-10">
        <section>
          <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
            Your inquiry
          </p>
          <div className="mt-4 grid grid-cols-[5.75rem_1fr] gap-4 rounded-sm border border-rule bg-paper-sunk p-3">
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
                Fabric
              </p>
              <p className="mt-1 font-semibold text-ink">{fabric.name}</p>
              {fabric.variantLabel ? (
                <p className="mt-1 text-sm text-ink-3">{fabric.variantLabel}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <Field
              label="Quantity"
              error={fieldErrors.quantity}
              hint="Inquiry quantities are submitted in metres."
            >
              {({ id, describedBy, invalid }) => (
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <Input
                    id={id}
                    name="quantity"
                    type="number"
                    inputMode="decimal"
                    min="0.01"
                    max="1000000"
                    step="any"
                    required
                    value={quantity}
                    onChange={(event) => {
                      setQuantity(event.target.value);
                      setFieldErrors((current) => ({
                        ...current,
                        quantity: undefined,
                      }));
                      markDirty();
                    }}
                    aria-describedby={describedBy}
                    invalid={invalid}
                  />
                  <span className="grid min-w-24 place-items-center rounded-sm border border-rule bg-paper-sunk px-3 text-sm text-ink-2">
                    {quantityUnit}
                  </span>
                </div>
              )}
            </Field>

            <Field
              label="Note (optional)"
              hint="Add only details relevant to this fabric inquiry."
            >
              {({ id, describedBy }) => (
                <textarea
                  id={id}
                  name="customerNote"
                  rows={4}
                  maxLength={2000}
                  value={note}
                  onChange={(event) => {
                    setNote(event.target.value);
                    markDirty();
                  }}
                  aria-describedby={describedBy}
                  className="w-full resize-y rounded-sm border border-border bg-paper-raised px-3 py-2 text-sm text-ink placeholder:text-ink-4 focus:border-indigo focus:outline-none"
                />
              )}
            </Field>
          </div>
        </section>

        <section>
          <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
            Your contact details
          </p>
          <div className="mt-4 grid gap-4">
            <Field
              label="Full name"
              error={fieldErrors.name}
              hint={
                storedName ? "Taken from your FabStitch account." : undefined
              }
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="full_name"
                  autoComplete="name"
                  required={nameRequired}
                  readOnly={Boolean(storedName)}
                  value={storedName || name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setFieldErrors((current) => ({
                      ...current,
                      name: undefined,
                    }));
                    markDirty();
                  }}
                  aria-describedby={describedBy}
                  invalid={invalid}
                />
              )}
            </Field>

            <Field
              label="Email address"
              error={fieldErrors.email}
              hint="FabStitch contacts you at your registered account email."
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  readOnly
                  value={accountEmail}
                  aria-describedby={describedBy}
                  invalid={invalid}
                />
              )}
            </Field>

            <Field label="Country" error={fieldErrors.country}>
              {({ id, describedBy, invalid }) => (
                <Select
                  id={id}
                  name="country"
                  required
                  value={country}
                  onChange={(event) => {
                    setCountry(event.target.value);
                    setFieldErrors((current) => ({
                      ...current,
                      country: undefined,
                    }));
                    markDirty();
                  }}
                  aria-describedby={describedBy}
                  invalid={invalid}
                >
                  <option value="">Select your country</option>
                  {country &&
                  !countries.some((item) => item.code === country) &&
                  isCountryCode(country) ? (
                    <option value={country}>
                      {marketForCountry(country).countryName}
                    </option>
                  ) : null}
                  {countries.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field
              label="Phone number"
              error={fieldErrors.phone}
              hint={
                isCountryCode(country)
                  ? `Include the country code, for example ${marketForCountry(country).dialCode}.`
                  : "Include the country code."
              }
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setFieldErrors((current) => ({
                      ...current,
                      phone: undefined,
                    }));
                    markDirty();
                  }}
                  aria-describedby={describedBy}
                  invalid={invalid}
                />
              )}
            </Field>
          </div>
        </section>
      </div>

      {error ? (
        <div
          className="mx-5 mb-2 rounded-sm border border-alert/25 bg-alert-soft px-3 py-2.5 text-sm text-alert sm:mx-6"
          role="alert"
        >
          <p>{error.message}</p>
          {error.requestId ? (
            <p className="mt-1 font-mono text-label">
              Request {error.requestId}
            </p>
          ) : null}
          {error.status === 401 ? (
            <Link
              href={loginHref(`/fabrics/${fabric.slug}/`)}
              className="mt-2 inline-flex font-semibold underline underline-offset-4"
            >
              Sign in to continue
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="border-t border-rule bg-paper-raised px-5 py-4 sm:px-6">
        <button
          type="submit"
          disabled={submitting || !canSubmit}
          className={cn(
            "inline-flex h-12 w-full items-center justify-center rounded-sm bg-indigo px-5 text-sm font-semibold text-white hover:bg-indigo-hover",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo",
            "disabled:cursor-not-allowed disabled:opacity-70",
          )}
        >
          {submitting ? "Sending inquiry…" : "Send Inquiry"}
        </button>
        <p className="mt-2 text-center text-xs text-ink-3">
          Quantity, email, country and phone are required. No payment is
          collected.
        </p>
      </div>
    </form>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-label uppercase text-ink-4">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{value}</dd>
    </div>
  );
}
