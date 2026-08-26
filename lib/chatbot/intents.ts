import { ChatbotIntent } from './types';

// Map of intents and their associated matching phrases/keywords
export const intentMappings: Record<ChatbotIntent, string[]> = {
  GREETING: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste'],
  
  SIP: ['sip', 'systematic investment plan', 'monthly investment', 'invest every month', 'start sip'],
  
  STEP_UP_SIP: ['step up sip', 'step-up sip', 'increase sip', 'grow sip', 'step up', 'stepup'],
  
  LUMPSUM: ['lumpsum', 'lump sum', 'one time investment', 'one-time investment', 'invest once'],
  
  SWP: ['swp', 'systematic withdrawal plan', 'withdraw monthly', 'monthly income', 'regular income from mutual fund'],
  
  RETIREMENT_CALCULATOR: ['retirement calculator', 'calculate retirement', 'retirement planning', 'retire early'],
  
  EDUCATION_CALCULATOR: ['education calculator', 'child education', 'college fund', 'school fees investment'],
  
  EMI_CALCULATOR: ['emi calculator', 'loan calculator', 'calculate emi', 'monthly emi'],
  
  MUTUAL_FUNDS: ['mutual fund', 'mutual funds', 'what is mutual fund', 'invest in mutual fund', 'amc'],
  
  EQUITY_FUNDS: ['equity fund', 'equity mutual fund', 'stock market fund', 'share market fund'],
  
  DEBT_FUNDS: ['debt fund', 'debt mutual fund', 'safe mutual fund', 'fixed income fund'],
  
  HYBRID_FUNDS: ['hybrid fund', 'balanced fund', 'hybrid mutual fund'],
  
  KYC: ['kyc', 'know your customer', 'c-kyc', 'ckyc', 'kyc process', 'complete kyc'],
  
  NAV: ['nav', 'net asset value', 'mutual fund price', 'current nav'],
  
  MUTUAL_FUND_RISK: ['risk', 'safe', 'guarantee', 'loss', 'market risk'],
  
  CALCULATOR_HELP: ['calculator', 'how to use calculator', 'calculators', 'goal calculator'],
  
  INSURANCE: ['insurance', 'life insurance', 'buy insurance', 'get insurance'],
  
  TERM_INSURANCE: ['term insurance', 'term plan', 'term life', 'pure protection'],
  
  HEALTH_INSURANCE: ['health insurance', 'mediclaim', 'medical insurance', 'health cover'],
  
  NRI_SERVICES: ['nri', 'nri investment', 'nri mutual fund', 'non resident indian', 'nre', 'nro'],
  
  CONTACT: ['contact', 'address', 'phone number', 'email id', 'where are you located', 'location'],
  
  HUMAN_SUPPORT: ['help', 'call me', 'contact me', 'talk to someone', 'human support', 'your team', 'need assistance', 'advisor', 'speak to', 'i want someone to contact me'],
  
  COMMISSION_DISCLOSURE: ['commission', 'disclosure', 'how do you earn', 'brokerage'],
  
  RISK_FACTORS: ['risk factors', 'disclaimer', 'market risks'],
  
  PRIVACY: ['privacy policy', 'my data', 'is my data safe', 'privacy'],
  
  WEBSITE_NAVIGATION: ['home', 'about', 'menu', 'where is'],
  
  GENERAL_ENQUIRY: ['enquiry', 'query', 'question', 'more information'],
  
  ABOUT_BOT: ['who are you', 'what are you', 'what is your name', 'are you a robot', 'what can you do', 'robot', 'chatbot', 'bot', 'how are you', 'how do you do', 'how are u'],
  
  THANKS: ['thanks', 'thank you', 'ok', 'okay', 'cool', 'awesome', 'great', 'good'],
  
  UNKNOWN: []
};

// Helper function to extract all keywords into a flat searchable array for the engine
export const getAllKeywords = (): { intent: ChatbotIntent, keyword: string }[] => {
  const result: { intent: ChatbotIntent, keyword: string }[] = [];
  
  (Object.keys(intentMappings) as ChatbotIntent[]).forEach((intent) => {
    intentMappings[intent].forEach((keyword) => {
      result.push({ intent, keyword: keyword.toLowerCase() });
    });
  });
  
  return result;
};
