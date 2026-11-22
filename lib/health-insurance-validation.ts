/**
 * Validation and Type Definitions for Health Insurance - Personal Details Form
 * Wealthy Step™ - AMFI Registered Mutual Fund & SIF Distributor | Insurance Advisory
 */

export interface InsuredMember {
  id: string;
  role: "Adult 1 (Self)" | "Adult 2" | "Kid 1" | "Kid 2" | "Kid 3" | "Kid 4";
  relation: string;
  fullName: string;
  dob: string;
  gender: "Male" | "Female" | "Other" | "";
  height: string; // e.g. "172 cm" or "5 ft 8 in"
  weight: string; // e.g. "68 kg"
}

export interface HealthInsuranceProposalInput {
  // Step 1: Proposer Details (Tax 80D Certificate Holder)
  proposerName: string;
  proposerPan: string;
  proposerDob: string;
  proposerAadhar?: string;
  proposerMobile: string;
  proposerAddress: string;
  proposerEmail: string;
  employmentStatus: "Salaried Employee (PF credit)" | "Businessman" | "Student" | "Home maker" | "Others" | "";
  corporateEmail?: string;
  policyType: "New Policy" | "Port policy" | "Don't know" | "";

  // Step 2: Covered Members
  adultsCount: number; // 0, 1, 2, 3, 4
  kidsCount: number; // 0, 1, 2, 3, 4
  relationAdult2?: string;
  relationKids?: string;
  members: InsuredMember[];
  insuredEmail: string;
  insuredMobile: string;

  // Step 3: Medical & Lifestyle History
  hasPreExistingIllness: boolean;
  preExistingDetails?: string;
  hasTobaccoAlcoholHabits: boolean;
  habitsDetails?: string;
  currentAddress: string;
  sameAsProposerAddress?: boolean;

  // Step 4: Nominee & Banking Details
  nomineeName: string;
  nomineeDob: string;
  nomineeRelation?: string;
  nomineeAddressOption: "Same as Insured person address" | "Same as Proposer person address" | "Address is different than proposer and insured person";
  nomineeCustomAddress?: string;
  nomineeMobile: string;
  nomineeEmail: string;
  nomineeBankName?: string;
  nomineeBankAccountName?: string;
  nomineeBankIfsc?: string;
  nomineeBankAccountNumber?: string;
  nomineeBankAccountType?: "Savings" | "Current" | "Others" | "";

  // Step 5: Declarations
  consentContactAccepted: boolean;
  consentDisclosureAccepted: boolean;

  // Bot & Security
  website?: string; // Honeypot
  turnstileToken?: string;
}

export interface ProposalValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitized: Record<string, any>;
}

// Validation Regex Helpers
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const AADHAAR_REGEX = /^\d{12}$/;

export function normalizeMobile(mobile: string): string {
  if (!mobile) return "";
  let digits = mobile.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits;
}

export function normalizePan(pan: string): string {
  return (pan || "").trim().toUpperCase();
}

export function normalizeIfsc(ifsc: string): string {
  return (ifsc || "").trim().toUpperCase();
}

/**
 * Validates step-by-step or full health insurance proposal input
 */
