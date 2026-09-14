"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { IconClose, IconSearch } from "@/components/ui/icon";

export function HeaderSearch({ mobile = false }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const inputId = mobile
    ? "header-fabric-search-mobile"
    : "header-fabric-search-desktop";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          mobile
            ? "mt-1 inline-flex w-full items-center gap-2 border-t border-rule px-3 py-3 text-left text-base font-medium text-ink"
            : "inline-flex h-9 items-center gap-2 rounded-xs px-2.5 text-sm font-medium text-ink-2 transition-colors hover:text-indigo"
        }
      >
        <IconSearch width={mobile ? 16 : 15} height={mobile ? 16 : 15} />
        Search
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        label="Search FabStitch fabrics"
        className="max-w-[42rem]"
      >
        <div className="w-full p-5 sm:p-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="font-mono text-label tracking-[0.1em] text-gold-ink uppercase">
                Fabric discovery
              </p>
              <h2 className="mt-2 text-h2 font-semibold text-ink">
                What are you looking for?
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid size-9 shrink-0 place-items-center rounded-sm text-ink-3 hover:bg-paper-sunk hover:text-ink"
            >
              <span className="sr-only">Close search</span>
              <IconClose width={17} height={17} aria-hidden />
            </button>
          </div>

          <form action="/marketplace/" className="mt-7">
            <label htmlFor={inputId} className="sr-only">
              Search fabrics
            </label>
            <div className="flex items-center gap-3 rounded-sm border border-border bg-paper-raised p-1.5 pl-3 focus-within:border-indigo focus-within:ring-2 focus-within:ring-indigo/15">
              <IconSearch
                width={18}
                height={18}
                className="shrink-0 text-ink-3"
                aria-hidden
              />
              <input
                id={inputId}
                name="q"
                type="search"
                autoFocus
                required
                placeholder="Cotton jersey, linen, activewear..."
                className="h-10 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-4"
              />
              <button
                type="submit"
                className="h-10 rounded-sm bg-indigo px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-hover"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
}
