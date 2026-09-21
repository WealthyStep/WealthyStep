import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { SITE_CONFIG, ROUTES_SEO, getCanonicalUrl } from "@/lib/seo";
import { blogs } from "@/lib/data/blogs";
import { mockArticles } from "@/lib/mock-cms";

/**
 * Disallowed route segments from public XML indexing
 */
const EXCLUDED_PATHS = new Set([
  "api",
  "admin",
  "_not-found",
  "not-found",
  "loading",
  "error",
]);

/**
 * Automated filesystem route scanner that traverses the app/ folder
 * and dynamically discovers all static page.tsx routes.
 */
function getPageRoutes(subDir: string = "", baseRoute: string = ""): string[] {
  const routes: string[] = [];
  const appRoot = path.join(process.cwd(), "app");
  const targetDir = subDir ? path.join(appRoot, subDir) : appRoot;

  try {
    if (!fs.existsSync(targetDir)) {
      return routes;
    }

    const entries = fs.readdirSync(/*turbopackIgnore: true*/ targetDir, { withFileTypes: true });

    for (const entry of entries) {
      // Skip API, admin, private, and internal Next.js special files
      if (EXCLUDED_PATHS.has(entry.name) || entry.name.startsWith(".")) {
        continue;
      }

      const relativeSubDir = subDir ? path.join(subDir, entry.name) : entry.name;

      if (entry.isDirectory()) {
        // Dynamic route folders like [slug] are handled via their data providers
        if (entry.name.startsWith("[") && entry.name.endsWith("]")) {
          continue;
        }

        // Handle route groups like (marketing) without altering URL path
        const routeSegment = entry.name.startsWith("(") && entry.name.endsWith(")")
          ? ""
          : entry.name;

        const newBaseRoute = routeSegment
          ? `${baseRoute}/${routeSegment}`
          : baseRoute;

        routes.push(...getPageRoutes(relativeSubDir, newBaseRoute));
      } else if (
        entry.isFile() &&
        (entry.name === "page.tsx" ||
          entry.name === "page.ts" ||
          entry.name === "page.js" ||
          entry.name === "page.jsx")
      ) {
        const normalizedRoute = baseRoute || "/";
        routes.push(normalizedRoute);
      }
    }
  } catch {
    // Fallback gracefully to empty array if filesystem access is restricted
  }

  return Array.from(new Set(routes));
}

/**
 * Dynamic Next.js MetadataRoute.Sitemap Generator
 * Guarantees zero localhost URLs, full trailing slash normalization, and automated route discovery.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const discoveredRoutes = getPageRoutes("app");

  // Map discovered static routes and merge with ROUTES_SEO registry metadata
  const staticSitemapEntries: MetadataRoute.Sitemap = discoveredRoutes
    .filter((routePath) => {
      // Check if any route key matches noIndex in ROUTES_SEO
      const matchedSeo = Object.values(ROUTES_SEO).find(
        (seo) => seo.path === routePath || seo.path === `${routePath}/`
      );
      return !matchedSeo?.noIndex;
    })
    .map((routePath) => {
      const matchedSeo = Object.values(ROUTES_SEO).find(
        (seo) => seo.path === routePath || seo.path === `${routePath}/`
      );

      return {
        url: getCanonicalUrl(routePath),
        lastModified: new Date(),
        changeFrequency: matchedSeo?.changeFrequency || "monthly",
        priority: matchedSeo?.priority || (routePath === "/" ? 1.0 : 0.7),
      };
    });

  // Dynamic Blog Posts
  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: getCanonicalUrl(`/blogs/${blog.slug}`),
    lastModified: new Date((blog as any).updatedAt || blog.date || new Date()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic Knowledge Center Articles
  const knowledgeRoutes: MetadataRoute.Sitemap = mockArticles.map((article) => ({
    url: getCanonicalUrl(`/knowledge/${article.slug}`),
    lastModified: new Date(article.updatedAt || article.date || new Date()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Combine and deduplicate by canonical URL
  const allEntries = [...staticSitemapEntries, ...blogRoutes, ...knowledgeRoutes];
  const seenUrls = new Set<string>();
  const uniqueEntries: MetadataRoute.Sitemap = [];

  for (const entry of allEntries) {
    if (!seenUrls.has(entry.url)) {
      seenUrls.add(entry.url);
      uniqueEntries.push(entry);
    }
  }

  return uniqueEntries;
}
