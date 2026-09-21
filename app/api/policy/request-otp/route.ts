import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { generateOtp, hashOtp, sendOtpEmail } from "@/lib/otp";
import { recordAuditLog } from "@/lib/audit";

const MAX_OTP_PER_HOUR = 5;
const OTP_EXPIRY_MINUTES = 5;

// Helper to sanitize and normalize phone numbers (e.g., handles +91, spaces, hyphens)
function normalizeMobile(mobile: string): string {
  const digits = mobile.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  return digits;
}

// Helper to normalize Date of Birth across DD/MM/YYYY, DD-MM-YYYY, and YYYY-MM-DD formats
function normalizeDob(raw: string): string {
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

export async function POST(request: Request) {
  try {
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const body = await request.json().catch(() => ({}));
    const { mobile, email, dob } = body;

    if (!mobile || !email || !dob) {
      return NextResponse.json(
        { error: "Please provide your Mobile Number, Registered Email, and Date of Birth." },
        { status: 400 }
      );
    }

    const cleanMobile = normalizeMobile(String(mobile).trim());
    const cleanEmail = String(email).trim().toLowerCase();
    const rawDob = String(dob).trim();
    const normalizedDob = normalizeDob(rawDob);

    const identifier = `${cleanMobile}:${cleanEmail}`;

    // 1. Rate Limiting Check (Max 5 requests per hour for this identifier or IP)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countErr } = await supabaseServer
      .from("otp_requests")
      .select("id", { count: "exact", head: true })
      .eq("identifier", identifier)
      .gt("created_at", oneHourAgo);

    if (!countErr && typeof count === "number" && count >= MAX_OTP_PER_HOUR) {
      return NextResponse.json(
        {
          error: "Too many OTP requests. For security reasons, please wait 1 hour before trying again.",
        },
        { status: 429 }
      );
    }

    // 2. Query Client Record in Supabase by email
    const { data: clients, error: searchError } = await supabaseServer
      .from("clients")
      .select("id, name, mobile, email, dob")
      .ilike("email", cleanEmail)
      .limit(10);

    let matchedClient = null;
    if (clients && clients.length > 0) {
      matchedClient =
        clients.find((c) => {
          const mobileMatches = normalizeMobile(c.mobile) === cleanMobile;
          const dobMatches = normalizeDob(c.dob) === normalizedDob || c.dob === rawDob;
          return mobileMatches && dobMatches;
        }) || null;
    }

    // If client details do not match, return a unified, secure error message
    if (!matchedClient) {
      return NextResponse.json(
        {
          error: "The details provided (Mobile Number, Email, or Date of Birth) do not match our registered client records. Please check your details and try again.",
        },
        { status: 400 }
      );
    }

    // 3. Generate OTP and save hashed version
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

    // Invalidate prior unverified OTPs for this identifier
    await supabaseServer
      .from("otp_requests")
      .update({ verified: true })
      .eq("identifier", identifier)
      .eq("verified", false);

    // Insert new OTP record
    await supabaseServer.from("otp_requests").insert({
      client_id: matchedClient.id,
      identifier: identifier,
      otp_hash: otpHash,
      attempts: 0,
      max_attempts: 5,
      expires_at: expiresAt,
      verified: false,
    });

    // Send OTP via Brevo
    const emailResult = await sendOtpEmail({
      toEmail: matchedClient.email,
      clientName: matchedClient.name,
      otp: otp,
    });

    if (!emailResult.success) {
      console.error("Failed to send OTP email:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to deliver OTP email. Please verify your email or contact support." },
        { status: 500 }
      );
    }

    await recordAuditLog({
      actor: `client:${matchedClient.id}`,
      action: "OTP_REQUESTED",
      targetType: "otp",
      targetId: matchedClient.id,
      details: { email: cleanEmail, mobile: `***${cleanMobile.slice(-4)}` },
      ipAddress,
    });

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${matchedClient.email}.`,
    }, { status: 200 });
  } catch (err: any) {
    console.error("Error processing OTP request:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
