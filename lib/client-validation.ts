/**
 * Client Data Validation & Duplicate Prevention Suite
 * Ensures data integrity, security, and unique identification for Policy Vault.
 */

// Normalize mobile number (strips formatting, extracts 10 digits for Indian standard)
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

// Normalize Date of Birth (DD/MM/YYYY or YYYY-MM-DD -> YYYY-MM-DD)
export function normalizeDob(raw: string): string {
  if (!raw) return "";
  const s = raw.trim();
  const ddmmyyyy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (ddmmyyyy) {
    const day = ddmmyyyy[1].padStart(2, "0");
    const month = ddmmyyyy[2].padStart(2, "0");
    const year = ddmmyyyy[3];
    return `${year}-${month}-${day}`;
  }
  const yyyymmdd = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (yyyymmdd) {
    const year = yyyymmdd[1];
    const month = yyyymmdd[2].padStart(2, "0");
    const day = yyyymmdd[3].padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return s;
}

// Email format validator
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const clean = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(clean) && clean.length <= 254;
}

// Mobile format validator
export function isValidMobile(mobile: string): boolean {
  if (!mobile || typeof mobile !== "string") return false;
  const normalized = normalizeMobile(mobile);
  // Standard Indian 10-digit mobile number starting with 6, 7, 8, or 9
  // or standard international 10-15 digits
  return /^[0-9]{10,15}$/.test(normalized);
}

// DOB format & range validator
export function isValidDob(dob: string): boolean {
  if (!dob) return false;
  const normalized = normalizeDob(dob);
  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const dateObj = new Date(year, month - 1, day);
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return false;
  }

  // Must not be in the future
  if (dateObj.getTime() > Date.now()) return false;

  return true;
}

export interface ClientValidationResult {
  valid: boolean;
  error?: string;
  field?: "name" | "mobile" | "email" | "dob";
}

// Comprehensive field validator
export function validateClientInput(data: {
  name?: string;
  mobile?: string;
  email?: string;
  dob?: string;
}): ClientValidationResult {
  if (data.name !== undefined) {
    const cleanName = String(data.name).trim();
    if (!cleanName || cleanName.length < 2) {
      return {
        valid: false,
        error: "Client full name must be at least 2 characters.",
        field: "name",
      };
    }
  }

  if (data.email !== undefined) {
    const cleanEmail = String(data.email).trim();
    if (!cleanEmail) {
      return {
        valid: false,
        error: "Email address is required.",
        field: "email",
      };
    }
    if (!isValidEmail(cleanEmail)) {
      return {
        valid: false,
        error: "Please enter a valid email address (e.g. client@example.com).",
        field: "email",
      };
    }
  }

  if (data.mobile !== undefined) {
    const cleanMobile = String(data.mobile).trim();
    if (!cleanMobile) {
      return {
        valid: false,
        error: "Mobile number is required.",
        field: "mobile",
      };
    }
    if (!isValidMobile(cleanMobile)) {
      return {
        valid: false,
        error: "Please enter a valid 10-digit mobile number.",
        field: "mobile",
      };
    }
  }

  if (data.dob !== undefined) {
    const cleanDob = String(data.dob).trim();
    if (!cleanDob) {
      return {
        valid: false,
        error: "Date of birth is required.",
        field: "dob",
      };
    }
    if (!isValidDob(cleanDob)) {
      return {
        valid: false,
        error: "Please enter a valid Date of Birth (DD/MM/YYYY).",
        field: "dob",
      };
    }
  }

  return { valid: true };
}

// Database uniqueness checker
export async function checkDuplicateClient(
  supabase: any,
  params: { email?: string; mobile?: string; excludeClientId?: string }
): Promise<{ isDuplicate: boolean; field?: "email" | "mobile"; message?: string }> {
  const { email, mobile, excludeClientId } = params;

  // 1. Check Duplicate Email
  if (email) {
    const cleanEmail = email.trim().toLowerCase();
    let query = supabase
      .from("clients")
      .select("id, name, email, mobile")
      .ilike("email", cleanEmail);

    if (excludeClientId) {
      query = query.neq("id", excludeClientId);
    }

    const { data: existingEmail, error: emailErr } = await query;
    if (!emailErr && existingEmail && existingEmail.length > 0) {
      const match = existingEmail[0];
      return {
        isDuplicate: true,
        field: "email",
        message: `A client with the email address "${cleanEmail}" already exists (${match.name}). Please use a unique email address.`,
      };
    }
  }

  // 2. Check Duplicate Mobile
  if (mobile) {
    const normMobile = normalizeMobile(mobile);
    let query = supabase
      .from("clients")
      .select("id, name, email, mobile");

    if (excludeClientId) {
      query = query.neq("id", excludeClientId);
    }

    const { data: allClients, error: mobileErr } = await query;
    if (!mobileErr && allClients && allClients.length > 0) {
      const match = allClients.find(
        (c: any) =>
          normalizeMobile(c.mobile) === normMobile ||
          c.mobile.trim() === mobile.trim()
      );
      if (match) {
        return {
          isDuplicate: true,
          field: "mobile",
          message: `A client with the mobile number "${mobile.trim()}" already exists (${match.name}). Please use a unique mobile number.`,
        };
      }
    }
  }

  return { isDuplicate: false };
}
