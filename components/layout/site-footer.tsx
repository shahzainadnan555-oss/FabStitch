import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { Wordmark } from "./logo";
import { FooterAccountLinks } from "./footer-account-links";
import { FOOTER_LINK_GROUPS } from "./nav-model";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule-on-navy bg-navy-surface text-on-ink">
      <Container className="py-14 sm:py-16 lg:py-18">
        <div className="grid gap-y-14 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:gap-x-14 lg:gap-x-20 xl:grid-cols-[minmax(0,0.9fr)_minmax(36rem,1.1fr)] xl:gap-x-24">
          <div className="max-w-md">
            <Link
              href="/"
              aria-label="FabStitch home"
              className="inline-flex rounded-sm focus-visible:outline-gold-on-navy"
            >
              <Wordmark tone="on-ink" />
            </Link>
            <p className="mt-9 max-w-[12ch] text-[clamp(2rem,3.3vw,3rem)] leading-[0.96] font-semibold tracking-[-0.045em] text-on-ink">
              <span className="block">Material first.</span>
              <span className="block">Always.</span>
            </p>
            <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-on-navy-2">
              Fabric discovery and professional sourcing, built around the
              material you need and the quantity you are making.
            </p>
          </div>

          <nav aria-label="Footer">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 xl:grid-cols-4 xl:gap-x-7">
              {FOOTER_LINK_GROUPS.map((group) => (
                <div key={group.label}>
                  <h2
                    id={`footer-${group.label.toLowerCase()}`}
                    className="font-mono text-label text-gold-on-navy uppercase"
                  >
                    {group.label}
                  </h2>
                  {group.label === "Account" ? (
                    <FooterAccountLinks />
                  ) : (
                    <ul
                      aria-labelledby={`footer-${group.label.toLowerCase()}`}
                      className="mt-5 grid gap-3"
                    >
                      {group.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            prefetch={false}
                            className="relative inline-block text-sm font-normal text-on-navy-2 transition-colors duration-200 after:absolute after:right-0 after:-bottom-0.5 after:left-0 after:h-px after:origin-left after:scale-x-0 after:bg-on-ink after:transition-transform after:duration-200 hover:text-on-ink hover:after:scale-x-100 focus-visible:text-on-ink focus-visible:outline-gold-on-navy"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>

        <p
          aria-hidden
          className="mt-14 w-full overflow-hidden text-center text-[clamp(3rem,8vw,6.5rem)] leading-[0.78] font-semibold tracking-[-0.075em] text-navy-surface-2 uppercase select-none sm:mt-16"
        >
          FabStitch
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-rule-on-navy pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-label uppercase text-on-navy-2">
            &copy; {new Date().getFullYear()} FabStitch
          </p>
        </div>
      </Container>
    </footer>
  );
}
