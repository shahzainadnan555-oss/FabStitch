import type { ReactNode } from "react";
import { AuthPanel } from "./auth-panel";

/** @deprecated Prefer AuthPanel. Kept as a stable import path for auth routes. */
export function AuthShell(props: {
  title: string;
  intro: string;
  counterpart?: { prompt: string; label: string; href: string };
  footer?: ReactNode;
  resuming?: string | null;
  children: ReactNode;
}) {
  return <AuthPanel {...props} />;
}
