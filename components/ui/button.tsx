import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "on-ink";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-sm border font-medium " +
  "transition-colors duration-150 ease-out-quart select-none " +
  "disabled:cursor-not-allowed disabled:opacity-45";

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "border-indigo bg-indigo text-white hover:border-indigo-hover hover:bg-indigo-hover",
  secondary:
    "border-border bg-paper-raised text-ink hover:border-ink-2 hover:bg-paper-sunk",
  ghost:
    "border-transparent bg-transparent text-ink-2 hover:border-rule-2 hover:bg-paper-sunk hover:text-ink",
  // Sits on the navy closing block, so its hairline and hover are navy-tinted.
  // A neutral grey border on a blue ground reads as inherited rather than
  // chosen - and after the footer went navy it was the only grey left on it.
  "on-ink":
    "border-rule-on-navy bg-transparent text-on-ink hover:border-on-navy-2 hover:bg-navy-surface-2",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-body",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders after the label. Use for directional affordances only. */
  trailing?: ReactNode;
  /** Renders before the label. */
  leading?: ReactNode;
  className?: string;
  children: ReactNode;
};

export type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button({
  variant = "secondary",
  size = "md",
  leading,
  trailing,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(BASE, VARIANT[variant], SIZE[size], className)}
      {...props}
    >
      {leading}
      {children}
      {trailing}
    </button>
  );
}

export type ButtonLinkProps = CommonProps & {
  href: string;
  /** Set for links leaving FabStitch. Adds rel and an external affordance. */
  external?: boolean;
};

/**
 * A link that looks like a button. Kept separate from `Button` rather than
 * polymorphic, so navigation never renders as a `<button>` and vice versa -
 * the distinction matters for keyboard users and for crawlers.
 */
export function ButtonLink({
  href,
  variant = "secondary",
  size = "md",
  leading,
  trailing,
  external,
  className,
  children,
}: ButtonLinkProps) {
  const classes = cn(BASE, VARIANT[variant], SIZE[size], className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {leading}
        {children}
        {trailing}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {leading}
      {children}
      {trailing}
    </Link>
  );
}
