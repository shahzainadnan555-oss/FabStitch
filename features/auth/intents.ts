/**
 * Why the authentication modal opened.
 *
 * The modal states the specific reason rather than a generic "please sign in".
 * A buyer half-way through a sample request should see the request named back
 * to them, which is both clearer and a reminder that the action survives.
 *
 * Intents are data, not copy scattered across pages: a component asks for
 * `request_sample` and the wording, the heading and the submit label all follow.
 */

export type AuthIntent = "save_fabric" | "generic";

type IntentCopy = {
  /** Heading on the sign-in state. */
  signIn: string;
  /** Heading on the join state. */
  signUp: string;
  /** What happens after, shown once under the heading. */
  after: string;
};

const COPY: Record<AuthIntent, IntentCopy> = {
  save_fabric: {
    signIn: "Sign in to save this fabric",
    signUp: "Create an account to save this fabric",
    after: "Saved fabrics stay with your account across devices.",
  },
  generic: {
    signIn: "Welcome to FabStitch",
    signUp: "Create your FabStitch account",
    after: "Sign in or create your account to continue.",
  },
};

export function intentCopy(intent: AuthIntent): IntentCopy {
  return COPY[intent] ?? COPY.generic;
}
