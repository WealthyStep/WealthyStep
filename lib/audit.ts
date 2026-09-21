import { supabaseServer } from "@/lib/supabase-server";

// Server-only check
if (typeof window !== "undefined") {
  throw new Error("audit.ts cannot be used on the client side");
}

export interface AuditLogEntry {
  actor: string; // e.g. admin email or 'client:uuid' or 'system'
  action: string; // e.g. 'CLIENT_CREATED', 'DOCUMENT_UPLOADED', 'DOCUMENT_DOWNLOADED', 'OTP_REQUESTED'
  targetType: "client" | "document" | "otp" | "session" | "auth" | "system";
  targetId?: string | null;
  details?: Record<string, any>;
  ipAddress?: string | null;
}

let lastPruneTime = 0;
const PRUNE_INTERVAL_MS = 6 * 60 * 60 * 1000; // Run background prune at most once every 6 hours

/**
 * Automatically purges old audit logs, expired/verified OTP requests, and expired sessions
 * to keep database storage clean, secure, and well within the free 500MB tier forever.
 */
export async function pruneOldAuditLogs(retentionDays: number = 30): Promise<{
  deletedAuditLogs: number;
  deletedOtps: number;
  deletedSessions: number;
}> {
  try {
    const nowIso = new Date().toISOString();
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();

    let auditCount = 0;
    let otpCount = 0;
    let sessionCount = 0;

    if (retentionDays === 0) {
      // 100% Complete Wipe: Delete ALL audit records, ALL OTP requests, and ALL sessions
      const [auditRes, otpRes, sessionRes] = await Promise.all([
        supabaseServer.from("audit_logs").delete({ count: "exact" }).lte("created_at", nowIso),
        supabaseServer.from("otp_requests").delete({ count: "exact" }).lte("created_at", nowIso),
        supabaseServer.from("verified_sessions").delete({ count: "exact" }).lte("created_at", nowIso),
      ]);

      auditCount = auditRes.count || 0;
      otpCount = otpRes.count || 0;
      sessionCount = sessionRes.count || 0;
    } else {
      // Aged Retention: Delete audit logs older than cutoff, plus ALL expired/consumed OTPs and sessions
      const [auditRes, expiredOtpRes, verifiedOtpRes, expiredSessionRes] = await Promise.all([
        // 1. Audit logs older than cutoff date
        supabaseServer.from("audit_logs").delete({ count: "exact" }).lt("created_at", cutoffDate),
        // 2. OTPs that are past their 5-minute expiry time
        supabaseServer.from("otp_requests").delete({ count: "exact" }).lt("expires_at", nowIso),
        // 3. OTPs that were already verified/used
        supabaseServer.from("otp_requests").delete({ count: "exact" }).eq("verified", true),
        // 4. Client session tokens that are past their 15-minute expiry
        supabaseServer.from("verified_sessions").delete({ count: "exact" }).lt("expires_at", nowIso),
      ]);

      auditCount = auditRes.count || 0;
      otpCount = (expiredOtpRes.count || 0) + (verifiedOtpRes.count || 0);
      sessionCount = expiredSessionRes.count || 0;
    }

    return {
      deletedAuditLogs: auditCount,
      deletedOtps: otpCount,
      deletedSessions: sessionCount,
    };
  } catch (err) {
    console.error("Failed to prune old audit logs, OTPs, and sessions:", err);
    return { deletedAuditLogs: 0, deletedOtps: 0, deletedSessions: 0 };
  }
}

/**
 * Inserts an entry into the audit_logs table for administrative compliance and tracking.
 */
export async function recordAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    await supabaseServer.from("audit_logs").insert({
      actor: entry.actor,
      action: entry.action,
      target_type: entry.targetType,
      target_id: entry.targetId || null,
      details: entry.details || {},
      ip_address: entry.ipAddress || null,
    });

    // Opportunistic automatic cleanup: triggers every 6 hours in background
    const now = Date.now();
    if (now - lastPruneTime > PRUNE_INTERVAL_MS) {
      lastPruneTime = now;
      pruneOldAuditLogs(30).catch(() => {});
    }
  } catch (err) {
    // Non-blocking catch to prevent audit failure from breaking user flows
    console.error("Failed to write audit log:", err);
  }
}
