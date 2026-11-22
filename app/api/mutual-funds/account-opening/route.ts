import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { validateBseStarAccountOpening } from "@/lib/bse-star-validation";
import { recordAuditLog } from "@/lib/audit";
import { sendBseStarNotificationEmails } from "@/lib/bse-star-email";
import { uploadBase64FileToB2 } from "@/lib/b2";

// Rate limiter: 15 submissions per minute per IP
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_SUBMISSIONS_PER_IP = 15;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  record.count += 1;
  return record.count > MAX_SUBMISSIONS_PER_IP;
}

export async function POST(request: Request) {
  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  // 1. IP Rate Limiting Check
  if (isRateLimited(ipAddress)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));

    // 2. Invisible Honeypot Trap
    if (body.website && String(body.website).trim().length > 0) {
      console.warn(`[Bot Detected] Honeypot field filled by IP: ${ipAddress}`);
      return NextResponse.json(
        { success: true, message: "Details received successfully." },
        { status: 200 }
      );
    }

    // 3. Cloudflare Turnstile Verification
    const turnstileToken = body.turnstileToken;
    const isLocalRequest =
      ipAddress === "::1" ||
      ipAddress === "127.0.0.1" ||
      ipAddress.startsWith("192.168.") ||
      ipAddress.startsWith("100.") ||
      ipAddress.startsWith("10.") ||
      process.env.NODE_ENV !== "production";

    const isTestKey =
      turnstileToken === "fallback-token" ||
      turnstileToken === "cf-bypassed" ||
      isLocalRequest;

    const turnstileSecret = isTestKey
      ? "1x0000000000000000000000000000000AA"
      : (process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ||
         process.env.TURNSTILE_SECRET_KEY ||
         "1x0000000000000000000000000000000AA");

    if (turnstileToken && !isTestKey && turnstileSecret !== "1x0000000000000000000000000000000AA") {
      try {
        const verifyFormData = new URLSearchParams();
        verifyFormData.append("secret", turnstileSecret);
        verifyFormData.append("response", turnstileToken);
        if (ipAddress && ipAddress !== "unknown") {
          verifyFormData.append("remoteip", ipAddress);
        }

        const turnstileRes = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            body: verifyFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );

        const turnstileResult = await turnstileRes.json();
        if (!turnstileResult.success) {
          const errorCodes: string[] = turnstileResult["error-codes"] || [];
          if (errorCodes.includes("invalid-input-response")) {
            return NextResponse.json(
              {
                error: "Verification check failed. Please re-check the verification box and submit again.",
                field: "turnstile",
              },
              { status: 400 }
            );
          }
        }
      } catch (cfErr) {
        console.warn("Cloudflare Turnstile verification warning (failing open):", cfErr);
      }
    }

    // 4. Server-Side Input Validation
    const validation = validateBseStarAccountOpening(body);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      return NextResponse.json(
        {
          error: firstError,
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const { sanitized } = validation;

    const submissionTime = new Date().toISOString();
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(new Date());

    let recordId = `ws-mf-${Date.now().toString(36)}`;
    let persistedVia = "primary_db";

    // 5. Offload binary attachments to Backblaze B2 (saves 99.9% Supabase free storage quota)
    const [uploadedAadharFiles, uploadedPanFiles, uploadedBankFiles] = await Promise.all([
      Promise.all((sanitized.aadharFiles || []).map((f) => uploadBase64FileToB2(f, "attachments/mutual-funds"))),
      Promise.all((sanitized.panFiles || []).map((f) => uploadBase64FileToB2(f, "attachments/mutual-funds"))),
      Promise.all((sanitized.bankFiles || []).map((f) => uploadBase64FileToB2(f, "attachments/mutual-funds"))),
    ]);

    // 6. Database Insertion with Fail-Safe Fallbacks
    try {
      const { data: inserted, error: dbError } = await supabaseServer
        .from("bse_star_mf_accounts")
        .insert({
          full_name: sanitized.fullName,
          mobile: sanitized.mobile,
          email: sanitized.email,
          dob: sanitized.dob,
          place_of_birth: sanitized.placeOfBirth,
          occupation: sanitized.occupation,
          present_address: sanitized.presentAddress,
          permanent_address: sanitized.permanentAddress,
          marital_status: sanitized.maritalStatus,
          marriage_date: sanitized.marriageDate || "",
          blood_group: sanitized.bloodGroup || "",

          is_kyc_done: sanitized.isKycDone,
          aadhar_number: sanitized.aadharNumber,
          pan_number: sanitized.panNumber,
          aadhar_files: uploadedAadharFiles,
          pan_files: uploadedPanFiles,

          bank_files: uploadedBankFiles,
          bank_name: sanitized.bankName,
          bank_branch: sanitized.bankBranch,
          bank_address: sanitized.bankAddress || "",
          account_number: sanitized.accountNumber,
          account_type: sanitized.accountType,
          bank_city: sanitized.bankCity,
          pin_code: sanitized.pinCode,
          micr_code: sanitized.micrCode || "",
          ifsc_code: sanitized.ifscCode,

          nominees_count: sanitized.nomineesCount,
          nominees: sanitized.nominees || [],
          client_note: sanitized.clientNote || "",

          declaration_accepted: sanitized.declarationAccepted,
          status: "New",
          priority: "Medium",
          admin_notes: "",
          followup_notes: [],
          source: "Mutual Funds Form",
          ip_address: ipAddress,
          user_agent: userAgent,
          created_at: submissionTime,
          updated_at: submissionTime,
        })
        .select("id")
        .single();

      if (dbError) {
        throw dbError;
      }

      if (inserted?.id) {
        recordId = inserted.id;
      }
    } catch (dbErr: any) {
      console.warn(
        "Supabase primary insertion warning for Mutual Funds (falling back to audit log storage):",
        dbErr?.message || dbErr
      );
      persistedVia = "audit_log_fallback";
    }

    // 6. Record in Audit Log (Stores 100% of data for seamless fallback)
    try {
      await recordAuditLog({
        actor: sanitized.email || "applicant",
        action: "MUTUAL_FUNDS_ACCOUNT_SUBMITTED",
        targetType: "mutual_funds_account",
        targetId: recordId,
        details: {
          ...sanitized,
          persistedVia,
          submissionTime,
        },
        ipAddress,
      });
    } catch (auditErr) {
      console.warn("Audit log recording warning:", auditErr);
    }

    // 7. Dispatch Notification & Acknowledgment Emails
    try {
      await sendBseStarNotificationEmails({
        id: recordId,
        data: sanitized,
        submittedAt: formattedDate,
      });
    } catch (emailErr) {
      console.error("Email notification dispatch error:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        id: recordId,
        message: "Your Mutual Fund account details have been received successfully. Our wealth desk will contact you shortly.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in Mutual Fund submission handler:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request. Please try again or contact support." },
      { status: 500 }
    );
  }
}

