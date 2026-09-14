"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/features/auth/session";
import type { AuthProvider } from "./providers";

type OpenOptions = {
  intent?: string;
  mode?: "signin" | "signup";
  returnTo?: string;
};

type AuthModalValue = {
  authenticated: boolean;
  open: (options?: OpenOptions) => void;
  close: () => void;
};

const AuthModalContext = createContext<AuthModalValue | null>(null);

export function useAuthModal(): AuthModalValue {
  const value = useOptionalAuthModal();
  if (!value)
    throw new Error("useAuthModal must be used inside AuthModalProvider");
  return value;
}

export function useOptionalAuthModal(): AuthModalValue | null {
  return useContext(AuthModalContext);
}

/** Sends gated actions through the cookie-session authentication pages. */
export function AuthModalProvider({
  children,
  providers: _providers,
  authenticated = false,
}: {
  children: ReactNode;
  providers: AuthProvider[];
  authenticated?: boolean;
}) {
  const router = useRouter();
  const session = useSession();
  const isAuthenticated = authenticated || session.authenticated;

  const open = useCallback(
    (options: OpenOptions = {}) => {
      const returnTo = options.returnTo ?? "/";
      if (isAuthenticated) {
        router.push(returnTo);
        return;
      }
      const path = options.mode === "signup" ? "/signup/" : "/login/";
      router.push(
        returnTo === "/"
          ? path
          : `${path}?next=${encodeURIComponent(returnTo)}`,
      );
    },
    [isAuthenticated, router],
  );
  const close = useCallback(() => {}, []);
  const value = useMemo(
    () => ({ authenticated: isAuthenticated, open, close }),
    [close, isAuthenticated, open],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
}
