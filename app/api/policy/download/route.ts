import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { validateVerifiedSession } from "@/lib/verified-session";
import { getB2SignedDownloadUrl } from "@/lib/b2";
import { recordAuditLog } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const sessionToken = request.headers.get("x-session-token");
    const clientId = await validateVerifiedSession(sessionToken);

    if (!clientId) {
      return NextResponse.json(
        { error: "Session expired or invalid. Please re-verify your identity." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { documentId } = body;

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required." },
        { status: 400 }
      );
    }

    // Security check: verify document exists AND belongs to this specific verified client
    const { data: doc, error } = await supabaseServer
      .from("documents")
      .select("id, client_id, title, file_key, mime_type")
      .eq("id", documentId)
      .eq("client_id", clientId)
      .single();

    if (error || !doc) {
      return NextResponse.json(
        { error: "Document not found or access denied." },
        { status: 404 }
      );
    }

    // Generate signed, time-limited download URL (300 seconds / 5 mins)
    const downloadFilename = doc.title.endsWith(".pdf") ? doc.title : `${doc.title}.pdf`;
    const downloadUrl = await getB2SignedDownloadUrl(doc.file_key, 300, downloadFilename);

    await recordAuditLog({
      actor: `client:${clientId}`,
      action: "DOCUMENT_DOWNLOADED",
      targetType: "document",
      targetId: doc.id,
      details: { title: doc.title, fileKey: doc.file_key },
      ipAddress,
    });

    return NextResponse.json({
      success: true,
      downloadUrl,
      filename: downloadFilename,
    });
  } catch (err: any) {
    console.error("Error generating signed download URL:", err);
    return NextResponse.json(
      { error: "Unable to generate secure download link. Please try again." },
      { status: 500 }
    );
  }
}
