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
import { ApiError, apiErrorMessage } from "@/lib/api/errors";
import type { components } from "@/lib/api/schema";

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

type SessionContextValue = SessionState & {
  hydrated: boolean;
  authenticated: boolean;
  refresh: () => Promise<void>;
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
    session = await api.get<MeResponse>("/auth/me", {
      cache: "no-store",
      retryAuth: false,
    });
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

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>(INITIAL_STATE);
  const generation = useRef(0);

  const refresh = useCallback(async () => {
    const token = ++generation.current;
    try {
      const next = await loadSession();
      if (token !== generation.current) return;
      setState(next);
    } catch (error) {
      if (token !== generation.current) return;
      if (isUnauthorized(error)) {
        setState(ANONYMOUS_STATE);
        return;
      }
      setState((current) => ({
        ...current,
        status: current.user ? "authenticated" : "error",
        error: apiErrorMessage(
          error,
          "FabStitch could not load your account. Try again.",
        ),
      }));
      throw error;
    }
  }, []);

  useEffect(() => {
    void refresh().catch(() => {});
  }, [refresh]);

  useEffect(() => {
    const expired = () => {
      generation.current += 1;
      setState(ANONYMOUS_STATE);
    };
    window.addEventListener("fabstitch:session-expired", expired);
    return () =>
      window.removeEventListener("fabstitch:session-expired", expired);
  }, []);

  const adoptUser = useCallback((user: UserPublic) => {
    generation.current += 1;
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
