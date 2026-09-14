"use client";

import { useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";
import {
  IconChevronDown,
  IconEye,
  IconEyeOff,
  IconVerified,
} from "@/components/ui/icon";

/**
 * Authentication form controls.
 *
 * Shared by every auth page so the five routes cannot drift into five
 * different-looking forms. Each control owns its own label, hint and error
 * wiring, which is what keeps `aria-describedby` and `aria-invalid` correct
 * without every page remembering to do it.
 */

const CONTROL =
  "h-11 w-full rounded-sm border bg-paper-raised px-3.5 text-body text-ink " +
  "transition-colors duration-150 placeholder:text-ink-4 " +
  "hover:border-ink-3 focus:border-indigo";

export function AuthField({
  label,
  name,
  type = "text",
  hint,
  error,
  autoComplete,
  required = true,
  defaultValue,
  autoFocus,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  hint?: string;
  error?: string;
  autoComplete?: string;
  required?: boolean;
  defaultValue?: string;
  autoFocus?: boolean;
  placeholder?: string;
}) {
  const base = useId();
  const id = `${base}-${name}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-mono text-label font-medium uppercase text-ink-3"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint ? hintId : null, error ? errorId : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={cn(CONTROL, error ? "border-alert" : "border-border")}
      />
      {hint && !error ? (
        <p id={hintId} className="text-xs text-ink-3">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function PasswordField({
  label = "Password",
  name = "password",
  hint,
  error,
  autoComplete = "current-password",
  minLength,
  maxLength,
}: {
  label?: string;
  name?: string;
  hint?: string;
  error?: string;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
}) {
  const base = useId();
  const id = `${base}-${name}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-mono text-label font-medium uppercase text-ink-3"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={revealed ? "text" : "password"}
          required
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [hint ? hintId : null, error ? errorId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={cn(
            CONTROL,
            "pr-11",
            error ? "border-alert" : "border-border",
          )}
        />
        {/* A real control, not an icon that swaps a class: the state is on
            `aria-pressed` and the accessible name says what pressing it does. */}
        <button
          type="button"
          aria-pressed={revealed}
          onClick={() => setRevealed((value) => !value)}
          className="absolute top-1/2 right-1 grid size-9 -translate-y-1/2 place-items-center rounded-xs text-ink-3 transition-colors hover:text-ink"
        >
          <span className="sr-only">
            {revealed ? "Hide password" : "Show password"}
          </span>
          {revealed ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>
      {hint && !error ? (
        <p id={hintId} className="text-xs text-ink-3">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CountryField({
  countries,
  error,
}: {
  countries: { code: string; name: string }[];
  error?: string;
}) {
  const base = useId();
  const id = `${base}-country`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-mono text-label font-medium uppercase text-ink-3"
      >
        Country
      </label>
      {/* `appearance-none` removes the platform indicator along with the
          platform styling, so the chevron is drawn back on. Without it the
          control is indistinguishable from a text input. */}
      <div className="relative">
        <select
          id={id}
          name="country_code"
          required
          defaultValue=""
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            CONTROL,
            "cursor-pointer appearance-none pr-10",
            error ? "border-alert" : "border-border",
          )}
        >
          <option value="" disabled>
            Select a country
          </option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        <IconChevronDown
          width={14}
          height={14}
          className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-ink-3"
        />
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Form-level message. `role` differs by tone so only failures interrupt. */
export function AuthMessage({
  tone,
  children,
}: {
  tone: "error" | "notice";
  children: React.ReactNode;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-2.5 rounded-md border px-3.5 py-3 text-sm text-pretty",
        tone === "error"
          ? "border-alert/35 bg-alert-soft text-ink"
          : "border-verified/35 bg-verified-soft text-ink",
      )}
    >
      {tone === "notice" ? (
        <IconVerified
          width={15}
          height={15}
          className="mt-0.5 shrink-0 text-verified"
        />
      ) : null}
      <span>{children}</span>
    </p>
  );
}

/**
 * The primary action of an auth form, disabled while it is in flight.
 *
 * It was not disabled before, and nothing else stopped a second click: signing
 * in twice sent two `POST /auth/login` requests, and pressing "Create account"
 * four times sent four signups - each one spending bcrypt on the server and a
 * slot from a per-minute authentication budget the user shares with nobody but
 * themselves. On a slow connection, which is exactly when someone clicks
 * again, that turned one slow request into four and made the failure worse.
 *
 * `useFormStatus` reads the state of the enclosing `<form>`, so this needs no
 * props and cannot get out of step with the action. It is also why the button
 * can never be left disabled: the status is owned by React and clears when the
 * action settles, whether it succeeded, failed, or redirected.
 */
export function SubmitButton({
  children,
  /** Shown while the action runs. Falls back to the idle label. */
  pendingLabel,
  disabled = false,
  busy = false,
}: {
  children: React.ReactNode;
  pendingLabel?: React.ReactNode;
  disabled?: boolean;
  busy?: boolean;
}) {
  const { pending } = useFormStatus();
  const isPending = pending || busy;

  return (
    <button
      type="submit"
      disabled={isPending || disabled}
      aria-busy={isPending || undefined}
      className="h-11 w-full rounded-sm border border-indigo bg-indigo text-body font-semibold text-white transition-colors duration-150 hover:border-indigo-hover hover:bg-indigo-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? (pendingLabel ?? children) : children}
    </button>
  );
}
