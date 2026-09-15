import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Wordmark } from "@/components/layout/logo";
import { AuthShellAccount } from "./auth-shell-account";

export function AuthPanel({
  title,
  intro,
  counterpart,
  footer,
  resuming,
  children,
}: {
  title: string;
  intro: string;
  counterpart?: { prompt: string; label: string; href: string };
  footer?: ReactNode;
  resuming?: string | null;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#f7f6f3]">
      <header className="border-b border-rule/80 bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-[calc(100%-2rem)] max-w-[72rem] items-center justify-between gap-4 sm:w-[calc(100%-3rem)]">
          <Link href="/" aria-label="FabStitch home" className="rounded-xs">
            <Wordmark />
          </Link>
          <AuthShellAccount counterpart={counterpart} />
        </div>
      </header>

      <div className="mx-auto grid w-[calc(100%-2rem)] max-w-[72rem] flex-1 items-center gap-10 py-10 sm:w-[calc(100%-3rem)] sm:py-14 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16">
        <main
          id="main"
          className="w-full max-w-[26rem] justify-self-center lg:justify-self-start"
        >
          {resuming ? (
            <p className="mb-6 rounded-md border border-indigo/20 bg-indigo-wash px-3.5 py-2.5 text-sm text-ink-2 text-pretty">
              Sign in to continue with {resuming}. You will return to it next.
            </p>
          ) : null}

          <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-4 uppercase">
            FabStitch
          </p>
          <h1 className="mt-3 text-[1.75rem] leading-tight font-semibold tracking-[-0.02em] text-ink text-balance sm:text-[2rem]">
            {title}
          </h1>
          <p className="mt-3 text-[0.975rem] leading-relaxed text-ink-3 text-pretty">
            {intro}
          </p>

          <div className="mt-8 rounded-xl border border-rule bg-paper p-5 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.45)] sm:p-7">
            {children}
          </div>

          {footer ? (
            <div className="mt-6 text-center text-sm text-ink-3">{footer}</div>
          ) : null}
        </main>

        <aside className="relative hidden min-h-[28rem] overflow-hidden rounded-2xl bg-[#0f172a] lg:block">
          <Image
            src="/media/hero-navy-jersey.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, 1px"
            className="object-cover object-[62%_center] opacity-85"
            priority={false}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-[#0b1220] via-[#0b1220]/70 to-[#0b1220]/20"
          />
          <div className="relative flex h-full flex-col justify-end p-9 xl:p-11">
            <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-white/55 uppercase">
              Fabric marketplace
            </p>
            <h2 className="mt-3 max-w-[16ch] text-[1.65rem] leading-tight font-semibold tracking-[-0.02em] text-white text-balance">
              Source cloth with confidence.
            </h2>
            <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-white/70 text-pretty">
              Specifications, quantities, and private inquiries — built for
              serious fabric sourcing.
            </p>
          </div>
        </aside>
      </div>

      <footer className="border-t border-rule/80 bg-paper">
        <div className="mx-auto flex w-[calc(100%-2rem)] max-w-[72rem] flex-wrap items-center justify-between gap-3 py-4 text-xs text-ink-4 sm:w-[calc(100%-3rem)]">
          <p>&copy; {new Date().getFullYear()} FabStitch</p>
          <Link href="/help/" className="hover:text-ink hover:underline">
            Help
          </Link>
        </div>
      </footer>
    </div>
  );
}
