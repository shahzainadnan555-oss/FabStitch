import Link from "next/link";

export function ContactSupport({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      className={
        compact
          ? "border-t border-rule pt-6"
          : "rounded-md border border-rule-2 bg-navy-surface px-5 py-6 text-on-ink sm:px-7"
      }
    >
      <h2
        className={
          compact
            ? "text-h3 font-semibold text-ink"
            : "text-h2 font-semibold text-on-ink"
        }
      >
        Didn&rsquo;t find your answer?
      </h2>
      <p
        className={`mt-2 max-w-[58ch] text-sm ${compact ? "text-ink-3" : "text-on-navy-2"}`}
      >
        Help covers common product questions. Support is for issues that need
        the context of your account, fabric or inquiry.
      </p>
      <Link
        href="/contact/"
        className={`mt-4 inline-flex h-10 items-center rounded-sm px-4 text-sm font-semibold ${
          compact
            ? "bg-indigo text-white hover:bg-indigo-hover"
            : "bg-on-ink text-navy-surface hover:bg-on-navy-2"
        }`}
      >
        Contact us
      </Link>
    </aside>
  );
}
