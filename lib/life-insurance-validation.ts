/**
 * Life & Term Insurance Proposal - Validation & Types
 * Rigorous frontend & backend validation for applicant, employment, medical disclosures & documents.
 */

export interface LifeInsuranceFileMeta {
  id?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileKey?: string;
  fileUrl?: string;
  base64?: string;
}

export interface LifeInsuranceProposalInput {
  // Step 1: Insured Person Details
  fullName: string;
  proposerEmail: string;
  proposerMobile: string;
  maritalStatus: "Single" | "Married" | "Other" | string;
  dob: string;
  qualification: string;
  height: string; // e.g. "5 ft 10 in"
  weight: number | string; // in Kgs
  motherFullName: string;
  fatherFullName: string;
  employmentType: "Salaried Employee" | "Businessman" | string;
  hasExistingPolicies: boolean;
  existingCoverage: string; // "0" or coverage amount in Lakhs/INR
  currentAddress: string;

  // Step 2: Employment & Income Details
  companyName: string;
  designation: string;
  companyEmail: string;
  industry: string;
  annualIncome: string;

  // Step 3: Health Conditions & Habits
  hasPreExistingIllness: boolean;
  preExistingDetails?: string;
  isSmoker: boolean;
  isDrinker: boolean;
  chewsTobacco: boolean;

  // Step 4: Nominee Details & Nominee Bank Details
  nomineeName: string;
  isNomineeMinor: boolean;
  nomineeRelation: string;
  nomineeDob: string;
  nomineeAddressOption: "Same as Insured person address" | "Same as Proposer person address" | "Address is different than insured person" | string;
  nomineeCustomAddress?: string;
  nomineeAddress: string;
  nomineeMobile: string;
  nomineeEmail: string;
  nomineeBankName: string;
  nomineeBankAccountName: string;
  nomineeBankIfsc: string;
  nomineeBankAccountNumber: string;
  nomineeBankAccountType: "Savings" | "Current" | string;

  // Step 5: Document Uploads & Proposer Bank Details
  aadharNumber: string;
  panNumber: string;
  proposerBankName: string;
  proposerBankAccountNumber: string;
  proposerBankIfsc: string;
  proposerBankBranch: string;
  proposerBankAccountName: string;

  aadharFiles?: LifeInsuranceFileMeta[];
  panFiles?: LifeInsuranceFileMeta[];
  selfieFiles?: LifeInsuranceFileMeta[];
  chequeFiles?: LifeInsuranceFileMeta[];
  companyIdFiles?: LifeInsuranceFileMeta[];
  payslipFiles?: LifeInsuranceFileMeta[];
  otherFiles?: LifeInsuranceFileMeta[];
  clientNotes?: string;

  // Step 6: Consents & Verification
  consentContactAccepted: boolean;
  consentDisclosureAccepted: boolean;
  turnstileToken?: string;
  website?: string; // Honeypot
}

export interface LifeInsuranceValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitized: LifeInsuranceProposalInput;
}

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const AADHAAR_REGEX = /^\d{12}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

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

export function sanitizeMobile(val: any): string {
  if (!val) return "";
  let digits = String(val).replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
}

