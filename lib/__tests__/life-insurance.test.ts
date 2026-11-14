import { describe, it, expect } from "vitest";
import {
  validateLifeInsuranceProposal,
  sanitizePan,
  sanitizeIfsc,
  sanitizeDigits,
  sanitizeMobile,
} from "../life-insurance-validation";

describe("Life & Term Insurance Proposal Validation Suite", () => {
  const validPayload = {
    // Step 1: Insured Person Details
    fullName: "Siva Prasad Goram",
    proposerEmail: "mrsivagoram@gmail.com",
    proposerMobile: "9988776655",
    maritalStatus: "Single" as const,
    dob: "1994-05-12",
    qualification: "Post Graduate (MBA Finance)",
    height: "5 ft 10 in",
    weight: 72,
    motherFullName: "Lakshmi Devi Goram",
    fatherFullName: "Venkata Ramaiah Goram",
    employmentType: "Salaried Employee" as const,
    hasExistingPolicies: false,
    existingCoverage: "0",
    currentAddress: "Flat 402, Green Towers, Madhapur, Hyderabad - 500081",

    // Step 2: Employment Details
    companyName: "Wealthy Step Advisory LLP",
    designation: "Senior Investment Specialist",
    companyEmail: "siva@wealthystep.com",
    industry: "Financial Services & Advisory",
    annualIncome: "12 - 15 Lakhs",

    // Step 3: Health Conditions
    hasPreExistingIllness: false,
    preExistingDetails: "",
    isSmoker: false,
    isDrinker: false,
    chewsTobacco: false,

    // Step 4: Nominee Details
    nomineeName: "Lakshmi Devi Goram",
    isNomineeMinor: false,
    nomineeRelation: "Mother",
    nomineeDob: "1968-08-10",
    nomineeAddressOption: "Same as Insured person address" as const,
    nomineeCustomAddress: "",
    nomineeMobile: "9876543210",
    nomineeEmail: "lakshmi@gmail.com",
    nomineeBankName: "State Bank of India",
    nomineeBankAccountName: "Lakshmi Devi Goram",
    nomineeBankIfsc: "SBIN0001234",
    nomineeBankAccountNumber: "20198834567",
    nomineeBankAccountType: "Savings" as const,

    // Step 5: Documents & Proposer Bank Details
    aadharNumber: "123456789012",
    panNumber: "DSOPG9342A",
    proposerBankName: "HDFC Bank",
    proposerBankAccountNumber: "50100456789012",
    proposerBankIfsc: "HDFC0001234",
    proposerBankBranch: "Madhapur",
    proposerBankAccountName: "Siva Prasad Goram",
    clientNotes: "Looking for 1 Crore term coverage with critical illness rider.",

    // Step 6: Declarations
    consentContactAccepted: true,
    consentDisclosureAccepted: true,
  };

  it("should pass full validation with a complete valid payload", () => {
    const res = validateLifeInsuranceProposal(validPayload);
    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors)).toHaveLength(0);
    expect(res.sanitized.panNumber).toBe("DSOPG9342A");
    expect(res.sanitized.aadharNumber).toBe("123456789012");
    expect(res.sanitized.proposerBankIfsc).toBe("HDFC0001234");
    expect(res.sanitized.nomineeBankIfsc).toBe("SBIN0001234");
  });

  describe("Sanitization Utilities", () => {
    it("should sanitize PAN numbers correctly", () => {
      expect(sanitizePan("  dsopg9342a  ")).toBe("DSOPG9342A");
    });

    it("should sanitize IFSC codes correctly", () => {
      expect(sanitizeIfsc(" sbin0001234 ")).toBe("SBIN0001234");
    });

    it("should extract only digits", () => {
      expect(sanitizeDigits("1234-5678-9012")).toBe("123456789012");
    });

    it("should normalize 10-digit Indian mobile numbers with country prefix", () => {
      expect(sanitizeMobile("+91 99887 76655")).toBe("9988776655");
      expect(sanitizeMobile("09988776655")).toBe("9988776655");
    });
  });

  describe("Step 1 Validations", () => {
    it("should reject empty full name", () => {
      const res = validateLifeInsuranceProposal({ ...validPayload, fullName: "" }, 1);
      expect(res.isValid).toBe(false);
      expect(res.errors.fullName).toBeDefined();
    });

    it("should reject invalid mobile number", () => {
      const res = validateLifeInsuranceProposal({ ...validPayload, proposerMobile: "12345" }, 1);
      expect(res.isValid).toBe(false);
      expect(res.errors.proposerMobile).toContain("10-digit");
    });

    it("should reject invalid email", () => {
      const res = validateLifeInsuranceProposal({ ...validPayload, proposerEmail: "not-an-email" }, 1);
      expect(res.isValid).toBe(false);
      expect(res.errors.proposerEmail).toContain("email");
    });

    it("should reject missing parents names", () => {
      const res = validateLifeInsuranceProposal(
        { ...validPayload, motherFullName: "", fatherFullName: "" },
        1
      );
      expect(res.isValid).toBe(false);
      expect(res.errors.motherFullName).toBeDefined();
      expect(res.errors.fatherFullName).toBeDefined();
    });

    it("should require existing coverage amount if existing policies is true", () => {
      const res = validateLifeInsuranceProposal(
        { ...validPayload, hasExistingPolicies: true, existingCoverage: "0" },
        1
      );
      expect(res.isValid).toBe(false);
      expect(res.errors.existingCoverage).toBeDefined();
    });
  });

  describe("Step 2 Validations", () => {
    it("should require company name, designation, and income", () => {
      const res = validateLifeInsuranceProposal(
        {
          ...validPayload,
          companyName: "",
          designation: "",
          annualIncome: "",
        },
        2
      );
      expect(res.isValid).toBe(false);
      expect(res.errors.companyName).toBeDefined();
      expect(res.errors.designation).toBeDefined();
      expect(res.errors.annualIncome).toBeDefined();
    });
  });

  describe("Step 3 Validations", () => {
    it("should require details if hasPreExistingIllness is true", () => {
      const res = validateLifeInsuranceProposal(
        {
          ...validPayload,
          hasPreExistingIllness: true,
          preExistingDetails: "",
        },
        3
      );
      expect(res.isValid).toBe(false);
      expect(res.errors.preExistingDetails).toBeDefined();
    });
  });

  describe("Step 4 Validations (Nominee & Bank)", () => {
    it("should validate nominee IFSC and bank details", () => {
      const res = validateLifeInsuranceProposal(
        {
          ...validPayload,
          nomineeBankIfsc: "INVALID_IFSC",
        },
        4
      );
      expect(res.isValid).toBe(false);
      expect(res.errors.nomineeBankIfsc).toBeDefined();
    });

    it("should require custom address when address option is custom", () => {
      const res = validateLifeInsuranceProposal(
        {
          ...validPayload,
          nomineeAddressOption: "Address is different than insured person",
          nomineeCustomAddress: "",
        },
        4
      );
      expect(res.isValid).toBe(false);
      expect(res.errors.nomineeCustomAddress).toBeDefined();
    });
  });

  describe("Step 5 Validations (Documents & Proposer Bank)", () => {
    it("should reject invalid PAN format", () => {
      const res = validateLifeInsuranceProposal(
        {
          ...validPayload,
          panNumber: "1234567890",
        },
        5
      );
      expect(res.isValid).toBe(false);
      expect(res.errors.panNumber).toBeDefined();
    });

    it("should reject invalid Aadhaar number length", () => {
      const res = validateLifeInsuranceProposal(
        {
          ...validPayload,
          aadharNumber: "12345",
        },
        5
      );
      expect(res.isValid).toBe(false);
      expect(res.errors.aadharNumber).toBeDefined();
    });
  });

  describe("Step 6 Validations (Consent)", () => {
    it("should require both consent checkboxes to be accepted", () => {
      const res = validateLifeInsuranceProposal(
        {
          ...validPayload,
          consentContactAccepted: false,
          consentDisclosureAccepted: false,
        },
        6
      );
      expect(res.isValid).toBe(false);
      expect(res.errors.consentContactAccepted).toBeDefined();
      expect(res.errors.consentDisclosureAccepted).toBeDefined();
    });
  });
});
