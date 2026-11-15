import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseServer } from "@/lib/supabase-server";
import { recordAuditLog } from "@/lib/audit";
import { validateLifeInsuranceProposal } from "@/lib/life-insurance-validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim();
    const status = (searchParams.get("status") || "").trim();
    const employmentType = (searchParams.get("employmentType") || "").trim();

    let dbQuery = supabaseServer
      .from("life_insurance_proposals")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && status !== "ALL") {
      const lower = status.toLowerCase();
      dbQuery = dbQuery.or(`status.eq.${status},status.eq.${lower}`);
    }
    if (employmentType && employmentType !== "ALL") {
      dbQuery = dbQuery.eq("employment_type", employmentType);
    }
    if (query) {
      dbQuery = dbQuery.or(
        `full_name.ilike.%${query}%,proposer_email.ilike.%${query}%,proposer_mobile.ilike.%${query}%,pan_number.ilike.%${query}%,company_name.ilike.%${query}%`
      );
    }

    const { data: proposals, error } = await dbQuery;

    if (error) {
      // Seamless Fail-Safe if life_insurance_proposals table has not yet been executed in Supabase
      if (
        error.code === "PGRST205" ||
        error.code === "42P01" ||
        error.message?.includes("schema cache") ||
        error.message?.includes("does not exist")
      ) {
        const { data: auditRows } = await supabaseServer
          .from("audit_logs")
          .select("*")
          .eq("action", "LIFE_INSURANCE_PROPOSAL_SUBMITTED")
          .order("created_at", { ascending: false });

        const fallbackProposals = (auditRows || []).map((row: any) => ({
          id: row.target_id || row.id,
          full_name: row.details?.fullName || row.details?.full_name || "Applicant",
          proposer_email: row.details?.proposerEmail || row.details?.proposer_email || "",
          proposer_mobile: row.details?.proposerMobile || row.details?.proposer_mobile || "",
          marital_status: row.details?.maritalStatus || row.details?.marital_status || "Single",
          dob: row.details?.dob || "",
          qualification: row.details?.qualification || "Graduate",
          height: row.details?.height || "",
          weight: row.details?.weight || 0,
          mother_full_name: row.details?.motherFullName || row.details?.mother_full_name || "",
          father_full_name: row.details?.fatherFullName || row.details?.father_full_name || "",
          employment_type: row.details?.employmentType || row.details?.employment_type || "Salaried Employee",
          has_existing_policies: Boolean(row.details?.hasExistingPolicies ?? row.details?.has_existing_policies),
          existing_coverage: row.details?.existingCoverage || row.details?.existing_coverage || "0",
          current_address: row.details?.currentAddress || row.details?.current_address || "",

          company_name: row.details?.companyName || row.details?.company_name || "",
          designation: row.details?.designation || "",
          company_email: row.details?.companyEmail || row.details?.company_email || "",
          industry: row.details?.industry || "",
          annual_income: row.details?.annualIncome || row.details?.annual_income || "",

          has_pre_existing_illness: Boolean(row.details?.hasPreExistingIllness ?? row.details?.has_pre_existing_illness),
          pre_existing_details: row.details?.preExistingDetails || row.details?.pre_existing_details || "",
          is_smoker: Boolean(row.details?.isSmoker ?? row.details?.is_smoker),
          is_drinker: Boolean(row.details?.isDrinker ?? row.details?.is_drinker),
          chews_tobacco: Boolean(row.details?.chewsTobacco ?? row.details?.chews_tobacco),

          nominee_name: row.details?.nomineeName || row.details?.nominee_name || "",
          is_nominee_minor: Boolean(row.details?.isNomineeMinor ?? row.details?.is_nominee_minor),
          nominee_relation: row.details?.nomineeRelation || row.details?.nominee_relation || "Spouse",
          nominee_dob: row.details?.nomineeDob || row.details?.nominee_dob || "",
          nominee_address_option: row.details?.nomineeAddressOption || row.details?.nominee_address_option || "Same as Insured person address",
          nominee_address: row.details?.nomineeAddress || row.details?.nominee_address || "",
          nominee_mobile: row.details?.nomineeMobile || row.details?.nominee_mobile || "",
          nominee_email: row.details?.nomineeEmail || row.details?.nominee_email || "",
          nominee_bank_name: row.details?.nomineeBankName || row.details?.nominee_bank_name || "",
          nominee_bank_account_name: row.details?.nomineeBankAccountName || row.details?.nominee_bank_account_name || "",
          nominee_bank_ifsc: row.details?.nomineeBankIfsc || row.details?.nominee_bank_ifsc || "",
          nominee_bank_account_number: row.details?.nomineeBankAccountNumber || row.details?.nominee_bank_account_number || "",
          nominee_bank_account_type: row.details?.nomineeBankAccountType || row.details?.nominee_bank_account_type || "Savings",

          aadhar_number: row.details?.aadharNumber || row.details?.aadhar_number || "",
          pan_number: row.details?.panNumber || row.details?.pan_number || "",
          proposer_bank_name: row.details?.proposerBankName || row.details?.proposer_bank_name || "",
          proposer_bank_account_number: row.details?.proposerBankAccountNumber || row.details?.proposer_bank_account_number || "",
          proposer_bank_ifsc: row.details?.proposerBankIfsc || row.details?.proposer_bank_ifsc || "",
          proposer_bank_branch: row.details?.proposerBankBranch || row.details?.proposer_bank_branch || "",
          proposer_bank_account_name: row.details?.proposerBankAccountName || row.details?.proposer_bank_account_name || "",

          aadhar_files: row.details?.aadharFiles || row.details?.aadhar_files || [],
          pan_files: row.details?.panFiles || row.details?.pan_files || [],
          selfie_files: row.details?.selfieFiles || row.details?.selfie_files || [],
          cheque_files: row.details?.chequeFiles || row.details?.cheque_files || [],
          company_id_files: row.details?.companyIdFiles || row.details?.company_id_files || [],
          payslip_files: row.details?.payslipFiles || row.details?.payslip_files || [],
          other_files: row.details?.otherFiles || row.details?.other_files || [],
          client_notes: row.details?.clientNotes || row.details?.client_notes || "",

          consent_contact_accepted: true,
          consent_disclosure_accepted: true,
          status: row.details?.status || "New",
          priority: row.details?.priority || "Medium",
          admin_notes: row.details?.admin_notes || "",
          followup_notes: row.details?.followup_notes || [],
          source: "Life Insurance Form (Fallback)",
          ip_address: row.ip_address,
          created_at: row.created_at,
          updated_at: row.created_at,
        }));

        const filtered = fallbackProposals.filter((p) => {
          if (status && status !== "ALL" && p.status !== status) return false;
          if (employmentType && employmentType !== "ALL" && p.employment_type !== employmentType) return false;
          if (query) {
            const q = query.toLowerCase();
            return (
              p.full_name.toLowerCase().includes(q) ||
              p.proposer_email.toLowerCase().includes(q) ||
              p.proposer_mobile.includes(q) ||
              p.pan_number.toLowerCase().includes(q) ||
              p.company_name.toLowerCase().includes(q)
            );
          }
          return true;
        });

        return NextResponse.json({
          proposals: filtered,
          total: filtered.length,
          source: "audit_fallback",
        });
      }

      console.error("Failed to query life_insurance_proposals:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const mappedProposals = (proposals || []).map((p: any) => ({
      ...p,
      status:
        p.status === "new"
          ? "New"
          : p.status === "under_review"
          ? "Under Review"
          : p.status === "medical_pending"
          ? "Medical Scheduled"
          : p.status === "policy_issued"
          ? "Policy Issued"
          : p.status === "rejected"
          ? "Rejected"
          : p.status || "New",
    }));

    return NextResponse.json({
      proposals: mappedProposals,
      total: mappedProposals.length,
      source: "primary_db",
    });
  } catch (err: any) {
    console.error("GET /api/admin/life-insurance-proposals error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Bulk Import
export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const body = await request.json().catch(() => ({}));

    const itemsToProcess = Array.isArray(body) ? body : body.items ? body.items : [body];
    if (itemsToProcess.length === 0) {
      return NextResponse.json({ error: "No records provided for import." }, { status: 400 });
    }

    const insertedRows: any[] = [];
    const errors: any[] = [];

    for (let i = 0; i < itemsToProcess.length; i++) {
      const raw = itemsToProcess[i];
      const validation = validateLifeInsuranceProposal(raw);

      if (!validation.isValid) {
        errors.push({ index: i, errors: validation.errors });
        continue;
      }

      const { sanitized } = validation;
      const submissionTime = new Date().toISOString();

      try {
        const { data: inserted, error: dbErr } = await supabaseServer
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
            consent_contact_accepted: true,
            consent_disclosure_accepted: true,
            status: raw.status || "New",
            priority: raw.priority || "Medium",
            admin_notes: raw.admin_notes || "",
            followup_notes: raw.followup_notes || [],
            source: raw.source || "Admin Import",
            ip_address: ipAddress,
            created_at: raw.created_at || submissionTime,
            updated_at: submissionTime,
          })
          .select("id")
          .single();

        if (dbErr) {
          errors.push({ index: i, error: dbErr.message });
        } else if (inserted) {
          insertedRows.push(inserted);
        }
      } catch (err: any) {
        errors.push({ index: i, error: err?.message || "Insert failed" });
      }
    }

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "LIFE_INSURANCE_PROPOSALS_IMPORTED",
      targetType: "life_insurance_proposals",
      details: {
        totalReceived: itemsToProcess.length,
        successfulInserts: insertedRows.length,
        failedCount: errors.length,
      },
      ipAddress,
    });

    return NextResponse.json({
      success: true,
      importedCount: insertedRows.length,
      failedCount: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err: any) {
    console.error("POST /api/admin/life-insurance-proposals error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

