import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Ping Supabase database with a lightweight head query to prevent project auto-pausing
    const { error } = await supabaseServer
      .from("clients")
      .select("id", { count: "exact", head: true })
      .limit(1);

    if (error && error.code !== "PGRST116") {
      console.warn("Keepalive query returned warning/error:", error.message);
    }

    return NextResponse.json(
      {
        status: "ok",
        service: "wealthystep-health-keepalive",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Health keepalive check failed:", err);
    return NextResponse.json(
      {
        status: "degraded",
        error: err.message || "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
