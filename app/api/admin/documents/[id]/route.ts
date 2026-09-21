import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseServer } from "@/lib/supabase-server";
import { deleteFromB2 } from "@/lib/b2";
import { recordAuditLog } from "@/lib/audit";
import { invalidateStorageMetricsCache } from "@/app/api/admin/storage/metrics/route";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  const { id } = await params;

  try {
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // 1. Fetch document to obtain B2 file key
    const { data: doc, error: fetchErr } = await supabaseServer
      .from("documents")
      .select("id, client_id, title, file_key")
      .eq("id", id)
      .single();

    if (fetchErr || !doc) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    // 2. Delete file from Backblaze B2
    await deleteFromB2(doc.file_key);

    // 3. Delete document row from Supabase
    const { error: deleteErr } = await supabaseServer
      .from("documents")
      .delete()
      .eq("id", id);

    if (deleteErr) {
      console.error("Failed to delete document row from database:", deleteErr);
      return NextResponse.json({ error: "Failed to delete document from database." }, { status: 500 });
    }

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "DOCUMENT_DELETED",
      targetType: "document",
      targetId: id,
      details: { title: doc.title, fileKey: doc.file_key, clientId: doc.client_id },
      ipAddress,
    });

    invalidateStorageMetricsCache();

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully.",
    });
  } catch (err: any) {
    console.error("Error deleting document:", err);
    return NextResponse.json({ error: "Server error deleting document." }, { status: 500 });
  }
}
