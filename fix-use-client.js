const fs = require('fs');

const files = [
  "components/sections/about/AboutHero.tsx",
  "components/sections/about/AboutStory.tsx",
  "components/sections/about/CoreValues.tsx",
  "components/sections/about/MissionVision.tsx",
  "components/sections/about/OurApproach.tsx",
  "components/sections/about/Philosophy.tsx",
  "components/sections/contact/ContactBottomCTA.tsx",
  "components/sections/contact/ContactLocation.tsx",
  "components/sections/contact/ContactQuickInfo.tsx",
  "components/sections/GoalsSection.tsx",
  "components/sections/ImpactSection.tsx",
  "components/sections/insurance/InsuranceCTA.tsx",
  "components/sections/insurance/InsuranceHero.tsx",
  "components/sections/insurance/InsurancePlans.tsx",
  "components/sections/insurance/InsuranceStats.tsx",
  "components/sections/insurance/WhyChooseWealthyStep.tsx",
  "components/sections/investments/InvestmentsCTA.tsx",
  "components/sections/investments/InvestmentsHero.tsx",
  "components/sections/investments/InvestmentStats.tsx",
  "components/sections/investments/WhyInvestWithUs.tsx",
  "components/sections/nri-services/NriCTA.tsx",
  "components/sections/nri-services/NriHero.tsx",
  "components/sections/nri-services/NriProcess.tsx",
  "components/sections/nri-services/NriServicesGrid.tsx",
  "components/sections/ServicesSection.tsx"
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/"use client";\r?\n?/g, '').replace(/'use client';\r?\n?/g, '');
  fs.writeFileSync(f, content);
  console.log('Fixed', f);
});
