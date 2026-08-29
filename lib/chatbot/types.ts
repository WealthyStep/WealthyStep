export type ChatbotIntent = 
  | 'GREETING'
  | 'SIP'
  | 'STEP_UP_SIP'
  | 'LUMPSUM'
  | 'SWP'
  | 'RETIREMENT_CALCULATOR'
  | 'EDUCATION_CALCULATOR'
  | 'EMI_CALCULATOR'
  | 'MUTUAL_FUNDS'
  | 'EQUITY_FUNDS'
  | 'DEBT_FUNDS'
  | 'HYBRID_FUNDS'
  | 'KYC'
  | 'NAV'
  | 'MUTUAL_FUND_RISK'
  | 'CALCULATOR_HELP'
  | 'INSURANCE'
  | 'TERM_INSURANCE'
  | 'HEALTH_INSURANCE'
  | 'CORPORATE_INSURANCE'
  | 'NRI_SERVICES'
  | 'CONTACT'
  | 'HUMAN_SUPPORT'
  | 'COMMISSION_DISCLOSURE'
  | 'RISK_FACTORS'
  | 'PRIVACY'
  | 'WEBSITE_NAVIGATION'
  | 'GENERAL_ENQUIRY'
  | 'ABOUT_BOT'
  | 'THANKS'
  | 'UNKNOWN';

export type MessageRole = 'user' | 'bot' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  quickReplies?: string[];
  isLeadFlow?: boolean;
  richCard?: {
    title: string;
    items: string[];
    actionText?: string;
    actionButton?: string;
  };
}

export type LeadServiceOption = 
  | 'Mutual Fund Distribution'
  | 'Insurance'
  | 'Corporate Insurance'
  | 'NRI Services'
  | 'Calculators / Website Help'
  | 'Other';

export interface LeadData {
  name: string;
  phone: string;
  email: string;
  service: LeadServiceOption | '';
  message: string;
}

export type LeadFlowStep = 
  | 'IDLE'
  | 'ASK_NAME'
  | 'ASK_PHONE'
  | 'ASK_EMAIL'
  | 'ASK_SERVICE'
  | 'ASK_MESSAGE'
  | 'REVIEW'
  | 'SUBMITTING'
  | 'SUCCESS'
  | 'ERROR';

export interface KnowledgeBaseEntry {
  id: string;
  intent: ChatbotIntent;
  keywords: string[];
  phrases: string[];
  answer: string;
  quickReplies: string[];
  relatedLinks?: { title: string; url: string }[];
  complianceNote?: string;
  richCard?: {
    title: string;
    items: string[];
    actionText?: string;
    actionButton?: string;
  };
}
