import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { PageHeader } from "@/components/marketplace/page-header";
import { Prose } from "@/components/ui/typography";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return registeredStorefrontMetadata("/about/", {
    title: "About FabStitch",
  });
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="About FabStitch"
        title="Material decisions, made clearer."
        intro="FabStitch is a fabric discovery and purchasing platform built around what a business is making, the cloth it needs and the quantity it can use."
      />
      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,44rem)_1fr] lg:items-start">
          <Prose>
            <p>
              Most fabric sourcing still happens by email. A customer describes
              what they need, waits, and receives specifications in inconsistent
              formats. The comparison work arrives at exactly the point a clear
              material decision matters most.
            </p>
            <p className="mt-4">
              FabStitch moves that work into the product. Composition,
              construction, weight, width, quantity, price and lead time stay
              structured so materials can be explored and evaluated on the same
              terms.
            </p>
            <p className="mt-4">
              It also translates intent. A customer may know the shirt, uniform
              or interior product they are making before they know the exact
              construction. FabStitch connects that application to suitable
              fabrics without asking them to learn the taxonomy first.
            </p>
            <h2 className="mt-8 text-h3 font-semibold text-ink">
              What it is not
            </h2>
            <p className="mt-3">
              Not a trade directory: those return companies, not specifications.
              Not a retail fabric shop: quantities, pricing and production
              support are wrong for manufacturing. Not a blog with an enquiry
              form.
            </p>
            <h2 className="mt-8 text-h3 font-semibold text-ink">On honesty</h2>
            <p className="mt-3">
              FabStitch does not publish commercial figures the catalogue does
              not hold, and labels illustrative records as illustrative. Where
              inventory is thin or temporarily unavailable, it says so.
            </p>
          </Prose>

          <aside className="grid gap-px overflow-hidden rounded-md border border-rule-2 bg-rule-2">
            {[
              [
                "Discover",
                "Begin with a material or what you are making.",
                "/collections/",
                "Browse collections",
              ],
              [
                "Understand",
                "Read product fit and structured specifications together.",
                "/guides/",
                "Read fabric guides",
              ],
              [
                "Choose",
                "Choose a fabric and send the quantity you need as an inquiry.",
                "/marketplace/",
                "Explore fabrics",
              ],
            ].map(([title, body, href, label], index) => (
              <div key={title} className="bg-paper-raised p-5">
                <span className="font-mono text-label text-gold-ink">
                  0{index + 1}
                </span>
                <h2 className="mt-5 text-h3 font-semibold text-ink">{title}</h2>
                <p className="mt-2 text-sm text-ink-3">{body}</p>
                <Link
                  href={href}
                  className="mt-4 inline-flex text-sm font-semibold text-indigo underline-offset-4 hover:underline"
                >
                  {label}
                </Link>
              </div>
            ))}
          </aside>
        </div>
      </Container>
    </>
  );
}
