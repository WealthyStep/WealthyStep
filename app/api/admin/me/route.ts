import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/**
 * Validates the current admin session from the secure HttpOnly cookie.
 * Returns safe admin profile info or HTTP 401/403.
 */
export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) return auth.response;

  // Extract session token from Authorization header or cookie for client state synchronization
  let token: string | null = null;
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  }
  if (!token) {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/sb-access-token=([^;]+)/);
    if (match) token = decodeURIComponent(match[1]);
  }

  return NextResponse.json({
    authenticated: true,
    token: token || undefined,
    user: {
      id: auth.user.id,
      email: auth.user.email,
      role: auth.user.app_metadata?.role || "admin",
    },
  });
}

