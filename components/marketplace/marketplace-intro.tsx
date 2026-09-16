import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { IconArrowRight, IconSearch } from "@/components/ui/icon";
import type { CustomerCollectionCard } from "@/repositories/customer-catalog";

const DISCOVERY_LINKS = [
  { href: "/fabrics/", label: "All fabrics" },
  { href: "/collections/", label: "Collections" },
  { href: "/fabrics/best-for/", label: "Best For" },
  { href: "/guides/", label: "Guides" },
] as const;

export function MarketplaceIntro({
  query,
  collections,
}: {
  query?: string;
  collections: CustomerCollectionCard[];
}) {
  return (
    <section className="relative overflow-hidden bg-navy-surface text-on-ink">
      <div
        aria-hidden
        className="absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_82%_18%,rgba(199,154,85,0.25),transparent_26%),linear-gradient(118deg,transparent_48%,rgba(255,255,255,0.04)_48%)]"
      />
      <Container className="relative py-12 sm:py-16 lg:py-20">
        <p className="font-mono text-label tracking-[0.12em] text-gold-on-navy uppercase">
          Fabric marketplace
        </p>
        <h1 className="mt-4 max-w-[16ch] text-[clamp(2.4rem,4.6vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.05em] text-balance">
          Discover fabrics for what comes next.
        </h1>
        <p className="mt-4 max-w-[36rem] text-lead text-on-navy-2">
          Search the FabStitch 2027 catalog by fiber, construction, season,
          weight, or what you are making. Open a fabric for specs, then inquire
          when the material fits.
        </p>

        <form
          action="/marketplace/"
          role="search"
          className="mt-8 max-w-[48rem]"
        >
          <label htmlFor="marketplace-search" className="sr-only">
            Search the fabric marketplace
          </label>
          <div className="flex h-14 items-center gap-3 rounded-md border border-white/22 bg-white/10 p-1.5 pl-4 backdrop-blur-md transition-colors focus-within:border-white/55 focus-within:bg-white/14">
            <IconSearch
              width={19}
              height={19}
              className="shrink-0 text-on-navy-2"
              aria-hidden
            />
            <input
              id="marketplace-search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search linen, chiffon, velvet, denim..."
              className="h-full min-w-0 flex-1 bg-transparent text-base text-on-ink outline-none placeholder:text-on-navy-2"
            />
            <button
              type="submit"
              className="hidden h-full items-center gap-2 rounded-sm bg-on-ink px-5 text-sm font-semibold whitespace-nowrap text-navy-surface transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              Search
              <IconArrowRight width={14} height={14} aria-hidden />
            </button>
          </div>
        </form>

        <nav
          aria-label="Marketplace discovery"
          className="mt-5 flex flex-wrap gap-2"
        >
          {DISCOVERY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className="rounded-sm border border-white/20 bg-white/6 px-3 py-2 text-sm font-medium text-on-ink transition-colors hover:border-white/45 hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav
          aria-label="Fabric collections"
          className="mt-4 flex gap-2 overflow-x-auto pb-1"
        >
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}/`}
              prefetch={false}
              className="shrink-0 rounded-sm border border-white/20 bg-white/6 px-3 py-2 text-sm text-on-navy-2 transition-colors hover:border-white/45 hover:bg-white/10 hover:text-on-ink"
            >
              {collection.name}
            </Link>
          ))}
        </nav>
      </Container>
    </section>
  );
}
