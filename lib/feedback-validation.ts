/**
 * Financial Freedom Awareness Program - Participant Validation & Helpers
 */

export const OCCUPATION_OPTIONS = ["Salaried", "Business", "Others"] as const;
export type Occupation = (typeof OCCUPATION_OPTIONS)[number];

export const INTEREST_OPTIONS = [
  "Retirement",
  "Insurance Planning (Health, Life)",
  "Child Education",
  "House Purchase",
  "Other Goals",
  "Not Interested",
] as const;
export type InterestOption = (typeof INTEREST_OPTIONS)[number];

export const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "Interested",
  "Not Interested",
  "Call Evening",
  "Call Tomorrow",
  "Call Weekend",
  "Follow Up",
  "Converted",
  "Closed",
] as const;
export type ParticipantStatus = (typeof STATUS_OPTIONS)[number];

export const MANDATORY_CONSENT_TEXT =
  "I hereby provide my consent to Wealthy Step™ to collect, store, and use my personal information for the purpose of financial planning, insurance advisory, and investment-related services. I understand that the information shared by me will be kept confidential and will not be disclosed to third parties without my consent, except as required for service delivery or as per applicable regulations.";

export function normalizeMobile(raw: string): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const clean = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(clean) && clean.length <= 254;
}

export function isValidMobile(mobile: string): boolean {
  if (!mobile || typeof mobile !== "string") return false;
  const normalized = normalizeMobile(mobile);
  // Standard Indian 10-digit mobile number starting with 6, 7, 8, or 9
  return /^[6-9]\d{9}$/.test(normalized);
}

export function isValidAge(age: any): boolean {
  const num = typeof age === "number" ? age : parseInt(String(age).trim(), 10);
  return Number.isInteger(num) && num >= 16 && num <= 100;
}

export interface ParticipantInput {
  name?: string;
  email?: string;
  mobile?: string;
  age?: number | string;
  occupation?: string;
  interested_in?: string[];
  consent_given?: boolean;
}

export function validateParticipantInput(input: ParticipantInput): {
  valid: boolean;
  error?: string;
  field?: string;
  sanitized?: {
    name: string;
    email: string;
    mobile: string;
    age: number;
    occupation: Occupation;
    interested_in: string[];
    consent_given: boolean;
    consent_text: string;
  };
} {
  const name = String(input.name || "").trim();
  const email = String(input.email || "").trim().toLowerCase();
  const mobileRaw = String(input.mobile || "").trim();
  const mobile = normalizeMobile(mobileRaw);
  const ageNum = parseInt(String(input.age || "").trim(), 10);
  const occupation = String(input.occupation || "").trim();
  const rawInterests = Array.isArray(input.interested_in) ? input.interested_in : [];
  const consent_given = input.consent_given === true;

  // Name validation
  if (!name || name.length < 2) {
    return { valid: false, field: "name", error: "Please enter your full name (minimum 2 characters)." };
  }
  if (name.length > 100) {
    return { valid: false, field: "name", error: "Name is too long (maximum 100 characters)." };
  }
  if (!/^[a-zA-Z\s.'-]+$/.test(name)) {
    return { valid: false, field: "name", error: "Name should only contain letters, spaces, and standard punctuation." };
  }

  // Email validation
  if (!email) {
    return { valid: false, field: "email", error: "Please enter your email address." };
  }
  if (!isValidEmail(email)) {
    return { valid: false, field: "email", error: "Please enter a valid email address (e.g., name@example.com)." };
  }

  // Mobile validation
  if (!mobileRaw) {
    return { valid: false, field: "mobile", error: "Please enter your 10-digit mobile number." };
  }
  if (!isValidMobile(mobile)) {
    return { valid: false, field: "mobile", error: "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9." };
  }

  // Age validation
  if (!isValidAge(ageNum)) {
    return { valid: false, field: "age", error: "Please enter a valid age between 16 and 100." };
  }

  // Occupation validation
  if (!occupation || !OCCUPATION_OPTIONS.includes(occupation as Occupation)) {
    return { valid: false, field: "occupation", error: "Please select an occupation (Salaried, Business, or Others)." };
  }

  // Interests sanitization
  const validInterests = rawInterests
    .map((item) => String(item).trim())
    .filter((item) => (INTEREST_OPTIONS as readonly string[]).includes(item));

  // Consent validation
  if (!consent_given) {
    return { valid: false, field: "consent_given", error: "Please provide your consent by ticking the agreement checkbox." };
  }

  return {
    valid: true,
    sanitized: {
      name,
      email,
      mobile,
      age: ageNum,
      occupation: occupation as Occupation,
      interested_in: validInterests,
      consent_given: true,
      consent_text: MANDATORY_CONSENT_TEXT,
    },
  };
}
