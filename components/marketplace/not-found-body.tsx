import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { Label } from "@/components/ui/typography";
import { IconArrowRight } from "@/components/ui/icon";

/**
 * Premium 404 recovery body.
 *
 * Keep this page useful and noindex: clear message, brand continuity, and
 * recovery paths into money pages — never a dead end.
 */
export function NotFoundBody({
  title = "That page is not available",
  body = "The link may be out of date, or the page may have moved. Use one of the paths below to keep exploring FabStitch fabrics.",
  suggestions,
}: {
  title?: string;
  body?: string;
  suggestions?: { label: string; href: string; hint?: string }[];
}) {
  const links = suggestions ?? [
    {
      label: "Go to homepage",
      href: "/",
      hint: "Start from the FabStitch landing experience",
    },
    {
      label: "Open the fabric marketplace",
      href: "/marketplace/",
      hint: "Search and filter the full 2027 catalog",
    },
    {
      label: "Browse fabric collections",
      href: "/collections/",
      hint: "Linen, cotton, silk, denim, and more",
    },
    {
      label: "Find fabrics by use",
      href: "/fabrics/best-for/",
      hint: "Shirts, dresses, activewear, bedding, outerwear",
    },
    {
      label: "Explore all fabrics",
      href: "/fabrics/",
      hint: "Hub for collections, Best For, and featured cloth",
    },
    {
      label: "Read fabric guides",
      href: "/guides/",
      hint: "Weight, composition, weaves, and sourcing basics",
    },
  ];

  return (
    <Container className="py-16">
      <div className="max-w-[56ch]">
        <p className="font-mono text-label uppercase text-ink-3">
          404 · FabStitch
        </p>
        <h1 className="mt-3 text-h1 font-semibold text-ink text-balance">
          {title}
        </h1>
        <p className="mt-3 text-body text-ink-3 text-pretty">{body}</p>

        <div className="mt-8">
          <Label>Continue exploring</Label>
          <ul className="mt-2.5 border-t border-rule-2">
            {links.map((link) => (
              <li
                key={`${link.href}-${link.label}`}
                className="border-b border-rule-2"
              >
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
