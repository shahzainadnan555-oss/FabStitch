import assert from "node:assert/strict";
import { api } from "@/lib/api/client";
import { ApiError, normalizeApiError } from "@/lib/api/errors";
import { queryString } from "@/lib/api/query";
import {
  googleAuthErrorMessage,
  loginErrorView,
  signupErrorMessage,
} from "@/features/auth/messages";

assert.equal(
  queryString({
    fiber: ["cotton", "linen"],
    q: "silk satin",
    limit: 24,
    ignored: undefined,
  }),
  "?fiber=cotton&fiber=linen&q=silk+satin&limit=24",
);

const normalized = normalizeApiError(422, {
  error: {
    code: "validation_error",
    message: "Request validation failed",
    details: [{ loc: ["body", "quantity"], msg: "Required" }],
    request_id: "request-test",
  },
});
assert(normalized instanceof ApiError);
assert.equal(normalized.code, "validation_error");
assert.equal(normalized.requestId, "request-test");
assert.equal(normalized.details.length, 1);

const originalFetch = globalThis.fetch;
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
let refreshCalls = 0;
let resourceCalls = 0;
let refreshed = false;

Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: { dispatchEvent: () => true },
});
globalThis.fetch = (async (input: string | URL | Request) => {
  const url = String(input);
  if (url.endsWith("/auth/session/refresh")) {
    refreshCalls += 1;
    await new Promise((resolve) => setTimeout(resolve, 10));
    refreshed = true;
    return Response.json({ authenticated: true });
  }
  resourceCalls += 1;
  if (!refreshed) {
    return Response.json(
      {
        error: {
          code: "unauthorized",
          message: "Session expired",
          details: [],
          request_id: `unauthorized-${resourceCalls}`,
        },
      },
      { status: 401 },
    );
  }
  return Response.json({ ok: true });
}) as typeof fetch;

try {
  const [first, second] = await Promise.all([
    api.get<{ ok: boolean }>("/test/private"),
    api.get<{ ok: boolean }>("/test/private"),
  ]);
  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(refreshCalls, 1);
  assert.equal(resourceCalls, 4);
} finally {
  globalThis.fetch = originalFetch;
  if (originalWindow) {
    Object.defineProperty(globalThis, "window", originalWindow);
  } else {
    Reflect.deleteProperty(globalThis, "window");
  }
}

const missing = loginErrorView(
  new ApiError({
    status: 401,
    code: "account_not_found",
    message: "No customer for this email",
  }),
  "/fabrics/cotton-poplin/",
);
assert.equal(missing.message, "This account doesn't exist.");
assert.equal(missing.missingAccount, true);
assert.equal(missing.signupHref, "/signup/?next=%2Ffabrics%2Fcotton-poplin%2F");

const unknownPassword = loginErrorView(
  new ApiError({
    status: 401,
    code: "invalid_credentials",
    message: "Invalid email or password",
  }),
  "/",
);
assert.equal(unknownPassword.message, "Invalid email or password");
assert.equal(unknownPassword.missingAccount, false);

const duplicate = signupErrorMessage(
  new ApiError({
    status: 409,
    code: "email_taken",
    message: "Email already registered",
  }),
);
assert.equal(
  duplicate,
  "An account with this email already exists. Sign in to continue.",
);
assert.equal(
  googleAuthErrorMessage("access_denied"),
  "Google sign-in was cancelled. You can try again or continue with email.",
);
assert.equal(
  googleAuthErrorMessage("oauth_failed"),
  "Google sign-in couldn't be completed. Please try again.",
);

console.log("API client QA passed.");
