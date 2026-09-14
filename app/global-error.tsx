"use client";

import { useEffect } from "react";

/**
 * The last error boundary.
 *
 * `error.tsx` in a route group catches failures in that group's *children*.
 * It does not catch a failure in the layout beside it - and the workspace
 * guards run in exactly those layouts, so a backend outage while a buyer had a
 * session produced Next's own grey "This page couldn't load" screen instead of
 * anything belonging to this product.
 *
 * This replaces it: same recovery, in FabStitch's voice, with the reference
 * needed to find the failure in the logs. It renders its own `<html>` because
 * a root-layout failure means the normal one never ran.
 *
 * What it deliberately does not do is sign anyone out. An unreachable API is
 * not an expired session, and clearing cookies here would turn a thirty-second
 * outage into every user having to log in again.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route-render]", {
      route: window.location.pathname,
      operation: "root-render",
      status: 500,
      errorType: error.name,
      digest: error.digest,
    });
  }, [error.digest, error.name]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          background: "#fbfaf8",
          color: "#14161a",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        }}
      >
        <main style={{ maxWidth: "34rem" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#a32a1e",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            Connection problem
          </p>
          <h1
            style={{
              margin: "0.75rem 0 0",
              fontSize: "1.75rem",
              lineHeight: 1.2,
              fontWeight: 600,
            }}
          >
            We&rsquo;re having trouble connecting right now
          </h1>
          <p
            style={{
              margin: "0.75rem 0 0",
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "#3b4048",
            }}
          >
            This is on our side, not yours. You are still signed in, and nothing
            you were working on has been lost.
          </p>

          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                height: "2.75rem",
                padding: "0 1.25rem",
                borderRadius: "0.25rem",
                border: "1px solid #1e3563",
                background: "#1e3563",
                color: "#fff",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
                a global error means the router may itself be the thing that
                failed, so this has to be a full document load. */}
            <a
              href="/"
              style={{
                height: "2.75rem",
                padding: "0 1.25rem",
                borderRadius: "0.25rem",
                border: "1px solid #87847e",
                background: "#fff",
                color: "#14161a",
                fontSize: "0.9375rem",
                fontWeight: 500,
                lineHeight: "2.75rem",
                textDecoration: "none",
              }}
            >
              Back to the marketplace
            </a>
          </div>

          {error.digest ? (
            <p
              style={{
                marginTop: "1.5rem",
                fontSize: "0.75rem",
                color: "#9a9ca3",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              Reference {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
