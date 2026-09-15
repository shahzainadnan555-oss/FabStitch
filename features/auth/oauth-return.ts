const OAUTH_PENDING_KEY = "fabstitch:oauth-pending";

export function markOauthPending(): void {
  try {
    sessionStorage.setItem(OAUTH_PENDING_KEY, "1");
  } catch {
    // sessionStorage can be unavailable in private contexts.
  }
}

export function clearOauthPending(): void {
  try {
    sessionStorage.removeItem(OAUTH_PENDING_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export function hasOauthPending(): boolean {
  try {
    return sessionStorage.getItem(OAUTH_PENDING_KEY) === "1";
  } catch {
    return false;
  }
}

export function isOauthReturnPath(pathname = ""): boolean {
  return (
    pathname === "/auth/callback" ||
    pathname.startsWith("/auth/callback/") ||
    pathname === "/oauth/callback" ||
    pathname.startsWith("/oauth/callback/")
  );
}

export function isOauthReturnReferrer(referrer = ""): boolean {
  const value = referrer.toLowerCase();
  return (
    value.includes("accounts.google.com") ||
    value.includes("api.fabstitch.net") ||
    // Transitional OAuth returns may still arrive from the previous API host.
    value.includes("fabstitch-backend.fastapicloud.dev")
  );
}

export function shouldRetrySessionRestore(): boolean {
  if (typeof window === "undefined") return false;
  return (
    hasOauthPending() ||
    isOauthReturnPath(window.location.pathname) ||
    isOauthReturnReferrer(document.referrer)
  );
}
