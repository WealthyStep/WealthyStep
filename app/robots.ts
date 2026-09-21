import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo";

/**
 * Dynamic Next.js MetadataRoute.Robots Generator
 * Points crawler to production sitemap.xml and enforces security disallow rules.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = SITE_CONFIG.siteUrl;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/private/",
        "/wp-admin/",
        "/wp-includes/",
        "/wp-json/",
        "/wp-content/",
        "/category/",
        "/tag/",
        "/author/",
        "/feed/",
        "/trackback/",
        "/xmlrpc.php",
        "/*.php$",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
