"use client";

import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { IconEye, IconEyeOff } from "@/components/ui/icon";

const FIELD =
  "h-12 w-full rounded-md border bg-paper px-3.5 text-[0.9375rem] text-ink " +
  "transition-[border-color,box-shadow] duration-150 placeholder:text-ink-4 " +
  "hover:border-ink-3 focus:border-indigo focus:outline-none " +
  "focus:shadow-[0_0_0_3px_rgba(67,56,202,0.16)]";

export function AuthField({
  label,
  name,
  error,
  hint,
  className,
  ...props
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "id">) {
  const base = useId();
  const id = `${base}-${name}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink-2">
        {label}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint ? hintId : null, error ? errorId : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={cn(
          FIELD,
          error ? "border-alert" : "border-border",
          className,
        )}
        {...props}
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

export function AuthPasswordField({
  label = "Password",
  name = "password",
  error,
  hint,
  autoComplete = "current-password",
  minLength,
  maxLength,
}: {
  label?: string;
  name?: string;
  error?: string;
  hint?: string;
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
      <label htmlFor={id} className="text-sm font-medium text-ink-2">
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
            FIELD,
            "pr-12",
            error ? "border-alert" : "border-border",
          )}
        />
        <button
          type="button"
          aria-pressed={revealed}
          onClick={() => setRevealed((value) => !value)}
          className="absolute top-1/2 right-1.5 grid size-9 -translate-y-1/2 place-items-center rounded-md text-ink-3 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
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

export function AuthSubmitButton({
  children,
  pendingLabel,
  busy = false,
  disabled = false,
  type = "submit",
  onClick,
}: {
  children: ReactNode;
  pendingLabel?: string;
  busy?: boolean;
  disabled?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={busy || disabled}
      aria-busy={busy || undefined}
      className="inline-flex h-12 w-full items-center justify-center rounded-md bg-indigo text-[0.9375rem] font-semibold text-white transition-colors hover:bg-indigo-hover disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
    >
      {busy ? (pendingLabel ?? children) : children}
    </button>
  );
}

export function AuthMessage({
  tone,
  children,
}: {
  tone: "error" | "notice";
  children: ReactNode;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-md border px-3.5 py-3 text-sm leading-relaxed text-pretty",
        tone === "error"
          ? "border-alert/30 bg-alert-soft text-ink"
          : "border-verified/30 bg-verified-soft text-ink",
      )}
    >
      {children}
    </p>
  );
}

export function AuthDivider() {
  return (
    <div className="flex items-center gap-3" role="separator" aria-label="or">
      <span className="h-px flex-1 bg-rule" />
      <span className="text-xs font-medium tracking-[0.08em] text-ink-4 uppercase">
        or
      </span>
      <span className="h-px flex-1 bg-rule" />
    </div>
  );
}
