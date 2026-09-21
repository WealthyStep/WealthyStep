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
        "streetAddress": "Pranava Business Park, 7th Floor, Kothaguda",
        "addressLocality": "Hyderabad",
        "addressRegion": "Telangana",
        "postalCode": "500081",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 17.4575,
        "longitude": 78.3676
      },
      "areaServed": [
        { "@type": "City", "name": "Hyderabad" },
        { "@type": "State", "name": "Telangana" },
        { "@type": "State", "name": "Andhra Pradesh" },
        { "@type": "Country", "name": "India" }
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9000929666",
        "contactType": "customer service",
        "areaServed": ["Hyderabad", "Telangana", "Andhra Pradesh", "IN"],
        "availableLanguage": ["English", "Hindi", "Telugu"]
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
