import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseServer } from "@/lib/supabase-server";
import { getB2StorageMetrics } from "@/lib/b2";

let cachedMetricsPayload: { payload: any; expiresAt: number } | null = null;
const METRICS_CACHE_TTL_MS = 30 * 1000; // 30 seconds

export function invalidateStorageMetricsCache() {
  cachedMetricsPayload = null;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "0 KB";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  const url = new URL(request.url);
  const forceFresh = url.searchParams.get("fresh") === "true";

  // Fast cache check
  const now = Date.now();
  if (!forceFresh && cachedMetricsPayload && cachedMetricsPayload.expiresAt > now) {
    return NextResponse.json(cachedMetricsPayload.payload);
  }

  try {
    // 1. Fetch live Backblaze B2 metrics
    const b2Metrics = await getB2StorageMetrics();

    // 2. Fetch live Supabase row counts and document metadata
    const [clientsRes, docsRes, auditRes, otpRes, sessionsRes] = await Promise.all([
      supabaseServer.from("clients").select("id", { count: "exact", head: true }),
      supabaseServer.from("documents").select("file_size"),
      supabaseServer.from("audit_logs").select("id", { count: "exact", head: true }),
      supabaseServer.from("otp_requests").select("id", { count: "exact", head: true }),
      supabaseServer.from("verified_sessions").select("id", { count: "exact", head: true }),
    ]);

    const clientCount = clientsRes.count || 0;
    const docCount = docsRes.data?.length || 0;
    const auditCount = auditRes.count || 0;
    const otpCount = otpRes.count || 0;
    const sessionCount = sessionsRes.count || 0;

    const totalDocBytesFromDb = docsRes.data
      ? docsRes.data.reduce((acc, doc) => acc + (Number(doc.file_size) || 0), 0)
      : 0;

    // Use higher of B2 S3 API report or DB tracked bytes
    const b2UsedBytes = Math.max(b2Metrics.usedBytes, totalDocBytesFromDb);
    const b2TotalBytes = 10 * 1024 * 1024 * 1024; // 10 GB Free Tier
    const b2UsagePercent = parseFloat(((b2UsedBytes / b2TotalBytes) * 100).toFixed(4));
    const b2FreeBytes = Math.max(0, b2TotalBytes - b2UsedBytes);

    // Estimate Supabase table storage (500 MB Free Tier)
    // Avg row sizes including B-tree indexes:
    // client: ~350 bytes, document metadata: ~400 bytes, audit log: ~450 bytes, otp: ~250 bytes, session: ~250 bytes
    // Base postgres catalog + system tables ~ 1.5 MB
    const BASE_PG_BYTES = 1.5 * 1024 * 1024;
    const estimatedDbBytes =
      BASE_PG_BYTES +
      clientCount * 350 +
      docCount * 400 +
      auditCount * 450 +
      otpCount * 250 +
      sessionCount * 250;

    const supabaseTotalBytes = 500 * 1024 * 1024; // 500 MB Free Tier
    const supabaseUsagePercent = parseFloat(((estimatedDbBytes / supabaseTotalBytes) * 100).toFixed(4));
    const supabaseFreeBytes = Math.max(0, supabaseTotalBytes - estimatedDbBytes);

    const payload = {
      success: true,
      timestamp: new Date().toISOString(),
      b2: {
        provider: "Backblaze B2 (S3)",
        bucket: process.env.B2_BUCKET_NAME || "wealthystep",
        region: process.env.B2_REGION || "us-east-005",
        usedBytes: b2UsedBytes,
        totalBytes: b2TotalBytes,
        freeBytes: b2FreeBytes,
        usedFormatted: formatBytes(b2UsedBytes),
        totalFormatted: "10.00 GB",
        freeFormatted: formatBytes(b2FreeBytes),
        usagePercent: b2UsagePercent,
        fileCount: Math.max(b2Metrics.fileCount, docCount),
        tier: "10 GB Free Tier",
        status: b2UsagePercent > 90 ? "Critical" : b2UsagePercent > 75 ? "Warning" : "Optimal",
      },
      supabase: {
        provider: "Supabase PostgreSQL",
        usedBytes: estimatedDbBytes,
        totalBytes: supabaseTotalBytes,
        freeBytes: supabaseFreeBytes,
        usedFormatted: formatBytes(estimatedDbBytes),
        totalFormatted: "500.00 MB",
        freeFormatted: formatBytes(supabaseFreeBytes),
        usagePercent: supabaseUsagePercent,
        tier: "500 MB Free Tier",
        status: supabaseUsagePercent > 90 ? "Critical" : supabaseUsagePercent > 75 ? "Warning" : "Optimal",
        tableCounts: {
          clients: clientCount,
          documents: docCount,
          auditLogs: auditCount,
          otpRequests: otpCount,
          verifiedSessions: sessionCount,
          totalRows: clientCount + docCount + auditCount + otpCount + sessionCount,
        },
      },
    };

    cachedMetricsPayload = {
      payload,
      expiresAt: now + METRICS_CACHE_TTL_MS,
    };

    return NextResponse.json(payload);
  } catch (err: any) {
    console.error("Error generating storage metrics:", err);
    return NextResponse.json(
      { error: "Failed to calculate storage metrics." },
      { status: 500 }
    );
  }
}
