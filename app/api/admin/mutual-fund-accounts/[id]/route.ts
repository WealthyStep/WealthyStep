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
    const { data: account, error } = await supabaseServer
      .from("bse_star_mf_accounts")
      .select("*")
      .eq("id", id)
      .single();

    if (account) {
      return NextResponse.json({ account });
    }

    // 2. Fail-Safe: Audit Log Fallback
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
        mobile: auditRow.details?.mobile || "",
        email: auditRow.details?.email || "",
        dob: auditRow.details?.dob || "",
        place_of_birth: auditRow.details?.placeOfBirth || auditRow.details?.place_of_birth || "",
        occupation: auditRow.details?.occupation || "Salaried",
        present_address: auditRow.details?.presentAddress || auditRow.details?.present_address || "",
        permanent_address: auditRow.details?.permanentAddress || auditRow.details?.permanent_address || "",
        marital_status: auditRow.details?.maritalStatus || auditRow.details?.marital_status || "Single",
        marriage_date: auditRow.details?.marriageDate || auditRow.details?.marriage_date || "",
        blood_group: auditRow.details?.bloodGroup || auditRow.details?.blood_group || "",
        is_kyc_done: auditRow.details?.isKycDone || auditRow.details?.is_kyc_done || "No",
        aadhar_number: auditRow.details?.aadharNumber || auditRow.details?.aadhar_number || "",
        pan_number: auditRow.details?.panNumber || auditRow.details?.pan || auditRow.details?.pan_number || "",
        aadhar_files: auditRow.details?.aadharFiles || auditRow.details?.aadhar_files || [],
        pan_files: auditRow.details?.panFiles || auditRow.details?.pan_files || [],
        bank_files: auditRow.details?.bankFiles || auditRow.details?.bank_files || [],
        bank_name: auditRow.details?.bankName || auditRow.details?.bank_name || "",
        bank_branch: auditRow.details?.bankBranch || auditRow.details?.bank_branch || "",
        bank_address: auditRow.details?.bankAddress || auditRow.details?.bank_address || "",
        account_number: auditRow.details?.accountNumber || "",
        account_type: auditRow.details?.accountType || auditRow.details?.account_type || "Savings",
        bank_city: auditRow.details?.bankCity || auditRow.details?.bank_city || "",
        pin_code: auditRow.details?.pinCode || auditRow.details?.pin_code || "",
        micr_code: auditRow.details?.micrCode || auditRow.details?.micr_code || "",
        ifsc_code: auditRow.details?.ifscCode || auditRow.details?.ifsc_code || "",
        nominees_count: auditRow.details?.nomineesCount || auditRow.details?.nominees_count || 1,
        nominees: auditRow.details?.nominees || [],
        client_note: auditRow.details?.clientNote || auditRow.details?.client_note || "",
        declaration_accepted: true,
        status: auditRow.details?.status || "New",
        priority: auditRow.details?.priority || "Medium",
        admin_notes: auditRow.details?.admin_notes || "",
        followup_notes: auditRow.details?.followup_notes || [],
        source: auditRow.details?.source || "Mutual Funds Form (Fallback)",
        created_at: auditRow.created_at,
        updated_at: auditRow.created_at,
      };
      return NextResponse.json({ account: fallback });
    }

    return NextResponse.json({ error: "Account application record not found" }, { status: 404 });
  } catch (err: any) {
    console.error("GET /api/admin/mutual-fund-accounts/[id] error:", err);
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
      .from("bse_star_mf_accounts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (dbExisting) {
      const updates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (body.status !== undefined) updates.status = body.status;
      if (body.priority !== undefined) updates.priority = body.priority;
      if (body.admin_notes !== undefined) updates.admin_notes = body.admin_notes;

      if (body.newFollowupNote) {
        const existingFollowups = Array.isArray(dbExisting.followup_notes)
          ? dbExisting.followup_notes
          : [];

        const newEntry = {
          id: `fn-${Date.now()}`,
          text: String(body.newFollowupNote).trim(),
          createdAt: new Date().toISOString(),
          author: auth.user.email || "Admin",
        };

        updates.followup_notes = [newEntry, ...existingFollowups];
      } else if (body.followup_notes !== undefined) {
        updates.followup_notes = body.followup_notes;
      }

      const { data: updated, error: updateErr } = await supabaseServer
        .from("bse_star_mf_accounts")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();

      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }

      await recordAuditLog({
        actor: auth.user.email || "admin",
        action: "MUTUAL_FUNDS_ACCOUNT_UPDATED",
        targetType: "mutual_fund_account",
        targetId: id,
        details: { applicant: dbExisting.full_name, pan: dbExisting.pan_number, changes: updates },
        ipAddress,
      });

      return NextResponse.json({ success: true, account: updated });
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

      const returnedAccount = {
        id: auditRow.target_id || auditRow.id,
        full_name: updatedDetails.fullName || updatedDetails.full_name || "Applicant",
        ...updatedDetails,
      };

      return NextResponse.json({ success: true, account: returnedAccount });
    }

    return NextResponse.json({ error: "Account application record not found" }, { status: 404 });
  } catch (err: any) {
    console.error("PATCH /api/admin/mutual-fund-accounts/[id] error:", err);
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
      .from("bse_star_mf_accounts")
      .delete()
      .eq("id", id);

    // 2. Also delete from Audit Log fallback if present
    await supabaseServer
      .from("audit_logs")
      .delete()
      .eq("target_id", id);

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "MUTUAL_FUNDS_ACCOUNT_DELETED",
      targetType: "mutual_fund_account",
      targetId: id,
      details: { deletedId: id },
      ipAddress,
    });

    return NextResponse.json({ success: true, message: "Record deleted successfully" });
  } catch (err: any) {
    console.error("DELETE /api/admin/mutual-fund-accounts/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
