import type { NextConfig } from "next";

/**
 * Next.js 15 Configuration - METAMEN100
 * Security headers aligned with Security Spec v2.0.0 section 13.1.
 *
 * Turbopack is enabled by default in Next.js 15 for `next dev`.
 * No additional configuration required.
 *
 * Performance budget: 200KB initial JS load (verify with `next build`).
 */
const isProduction = process.env.NODE_ENV === "production";

const scriptSrc = isProduction
  ? "script-src 'self' 'unsafe-inline' https://js.stripe.com"
  : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com";

const ContentSecurityPolicy = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.supabase.co blob:",
  "font-src 'self'",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://generativelanguage.googleapis.com https://*.inngest.com https://*.upstash.io",
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy,
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), payment=(self)",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
