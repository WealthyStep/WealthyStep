import React from "react";
import { SITE_CONFIG, getCanonicalUrl } from "@/lib/seo";

/**
 * XSS-Safe JSON-LD Script Injection Component
 * Escapes `<` to unicode `\u003c` to safely prevent HTML script breakout attacks.
 */
export function JsonLd({ data }: { data: Record<string, any> | Record<string, any>[] }) {
  const jsonString = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}

/**
 * Generates Schema.org Organization & FinancialService Schema
 */
export function getOrganizationSchema() {
  const siteUrl = SITE_CONFIG.siteUrl;

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "FinancialService", "Corporation"],
    "@id": `${siteUrl}/#organization`,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    alternateName: "WealthyStep",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo.png`,
      caption: "Wealthy Step Logo",
    },
    image: `${siteUrl}/logo.png`,
    description: SITE_CONFIG.defaultDescription,
    slogan: "Every journey begins with a step. Every step deserves trust.",
    knowsAbout: [
      "Mutual Fund Investments",
      "Systematic Investment Plans (SIP)",
      "Life & Health Insurance",
      "NRI Investment Coordination",
      "Goal-based Financial Planning",
    ],
    identifier: [
      {
        "@type": "PropertyValue",
        name: "AMFI Registration Number",
        value: SITE_CONFIG.arn,
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Pranava Business Park, 7th Floor, Kothaguda",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500081",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 17.4575,
      longitude: 78.3676,
    },
    areaServed: [
      {
        "@type": "City",
        name: "Hyderabad",
        sameAs: "https://en.wikipedia.org/wiki/Hyderabad",
      },
      {
        "@type": "State",
        name: "Telangana",
        sameAs: "https://en.wikipedia.org/wiki/Telangana",
      },
      {
        "@type": "State",
        name: "Andhra Pradesh",
        sameAs: "https://en.wikipedia.org/wiki/Andhra_Pradesh",
      },
      {
        "@type": "Country",
        name: "India",
        sameAs: "https://en.wikipedia.org/wiki/India",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-9000929666",
        contactType: "customer service",
        areaServed: ["Hyderabad", "Telangana", "Andhra Pradesh", "IN"],
        availableLanguage: ["English", "Hindi", "Telugu"],
      },
    ],
    sameAs: [
      "https://www.linkedin.com/company/wealthystep",
      "https://twitter.com/wealthystep",
      "https://www.instagram.com/wealthystep",
    ],
  };
}

/**
 * Generates Schema.org WebSite Schema with Sitelinks Searchbox definition
 * potentialAction enables Google Sitelinks Searchbox in SERP
 */
export function getWebSiteSchema() {
  const siteUrl = SITE_CONFIG.siteUrl;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: SITE_CONFIG.name,
    alternateName: ["WealthyStep", "Wealthy Step India", "Wealthy Step Hyderabad"],
    description: SITE_CONFIG.defaultDescription,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/blogs/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generates Schema.org SiteNavigationElement Schema
 * Tells Google which pages are your primary navigation — critical for triggering Sitelinks.
 */
export function getSiteNavigationSchema() {
  const siteUrl = SITE_CONFIG.siteUrl;

  const navigationItems = [
    { name: "Mutual Fund Investments", url: `${siteUrl}/investments/` },
    { name: "Insurance Solutions", url: `${siteUrl}/insurance/` },
    { name: "SIP & Goal Calculators", url: `${siteUrl}/goal-calculators/` },
    { name: "NRI Services", url: `${siteUrl}/nri-services/` },
    { name: "About Us", url: `${siteUrl}/about/` },
    { name: "Knowledge Center", url: `${siteUrl}/knowledge/` },
    { name: "Blog", url: `${siteUrl}/blogs/` },
    { name: "Contact Us", url: `${siteUrl}/contact/` },
    { name: "Download Policy", url: `${siteUrl}/policy-download/` },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "@id": `${siteUrl}/#navigation`,
    name: "Main Navigation",
    hasPart: navigationItems.map((item) => ({
      "@type": "WebPage",
      name: item.name,
      url: item.url,
    })),
  };
}

/**
 * Generates Schema.org ItemList Schema for key pages.
 * Google uses this ordered list to understand page hierarchy — directly influences Sitelinks selection.
 */
