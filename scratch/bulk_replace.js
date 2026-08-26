const fs = require('fs');
const path = require('path');

const replacements = [
  // blogs.ts
  {
    file: 'lib/data/blogs.ts',
    from: 'Customized Investment Strategy:',
    to: 'Goal-Based Investment Options:'
  },
  {
    file: 'lib/data/blogs.ts',
    from: 'tailor your investment strategy to match your individual preferences',
    to: 'select investment options that align with your individual preferences'
  },
  {
    file: 'lib/data/blogs.ts',
    from: 'Goal-Based Investment Strategy:',
    to: 'Goal-Based Investing Approach:'
  },
  {
    file: 'lib/data/blogs.ts',
    from: 'Developing an investment strategy tailored to your goals',
    to: 'Selecting mutual fund options aligned with your goals'
  },
  
  // WhatsAppButton.tsx
  {
    file: 'components/ui/WhatsAppButton.tsx',
    from: 'Need investment guidance?',
    to: 'Need mutual fund assistance?'
  },

  // NRI Services
  {
    file: 'components/sections/nri-services/NriProcess.tsx',
    from: 'Strategy Design',
    to: 'Process Overview'
  },
  {
    file: 'components/sections/nri-services/NriHero.tsx',
    from: 'Dedicated<br/>NRI Portfolio',
    to: 'NRI<br/>Investment Support'
  },
  {
    file: 'components/sections/nri-services/NriServicesGrid.tsx',
    from: 'coordinating with tax professionals.',
    to: 'coordinating with appropriately qualified professionals where applicable.'
  },
  {
    file: 'components/sections/nri-services/NriServicesGrid.tsx',
    from: 'connecting with appropriately qualified tax professionals',
    to: 'connecting with appropriately qualified professionals'
  },

  // Investments
  {
    file: 'components/sections/investments/WhyInvestWithUs.tsx',
    from: 'Certified experts with deep market knowledge',
    to: 'Dedicated team for mutual fund distribution'
  },
  {
    file: 'components/sections/investments/WhyInvestWithUs.tsx',
    from: 'Low Cost',
    to: 'Transparent'
  },
  {
    file: 'components/sections/investments/InvestmentStats.tsx',
    from: 'Aligning portfolios with your objectives',
    to: 'Exploring options aligned with your objectives'
  },
  {
    file: 'components/sections/investments/InvestmentStats.tsx',
    from: 'No hidden fees, complete clarity',
    to: 'Transparent distribution processes'
  },
  {
    file: 'components/sections/investments/InvestmentOptions.tsx',
    from: 'to manage risk and optimize returns.',
    to: 'to align with your stated risk tolerance.'
  },
  {
    file: 'components/sections/investments/InvestmentOptions.tsx',
    from: '"Expert Support"',
    to: '"Dedicated Support"'
  },
  {
    file: 'components/sections/investments/InvestmentOptions.tsx',
    from: 'tailored to your needs.',
    to: 'aligned with your goals.'
  },
  {
    file: 'components/sections/investments/InvestmentApproach.tsx',
    from: 'We help you achieve long-term wealth and financial independence.',
    to: 'We assist you in exploring mutual fund options for long-term goals.'
  },
  {
    file: 'components/sections/investments/InvestmentApproach.tsx',
    from: 'a proven investment approach',
    to: 'a structured investment approach'
  },

  // Insurance
  {
    file: 'components/sections/insurance/WhyChooseWealthyStep.tsx',
    from: 'title: "Expert Support"',
    to: 'title: "Dedicated Support"'
  },
  
  // CTA & Contact
  {
    file: 'components/sections/CTASection.tsx',
    from: 'Expert Support',
    to: 'Dedicated Support'
  },
  {
    file: 'components/sections/contact/ContactHero.tsx',
    from: 'Expert Support',
    to: 'Dedicated Support'
  },

  // About & What We Plan
  {
    file: 'components/sections/about/WhatWePlan.tsx',
    from: 'title: "Goal-Based Investment Guidance"',
    to: 'title: "Goal-Based Investment Support"'
  },
  {
    file: 'components/sections/about/WhatWePlan.tsx',
    from: 'Create a clear financial strategy based on your income, responsibilities, aspirations, and long-term goals.',
    to: 'Explore mutual fund solutions based on your income, responsibilities, aspirations, and long-term goals.'
  },
  {
    file: 'components/sections/about/WhatWePlan.tsx',
    from: 'title: "Mutual Fund Guidance"',
    to: 'title: "Mutual Fund Distribution"'
  },
  {
    file: 'components/sections/about/WhatWePlan.tsx',
    from: 'title: "Wealth Tracking & Review"',
    to: 'title: "Investment Portfolio Tracking"'
  },
  {
    file: 'components/sections/about/WhatWePlan.tsx',
    from: 'structured wealth tracking and periodic review reports.',
    to: 'structured tracking and periodic portfolio updates.'
  },
  {
    file: 'components/sections/about/OurApproach.tsx',
    from: 'financial approach',
    to: 'investment journey'
  },
  {
    file: 'components/sections/about/OurApproach.tsx',
    from: 'informed financial decisions',
    to: 'informed investment decisions'
  },
  {
    file: 'components/sections/about/OurApproach.tsx',
    from: 'your investment approach should evolve with it.',
    to: 'your investment choices may evolve with it.'
  },
  {
    file: 'components/sections/about/MissionVision.tsx',
    from: 'professional investment guidance should not feel complicated',
    to: 'investing in mutual funds should not feel complicated'
  },
  {
    file: 'components/sections/about/CoreValues.tsx',
    from: 'title: "Client-Centric Guidance"',
    to: 'title: "Client-Centric Support"'
  },
  {
    file: 'components/sections/about/AboutStory.tsx',
    from: 'goal-based investment guidance',
    to: 'mutual fund distribution support'
  },
  {
    file: 'components/layout/Footer.tsx',
    from: 'goal-based investment guidance',
    to: 'mutual fund distribution'
  },

  // Calculators (Generic Fixes)
  { file: 'components/calculators/SipCalculator.tsx', from: 'Your Potential Returns', to: 'Illustrative Projections' },
  { file: 'components/calculators/SipCalculator.tsx', from: 'Your money can grow <strong>{(results.maturityValue / results.totalInvestment).toFixed(2)}x</strong>', to: 'Projected value is <strong>{(results.maturityValue / results.totalInvestment).toFixed(2)}x</strong>' },
  { file: 'components/calculators/SipCalculator.tsx', from: 'Suggested Allocation', to: 'Sample Asset Allocation' },
  { file: 'components/calculators/SipCalculator.tsx', from: 'Equity Funds', to: 'Equity-Oriented Funds' },
  { file: 'components/calculators/SipCalculator.tsx', from: 'Debt Funds', to: 'Debt-Oriented Funds' },
  { file: 'components/calculators/SipCalculator.tsx', from: 'Need Expert Support?', to: 'Need Assistance?' },

  { file: 'components/calculators/StepUpSipCalculator.tsx', from: 'Your Potential Returns', to: 'Illustrative Projections' },
  { file: 'components/calculators/StepUpSipCalculator.tsx', from: 'Your money can grow <strong>{(results.maturityValue / results.totalInvestment).toFixed(2)}x</strong>', to: 'Projected value is <strong>{(results.maturityValue / results.totalInvestment).toFixed(2)}x</strong>' },
  { file: 'components/calculators/StepUpSipCalculator.tsx', from: 'Suggested Allocation', to: 'Sample Asset Allocation' },
  { file: 'components/calculators/StepUpSipCalculator.tsx', from: 'Equity Funds', to: 'Equity-Oriented Funds' },
  { file: 'components/calculators/StepUpSipCalculator.tsx', from: 'Debt Funds', to: 'Debt-Oriented Funds' },
  { file: 'components/calculators/StepUpSipCalculator.tsx', from: 'Need Expert Support?', to: 'Need Assistance?' },

  { file: 'components/calculators/SwpCalculator.tsx', from: 'Suggested Allocation', to: 'Sample Asset Allocation' },
  { file: 'components/calculators/SwpCalculator.tsx', from: 'Equity Funds', to: 'Equity-Oriented Funds' },
  { file: 'components/calculators/SwpCalculator.tsx', from: 'Debt Funds', to: 'Debt-Oriented Funds' },
  { file: 'components/calculators/SwpCalculator.tsx', from: 'Need Expert Support?', to: 'Need Assistance?' },

  { file: 'components/calculators/LumpsumCalculator.tsx', from: 'Your Potential Returns', to: 'Illustrative Projections' },
  { file: 'components/calculators/LumpsumCalculator.tsx', from: 'Your money can grow <strong>{(results.maturityValue / results.initialInvestment).toFixed(2)}x</strong>', to: 'Projected value is <strong>{(results.maturityValue / results.initialInvestment).toFixed(2)}x</strong>' },
  { file: 'components/calculators/LumpsumCalculator.tsx', from: 'Suggested Allocation', to: 'Sample Asset Allocation' },
  { file: 'components/calculators/LumpsumCalculator.tsx', from: 'Equity Funds', to: 'Equity-Oriented Funds' },
  { file: 'components/calculators/LumpsumCalculator.tsx', from: 'Debt Funds', to: 'Debt-Oriented Funds' },
  { file: 'components/calculators/LumpsumCalculator.tsx', from: 'Need Expert Support?', to: 'Need Assistance?' },

  { file: 'components/calculators/EducationCalculator.tsx', from: 'Your Potential Returns', to: 'Illustrative Projections' },
  { file: 'components/calculators/EducationCalculator.tsx', from: 'Your money can grow', to: 'Projected value is' },
  { file: 'components/calculators/EducationCalculator.tsx', from: 'Suggested Allocation', to: 'Sample Asset Allocation' },
  { file: 'components/calculators/EducationCalculator.tsx', from: 'Equity Funds', to: 'Equity-Oriented Funds' },
  { file: 'components/calculators/EducationCalculator.tsx', from: 'Debt Funds', to: 'Debt-Oriented Funds' },
  { file: 'components/calculators/EducationCalculator.tsx', from: 'Need Expert Support?', to: 'Need Assistance?' },

  { file: 'components/calculators/RetirementCalculator.tsx', from: 'Your Potential Returns', to: 'Illustrative Projections' },
  { file: 'components/calculators/RetirementCalculator.tsx', from: 'Your money can grow', to: 'Projected value is' },
  { file: 'components/calculators/RetirementCalculator.tsx', from: 'Suggested Allocation', to: 'Sample Asset Allocation' },
  { file: 'components/calculators/RetirementCalculator.tsx', from: 'Equity Funds', to: 'Equity-Oriented Funds' },
  { file: 'components/calculators/RetirementCalculator.tsx', from: 'Debt Funds', to: 'Debt-Oriented Funds' },
  { file: 'components/calculators/RetirementCalculator.tsx', from: 'Need Expert Support?', to: 'Need Assistance?' },

  { file: 'components/calculators/EmiCalculator.tsx', from: 'Need Expert Support?', to: 'Need Assistance?' }
];

const basePath = 'd:/Projects/wealthystep';

replacements.forEach(({ file, from, to }) => {
  const fullPath = path.join(basePath, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    // Global replacement for basic strings
    const splitContent = content.split(from);
    if (splitContent.length > 1) {
      content = splitContent.join(to);
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated ${file}: replaced "${from}" with "${to}"`);
    } else {
      console.log(`String not found in ${file}: "${from}"`);
    }
  } else {
    console.log(`File not found: ${fullPath}`);
  }
});
