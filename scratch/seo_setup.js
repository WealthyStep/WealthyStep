const fs = require('fs');
const path = require('path');

const basePath = 'd:/Projects/wealthystep/app';

const seoData = {
  'page.tsx': {
    title: 'Mutual Fund Investment Solutions & Insurance | Wealthy Step',
    description: 'Wealthy Step provides goal-focused mutual fund distribution, insurance solutions, and NRI investment support. Explore options aligned with your financial goals.'
  },
  'about/page.tsx': {
    title: 'About Wealthy Step | Mutual Fund Distribution Support',
    description: 'Learn about Wealthy Step, our core values, and our commitment to goal-based mutual fund distribution and investor education.'
  },
  'investments/page.tsx': {
    title: 'Mutual Fund Solutions | Wealthy Step',
    description: 'Discover a diverse range of mutual fund solutions tailored for your risk tolerance and investment horizon.'
  },
  'insurance/page.tsx': {
    title: 'Insurance Solutions & Coverage Options | Wealthy Step',
    description: 'Explore term life and health insurance plans designed to support your family\'s future.'
  },
  'nri-services/page.tsx': {
    title: 'NRI Mutual Fund Investment Support | Wealthy Step',
    description: 'Dedicated mutual fund distribution and coordination support for Non-Resident Indians navigating Indian investments.'
  },
  'goal-calculators/page.tsx': {
    title: 'Investment Goal Calculators | Wealthy Step',
    description: 'Use our educational SIP, Lumpsum, and retirement calculators to explore illustrative mutual fund projections.'
  },
  'blogs/page.tsx': {
    title: 'Mutual Fund & Investment Blogs | Wealthy Step',
    description: 'Read educational articles on mutual fund investing, SIPs, insurance, and goal-based investment strategies.'
  },
  'contact/page.tsx': {
    title: 'Contact Wealthy Step | Investor Support',
    description: 'Get in touch with Wealthy Step for support with your mutual fund investments and insurance queries.'
  },
  'commission-disclosure/page.tsx': {
    title: 'Commission Disclosure | Wealthy Step',
    description: 'Review our mutual fund commission disclosure as per AMFI and SEBI guidelines for mutual fund distributors.'
  },
  'risk-factors/page.tsx': {
    title: 'Risk Factors & Disclaimer | Wealthy Step',
    description: 'Important risk factors, liability disclaimers, and regulatory disclosures regarding mutual fund investments.'
  },
  'important-links/page.tsx': {
    title: 'Important Links & Resources | Wealthy Step',
    description: 'Access important regulatory links, investor education resources, and official SEBI/AMFI portals.'
  },
  'privacy-policy/page.tsx': {
    title: 'Privacy Policy | Wealthy Step',
    description: 'Read the Wealthy Step privacy policy to understand how we protect your data and personal information.'
  },
  'terms-conditions/page.tsx': {
    title: 'Terms & Conditions | Wealthy Step',
    description: 'Review the terms and conditions for using the Wealthy Step mutual fund distribution platform.'
  },
  'investor-grievance/page.tsx': {
    title: 'Investor Grievance Redressal | Wealthy Step',
    description: 'Information on our investor grievance redressal mechanism and escalation matrix.'
  }
};

Object.entries(seoData).forEach(([relativePath, meta]) => {
  const fullPath = path.join(basePath, relativePath);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');
  
  const hasMetadataImport = content.includes('import { Metadata } from "next";') || content.includes('import type { Metadata }');
  if (!hasMetadataImport) {
    content = `import { Metadata } from "next";\n` + content;
  }

  const newMetadataBlock = `export const metadata: Metadata = {
  title: "${meta.title}",
  description: "${meta.description}",
  alternates: {
    canonical: '${relativePath === 'page.tsx' ? '/' : '/' + relativePath.replace('/page.tsx', '')}'
  },
  openGraph: {
    title: "${meta.title}",
    description: "${meta.description}",
    url: '${relativePath === 'page.tsx' ? '/' : '/' + relativePath.replace('/page.tsx', '')}',
    type: "website",
  },
};`;

  const metaRegex = /export const metadata:\s*Metadata\s*=\s*{[\s\S]*?};/;
  
  if (metaRegex.test(content)) {
    content = content.replace(metaRegex, newMetadataBlock);
  } else {
    // Inject right before the default export
    const exportRegex = /export default function/;
    content = content.replace(exportRegex, `${newMetadataBlock}\n\nexport default function`);
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated metadata for ${relativePath}`);
});
