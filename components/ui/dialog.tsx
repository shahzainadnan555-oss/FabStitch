"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Modal dialog.
 *
 * Built on the native `<dialog>` element rather than a hand-rolled overlay,
 * because `showModal()` gives the hard parts for free and gives them
 * correctly: focus is trapped inside, the rest of the page is inert to
 * assistive tech, Escape closes, and the backdrop is a real pseudo-element
 * rather than a div kept in z-index sync.
 *
 * Done by hand: closing on a backdrop click (the native element reports the
 * backdrop as itself), locking body scroll, and restoring focus.
 */
export function Dialog({
  open,
  onClose,
  label,
  children,
  className,
  /** Set false to keep a backdrop click from dismissing. */
  dismissOnBackdrop = true,
}: {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. */
  label: string;
  children: React.ReactNode;
  className?: string;
  dismissOnBackdrop?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (open && !node.open) {
      // Chrome restores focus to whatever was focused when the dialog opened,
      // but a control activated by pointer is not always the active element.
      // Remembering it explicitly means closing always lands somewhere sensible
      // rather than dropping the caret on `<body>`.
      opener.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

      node.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }

    if (!open && node.open) {
      node.close();
      if (opener.current?.isConnected) opener.current.focus();
      opener.current = null;
    }
  }, [open]);

  const handleCancel = useCallback(
    (event: React.SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault();
      onClose();
    },
    [onClose],
  );

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onCancel={handleCancel}
      onClose={onClose}
      onClick={(event) => {
        if (dismissOnBackdrop && event.target === ref.current) onClose();
      }}
      // `open:flex`, never a bare `flex`. The UA stylesheet hides a closed
      // dialog with `dialog:not([open]) { display: none }`, and any
      // unconditional display utility outranks it - which paints the modal on
      // every page while `dialog.open` still reports false.
      className={cn(
        "m-auto hidden w-full rounded-lg border border-rule-2 bg-paper-raised p-0 open:flex",
        "backdrop:bg-ink-surface/60 max-h-[100dvh] overflow-hidden sm:max-h-[92dvh]",
        className,
      )}
    >
      {children}
    </dialog>
  );
}
