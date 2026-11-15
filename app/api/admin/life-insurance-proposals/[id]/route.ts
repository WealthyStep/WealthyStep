import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseServer } from "@/lib/supabase-server";
import { recordAuditLog } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const { id } = await params;

    // 1. Try Primary DB
    const { data: proposal } = await supabaseServer
      .from("life_insurance_proposals")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (proposal) {
      const mapped = {
        ...proposal,
        status:
          proposal.status === "new"
            ? "New"
            : proposal.status === "under_review"
            ? "Under Review"
            : proposal.status === "medical_pending"
            ? "Medical Scheduled"
            : proposal.status === "policy_issued"
            ? "Policy Issued"
            : proposal.status === "rejected"
            ? "Rejected"
            : proposal.status || "New",
      };
      return NextResponse.json({ proposal: mapped });
    }

    // 2. Audit Log Fallback
    const { data: auditRow } = await supabaseServer
      .from("audit_logs")
      .select("*")
      .eq("target_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (auditRow) {
      const fallback = {
        id: auditRow.target_id || auditRow.id,
        full_name: auditRow.details?.fullName || auditRow.details?.full_name || "Applicant",
        proposer_email: auditRow.details?.proposerEmail || auditRow.details?.proposer_email || "",
        proposer_mobile: auditRow.details?.proposerMobile || auditRow.details?.proposer_mobile || "",
        marital_status: auditRow.details?.maritalStatus || auditRow.details?.marital_status || "Single",
        dob: auditRow.details?.dob || "",
        qualification: auditRow.details?.qualification || "Graduate",
        height: auditRow.details?.height || "",
        weight: auditRow.details?.weight || 0,
        mother_full_name: auditRow.details?.motherFullName || auditRow.details?.mother_full_name || "",
        father_full_name: auditRow.details?.fatherFullName || auditRow.details?.father_full_name || "",
        employment_type: auditRow.details?.employmentType || auditRow.details?.employment_type || "Salaried Employee",
        has_existing_policies: Boolean(auditRow.details?.hasExistingPolicies ?? auditRow.details?.has_existing_policies),
        existing_coverage: auditRow.details?.existingCoverage || auditRow.details?.existing_coverage || "0",
        current_address: auditRow.details?.currentAddress || auditRow.details?.current_address || "",

        company_name: auditRow.details?.companyName || auditRow.details?.company_name || "",
        designation: auditRow.details?.designation || "",
        company_email: auditRow.details?.companyEmail || auditRow.details?.company_email || "",
        industry: auditRow.details?.industry || "",
        annual_income: auditRow.details?.annualIncome || auditRow.details?.annual_income || "",

        has_pre_existing_illness: Boolean(auditRow.details?.hasPreExistingIllness ?? auditRow.details?.has_pre_existing_illness),
        pre_existing_details: auditRow.details?.preExistingDetails || auditRow.details?.pre_existing_details || "",
        is_smoker: Boolean(auditRow.details?.isSmoker ?? auditRow.details?.is_smoker),
        is_drinker: Boolean(auditRow.details?.isDrinker ?? auditRow.details?.is_drinker),
        chews_tobacco: Boolean(auditRow.details?.chewsTobacco ?? auditRow.details?.chews_tobacco),

        nominee_name: auditRow.details?.nomineeName || auditRow.details?.nominee_name || "",
        is_nominee_minor: Boolean(auditRow.details?.isNomineeMinor ?? auditRow.details?.is_nominee_minor),
        nominee_relation: auditRow.details?.nomineeRelation || auditRow.details?.nominee_relation || "Spouse",
        nominee_dob: auditRow.details?.nomineeDob || auditRow.details?.nominee_dob || "",
        nominee_address_option: auditRow.details?.nomineeAddressOption || auditRow.details?.nominee_address_option || "Same as Insured person address",
        nominee_address: auditRow.details?.nomineeAddress || auditRow.details?.nominee_address || "",
        nominee_mobile: auditRow.details?.nomineeMobile || auditRow.details?.nominee_mobile || "",
        nominee_email: auditRow.details?.nomineeEmail || auditRow.details?.nominee_email || "",
        nominee_bank_name: auditRow.details?.nomineeBankName || auditRow.details?.nominee_bank_name || "",
        nominee_bank_account_name: auditRow.details?.nomineeBankAccountName || auditRow.details?.nominee_bank_account_name || "",
        nominee_bank_ifsc: auditRow.details?.nomineeBankIfsc || auditRow.details?.nominee_bank_ifsc || "",
        nominee_bank_account_number: auditRow.details?.nomineeBankAccountNumber || auditRow.details?.nominee_bank_account_number || "",
        nominee_bank_account_type: auditRow.details?.nomineeBankAccountType || auditRow.details?.nominee_bank_account_type || "Savings",

        aadhar_number: auditRow.details?.aadharNumber || auditRow.details?.aadhar_number || "",
        pan_number: auditRow.details?.panNumber || auditRow.details?.pan_number || "",
        proposer_bank_name: auditRow.details?.proposerBankName || auditRow.details?.proposer_bank_name || "",
        proposer_bank_account_number: auditRow.details?.proposerBankAccountNumber || auditRow.details?.proposer_bank_account_number || "",
        proposer_bank_ifsc: auditRow.details?.proposerBankIfsc || auditRow.details?.proposer_bank_ifsc || "",
        proposer_bank_branch: auditRow.details?.proposerBankBranch || auditRow.details?.proposer_bank_branch || "",
        proposer_bank_account_name: auditRow.details?.proposerBankAccountName || auditRow.details?.proposer_bank_account_name || "",

        aadhar_files: auditRow.details?.aadharFiles || auditRow.details?.aadhar_files || [],
        pan_files: auditRow.details?.panFiles || auditRow.details?.pan_files || [],
        selfie_files: auditRow.details?.selfieFiles || auditRow.details?.selfie_files || [],
        cheque_files: auditRow.details?.chequeFiles || auditRow.details?.cheque_files || [],
        company_id_files: auditRow.details?.companyIdFiles || auditRow.details?.company_id_files || [],
        payslip_files: auditRow.details?.payslipFiles || auditRow.details?.payslip_files || [],
        other_files: auditRow.details?.otherFiles || auditRow.details?.other_files || [],
        client_notes: auditRow.details?.clientNotes || auditRow.details?.client_notes || "",

        consent_contact_accepted: true,
        consent_disclosure_accepted: true,
        status: auditRow.details?.status || "New",
        priority: auditRow.details?.priority || "Medium",
        admin_notes: auditRow.details?.admin_notes || "",
        followup_notes: auditRow.details?.followup_notes || [],
        source: "Life Insurance Form (Fallback)",
        created_at: auditRow.created_at,
        updated_at: auditRow.created_at,
      };
      return NextResponse.json({ proposal: fallback });
    }

    return NextResponse.json({ error: "Life insurance proposal not found" }, { status: 404 });
  } catch (err: any) {
    console.error("GET /api/admin/life-insurance-proposals/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const { id } = await params;
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const body = await request.json().catch(() => ({}));

    // 1. Check Primary DB
    const { data: dbExisting } = await supabaseServer
      .from("life_insurance_proposals")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (dbExisting) {
      const updates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (body.status !== undefined) {
        const statusMap: Record<string, string> = {
          "New": "new",
          "new": "new",
          "Under Review": "under_review",
          "under_review": "under_review",
          "Medical Scheduled": "medical_pending",
          "medical_pending": "medical_pending",
          "Policy Issued": "policy_issued",
          "policy_issued": "policy_issued",
          "Rejected": "rejected",
          "rejected": "rejected",
        };
        updates.status = statusMap[body.status] || body.status.toLowerCase();
      }

      if (body.newFollowupNote) {
        const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        const noteLine = `[${timestamp} | ${auth.user.email || "Admin"}]: ${String(body.newFollowupNote).trim()}`;
        updates.notes = dbExisting.notes ? `${noteLine}\n\n${dbExisting.notes}` : noteLine;
      } else if (body.admin_notes !== undefined || body.notes !== undefined) {
        updates.notes = body.notes ?? body.admin_notes;
      }

      const { data: updated, error: updateErr } = await supabaseServer
        .from("life_insurance_proposals")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();

      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }

      await recordAuditLog({
        actor: auth.user.email || "admin",
        action: "LIFE_INSURANCE_PROPOSAL_UPDATED",
        targetType: "life_insurance_proposal",
        targetId: id,
        details: { applicant: dbExisting.full_name, pan: dbExisting.pan_number, changes: updates },
        ipAddress,
      });

      return NextResponse.json({ success: true, proposal: updated });
    }

    // 2. Audit Log Fallback Update
    const { data: auditRow } = await supabaseServer
      .from("audit_logs")
      .select("*")
      .eq("target_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (auditRow) {
      const existingDetails = auditRow.details || {};
      const existingFollowups = Array.isArray(existingDetails.followup_notes)
        ? existingDetails.followup_notes
        : [];

      let updatedFollowups = existingFollowups;
      if (body.newFollowupNote) {
        updatedFollowups = [
          {
            id: `fn-${Date.now()}`,
            text: String(body.newFollowupNote).trim(),
            createdAt: new Date().toISOString(),
            author: auth.user.email || "Admin",
          },
          ...existingFollowups,
        ];
      }

      const updatedDetails = {
        ...existingDetails,
        status: body.status !== undefined ? body.status : existingDetails.status || "New",
        priority: body.priority !== undefined ? body.priority : existingDetails.priority || "Medium",
        admin_notes: body.admin_notes !== undefined ? body.admin_notes : existingDetails.admin_notes || "",
        followup_notes: updatedFollowups,
      };

      await supabaseServer
        .from("audit_logs")
        .update({ details: updatedDetails })
        .eq("id", auditRow.id);

      const returnedProposal = {
        id: auditRow.target_id || auditRow.id,
        full_name: updatedDetails.fullName || updatedDetails.full_name || "Applicant",
        ...updatedDetails,
      };

      return NextResponse.json({ success: true, proposal: returnedProposal });
    }

    return NextResponse.json({ error: "Proposal record not found" }, { status: 404 });
  } catch (err: any) {
    console.error("PATCH /api/admin/life-insurance-proposals/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const { id } = await params;
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // 1. Delete from Primary DB if present
    await supabaseServer
      .from("life_insurance_proposals")
      .delete()
      .eq("id", id);

    // 2. Also delete from Audit Log fallback if present
    await supabaseServer
      .from("audit_logs")
      .delete()
      .eq("target_id", id);

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "LIFE_INSURANCE_PROPOSAL_DELETED",
      targetType: "life_insurance_proposal",
      targetId: id,
      details: { deletedId: id },
      ipAddress,
    });

    return NextResponse.json({ success: true, message: "Proposal deleted successfully" });
  } catch (err: any) {
    console.error("DELETE /api/admin/life-insurance-proposals/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

