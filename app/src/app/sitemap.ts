import type { MetadataRoute } from "next";
import { getAllModules, getAllSkills } from "../../scripts/source-files";

const SITE_URL = process.env.SITE_URL ?? "https://ts.mvdlei.nl";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
  { url: `${SITE_URL}/docs/introduction`, changeFrequency: "monthly", priority: 0.9 },
  { url: `${SITE_URL}/docs/installation`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/terms-of-service`, changeFrequency: "yearly", priority: 0.3 },
  { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
];

const metadataRoutes: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/sitemap.xml`, changeFrequency: "weekly", priority: 0.1 },
  { url: `${SITE_URL}/robots.txt`, changeFrequency: "monthly", priority: 0.1 },
  { url: `${SITE_URL}/llms.txt`, changeFrequency: "weekly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const modules = getAllModules();
  const skills = getAllSkills();

  const moduleRoutes: MetadataRoute.Sitemap = modules.flatMap((mod) => {
    const routes: MetadataRoute.Sitemap = [
      { url: `${SITE_URL}/docs/${mod.name}`, changeFrequency: "weekly", priority: 0.7 },
    ];

    if (mod.children) {
      for (const child of mod.children) {
        routes.push({
          url: `${SITE_URL}/docs/${mod.name}/${child.name}`,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }

    return routes;
  });

  const skillRoutes: MetadataRoute.Sitemap = skills.map((skill) => ({
    url: `${SITE_URL}/docs/skills/${skill.name}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...moduleRoutes, ...skillRoutes, ...metadataRoutes];
}
