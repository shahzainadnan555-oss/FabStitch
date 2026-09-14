"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { useSession } from "@/features/auth/session";
import { Wordmark } from "./logo";
import { Label } from "@/components/ui/typography";
import { IconClose, IconMenu } from "@/components/ui/icon";

/**
 * Protected admin workspace shell.
 *
 * Customer pages use the public FabStitch header. This sidebar chrome is only
 * for `/admin`.
 */

export type WorkspaceNavItem = {
  label: string;
  href: string;
  /** Shown as a count chip. Omit rather than render a fabricated zero. */
  badge?: number;
};

export type WorkspaceNavGroup = {
  heading: string;
  items: WorkspaceNavItem[];
};

export function WorkspaceShell({
  workspace,
  email,
  groups,
  children,
}: {
  /** Appears beside the wordmark so the context is never ambiguous. */
  workspace: string;
  /** The signed-in address, as the server resolved it. */
  email?: string;
  groups: WorkspaceNavGroup[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [railOpen, setRailOpen] = useState(false);
  const { profile, signOut } = useSession();
  const displayEmail = profile?.email ?? email;

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-40 border-b border-rule bg-paper">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            aria-expanded={railOpen}
            aria-controls="workspace-rail"
            onClick={() => setRailOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-sm border border-rule-2 text-ink-2 lg:hidden"
          >
            <span className="sr-only">
              {railOpen ? "Close menu" : "Open menu"}
            </span>
            {railOpen ? <IconClose /> : <IconMenu />}
          </button>

          <Link href="/" className="flex items-center gap-2.5">
            <Wordmark />
          </Link>
          <span aria-hidden="true" className="text-ink-4">
            /
          </span>
          <Label tone="ink">{workspace}</Label>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              className="hidden text-sm text-ink-2 hover:text-ink sm:inline"
            >
              Back to marketplace
            </Link>
            {/* Was an inert button labelled "Account". The console now runs
                behind a real session, so the slot carries the identity and the
                only action it needs. */}
            {displayEmail ? (
              <span className="hidden max-w-[16rem] truncate text-sm text-ink-3 sm:inline">
                {displayEmail}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => {
                void signOut()
                  .then(() => router.push("/marketplace/"))
                  .catch(() => {});
              }}
              className="flex items-center gap-1.5 rounded-sm border border-rule-2 px-2 py-1.5 text-sm text-ink-2 hover:border-ink-3"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <nav
          id="workspace-rail"
          aria-label={`${workspace} navigation`}
          className={cn(
            "w-60 shrink-0 border-r border-rule bg-paper px-3 py-5",
            "fixed inset-y-14 left-0 z-30 overflow-y-auto lg:sticky lg:top-14 lg:block lg:h-[calc(100dvh-3.5rem)]",
            railOpen ? "block" : "hidden lg:block",
          )}
        >
          {groups.map((group) => (
            <div key={group.heading} className="mb-5">
              <Label className="px-2">{group.heading}</Label>
              <ul className="mt-2 space-y-0.5">
                {group.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setRailOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors",
                          active
                            ? "bg-indigo-soft font-medium text-indigo"
                            : "text-ink-2 hover:bg-paper-sunk hover:text-ink",
                        )}
                      >
                        <span className="truncate">{item.label}</span>
                        {item.badge !== undefined ? (
                          <span className="shrink-0 rounded-xs bg-paper-sunk px-1.5 font-mono text-label tabular-nums text-ink-3">
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <main id="main" className="min-w-0 flex-1 bg-paper-sunk">
          {children}
        </main>
      </div>
    </div>
  );
}

/**
 * Page masthead inside a workspace. Distinct from the marketplace
 * `PageHeader`: no breadcrumbs (the rail shows position) and denser.
 */
export function WorkspaceHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border-b border-rule bg-paper px-4 py-5 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-h2 font-semibold text-ink">{title}</h1>
          {description ? (
            <p className="mt-1.5 max-w-[70ch] text-sm text-ink-3 text-pretty">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
