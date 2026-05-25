import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    // Strict CSP tailored for static sites. Adjust your connect-src/img-src if using external APIs/CDNs.
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;",
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
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload", // Forces HTTPS connections
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  poweredByHeader: false,
  // Apply the security headers to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
