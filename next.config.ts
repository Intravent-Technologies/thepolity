import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
  // Tailwind and framer-motion both rely on inline style attributes.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isProduction ? ["upgrade-insecure-requests"] : []),
].join('; ');

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  // Stops legacy plugins (Flash, Acrobat) reading the site cross-domain.
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  {
    key: "Permissions-Policy",
    // `interest-cohort` was an FLoC-era directive browsers have dropped, so it
    // only added noise. Every feature actually requested here is denied.
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  ...(isProduction
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Admin-uploaded media can point at any https host (see requireAssetUrl in
    // src/lib/content-schema.ts), so the optimizer cannot be given a precise
    // remotePatterns allowlist without either breaking stored URLs or opening
    // the proxy up to arbitrary hosts. Unoptimized still gives us lazy loading,
    // explicit sizing to avoid layout shift, and async decoding.
    unoptimized: true,
  },
  async redirects() {
    // Portfolio, gallery and work were three overlapping ways to show the same
    // thing; they are now one page at /work. Permanent redirects keep any
    // shared or indexed URLs alive.
    return [
      { source: "/portfolio", destination: "/work", permanent: true },
      { source: "/gallery", destination: "/work", permanent: true },
    ];
  },
  turbopack: {
    ignoreIssue: [
      {
        path: "**/next.config.ts",
        // Not a real problem for this app. src/lib/storage.ts reads .data/*.json
        // and public/uploads/ at runtime when Supabase is not configured, so
        // file tracing legitimately has to reach both trees. Scoping every path
        // to process.cwd() does not silence it, and neither does
        // turbopackIgnore on the individual fs calls.
        description: /whole project was traced/,
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
