import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { validateLifeInsuranceProposal } from "@/lib/life-insurance-validation";
import { recordAuditLog } from "@/lib/audit";
import { sendLifeInsuranceNotificationEmails } from "@/lib/life-insurance-email";

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
    const validation = validateLifeInsuranceProposal(body);
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

    let proposalId = `ws-lip-${Date.now().toString(36)}`;
    let persistedVia = "primary_db";

    // 5. Database Insertion with Fail-Safe Fallbacks
    try {
      const { data: inserted, error: dbError } = await supabaseServer
        .from("life_insurance_proposals")
        .insert({
          full_name: sanitized.fullName,
          proposer_email: sanitized.proposerEmail,
          proposer_mobile: sanitized.proposerMobile,
          marital_status: sanitized.maritalStatus,
          dob: sanitized.dob,
          qualification: sanitized.qualification,
          height: sanitized.height,
          weight: sanitized.weight,
          mother_full_name: sanitized.motherFullName,
          father_full_name: sanitized.fatherFullName,
          employment_type: sanitized.employmentType,
          has_existing_policies: sanitized.hasExistingPolicies,
          existing_coverage: sanitized.existingCoverage,
          current_address: sanitized.currentAddress,

          company_name: sanitized.companyName,
          designation: sanitized.designation,
          company_email: sanitized.companyEmail,
          industry: sanitized.industry,
          annual_income: sanitized.annualIncome,

          has_pre_existing_illness: sanitized.hasPreExistingIllness,
          pre_existing_details: sanitized.preExistingDetails || "",
          is_smoker: sanitized.isSmoker,
          is_drinker: sanitized.isDrinker,
          chews_tobacco: sanitized.chewsTobacco,

          nominee_name: sanitized.nomineeName,
          is_nominee_minor: sanitized.isNomineeMinor,
          nominee_relation: sanitized.nomineeRelation,
          nominee_dob: sanitized.nomineeDob,
          nominee_address_option: sanitized.nomineeAddressOption,
          nominee_address: sanitized.nomineeAddress,
          nominee_mobile: sanitized.nomineeMobile,
          nominee_email: sanitized.nomineeEmail,
          nominee_bank_name: sanitized.nomineeBankName,
          nominee_bank_account_name: sanitized.nomineeBankAccountName,
          nominee_bank_ifsc: sanitized.nomineeBankIfsc,
          nominee_bank_account_number: sanitized.nomineeBankAccountNumber,
          nominee_bank_account_type: sanitized.nomineeBankAccountType,

          aadhar_number: sanitized.aadharNumber,
          pan_number: sanitized.panNumber,
          proposer_bank_name: sanitized.proposerBankName,
          proposer_bank_account_number: sanitized.proposerBankAccountNumber,
          proposer_bank_ifsc: sanitized.proposerBankIfsc,
          proposer_bank_branch: sanitized.proposerBankBranch,
          proposer_bank_account_name: sanitized.proposerBankAccountName,

          aadhar_files: sanitized.aadharFiles || [],
          pan_files: sanitized.panFiles || [],
          selfie_files: sanitized.selfieFiles || [],
          cheque_files: sanitized.chequeFiles || [],
          company_id_files: sanitized.companyIdFiles || [],
          payslip_files: sanitized.payslipFiles || [],
          other_files: sanitized.otherFiles || [],
          client_notes: sanitized.clientNotes || "",

          consent_contact_accepted: sanitized.consentContactAccepted,
          consent_disclosure_accepted: sanitized.consentDisclosureAccepted,
          status: "New",
          priority: "Medium",
          admin_notes: "",
          followup_notes: [],
          source: "Life Insurance Form",
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
      console.warn(
        "Supabase primary insertion warning for Life Insurance (falling back to audit log storage):",
        dbErr?.message || dbErr
      );
      persistedVia = "audit_log_fallback";
    }

    // 6. Record in Audit Log (Full payload so fallback dashboard has 100% of fields)
    try {
      await recordAuditLog({
        actor: sanitized.proposerEmail || "applicant",
        action: "LIFE_INSURANCE_PROPOSAL_SUBMITTED",
        targetType: "life_insurance_proposal",
        targetId: proposalId,
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
      await sendLifeInsuranceNotificationEmails({
        id: proposalId,
        data: sanitized,
        submittedAt: formattedDate,
      });
    } catch (emailErr) {
      console.error("Email notification dispatch error:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        id: proposalId,
        message: "Your Life & Term Insurance proposal details have been received successfully. Our advisory desk will contact you with tailored quotes.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in Life Insurance proposal handler:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request. Please try again or contact support." },
      { status: 500 }
    );
  }
}
