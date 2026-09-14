"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Panel } from "@/components/ui/layout";
import { Label } from "@/components/ui/typography";
import { IconArrowRight } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { InquiryDialog } from "./inquiry-form";
import type { InquiryFlowFabric } from "./types";

export type { InquiryFlowFabric };

type InquiryFlowContextValue = {
  fabric: InquiryFlowFabric;
  open: () => void;
};

const InquiryFlowContext = createContext<InquiryFlowContextValue | null>(null);

function useInquiryFlow(): InquiryFlowContextValue {
  const value = useContext(InquiryFlowContext);
  if (!value) {
    throw new Error("Inquiry controls must be inside InquiryFlowProvider");
  }
  return value;
}

export function InquiryFlowProvider({
  fabric,
  children,
}: {
  fabric: InquiryFlowFabric;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const show = useCallback(() => setOpen(true), []);
  const value = useMemo(() => ({ fabric, open: show }), [fabric, show]);

  return (
    <InquiryFlowContext.Provider value={value}>
      {children}
      <InquiryDialog
        open={open}
        onClose={() => setOpen(false)}
        fabric={fabric}
      />
    </InquiryFlowContext.Provider>
  );
}

export function InquiryButton({
  label = "Send Inquiry",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const { fabric, open } = useInquiryFlow();

  return (
    <button
      type="button"
      onClick={open}
      aria-haspopup="dialog"
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-indigo px-5 text-sm font-semibold text-white",
        "transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-indigo-hover",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo",
        className,
      )}
    >
      {label}
      <span className="sr-only"> for {fabric.name}</span>
      <IconArrowRight width={14} height={14} aria-hidden />
    </button>
  );
}

export function InquiryEntryPanel() {
  const { fabric } = useInquiryFlow();

  return (
    <div id="inquiry" className="scroll-mt-24">
      <Panel className="p-4">
        <Label>Commercial inquiry</Label>
        <h2 className="mt-2 text-h3 font-semibold text-ink">
          Ask about {fabric.name}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-3">
          Confirm your quantity and contact details. FabStitch follows up at
          your registered email.
        </p>
        <InquiryButton className="mt-4 w-full" />
        <p className="mt-3 text-xs leading-relaxed text-ink-3">
          Sign-in is required. No payment details or supplier data are
          collected.
        </p>
      </Panel>
    </div>
  );
}
