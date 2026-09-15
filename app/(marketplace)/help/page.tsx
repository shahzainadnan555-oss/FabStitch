import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { ResourceNav } from "@/components/resources/resource-nav";
import { HelpCenter } from "@/features/help/help-center";
import {
  hasSeoQueryState,
  registeredStorefrontMetadata,
} from "@/lib/storefront-metadata";

const single = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export async function generateMetadata({
  searchParams,
}: PageProps<"/help">): Promise<Metadata> {
  const query = await searchParams;
  const searching = Boolean(single(query.q)?.trim());
  return registeredStorefrontMetadata("/help/", {
    title: searching ? "Help search results" : "Help Center",
    description:
      "Find quick answers about discovering fabrics, sending inquiries, managing your account, and using FabStitch.",
    index: !hasSeoQueryState(query),
  });
}

export default async function HelpPage({ searchParams }: PageProps<"/help">) {
  const query = await searchParams;
  const term = single(query.q)?.trim() ?? "";

  return (
    <>
      <section className="border-b border-rule-2 bg-paper-sunk">
        <Container className="py-10 sm:py-14">
          <ResourceNav current="help" />
          <p className="mt-8 font-mono text-label tracking-[0.14em] text-gold-ink uppercase">
            Help
          </p>
          <h1 className="mt-4 max-w-[16ch] text-[clamp(2.1rem,4.2vw,4rem)] leading-[0.92] font-bold tracking-[-0.055em] text-balance text-ink">
            How can we help?
          </h1>
          <p className="mt-5 max-w-[38rem] text-lead text-ink-2">
            Find quick answers about discovering fabrics, sending inquiries,
            managing your account, and using FabStitch.
          </p>
        </Container>
      </section>

      <Container className="py-8 sm:py-10 lg:py-12">
        <HelpCenter initialQuery={term} />

        <div className="mt-12 flex flex-col gap-3 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[42ch] text-sm text-ink-3">
            Need help with something specific? Support is for questions that
            need a person.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/support/"
              className="inline-flex h-11 items-center rounded-sm bg-indigo px-4 text-sm font-semibold text-white hover:bg-indigo-hover"
            >
              Contact Support
            </Link>
            <Link
              href="/guides/"
              className="inline-flex h-11 items-center rounded-sm border border-rule-2 px-4 text-sm font-semibold text-ink hover:border-ink-3"
            >
              Read Guides
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
