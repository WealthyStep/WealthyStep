import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseServer } from "@/lib/supabase-server";
import { deleteMultipleFromB2 } from "@/lib/b2";
import { recordAuditLog } from "@/lib/audit";
import { invalidateStorageMetricsCache } from "@/app/api/admin/storage/metrics/route";
import {
  validateClientInput,
  checkDuplicateClient,
  normalizeMobile,
  normalizeDob,
} from "@/lib/client-validation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  const { id } = await params;

  try {
    const { data: client, error } = await supabaseServer
      .from("clients")
      .select("*, documents(*)")
      .eq("id", id)
      .single();

    if (error || !client) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, client });
  } catch (err: any) {
    console.error("Error fetching client details:", err);
    return NextResponse.json({ error: "Server error fetching client." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  const { id } = await params;

  try {
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const body = await request.json().catch(() => ({}));
    const { name, mobile, email, dob, policy_number, notes } = body;

    // 1. Field validation
    const validation = validateClientInput({ name, mobile, email, dob });
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error, field: validation.field },
        { status: 400 }
      );
    }

    const cleanEmail = email !== undefined ? String(email).trim().toLowerCase() : undefined;
    const cleanMobile = mobile !== undefined ? normalizeMobile(String(mobile)) : undefined;
    const cleanDob = dob !== undefined ? normalizeDob(String(dob)) : undefined;

    // 2. Uniqueness check against other clients
    if (cleanEmail || cleanMobile) {
      const duplicateCheck = await checkDuplicateClient(supabaseServer, {
        email: cleanEmail,
        mobile: cleanMobile,
        excludeClientId: id,
      });

      if (duplicateCheck.isDuplicate) {
        return NextResponse.json(
          {
            error: duplicateCheck.message,
            field: duplicateCheck.field,
            duplicate: true,
          },
          { status: 409 }
        );
      }
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updates.name = String(name).trim();
    if (cleanMobile !== undefined) updates.mobile = cleanMobile;
    if (cleanEmail !== undefined) updates.email = cleanEmail;
    if (cleanDob !== undefined) updates.dob = cleanDob;
    if (policy_number !== undefined) updates.policy_number = policy_number ? String(policy_number).trim() : null;
    if (notes !== undefined) updates.notes = notes ? String(notes).trim() : null;

    const { data: updatedClient, error } = await supabaseServer
      .from("clients")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error || !updatedClient) {
      console.error("Failed to update client:", error);
      return NextResponse.json({ error: "Failed to update client record." }, { status: 500 });
    }

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "CLIENT_UPDATED",
      targetType: "client",
      targetId: id,
      details: { updates },
      ipAddress,
    });

    return NextResponse.json({ success: true, client: updatedClient });
  } catch (err: any) {
    console.error("Error updating client:", err);
    return NextResponse.json({ error: "Server error updating client." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  const { id } = await params;

  try {
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // 1. Fetch all documents associated with this client to obtain B2 file keys
    const { data: documents } = await supabaseServer
      .from("documents")
      .select("file_key")
      .eq("client_id", id);

    if (documents && documents.length > 0) {
      const fileKeys = documents.map((d) => d.file_key).filter(Boolean);
      // Clean up all files from Backblaze B2 bucket
      await deleteMultipleFromB2(fileKeys);
    }

    // 2. Delete the client from Supabase (cascades to documents, otps, sessions)
    const { error: deleteErr } = await supabaseServer
      .from("clients")
      .delete()
      .eq("id", id);

    if (deleteErr) {
      console.error("Failed to delete client from database:", deleteErr);
      return NextResponse.json({ error: "Failed to delete client." }, { status: 500 });
    }

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "CLIENT_DELETED",
      targetType: "client",
      targetId: id,
      details: { documentCountDeleted: documents?.length || 0 },
      ipAddress,
    });

    invalidateStorageMetricsCache();

    return NextResponse.json({
      success: true,
      message: "Client and all associated files deleted successfully.",
    });
  } catch (err: any) {
    console.error("Error deleting client:", err);
    return NextResponse.json({ error: "Server error deleting client." }, { status: 500 });
  }
}
