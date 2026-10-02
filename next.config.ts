import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  trailingSlash: true,
  experimental: {
    cpus: 2,
    staticGenerationMinPagesPerWorker: 200,
    staticGenerationMaxConcurrency: 2,
    staticGenerationRetryCount: 1,
  },
  staticPageGenerationTimeout: 240,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "object-src 'none'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://fabstitch.net https://www.fabstitch.net https://api.fabstitch.net https://www.google-analytics.com https://www.googletagmanager.com https://fabstitch-backend.fastapicloud.dev",
              "connect-src 'self' https://api.fabstitch.net https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com https://accounts.google.com",
              "frame-src 'self' https://accounts.google.com",
            ].join("; "),
          },
        ],
      },
      {
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.fabstitch.net",
      },
      {
        protocol: "https",
        hostname: "fabstitch.net",
      },
      {
        protocol: "https",
        hostname: "www.fabstitch.net",
      },
      // Migration only: legacy absolute media URLs may still resolve on the
      // previous API host until catalog assets are rewritten to api.fabstitch.net.
      {
        protocol: "https",
        hostname: "fabstitch-backend.fastapicloud.dev",
      },
    ],
  },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
