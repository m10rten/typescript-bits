import type { MetadataRoute } from "next";

const SITE_URL = process.env.SITE_URL ?? "https://typescript-bits.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/_next/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
