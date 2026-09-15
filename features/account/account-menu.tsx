"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useSession } from "@/features/auth/session";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/account/", label: "Account" },
  { href: "/inquiries/", label: "My Inquiries" },
] as const;

export function AccountMenu({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter();
  const { hydrated, authenticated, status, user, profile, signOut } =
    useSession();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const displayName = profile?.full_name?.trim() || user?.full_name?.trim();
  const displayEmail = profile?.email || user?.email;

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!hydrated || status === "loading" || status === "error") {
    return (
      <span
        aria-busy="true"
        aria-live="polite"
        className={
          mobile
            ? "inline-flex h-11 w-full items-center justify-center rounded-sm border border-rule-2 bg-paper-raised text-sm text-ink-3"
            : "inline-flex h-9 items-center rounded-sm px-4 text-sm text-ink-3"
        }
      >
        Checking account
      </span>
    );
  }

  if (!authenticated) {
    return (
      <div
        className={cn(
          "flex items-center",
          mobile ? "w-full flex-col gap-2" : "gap-2",
        )}
      >
        <Link
          href="/signup/"
          className={
            mobile
              ? "inline-flex h-11 w-full items-center justify-center rounded-sm border border-rule-2 px-4 text-sm font-semibold text-ink-2"
              : "inline-flex h-9 items-center rounded-sm px-3 text-sm font-semibold text-ink-2 hover:text-indigo"
          }
        >
          Join FabStitch
        </Link>
        <Link
          href="/login/"
          className={
            mobile
              ? "inline-flex h-11 w-full items-center justify-center rounded-sm border border-indigo bg-indigo px-4 text-sm font-semibold text-white"
              : "inline-flex h-9 items-center rounded-sm border border-indigo bg-indigo px-4 text-sm font-semibold tracking-[0.01em] text-white hover:border-indigo-hover hover:bg-indigo-hover"
          }
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div ref={root} className={cn("relative", mobile && "w-full")}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        onClick={() => setOpen((current) => !current)}
        className={
          mobile
            ? "inline-flex h-11 w-full items-center justify-center rounded-sm border border-indigo bg-indigo px-4 text-sm font-semibold text-white"
            : "inline-flex h-9 items-center rounded-sm border border-indigo bg-indigo px-4 text-sm font-semibold tracking-[0.01em] text-white hover:border-indigo-hover hover:bg-indigo-hover"
        }
      >
        Account
      </button>
      {open ? (
        <div
          id={`${id}-menu`}
          role="menu"
          className={cn(
            "z-50 rounded-md border border-rule-2 bg-paper-raised p-1.5 shadow-card",
            mobile ? "relative mt-2 w-full" : "absolute right-0 mt-2 w-56",
          )}
        >
          <div className="px-3 py-2">
            {displayName ? (
              <p className="truncate text-sm font-semibold text-ink">
                {displayName}
              </p>
            ) : null}
            {displayEmail ? (
              <p className="truncate font-mono text-label text-ink-4">
                {displayEmail}
              </p>
            ) : null}
          </div>
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block rounded-sm px-3 py-2 text-sm text-ink-2 hover:bg-indigo-wash hover:text-indigo"
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            role="menuitem"
            disabled={pending}
            onClick={() => {
              setPending(true);
              void signOut()
                .then(() => {
                  setOpen(false);
                  router.push("/marketplace/");
                  router.refresh();
                })
                .finally(() => setPending(false));
            }}
            className="mt-1 block w-full rounded-sm px-3 py-2 text-left text-sm text-ink-2 hover:bg-paper-sunk hover:text-ink disabled:opacity-60"
          >
            {pending ? "Signing out…" : "Logout"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