export function getItemListSchema() {
  const siteUrl = SITE_CONFIG.siteUrl;

  const keyPages = [
    { name: "Mutual Fund Investments", url: `${siteUrl}/investments/`, description: "Explore equity, debt, and hybrid mutual fund solutions with SIP planning guidance." },
    { name: "Insurance Solutions", url: `${siteUrl}/insurance/`, description: "Life, health, and group insurance solutions for individuals and corporates." },
    { name: "SIP & Goal Calculators", url: `${siteUrl}/goal-calculators/`, description: "Free SIP, retirement, education, and lumpsum financial goal calculators." },
    { name: "NRI Investment Services", url: `${siteUrl}/nri-services/`, description: "Mutual fund distribution and coordination support for NRIs in India." },
    { name: "About Wealthy Step", url: `${siteUrl}/about/`, description: "Learn about our AMFI registration, team, and investment philosophy." },
    { name: "Contact Us", url: `${siteUrl}/contact/`, description: "Get in touch for personalized mutual fund and insurance planning." },
    { name: "Knowledge Center", url: `${siteUrl}/knowledge/`, description: "Expert guides on mutual funds, compounding, NRI taxation, and insurance." },
    { name: "Blog", url: `${siteUrl}/blogs/`, description: "Insights on SIP, market trends, tax planning, and wealth creation." },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl}/#itemlist`,
    name: "Wealthy Step Key Pages",
    numberOfItems: keyPages.length,
    itemListElement: keyPages.map((page, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: page.name,
      url: page.url,
      description: page.description,
    })),
  };
}

/**
 * Generates Schema.org LocalBusiness Schema for Hyderabad office.
 * Strengthens local SEO signals and helps trigger location-based sitelinks.
 */
export function getLocalBusinessSchema() {
  const siteUrl = SITE_CONFIG.siteUrl;

  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${siteUrl}/#localbusiness`,
    name: SITE_CONFIG.name,
    image: `${siteUrl}/logo.png`,
    url: siteUrl,
    telephone: "+91-9000929666",
    priceRange: "Free Consultation",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Pranava Business Park, 7th Floor, Kothaguda",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500081",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 17.4575,
      longitude: 78.3676,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "14:00",
      },
    ],
    areaServed: [
      { "@type": "City", name: "Hyderabad" },
      { "@type": "State", name: "Telangana" },
      { "@type": "State", name: "Andhra Pradesh" },
      { "@type": "Country", name: "India" },
    ],
    sameAs: [
      "https://www.linkedin.com/company/wealthystep",
      "https://twitter.com/wealthystep",
      "https://www.instagram.com/wealthystep",
    ],
    parentOrganization: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

/**
 * Generates Schema.org SoftwareApplication / WebApplication Schema for Financial Suite & Calculators
 */
export function getHcmSoftwareSchema() {
  const siteUrl = SITE_CONFIG.siteUrl;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#webapp`,
    name: "Wealthy Step Goal Calculators & Financial Suite",
    url: getCanonicalUrl("/goal-calculators/"),
    applicationCategory: "FinanceApplication",
    operatingSystem: "All modern web browsers (iOS, Android, Windows, macOS, Linux)",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    description:
      "Comprehensive suite of financial calculators including SIP, Lumpsum, Step-up SIP, Retirement, SWP, and Child Education planners.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

// Alias for backwards compatibility
export const getFinancialPlatformSchema = getHcmSoftwareSchema;

/**
 * Generates Schema.org BreadcrumbList Schema
 */
export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  const siteUrl = SITE_CONFIG.siteUrl;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path.startsWith("http") ? item.path : getCanonicalUrl(item.path),
    })),
  };
}

/**
 * Generates Schema.org FAQPage Schema
 */
export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generates Schema.org Article / BlogPosting Schema
 */
export function getArticleSchema(article: {
  title: string;
  excerpt: string;
  slug: string;
  image?: string;
  date: string;
  updatedAt?: string;
  author?: string;
}) {
  const siteUrl = SITE_CONFIG.siteUrl;
  const canonicalUrl = getCanonicalUrl(`/blogs/${article.slug}/`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    headline: article.title,
    description: article.excerpt,
    url: canonicalUrl,
    image: article.image
      ? article.image.startsWith("http")
        ? article.image
        : `${siteUrl}${article.image}`
      : `${siteUrl}/logo.png`,
    datePublished: article.date,
    dateModified: article.updatedAt || article.date,
    author: {
      "@type": "Person",
      name: article.author || "Anil Kumar (Wealthy Step)",
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };
}

/**
 * Global Root Structured Data Component for app/layout.tsx
 */
export function GlobalStructuredData() {
  const schemas = [
    getOrganizationSchema(),
    getWebSiteSchema(),
    getSiteNavigationSchema(),
    getItemListSchema(),
    getLocalBusinessSchema(),
    getFinancialPlatformSchema(),
  ];

  return <JsonLd data={schemas} />;
}
