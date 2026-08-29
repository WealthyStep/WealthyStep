import { ChatbotIntent, KnowledgeBaseEntry } from './types';

// The centralized, approved knowledge base for the chatbot.
// No LLM generation is used. These are strict, verified responses.
export const knowledgeBase: Record<ChatbotIntent, Partial<KnowledgeBaseEntry>> = {
  GREETING: {
    answer: "Hello! 👋 Welcome to Wealthy Step.\nHow can we help you today?",
    quickReplies: ['Mutual Funds', 'Insurance', 'NRI Services', 'Goal Calculators', 'Contact Our Team'],
  },
  
  SIP: {
    answer: "A Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly (e.g., monthly) in a mutual fund. It helps inculcate financial discipline and uses the power of compounding and rupee cost averaging over time.",
    quickReplies: ['Try SIP Calculator', 'What is Step-Up SIP?', 'Mutual Fund Solutions', 'Contact Our Team'],
    complianceNote: "Mutual fund investments are subject to market risks.",
    richCard: {
      title: "About SIP",
      items: [
        "Invest a fixed amount regularly",
        "Rupee cost averaging benefit",
        "Disciplined wealth creation",
        "Flexible & affordable"
      ],
      actionText: "Would you like to try our SIP Calculator?",
      actionButton: "Try SIP Calculator"
    }
  },
  
  STEP_UP_SIP: {
    answer: "A Step-Up SIP allows you to automatically increase your SIP contribution amount at regular intervals (usually annually). It helps you align your investments with your growing income to reach financial goals faster.",
    quickReplies: ['Try Step-Up SIP Calculator', 'What is SIP?', 'Contact Our Team'],
  },
  
  LUMPSUM: {
    answer: "A Lumpsum investment is when you invest a significant amount of money in a mutual fund in one go, rather than in regular installments like a SIP.",
    quickReplies: ['Try Lumpsum Calculator', 'What is SIP?', 'Contact Our Team'],
  },
  
  SWP: {
    answer: "A Systematic Withdrawal Plan (SWP) allows you to withdraw a fixed amount from your mutual fund investment at regular intervals. It's often used by investors seeking a regular cash flow, such as during retirement.",
    quickReplies: ['Try SWP Calculator', 'Retirement Calculator', 'Contact Our Team'],
  },
  
  RETIREMENT_CALCULATOR: {
    answer: "Our Retirement Calculator helps you estimate the corpus you might need to maintain your lifestyle post-retirement. It accounts for your current age, retirement age, life expectancy, current savings, and expected inflation.",
    quickReplies: ['Try Retirement Calculator', 'What is SWP?', 'Contact Our Team'],
    complianceNote: "Calculator results are illustrative estimates and do not guarantee future outcomes."
  },
  
  EDUCATION_CALCULATOR: {
    answer: "The Education Calculator helps estimate the future cost of higher education considering inflation, and calculates the monthly SIP required today to build that corpus.",
    quickReplies: ['Try Education Calculator', 'What is Step-Up SIP?', 'Contact Our Team'],
  },
  
  EMI_CALCULATOR: {
    answer: "The EMI Calculator helps you estimate your monthly loan repayment amount based on the principal loan amount, interest rate, and loan tenure.",
    quickReplies: ['Try EMI Calculator', 'Contact Our Team'],
  },
  
  MUTUAL_FUNDS: {
    answer: "A mutual fund pools money from many investors to invest in securities like stocks, bonds, and short-term debt. Wealthy Step is an AMFI Registered Mutual Fund Distributor offering goal-based mutual fund solutions.",
    quickReplies: ['Equity Funds', 'Debt Funds', 'Hybrid Funds', 'Contact Our Team'],
    complianceNote: "Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully.",
    richCard: {
      title: "Why Mutual Funds?",
      items: [
        "Professional fund management",
        "Diversification across assets",
        "Liquidity and flexibility",
        "Tax benefits (ELSS funds)"
      ],
      actionText: "Need help choosing the right fund?",
      actionButton: "Contact Our Team"
    }
  },
  
  EQUITY_FUNDS: {
    answer: "Equity mutual funds invest primarily in shares/stocks of companies. They are considered suitable for long-term wealth creation but carry higher market volatility.",
    quickReplies: ['What is SIP?', 'Mutual Fund Risk', 'Contact Our Team'],
  },
  
  DEBT_FUNDS: {
    answer: "Debt mutual funds invest in fixed-income securities like corporate bonds, treasury bills, and government securities. They are generally considered less volatile than equity funds.",
    quickReplies: ['Mutual Funds', 'Hybrid Funds', 'Contact Our Team'],
  },
  
  HYBRID_FUNDS: {
    answer: "Hybrid mutual funds invest in a mix of asset classes, primarily equity and debt. This combination aims to offer a balance of growth and stability.",
    quickReplies: ['Mutual Funds', 'Contact Our Team'],
  },
  
  KYC: {
    answer: "Know Your Customer (KYC) is a mandatory one-time verification process for all mutual fund investors in India. It requires your PAN, address proof, and identity verification.",
    quickReplies: ['NRI Services', 'Contact Our Team'],
  },
  
  NAV: {
    answer: "Net Asset Value (NAV) represents the per-unit price of a mutual fund scheme. It is calculated by dividing the total value of all assets in the portfolio, minus liabilities, by the number of outstanding units.",
    quickReplies: ['Mutual Funds', 'Contact Our Team'],
  },
  
  MUTUAL_FUND_RISK: {
    answer: "All investments carry some level of risk. Equity funds face market volatility, while debt funds face interest rate and credit risks. Wealthy Step does not guarantee returns or predict market outcomes.",
    quickReplies: ['Contact Our Team'],
    complianceNote: "Mutual fund investments are subject to market risks."
  },
  
  CALCULATOR_HELP: {
    answer: "Wealthy Step offers several financial calculators to help you plan your goals. They provide illustrative estimates to help you plan.",
    quickReplies: ['SIP Calculator', 'Retirement Calculator', 'Contact Our Team'],
    complianceNote: "Calculator results are illustrative estimates and do not guarantee future outcomes.",
    richCard: {
      title: "Goal Calculators",
      items: [
        "SIP & Step-Up SIP Calculator",
        "Lumpsum Calculator",
        "Retirement Corpus Calculator",
        "Child Education Calculator",
        "SWP & EMI Calculators"
      ],
      actionText: "Would you like to try our popular SIP Calculator?",
      actionButton: "SIP Calculator"
    }
  },
  
  INSURANCE: {
    answer: "We assist clients with finding suitable insurance solutions, including Term Life Insurance, Health Insurance (Mediclaim), and specialized Corporate & Group Insurance.",
    quickReplies: ['Term Insurance', 'Health Insurance', 'Corporate Insurance'],
  },
  
  TERM_INSURANCE: {
    answer: "Term insurance provides financial coverage to the policyholder's family for a specific time period (the 'term') in exchange for a premium. It is a pure protection plan without maturity benefits.",
    quickReplies: ['Insurance', 'Contact Our Team'],
  },
  
  HEALTH_INSURANCE: {
    answer: "Health insurance (Mediclaim) covers medical expenses incurred due to hospitalization, surgeries, and specific illnesses, protecting your savings from unexpected medical emergencies.",
    quickReplies: ['Insurance', 'Contact Our Team'],
  },
  
  CORPORATE_INSURANCE: {
    answer: "We offer specialized Corporate & Group Insurance solutions, including Group Health, Group Term Life, and tailored Employee Benefit packages designed to protect your workforce.",
    quickReplies: ['Contact Our Team', 'Insurance'],
  },
  
  NRI_SERVICES: {
    answer: "Wealthy Step provides dedicated support for Non-Resident Indians (NRIs) looking to invest in Indian Mutual Funds. We assist with NRI KYC, NRE/NRO account investments, and portfolio structuring.",
    quickReplies: ['Contact Our Team', 'Mutual Funds'],
  },
  
  CONTACT: {
    answer: "You can reach the Wealthy Step team via our Contact page, or I can help you submit an enquiry right now and our team will get back to you.",
    quickReplies: ['Contact Our Team', 'Mutual Funds'],
  },
  
  HUMAN_SUPPORT: {
    answer: "I can help you submit an enquiry to the Wealthy Step team. Would you like to provide your details now?",
    quickReplies: ['Yes, Contact Our Team', 'No, thanks'],
  },
  
  COMMISSION_DISCLOSURE: {
    answer: "As an AMFI Registered Mutual Fund Distributor, Wealthy Step earns a commission from Asset Management Companies (AMCs) for mutual funds distributed. You can find our full Commission Disclosure on our website.",
    quickReplies: ['Mutual Funds', 'Contact Our Team'],
  },
  
  RISK_FACTORS: {
    answer: "Mutual fund investments are subject to market risks, read all scheme related documents carefully. Wealthy Step is a distributor and does not provide guaranteed returns or personalized investment advisory services.",
    quickReplies: ['Contact Our Team'],
  },
  
  PRIVACY: {
    answer: "Wealthy Step respects your privacy. Any information you provide through this chat will be used strictly to assist with your enquiry. Please do not share sensitive information like passwords, OTPs, or bank details here.",
    quickReplies: ['Contact Our Team'],
  },
  
  WEBSITE_NAVIGATION: {
    answer: "You can navigate our website using the menu at the top. We have sections for Goal Calculators, Mutual Funds, Insurance, and NRI Services.",
    quickReplies: ['Goal Calculators', 'Mutual Funds'],
  },
  
  GENERAL_ENQUIRY: {
    answer: "For any general enquiries, the best way to get accurate information is to speak with our team.",
    quickReplies: ['Contact Our Team'],
  },

  ABOUT_BOT: {
    answer: "I am the Wealthy Step digital assistant! 🤖 I'm here to help you navigate our services, explain basic financial concepts, and connect you with our human experts when you're ready to invest.",
    quickReplies: ['Goal Calculators', 'Contact Our Team'],
  },

  THANKS: {
    answer: "You're very welcome! Let me know if you need anything else.",
    quickReplies: ['Contact Our Team'],
  },
  
  UNKNOWN: {
    answer: "I want to make sure I give you accurate information. I couldn't confidently identify your question from our available information.\n\nYou can try asking in another way, or I can help you connect with the Wealthy Step team.",
    quickReplies: ['Contact Our Team', 'Mutual Funds', 'Insurance', 'Goal Calculators'],
  }
};
