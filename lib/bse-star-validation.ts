/**
 * BSE Star Mutual Fund Account Creation - Validation & Types
 * Rigorous frontend & backend validation for applicant KYC, bank & nominee details.
 */

export interface BseStarFileMeta {
  id?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl?: string;
  base64?: string;
}

export interface BseStarNominee {
  name: string; // as per Aadhaar
  aadharLast4: string; // 4 digits
  relation: string;
  dob: string;
  mobile: string;
  mobileBelongsTo: string; // "Nominee Mobile number" | "Spouse Mobile Number" | "Other"
  email: string;
  emailBelongsTo: string; // "Nominee Email ID" | "Spouse Email ID" | "Other"
  address: string;
  percentage: number; // e.g. 100 or 50
}

export interface BseStarAccountOpeningInput {
  // Step 1: Personal Details
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  placeOfBirth: string;
  occupation: string;
  presentAddress: string;
  permanentAddressSameAsPresent: boolean;
  permanentAddress: string;
  maritalStatus: "Single" | "Married" | "Other" | string;
  marriageDate?: string;
  bloodGroup?: string;

  // Step 2: KYC Details & Documents
  isKycDone: "Yes" | "No" | "Don't Know" | string;
  aadharNumber: string;
  panNumber: string;
  aadharFiles?: BseStarFileMeta[];
  panFiles?: BseStarFileMeta[];

  // Step 3: Bank Details & Documents
  bankFiles?: BseStarFileMeta[];
  bankName: string;
  bankBranch: string;
  bankAddress?: string;
  accountNumber: string;
  accountType: "Savings" | "Current" | "Others" | string;
  bankCity: string;
  pinCode: string;
  micrCode?: string;
  ifscCode: string;

  // Step 4: Nominee Details & Client Note
  nomineesCount: 1 | 2 | number;
  nominees: BseStarNominee[];
  clientNote?: string;

  // Step 5: Declarations & Security
  declarationAccepted: boolean;
  turnstileToken?: string;
  website?: string; // Honeypot
}

export interface BseStarValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitized: BseStarAccountOpeningInput;
}

// Regex validation constants
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const AADHAAR_REGEX = /^\d{12}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const PINCODE_REGEX = /^\d{6}$/;
const MICR_REGEX = /^\d{9}$/;
const LAST4_REGEX = /^\d{4}$/;

export function sanitizeText(val: any): string {
  if (typeof val !== "string") return "";
  return val.trim().replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
}

export function sanitizePan(val: any): string {
  if (typeof val !== "string") return "";
  return val.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
}

export function sanitizeIfsc(val: any): string {
  if (typeof val !== "string") return "";
  return val.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11);
}

export function sanitizeDigits(val: any, maxLen?: number): string {
  if (!val) return "";
  const cleaned = String(val).replace(/\D/g, "");
  return maxLen ? cleaned.slice(0, maxLen) : cleaned;
}

/**
 * Validates a specific step or the entire form.
 * @param input The raw input payload
 * @param step Optional step number (1 to 5). If omitted, validates all steps.
 */
