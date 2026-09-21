import type { Metadata } from "next";

/**
 * Global Site Configuration for Wealthy Step SEO Engine
 */
export const SITE_CONFIG = {
  name: "Wealthy Step",
  legalName: "LTM Ventures India LLP",
  arn: "ARN-322891",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.wealthystep.com").replace(/\/+$/, ""),
  defaultTitle: "Wealthy Step | AMFI Registered Mutual Fund Distributor",
  defaultDescription:
    "Wealthy Step is an AMFI Registered Mutual Fund Distributor (ARN-322891) in Hyderabad, Telangana — providing goal-based mutual fund investments, insurance solutions, and NRI investment support across India.",
  defaultImage: "/logo.png",
  locale: "en_IN",
  twitterHandle: "@wealthystep",
};

/**
 * Normalizes any route path to have a leading slash and strict trailing slash.
 * E.g. "about" -> "/about/", "/contact/" -> "/contact/", "/" -> "/"
 */
export function normalizeTrailingSlash(path: string = "/"): string {
  if (!path || path === "/" || path === "") {
    return "/";
  }
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  return `/${clean}/`;
}

/**
 * Computes the absolute canonical URL with strict trailing slash normalization.
 */
export function getCanonicalUrl(path: string = "/"): string {
  const normalizedPath = normalizeTrailingSlash(path);
  return `${SITE_CONFIG.siteUrl}${normalizedPath}`;
}

