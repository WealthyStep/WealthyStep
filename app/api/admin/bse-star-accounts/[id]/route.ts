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
    const { data: account, error } = await supabaseServer
      .from("bse_star_mf_accounts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !account) {
      return NextResponse.json({ error: "Account application record not found" }, { status: 404 });
    }

    return NextResponse.json({ account });
  } catch (err: any) {
    console.error("GET /api/admin/bse-star-accounts/[id] error:", err);
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

    // Fetch existing record first
    const { data: existing, error: fetchErr } = await supabaseServer
      .from("bse_star_mf_accounts")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: "Account application record not found" }, { status: 404 });
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.status !== undefined) updates.status = body.status;
    if (body.priority !== undefined) updates.priority = body.priority;
    if (body.admin_notes !== undefined) updates.admin_notes = body.admin_notes;

    // Follow-up notes handling: append new note if provided
    if (body.newFollowupNote) {
      const existingFollowups = Array.isArray(existing.followup_notes)
        ? existing.followup_notes
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
      console.error("Failed to update bse_star_mf_accounts:", updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "BSE_STAR_MF_ACCOUNT_UPDATED",
      targetType: "bse_star_mf_account",
      targetId: id,
      details: {
        applicant: existing.full_name,
        pan: existing.pan_number,
        changes: updates,
      },
      ipAddress,
    });

    return NextResponse.json({ success: true, account: updated });
  } catch (err: any) {
    console.error("PATCH /api/admin/bse-star-accounts/[id] error:", err);
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

    const { data: existing } = await supabaseServer
      .from("bse_star_mf_accounts")
      .select("id, full_name, pan_number")
      .eq("id", id)
      .single();

    const { error: delErr } = await supabaseServer
      .from("bse_star_mf_accounts")
      .delete()
      .eq("id", id);

    if (delErr) {
      console.error("Failed to delete bse_star_mf_accounts record:", delErr);
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "BSE_STAR_MF_ACCOUNT_DELETED",
      targetType: "bse_star_mf_account",
      targetId: id,
      details: {
        deletedApplicant: existing?.full_name,
        pan: existing?.pan_number,
      },
      ipAddress,
    });

    return NextResponse.json({ success: true, message: "Record deleted successfully" });
  } catch (err: any) {
    console.error("DELETE /api/admin/bse-star-accounts/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
