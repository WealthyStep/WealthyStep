import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseServer } from "@/lib/supabase-server";
import { getB2SignedDownloadUrl } from "@/lib/b2";
import { recordAuditLog } from "@/lib/audit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  const { id } = await params;

  try {
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    const { data: doc, error } = await supabaseServer
      .from("documents")
      .select("id, client_id, title, file_key, file_size")
      .eq("id", id)
      .single();

    if (error || !doc) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    const downloadFilename = doc.title.endsWith(".pdf") ? doc.title : `${doc.title}.pdf`;
    const downloadUrl = await getB2SignedDownloadUrl(doc.file_key, 300, downloadFilename);

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "DOCUMENT_DOWNLOADED",
      targetType: "document",
      targetId: doc.id,
      details: { title: doc.title, fileKey: doc.file_key, clientId: doc.client_id },
      ipAddress,
    });

    return NextResponse.json({
      success: true,
      downloadUrl,
      filename: downloadFilename,
    });
  } catch (err: any) {
    console.error("Error generating admin document download link:", err);
    return NextResponse.json({ error: "Failed to generate download link." }, { status: 500 });
  }
}
