const fs = require('fs');
const path = require('path');

const replacements = [
  {
    file: 'components/sections/nri-services/NriProcess.tsx',
    from: 'We handle the complex documentation.',
    to: 'We assist with the documentation process.'
  },
  {
    file: 'components/sections/nri-services/NriCTA.tsx',
    from: 'Talk to an NRI Expert',
    to: 'Talk to our NRI Support Team'
  },
  {
    file: 'components/sections/investments/WhyInvestWithUs.tsx',
    from: 'Optimized solutions with cost efficiency',
    to: 'Transparent solutions with cost efficiency'
  },
  {
    file: 'components/sections/investments/WhyInvestWithUs.tsx',
    from: 'Client-first approach with highest standards',
    to: 'Client-first approach to mutual fund distribution'
  },
  {
    file: 'components/sections/investments/WhyInvestWithUs.tsx',
    from: 'We are committed to your financial success.',
    to: 'We are committed to supporting your long-term goals.'
  },
  {
    file: 'components/sections/investments/InvestmentsHero.tsx',
    from: 'Discover carefully selected investment solutions',
    to: 'Discover mutual fund solutions'
  },
  {
    file: 'components/calculators/SipCalculator.tsx',
    from: 'Increase your SIP amount annually to beat inflation',
    to: 'Increasing your SIP amount annually helps counter inflation'
  },
  {
    file: 'components/forms/ContactForm.tsx',
    from: 'Tell us about your financial goals...',
    to: 'Tell us about your mutual fund or insurance requirements...'
  },
  {
    file: 'lib/data/blogs.ts',
    from: 'staying committed to your investment strategy and reviewing your portfolio regularly are essential for long-term financial success',
    to: 'staying consistent with your investments and reviewing your progress regularly are important for long-term goal achievement'
  }
];

const basePath = 'd:/Projects/wealthystep';

replacements.forEach(({ file, from, to }) => {
  const fullPath = path.join(basePath, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
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