export interface RouteSeoConfig {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  priority?: number;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

/**
 * Centralized SEO Route Registry for Wealthy Step
 */
export const ROUTES_SEO: Record<string, RouteSeoConfig> = {
  home: {
    path: "/",
    title: "Wealthy Step | AMFI Registered Mutual Fund Distributor & Insurance",
    description:
      "AMFI Registered Mutual Fund Distributor (ARN-322891) in Hyderabad, Telangana — offering goal-based mutual fund investments, SIP planning, insurance solutions, and NRI portfolio guidance across India.",
    keywords: [
      "Mutual Fund Distributor Hyderabad",
      "AMFI Registered Mutual Fund Distributor",
      "ARN-322891",
      "Goal-based Investing",
      "SIP Investment Hyderabad",
      "Insurance Distribution Telangana",
      "NRI Investment India",
      "Mutual Fund Agent Kothaguda",
      "Financial Planner Hyderabad",
    ],
    priority: 1.0,
    changeFrequency: "weekly",
  },
  about: {
    path: "/about/",
    title: "About Wealthy Step | AMFI Mutual Fund Distributor India",
    description:
      "Learn about Wealthy Step, our ARN-322891 credential, investment philosophy, and dedicated mutual fund distribution and insurance planning services.",
    keywords: [
      "About Wealthy Step",
      "Mutual Fund Distributor Team",
      "AMFI ARN-322891",
      "Financial Planning Values",
      "Investor Education",
    ],
    priority: 0.8,
    changeFrequency: "monthly",
  },
  investments: {
    path: "/investments/",
    title: "Mutual Funds & SIP Investment Solutions | Wealthy Step",
    description:
      "Explore tailored equity, debt, and hybrid mutual fund solutions. Start your Systematic Investment Plan (SIP) with disciplined financial guidance.",
    keywords: [
      "Mutual Fund Investments",
      "SIP Planning",
      "Equity Funds",
      "Debt Funds",
      "Hybrid Funds",
      "Tax Saving ELSS",
    ],
    priority: 0.9,
    changeFrequency: "weekly",
  },
  insurance: {
    path: "/insurance/",
    title: "Insurance Solutions for Individuals & Groups | Wealthy Step",
    description:
      "Explore customized life, health, and group insurance solutions for individuals, families, and corporate employee teams with Wealthy Step.",
    keywords: [
      "Life Insurance",
      "Health Insurance",
      "Group Health Insurance",
      "Corporate Insurance",
      "Term Insurance Protection",
    ],
    priority: 0.9,
    changeFrequency: "weekly",
  },
  goalCalculators: {
    path: "/goal-calculators/",
    title: "Free SIP & Goal Investment Calculators | Wealthy Step",
    description:
      "Calculate SIP returns, retirement corpus, child education fund, and lumpsum growth using Wealthy Step's accurate financial goal calculators.",
    keywords: [
      "SIP Calculator",
      "Retirement Calculator",
      "Lumpsum Calculator",
      "Child Education Planner",
      "SWP Calculator",
      "Financial Calculators",
    ],
    priority: 0.9,
    changeFrequency: "monthly",
  },
  nriServices: {
    path: "/nri-services/",
    title: "NRI Mutual Fund Investment Support India | Wealthy Step",
    description:
      "Dedicated mutual fund distribution and coordination support for Non-Resident Indians navigating Indian investments, NRE/NRO accounts, and tax efficiency.",
    keywords: [
      "NRI Mutual Funds",
      "NRI Investment in India",
      "NRE NRO Investment",
      "NRI Tax Compliance",
      "Repatriable Investments",
    ],
    priority: 0.8,
    changeFrequency: "monthly",
  },
  knowledge: {
    path: "/knowledge/",
    title: "Mutual Fund Knowledge Center & Guides | Wealthy Step",
    description:
      "Enhance your financial literacy with expert mutual fund guides, compounding insights, NRI tax strategies, and smart insurance tips from Wealthy Step.",
    keywords: [
      "Mutual Fund Education",
      "Financial Literacy",
      "Compounding Guide",
      "NRI Taxation Guide",
      "Investment Strategies",
    ],
    priority: 0.8,
    changeFrequency: "weekly",
  },
  blogs: {
    path: "/blogs/",
    title: "Mutual Fund & Investment Insights Blog | Wealthy Step",
    description:
      "Read expert insights and educational guides on mutual funds, SIP compounding, tax planning, and wealth creation strategies from Wealthy Step.",
    keywords: [
      "Mutual Fund Blog",
      "Investment Insights",
      "SIP vs Lumpsum",
      "Market Trends India",
      "Wealth Creation Tips",
    ],
    priority: 0.8,
    changeFrequency: "weekly",
  },
  contact: {
    path: "/contact/",
    title: "Contact Wealthy Step | Mutual Fund & Insurance Support",
    description:
      "Get in touch with Wealthy Step in Hyderabad for personalized mutual fund distribution, portfolio reviews, insurance planning, and NRI investment coordination.",
    keywords: [
      "Contact Wealthy Step Hyderabad",
      "Mutual Fund Distributor Contact Hyderabad",
      "Financial Consultation Telangana",
      "Investor Support Office Kothaguda",
    ],
    priority: 0.7,
    changeFrequency: "monthly",
  },
  policyDownload: {
    path: "/policy-download/",
    title: "Download Policy Documents & Bonds | Wealthy Step Vault",
    description:
      "Access and download your verified insurance policies, mutual fund statements, and financial documents securely via OTP authentication with Wealthy Step.",
    keywords: [
      "Policy Download",
      "Insurance Policy Vault",
      "Mutual Fund Statement",
      "Secure Client Portal",
    ],
    priority: 0.8,
    changeFrequency: "monthly",
  },
  importantLinks: {
    path: "/important-links/",
    title: "Important Regulatory & Investor Links | Wealthy Step",
    description:
      "Access official SEBI, AMFI, registrar portals (CAMS & KFintech), and essential investor education resources curated by Wealthy Step.",
    keywords: ["SEBI Links", "AMFI Official", "CAMS KFintech", "Investor Resources"],
    priority: 0.5,
    changeFrequency: "yearly",
  },
  investorGrievance: {
    path: "/investor-grievance/",
    title: "Investor Grievance Redressal Matrix | Wealthy Step",
    description:
      "View our transparent investor grievance redressal escalation matrix and prompt dispute resolution mechanism for mutual fund and insurance clients.",
    keywords: ["Investor Grievance", "SCORES SEBI", "Grievance Escalation", "Investor Protection"],
    priority: 0.5,
    changeFrequency: "yearly",
  },
  privacyPolicy: {
    path: "/privacy-policy/",
    title: "Privacy Policy & Client Data Protection | Wealthy Step",
    description:
      "Understand how Wealthy Step collects, safeguards, and processes your confidential financial data and personal information with utmost security.",
    keywords: ["Privacy Policy", "Data Protection", "Client Confidentiality"],
    priority: 0.3,
    changeFrequency: "yearly",
  },
  termsConditions: {
    path: "/terms-conditions/",
    title: "Terms & Conditions of Service & Usage | Wealthy Step",
    description:
      "Review the terms and conditions governing the use of Wealthy Step mutual fund distribution services, financial tools, and website platform.",
    keywords: ["Terms of Service", "Mutual Fund Distributor Disclaimer"],
    priority: 0.3,
    changeFrequency: "yearly",
  },
  riskFactors: {
    path: "/risk-factors/",
    title: "Risk Factors & Statutory Disclaimers | Wealthy Step",
    description:
      "Review statutory disclosures, market risks, and regulatory disclaimers associated with mutual fund investments and insurance distribution in India.",
    keywords: ["Mutual Fund Risk Factors", "SEBI Disclosures", "Market Risk Disclaimer"],
    priority: 0.5,
    changeFrequency: "yearly",
  },
};

export interface ConstructMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

/**
 * Dynamically constructs a strictly normalized Next.js Metadata object.
 * Enforces trailingSlash canonicalization and rich OpenGraph/Twitter cards.
 */
export function constructMetadata(
  configOrKey: RouteSeoConfig | ConstructMetadataOptions | string
): Metadata {
  let resolved: ConstructMetadataOptions = {};

  if (typeof configOrKey === "string") {
    const route = ROUTES_SEO[configOrKey];
    if (route) {
      resolved = {
        title: route.title,
        description: route.description,
        path: route.path,
        keywords: route.keywords,
        image: route.image,
        type: route.type,
        noIndex: route.noIndex,
      };
    } else {
      resolved = { title: configOrKey };
    }
  } else {
    resolved = configOrKey;
  }

  const title = resolved.title || SITE_CONFIG.defaultTitle;
  const description = resolved.description || SITE_CONFIG.defaultDescription;
  const path = resolved.path || "/";
  const canonicalUrl = getCanonicalUrl(path);
  const imageUrl = resolved.image
    ? resolved.image.startsWith("http")
      ? resolved.image
      : `${SITE_CONFIG.siteUrl}${resolved.image}`
    : `${SITE_CONFIG.siteUrl}${SITE_CONFIG.defaultImage}`;
  const noIndex = Boolean(resolved.noIndex);
  const type = resolved.type || "website";

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: resolved.keywords,
    metadataBase: new URL(SITE_CONFIG.siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && {
        publishedTime: resolved.publishedTime,
        modifiedTime: resolved.modifiedTime,
        authors: resolved.authors || [SITE_CONFIG.name],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: SITE_CONFIG.twitterHandle,
      site: SITE_CONFIG.twitterHandle,
    },
  };
}
