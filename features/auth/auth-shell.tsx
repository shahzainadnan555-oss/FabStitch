import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Wordmark } from "@/components/layout/logo";
import { IconQuantity, IconDocument, IconShield } from "@/components/ui/icon";

/**
 * Authentication shell.
 *
 * A page, never an overlay. Sign-in is a step in the product, so it gets a
 * route, a title, a back button and a URL a buyer can bookmark or be redirected
 * to - all of which a modal throws away.
 *
 * Composition follows the approved reference: the form is the primary column,
 * a restrained fabric panel carries the brand on the right, and the marketplace
 * navigation is deliberately absent. Someone signing in has one job; a header
 * full of doors is an invitation to abandon it.
 */

/**
 * What an account is for, from the buyer's side.
 *
 * This panel used to sell a supplier directory - "verified suppliers", "the
 * suppliers you choose", "reach the right supplier". That is the previous
 * product. A buyer does not source a supplier here, they source cloth, and
 * naming the counterparty in the first screen of the funnel sets an
 * expectation the rest of the product deliberately does not meet.
 */
const ASSURANCES = [
  {
    Icon: IconDocument,
    title: "Specifications on the record",
    body: "Composition, weight, width and construction, stated per fabric rather than described in prose.",
  },
  {
    Icon: IconQuantity,
    title: "Priced against your quantity",
    body: "Tell us how much you need and we come back with availability, lead time and price for that amount.",
  },
  {
    Icon: IconShield,
    title: "Your enquiry stays private",
    body: "What you ask for is not published to the market. Nothing is charged and no card is taken.",
  },
];

export function AuthShell({
  title,
  intro,
  /** The opposite-mode link for the top bar. */
  counterpart,
  /** Shown under the form, e.g. "Already have an account?". */
  footer,
  /** Names the interrupted action when the buyer was sent here mid-flow. */
  resuming,
  children,
}: {
  title: string;
  intro: string;
  counterpart?: { prompt: string; label: string; href: string };
  footer?: ReactNode;
  resuming?: string | null;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="border-b border-rule-brand">
        <div className="fs-gutter mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4">
          <Link href="/" aria-label="FabStitch - home" className="rounded-xs">
            <Wordmark />
          </Link>
          {counterpart ? (
            <p className="text-sm text-ink-3">
              <span className="hidden sm:inline">{counterpart.prompt} </span>
              <Link
                href={counterpart.href}
                className="font-semibold text-indigo hover:underline"
              >
                {counterpart.label}
              </Link>
            </p>
          ) : null}
        </div>
      </header>

      <div className="grid flex-1 lg:grid-cols-[1fr_0.85fr]">
        {/* Centred in its column rather than pinned to the top: these forms are
            short, and a short form hard against the top of a tall viewport
            reads as an unfinished page. */}
        <div className="flex items-center justify-center py-10 sm:py-14">
          <main id="main" className="fs-gutter w-full max-w-[34rem]">
            {resuming ? (
              <p className="mb-6 rounded-md border border-rule-brand bg-indigo-wash px-3.5 py-2.5 text-sm text-ink-2 text-pretty">
                Sign in to continue with {resuming}. You will come straight back
                to it.
              </p>
            ) : null}

            <h1 className="text-h1 font-semibold text-ink text-balance">
              {title}
            </h1>
            <p className="mt-2 text-body text-ink-3 text-pretty">{intro}</p>

            <div className="mt-7">{children}</div>

            {footer ? (
              <div className="mt-7 border-t border-rule pt-5 text-sm text-ink-3">
                {footer}
              </div>
            ) : null}
          </main>
        </div>

        {/* Brand panel. Real fabric photography, restrained: it sets the
            category, it does not sell. No statistics appear here because
            FabStitch has none to state (docs/DECISIONS.md R7). */}
        <aside className="relative hidden overflow-hidden bg-ink-surface lg:block">
          <Image
            src="/media/hero-navy-jersey.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 46vw, 1px"
            className="object-cover object-[62%_center] opacity-90"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-ink-surface via-ink-surface/70 to-ink-surface/10"
          />

          <div className="relative flex h-full flex-col justify-end p-9 xl:p-11">
            <h2 className="max-w-[18ch] text-h2 font-semibold text-on-ink text-balance">
              Find the cloth. Tell us the quantity.
            </h2>
            <ul className="mt-7 flex max-w-[38ch] flex-col gap-5">
              {ASSURANCES.map((item) => (
                <li key={item.title} className="flex gap-3.5">
                  <item.Icon
                    width={17}
                    height={17}
                    className="mt-0.5 shrink-0 text-on-ink/55"
                  />
                  <div>
                    <p className="text-sm font-semibold text-on-ink">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-on-ink-2 text-pretty">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <footer className="border-t border-rule bg-paper">
        <div className="fs-gutter mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
          <p className="text-xs text-ink-4">
            &copy; {new Date().getFullYear()} FabStitch
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-1">
            {[{ label: "Help", href: "/help/" }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-ink-3 hover:text-ink hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