export function validateLifeInsuranceProposal(
  input: Partial<LifeInsuranceProposalInput>,
  step?: number
): LifeInsuranceValidationResult {
  const errors: Record<string, string> = {};

  const sanitized: LifeInsuranceProposalInput = {
    fullName: sanitizeText(input.fullName),
    proposerEmail: sanitizeText(input.proposerEmail).toLowerCase(),
    proposerMobile: sanitizeMobile(input.proposerMobile),
    maritalStatus: sanitizeText(input.maritalStatus) || "Single",
    dob: sanitizeText(input.dob),
    qualification: sanitizeText(input.qualification) || "Graduate",
    height: sanitizeText(input.height),
    weight: Number(input.weight) || 0,
    motherFullName: sanitizeText(input.motherFullName),
    fatherFullName: sanitizeText(input.fatherFullName),
    employmentType: sanitizeText(input.employmentType) || "Salaried Employee",
    hasExistingPolicies: Boolean(input.hasExistingPolicies),
    existingCoverage: sanitizeText(input.existingCoverage) || "0",
    currentAddress: sanitizeText(input.currentAddress),

    companyName: sanitizeText(input.companyName),
    designation: sanitizeText(input.designation),
    companyEmail: sanitizeText(input.companyEmail).toLowerCase(),
    industry: sanitizeText(input.industry),
    annualIncome: sanitizeText(input.annualIncome),

    hasPreExistingIllness: Boolean(input.hasPreExistingIllness),
    preExistingDetails: sanitizeText(input.preExistingDetails),
    isSmoker: Boolean(input.isSmoker),
    isDrinker: Boolean(input.isDrinker),
    chewsTobacco: Boolean(input.chewsTobacco),

    nomineeName: sanitizeText(input.nomineeName),
    isNomineeMinor: Boolean(input.isNomineeMinor),
    nomineeRelation: sanitizeText(input.nomineeRelation) || "Spouse",
    nomineeDob: sanitizeText(input.nomineeDob),
    nomineeAddressOption: sanitizeText(input.nomineeAddressOption) || "Same as Insured person address",
    nomineeCustomAddress: sanitizeText(input.nomineeCustomAddress),
    nomineeAddress: sanitizeText(input.nomineeAddress),
    nomineeMobile: sanitizeMobile(input.nomineeMobile),
    nomineeEmail: sanitizeText(input.nomineeEmail).toLowerCase(),
    nomineeBankName: sanitizeText(input.nomineeBankName),
    nomineeBankAccountName: sanitizeText(input.nomineeBankAccountName),
    nomineeBankIfsc: sanitizeIfsc(input.nomineeBankIfsc),
    nomineeBankAccountNumber: sanitizeText(input.nomineeBankAccountNumber).replace(/\s/g, ""),
    nomineeBankAccountType: sanitizeText(input.nomineeBankAccountType) || "Savings",

    aadharNumber: sanitizeDigits(input.aadharNumber, 12),
    panNumber: sanitizePan(input.panNumber),
    proposerBankName: sanitizeText(input.proposerBankName),
    proposerBankAccountNumber: sanitizeText(input.proposerBankAccountNumber).replace(/\s/g, ""),
    proposerBankIfsc: sanitizeIfsc(input.proposerBankIfsc),
    proposerBankBranch: sanitizeText(input.proposerBankBranch),
    proposerBankAccountName: sanitizeText(input.proposerBankAccountName),

    aadharFiles: Array.isArray(input.aadharFiles) ? input.aadharFiles : [],
    panFiles: Array.isArray(input.panFiles) ? input.panFiles : [],
    selfieFiles: Array.isArray(input.selfieFiles) ? input.selfieFiles : [],
    chequeFiles: Array.isArray(input.chequeFiles) ? input.chequeFiles : [],
    companyIdFiles: Array.isArray(input.companyIdFiles) ? input.companyIdFiles : [],
    payslipFiles: Array.isArray(input.payslipFiles) ? input.payslipFiles : [],
    otherFiles: Array.isArray(input.otherFiles) ? input.otherFiles : [],
    clientNotes: sanitizeText(input.clientNotes),

    consentContactAccepted: Boolean(input.consentContactAccepted),
    consentDisclosureAccepted: Boolean(input.consentDisclosureAccepted),
    turnstileToken: input.turnstileToken,
    website: input.website,
  };

  // Resolve nominee address
  if (sanitized.nomineeAddressOption === "Same as Insured person address" || sanitized.nomineeAddressOption === "Same as Proposer person address") {
    sanitized.nomineeAddress = sanitized.currentAddress;
  } else if (sanitized.nomineeCustomAddress) {
    sanitized.nomineeAddress = sanitized.nomineeCustomAddress;
  }

  // -------------------------------------------------------------
  // STEP 1 VALIDATION: Insured Person Details
  // -------------------------------------------------------------
  if (!step || step === 1) {
    if (!sanitized.fullName || sanitized.fullName.length < 2) {
      errors.fullName = "Please enter your full legal name as per Aadhaar.";
    }

    if (!sanitized.proposerEmail || !EMAIL_REGEX.test(sanitized.proposerEmail)) {
      errors.proposerEmail = "Please enter a valid proposer email ID.";
    }

    if (!sanitized.proposerMobile || !MOBILE_REGEX.test(sanitized.proposerMobile)) {
      errors.proposerMobile = "Please enter a valid 10-digit Indian mobile number.";
    }

    if (!sanitized.dob) {
      errors.dob = "Please select your date of birth.";
    }

    if (!sanitized.qualification) {
      errors.qualification = "Please select your educational qualification.";
    }

    if (!sanitized.height || sanitized.height.length < 2) {
      errors.height = "Please enter your height in Feet and Inches (e.g. 5 ft 10 in).";
    }

    if (!sanitized.weight || Number(sanitized.weight) < 25 || Number(sanitized.weight) > 250) {
      errors.weight = "Please enter a valid weight in Kilograms (e.g. 68).";
    }

    if (!sanitized.motherFullName || sanitized.motherFullName.length < 2) {
      errors.motherFullName = "Please enter your mother's full name.";
    }

    if (!sanitized.fatherFullName || sanitized.fatherFullName.length < 2) {
      errors.fatherFullName = "Please enter your father's full name.";
    }

    if (!sanitized.currentAddress || sanitized.currentAddress.length < 5) {
      errors.currentAddress = "Please provide your current address with city and PIN code.";
    }

    if (sanitized.hasExistingPolicies && (!sanitized.existingCoverage || sanitized.existingCoverage === "0")) {
      errors.existingCoverage = "Please specify the total sum assured of your existing life policies (e.g. 50 Lakhs).";
    }
  }

  // -------------------------------------------------------------
  // STEP 2 VALIDATION: Employment & Income Details
  // -------------------------------------------------------------
  if (!step || step === 2) {
    if (!sanitized.companyName || sanitized.companyName.length < 2) {
      errors.companyName = "Company or business name is required.";
    }

    if (!sanitized.designation || sanitized.designation.length < 2) {
      errors.designation = "Your designation or role is required.";
    }

    if (!sanitized.companyEmail || !EMAIL_REGEX.test(sanitized.companyEmail)) {
      errors.companyEmail = "Valid official / company email ID is required for corporate discount.";
    }

    if (!sanitized.industry || sanitized.industry.length < 2) {
      errors.industry = "Industry sector is required.";
    }

    if (!sanitized.annualIncome || sanitized.annualIncome.length < 1) {
      errors.annualIncome = "Please enter your annual income (as per ITR or Form 16).";
    }
  }

  // -------------------------------------------------------------
  // STEP 3 VALIDATION: Health Conditions & Habits
  // -------------------------------------------------------------
  if (!step || step === 3) {
    if (sanitized.hasPreExistingIllness && (!sanitized.preExistingDetails || sanitized.preExistingDetails.length < 3)) {
      errors.preExistingDetails = "Please specify the details and duration of your pre-existing health condition or surgeries.";
    }
  }

  // -------------------------------------------------------------
  // STEP 4 VALIDATION: Nominee Details & Nominee Bank
  // -------------------------------------------------------------
  if (!step || step === 4) {
    if (!sanitized.nomineeName || sanitized.nomineeName.length < 2) {
      errors.nomineeName = "Nominee full name is required.";
    }

    if (!sanitized.nomineeRelation) {
      errors.nomineeRelation = "Relationship with nominee is required.";
    }

    if (!sanitized.nomineeDob) {
      errors.nomineeDob = "Nominee date of birth is required.";
    }

    if (sanitized.nomineeAddressOption === "Address is different than insured person" && (!sanitized.nomineeCustomAddress || sanitized.nomineeCustomAddress.length < 5)) {
      errors.nomineeCustomAddress = "Please enter the nominee's full address with pincode.";
    }

    if (!sanitized.nomineeMobile || !MOBILE_REGEX.test(sanitized.nomineeMobile)) {
      errors.nomineeMobile = "Valid 10-digit mobile number is required for nominee.";
    }

    if (!sanitized.nomineeEmail || !EMAIL_REGEX.test(sanitized.nomineeEmail)) {
      errors.nomineeEmail = "Valid email ID is required for nominee.";
    }

    if (!sanitized.nomineeBankName || sanitized.nomineeBankName.length < 2) {
      errors.nomineeBankName = "Nominee bank name is required.";
    }

    if (!sanitized.nomineeBankAccountName || sanitized.nomineeBankAccountName.length < 2) {
      errors.nomineeBankAccountName = "Name as per nominee bank account is required.";
    }

    if (!sanitized.nomineeBankIfsc || !IFSC_REGEX.test(sanitized.nomineeBankIfsc)) {
      errors.nomineeBankIfsc = "Valid 11-character IFSC code is required for nominee bank (e.g. HDFC0001234).";
    }

    if (!sanitized.nomineeBankAccountNumber || sanitized.nomineeBankAccountNumber.length < 6) {
      errors.nomineeBankAccountNumber = "Valid nominee bank account number is required.";
    }
  }

  // -------------------------------------------------------------
  // STEP 5 VALIDATION: Document Details & Proposer Bank
  // -------------------------------------------------------------
  if (!step || step === 5) {
    if (!sanitized.aadharNumber || !AADHAAR_REGEX.test(sanitized.aadharNumber)) {
      errors.aadharNumber = "Aadhaar number must be exactly 12 digits.";
    }

    if (!sanitized.panNumber || !PAN_REGEX.test(sanitized.panNumber)) {
      errors.panNumber = "Valid 10-character PAN is required (e.g. ABCDE1234F).";
    }

    if (!sanitized.proposerBankName || sanitized.proposerBankName.length < 2) {
      errors.proposerBankName = "Proposer bank name is required.";
    }

    if (!sanitized.proposerBankAccountNumber || sanitized.proposerBankAccountNumber.length < 6) {
      errors.proposerBankAccountNumber = "Proposer bank account number is required.";
    }

    if (!sanitized.proposerBankIfsc || !IFSC_REGEX.test(sanitized.proposerBankIfsc)) {
      errors.proposerBankIfsc = "Valid 11-character IFSC code is required (e.g. SBIN0001234).";
    }

    if (!sanitized.proposerBankBranch || sanitized.proposerBankBranch.length < 2) {
      errors.proposerBankBranch = "Proposer bank branch name is required.";
    }

    if (!sanitized.proposerBankAccountName || sanitized.proposerBankAccountName.length < 2) {
      errors.proposerBankAccountName = "Account holder name as per bank records is required.";
    }
  }

  // -------------------------------------------------------------
  // STEP 6 VALIDATION: Declarations
  // -------------------------------------------------------------
  if (!step || step === 6) {
    if (!sanitized.consentContactAccepted) {
      errors.consentContactAccepted = "You must accept the contact and data processing consent to proceed.";
    }

    if (!sanitized.consentDisclosureAccepted) {
      errors.consentDisclosureAccepted = "You must acknowledge that incorrect or undisclosed information can lead to policy cancellation.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}
