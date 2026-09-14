"use client";

import Link from "next/link";
import { useOptionalAuthModal } from "./auth-modal";
import type { AuthIntent } from "./intents";

/**
 * An action that needs an account.
 *
 * One component for every gated control in the marketplace, so the decision
 * "does this need an account, and what does the modal say" lives with the
 * action instead of being re-implemented per page.
 *
 * It renders a real `<a href>`. Middle-click, "open in new tab" and a
 * JavaScript failure all reach the destination, where the server-side guard
 * takes over and redirects to `/login` - the modal is the enhancement, not the
 * only path. A plain click is intercepted so the buyer keeps their place.
 */
export function GatedAction({
  href,
  intent,
  children,
  className,
  authenticated = false,
}: {
  /** Where the action goes once there is a session. */
  href: string;
  intent: AuthIntent;
  children: React.ReactNode;
  className?: string;
  /**
   * Set when the server already knows a session exists, so the click passes
   * straight through instead of opening a modal the buyer does not need.
   */
  authenticated?: boolean;
}) {
  const modal = useOptionalAuthModal();

  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        // No provider in this shell, or already signed in: let the link work.
        if (authenticated || modal?.authenticated || !modal) return;
        // Leave the browser's own affordances alone.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        event.preventDefault();
        modal.open({ intent, returnTo: href });
      }}
    >
      {children}
    </Link>
  );
}
