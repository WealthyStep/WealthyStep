import React from 'react';

export function StructuredData() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": ["Organization", "FinancialService"],
      "name": "Wealthy Step",
      "url": "https://wealthystep.com",
      "logo": "https://wealthystep.com/logo.svg",
      "description": "Wealthy Step is an AMFI Registered Mutual Fund Distributor providing goal-based mutual fund investment solutions, comprehensive insurance, and goal-based calculators.",
      "sameAs": [
        "https://www.linkedin.com/company/wealthystep",
        "https://twitter.com/wealthystep"
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Gachibowli",
        "addressLocality": "Hyderabad",
        "addressRegion": "Telangana",
        "postalCode": "500032",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9000929666",
        "contactType": "customer service"
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "Mutual Fund Distribution"
        },
        {
          "@type": "Offer",
          "name": "Insurance Solutions"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Wealthy Step",
      "url": "https://wealthystep.com"
    }
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
