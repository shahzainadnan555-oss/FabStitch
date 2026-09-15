import Link from "next/link";
import { Wordmark } from "./logo";
import { GlobalNav } from "./global-nav";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule-brand bg-paper/94 backdrop-blur-md">
      <div className="mx-auto flex h-[4.25rem] w-[calc(100%-48px)] max-w-[1400px] items-center gap-6">
        <Link
          href="/"
          aria-label="FabStitch home"
          className="shrink-0 rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo"
        >
          <Wordmark />
        </Link>
        <GlobalNav />
      </div>
    </header>
  );
}
