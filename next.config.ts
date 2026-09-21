import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      // Legacy WordPress Page Aliases -> Next.js Canonical Routes
      {
        source: '/about-us',
        destination: '/about/',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact/',
        permanent: true,
      },
      {
        source: '/services',
        destination: '/investments/',
        permanent: true,
      },
      {
        source: '/our-services',
        destination: '/investments/',
        permanent: true,
      },
      {
        source: '/mutual-funds',
        destination: '/investments/',
        permanent: true,
      },
      {
        source: '/insurance-services',
        destination: '/insurance/',
        permanent: true,
      },
      {
        source: '/nri',
        destination: '/nri-services/',
        permanent: true,
      },
      {
        source: '/nri-investment',
        destination: '/nri-services/',
        permanent: true,
      },
      {
        source: '/calculators',
        destination: '/goal-calculators/',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/blogs/',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/privacy-policy/',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/terms-conditions/',
        permanent: true,
      },

      // Legacy WordPress Uploads & Media Assets
      {
        source: '/wp-content/uploads/:path*',
        destination: '/images/:path*',
        permanent: true,
      },
      {
        source: '/wp-content/:path*',
        destination: '/images/:path*',
        permanent: true,
      },

      // Legacy WordPress Feeds & Taxonomies
      {
        source: '/feed/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/category/:path*',
        destination: '/blogs/',
        permanent: true,
      },
      {
        source: '/tag/:path*',
        destination: '/blogs/',
        permanent: true,
      },
      {
        source: '/author/:path*',
        destination: '/',
        permanent: true,
      },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    const cspHeader = `default-src 'self'; script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://www.googletagmanager.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://challenges.cloudflare.com; frame-src 'self' blob: https://challenges.cloudflare.com;`.replace(/\s{2,}/g, " ").trim();

    const securityHeaders = [
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on'
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload'
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN'
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin'
      },
      {
        key: 'Content-Security-Policy',
        value: cspHeader
      }
    ];

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },

      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/icon.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/logo.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      }
    ];
  },
};

export default nextConfig;
