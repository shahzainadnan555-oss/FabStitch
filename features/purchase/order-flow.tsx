"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MediaSubject } from "@/components/marketplace/fabric-media";
import { Panel } from "@/components/ui/layout";
import { IconArrowRight } from "@/components/ui/icon";
import { Label } from "@/components/ui/typography";
import { cn } from "@/lib/cn";
import { OrderModal } from "./order-modal";

export type OrderFlowFabric = {
  id: string;
  slug: string;
  name: string;
  listingSlug: string | null;
  imageSrc?: string;
  imageAlt: string;
  mediaSubject: MediaSubject;
  minimum: number | null;
  quantityUnit: "kg" | "m" | "yard" | "piece" | "roll" | null;
};

type OrderFlowContextValue = {
  fabric: OrderFlowFabric;
  open: () => void;
};

const OrderFlowContext = createContext<OrderFlowContextValue | null>(null);

function useOrderFlow(): OrderFlowContextValue {
  const value = useContext(OrderFlowContext);
  if (!value) {
    throw new Error("Order controls must be inside OrderFlowProvider");
  }
  return value;
}

export function OrderFlowProvider({
  fabric,
  children,
}: {
  fabric: OrderFlowFabric;
  children: ReactNode;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const open = useCallback(() => setModalOpen(true), []);
  const value = useMemo(() => ({ fabric, open }), [fabric, open]);

  return (
    <OrderFlowContext value={value}>
      {children}
      <OrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fabric={fabric}
      />
    </OrderFlowContext>
  );
}

export function BuyButton({
  label = "Buy now",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const { fabric, open } = useOrderFlow();

  return (
    <button
      type="button"
      onClick={open}
      aria-haspopup="dialog"
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-indigo px-5 text-sm font-semibold text-white",
        "transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-indigo-hover",
        className,
      )}
    >
      {label}
      <span className="sr-only"> {fabric.name}</span>
      <IconArrowRight width={14} height={14} aria-hidden />
    </button>
  );
}

export function OrderEntryPanel() {
  const { fabric } = useOrderFlow();

  return (
    <div id="ordering" className="scroll-mt-24">
      <Panel className="p-4">
        <Label>Ordering</Label>
        <h2 className="mt-2 text-h3 font-semibold text-ink">
          Buy {fabric.name}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-3">
          Add quantity, contact and delivery details in one compact order form.
        </p>

        <dl className="mt-4 border-y border-rule py-3">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-xs text-ink-3">Quantity unit</dt>
            <dd className="font-mono text-xs font-medium text-ink">
              {fabric.quantityUnit ?? "Pending"}
            </dd>
          </div>
          {fabric.minimum !== null ? (
            <div className="mt-2 flex items-center justify-between gap-4">
              <dt className="text-xs text-ink-3">Published minimum</dt>
              <dd className="font-mono text-xs font-medium text-ink">
                {fabric.minimum.toLocaleString("en")} {fabric.quantityUnit}
              </dd>
            </div>
          ) : null}
        </dl>

        <BuyButton className="mt-4 w-full" />
        <p className="mt-3 text-xs leading-relaxed text-ink-3">
          No payment is taken. If a commercial unit is not published, FabStitch
          leaves it pending rather than assuming metres or kilograms.
        </p>
      </Panel>
    </div>
  );
}
