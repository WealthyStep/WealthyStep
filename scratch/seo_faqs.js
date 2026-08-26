const fs = require('fs');
const path = require('path');

function injectInvestmentsFAQ() {
  const filePath = 'd:/Projects/wealthystep/app/investments/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('import { FAQSection }')) {
    content = content.replace(
      /import { InvestmentsCTA } from "@\/components\/sections\/investments\/InvestmentsCTA";/,
      `import { InvestmentsCTA } from "@/components/sections/investments/InvestmentsCTA";\nimport { FAQSection } from "@/components/sections/FAQSection";`
    );

    const faqJSX = `
      <FAQSection 
        title="Frequently Asked Questions" 
        description="Learn more about mutual fund investments and our distribution services."
        faqs={[
          {
            question: "What is a Systematic Investment Plan (SIP)?",
            answer: "A Systematic Investment Plan (SIP) is a method of investing a fixed amount regularly in a mutual fund scheme. It allows you to invest systematically and benefit from rupee cost averaging over time."
          },
          {
            question: "What is the difference between Equity and Debt mutual funds?",
            answer: "Equity mutual funds predominantly invest in stocks of companies and are suited for long-term growth. Debt mutual funds invest in fixed income instruments like government securities and corporate bonds, generally offering more stability but potentially lower long-term returns compared to equity."
          },
          {
            question: "Can I withdraw my money anytime?",
            answer: "In open-ended mutual funds, you can generally redeem your investments on any business day. However, certain funds like ELSS (Equity Linked Savings Scheme) have a mandatory lock-in period of 3 years. Exit loads may apply depending on the holding period and the specific scheme."
          }
        ]}
      />
      <InvestmentsCTA />`;
    
    content = content.replace(/<InvestmentsCTA \/>/, faqJSX);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated app/investments/page.tsx with FAQs');
  }
}

function injectNriFAQ() {
  const filePath = 'd:/Projects/wealthystep/app/nri-services/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('import { FAQSection }')) {
    content = content.replace(
      /import { NriCTA } from "@\/components\/sections\/nri-services\/NriCTA";/,
      `import { NriCTA } from "@/components/sections/nri-services/NriCTA";\nimport { FAQSection } from "@/components/sections/FAQSection";`
    );

    const faqJSX = `
      <FAQSection 
        title="NRI Investment FAQs" 
        description="Common questions about mutual fund investments for Non-Resident Indians."
        faqs={[
          {
            question: "Can NRIs invest in Indian Mutual Funds?",
            answer: "Yes, Non-Resident Indians (NRIs) can invest in Indian mutual funds on a repatriable or non-repatriable basis. However, investors based in the USA or Canada may face specific restrictions depending on the Asset Management Company (AMC) due to FATCA regulations."
          },
          {
            question: "Do I need an NRE or NRO account?",
            answer: "To invest in Indian mutual funds, you require an NRE (Non-Resident External) or NRO (Non-Resident Ordinary) bank account. An NRE account allows for full repatriation of the investment corpus and gains, whereas an NRO account has specific repatriation limits as per RBI guidelines."
          },
          {
            question: "Is KYC mandatory for NRI mutual fund investments?",
            answer: "Yes, completing your Know Your Customer (KYC) process is mandatory. This typically requires copies of your passport, overseas address proof, PAN card, and a recent photograph. We assist our clients in coordinating the necessary documentation."
          }
        ]}
      />
      <NriCTA />`;
    
    content = content.replace(/<NriCTA \/>/, faqJSX);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated app/nri-services/page.tsx with FAQs');
  }
}

injectInvestmentsFAQ();
injectNriFAQ();
