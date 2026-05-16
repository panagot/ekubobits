import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ekubobits.vercel.app";
  const paths = ["", "/extensions", "/register", "/api-docs", "/about", "/faq"];
  return paths.map((path) => ({
    url: `${base}${path}` || base,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
