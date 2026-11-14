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
    const { data: proposal, error } = await supabaseServer
      .from("health_insurance_proposals")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    return NextResponse.json({ proposal });
  } catch (err: any) {
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
    const body = await request.json().catch(() => ({}));

    // Fetch existing record first
    const { data: existing, error: fetchErr } = await supabaseServer
      .from("health_insurance_proposals")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof body.status === "string") updates.status = body.status;
    if (typeof body.priority === "string") updates.priority = body.priority;
    if (typeof body.notes === "string") updates.notes = body.notes;
    if (typeof body.proposer_name === "string") updates.proposer_name = body.proposer_name;
    if (typeof body.proposer_mobile === "string") updates.proposer_mobile = body.proposer_mobile;
    if (typeof body.proposer_email === "string") updates.proposer_email = body.proposer_email;
    if (typeof body.policy_type === "string") updates.policy_type = body.policy_type;

    // Append new follow-up note if provided
    if (body.newFollowupNote && typeof body.newFollowupNote === "string") {
      const existingFollowups = Array.isArray(existing.followup_notes) ? existing.followup_notes : [];
      const newEntry = {
        id: `note-${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
        author: auth.user.email || "Admin",
        note: body.newFollowupNote.trim(),
        status: body.status || existing.status,
      };
      updates.followup_notes = [newEntry, ...existingFollowups];
    }

    const { data: updated, error: updateErr } = await supabaseServer
      .from("health_insurance_proposals")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "HEALTH_INSURANCE_PROPOSAL_UPDATED",
      targetType: "health_insurance_proposals",
      targetId: id,
      details: { updates },
    });

    return NextResponse.json({ success: true, proposal: updated });
  } catch (err: any) {
    console.error("Error updating proposal:", err);
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

    const { data: existing } = await supabaseServer
      .from("health_insurance_proposals")
      .select("proposer_name, proposer_mobile")
      .eq("id", id)
      .single();

    const { error: deleteErr } = await supabaseServer
      .from("health_insurance_proposals")
      .delete()
      .eq("id", id);

    if (deleteErr) {
      return NextResponse.json({ error: deleteErr.message }, { status: 500 });
    }

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "HEALTH_INSURANCE_PROPOSAL_DELETED",
      targetType: "health_insurance_proposals",
      targetId: id,
      details: { proposerName: existing?.proposer_name, mobile: existing?.proposer_mobile },
    });

    return NextResponse.json({ success: true, message: "Proposal deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting proposal:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
