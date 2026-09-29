"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSession } from "@/features/auth/session";
import { api } from "@/lib/api/client";
import { ApiError, apiErrorMessage } from "@/lib/api/errors";
import type { components } from "@/lib/api/schema";
import {
  PhoneNumberInput,
  PhoneVerificationForm,
  PhoneVerificationStatus,
  defaultPhoneCountryIso,
  isPhoneVerified,
  maskPhoneDisplay,
  splitE164,
  toE164,
} from "@/features/phone";

type Schema = components["schemas"];
type UserPublic = Schema["UserPublic"];
type ProfileUpdateRequest = Schema["ProfileUpdateRequest"];

export function ProfileForm({ initial }: { initial: UserPublic }) {
  const { setProfile } = useSession();
  const [profile, setLocalProfile] = useState(initial);
  const split = splitE164(initial.phone, initial.country);
  const [iso, setIso] = useState(
    () => split.iso || defaultPhoneCountryIso(initial.country),
  );
  const [national, setNational] = useState(() => split.national);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showVerify, setShowVerify] = useState(false);

  useEffect(() => {
    const next = splitE164(profile.phone, profile.country);
    setIso(next.iso || defaultPhoneCountryIso(profile.country));
    setNational(next.national);
  }, [profile.phone, profile.country]);

  const verified = isPhoneVerified(profile);
  const currentE164 = toE164(national, iso);
  const phoneChanged =
    Boolean(currentE164) && currentE164 !== (profile.phone ?? null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("full_name") ?? "").trim() || null;
    let phone: string | null = null;
    if (national.trim()) {
      phone = toE164(national, iso);
      if (!phone) {
        setFieldErrors({ phone: "Enter a valid phone number." });
        setError("Enter a valid phone number.");
        return;
      }
    }

    const body: ProfileUpdateRequest = {
      full_name: fullName,
      phone,
    };
    setPending(true);
    setSaved(false);
    setError(null);
    setFieldErrors({});
    try {
      const response = await api.patch<UserPublic, ProfileUpdateRequest>(
        "/account/profile",
        { body },
      );
      setLocalProfile(response);
      setProfile(response);
      setSaved(true);
      setShowVerify(!isPhoneVerified(response) && Boolean(response.phone));
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.details.length) {
        const nextErrors: Record<string, string> = {};
        for (const detail of requestError.details) {
          const field = detail.loc?.at(-1);
          if (typeof field === "string" && detail.msg) {
            nextErrors[field] = detail.msg;
          }
        }
        setFieldErrors(nextErrors);
      }
      setError(
        apiErrorMessage(
          requestError,
          "Your profile could not be updated. Try again.",
        ),
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
      <form
        onSubmit={submit}
        className="rounded-md border border-rule-2 bg-paper-raised p-5 sm:p-7"
      >
        <div>
          <p className="font-mono text-label text-gold-ink uppercase">
            Identity
          </p>
          <h2 className="mt-2 text-h2 font-semibold text-ink">
            Profile details
          </h2>
          <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-ink-3">
            Keep the contact details used for sourcing conversations current.
          </p>
        </div>

        <div className="mt-6 grid gap-5">
          <label className="grid gap-1.5">
            <span className="font-mono text-label font-medium uppercase text-ink-3">
              Work email
            </span>
            <input
              value={profile.email}
              readOnly
              aria-describedby="profile-email-status"
              className="h-11 rounded-sm border border-border bg-paper-sunk px-3.5 text-body text-ink-2"
            />
            <span id="profile-email-status" className="text-xs text-ink-3">
              {profile.email_verified ? "Verified email" : "Email not verified"}
            </span>
          </label>

          <label className="grid gap-1.5">
            <span className="font-mono text-label font-medium uppercase text-ink-3">
              Full name
            </span>
            <input
              name="full_name"
              defaultValue={profile.full_name ?? ""}
              autoComplete="name"
              aria-invalid={fieldErrors.full_name ? true : undefined}
              className="h-11 rounded-sm border border-border bg-paper-raised px-3.5 text-body text-ink focus:border-indigo"
            />
            {fieldErrors.full_name ? (
              <span className="text-xs font-medium text-alert">
                {fieldErrors.full_name}
              </span>
            ) : null}
          </label>

          <PhoneNumberInput
            iso={iso}
            national={national}
            onIsoChange={(next) => {
              setIso(next);
              setNational("");
              setFieldErrors((current) => ({ ...current, phone: "" }));
            }}
            onNationalChange={(next) => {
              setNational(next);
              setFieldErrors((current) => ({ ...current, phone: "" }));
            }}
            error={fieldErrors.phone}
            hint="Saving a new number clears verification until you confirm the SMS code."
          />

          <div className="rounded-sm border border-rule-2 bg-paper px-3.5 py-3">
            <p className="font-mono text-label uppercase text-ink-4">Status</p>
            <div className="mt-2">
              <PhoneVerificationStatus
                phone={phoneChanged ? currentE164 : profile.phone}
                verified={!phoneChanged && verified}
                masked={maskPhoneDisplay(
                  phoneChanged ? currentE164 : profile.phone,
                )}
              />
            </div>
            {!verified || phoneChanged ? (
              <button
                type="button"
                className="mt-3 inline-flex h-10 items-center rounded-sm border border-indigo bg-indigo px-4 text-sm font-semibold text-white hover:bg-indigo-hover"
                onClick={() => setShowVerify(true)}
              >
                Verify phone
              </button>
            ) : null}
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-5 rounded-sm border border-alert/35 bg-alert-soft px-3.5 py-3 text-sm text-ink"
          >
            {error}
          </p>
        ) : null}
        {saved ? (
          <p
            role="status"
            className="mt-5 rounded-sm border border-verified/35 bg-verified-soft px-3.5 py-3 text-sm text-ink"
          >
            Profile updated.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 h-11 rounded-sm border border-indigo bg-indigo px-5 text-sm font-semibold text-white hover:bg-indigo-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
      </form>

      <aside className="grid h-fit gap-4">
        {showVerify ? (
          <div className="rounded-md border border-rule-2 bg-paper-raised p-5">
            <PhoneVerificationForm
              initialPhone={currentE164 ?? profile.phone}
              preferredCountry={iso}
              onVerified={(user) => {
                setLocalProfile(user);
                setProfile(user);
                setShowVerify(false);
                setSaved(true);
              }}
            />
          </div>
        ) : (
          <div className="rounded-md border border-rule-2 bg-paper-raised p-5">
            <p className="font-mono text-label text-ink-4 uppercase">
              Sourcing setup
            </p>
            <h2 className="mt-2 text-h3 font-semibold text-ink">
              Discovery preferences
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-3">
              Review your market, material, application, and typical quantity
              choices.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                href="/inquiries/"
                className="inline-flex h-10 items-center rounded-sm border border-indigo bg-indigo px-4 text-sm font-semibold text-white hover:bg-indigo-hover"
              >
                My Inquiries
              </Link>
              <Link
                href="/account/preferences/"
                className="inline-flex h-10 items-center rounded-sm border border-border bg-paper px-4 text-sm font-semibold text-ink hover:border-indigo hover:text-indigo"
              >
                Manage preferences
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
