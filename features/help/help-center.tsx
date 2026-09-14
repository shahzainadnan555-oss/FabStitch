"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IconArrowRight, IconSearch } from "@/components/ui/icon";
import {
  HELP_ARTICLES,
  HELP_CATEGORIES,
  searchHelp,
  type HelpArticle,
  type HelpCategory,
} from "./content";

function syncHelpQuery(value: string) {
  const next = value.trim()
    ? `/help/?q=${encodeURIComponent(value.trim())}`
    : "/help/";
  window.history.replaceState(null, "", next);
}

function categoryId(category: HelpCategory) {
  return `help-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function HelpCenter({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const matches = useMemo(() => searchHelp(query), [query]);
  const searching = Boolean(query.trim());

  return (
    <div>
      <form
        role="search"
        className="max-w-[46rem]"
        onSubmit={(event) => {
          event.preventDefault();
          syncHelpQuery(query);
        }}
      >
        <label htmlFor="help-search" className="sr-only">
          Search help questions
        </label>
        <div className="flex min-h-13 items-center gap-3 rounded-sm border border-border bg-paper-raised p-1.5 pl-4 focus-within:border-indigo focus-within:ring-2 focus-within:ring-indigo/15">
          <IconSearch
            width={18}
            height={18}
            className="shrink-0 text-ink-3"
            aria-hidden
          />
          <input
            id="help-search"
            name="q"
            type="search"
            value={query}
            autoComplete="off"
            enterKeyHint="search"
            placeholder="How do I send an inquiry?"
            onChange={(event) => {
              const next = event.target.value;
              setQuery(next);
              syncHelpQuery(next);
            }}
            className="h-11 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-4"
          />
          <button
            type="submit"
            className="hidden h-10 shrink-0 rounded-sm bg-indigo px-4 text-sm font-semibold text-white hover:bg-indigo-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo sm:inline-flex sm:items-center"
          >
            Search
          </button>
        </div>
      </form>

      {!searching ? (
        <nav aria-label="Help categories" className="mt-6 overflow-x-auto">
          <ul className="flex min-w-min flex-wrap gap-2">
            {HELP_CATEGORIES.map((category) => (
              <li key={category}>
                <a
                  href={`#${categoryId(category)}`}
                  className="inline-flex min-h-10 items-center rounded-sm border border-rule-2 bg-paper-raised px-3 text-sm text-ink-2 hover:border-ink-3 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
                >
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {searching ? (
        <section className="mt-10" aria-live="polite">
          <p className="font-mono text-label tracking-[0.09em] text-gold-ink uppercase">
            {matches.length} {matches.length === 1 ? "answer" : "answers"}
          </p>
          <h2 className="mt-2 text-h2 font-semibold text-ink">
            Results for &ldquo;{query.trim()}&rdquo;
          </h2>
          {matches.length ? (
            <FaqList articles={matches} className="mt-5" />
          ) : (
            <div className="mt-5 rounded-md border border-rule-2 bg-paper-sunk p-5">
              <p className="font-semibold text-ink">No matching answer</p>
              <p className="mt-1 text-sm text-ink-3">
                Try a shorter phrase such as inquiry, currency or account, or
                contact FabStitch.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/support/"
                  className="inline-flex h-10 items-center rounded-sm bg-indigo px-4 text-sm font-semibold text-white hover:bg-indigo-hover"
                >
                  Go to Support
                </Link>
                <Link
                  href="/contact/"
                  className="inline-flex h-10 items-center rounded-sm border border-rule-2 px-4 text-sm font-semibold text-ink hover:border-ink-3"
                >
                  Contact FabStitch
                </Link>
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="mt-10 space-y-11">
          {HELP_CATEGORIES.map((category) => {
            const articles = HELP_ARTICLES.filter(
              (article) => article.category === category,
            );
            if (!articles.length) return null;
            return (
              <section key={category} id={categoryId(category)}>
                <h2 className="text-h3 font-semibold text-ink">{category}</h2>
                <FaqList articles={articles} className="mt-4" />
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FaqList({
  articles,
  className,
}: {
  articles: HelpArticle[];
  className?: string;
}) {
  return (
    <ul className={`grid gap-2 ${className ?? ""}`}>
      {articles.map((article) => (
        <li key={article.slug}>
          <details className="group rounded-sm border border-rule-2 bg-paper-raised open:border-rule">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-4 py-4 text-left marker:content-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo [&::-webkit-details-marker]:hidden">
              <span>
                <span className="block font-semibold text-ink">
                  {article.title}
                </span>
                <span className="mt-1 block text-sm text-ink-3">
                  {article.summary}
                </span>
              </span>
              <span
                aria-hidden
                className="mt-1 shrink-0 font-mono text-xs text-ink-4 group-open:hidden"
              >
                +
              </span>
              <span
                aria-hidden
                className="mt-1 hidden shrink-0 font-mono text-xs text-ink-4 group-open:inline"
              >
                −
              </span>
            </summary>
            <div className="border-t border-rule px-4 py-4">
              {article.sections[0]?.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-2 text-sm leading-relaxed text-ink-2 first:mt-0"
                >
                  {paragraph}
                </p>
              ))}
              <Link
                href={`/help/${article.slug}/`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
              >
                Read full answer
                <IconArrowRight width={13} height={13} aria-hidden />
              </Link>
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
