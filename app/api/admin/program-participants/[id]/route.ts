import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseServer } from "@/lib/supabase-server";
import { recordAuditLog } from "@/lib/audit";
import { normalizeMobile, isValidEmail, STATUS_OPTIONS, ParticipantStatus } from "@/lib/feedback-validation";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const { data: participant, error } = await supabaseServer
      .from("program_participants")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !participant) {
      return NextResponse.json(
        { error: "Participant record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, participant });
  } catch (err: any) {
    console.error("Error in GET /api/admin/program-participants/[id]:", err);
    return NextResponse.json(
      { error: "Server error fetching participant." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const body = await request.json().catch(() => ({}));

    // Fetch existing record first
    const { data: existing, error: fetchError } = await supabaseServer
      .from("program_participants")
      .select("*")
      .eq("id", params.id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: "Participant record not found." },
        { status: 404 }
      );
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.notes !== undefined) {
      updates.notes = String(body.notes || "");
    }

    if (body.status !== undefined) {
      const statusCandidate = String(body.status).trim();
      if ((STATUS_OPTIONS as readonly string[]).includes(statusCandidate)) {
        updates.status = statusCandidate as ParticipantStatus;
      }
    }

    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (name.length >= 2) updates.name = name;
    }

    if (body.email !== undefined) {
      const email = String(body.email).trim().toLowerCase();
      if (isValidEmail(email)) updates.email = email;
    }

    if (body.mobile !== undefined) {
      const mobile = normalizeMobile(String(body.mobile).trim());
      if (mobile.length === 10) updates.mobile = mobile;
    }

    if (body.age !== undefined) {
      const ageNum = parseInt(String(body.age), 10);
      if (ageNum >= 16 && ageNum <= 100) updates.age = ageNum;
    }

    if (body.occupation !== undefined) {
      updates.occupation = String(body.occupation).trim();
    }

    if (Array.isArray(body.interested_in)) {
      updates.interested_in = body.interested_in;
    }

    const { data: updated, error: updateError } = await supabaseServer
      .from("program_participants")
      .update(updates)
      .eq("id", params.id)
      .select("*")
      .single();

    if (updateError) {
      console.error("Failed to update participant:", updateError);
      return NextResponse.json(
        { error: "Failed to update participant." },
        { status: 500 }
      );
    }

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "PROGRAM_PARTICIPANT_UPDATED",
      targetType: "program_participants",
      targetId: params.id,
      details: {
        updates,
        participantName: updated.name,
      },
      ipAddress,
    });

    return NextResponse.json({
      success: true,
      message: "Participant updated successfully.",
      participant: updated,
    });
  } catch (err: any) {
    console.error("Error in PATCH /api/admin/program-participants/[id]:", err);
    return NextResponse.json(
      { error: "Server error updating participant." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    const { data: existing } = await supabaseServer
      .from("program_participants")
      .select("name, email")
      .eq("id", params.id)
      .single();

    const { error } = await supabaseServer
      .from("program_participants")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Failed to delete participant:", error);
      return NextResponse.json(
        { error: "Failed to delete participant record." },
        { status: 500 }
      );
    }

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "PROGRAM_PARTICIPANT_DELETED",
      targetType: "program_participants",
      targetId: params.id,
      details: {
        deletedName: existing?.name || "Unknown",
        deletedEmail: existing?.email || "Unknown",
      },
      ipAddress,
    });

    return NextResponse.json({
      success: true,
      message: "Participant deleted successfully.",
    });
  } catch (err: any) {
    console.error("Error in DELETE /api/admin/program-participants/[id]:", err);
    return NextResponse.json(
      { error: "Server error deleting participant." },
      { status: 500 }
    );
  }
}

