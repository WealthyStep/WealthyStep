import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    // Query metrics across all 4 forms in parallel for maximum performance
    const [healthRes, lifeRes, mfRes, participantsRes] = await Promise.allSettled([
      supabaseServer
        .from("health_insurance_proposals")
        .select("id, proposer_name, status, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(1),

      supabaseServer
        .from("life_insurance_proposals")
        .select("id, proposer_name, status, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(1),

      supabaseServer
        .from("bse_star_mf_accounts")
        .select("id, full_name, status, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(1),

      supabaseServer
        .from("program_participants")
        .select("id, name, status, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(1),
    ]);

    const forms = {
      health: {
        formName: "Health Insurance",
        tableName: "health_insurance_proposals",
        endpoint: "/api/admin/health-insurance-proposals",
        publicEndpoint: "/api/insurance/health-proposal",
        count: healthRes.status === "fulfilled" ? healthRes.value.count || 0 : 0,
        latestSubmission:
          healthRes.status === "fulfilled" && healthRes.value.data?.[0]
            ? {
                id: healthRes.value.data[0].id,
                name: healthRes.value.data[0].proposer_name,
                status: healthRes.value.data[0].status,
                createdAt: healthRes.value.data[0].created_at,
              }
            : null,
        error: healthRes.status === "rejected" ? String(healthRes.reason) : null,
      },
      term: {
        formName: "Term / Life Insurance",
        tableName: "life_insurance_proposals",
        endpoint: "/api/admin/term-insurance-proposals",
        publicEndpoint: "/api/insurance/life-proposal",
        count: lifeRes.status === "fulfilled" ? lifeRes.value.count || 0 : 0,
        latestSubmission:
          lifeRes.status === "fulfilled" && lifeRes.value.data?.[0]
            ? {
                id: lifeRes.value.data[0].id,
                name: lifeRes.value.data[0].proposer_name,
                status: lifeRes.value.data[0].status,
                createdAt: lifeRes.value.data[0].created_at,
              }
            : null,
        error: lifeRes.status === "rejected" ? String(lifeRes.reason) : null,
      },
      mutual_funds: {
        formName: "Mutual Funds / BSE STAR",
        tableName: "bse_star_mf_accounts",
        endpoint: "/api/admin/mutual-fund-accounts",
        publicEndpoint: "/api/mutual-funds/account-opening",
        count: mfRes.status === "fulfilled" ? mfRes.value.count || 0 : 0,
        latestSubmission:
          mfRes.status === "fulfilled" && mfRes.value.data?.[0]
            ? {
                id: mfRes.value.data[0].id,
                name: mfRes.value.data[0].full_name,
                status: mfRes.value.data[0].status,
                createdAt: mfRes.value.data[0].created_at,
              }
            : null,
        error: mfRes.status === "rejected" ? String(mfRes.reason) : null,
      },
      program_participants: {
        formName: "Seminar Program Participants",
        tableName: "program_participants",
        endpoint: "/api/admin/program-participants",
        publicEndpoint: "/api/program/submit",
        count: participantsRes.status === "fulfilled" ? participantsRes.value.count || 0 : 0,
        latestSubmission:
          participantsRes.status === "fulfilled" && participantsRes.value.data?.[0]
            ? {
                id: participantsRes.value.data[0].id,
                name: participantsRes.value.data[0].name,
                status: participantsRes.value.data[0].status,
                createdAt: participantsRes.value.data[0].created_at,
              }
            : null,
        error: participantsRes.status === "rejected" ? String(participantsRes.reason) : null,
      },
    };

    const totalSubmissions =
      forms.health.count +
      forms.term.count +
      forms.mutual_funds.count +
      forms.program_participants.count;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      totalSubmissions,
      forms,
    });
  } catch (err: any) {
    console.error("Error in GET /api/admin/forms:", err);
    return NextResponse.json(
      { error: "Failed to fetch form summaries", details: err?.message },
      { status: 500 }
    );
  }
}
