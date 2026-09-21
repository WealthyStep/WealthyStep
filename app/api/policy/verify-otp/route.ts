import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { hashOtp } from "@/lib/otp";
import { createVerifiedSession } from "@/lib/verified-session";
import { recordAuditLog } from "@/lib/audit";

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
    const { mobile, email, dob, otp } = body;

    if (!mobile || !email || !dob || !otp) {
      return NextResponse.json(
        { error: "Mobile number, email, date of birth, and OTP code are required." },
        { status: 400 }
      );
    }

    const cleanMobile = normalizeMobile(String(mobile).trim());
    const cleanEmail = String(email).trim().toLowerCase();
    const rawDob = String(dob).trim();
    const normalizedDob = normalizeDob(rawDob);
    const submittedOtp = String(otp).trim();
    const identifier = `${cleanMobile}:${cleanEmail}`;

    // 1. Find client record
    const { data: clients, error: clientErr } = await supabaseServer
      .from("clients")
      .select("id, name, mobile, email, dob, policy_number")
      .ilike("email", cleanEmail)
      .limit(10);

    let client = null;
    if (clients && clients.length > 0) {
      client =
        clients.find((c) => {
          const mobileMatches = normalizeMobile(c.mobile) === cleanMobile;
          const dobMatches = normalizeDob(c.dob) === normalizedDob || c.dob === rawDob;
          return mobileMatches && dobMatches;
        }) || null;
    }

    if (!client) {
      return NextResponse.json(
        { error: "The details provided (Mobile Number, Email, or Date of Birth) do not match our registered client records." },
        { status: 400 }
      );
    }

    // 2. Fetch the latest active OTP request for this client/identifier
    const { data: otpRecords, error: otpErr } = await supabaseServer
      .from("otp_requests")
      .select("id, otp_hash, attempts, max_attempts, expires_at, verified")
      .eq("client_id", client.id)
      .eq("verified", false)
      .order("created_at", { ascending: false })
      .limit(1);

    if (otpErr || !otpRecords || otpRecords.length === 0) {
      return NextResponse.json(
        { error: "No active OTP request found. Please request a new verification code." },
        { status: 400 }
      );
    }

    const activeOtp = otpRecords[0];

    // Check if expired
    if (new Date(activeOtp.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { error: "This OTP code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check attempt limit
    if (activeOtp.attempts >= activeOtp.max_attempts) {
      return NextResponse.json(
        { error: "Too many failed attempts. For your security, this code is locked. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Compare hashes
    const submittedHash = hashOtp(submittedOtp);
    if (submittedHash !== activeOtp.otp_hash) {
      const newAttempts = activeOtp.attempts + 1;
      await supabaseServer
        .from("otp_requests")
        .update({ attempts: newAttempts })
        .eq("id", activeOtp.id);

      const remaining = activeOtp.max_attempts - newAttempts;
      return NextResponse.json(
        {
          error:
            remaining > 0
              ? `Invalid OTP code. You have ${remaining} ${remaining === 1 ? "attempt" : "attempts"} remaining.`
              : "Too many failed attempts. This code is now locked. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    // 3. Concurrently mark OTP verified, issue temporary session token (15 mins), and record audit
    const [sessionToken] = await Promise.all([
      createVerifiedSession(client.id),
      supabaseServer
        .from("otp_requests")
        .update({ verified: true })
        .eq("id", activeOtp.id),
      recordAuditLog({
        actor: `client:${client.id}`,
        action: "OTP_VERIFIED",
        targetType: "auth",
        targetId: client.id,
        details: { email: cleanEmail },
        ipAddress,
      }),
    ]);

    return NextResponse.json({
      success: true,
      sessionToken,
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        policyNumber: client.policy_number,
      },
    });
  } catch (err: any) {
    console.error("Error verifying OTP:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during verification. Please try again." },
      { status: 500 }
    );
  }
}
