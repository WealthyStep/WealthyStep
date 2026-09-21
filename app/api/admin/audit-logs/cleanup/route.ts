import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { pruneOldAuditLogs, recordAuditLog } from "@/lib/audit";
import { invalidateStorageMetricsCache } from "@/app/api/admin/storage/metrics/route";

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const body = await request.json().catch(() => ({}));
    const retentionDays = typeof body.days === "number" ? body.days : body.all ? 0 : 30;

    const result = await pruneOldAuditLogs(retentionDays);

    await recordAuditLog({
      actor: auth.user.email || "admin",
      action: "AUDIT_LOGS_PURGED",
      targetType: "system",
      details: {
        retentionDays,
        deletedAuditLogs: result.deletedAuditLogs,
        deletedOtps: result.deletedOtps,
        deletedSessions: result.deletedSessions,
      },
    });

    invalidateStorageMetricsCache();

    const msg = retentionDays === 0
      ? `Successfully cleared all ${result.deletedAuditLogs} audit records, ${result.deletedOtps} expired OTPs, and ${result.deletedSessions} expired sessions.`
      : `Successfully purged ${result.deletedAuditLogs} audit logs older than ${retentionDays} days, ${result.deletedOtps} expired OTPs, and ${result.deletedSessions} expired sessions.`;

    return NextResponse.json({
      success: true,
      message: msg,
      result,
    });
  } catch (err: any) {
    console.error("Error purging audit logs:", err);
    return NextResponse.json(
      { error: "Failed to purge old audit records." },
      { status: 500 }
    );
  }
}
