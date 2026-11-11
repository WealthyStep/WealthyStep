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

  return NextResponse.json({
    authenticated: true,
    user: {
      id: auth.user.id,
      email: auth.user.email,
      role: auth.user.app_metadata?.role || "admin",
    },
  });
}

