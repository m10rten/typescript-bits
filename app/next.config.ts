import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";
// Disable HTTPS-specific headers with HTTPS=false (e.g. when accessing over HTTP by IP)
const hasHttps = process.env.HTTPS !== "false";

const cspBase =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    // Strict CSP tailored for static sites. Adjust your connect-src/img-src if using external APIs/CDNs.
    // upgrade-insecure-requests is production-only: in dev over HTTP it causes protocol-mismatch errors
    // when browsers (React DevTools, etc.) inject frames.
    value: `${cspBase}${isProduction && hasHttps ? "; upgrade-insecure-requests" : ""}`,
  },
  {
    key: "X-Frame-Options",
    value: "DENY", // Prevents Clickjacking
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff", // Prevents MIME-type sniffing vulnerabilities
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin", // Protects user privacy when navigating away
  },
  {
    key: "Permissions-Policy",
    // Disables access to sensitive browser features your static site likely doesn't need
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  ...(isProduction && hasHttps
    ? [
        {
          // Forces HTTPS connections
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: "/docs",
        destination: "/docs/introduction",
        permanent: true,
      },
      {
        source: "/docs/",
        destination: "/docs/introduction",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
