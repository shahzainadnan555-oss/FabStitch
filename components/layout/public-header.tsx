import Link from "next/link";
import { Wordmark } from "./logo";
import { GlobalNav } from "./global-nav";

/**
 * Public storefront header.
 *
 * Layout: logo left · primary nav centered to the header · utilities right.
 * Nav is absolutely centered so asymmetric logo/CTA widths cannot push it off-center.
 */
export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule-brand bg-paper/94 backdrop-blur-md">
      <div className="relative mx-auto flex h-[4.25rem] w-[calc(100%-48px)] max-w-[1400px] items-center">
        <div className="relative z-10 shrink-0">
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
