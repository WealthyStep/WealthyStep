import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseServer } from "@/lib/supabase-server";
import { recordAuditLog } from "@/lib/audit";
import { invalidateStorageMetricsCache } from "@/app/api/admin/storage/metrics/route";
import {
  validateClientInput,
  checkDuplicateClient,
  normalizeMobile,
  normalizeDob,
} from "@/lib/client-validation";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const { data: clients, error } = await supabaseServer
      .from("clients")
      .select("*, documents(id, title, file_size, created_at)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch clients:", error);
      return NextResponse.json({ error: "Failed to fetch clients." }, { status: 500 });
    }

    return NextResponse.json({ success: true, clients: clients || [] });
  } catch (err: any) {
    console.error("Error in admin clients GET route:", err);
    return NextResponse.json({ error: "Server error fetching clients." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const body = await request.json().catch(() => ({}));
    const { name, mobile, email, dob, policy_number, notes } = body;

    // 1. Validate required fields and formats
    const validation = validateClientInput({ name, mobile, email, dob });
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error, field: validation.field },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanMobile = normalizeMobile(String(mobile));
    const cleanDob = normalizeDob(String(dob));

    // 2. Strict Uniqueness Check for Email and Mobile
    const duplicateCheck = await checkDuplicateClient(supabaseServer, {
      email: cleanEmail,
      mobile: cleanMobile,
    });

    if (duplicateCheck.isDuplicate) {
      return NextResponse.json(
        {
          error: duplicateCheck.message,
          field: duplicateCheck.field,
          duplicate: true,
        },
        { status: 409 }
      );
    }

    // 3. Create client record
    const { data: newClient, error } = await supabaseServer
      .from("clients")
      .insert({
        name: String(name).trim(),
        mobile: cleanMobile,
        email: cleanEmail,
        dob: cleanDob,
        policy_number: policy_number ? String(policy_number).trim() : null,
        notes: notes ? String(notes).trim() : null,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create client:", error);
      return NextResponse.json({ error: "Failed to create client record." }, { status: 500 });
    }

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "CLIENT_CREATED",
      targetType: "client",
      targetId: newClient.id,
      details: { name: newClient.name, email: newClient.email, mobile: newClient.mobile },
      ipAddress,
    });

    invalidateStorageMetricsCache();
    return NextResponse.json({ success: true, client: newClient }, { status: 201 });
  } catch (err: any) {
    console.error("Error in admin clients POST route:", err);
    return NextResponse.json({ error: "Server error creating client." }, { status: 500 });
  }
}

