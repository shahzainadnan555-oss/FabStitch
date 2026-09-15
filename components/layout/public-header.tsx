import Link from "next/link";
import { Wordmark } from "./logo";
import { GlobalNav } from "./global-nav";

/**
 * Public storefront header.
 *
 * Three clear zones so primary pages never collide with search/account:
 * LEFT logo · CENTER primary pages · RIGHT utilities / CTAs
 */
export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule-brand bg-paper/94 backdrop-blur-md">
      <div className="mx-auto flex h-[4.25rem] w-[calc(100%-40px)] max-w-[1440px] items-center gap-4 sm:w-[calc(100%-48px)] sm:gap-6">
        <div className="shrink-0">
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
