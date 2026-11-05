/**
 * Financial Freedom Awareness Program - Participant Validation & Helpers
 * Professional, compliance-ready validation for session attendees.
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

/**
 * Returns today's formatted readable Indian date (e.g. "Friday, 06 November 2026")
 */
export function getFormattedTodayDate(): string {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

/**
 * Returns today's ISO date string (YYYY-MM-DD)
 */
export function getTodayIsoDate(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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
  session_date?: string;
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
    session_date: string;
  };
} {
  const name = String(input.name || "").trim().replace(/\s+/g, " ");
  const email = String(input.email || "").trim().toLowerCase();
  const mobile = normalizeMobile(String(input.mobile || ""));
  const ageRaw = input.age;
  const occupation = String(input.occupation || "").trim() as Occupation;
  const rawInterests = Array.isArray(input.interested_in) ? input.interested_in : [];
  const consent_given = input.consent_given === true;
  const session_date = String(input.session_date || "").trim() || getFormattedTodayDate();

  // 1. Name validation
  if (!name) {
    return { valid: false, field: "name", error: "Please enter your full name." };
  }
  if (name.length < 2 || name.length > 80) {
    return { valid: false, field: "name", error: "Name must be between 2 and 80 characters." };
  }
  if (!/^[a-zA-Z\s.'-]+$/.test(name)) {
    return { valid: false, field: "name", error: "Name can only contain alphabets and basic punctuation." };
  }

  // 2. Email validation
  if (!email) {
    return { valid: false, field: "email", error: "Please enter your email address." };
  }
  if (!isValidEmail(email)) {
    return { valid: false, field: "email", error: "Please enter a valid email address (e.g., name@example.com)." };
  }

  // 3. Mobile validation
  if (!mobile) {
    return { valid: false, field: "mobile", error: "Please enter your 10-digit mobile number." };
  }
  if (!isValidMobile(mobile)) {
    return {
      valid: false,
      field: "mobile",
      error: "Please enter a valid 10-digit Indian mobile number (e.g., 9876543210).",
    };
  }

  // 4. Age validation
  if (ageRaw === undefined || ageRaw === null || ageRaw === "") {
    return { valid: false, field: "age", error: "Please enter your age." };
  }
  const age = typeof ageRaw === "number" ? ageRaw : parseInt(String(ageRaw).trim(), 10);
  if (!isValidAge(age)) {
    return { valid: false, field: "age", error: "Age must be a valid number between 16 and 100." };
  }

  // 5. Occupation validation
  if (!occupation || !OCCUPATION_OPTIONS.includes(occupation)) {
    return {
      valid: false,
      field: "occupation",
      error: "Please select an occupation (Salaried, Business, or Others).",
    };
  }

  // 6. Interests sanitization (Optional)
  const allowedInterests = new Set<string>(INTEREST_OPTIONS);
  const sanitizedInterests = rawInterests
    .map((item) => String(item).trim())
    .filter((item) => allowedInterests.has(item));

  // If "Not Interested" is selected, filter out others to avoid contradictory data
  const finalInterests = sanitizedInterests.includes("Not Interested")
    ? ["Not Interested"]
    : sanitizedInterests;

  // 7. Mandatory consent check
  if (!consent_given) {
    return {
      valid: false,
      field: "consent_given",
      error: "You must provide consent to submit your details for financial insights.",
    };
  }

  return {
    valid: true,
    sanitized: {
      name,
      email,
      mobile,
      age,
      occupation,
      interested_in: finalInterests,
      consent_given: true,
      consent_text: MANDATORY_CONSENT_TEXT,
      session_date,
    },
  };
}
