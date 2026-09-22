"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RefObject } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { IconClose, IconMenu } from "@/components/ui/icon";
import { NAV_SECTIONS } from "./nav-model";
import { HeaderSearch } from "./header-search";
import { PreferenceControls } from "./preference-controls";
import { AccountMenu } from "@/features/account/account-menu";
import { Wordmark } from "./logo";

function isActive(pathname: string, href: string) {
  if (href === "/fabrics/best-for/")
    return pathname.startsWith("/fabrics/best-for");
  if (href === "/fabrics/")
    return (
      pathname.startsWith("/fabrics") &&
      !pathname.startsWith("/fabrics/best-for")
    );
  return pathname === href.slice(0, -1) || pathname.startsWith(href);
}

function NavLinks({
  mobile = false,
  onNavigate,
  firstLink,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
  firstLink?: RefObject<HTMLAnchorElement | null>;
}) {
  const pathname = usePathname();

  return NAV_SECTIONS.map((item, index) => {
    const active = isActive(pathname, item.href);
    return (
      <Link
        key={item.label}
        ref={index === 0 ? firstLink : undefined}
        href={item.href}
        prefetch={false}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          mobile
            ? "relative min-h-11 rounded-sm px-3 py-3 text-base font-medium text-ink transition-colors hover:bg-indigo-wash hover:text-indigo"
            : "group relative whitespace-nowrap rounded-xs px-2 py-2 text-sm font-medium tracking-[0.01em] transition-colors hover:text-indigo",
          active
            ? mobile
              ? "bg-indigo-wash text-indigo"
              : "text-ink"
            : mobile
              ? ""
              : "text-ink-2",
        )}
      >
        {item.label}
        {!mobile ? (
          <span
            aria-hidden
            className={cn(
              "absolute right-0 bottom-0 left-0 h-px origin-left bg-gold transition-transform duration-300",
              active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
            )}
          />
        ) : null}
      </Link>
    );
  });
}

export function GlobalNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pathWhenOpen, setPathWhenOpen] = useState(pathname);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const drawerTitleId = useId();

  // Close the drawer after client navigations so overlays never stick.
  if (pathname !== pathWhenOpen) {
    setPathWhenOpen(pathname);
    if (mobileOpen) setMobileOpen(false);
  }

  const closeMobile = () => {
    setMobileOpen(false);
    menuButton.current?.focus();
  };

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Prefer the close control so the drawer chrome is announced first;
    // first nav link remains in tab order for sequential keyboard use.
    closeButton.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setMobileOpen(false);
      menuButton.current?.focus();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  const mobileDrawer =
    mobileOpen && typeof document !== "undefined"
      ? createPortal(
          <div className="xl:hidden">
            <button
              type="button"
              aria-label="Close navigation overlay"
              className="fixed inset-0 z-[60] bg-navy-surface/45"
              onClick={closeMobile}
            />
            <div
              id="fabstitch-mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-labelledby={drawerTitleId}
              className="fixed inset-y-0 right-0 z-[61] flex w-[min(22rem,100vw)] max-w-full flex-col rounded-l-md border-l border-rule-2 bg-paper-raised shadow-card"
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-rule px-3 py-3">
                <Link
                  href="/"
                  prefetch={false}
                  onClick={closeMobile}
                  aria-label="FabStitch home"
                  className="inline-flex min-h-11 items-center rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo"
                >
                  <Wordmark />
                </Link>
                <p id={drawerTitleId} className="sr-only">
                  Site navigation
                </p>
                <button
                  ref={closeButton}
                  type="button"
                  onClick={closeMobile}
                  className="grid size-11 place-items-center rounded-sm border border-rule-2 bg-paper text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
                >
                  <span className="sr-only">Close navigation</span>
                  <IconClose width={18} height={18} aria-hidden />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 py-3">
                <nav aria-label="Mobile primary" className="grid">
                  <NavLinks
                    mobile
                    onNavigate={closeMobile}
                    firstLink={firstLink}
                  />
                  <HeaderSearch mobile />
                </nav>
                <nav
                  aria-label="Resources"
                  className="mt-2 border-t border-rule pt-3"
                >
                  <p className="px-3 pb-1 font-mono text-label tracking-[0.09em] text-ink-4 uppercase">
                    Resources
                  </p>
                  <Link
                    href="/guides/"
                    prefetch={false}
                    onClick={closeMobile}
                    className="block min-h-11 rounded-sm px-3 py-3 text-base font-medium text-ink hover:bg-indigo-wash hover:text-indigo"
                  >
                    Guides
                  </Link>
                  <Link
                    href="/help/"
                    prefetch={false}
                    onClick={closeMobile}
                    className="block min-h-11 rounded-sm px-3 py-3 text-base font-medium text-ink hover:bg-indigo-wash hover:text-indigo"
                  >
                    Help
                  </Link>
                  <Link
                    href="/support/"
                    prefetch={false}
                    onClick={closeMobile}
                    className="block min-h-11 rounded-sm px-3 py-3 text-base font-medium text-ink hover:bg-indigo-wash hover:text-indigo"
                  >
                    Support
                  </Link>
                </nav>
              </div>

              <div className="shrink-0 space-y-3 border-t border-rule bg-paper-raised px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <PreferenceControls mobile />
                <AccountMenu mobile onNavigate={closeMobile} />
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {/* Middle zone: primary pages centered between logo and utilities */}
      <nav
        aria-label="Primary"
        className="hidden min-w-0 flex-1 items-center justify-center xl:flex"
      >
        <div className="flex max-w-full flex-wrap items-center justify-center gap-x-1 gap-y-1 2xl:gap-x-2">
          <NavLinks />
        </div>
      </nav>

      {/* Right zone: clearly separated from primary pages */}
      <div className="ml-auto hidden shrink-0 items-center gap-3 border-l border-rule-2 pl-5 xl:flex 2xl:gap-3.5 2xl:pl-6">
        <HeaderSearch />
        <PreferenceControls />
        <div className="shrink-0 pl-1">
          <AccountMenu />
        </div>
      </div>

      <div className="relative ml-auto xl:hidden">
        <button
          ref={menuButton}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="fabstitch-mobile-navigation"
          aria-haspopup="dialog"
          onClick={() => setMobileOpen((open) => !open)}
          className="grid size-11 place-items-center rounded-sm border border-rule-2 bg-paper-raised text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
        >
          <span className="sr-only">
            {mobileOpen ? "Close navigation" : "Open navigation"}
          </span>
          {mobileOpen ? (
            <IconClose width={18} height={18} aria-hidden />
          ) : (
            <IconMenu width={19} height={19} aria-hidden />
          )}
        </button>
      </div>

      {mobileDrawer}
    </>
  );
}
