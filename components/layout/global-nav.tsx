"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { IconClose, IconMenu } from "@/components/ui/icon";
import { NAV_SECTIONS } from "./nav-model";
import { HeaderSearch } from "./header-search";
import { PreferenceControls } from "./preference-controls";
import { AccountMenu } from "@/features/account/account-menu";

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
            ? "relative rounded-sm px-3 py-3 text-base font-medium text-ink transition-colors hover:bg-indigo-wash hover:text-indigo"
            : "group relative whitespace-nowrap rounded-xs px-1 py-2 text-[0.8125rem] font-medium tracking-[0.01em] transition-colors hover:text-indigo",
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

function AccountLink({ mobile = false }: { mobile?: boolean }) {
  return <AccountMenu mobile={mobile} />;
}

export function GlobalNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    firstLink.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMobileOpen(false);
      menuButton.current?.focus();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  return (
    <>
      {/* Center column of the header grid — optically centered primary nav */}
      <nav
        aria-label="Primary"
        className="hidden items-center justify-center gap-4 justify-self-center xl:flex 2xl:gap-5"
      >
        <NavLinks />
      </nav>

      <div className="hidden shrink-0 items-center justify-end gap-2 justify-self-end xl:flex">
        <HeaderSearch />
        <PreferenceControls />
        <div className="shrink-0">
          <AccountLink />
        </div>
      </div>

      <div className="relative col-start-3 justify-self-end xl:hidden">
        <button
          ref={menuButton}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="fabstitch-mobile-navigation"
          onClick={() => setMobileOpen((open) => !open)}
          className="grid size-10 place-items-center rounded-sm border border-rule-2 bg-paper-raised text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
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

        {mobileOpen ? (
          <div
            id="fabstitch-mobile-navigation"
            className="absolute top-12 right-0 w-[min(22rem,calc(100vw-2rem))] rounded-md border border-rule-2 bg-paper-raised p-3 shadow-card"
          >
            <nav aria-label="Mobile primary" className="grid">
              <NavLinks
                mobile
                onNavigate={() => setMobileOpen(false)}
                firstLink={firstLink}
              />
              <HeaderSearch mobile />
            </nav>
            <div className="mt-2 space-y-3 border-t border-rule pt-3">
              <nav aria-label="Resources">
                <p className="px-3 pb-1 font-mono text-label tracking-[0.09em] text-ink-4 uppercase">
                  Resources
                </p>
                <Link
                  href="/guides/"
                  prefetch={false}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-sm px-3 py-3 text-base font-medium text-ink hover:bg-indigo-wash hover:text-indigo"
                >
                  Guides
                </Link>
                <Link
                  href="/help/"
                  prefetch={false}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-sm px-3 py-3 text-base font-medium text-ink hover:bg-indigo-wash hover:text-indigo"
                >
                  Help
                </Link>
                <Link
                  href="/support/"
                  prefetch={false}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-sm px-3 py-3 text-base font-medium text-ink hover:bg-indigo-wash hover:text-indigo"
                >
                  Support
                </Link>
              </nav>
              <PreferenceControls mobile />
              <AccountLink mobile />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
