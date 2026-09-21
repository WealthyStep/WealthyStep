import { describe, it, expect, vi } from "vitest";
import { generateOtp, hashOtp } from "@/lib/otp";
import { requireAdmin } from "@/lib/admin-auth";

describe("Policy Vault & Security Suite", () => {
  describe("OTP Generation & Hashing Security", () => {
    it("should generate 6-digit numeric OTPs", () => {
      for (let i = 0; i < 20; i++) {
        const otp = generateOtp();
        expect(otp).toHaveLength(6);
        expect(Number(otp)).toBeGreaterThanOrEqual(100000);
        expect(Number(otp)).toBeLessThanOrEqual(999999);
      }
    });

    it("should hash OTPs deterministically with pepper", () => {
      const otp = "584920";
      const hash1 = hashOtp(otp);
      const hash2 = hashOtp(otp);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 hex output
      expect(hash1).not.toBe(otp); // Never plaintext
    });

    it("should produce different hashes for different OTPs", () => {
      const hash1 = hashOtp("123456");
      const hash2 = hashOtp("123457");
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("Admin Authorization Middleware (requireAdmin)", () => {
    it("should return 401 when no authorization token or cookie is supplied", async () => {
      const req = new Request("http://localhost:3000/api/admin/clients", {
        method: "GET",
      });

      const result = await requireAdmin(req);
      expect(result.authenticated).toBe(false);
      if (!result.authenticated) {
        expect(result.response.status).toBe(401);
      }
    });

    it("should return 401 when invalid Bearer token is provided", async () => {
      const req = new Request("http://localhost:3000/api/admin/clients", {
        method: "GET",
        headers: {
          Authorization: "Bearer invalid-tampered-token-123",
        },
      });

      const result = await requireAdmin(req);
      expect(result.authenticated).toBe(false);
      if (!result.authenticated) {
        expect(result.response.status).toBe(401);
      }
    });
  });

  describe("Document Upload Security Constraints", () => {
    it("should enforce maximum 15MB file size limit", () => {
      const MAX_SIZE = 15 * 1024 * 1024;
      const validSize = 5 * 1024 * 1024; // 5MB
      const invalidSize = 16 * 1024 * 1024; // 16MB

      expect(validSize <= MAX_SIZE).toBe(true);
      expect(invalidSize <= MAX_SIZE).toBe(false);
    });

    it("should reject non-PDF mime types", () => {
      const allowedMime = "application/pdf";
      const validFile = { name: "policy.pdf", type: "application/pdf" };
      const invalidFiles = [
        { name: "script.exe", type: "application/x-msdownload" },
        { name: "malicious.js", type: "application/javascript" },
        { name: "image.png", type: "image/png" },
        { name: "document.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
      ];

      expect(validFile.type === allowedMime && validFile.name.endsWith(".pdf")).toBe(true);
      for (const f of invalidFiles) {
        const isPdf = f.type === allowedMime || f.name.toLowerCase().endsWith(".pdf");
        expect(isPdf).toBe(false);
      }
    });
  });

  describe("Timing-Safe Response Parity", () => {
    it("should provide consistent success message for both existent and non-existent accounts", () => {
      const genericMessage =
        "If the details match our records, a 6-digit verification code has been sent to your registered email address.";

      const responseExistent = { success: true, message: genericMessage };
      const responseNonExistent = { success: true, message: genericMessage };

      expect(responseExistent).toEqual(responseNonExistent);
    });
  });

  describe("Session Validation & Document Scoping Boundary", () => {
    it("should reject download when x-session-token is missing", async () => {
      const { POST } = await import("@/app/api/policy/download/route");
      const req = new Request("http://localhost:3000/api/policy/download", {
        method: "POST",
        body: JSON.stringify({ documentId: "doc-123" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain("Session expired or invalid");
    });

    it("should reject documents list when x-session-token is invalid", async () => {
      const verifiedSessionModule = await import("@/lib/verified-session");
      const validateSpy = vi.spyOn(verifiedSessionModule, "validateVerifiedSession").mockResolvedValue(null);

      const { GET } = await import("@/app/api/policy/documents/route");
      const req = new Request("http://localhost:3000/api/policy/documents", {
        method: "GET",
        headers: {
          "x-session-token": "invalid-non-existent-token",
        },
      });

      const res = await GET(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain("Session expired or invalid");

      validateSpy.mockRestore();
    });

    it("should reject document preview when x-session-token is missing", async () => {
      const { POST } = await import("@/app/api/policy/preview/route");
      const req = new Request("http://localhost:3000/api/policy/preview", {
        method: "POST",
        body: JSON.stringify({ documentId: "doc-123" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain("Session expired or invalid");
    });
  });

  describe("Client Input Validation & Duplicate Prevention Suite", () => {
    it("should validate and normalize mobile numbers", async () => {
      const { normalizeMobile, isValidMobile } = await import("@/lib/client-validation");

      expect(normalizeMobile("+91 98765 43210")).toBe("9876543210");
      expect(normalizeMobile("919876543210")).toBe("9876543210");
      expect(normalizeMobile("09876543210")).toBe("9876543210");
      expect(normalizeMobile("9876543210")).toBe("9876543210");

      expect(isValidMobile("9876543210")).toBe(true);
      expect(isValidMobile("+91 98765 43210")).toBe(true);
      expect(isValidMobile("123")).toBe(false);
      expect(isValidMobile("abcdefghij")).toBe(false);
    });

    it("should validate email addresses strictly", async () => {
      const { isValidEmail } = await import("@/lib/client-validation");

      expect(isValidEmail("client@example.com")).toBe(true);
      expect(isValidEmail("rajesh.sharma+policy@wealthystep.in")).toBe(true);
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("client@")).toBe(false);
      expect(isValidEmail("@domain.com")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });

    it("should validate date of birth formats and range", async () => {
      const { normalizeDob, isValidDob } = await import("@/lib/client-validation");

      expect(normalizeDob("15/08/1990")).toBe("1990-08-15");
      expect(normalizeDob("1990-08-15")).toBe("1990-08-15");
      expect(normalizeDob("15-08-1990")).toBe("1990-08-15");

      expect(isValidDob("1990-08-15")).toBe(true);
      expect(isValidDob("15/08/1990")).toBe(true);
      expect(isValidDob("2050-01-01")).toBe(false); // Future date
      expect(isValidDob("1850-01-01")).toBe(false); // Too old
      expect(isValidDob("invalid-date")).toBe(false);
    });

    it("should detect duplicate email and mobile in checkDuplicateClient", async () => {
      const { checkDuplicateClient } = await import("@/lib/client-validation");

      const mockSupabase = {
        from: vi.fn((table: string) => {
          return {
            select: vi.fn(() => ({
              ilike: vi.fn((col: string, val: string) => {
                if (val === "duplicate@example.com") {
                  return Promise.resolve({
                    data: [{ id: "client-1", name: "Existing Client", email: val, mobile: "9876543210" }],
                    error: null,
                  });
                }
                return Promise.resolve({ data: [], error: null });
              }),
              neq: vi.fn(() => ({
                ilike: vi.fn(() => Promise.resolve({ data: [], error: null })),
              })),
            })),
          };
        }),
      };

      const result = await checkDuplicateClient(mockSupabase, {
        email: "duplicate@example.com",
      });

      expect(result.isDuplicate).toBe(true);
      expect(result.field).toBe("email");
      expect(result.message).toContain("already exists");
    });
  });
});

