import Link from "next/link";

const ITEMS = [
  {
    href: "/guides/",
    label: "Guides",
    description: "Fabric knowledge",
  },
  {
    href: "/help/",
    label: "Help",
    description: "Quick answers",
  },
  {
    href: "/support/",
    label: "Support",
    description: "Contact FabStitch",
  },
] as const;

export function ResourceNav({
  current,
}: {
  current: "guides" | "help" | "support";
}) {
  return (
    <nav aria-label="Guides, Help and Support" className="border-b border-rule">
      <ul className="flex flex-wrap gap-1">
        {ITEMS.map((item) => {
          const active = item.href === `/${current}/`;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 flex-col justify-center px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo sm:px-4 ${
                  active
                    ? "border-b-2 border-ink font-semibold text-ink"
                    : "text-ink-3 hover:text-ink"
                }`}
              >
                <span>{item.label}</span>
                <span className="hidden text-xs font-normal text-ink-4 sm:block">
                  {item.description}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
