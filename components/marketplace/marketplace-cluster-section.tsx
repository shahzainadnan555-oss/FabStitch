import Link from "next/link";
import { FaqJsonLd } from "@/components/seo/structured-data";
import { Container } from "@/components/ui/layout";
import { Heading, Label } from "@/components/ui/typography";
import { cn } from "@/lib/cn";
import {
  MARKETPLACE_SUPPORT_PAGES,
  type MarketplaceFamily,
  type MarketplaceSupportPage,
} from "@/domain/seo/marketplace-cluster";
import { MARKETPLACE_TOPIC_HUBS } from "@/domain/seo/marketplace-thousand";

const FAMILY_ORDER: MarketplaceFamily[] = [
  "education",
  "b2b",
  "sourcing",
  "journey",
  "brand",
  "buying",
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

const STEPS = [
  {
    index: "01",
    title: "Discover",
    body: "Start with one constraint. Collections group a material. Best For groups a garment. Search here when you want the published cards.",
  },
  {
    index: "02",
    title: "Evaluate",
    body: "Read composition and construction before colour. Compare two fabrics on the same fields. Leave a spec blank if the page does not state it.",
  },
] as const;

function guideLinkClassName() {
  return "text-sm leading-snug text-ink-2 transition-colors hover:text-indigo focus-visible:text-indigo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo";
}

function GuideLinks({ pages }: { pages: readonly MarketplaceSupportPage[] }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {pages.map((page) => (
        <li key={page.path}>
          <Link href={page.path} className={guideLinkClassName()}>
            {page.h1}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function GuideCard({
  label,
  pages,
  className,
  columns = false,
}: {
  label: string;
  pages: readonly MarketplaceSupportPage[];
  className?: string;
  columns?: boolean;
}) {
  return (
    <nav
      aria-label={label}
      className={cn(
        "rounded-md border border-rule bg-paper-raised p-5 sm:p-6",
        className,
      )}
    >
      <Label tone="ink">{label}</Label>
      {columns ? (
        <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <li key={page.path}>
              <Link href={page.path} className={guideLinkClassName()}>
                {page.h1}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <GuideLinks pages={pages} />
      )}
    </nav>
  );
}

export function MarketplaceClusterSection() {
  const groups = FAMILY_ORDER.map((family) => ({
    family,
    pages: MARKETPLACE_SUPPORT_PAGES.filter((page) => page.family === family),
  })).filter((group) => group.pages.length > 0);
  const compact = groups.filter((group) => group.family !== "buying");
  const buying = groups.find((group) => group.family === "buying");

  return (
    <section
      id="marketplace-guides"
      className="border-t border-rule bg-paper"
      aria-labelledby="marketplace-guides-heading"
    >
      <FaqJsonLd faqs={FAQS} />
      <Container className="py-14 sm:py-16">
        <div className="border-b border-rule pb-8">
          <Label>For businesses</Label>
          <Heading
            id="marketplace-guides-heading"
            level={2}
            className="mt-3 max-w-[18ch]"
          >
            How businesses use this marketplace
          </Heading>
        </div>

        <nav
          aria-label="Marketplace topic directories"
          className="mt-8 rounded-md border border-rule bg-paper-raised p-5 sm:p-6"
        >
          <Label tone="ink">Topic directories</Label>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {MARKETPLACE_TOPIC_HUBS.map((hub) => (
              <li key={hub.path}>
                <Link
                  href={hub.path}
                  className="text-sm text-ink-2 hover:text-indigo"
                >
                  {hub.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {STEPS.map((step) => (
            <article
              key={step.title}
              className="rounded-md border border-rule bg-paper-raised p-5 sm:p-6"
            >
              <p className="font-mono text-label text-gold-ink">{step.index}</p>
              <Heading level={3} className="mt-3">
                {step.title}
              </Heading>
              <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-ink-2">
                {step.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <Label>Guides</Label>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {compact.map((group) => (
              <GuideCard
                key={group.family}
                label={FAMILY_LABEL[group.family]}
                pages={group.pages}
              />
            ))}
          </div>
          {buying ? (
            <GuideCard
              className="mt-4"
              label={FAMILY_LABEL.buying}
              pages={buying.pages}
              columns
            />
          ) : null}
        </div>

        <div className="mt-12">
          <Label>Questions</Label>
          <Heading level={2} className="mt-3">
            Marketplace questions
          </Heading>
          <dl className="mt-5 overflow-hidden rounded-md border border-rule bg-paper-raised">
            {FAQS.map((faq, index) => (
              <div
                key={faq.question}
                className={cn(
                  "px-5 py-4 sm:px-6 sm:py-5",
                  index > 0 && "border-t border-rule",
                )}
              >
                <dt className="text-sm font-semibold text-ink">
                  {faq.question}
                </dt>
                <dd className="mt-1.5 max-w-[68ch] text-sm leading-relaxed text-ink-2">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 max-w-[68ch] text-sm leading-relaxed text-ink-2">
            Fibre comparisons and material essays stay on their own pages in{" "}
            <Link href="/discover/" className={guideLinkClassName()}>
              fabric discovery
            </Link>{" "}
            and{" "}
            <Link href="/collections/" className={guideLinkClassName()}>
              collections
            </Link>
            , so this catalog remains the commercial URL.
          </p>
          <nav aria-label="Related fabric topics" className="mt-6">
            <Label tone="ink">Related topics</Label>
            <ul className="mt-3 flex flex-wrap gap-2">
              {[
                { href: "/guides/fabric-questions/", label: "Fabric questions" },
                { href: "/guides/fabric-weight-and-gsm/", label: "Fabric GSM" },
                { href: "/guides/cotton-vs-linen/", label: "Cotton vs linen" },
                {
                  href: "/guides/woven-vs-knit-fabrics/",
                  label: "Woven vs knit",
                },
                { href: "/fabric-sourcing/", label: "Fabric sourcing" },
                { href: "/wholesale-fabric/", label: "Wholesale fabric" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex rounded-sm border border-rule bg-paper px-3 py-1.5 text-sm text-ink-2 hover:border-indigo hover:text-indigo"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </section>
  );
}
