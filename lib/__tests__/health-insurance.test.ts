import { describe, it, expect } from "vitest";
import {
  validateHealthInsuranceProposal,
  normalizeMobile,
  normalizePan,
  normalizeIfsc,
  PAN_REGEX,
  INDIAN_MOBILE_REGEX,
  IFSC_REGEX,
} from "../health-insurance-validation";

describe("Health Insurance Validation Suite", () => {
  it("normalizes PAN, IFSC, and Mobile numbers accurately", () => {
    expect(normalizePan("  abcde1234f ")).toBe("ABCDE1234F");
    expect(normalizeIfsc("  hdfc0001234  ")).toBe("HDFC0001234");
    expect(normalizeMobile("+91 98765-43210")).toBe("9876543210");
    expect(normalizeMobile("09876543210")).toBe("9876543210");
  });

  it("validates PAN format with regex", () => {
    expect(PAN_REGEX.test("ABCDE1234F")).toBe(true);
    expect(PAN_REGEX.test("ABCD1234F")).toBe(false); // 9 chars
    expect(PAN_REGEX.test("12345ABCDE")).toBe(false);
  });

  it("validates Indian 10-digit mobile numbers with regex", () => {
    expect(INDIAN_MOBILE_REGEX.test("9876543210")).toBe(true);
    expect(INDIAN_MOBILE_REGEX.test("8765432109")).toBe(true);
    expect(INDIAN_MOBILE_REGEX.test("7654321098")).toBe(true);
    expect(INDIAN_MOBILE_REGEX.test("6543210987")).toBe(true);
    expect(INDIAN_MOBILE_REGEX.test("5543210987")).toBe(false); // starts with 5
    expect(INDIAN_MOBILE_REGEX.test("98765")).toBe(false);
  });

  it("validates Indian IFSC code format", () => {
    expect(IFSC_REGEX.test("HDFC0001234")).toBe(true);
    expect(IFSC_REGEX.test("SBIN0000123")).toBe(true);
    expect(IFSC_REGEX.test("HDFC1001234")).toBe(false); // 5th char must be 0
  });

  it("rejects incomplete Step 1 inputs with targeted error messages", () => {
    const result = validateHealthInsuranceProposal({
      proposerName: "",
      proposerPan: "BADPAN",
      proposerMobile: "123",
    }, 1);

    expect(result.isValid).toBe(false);
    expect(result.errors.proposerName).toBeDefined();
    expect(result.errors.proposerPan).toBeDefined();
    expect(result.errors.proposerMobile).toBeDefined();
  });

  it("accepts valid full proposal inputs across all 5 sections", () => {
    const validProposal = {
      proposerName: "Siva Goram",
      proposerPan: "ABCDE1234F",
      proposerDob: "1992-05-10",
      proposerMobile: "9876543210",
      proposerEmail: "siva@example.com",
      proposerAddress: "Plot 101, Financial District, Hyderabad 500032",
      employmentStatus: "Salaried Employee (PF credit)" as const,
      policyType: "New Policy" as const,
      adultsCount: 1,
      kidsCount: 0,
      members: [
        {
          id: "member-1",
          role: "Adult 1 (Self)" as const,
          relation: "Self",
          fullName: "Siva Goram",
          dob: "1992-05-10",
          gender: "Male" as const,
          height: "178 cm",
          weight: "74 kg",
        },
      ],
      insuredEmail: "siva@example.com",
      insuredMobile: "9876543210",
      hasPreExistingIllness: false,
      hasTobaccoAlcoholHabits: false,
      currentAddress: "Plot 101, Financial District, Hyderabad 500032",
      nomineeName: "Priya Goram",
      nomineeDob: "1995-08-12",
      nomineeRelation: "Wife",
      nomineeAddressOption: "Same as Proposer person address" as const,
      nomineeMobile: "9876543211",
      nomineeEmail: "priya@example.com",
      nomineeBankName: "HDFC Bank",
      nomineeBankAccountName: "Priya Goram",
      nomineeBankIfsc: "HDFC0001234",
      nomineeBankAccountNumber: "50100456789012",
      nomineeBankAccountType: "Savings" as const,
      consentContactAccepted: true,
      consentDisclosureAccepted: true,
    };

    const result = validateHealthInsuranceProposal(validProposal);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
    expect(result.sanitized.proposerPan).toBe("ABCDE1234F");
  });

  it("accepts health proposal even when nominee bank account details are left blank (optional)", () => {
    const proposalWithoutNomineeBank = {
      proposerName: "Siva Goram",
      proposerPan: "ABCDE1234F",
      proposerDob: "1992-05-10",
      proposerMobile: "9876543210",
      proposerEmail: "siva@example.com",
      proposerAddress: "Plot 101, Financial District, Hyderabad 500032",
      employmentStatus: "Salaried Employee (PF credit)" as const,
      policyType: "New Policy" as const,
      adultsCount: 1,
      kidsCount: 0,
      members: [
        {
          id: "member-1",
          role: "Adult 1 (Self)" as const,
          relation: "Self",
          fullName: "Siva Goram",
          dob: "1992-05-10",
          gender: "Male" as const,
          height: "178 cm",
          weight: "74 kg",
        },
      ],
      insuredEmail: "siva@example.com",
      insuredMobile: "9876543210",
      hasPreExistingIllness: false,
      hasTobaccoAlcoholHabits: false,
      currentAddress: "Plot 101, Financial District, Hyderabad 500032",
      nomineeName: "Priya Goram",
      nomineeDob: "1995-08-12",
      nomineeRelation: "Wife",
      nomineeAddressOption: "Same as Proposer person address" as const,
      nomineeMobile: "9876543211",
      nomineeEmail: "priya@example.com",
      // Nominee bank details intentionally left blank
      nomineeBankName: "",
      nomineeBankAccountName: "",
      nomineeBankIfsc: "",
      nomineeBankAccountNumber: "",
      nomineeBankAccountType: "Savings" as const,
      consentContactAccepted: true,
      consentDisclosureAccepted: true,
    };

    const result = validateHealthInsuranceProposal(proposalWithoutNomineeBank);
    expect(result.isValid).toBe(true);
    expect(result.errors.nomineeBankName).toBeUndefined();
    expect(result.errors.nomineeBankAccountName).toBeUndefined();
    expect(result.errors.nomineeBankIfsc).toBeUndefined();
    expect(result.errors.nomineeBankAccountNumber).toBeUndefined();
    expect(result.sanitized.nomineeBankName).toBe("");
  });

  it("requires all details (fullName, dob, gender, height, weight) for every family member in Step 2", () => {
    const incompleteMembersProposal = {
      proposerName: "Siva Goram",
      proposerPan: "ABCDE1234F",
      proposerDob: "1992-05-10",
      proposerMobile: "9876543210",
      proposerEmail: "siva@example.com",
      proposerAddress: "Plot 101, Hyderabad 500032",
      employmentStatus: "Salaried Employee (PF credit)" as const,
      policyType: "New Policy" as const,
      adultsCount: 2,
      kidsCount: 1,
      members: [
        {
          id: "member-1",
          role: "Adult 1 (Self)" as const,
          relation: "Self",
          fullName: "Siva Goram",
          dob: "1992-05-10",
          gender: "Male" as const,
          height: "178 cm",
          weight: "74 kg",
        },
        {
          id: "member-2",
          role: "Adult 2" as const,
          relation: "Wife",
          fullName: "", // Missing
          dob: "",      // Missing
          gender: "" as any, // Missing
          height: "",   // Missing
          weight: "",   // Missing
        },
      ],
      insuredEmail: "siva@example.com",
      insuredMobile: "9876543210",
    };

    const result = validateHealthInsuranceProposal(incompleteMembersProposal, 2);
    expect(result.isValid).toBe(false);
    expect(result.errors.member_1_fullName).toBeDefined();
    expect(result.errors.member_1_dob).toBeDefined();
    expect(result.errors.member_1_gender).toBeDefined();
    expect(result.errors.member_1_height).toBeDefined();
    expect(result.errors.member_1_weight).toBeDefined();
  });
});

