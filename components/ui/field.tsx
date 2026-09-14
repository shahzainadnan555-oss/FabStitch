"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import { useId } from "react";
import { cn } from "@/lib/cn";
import { IconChevronDown } from "./icon";

/**
 * Form primitives.
 *
 * Every control is wired for accessibility at the primitive level rather than
 * per screen: a real `<label>`, `aria-describedby` for hint and error,
 * `aria-invalid`, and an error region that is announced when it appears.
 */

const CONTROL =
  "w-full rounded-sm border border-border bg-paper-raised text-ink " +
  "transition-colors duration-150 placeholder:text-ink-4 " +
  "hover:border-ink-3 focus:border-indigo " +
  "disabled:cursor-not-allowed disabled:bg-paper-sunk disabled:text-ink-4";

const CONTROL_INVALID = "border-alert hover:border-alert focus:border-alert";

const SIZE = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-10 px-3 text-sm",
  lg: "h-12 px-3.5 text-body",
} as const;

type ControlSize = keyof typeof SIZE;

export function Field({
  label,
  hint,
  error,
  labelHidden,
  children,
  className,
}: {
  label: string;
  hint?: ReactNode;
  error?: string;
  labelHidden?: boolean;
  /** Receives the ids this field owns, so the control can wire itself up. */
  children: (ids: {
    id: string;
    describedBy: string | undefined;
    invalid: boolean;
  }) => ReactNode;
  className?: string;
}) {
  const base = useId();
  const id = `${base}-control`;
  const hintId = `${base}-hint`;
  const errorId = `${base}-error`;

  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className={cn(
          "font-mono text-label font-medium uppercase text-ink-3",
          labelHidden && "sr-only",
        )}
      >
        {label}
      </label>

      {children({ id, describedBy, invalid: Boolean(error) })}

      {hint && !error ? (
        <p id={hintId} className="text-xs text-ink-3">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-xs text-alert" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** `ComponentPropsWithRef` so callers can hold a ref - React 19 passes it as
 * an ordinary prop, but the type has to admit it. */
export type InputProps = Omit<
  ComponentPropsWithRef<"input">,
  "size" | "className"
> & {
  size?: ControlSize;
  invalid?: boolean;
  className?: string;
};

export function Input({
  size = "md",
  invalid,
  className,
  ...props
}: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(CONTROL, SIZE[size], invalid && CONTROL_INVALID, className)}
      {...props}
    />
  );
}

export type SelectProps = Omit<
  ComponentPropsWithRef<"select">,
  "size" | "className"
> & {
  size?: ControlSize;
  invalid?: boolean;
  className?: string;
};

/**
 * Native `<select>` under a custom frame. A bespoke listbox is deferred until
 * a screen genuinely needs grouped options with search - on mobile the native
 * picker is better than anything reimplemented, and it is accessible for free.
 */
export function Select({
  size = "md",
  invalid,
  className,
  children,
  ...props
}: SelectProps) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        className={cn(
          CONTROL,
          SIZE[size],
          invalid && CONTROL_INVALID,
          "cursor-pointer appearance-none pr-9",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <IconChevronDown
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-3"
        width={14}
        height={14}
      />
    </div>
  );
}
