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
import { ApiError, normalizeApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/schema";
import { clearOauthPending } from "./oauth-return";

type Schema = components["schemas"];
type MeResponse = Schema["MeResponse"];
type UserPublic = Schema["UserPublic"];
type CustomerPreferencesOut = Schema["CustomerPreferencesOut"];
type OnboardingStateResponse = Schema["OnboardingStateResponse"];
type LogoutResponse = Schema["LogoutResponse"];

type SessionState = {
  status: "loading" | "authenticated" | "anonymous";
  user: UserPublic | null;
  profile: UserPublic | null;
  preferences: CustomerPreferencesOut | null;
  onboarding: OnboardingStateResponse | null;
  error: string | null;
};

type SessionRefreshOptions = {
  persistOnUnauthorized?: boolean;
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

const AUTH_ME_TIMEOUT_MS = 5000;
const DIRECT_ME_TIMEOUT_MS = 3000;
const EXTRA_TIMEOUT_MS = 4000;

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

function isTimeout(error: unknown): boolean {
  return error instanceof ApiError && error.code === "timeout";
}

function timeoutError(): ApiError {
  return new ApiError({
    status: 408,
    code: "timeout",
    message: "Authentication check timed out.",
  });
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(timeoutError()), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
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

async function readDirectMe(): Promise<MeResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: "include",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  return parseMe(response);
}

async function refreshBackendSession(): Promise<void> {
  await api.post("/auth/session/refresh", { retryAuth: false });
}

async function readMe(): Promise<MeResponse> {
  try {
    return await withTimeout(
      api.get<MeResponse>("/auth/me", {
        cache: "no-store",
        retryAuth: false,
      }),
      AUTH_ME_TIMEOUT_MS,
    );
  } catch (error) {
    if (isUnauthorized(error)) {
      try {
        await withTimeout(refreshBackendSession(), AUTH_ME_TIMEOUT_MS);
        return await withTimeout(
          api.get<MeResponse>("/auth/me", {
            cache: "no-store",
            retryAuth: false,
          }),
          AUTH_ME_TIMEOUT_MS,
        );
      } catch (refreshError) {
        if (isUnauthorized(refreshError) || isTimeout(refreshError)) {
          throw refreshError;
        }
      }
    }
    try {
      return await withTimeout(readDirectMe(), DIRECT_ME_TIMEOUT_MS);
    } catch {
      throw error;
    }
  }
}

function sessionFromUser(user: UserPublic): SessionState {
  return {
    status: "authenticated",
    user,
    profile: user,
    preferences: preferencesFromUser(user),
    onboarding: null,
    error: null,
  };
}

async function loadOptional<T>(path: string): Promise<T | null> {
  try {
    return await withTimeout(
      api.get<T>(path, { cache: "no-store", retryAuth: false }),
      EXTRA_TIMEOUT_MS,
    );
  } catch {
    return null;
  }
}

async function loadSession(): Promise<SessionState> {
  try {
    const session = await readMe();
    if (!session.authenticated || !session.user) return ANONYMOUS_STATE;
    return sessionFromUser(session.user);
  } catch (error) {
    if (isUnauthorized(error)) return ANONYMOUS_STATE;
    // Network / timeout / 5xx: do not invent an anonymous logout.
    throw error;
  }
}

async function loadAccountExtras(
  user: UserPublic,
): Promise<Partial<SessionState>> {
  const profile = (await loadOptional<UserPublic>("/account/profile")) ?? user;
  if (user.role === "admin") {
    return { profile, preferences: null, onboarding: null };
  }
  const [preferences, onboarding] = await Promise.all([
    loadOptional<CustomerPreferencesOut>("/me/preferences"),
    loadOptional<OnboardingStateResponse>("/account/onboarding"),
  ]);
  return {
    profile,
    preferences: preferences ?? preferencesFromUser(profile),
    onboarding,
  };
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>(INITIAL_STATE);
  const generation = useRef(0);
  const flight = useRef<Promise<void> | null>(null);
  const networkRetries = useRef(0);
  const refreshRef = useRef<(options?: SessionRefreshOptions) => Promise<void>>(
    async () => {},
  );

  const refresh = useCallback(async (options?: SessionRefreshOptions) => {
    if (flight.current) {
      await flight.current;
      return;
    }

    const token = ++generation.current;
    const run = (async () => {
      try {
        const next = await loadSession();
        if (token !== generation.current) return;
        if (options?.persistOnUnauthorized && next.status === "anonymous") {
          return;
        }
        networkRetries.current = 0;
        clearOauthPending();
        setState(next);
        if (next.status === "authenticated" && next.user) {
          const extras = await loadAccountExtras(next.user);
          if (token !== generation.current) return;
          setState((current) =>
            current.status === "authenticated"
              ? { ...current, ...extras, error: null }
              : current,
          );
        }
      } catch (error) {
        if (token !== generation.current) return;
        if (isUnauthorized(error)) {
          networkRetries.current = 0;
          clearOauthPending();
          setState(ANONYMOUS_STATE);
          return;
        }
        setState((current) => {
          if (current.user) {
            return {
              ...current,
              status: "authenticated",
              error:
                "We're having trouble connecting right now. Please try again.",
            };
          }
          return {
            ...INITIAL_STATE,
            status: "loading",
            error:
              "We're having trouble connecting right now. Please try again.",
          };
        });
        if (networkRetries.current < 2) {
          networkRetries.current += 1;
          window.setTimeout(() => {
            void refreshRef.current().catch(() => {});
          }, 2000 * networkRetries.current);
        } else {
          // Exhausted retries without a known user — stop blocking the shell.
          setState({
            ...ANONYMOUS_STATE,
            error:
              "We're having trouble connecting right now. Please try again.",
          });
        }
      }
    })();

    flight.current = run;
    try {
      await run;
    } finally {
      if (flight.current === run) flight.current = null;
    }
  }, []);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    void refresh().catch(() => {});
  }, [refresh]);

  useEffect(() => {
    const expired = () => {
      generation.current += 1;
      flight.current = null;
      clearOauthPending();
      setState(ANONYMOUS_STATE);
    };
    window.addEventListener("fabstitch:session-expired", expired);
    return () =>
      window.removeEventListener("fabstitch:session-expired", expired);
  }, []);

  const adoptUser = useCallback((user: UserPublic) => {
    generation.current += 1;
    flight.current = null;
    clearOauthPending();
    setState(sessionFromUser(user));
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
    flight.current = null;
    clearOauthPending();
    try {
      await api.post<LogoutResponse>("/auth/logout", {
        retryAuth: false,
      });
    } catch {
      // HttpOnly cookies are cleared by the backend when logout succeeds.
    } finally {
      setState(ANONYMOUS_STATE);
    }
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      ...state,
      hydrated: state.status !== "loading",
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
