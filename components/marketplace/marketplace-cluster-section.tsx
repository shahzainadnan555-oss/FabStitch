import Link from "next/link";
import { FaqJsonLd } from "@/components/seo/structured-data";
import { Container } from "@/components/ui/layout";
import { Heading, Prose } from "@/components/ui/typography";
import {
  MARKETPLACE_SUPPORT_PAGES,
  type MarketplaceFamily,
} from "@/domain/seo/marketplace-cluster";

const FAMILY_ORDER: MarketplaceFamily[] = [
  "education",
  "b2b",
  "buying",
  "sourcing",
  "journey",
  "brand",
];

const FAMILY_LABEL: Record<MarketplaceFamily, string> = {
  education: "Marketplace education",
  b2b: "B2B sourcing",
  buying: "Buying guides",
  sourcing: "Sourcing guides",
  journey: "Using the marketplace",
  brand: "Why FabStitch",
};

const FAQS = [
  {
    question: "What is a fabric marketplace?",
    answer:
      "On FabStitch it is the catalog at this page: search published fabrics, compare their specs, and inquire. It is not a ranking of the world's best cloth.",
  },
  {
    question: "How does B2B fabric sourcing work?",
    answer:
      "A business names the garment or production need, filters this catalog, opens a fabric page, and sends an inquiry with quantity. Supporting notes live on the sourcing guides linked below.",
  },
  {
    question: "How can businesses discover fabrics?",
    answer:
      "Search here, open a collection, or start from a Best For page. Discovery topics explain a term. The commercial catalog stays on this URL.",
  },
  {
    question: "How should I compare fabrics?",
    answer:
      "Hold the garment still and read composition, construction, and weight on each fabric page. Do not declare one fibre the winner for every project.",
  },
  {
    question: "What should I check before sourcing fabric?",
    answer:
      "Confirm the published composition and construction match the brief, note GSM only inside one construction, and attach the fabric URL to the inquiry.",
  },
  {
    question: "How does fabric GSM affect selection?",
    answer:
      "GSM is weight. Use it after construction is chosen. A light voile and a light jersey can share a number and still be different cloths.",
  },
  {
    question: "What fabric is suitable for shirts?",
    answer:
      "Stable woven shirtings such as poplin or oxford are the usual start when the page says so. Knit shirts are a separate search. See the shirt selection guide.",
  },
  {
    question: "What fabric is suitable for dresses?",
    answer:
      "It depends on drape and opacity. A crisp shirting and a fluid dress cloth answer different patterns. Start from the dress selection guide, then return here to see published options.",
  },
];

export function MarketplaceClusterSection() {
  const groups = FAMILY_ORDER.map((family) => ({
    family,
    pages: MARKETPLACE_SUPPORT_PAGES.filter((page) => page.family === family),
  })).filter((group) => group.pages.length > 0);

  return (
    <section
      id="marketplace-guides"
      className="border-t border-line bg-paper"
      aria-labelledby="marketplace-guides-heading"
    >
      <FaqJsonLd faqs={FAQS} />
      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-[52rem]">
          <Heading id="marketplace-guides-heading" level={2}>
            How businesses use this marketplace
          </Heading>
          <Prose className="mt-4 text-ink-2">
            This page is the place to search documented cloth. A fabric
            marketplace, in the FabStitch sense, is that search: fibre,
            construction, season, weight, or end use, then a fabric page you can
            inquire on. The notes below explain the steps. They do not replace
            this catalog, and they do not claim FabStitch is the largest or
            cheapest source of cloth.
          </Prose>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div>
              <Heading level={3}>Discover</Heading>
              <Prose className="mt-2 text-ink-2">
                Start with one constraint. Collections group a material. Best
                For groups a garment. Search here when you want the published
                cards.
              </Prose>
            </div>
            <div>
              <Heading level={3}>Evaluate</Heading>
              <Prose className="mt-2 text-ink-2">
                Read composition and construction before colour. Compare two
                fabrics on the same fields. Leave a spec blank if the page does
                not state it.
              </Prose>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-[72rem] gap-8 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <nav key={group.family} aria-label={FAMILY_LABEL[group.family]}>
              <Heading level={3}>{FAMILY_LABEL[group.family]}</Heading>
              <ul className="mt-3 space-y-2">
                {group.pages.map((page) => (
                  <li key={page.path}>
                    <Link
                      href={page.path}
                      className="text-indigo underline-offset-4 hover:underline"
                    >
                      {page.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-[52rem]">
          <Heading level={2}>Marketplace questions</Heading>
          <dl className="mt-4 space-y-5">
            {FAQS.map((faq) => (
              <div key={faq.question}>
                <dt className="font-semibold text-ink">{faq.question}</dt>
                <dd className="mt-1 text-ink-2">{faq.answer}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-sm text-ink-2">
            Fibre comparisons and material essays stay on their own pages in{" "}
            <Link href="/discover/" className="text-indigo hover:underline">
              fabric discovery
            </Link>{" "}
            and{" "}
            <Link href="/collections/" className="text-indigo hover:underline">
              collections
            </Link>
            , so this catalog remains the commercial URL.
          </p>
        </div>
      </Container>
    </section>
  );
}
