import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { cacheAdminSession, isAuthorizedAdmin } from "@/lib/admin-auth";

// Sliding-window IP rate limiter to protect against brute-force password guessing
interface RateLimitEntry {
  attempts: number;
  resetAt: number;
}
const loginAttemptsMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILED_ATTEMPTS = 5;

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  if (ip === "unknown") return { allowed: true, retryAfterSeconds: 0 };
  const now = Date.now();
  const entry = loginAttemptsMap.get(ip);

  if (!entry || now > entry.resetAt) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.attempts >= MAX_FAILED_ATTEMPTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds: Math.max(1, retryAfter) };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

function recordFailedAttempt(ip: string) {
  if (ip === "unknown") return;
  const now = Date.now();
  const entry = loginAttemptsMap.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttemptsMap.set(ip, { attempts: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else {
    entry.attempts += 1;
  }
}

function clearRateLimit(ip: string) {
  if (ip !== "unknown") {
    loginAttemptsMap.delete(ip);
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // 1. Enforce Rate Limiting
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    console.warn(`[Security Alert] Rate limit triggered for IP: ${ip} on /api/admin/login`);
    return NextResponse.json(
      {
        error: `Too many failed login attempts. For security reasons, please wait ${Math.ceil(
          rateLimit.retryAfterSeconds / 60
        )} minutes before trying again.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Authenticate securely on the server via Supabase Auth with a 4.5s timeout
    const authPromise = supabaseServer.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Supabase auth timeout (4500ms limit)")), 4500)
    );

    let data: any = null;
    let error: any = null;

    try {
      const res = await Promise.race([authPromise, timeoutPromise]);
      data = res.data;
      error = res.error;
    } catch (fetchErr: any) {
      error = fetchErr;
    }

    if (error || !data?.session) {
      recordFailedAttempt(ip);

      const isFetchError =
        error?.name === "AuthRetryableFetchError" ||
        error?.message?.toLowerCase().includes("fetch failed") ||
        error?.message?.toLowerCase().includes("timeout") ||
        (error as any)?.status === 0;

      if (!isFetchError) {
        console.warn("Invalid admin credentials entered for:", email);
      } else {
        console.warn("Supabase auth connection notice: temporarily unreachable or network latency.");
      }

      const errorMessage = isFetchError
        ? "Network connection issue: Unable to reach authentication service. Please check your internet connection and try again."
        : (error?.message || "Invalid login credentials. Please check your email and password.");

      return NextResponse.json(
        { error: errorMessage },
        { status: isFetchError ? 503 : 401 }
      );
    }

    // Explicitly verify administrative role authorization
    if (!isAuthorizedAdmin(data.user)) {
      recordFailedAttempt(ip);
      console.warn(`[Security Alert] Non-admin user (${data.user.email}) attempted admin portal login.`);
      return NextResponse.json(
        { error: "Forbidden. This account does not possess administrator privileges." },
        { status: 403 }
      );
    }

    // Clear failed attempt counter upon successful login
    clearRateLimit(ip);

    // Cache verified admin session in memory for high-performance zero-latency auth
    if (data.session.access_token && data.user) {
      cacheAdminSession(data.session.access_token, data.user);
    }

    // Respond with success and safe user metadata ONLY (tokens are strictly restricted to HttpOnly cookies)
    const response = NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.app_metadata?.role || "admin",
      },
    });

    // Set secure HttpOnly cookie for session resilience (inaccessible to client JavaScript / XSS)
    response.cookies.set("sb-access-token", data.session.access_token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: data.session.expires_in || 3600 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    console.error("Unexpected error in /api/admin/login:", err);
    return NextResponse.json(
      { error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
