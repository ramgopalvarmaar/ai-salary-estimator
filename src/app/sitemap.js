import { landingPages } from "@/lib/landingPages";
import { siteConfig } from "@/lib/site";

export default function sitemap() {
  const pages = Object.values(landingPages).map((page) => ({
    url: `${siteConfig.url}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.path === "/" ? "weekly" : "monthly",
    priority: page.path === "/" ? 1 : 0.8,
  }));

  return [
    ...pages,
    {
      url: `${siteConfig.url}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
