import Link from "next/link";
import { Wordmark } from "./logo";
import { GlobalNav } from "./global-nav";

/**
 * Public storefront header.
 *
 * Layout: logo left · primary nav optically centered · utilities right.
 * Uses a three-column grid so the center nav is centered to the header,
 * not merely shoved into leftover flex space beside the logo.
 */
export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule-brand bg-paper/94 backdrop-blur-md">
      <div className="relative mx-auto grid h-[4.25rem] w-[calc(100%-48px)] max-w-[1400px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <div className="justify-self-start">
          <Link
            href="/"
            aria-label="FabStitch home"
            className="inline-flex shrink-0 rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo"
          >
            <Wordmark />
          </Link>
        </div>
        <GlobalNav />
      </div>
    </header>
  );
}
