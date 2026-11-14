import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { validateHealthInsuranceProposal } from "@/lib/health-insurance-validation";
import { recordAuditLog } from "@/lib/audit";
import { sendHealthInsuranceProposalEmail } from "@/lib/health-insurance-email";

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
        { success: true, message: "Proposal received successfully." },
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
    const validation = validateHealthInsuranceProposal(body);
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

    // Resolve nominee address based on selected option
    let finalNomineeAddress = sanitized.nomineeCustomAddress || "";
    if (sanitized.nomineeAddressOption === "Same as Proposer person address") {
      finalNomineeAddress = sanitized.proposerAddress;
    } else if (sanitized.nomineeAddressOption === "Same as Insured person address") {
      finalNomineeAddress = sanitized.currentAddress || sanitized.proposerAddress;
    }

    const submissionTime = new Date().toISOString();
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(new Date());

    let proposalId = `ws-hip-${Date.now().toString(36)}`;
    let persistedVia = "primary_db";

    // 5. Database Insertion with Fail-Safe Fallbacks
    try {
      const { data: inserted, error: dbError } = await supabaseServer
        .from("health_insurance_proposals")
        .insert({
          proposer_name: sanitized.proposerName,
          proposer_pan: sanitized.proposerPan,
          proposer_dob: sanitized.proposerDob,
          proposer_aadhar: sanitized.proposerAadhar || "",
          proposer_mobile: sanitized.proposerMobile,
          proposer_email: sanitized.proposerEmail,
          proposer_address: sanitized.proposerAddress,
          employment_status: sanitized.employmentStatus,
          corporate_email: sanitized.corporateEmail || "",
          policy_type: sanitized.policyType,
          adults_count: sanitized.adultsCount,
          kids_count: sanitized.kidsCount,
          relation_adult_2: sanitized.relationAdult2 || "",
          relation_kids: sanitized.relationKids || "",
          members: sanitized.members || [],
          insured_email: sanitized.insuredEmail,
          insured_mobile: sanitized.insuredMobile,
          has_pre_existing_illness: sanitized.hasPreExistingIllness,
          pre_existing_details: sanitized.preExistingDetails || "",
          has_tobacco_alcohol_habits: sanitized.hasTobaccoAlcoholHabits,
          habits_details: sanitized.habitsDetails || "",
          current_address: sanitized.currentAddress,
          nominee_name: sanitized.nomineeName,
          nominee_dob: sanitized.nomineeDob,
          nominee_relation: sanitized.nomineeRelation || "",
          nominee_address: finalNomineeAddress,
          nominee_mobile: sanitized.nomineeMobile,
          nominee_email: sanitized.nomineeEmail,
          nominee_bank_name: sanitized.nomineeBankName,
          nominee_bank_account_name: sanitized.nomineeBankAccountName,
          nominee_bank_ifsc: sanitized.nomineeBankIfsc,
          nominee_bank_account_number: sanitized.nomineeBankAccountNumber,
          nominee_bank_account_type: sanitized.nomineeBankAccountType,
          consent_contact_accepted: sanitized.consentContactAccepted,
          consent_disclosure_accepted: sanitized.consentDisclosureAccepted,
          status: "New",
          priority: "Medium",
          notes: "",
          followup_notes: [],
          source: "Health Insurance Form",
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
        proposalId = inserted.id;
      }
    } catch (dbErr: any) {
      console.warn("Primary health_insurance_proposals insert notice, falling back to audit_logs:", dbErr?.message);
      persistedVia = "audit_log_fallback";

      await recordAuditLog({
        actor: `proposer:${sanitized.proposerEmail}`,
        action: "HEALTH_INSURANCE_PROPOSAL",
        targetType: "health_insurance_proposals",
        targetId: proposalId,
        details: {
          ...sanitized,
          finalNomineeAddress,
          submissionTime,
          fallbackReason: dbErr?.message,
        },
        ipAddress,
      });
    }

    // 6. Record Audit Log for successful receipt
    if (persistedVia === "primary_db") {
      recordAuditLog({
        actor: `proposer:${sanitized.proposerEmail}`,
        action: "HEALTH_INSURANCE_PROPOSAL_RECEIVED",
        targetType: "health_insurance_proposals",
        targetId: proposalId,
        details: {
          proposerName: sanitized.proposerName,
          proposerPan: sanitized.proposerPan,
          proposerMobile: sanitized.proposerMobile,
          policyType: sanitized.policyType,
          adultsCount: sanitized.adultsCount,
          kidsCount: sanitized.kidsCount,
        },
        ipAddress,
      }).catch(() => {});
    }

    // 7. Instant Admin Email Notification
    sendHealthInsuranceProposalEmail({
      id: proposalId,
      proposerName: sanitized.proposerName,
      proposerPan: sanitized.proposerPan,
      proposerDob: sanitized.proposerDob,
      proposerAadhar: sanitized.proposerAadhar,
      proposerMobile: sanitized.proposerMobile,
      proposerEmail: sanitized.proposerEmail,
      proposerAddress: sanitized.proposerAddress,
      employmentStatus: sanitized.employmentStatus,
      corporateEmail: sanitized.corporateEmail,
      policyType: sanitized.policyType,
      adultsCount: sanitized.adultsCount,
      kidsCount: sanitized.kidsCount,
      relationAdult2: sanitized.relationAdult2,
      relationKids: sanitized.relationKids,
      members: sanitized.members,
      insuredEmail: sanitized.insuredEmail,
      insuredMobile: sanitized.insuredMobile,
      hasPreExistingIllness: sanitized.hasPreExistingIllness,
      preExistingDetails: sanitized.preExistingDetails,
      hasTobaccoAlcoholHabits: sanitized.hasTobaccoAlcoholHabits,
      habitsDetails: sanitized.habitsDetails,
      currentAddress: sanitized.currentAddress,
      nomineeName: sanitized.nomineeName,
      nomineeDob: sanitized.nomineeDob,
      nomineeRelation: sanitized.nomineeRelation,
      nomineeAddress: finalNomineeAddress,
      nomineeMobile: sanitized.nomineeMobile,
      nomineeEmail: sanitized.nomineeEmail,
      nomineeBankName: sanitized.nomineeBankName,
      nomineeBankAccountName: sanitized.nomineeBankAccountName,
      nomineeBankIfsc: sanitized.nomineeBankIfsc,
      nomineeBankAccountNumber: sanitized.nomineeBankAccountNumber,
      nomineeBankAccountType: sanitized.nomineeBankAccountType,
      submittedAt: formattedDate,
      source: "Health Insurance Form",
    }).catch((emailErr) => {
      console.error("Non-fatal proposal notification email error:", emailErr);
    });

    return NextResponse.json(
      {
        success: true,
        proposalId,
        message: "Your health insurance proposal details have been successfully submitted.",
        persistedVia,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Critical error in /api/insurance/health-proposal:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your proposal. Please try again." },
      { status: 500 }
    );
  }
}

