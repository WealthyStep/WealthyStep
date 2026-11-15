import { describe, it, expect } from "vitest";
import {
  validateBseStarAccountOpening,
  sanitizePan,
  sanitizeIfsc,
  sanitizeDigits,
} from "../bse-star-validation";

describe("BSE Star Mutual Fund Account Creation Validation Suite", () => {
  const validPayload = {
    fullName: "Siva Prasad Goram",
    mobile: "9988776655",
    email: "mrsivagoram@gmail.com",
    dob: "1992-06-15",
    placeOfBirth: "Hyderabad, Telangana",
    occupation: "Salaried",
    presentAddress: "Plot 101, Hitech City, Hyderabad, 500081",
    permanentAddressSameAsPresent: true,
    permanentAddress: "Plot 101, Hitech City, Hyderabad, 500081",
    maritalStatus: "Single",

    isKycDone: "Yes",
    aadharNumber: "123456789012",
    panNumber: "DSOPG9342A",

    bankName: "HDFC Bank",
    bankBranch: "Madhapur",
    accountNumber: "50100234567890",
    accountType: "Savings",
    bankCity: "Hyderabad",
    pinCode: "500081",
    ifscCode: "HDFC0001234",
    micrCode: "500240012",

    nomineesCount: 1,
    nominees: [
      {
        name: "Lakshmi Goram",
        aadharLast4: "9857",
        relation: "Mother",
        dob: "1968-08-10",
        mobile: "9876543210",
        mobileBelongsTo: "Nominee Mobile number",
        email: "lakshmi@gmail.com",
        emailBelongsTo: "Nominee Email ID",
        address: "Plot 101, Hitech City, Hyderabad, 500081",
        percentage: 100,
      },
    ],

    declarationAccepted: true,
  };

  it("should pass full validation with valid data", () => {
    const res = validateBseStarAccountOpening(validPayload);
    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors)).toHaveLength(0);
    expect(res.sanitized.panNumber).toBe("DSOPG9342A");
    expect(res.sanitized.aadharNumber).toBe("123456789012");
  });

  describe("Step 1: Personal Details", () => {
    it("should reject invalid mobile number", () => {
      const res = validateBseStarAccountOpening({ ...validPayload, mobile: "12345" }, 1);
      expect(res.isValid).toBe(false);
      expect(res.errors.mobile).toBeDefined();
    });

    it("should reject invalid email", () => {
      const res = validateBseStarAccountOpening({ ...validPayload, email: "invalid-email" }, 1);
      expect(res.isValid).toBe(false);
      expect(res.errors.email).toBeDefined();
    });

    it("should auto-fill permanent address when permanentAddressSameAsPresent is true", () => {
      const res = validateBseStarAccountOpening(
        {
          ...validPayload,
          presentAddress: "Kondapur, Hyderabad",
          permanentAddress: "",
          permanentAddressSameAsPresent: true,
        },
        1
      );
      expect(res.sanitized.permanentAddress).toBe("Kondapur, Hyderabad");
      expect(res.errors.permanentAddress).toBeUndefined();
    });
  });

  describe("Step 2: KYC & Identification", () => {
    it("should enforce 12-digit Aadhaar number", () => {
      const res = validateBseStarAccountOpening({ ...validPayload, aadharNumber: "123456" }, 2);
      expect(res.isValid).toBe(false);
      expect(res.errors.aadharNumber).toBe("Aadhaar number must be exactly 12 digits.");
    });

    it("should enforce standard 10-character PAN format", () => {
      const res = validateBseStarAccountOpening({ ...validPayload, panNumber: "INVALIDPAN" }, 2);
      expect(res.isValid).toBe(false);
      expect(res.errors.panNumber).toContain("Valid 10-character PAN is required");
    });
  });

  describe("Step 3: Bank Details", () => {
    it("should enforce standard 11-character IFSC format", () => {
      const res = validateBseStarAccountOpening({ ...validPayload, ifscCode: "HDFC123" }, 3);
      expect(res.isValid).toBe(false);
      expect(res.errors.ifscCode).toBeDefined();
    });

    it("should accept valid 11-char IFSC and 6-digit PIN", () => {
      const res = validateBseStarAccountOpening(
        { ...validPayload, ifscCode: "SBIN0001234", pinCode: "500081" },
        3
      );
      expect(res.errors.ifscCode).toBeUndefined();
      expect(res.errors.pinCode).toBeUndefined();
    });
  });

  describe("Step 4: Nominee Allocations", () => {
    it("should require 4 digits for nominee Aadhaar last 4", () => {
      const invalidNominees = [
        {
          ...validPayload.nominees[0],
          aadharLast4: "12",
        },
      ];
      const res = validateBseStarAccountOpening(
        { ...validPayload, nominees: invalidNominees },
        4
      );
      expect(res.isValid).toBe(false);
      expect(res.errors.nominee_0_aadharLast4).toBeDefined();
    });

    it("should reject when nominee shares do not total 100%", () => {
      const twoNominees = [
        { ...validPayload.nominees[0], percentage: 60 },
        { ...validPayload.nominees[0], name: "Second Nominee", percentage: 30 },
      ];
      const res = validateBseStarAccountOpening(
        { ...validPayload, nomineesCount: 2, nominees: twoNominees },
        4
      );
      expect(res.isValid).toBe(false);
      expect(res.errors.nominee_percentage_sum).toContain("must equal exactly 100%");
    });

    it("should accept 2 nominees when shares equal 100%", () => {
      const twoNominees = [
        { ...validPayload.nominees[0], percentage: 50 },
        { ...validPayload.nominees[0], name: "Brother", relation: "Brother", percentage: 50 },
      ];
      const res = validateBseStarAccountOpening(
        { ...validPayload, nomineesCount: 2, nominees: twoNominees },
        4
      );
      expect(res.errors.nominee_percentage_sum).toBeUndefined();
    });
  });

  describe("Sanitizers", () => {
    it("should uppercase and trim PAN", () => {
      expect(sanitizePan("  dsopg9342a  ")).toBe("DSOPG9342A");
    });

    it("should uppercase and trim IFSC", () => {
      expect(sanitizeIfsc("  hdfc0001234  ")).toBe("HDFC0001234");
    });

    it("should filter non-digits and respect maxLen", () => {
      expect(sanitizeDigits("+91 9988-7766-55", 10)).toBe("9199887766");
      expect(sanitizeDigits("1234-5678-9012", 12)).toBe("123456789012");
    });
  });

  describe("Mutual Funds Validation Re-export Compatibility", () => {
    it("should validate seamlessly via validateMutualFundAccountOpening alias", async () => {
      const { validateMutualFundAccountOpening } = await import("../mutual-funds-validation");
      const res = validateMutualFundAccountOpening(validPayload);
      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errors).length).toBe(0);
    });
  });
});
