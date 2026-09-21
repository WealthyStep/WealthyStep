import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { validateVerifiedSession } from "@/lib/verified-session";
import { getB2FileBytes, getB2SignedPreviewUrl } from "@/lib/b2";
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
    const { documentId, stream } = body;

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required." },
        { status: 400 }
      );
    }

    // Verify document exists and belongs to this verified client
    const { data: doc, error } = await supabaseServer
      .from("documents")
      .select("id, client_id, title, file_key, file_size, mime_type")
      .eq("id", documentId)
      .eq("client_id", clientId)
      .single();

    if (error || !doc) {
      return NextResponse.json(
        { error: "Document not found or access denied." },
        { status: 404 }
      );
    }

    await recordAuditLog({
      actor: `client:${clientId}`,
      action: "DOCUMENT_PREVIEWED",
      targetType: "document",
      targetId: doc.id,
      details: { title: doc.title, fileKey: doc.file_key },
      ipAddress,
    });

    if (stream) {
      const { buffer, contentType, contentLength } = await getB2FileBytes(doc.file_key);
      return new Response(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": contentType || "application/pdf",
          "Content-Disposition": `inline; filename="${encodeURIComponent(doc.title)}.pdf"`,
          "Content-Length": String(contentLength || buffer.length),
          "Cache-Control": "private, max-age=300",
          "X-Frame-Options": "SAMEORIGIN",
        },
      });
    }

    // Generate signed preview URL (5 minutes)
    const signedUrl = await getB2SignedPreviewUrl(doc.file_key, 300);

    return NextResponse.json({
      success: true,
      signedUrl,
      title: doc.title,
      fileSize: doc.file_size,
    });
  } catch (err: any) {
    console.error("Error generating preview:", err);
    return NextResponse.json(
      { error: "Unable to load document preview. Please try again." },
      { status: 500 }
    );
  }
}
