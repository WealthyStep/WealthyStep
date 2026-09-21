import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { validateVerifiedSession } from "@/lib/verified-session";

export async function GET(request: Request) {
  try {
    const sessionToken = request.headers.get("x-session-token");
    const clientId = await validateVerifiedSession(sessionToken);

    if (!clientId) {
      return NextResponse.json(
        { error: "Session expired or invalid. Please verify your identity again." },
        { status: 401 }
      );
    }

    // Fetch documents belonging strictly to this verified client
    const { data: documents, error } = await supabaseServer
      .from("documents")
      .select("id, title, file_size, mime_type, created_at")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching client documents:", error);
      return NextResponse.json(
        { error: "Failed to load policy documents." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      documents: documents || [],
    });
  } catch (err: any) {
    console.error("Error in policy documents route:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while loading your documents." },
      { status: 500 }
    );
  }
}
