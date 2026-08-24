import React from 'react';

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["Organization", "FinancialService"],
    "name": "Wealthy Step",
    "url": "https://wealthystep.com",
    "logo": "https://wealthystep.com/logo.svg",
    "description": "Legacy Through Mindful Steps. Expert investment advice, comprehensive insurance, and smart planning tools.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.linkedin.com/company/wealthystep",
      "https://twitter.com/wealthystep"
    ],
    "offers": [
      {
        "@type": "Offer",
        "name": "Wealth Management"
      },
      {
        "@type": "Offer",
        "name": "Insurance Solutions"
      },
      {
        "@type": "Offer",
        "name": "NRI Taxation Services"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
