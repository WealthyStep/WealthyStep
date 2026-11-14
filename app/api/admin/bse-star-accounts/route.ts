import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseServer } from "@/lib/supabase-server";
import { recordAuditLog } from "@/lib/audit";
import { validateBseStarAccountOpening } from "@/lib/bse-star-validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim();
    const status = (searchParams.get("status") || "").trim();
    const isKycDone = (searchParams.get("isKycDone") || "").trim();

    let dbQuery = supabaseServer
      .from("bse_star_mf_accounts")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && status !== "ALL") {
      dbQuery = dbQuery.eq("status", status);
    }
    if (isKycDone && isKycDone !== "ALL") {
      dbQuery = dbQuery.eq("is_kyc_done", isKycDone);
    }
    if (query) {
      dbQuery = dbQuery.or(
        `full_name.ilike.%${query}%,email.ilike.%${query}%,mobile.ilike.%${query}%,pan_number.ilike.%${query}%,account_number.ilike.%${query}%`
      );
    }

    const { data: accounts, error } = await dbQuery;

    if (error) {
      // Seamless Fail-Safe if bse_star_mf_accounts table has not yet been executed in Supabase
      if (
        error.code === "PGRST205" ||
        error.code === "42P01" ||
        error.message?.includes("schema cache") ||
        error.message?.includes("does not exist")
      ) {
        const { data: auditRows } = await supabaseServer
          .from("audit_logs")
          .select("*")
          .eq("action", "BSE_STAR_MF_APPLICATION_SUBMITTED")
          .order("created_at", { ascending: false });

        const fallbackAccounts = (auditRows || []).map((row: any) => ({
          id: row.target_id || row.id,
          full_name: row.details?.fullName || "Applicant",
          mobile: row.details?.mobile || "",
          email: row.details?.email || "",
          dob: "",
          place_of_birth: "",
          occupation: "Salaried",
          present_address: "",
          permanent_address: "",
          marital_status: "Single",
          marriage_date: "",
          blood_group: "",
          is_kyc_done: row.details?.isKycDone || "No",
          aadhar_number: "",
          pan_number: row.details?.pan || "",
          aadhar_files: [],
          pan_files: [],
          bank_files: [],
          bank_name: row.details?.bankName || "",
          bank_branch: "",
          bank_address: "",
          account_number: row.details?.accountNumberLast4 ? `XXXX-${row.details.accountNumberLast4}` : "",
          account_type: "Savings",
          bank_city: "",
          pin_code: "",
          micr_code: "",
          ifsc_code: row.details?.ifscCode || "",
          nominees_count: row.details?.nomineesCount || 1,
          nominees: [],
          client_note: "",
          declaration_accepted: true,
          status: "New",
          priority: "Medium",
          admin_notes: "",
          followup_notes: [],
          source: "BSE Star MF Form",
          ip_address: row.ip_address,
          created_at: row.created_at,
          updated_at: row.created_at,
        }));

        const filtered = fallbackAccounts.filter((a) => {
          if (status && status !== "ALL" && a.status !== status) return false;
          if (isKycDone && isKycDone !== "ALL" && a.is_kyc_done !== isKycDone) return false;
          if (query) {
            const q = query.toLowerCase();
            return (
              a.full_name.toLowerCase().includes(q) ||
              a.email.toLowerCase().includes(q) ||
              a.mobile.includes(q) ||
              a.pan_number.toLowerCase().includes(q)
            );
          }
          return true;
        });

        return NextResponse.json({
          accounts: filtered,
          total: filtered.length,
          source: "audit_fallback",
        });
      }

      console.error("Failed to query bse_star_mf_accounts:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      accounts: accounts || [],
      total: accounts ? accounts.length : 0,
      source: "primary_db",
    });
  } catch (err: any) {
    console.error("GET /api/admin/bse-star-accounts error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Bulk Import / Single creation
export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const body = await request.json().catch(() => ({}));

    const itemsToProcess = Array.isArray(body) ? body : body.items ? body.items : [body];
    if (itemsToProcess.length === 0) {
      return NextResponse.json({ error: "No records provided for import." }, { status: 400 });
    }

    const insertedRows: any[] = [];
    const errors: any[] = [];

    for (let i = 0; i < itemsToProcess.length; i++) {
      const raw = itemsToProcess[i];
      const validation = validateBseStarAccountOpening(raw);

      if (!validation.isValid) {
        errors.push({ index: i, errors: validation.errors });
        continue;
      }

      const { sanitized } = validation;
      const submissionTime = new Date().toISOString();

      try {
        const { data: inserted, error: dbErr } = await supabaseServer
          .from("bse_star_mf_accounts")
          .insert({
            full_name: sanitized.fullName,
            mobile: sanitized.mobile,
            email: sanitized.email,
            dob: sanitized.dob,
            place_of_birth: sanitized.placeOfBirth,
            occupation: sanitized.occupation,
            present_address: sanitized.presentAddress,
            permanent_address: sanitized.permanentAddress,
            marital_status: sanitized.maritalStatus,
            marriage_date: sanitized.marriageDate || "",
            blood_group: sanitized.bloodGroup || "",
            is_kyc_done: sanitized.isKycDone,
            aadhar_number: sanitized.aadharNumber,
            pan_number: sanitized.panNumber,
            aadhar_files: sanitized.aadharFiles || [],
            pan_files: sanitized.panFiles || [],
            bank_files: sanitized.bankFiles || [],
            bank_name: sanitized.bankName,
            bank_branch: sanitized.bankBranch,
            bank_address: sanitized.bankAddress || "",
            account_number: sanitized.accountNumber,
            account_type: sanitized.accountType,
            bank_city: sanitized.bankCity,
            pin_code: sanitized.pinCode,
            micr_code: sanitized.micrCode || "",
            ifsc_code: sanitized.ifscCode,
            nominees_count: sanitized.nomineesCount,
            nominees: sanitized.nominees || [],
            client_note: sanitized.clientNote || "",
            declaration_accepted: sanitized.declarationAccepted,
            status: raw.status || "New",
            priority: raw.priority || "Medium",
            admin_notes: raw.admin_notes || "",
            followup_notes: raw.followup_notes || [],
            source: raw.source || "Admin Import",
            ip_address: ipAddress,
            created_at: raw.created_at || submissionTime,
            updated_at: submissionTime,
          })
          .select("id")
          .single();

        if (dbErr) {
          errors.push({ index: i, error: dbErr.message });
        } else if (inserted) {
          insertedRows.push(inserted);
        }
      } catch (err: any) {
        errors.push({ index: i, error: err?.message || "Insert failed" });
      }
    }

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "BSE_STAR_MF_ACCOUNTS_IMPORTED",
      targetType: "bse_star_mf_accounts",
      details: {
        totalReceived: itemsToProcess.length,
        successfulInserts: insertedRows.length,
        failedCount: errors.length,
      },
      ipAddress,
    });

    return NextResponse.json({
      success: true,
      importedCount: insertedRows.length,
      failedCount: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err: any) {
    console.error("POST /api/admin/bse-star-accounts error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
