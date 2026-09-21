import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseServer } from "@/lib/supabase-server";
import { uploadPdfToB2 } from "@/lib/b2";
import { recordAuditLog } from "@/lib/audit";
import { invalidateStorageMetricsCache } from "@/app/api/admin/storage/metrics/route";

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB limit

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "_")
    .replace(/_+/g, "_");
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const formData = await request.formData();

    const clientId = formData.get("clientId") as string | null;
    const titleInput = formData.get("title") as string | null;
    const file = formData.get("file") as File | null;

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required." }, { status: 400 });
    }

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
    }

    // 1. Strict Server-Side File Validation
    const isPdfMime = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdfMime) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF documents (.pdf) are permitted." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File size exceeds the 15MB limit. Please compress the PDF before uploading." },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "The uploaded file is empty." }, { status: 400 });
    }

    // 2. Verify client exists in DB
    const { data: client, error: clientErr } = await supabaseServer
      .from("clients")
      .select("id, name")
      .eq("id", clientId)
      .single();

    if (clientErr || !client) {
      return NextResponse.json({ error: "Client record not found." }, { status: 404 });
    }

    // 3. Prepare File & Upload to Backblaze B2
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const cleanName = sanitizeFilename(file.name);
    const documentTitle = titleInput?.trim() || file.name.replace(/\.pdf$/i, "").trim() || "Policy Document";
    const fileKey = `policies/${clientId}/${Date.now()}-${cleanName}`;

    await uploadPdfToB2(buffer, fileKey, "application/pdf");

    // 4. Save metadata in Supabase
    const { data: newDoc, error: docErr } = await supabaseServer
      .from("documents")
      .insert({
        client_id: clientId,
        title: documentTitle,
        file_key: fileKey,
        file_size: file.size,
        mime_type: "application/pdf",
      })
      .select()
      .single();

    if (docErr || !newDoc) {
      console.error("Failed to insert document metadata:", docErr);
      return NextResponse.json({ error: "Failed to save document metadata." }, { status: 500 });
    }

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "DOCUMENT_UPLOADED",
      targetType: "document",
      targetId: newDoc.id,
      details: {
        clientId,
        clientName: client.name,
        title: documentTitle,
        fileSize: file.size,
        fileKey,
      },
      ipAddress,
    });

    invalidateStorageMetricsCache();
    return NextResponse.json({ success: true, document: newDoc }, { status: 201 });
  } catch (err: any) {
    console.error("Error in document upload route:", err);
    return NextResponse.json(
      { error: "Server error occurred during document upload." },
      { status: 500 }
    );
  }
}
