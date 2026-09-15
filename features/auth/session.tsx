"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { api } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/api/config";
import { ApiError, apiErrorMessage, normalizeApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/schema";
import { clearOauthPending, shouldRetrySessionRestore } from "./oauth-return";

type Schema = components["schemas"];
type MeResponse = Schema["MeResponse"];
type UserPublic = Schema["UserPublic"];
type CustomerPreferencesOut = Schema["CustomerPreferencesOut"];
type OnboardingStateResponse = Schema["OnboardingStateResponse"];
type LogoutResponse = Schema["LogoutResponse"];

type SessionState = {
  status: "loading" | "authenticated" | "anonymous" | "error";
  user: UserPublic | null;
  profile: UserPublic | null;
  preferences: CustomerPreferencesOut | null;
  onboarding: OnboardingStateResponse | null;
  error: string | null;
};

type SessionRefreshOptions = {
  persistOnUnauthorized?: boolean;
  retries?: number;
};

type SessionContextValue = SessionState & {
  hydrated: boolean;
  authenticated: boolean;
  refresh: (options?: SessionRefreshOptions) => Promise<void>;
  adoptUser: (user: UserPublic) => void;
  setProfile: (profile: UserPublic) => void;
  setPreferences: (preferences: CustomerPreferencesOut) => void;
  setOnboarding: (onboarding: OnboardingStateResponse) => void;
  signOut: () => Promise<void>;
};

const INITIAL_STATE: SessionState = {
  status: "loading",
  user: null,
  profile: null,
  preferences: null,
  onboarding: null,
  error: null,
};

const ANONYMOUS_STATE: SessionState = {
  ...INITIAL_STATE,
  status: "anonymous",
};

const SessionContext = createContext<SessionContextValue | null>(null);

function preferencesFromUser(user: UserPublic): CustomerPreferencesOut {
  return {
    country: user.country,
    currency: user.currency,
    onboarding_completed: user.onboarding_completed,
    onboarding_completed_at: user.onboarding_completed_at,
    email: user.email,
    full_name: user.full_name,
    phone: user.phone,
  };
}

function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseMe(response: Response): Promise<MeResponse> {
  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await response.json().catch(() => undefined)
    : undefined;
  if (!response.ok) {
    throw normalizeApiError(
      response.status,
      body,
      response.headers.get("x-request-id"),
    );
  }
  return body as MeResponse;
}

async function readDirectMe(): Promise<MeResponse | null> {
  if (typeof window === "undefined") return null;
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    return await parseMe(response);
  } catch {
    return null;
  }
}

async function readMe(): Promise<MeResponse> {
  let session: MeResponse | null = null;
  try {
    session = await api.get<MeResponse>("/auth/me", {
      cache: "no-store",
      retryAuth: false,
    });
  } catch (error) {
    if (!isUnauthorized(error)) {
      const direct = await readDirectMe();
      if (direct) return direct;
    }
    throw error;
  }
  if (session.authenticated && session.user) return session;
  const direct = await readDirectMe();
  if (direct?.authenticated && direct.user) return direct;
  return session;
}

async function loadOptional<T>(path: string): Promise<T | null> {
  try {
    return await api.get<T>(path, { cache: "no-store" });
  } catch (error) {
    if (isUnauthorized(error)) throw error;
    return null;
  }
}

async function loadSession(): Promise<SessionState> {
  let session: MeResponse;
  try {
    session = await readMe();
  } catch (error) {
    if (isUnauthorized(error)) return ANONYMOUS_STATE;
    throw error;
  }
  if (!session.authenticated || !session.user) return ANONYMOUS_STATE;

  const user = session.user;
  const profile = (await loadOptional<UserPublic>("/account/profile")) ?? user;

  if (user.role === "admin") {
    return {
      status: "authenticated",
      user,
      profile,
      preferences: null,
      onboarding: null,
      error: null,
    };
  }

  const [preferences, onboarding] = await Promise.all([
    loadOptional<CustomerPreferencesOut>("/me/preferences"),
    loadOptional<OnboardingStateResponse>("/account/onboarding"),
  ]);

  return {
    status: "authenticated",
    user,
    profile,
    preferences: preferences ?? preferencesFromUser(profile),
    onboarding,
    error: null,
  };
}

