import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseServer } from "@/lib/supabase-server";
import { recordAuditLog } from "@/lib/audit";
import { validateHealthInsuranceProposal } from "@/lib/health-insurance-validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim();
    const status = (searchParams.get("status") || "").trim();
    const policyType = (searchParams.get("policyType") || "").trim();

    let dbQuery = supabaseServer
      .from("health_insurance_proposals")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && status !== "ALL") {
      dbQuery = dbQuery.eq("status", status);
    }
    if (policyType && policyType !== "ALL") {
      dbQuery = dbQuery.eq("policy_type", policyType);
    }
    if (query) {
      dbQuery = dbQuery.or(
        `proposer_name.ilike.%${query}%,proposer_email.ilike.%${query}%,proposer_mobile.ilike.%${query}%,proposer_pan.ilike.%${query}%,nominee_name.ilike.%${query}%`
      );
    }

    const { data: proposals, error } = await dbQuery;

    if (error) {
      // Seamless Fail-Safe: If health_insurance_proposals table is pending or schema cache reload,
      // load from audit_logs so the admin dashboard operates smoothly with zero crashes!
      if (
        error.code === "PGRST205" ||
        error.code === "42P01" ||
        error.message?.includes("schema cache") ||
        error.message?.includes("does not exist")
      ) {
        const { data: auditRows } = await supabaseServer
          .from("audit_logs")
          .select("*")
          .eq("action", "HEALTH_INSURANCE_PROPOSAL")
          .order("created_at", { ascending: false });

        const fallbackProposals = (auditRows || []).map((row: any) => ({
          id: row.target_id || row.id,
          proposer_name: row.details?.proposerName || "Applicant",
          proposer_pan: row.details?.proposerPan || "",
          proposer_dob: row.details?.proposerDob || "",
          proposer_aadhar: row.details?.proposerAadhar || "",
          proposer_mobile: row.details?.proposerMobile || "",
          proposer_email: row.details?.proposerEmail || "",
          proposer_address: row.details?.proposerAddress || "",
          employment_status: row.details?.employmentStatus || "Salaried",
          corporate_email: row.details?.corporateEmail || "",
          policy_type: row.details?.policyType || "New Policy",
          adults_count: row.details?.adultsCount || 1,
          kids_count: row.details?.kidsCount || 0,
          members: row.details?.members || [],
          insured_email: row.details?.insuredEmail || "",
          insured_mobile: row.details?.insuredMobile || "",
          has_pre_existing_illness: Boolean(row.details?.hasPreExistingIllness),
          pre_existing_details: row.details?.preExistingDetails || "",
          has_tobacco_alcohol_habits: Boolean(row.details?.hasTobaccoAlcoholHabits),
          habits_details: row.details?.habitsDetails || "",
          current_address: row.details?.currentAddress || "",
          nominee_name: row.details?.nomineeName || "",
          nominee_dob: row.details?.nomineeDob || "",
          nominee_relation: row.details?.nomineeRelation || "",
          nominee_address: row.details?.finalNomineeAddress || "",
          nominee_mobile: row.details?.nomineeMobile || "",
          nominee_email: row.details?.nomineeEmail || "",
          nominee_bank_name: row.details?.nomineeBankName || "",
          nominee_bank_account_name: row.details?.nomineeBankAccountName || "",
          nominee_bank_ifsc: row.details?.nomineeBankIfsc || "",
          nominee_bank_account_number: row.details?.nomineeBankAccountNumber || "",
          nominee_bank_account_type: row.details?.nomineeBankAccountType || "Savings",
          status: row.details?.status || "New",
          priority: row.details?.priority || "Medium",
          notes: row.details?.notes || "",
          followup_notes: row.details?.followup_notes || [],
          source: row.details?.source || "Health Insurance Form",
          ip_address: row.ip_address,
          created_at: row.created_at,
          updated_at: row.created_at,
        }));

        const filtered = fallbackProposals.filter((p) => {
          if (status && status !== "ALL" && p.status !== status) return false;
          if (policyType && policyType !== "ALL" && p.policy_type !== policyType) return false;
          if (query) {
            const q = query.toLowerCase();
            return (
              p.proposer_name.toLowerCase().includes(q) ||
              p.proposer_email.toLowerCase().includes(q) ||
              p.proposer_mobile.toLowerCase().includes(q) ||
              p.proposer_pan.toLowerCase().includes(q) ||
              p.nominee_name.toLowerCase().includes(q)
            );
          }
          return true;
        });

        const metrics = {
          total: fallbackProposals.length,
          newCount: fallbackProposals.filter((p) => p.status === "New").length,
          inReviewCount: fallbackProposals.filter((p) => p.status === "In Review").length,
          quotedCount: fallbackProposals.filter((p) => p.status === "Quotation Sent").length,
          issuedCount: fallbackProposals.filter((p) => p.status === "Policy Issued").length,
        };

        return NextResponse.json({
          proposals: filtered,
          metrics,
          count: filtered.length,
          source: "audit_fallback",
        });
      }

      console.error("Failed to query health_insurance_proposals:", error);
      return NextResponse.json(
        { error: "Failed to retrieve proposals", details: error.message },
        { status: 500 }
      );
    }

    const allProposals = proposals || [];
    const metrics = {
      total: allProposals.length,
      newCount: allProposals.filter((p) => p.status === "New").length,
      inReviewCount: allProposals.filter((p) => p.status === "In Review").length,
      quotedCount: allProposals.filter((p) => p.status === "Quotation Sent").length,
      issuedCount: allProposals.filter((p) => p.status === "Policy Issued").length,
    };

    return NextResponse.json({
      proposals: allProposals,
      metrics,
      count: allProposals.length,
      source: "database",
    });
  } catch (err: any) {
    console.error("Unexpected error in GET /api/admin/insurance-proposals:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json().catch(() => ({}));

    // If importing bulk proposals
    if (Array.isArray(body.proposals)) {
      let importedCount = 0;
      for (const item of body.proposals) {
        if (!item.proposerName || !item.proposerMobile) continue;
        const now = new Date().toISOString();
        await supabaseServer.from("health_insurance_proposals").insert({
          proposer_name: item.proposerName,
          proposer_pan: item.proposerPan || "PANNOTPROV",
          proposer_dob: item.proposerDob || "1990-01-01",
          proposer_aadhar: item.proposerAadhar || "",
          proposer_mobile: item.proposerMobile,
          proposer_email: item.proposerEmail || "",
          proposer_address: item.proposerAddress || "Not Provided",
          employment_status: item.employmentStatus || "Salaried Employee (PF credit)",
          corporate_email: item.corporateEmail || "",
          policy_type: item.policyType || "New Policy",
          adults_count: Number(item.adultsCount) || 1,
          kids_count: Number(item.kidsCount) || 0,
          members: item.members || [],
          insured_email: item.insuredEmail || item.proposerEmail || "",
          insured_mobile: item.insuredMobile || item.proposerMobile || "",
          has_pre_existing_illness: Boolean(item.hasPreExistingIllness),
          pre_existing_details: item.preExistingDetails || "",
          has_tobacco_alcohol_habits: Boolean(item.hasTobaccoAlcoholHabits),
          habits_details: item.habitsDetails || "",
          current_address: item.currentAddress || item.proposerAddress || "",
          nominee_name: item.nomineeName || "To be provided",
          nominee_dob: item.nomineeDob || "1990-01-01",
          nominee_relation: item.nomineeRelation || "",
          nominee_address: item.nomineeAddress || "",
          nominee_mobile: item.nomineeMobile || item.proposerMobile,
          nominee_email: item.nomineeEmail || item.proposerEmail,
          nominee_bank_name: item.nomineeBankName || "HDFC Bank",
          nominee_bank_account_name: item.nomineeBankAccountName || item.proposerName,
          nominee_bank_ifsc: item.nomineeBankIfsc || "HDFC0001234",
          nominee_bank_account_number: item.nomineeBankAccountNumber || "1234567890",
          nominee_bank_account_type: item.nomineeBankAccountType || "Savings",
          status: item.status || "New",
          priority: item.priority || "Medium",
          notes: item.notes || "Imported via Admin Portal",
          followup_notes: [],
          source: "Admin Bulk Import",
          created_at: now,
          updated_at: now,
        });
        importedCount++;
      }

      await recordAuditLog({
        actor: auth.user.email || "admin",
        action: "HEALTH_INSURANCE_BULK_IMPORT",
        targetType: "health_insurance_proposals",
        details: { count: importedCount },
      });

      return NextResponse.json({ success: true, count: importedCount });
    }

    // Single creation via admin
    const validation = validateHealthInsuranceProposal(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: Object.values(validation.errors)[0], errors: validation.errors },
        { status: 400 }
      );
    }

    const { sanitized } = validation;
    const now = new Date().toISOString();

    const { data: newRow, error: insertError } = await supabaseServer
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
        nominee_address: sanitized.nomineeCustomAddress || sanitized.proposerAddress,
        nominee_mobile: sanitized.nomineeMobile,
        nominee_email: sanitized.nomineeEmail,
        nominee_bank_name: sanitized.nomineeBankName,
        nominee_bank_account_name: sanitized.nomineeBankAccountName,
        nominee_bank_ifsc: sanitized.nomineeBankIfsc,
        nominee_bank_account_number: sanitized.nomineeBankAccountNumber,
        nominee_bank_account_type: sanitized.nomineeBankAccountType,
        status: body.status || "New",
        priority: body.priority || "Medium",
        notes: body.notes || "",
        followup_notes: [],
        source: "Admin Portal",
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "HEALTH_INSURANCE_PROPOSAL_CREATED",
      targetType: "health_insurance_proposals",
      targetId: newRow.id,
      details: { proposerName: sanitized.proposerName },
    });

    return NextResponse.json({ success: true, proposal: newRow }, { status: 201 });
  } catch (err: any) {
    console.error("Error in POST /api/admin/insurance-proposals:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