export function validateHealthInsuranceProposal(
  input: Partial<HealthInsuranceProposalInput>,
  currentStep?: number
): ProposalValidationResult {
  const errors: Record<string, string> = {};
  const sanitized: Record<string, any> = {};

  // Step 1 Validations
  if (!currentStep || currentStep === 1) {
    // Proposer Name
    const name = (input.proposerName || "").trim();
    if (!name) {
      errors.proposerName = "Proposer Name (as per Aadhaar) is required.";
    } else if (name.length < 2) {
      errors.proposerName = "Please enter a valid full name (minimum 2 characters).";
    }
    sanitized.proposerName = name;

    // Proposer PAN
    const pan = normalizePan(input.proposerPan || "");
    if (!pan) {
      errors.proposerPan = "Proposer PAN Number is required for KYC.";
    } else if (!PAN_REGEX.test(pan)) {
      errors.proposerPan = "Please enter a valid 10-character PAN (e.g. ABCDE1234F).";
    }
    sanitized.proposerPan = pan;

    // Proposer DOB
    const dob = (input.proposerDob || "").trim();
    if (!dob) {
      errors.proposerDob = "Proposer Date of Birth is required.";
    } else {
      const parsedDate = new Date(dob);
      if (isNaN(parsedDate.getTime())) {
        errors.proposerDob = "Please select a valid date of birth.";
      }
    }
    sanitized.proposerDob = dob;

    // Proposer Aadhaar (Optional but checked if provided)
    const aadharDigits = (input.proposerAadhar || "").replace(/\D/g, "").slice(0, 12);
    if (aadharDigits && aadharDigits.length !== 12) {
      errors.proposerAadhar = "Aadhaar number must be exactly 12 digits (or leave blank).";
    }
    sanitized.proposerAadhar = aadharDigits || "";

    // Proposer Mobile
    const mobile = normalizeMobile(input.proposerMobile || "");
    if (!mobile) {
      errors.proposerMobile = "Proposer Mobile Number is required.";
    } else if (!INDIAN_MOBILE_REGEX.test(mobile)) {
      errors.proposerMobile = "Please enter a valid 10-digit Indian mobile number.";
    }
    sanitized.proposerMobile = mobile;

    // Proposer Email
    const email = (input.proposerEmail || "").trim().toLowerCase();
    if (!email) {
      errors.proposerEmail = "Proposer Email ID is required.";
    } else if (!EMAIL_REGEX.test(email)) {
      errors.proposerEmail = "Please enter a valid email address.";
    }
    sanitized.proposerEmail = email;

    // Proposer Address
    const address = (input.proposerAddress || "").trim();
    if (!address) {
      errors.proposerAddress = "Proposer residential address is required.";
    } else if (address.length < 5) {
      errors.proposerAddress = "Please provide complete street address with city/pincode.";
    }
    sanitized.proposerAddress = address;

    // Employment Status
    const employment = input.employmentStatus || "";
    if (!employment) {
      errors.employmentStatus = "Please select your employment status.";
    }
    sanitized.employmentStatus = employment;

    // Corporate Email
    const corpEmail = (input.corporateEmail || "").trim().toLowerCase();
    if (corpEmail && !EMAIL_REGEX.test(corpEmail)) {
      errors.corporateEmail = "Please enter a valid corporate email address.";
    }
    sanitized.corporateEmail = corpEmail;

    // Policy Type
    const policyType = input.policyType || "";
    if (!policyType) {
      errors.policyType = "Please select policy type.";
    }
    sanitized.policyType = policyType;
  }

  // Step 2 Validations
  if (!currentStep || currentStep === 2) {
    const adults = typeof input.adultsCount === "number" ? input.adultsCount : 1;
    const kids = typeof input.kidsCount === "number" ? input.kidsCount : 0;

    if (adults < 0 || adults > 4) {
      errors.adultsCount = "Adult count must be between 0 and 4.";
    }
    if (kids < 0 || kids > 4) {
      errors.kidsCount = "Kids count must be between 0 and 4.";
    }
    if (adults === 0 && kids === 0) {
      errors.adultsCount = "At least 1 person (adult or child) must be insured.";
    }

    sanitized.adultsCount = adults;
    sanitized.kidsCount = kids;
    sanitized.relationAdult2 = (input.relationAdult2 || "").trim();
    sanitized.relationKids = (input.relationKids || "").trim();

    // Insured contact details
    const insEmail = (input.insuredEmail || "").trim().toLowerCase();
    if (!insEmail) {
      errors.insuredEmail = "Primary Insured person Email ID is required.";
    } else if (!EMAIL_REGEX.test(insEmail)) {
      errors.insuredEmail = "Please enter a valid email address.";
    }
    sanitized.insuredEmail = insEmail;

    const insMobile = normalizeMobile(input.insuredMobile || "");
    if (!insMobile) {
      errors.insuredMobile = "Primary Insured person Mobile Number is required.";
    } else if (!INDIAN_MOBILE_REGEX.test(insMobile)) {
      errors.insuredMobile = "Please enter a valid 10-digit Indian mobile number.";
    }
    sanitized.insuredMobile = insMobile;

    // Members validation
    const membersList = Array.isArray(input.members) ? input.members : [];
    sanitized.members = membersList.map((m) => {
      let rel = (m.relation || "").trim();
      if (m.role === "Adult 1 (Self)") {
        rel = "Self";
      } else if (m.role?.startsWith("Kid")) {
        if (!rel || rel === "Both (Son & Daughter)") {
          if (m.gender === "Female") {
            rel = "Daughter";
          } else if (m.gender === "Male") {
            rel = "Son";
          }
        }
      }
      return {
        id: m.id || `member-${Math.random().toString(36).substring(2, 9)}`,
        role: m.role,
        relation: rel,
        fullName: (m.fullName || "").trim(),
        dob: (m.dob || "").trim(),
        gender: m.gender || "",
        height: (m.height || "").trim(),
        weight: (m.weight || "").trim(),
      };
    });

    // Check and validate all covered family members (Adults & Kids) as mandatory
    sanitized.members.forEach((m: InsuredMember, idx: number) => {
      const roleName = m.role || (m.relation ? `${m.relation}` : `Member #${idx + 1}`);

      if (!m.fullName || m.fullName.trim().length < 2) {
        if (idx === 0 && input.proposerName && input.proposerName.trim().length >= 2) {
          m.fullName = input.proposerName.trim();
        } else {
          errors[`member_${idx}_fullName`] = `Full name is required for ${roleName}.`;
        }
      }

      if (!m.dob || !m.dob.trim()) {
        if (idx === 0 && input.proposerDob) {
          m.dob = input.proposerDob;
        } else {
          errors[`member_${idx}_dob`] = `Date of birth is required for ${roleName}.`;
        }
      }

      if (!m.gender) {
        if (idx === 0) {
          m.gender = "Male";
        } else {
          errors[`member_${idx}_gender`] = `Gender is required for ${roleName}.`;
        }
      }

      if (!m.height || !m.height.trim()) {
        errors[`member_${idx}_height`] = `Height is required for ${roleName}.`;
      }

      if (!m.weight || !m.weight.trim()) {
        errors[`member_${idx}_weight`] = `Weight is required for ${roleName}.`;
      }
    });
  }

  // Step 3 Validations
  if (!currentStep || currentStep === 3) {
    sanitized.hasPreExistingIllness = Boolean(input.hasPreExistingIllness);
    sanitized.preExistingDetails = (input.preExistingDetails || "").trim();
    if (sanitized.hasPreExistingIllness && !sanitized.preExistingDetails) {
      errors.preExistingDetails = "Please specify your pre-existing conditions and duration.";
    }

    sanitized.hasTobaccoAlcoholHabits = Boolean(input.hasTobaccoAlcoholHabits);
    sanitized.habitsDetails = (input.habitsDetails || "").trim();

    const currentAddr = (input.currentAddress || "").trim();
    if (!currentAddr) {
      errors.currentAddress = "Current address with pincode is required.";
    } else if (currentAddr.length < 5) {
      errors.currentAddress = "Please enter a complete address with 6-digit pincode.";
    }
    sanitized.currentAddress = currentAddr;
    sanitized.sameAsProposerAddress = Boolean(input.sameAsProposerAddress);
  }

  // Step 4 Validations
  if (!currentStep || currentStep === 4) {
    const nomName = (input.nomineeName || "").trim();
    if (!nomName) {
      errors.nomineeName = "Nominee Full Name is required.";
    }
    sanitized.nomineeName = nomName;

    const nomDob = (input.nomineeDob || "").trim();
    if (!nomDob) {
      errors.nomineeDob = "Nominee Date of Birth is required.";
    }
    sanitized.nomineeDob = nomDob;

    sanitized.nomineeRelation = (input.nomineeRelation || "").trim();
    sanitized.nomineeAddressOption = input.nomineeAddressOption || "Same as Proposer person address";
    sanitized.nomineeCustomAddress = (input.nomineeCustomAddress || "").trim();

    if (
      sanitized.nomineeAddressOption === "Address is different than proposer and insured person" &&
      !sanitized.nomineeCustomAddress
    ) {
      errors.nomineeCustomAddress = "Please provide nominee's residential address.";
    }

    const nomMobile = normalizeMobile(input.nomineeMobile || "");
    if (!nomMobile) {
      errors.nomineeMobile = "Nominee Mobile Number is required.";
    } else if (!INDIAN_MOBILE_REGEX.test(nomMobile)) {
      errors.nomineeMobile = "Please enter a valid 10-digit mobile number.";
    }
    sanitized.nomineeMobile = nomMobile;

    const nomEmail = (input.nomineeEmail || "").trim().toLowerCase();
    if (!nomEmail) {
      errors.nomineeEmail = "Nominee Email ID is required.";
    } else if (!EMAIL_REGEX.test(nomEmail)) {
      errors.nomineeEmail = "Please enter a valid email address.";
    }
    sanitized.nomineeEmail = nomEmail;

    // Nominee Bank details (Optional - not mandatory for proposal intake)
    const bankName = (input.nomineeBankName || "").trim();
    sanitized.nomineeBankName = bankName;

    const nameInBank = (input.nomineeBankAccountName || "").trim();
    sanitized.nomineeBankAccountName = nameInBank;

    const ifsc = normalizeIfsc(input.nomineeBankIfsc || "");
    if (ifsc && !IFSC_REGEX.test(ifsc)) {
      errors.nomineeBankIfsc = "Please enter a valid 11-character Indian IFSC code (e.g. HDFC0001234).";
    }
    sanitized.nomineeBankIfsc = ifsc;

    const accNum = (input.nomineeBankAccountNumber || "").replace(/\s/g, "");
    if (accNum && !/^\d{9,18}$/.test(accNum)) {
      errors.nomineeBankAccountNumber = "Please enter a valid bank account number (9 to 18 digits).";
    }
    sanitized.nomineeBankAccountNumber = accNum;

    const accType = input.nomineeBankAccountType || "Savings";
    sanitized.nomineeBankAccountType = accType;
  }

  // Step 5 Validations (Consent & Declarations)
  if (!currentStep || currentStep === 5) {
    if (!input.consentContactAccepted) {
      errors.consentContactAccepted = "You must accept the contact and confidentiality consent to proceed.";
    }
    if (!input.consentDisclosureAccepted) {
      errors.consentDisclosureAccepted = "You must accept the mandatory medical disclosure declaration.";
    }
    sanitized.consentContactAccepted = Boolean(input.consentContactAccepted);
    sanitized.consentDisclosureAccepted = Boolean(input.consentDisclosureAccepted);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}

