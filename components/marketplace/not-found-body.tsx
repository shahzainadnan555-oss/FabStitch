import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { Label } from "@/components/ui/typography";
import { IconArrowRight } from "@/components/ui/icon";

/**
 * Not-found body.
 *
 * A 404 in a marketplace is a routing opportunity, not a dead end: the buyer
 * was looking for something specific, so the page offers the doors that
 * actually lead somewhere rather than a single "go home" link.
 */
export function NotFoundBody({
  title = "That page does not exist",
  body = "The link may be out of date, or the record may no longer be published.",
  suggestions,
}: {
  title?: string;
  body?: string;
  suggestions?: { label: string; href: string; hint?: string }[];
}) {
  const links = suggestions ?? [
    {
      label: "Browse every fabric family",
      href: "/fabrics/",
      hint: "Cotton, knits, wovens, synthetics and more",
    },
    {
      label: "Start from what you're making",
      href: "/applications/",
      hint: "T-shirts, uniforms, bedding, upholstery",
    },
    {
      label: "Search fabrics",
      href: "/search/",
      hint: "By material, construction and specification",
    },
    {
      label: "Open the marketplace",
      href: "/marketplace/",
      hint: "Search, filter and sort FabStitch fabrics",
    },
  ];

  return (
    <Container className="py-16">
      <div className="max-w-[56ch]">
        <p className="font-mono text-label uppercase text-ink-3">404</p>
        <h1 className="mt-3 text-h1 font-semibold text-ink text-balance">
          {title}
        </h1>
        <p className="mt-3 text-body text-ink-3 text-pretty">{body}</p>

        <div className="mt-8">
          <Label>Try one of these</Label>
          <ul className="mt-2.5 border-t border-rule-2">
            {links.map((link) => (
              <li key={link.href} className="border-b border-rule-2">
                <Link href={link.href} className="group block py-3.5">
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-body font-medium text-ink group-hover:text-indigo">
                      {link.label}
                    </span>
                    <IconArrowRight
                      width={14}
                      height={14}
                      className="shrink-0 text-ink-4 transition-colors group-hover:text-indigo"
                    />
                  </span>
                  {link.hint ? (
                    <span className="mt-0.5 block text-sm text-ink-3">
                      {link.hint}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}
