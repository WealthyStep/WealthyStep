import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseServer } from "@/lib/supabase-server";
import { getB2FileBytes, getB2SignedPreviewUrl } from "@/lib/b2";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  const { id } = await params;
  const url = new URL(request.url);
  const isStream = url.searchParams.get("stream") === "1" || url.searchParams.get("stream") === "true";

  try {
    const { data: doc, error } = await supabaseServer
      .from("documents")
      .select("id, client_id, title, file_key, file_size, mime_type")
      .eq("id", id)
      .single();

    if (error || !doc) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    // Direct Binary Stream mode (same-origin, 0 frame restriction)
    if (isStream) {
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

    // JSON Metadata mode
    const signedUrl = await getB2SignedPreviewUrl(doc.file_key, 300);

    return NextResponse.json({
      success: true,
      title: doc.title,
      fileSize: doc.file_size,
      signedUrl,
      streamUrl: `/api/admin/documents/${id}/preview?stream=1`,
    });
  } catch (err: any) {
    console.error("Error in admin document preview:", err);
    return NextResponse.json({ error: "Failed to load document." }, { status: 500 });
  }
}
