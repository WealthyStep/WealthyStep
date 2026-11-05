import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseServer } from "@/lib/supabase-server";
import { recordAuditLog } from "@/lib/audit";
import { validateParticipantInput } from "@/lib/feedback-validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim();
    const status = (searchParams.get("status") || "").trim();
    const occupation = (searchParams.get("occupation") || "").trim();
    const interest = (searchParams.get("interest") || "").trim();

    let dbQuery = supabaseServer
      .from("program_participants")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && status !== "ALL") {
      dbQuery = dbQuery.eq("status", status);
    }
    if (occupation && occupation !== "ALL") {
      dbQuery = dbQuery.eq("occupation", occupation);
    }
    if (interest && interest !== "ALL") {
      dbQuery = dbQuery.contains("interested_in", [interest]);
    }
    if (query) {
      dbQuery = dbQuery.or(
        `name.ilike.%${query}%,email.ilike.%${query}%,mobile.ilike.%${query}%,notes.ilike.%${query}%`
      );
    }

    const { data: participants, error } = await dbQuery;

    if (error) {
      console.error("Failed to query program_participants:", error);
      return NextResponse.json(
        { error: "Failed to fetch participants from database." },
        { status: 500 }
      );
    }

    // Compute live metrics
    const allItems = participants || [];
    const metrics = {
      total: allItems.length,
      newCount: allItems.filter((p) => p.status === "New").length,
      followUpCount: allItems.filter((p) =>
        ["Call Evening", "Call Tomorrow", "Call Weekend", "Follow Up"].includes(p.status)
      ).length,
      interestedCount: allItems.filter((p) =>
        p.status === "Interested" || (p.interested_in && p.interested_in.length > 0 && !p.interested_in.includes("Not Interested"))
      ).length,
      convertedCount: allItems.filter((p) => p.status === "Converted").length,
    };

    return NextResponse.json({
      success: true,
      participants: allItems,
      metrics,
    });
  } catch (err: any) {
    console.error("Error in GET /api/admin/program-participants:", err);
    return NextResponse.json(
      { error: "Server error fetching program participants." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const body = await request.json().catch(() => ({}));

    const validation = validateParticipantInput({
      name: body.name,
      email: body.email,
      mobile: body.mobile,
      age: body.age,
      occupation: body.occupation,
      interested_in: body.interested_in,
      consent_given: true, // Admin manual entry
    });

    if (!validation.valid || !validation.sanitized) {
      return NextResponse.json(
        { error: validation.error, field: validation.field },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      mobile,
      age,
      occupation,
      interested_in,
      consent_given,
      consent_text,
    } = validation.sanitized;

    const { data, error } = await supabaseServer
      .from("program_participants")
      .insert({
        name,
        email,
        mobile,
        age,
        occupation,
        interested_in,
        consent_given,
        consent_text,
        status: body.status || "New",
        notes: body.notes || "",
        source: body.source || "Manual Entry by Admin",
        ip_address: ipAddress,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Failed to insert participant manually:", error);
      return NextResponse.json(
        { error: "Failed to create participant record." },
        { status: 500 }
      );
    }

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "PROGRAM_PARTICIPANT_MANUALLY_CREATED",
      targetType: "program_participants",
      targetId: data.id,
      details: { name, email, mobile, status: data.status },
      ipAddress,
    });

    return NextResponse.json(
      { success: true, message: "Participant added successfully.", participant: data },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error in POST /api/admin/program-participants:", err);
    return NextResponse.json(
      { error: "Server error creating participant." },
      { status: 500 }
    );
  }
}
