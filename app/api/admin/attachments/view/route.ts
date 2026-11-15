import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getB2FileBytes } from "@/lib/b2";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    const isDownload = url.searchParams.get("download") === "1" || url.searchParams.get("download") === "true";

    if (!key) {
      return NextResponse.json({ error: "File key is required." }, { status: 400 });
    }

    // Security Check: prevent directory traversal or accessing arbitrary paths
    if (!key.startsWith("attachments/") && !key.startsWith("policies/")) {
      return NextResponse.json({ error: "Unauthorized file access." }, { status: 403 });
    }

    const { buffer, contentType, contentLength } = await getB2FileBytes(key);
    const fileName = key.split("/").pop() || "attachment";
    const dispositionType = isDownload ? "attachment" : "inline";

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Content-Disposition": `${dispositionType}; filename="${encodeURIComponent(fileName)}"`,
        "Content-Length": String(contentLength || buffer.length),
        "Cache-Control": "private, max-age=3600",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch (err: any) {
    console.error("Error retrieving attachment from Backblaze B2:", err);
    return NextResponse.json({ error: "Failed to retrieve attachment from storage." }, { status: 404 });
  }
}