async function loadSessionWithRetries(retries: number): Promise<SessionState> {
  let last = await loadSession();
  for (let attempt = 0; attempt < retries && last.status === "anonymous";) {
    attempt += 1;
    await delay(250 * attempt);
    last = await loadSession();
  }
  return last;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>(INITIAL_STATE);
  const generation = useRef(0);

  const refresh = useCallback(async (options?: SessionRefreshOptions) => {
    const token = ++generation.current;
    try {
      const next = await loadSessionWithRetries(options?.retries ?? 0);
      if (token !== generation.current) return;
      if (options?.persistOnUnauthorized && next.status === "anonymous") {
        return;
      }
      clearOauthPending();
      setState(next);
    } catch (error) {
      if (token !== generation.current) return;
      if (isUnauthorized(error)) {
        if (!options?.persistOnUnauthorized) {
          setState(ANONYMOUS_STATE);
        }
        return;
      }
      setState((current) => {
        if (current.user) {
          return {
            ...current,
            status: "authenticated",
            error: apiErrorMessage(
              error,
              "FabStitch could not load your account. Try again.",
            ),
          };
        }
        if ((options?.retries ?? 0) > 0) {
          return {
            ...ANONYMOUS_STATE,
            status: "error",
            error: apiErrorMessage(
              error,
              "FabStitch could not load your account. Try again.",
            ),
          };
        }
        return ANONYMOUS_STATE;
      });
      throw error;
    }
  }, []);

  useEffect(() => {
    const retries = shouldRetrySessionRestore() ? 4 : 0;
    void refresh({ retries }).catch(() => {});
  }, [refresh]);

  useEffect(() => {
    const expired = () => {
      generation.current += 1;
      clearOauthPending();
      setState(ANONYMOUS_STATE);
    };
    const restore = () => {
      if (document.visibilityState !== "visible") return;
      if (!shouldRetrySessionRestore()) return;
      void refresh({ retries: 3, persistOnUnauthorized: true }).catch(() => {});
    };
    window.addEventListener("fabstitch:session-expired", expired);
    window.addEventListener("pageshow", restore);
    document.addEventListener("visibilitychange", restore);
    return () => {
      window.removeEventListener("fabstitch:session-expired", expired);
      window.removeEventListener("pageshow", restore);
      document.removeEventListener("visibilitychange", restore);
    };
  }, [refresh]);

  const adoptUser = useCallback((user: UserPublic) => {
    generation.current += 1;
    clearOauthPending();
    setState({
      status: "authenticated",
      user,
      profile: user,
      preferences: preferencesFromUser(user),
      onboarding: null,
      error: null,
    });
  }, []);

  const setProfile = useCallback((profile: UserPublic) => {
    setState((current) => ({
      ...current,
      status: "authenticated",
      user: profile,
      profile,
      preferences: current.preferences ?? preferencesFromUser(profile),
      error: null,
    }));
  }, []);

  const setPreferences = useCallback((preferences: CustomerPreferencesOut) => {
    setState((current) => ({
      ...current,
      preferences,
      error: null,
    }));
  }, []);

  const setOnboarding = useCallback((onboarding: OnboardingStateResponse) => {
    setState((current) => ({
      ...current,
      onboarding,
      user: current.user
        ? {
            ...current.user,
            onboarding_completed: onboarding.onboarding_completed,
            onboarding_completed_at: onboarding.onboarding_completed_at,
          }
        : null,
      profile: current.profile
        ? {
            ...current.profile,
            onboarding_completed: onboarding.onboarding_completed,
            onboarding_completed_at: onboarding.onboarding_completed_at,
          }
        : null,
      preferences: current.preferences
        ? {
            ...current.preferences,
            onboarding_completed: onboarding.onboarding_completed,
            onboarding_completed_at: onboarding.onboarding_completed_at,
          }
        : null,
      error: null,
    }));
  }, []);

  const signOut = useCallback(async () => {
    generation.current += 1;
    clearOauthPending();
    try {
      await api.post<LogoutResponse>("/auth/logout", {
        retryAuth: false,
      });
    } catch {
      // HttpOnly cookies are cleared by the backend when logout succeeds.
      // Always drop local auth state so the header returns to Sign In.
    } finally {
      setState(ANONYMOUS_STATE);
    }
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      ...state,
      hydrated: state.status !== "loading" && state.status !== "error",
      authenticated: state.status === "authenticated" && Boolean(state.user),
      refresh,
      adoptUser,
      setProfile,
      setPreferences,
      setOnboarding,
      signOut,
    }),
    [
      adoptUser,
      refresh,
      setOnboarding,
      setPreferences,
      setProfile,
      signOut,
      state,
    ],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error("useSession must be used inside SessionProvider");
  }
  return value;
}