export function validateBseStarAccountOpening(
  input: Partial<BseStarAccountOpeningInput>,
  step?: number
): BseStarValidationResult {
  const errors: Record<string, string> = {};

  const sanitized: BseStarAccountOpeningInput = {
    fullName: sanitizeText(input.fullName),
    mobile: sanitizeDigits(input.mobile, 10),
    email: sanitizeText(input.email).toLowerCase(),
    dob: sanitizeText(input.dob),
    placeOfBirth: sanitizeText(input.placeOfBirth),
    occupation: sanitizeText(input.occupation) || "Salaried",
    presentAddress: sanitizeText(input.presentAddress),
    permanentAddressSameAsPresent: Boolean(input.permanentAddressSameAsPresent),
    permanentAddress: sanitizeText(input.permanentAddress),
    maritalStatus: sanitizeText(input.maritalStatus) || "Single",
    marriageDate: sanitizeText(input.marriageDate),
    bloodGroup: sanitizeText(input.bloodGroup),

    isKycDone: sanitizeText(input.isKycDone) || "No",
    aadharNumber: sanitizeDigits(input.aadharNumber, 12),
    panNumber: sanitizePan(input.panNumber),
    aadharFiles: Array.isArray(input.aadharFiles) ? input.aadharFiles : [],
    panFiles: Array.isArray(input.panFiles) ? input.panFiles : [],

    bankFiles: Array.isArray(input.bankFiles) ? input.bankFiles : [],
    bankName: sanitizeText(input.bankName),
    bankBranch: sanitizeText(input.bankBranch),
    bankAddress: sanitizeText(input.bankAddress),
    accountNumber: sanitizeText(input.accountNumber).replace(/\s/g, ""),
    accountType: sanitizeText(input.accountType) || "Savings",
    bankCity: sanitizeText(input.bankCity),
    pinCode: sanitizeDigits(input.pinCode, 6),
    micrCode: sanitizeDigits(input.micrCode, 9),
    ifscCode: sanitizeIfsc(input.ifscCode),

    nomineesCount: Number(input.nomineesCount) === 2 ? 2 : 1,
    nominees: Array.isArray(input.nominees) ? input.nominees : [],
    clientNote: sanitizeText(input.clientNote),

    declarationAccepted: Boolean(input.declarationAccepted),
    turnstileToken: input.turnstileToken,
    website: input.website,
  };

  // If permanent address is marked same as present, auto-fill it
  if (sanitized.permanentAddressSameAsPresent && sanitized.presentAddress) {
    sanitized.permanentAddress = sanitized.presentAddress;
  }

  // -------------------------------------------------------------
  // STEP 1 VALIDATION: Personal Details
  // -------------------------------------------------------------
  if (!step || step === 1) {
    if (!sanitized.fullName || sanitized.fullName.length < 2) {
      errors.fullName = "Please enter your full legal name (as per Aadhaar/PAN).";
    }

    if (!sanitized.mobile || !MOBILE_REGEX.test(sanitized.mobile)) {
      errors.mobile = "Please enter a valid 10-digit Indian mobile number.";
    }

    if (!sanitized.email || !EMAIL_REGEX.test(sanitized.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!sanitized.dob) {
      errors.dob = "Please select your date of birth.";
    } else {
      const parsed = new Date(sanitized.dob);
      if (isNaN(parsed.getTime())) {
        errors.dob = "Please enter a valid date of birth.";
      }
    }

    if (!sanitized.placeOfBirth || sanitized.placeOfBirth.length < 2) {
      errors.placeOfBirth = "Please enter your place of birth (City, State).";
    }

    if (!sanitized.occupation) {
      errors.occupation = "Please select your occupation.";
    }

    if (!sanitized.presentAddress || sanitized.presentAddress.length < 5) {
      errors.presentAddress = "Please provide your present address with city & pincode.";
    }

    if (!sanitized.permanentAddressSameAsPresent && (!sanitized.permanentAddress || sanitized.permanentAddress.length < 5)) {
      errors.permanentAddress = "Please provide your permanent address (or tick 'Same as present address').";
    }

    if (sanitized.maritalStatus === "Married" && !sanitized.marriageDate) {
      // Optional soft notice or require if strictly married
    }
  }

  // -------------------------------------------------------------
  // STEP 2 VALIDATION: KYC & Documents
  // -------------------------------------------------------------
  if (!step || step === 2) {
    if (!sanitized.isKycDone) {
      errors.isKycDone = "Please indicate whether your KYC is completed.";
    }

    if (!sanitized.aadharNumber || !AADHAAR_REGEX.test(sanitized.aadharNumber)) {
      errors.aadharNumber = "Aadhaar number must be exactly 12 digits.";
    }

    if (!sanitized.panNumber || !PAN_REGEX.test(sanitized.panNumber)) {
      errors.panNumber = "Valid 10-character PAN is required (e.g., ABCDE1234F).";
    }
  }

  // -------------------------------------------------------------
  // STEP 3 VALIDATION: Bank Details
  // -------------------------------------------------------------
  if (!step || step === 3) {
    if (!sanitized.bankName || sanitized.bankName.length < 2) {
      errors.bankName = "Bank name is required.";
    }

    if (!sanitized.bankBranch || sanitized.bankBranch.length < 2) {
      errors.bankBranch = "Bank branch name is required.";
    }

    if (!sanitized.accountNumber || sanitized.accountNumber.length < 6 || sanitized.accountNumber.length > 22) {
      errors.accountNumber = "Please enter a valid bank account number (6 to 22 digits).";
    }

    if (!sanitized.bankCity || sanitized.bankCity.length < 2) {
      errors.bankCity = "Bank city is required.";
    }

    if (!sanitized.pinCode || !PINCODE_REGEX.test(sanitized.pinCode)) {
      errors.pinCode = "Please enter a valid 6-digit Bank branch PIN code.";
    }

    if (!sanitized.ifscCode || !IFSC_REGEX.test(sanitized.ifscCode)) {
      errors.ifscCode = "Valid 11-character IFSC code is required (e.g., HDFC0001234).";
    }

    if (sanitized.micrCode && !MICR_REGEX.test(sanitized.micrCode)) {
      errors.micrCode = "MICR code must be exactly 9 numeric digits.";
    }
  }

  // -------------------------------------------------------------
  // STEP 4 VALIDATION: Nominee Details
  // -------------------------------------------------------------
  if (!step || step === 4) {
    const count = sanitized.nomineesCount;
    if (sanitized.nominees.length < count) {
      errors.nominees = `Please complete details for ${count} nominee(s).`;
    }

    let totalPct = 0;
    for (let i = 0; i < count; i++) {
      const nom = sanitized.nominees[i] || ({} as BseStarNominee);
      const prefix = `nominee_${i}`;

      if (!nom.name || nom.name.trim().length < 2) {
        errors[`${prefix}_name`] = `Nominee ${i + 1}: Name as per Aadhaar is required.`;
      }

      const last4 = sanitizeDigits(nom.aadharLast4, 4);
      if (!last4 || !LAST4_REGEX.test(last4)) {
        errors[`${prefix}_aadharLast4`] = `Nominee ${i + 1}: Last 4 digits of Aadhaar are required.`;
      }

      if (!nom.relation || nom.relation.trim().length < 2) {
        errors[`${prefix}_relation`] = `Nominee ${i + 1}: Relationship with applicant is required.`;
      }

      if (!nom.dob) {
        errors[`${prefix}_dob`] = `Nominee ${i + 1}: Date of birth is required.`;
      }

      const nomMobile = sanitizeDigits(nom.mobile, 10);
      if (!nomMobile || !MOBILE_REGEX.test(nomMobile)) {
        errors[`${prefix}_mobile`] = `Nominee ${i + 1}: Valid 10-digit mobile number is required.`;
      }

      if (!nom.mobileBelongsTo) {
        errors[`${prefix}_mobileBelongsTo`] = `Nominee ${i + 1}: Specify whom this mobile number belongs to.`;
      }

      if (!nom.email || !EMAIL_REGEX.test(nom.email)) {
        errors[`${prefix}_email`] = `Nominee ${i + 1}: Valid email address is required.`;
      }

      if (!nom.emailBelongsTo) {
        errors[`${prefix}_emailBelongsTo`] = `Nominee ${i + 1}: Specify whom this email ID belongs to.`;
      }

      if (!nom.address || nom.address.trim().length < 3) {
        errors[`${prefix}_address`] = `Nominee ${i + 1}: Address is required.`;
      }

      const pct = Number(nom.percentage) || (count === 1 ? 100 : 50);
      totalPct += pct;
      if (pct <= 0 || pct > 100) {
        errors[`${prefix}_percentage`] = `Nominee ${i + 1}: Allocation percentage must be between 1% and 100%.`;
      }
    }

    if (totalPct !== 100) {
      errors.nominee_percentage_sum = `Total nominee share must equal exactly 100% (currently ${totalPct}%).`;
    }
  }

  // -------------------------------------------------------------
  // STEP 5 VALIDATION: Consent & Declaration
  // -------------------------------------------------------------
  if (!step || step === 5) {
    if (!sanitized.declarationAccepted) {
      errors.declarationAccepted = "You must confirm that all details are true and agree to the declaration.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}
