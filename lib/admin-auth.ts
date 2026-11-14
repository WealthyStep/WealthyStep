import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import type { User } from "@supabase/supabase-js";

export type AdminAuthResult =
  | { authenticated: true; user: User }
  | { authenticated: false; response: NextResponse };

// In-memory cache for authenticated admin sessions (TTL: 15 minutes)
interface CachedUser {
  user: User;
  expiresAt: number;
}
const tokenCache = new Map<string, CachedUser>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Validates whether an authenticated user possesses administrative authorization.
 * Checks server-controlled claims and verified administrator email allowlist.
 */
export function isAuthorizedAdmin(user: User): boolean {
  if (!user) return false;

  // 1. Server-controlled app_metadata claims (PROTECTED: users cannot modify app_metadata)
  if (user.app_metadata?.is_admin === true || user.app_metadata?.role === "admin") {
    return true;
  }

  // NOTE: user.user_metadata is intentionally EXCLUDED here because user_metadata
  // can be updated directly by authenticated clients via supabase.auth.updateUser(),
  // which would allow privilege escalation if trusted for admin rights.

  // 2. Server-Controlled Administrator Email Allowlist (Environment & Hardcoded Default)
  const userEmail = (user.email || "").toLowerCase().trim();
  if (!userEmail) return false;

  const defaultAdmin = "admin@wealthystep.com";
  const envAdmin = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const envAllowlist = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const allowedEmails = new Set([
    defaultAdmin,
    "mrsivagoram@gmail.com",
    "info@wealthystep.com",
    "siva@wealthystep.com",
    envAdmin,
    ...envAllowlist,
  ].filter(Boolean));
  return allowedEmails.has(userEmail);
}

/**
 * Caches an actively verified admin session.
 * Called immediately upon successful login in /api/admin/login.
 */
export function cacheAdminSession(token: string, user: User, ttlMs: number = CACHE_TTL_MS) {
  if (!token || !user) return;
  tokenCache.set(token, {
    user,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Revokes and deletes a cached session token upon logout.
 */
export function invalidateAdminSession(token?: string | null) {
  if (!token) return;
  tokenCache.delete(token);
}

// Prune expired cache entries periodically
function pruneTokenCache() {
  const now = Date.now();
  if (tokenCache.size > 200) {
    for (const [key, value] of tokenCache.entries()) {
      if (value.expiresAt <= now) {
        tokenCache.delete(key);
      }
    }
  }
}

/**
 * Resolves the configured set of trusted origins based on environment settings.
 */
export function getTrustedOrigins(): Set<string> {
  const origins = new Set<string>();

  // 1. Production canonical origins
  origins.add("https://wealthystep.com");
  origins.add("https://www.wealthystep.com");

  // 2. Explicit environment overrides (e.g. Staging / Preview URLs)
  const envAppUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (envAppUrl) {
    try {
      origins.add(new URL(envAppUrl).origin);
    } catch {}
  }

  const customOrigins = (process.env.TRUSTED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  for (const o of customOrigins) {
    try {
      origins.add(new URL(o).origin);
    } catch {}
  }

  // 3. Development / Test origins (strictly prohibited in production)
  if (process.env.NODE_ENV !== "production") {
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
    origins.add("http://localhost");
    origins.add("http://127.0.0.1");
  }

  return origins;
}

/**
 * Validates whether an incoming request Origin is trusted and safe against CSRF attacks.
 * Enforces strict origin whitelist, rejecting missing, null, malformed, or untrusted origins.
 */
export function validateCsrfOrigin(request: Request): { valid: boolean; reason?: string } {
  const method = request.method.toUpperCase();
  // Safe HTTP methods do not mutate state
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    return { valid: true };
  }

  const originHeader = request.headers.get("origin");

  // Explicitly reject literal "null" Origin (sandboxed iframes, privacy modes, file: URLs)
  if (originHeader === "null") {
    return { valid: false, reason: "Literal 'null' Origin is prohibited on mutation requests." };
  }

  // If Origin header is absent:
  if (!originHeader) {
    const refererHeader = request.headers.get("referer");
    if (!refererHeader) {
      return { valid: false, reason: "Missing Origin and Referer on state-changing request." };
    }

    try {
      const refererOrigin = new URL(refererHeader).origin;
      const trusted = getTrustedOrigins();
      if (!trusted.has(refererOrigin)) {
        return { valid: false, reason: `Untrusted Referer origin: ${refererOrigin}` };
      }
      return { valid: true };
    } catch {
      return { valid: false, reason: "Malformed Referer header." };
    }
  }

  // Parse and validate Origin header
  try {
    const originUrl = new URL(originHeader);
    const normalizedOrigin = originUrl.origin;
    const trustedOrigins = getTrustedOrigins();

    if (!trustedOrigins.has(normalizedOrigin)) {
      return { valid: false, reason: `Untrusted Origin: ${normalizedOrigin}` };
    }

    // Protocol check: in production, HTTP origins are rejected
    if (process.env.NODE_ENV === "production" && originUrl.protocol !== "https:") {
      return { valid: false, reason: `Insecure protocol (${originUrl.protocol}) rejected in production.` };
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: "Malformed Origin header." };
  }
}

/**
 * Extracts and verifies the admin session from incoming Next.js Request headers or cookies.
 * Returns the authenticated Supabase user or an appropriate 401 Unauthorized NextResponse.
 */
export async function requireAdmin(request: Request): Promise<AdminAuthResult> {
  try {
    // 0. Strict CSRF Protection on all state-changing mutations (POST, PUT, PATCH, DELETE)
    const csrfCheck = validateCsrfOrigin(request);
    if (!csrfCheck.valid) {
      console.warn(`[Security Alert: CSRF Blocked] ${csrfCheck.reason}`);
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: `Forbidden. ${csrfCheck.reason}` },
          { status: 403 }
        ),
      };
    }

    let token: string | null = null;

    // 1. Check Authorization Header (Bearer <token>)
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const candidate = authHeader.substring(7).trim();
      if (candidate && candidate !== "cookie-authenticated" && candidate !== "undefined" && candidate !== "null") {
        token = candidate;
      }
    }

    // 2. Check cookies if no Bearer token in header
    if (!token) {
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split(";").map((c) => {
            const [key, ...v] = c.trim().split("=");
            return [key, decodeURIComponent(v.join("="))];
          })
        );

        // Supabase standard cookies
        token =
          cookies["sb-access-token"] ||
          cookies["supabase-auth-token"] ||
          null;

        // In case cookies are stored as JSON array by some Supabase SSR helpers
        if (!token) {
          for (const key of Object.keys(cookies)) {
            if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
              try {
                const parsed = JSON.parse(cookies[key]);
                if (Array.isArray(parsed) && parsed[0]) {
                  token = parsed[0];
                  break;
                } else if (parsed?.access_token) {
                  token = parsed.access_token;
                  break;
                }
              } catch {
                token = cookies[key];
                break;
              }
            }
          }
        }
      }
    }

    if (!token) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: "Unauthorized. Missing authentication token." },
          { status: 401 }
        ),
      };
    }

    // Fast Path: Check memory cache to avoid 500ms network roundtrip to Supabase
    const now = Date.now();
    const cached = tokenCache.get(token);
    if (cached && cached.expiresAt > now) {
      if (!isAuthorizedAdmin(cached.user)) {
        return {
          authenticated: false,
          response: NextResponse.json(
            { error: "Forbidden. Administrative privileges required." },
            { status: 403 }
          ),
        };
      }
      return {
        authenticated: true,
        user: cached.user,
      };
    }

    // Validate the token with Supabase Auth (with 3.5s timeout)
    let user: User | null = null;
    let authError: any = null;

    try {
      const authPromise = supabaseServer.auth.getUser(token);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Supabase auth timeout")), 3500)
      );

      const res = await Promise.race([authPromise, timeoutPromise]);
      user = res.data?.user || null;
      authError = res.error;
    } catch (networkErr: any) {
      authError = networkErr;
    }

    if (!user) {
      tokenCache.delete(token);

      const isNetworkTimeout =
        authError?.name === "AuthRetryableFetchError" ||
        authError?.message?.toLowerCase().includes("fetch failed") ||
        authError?.message?.toLowerCase().includes("timeout") ||
        (authError as any)?.status === 0;

      return {
        authenticated: false,
        response: NextResponse.json(
          {
            error: isNetworkTimeout
              ? "Authentication service temporarily unreachable. Please retry in a moment."
              : "Unauthorized. Invalid or expired session.",
          },
          { status: isNetworkTimeout ? 503 : 401 }
        ),
      };
    }

    // Explicitly verify administrative role authorization
    if (!isAuthorizedAdmin(user)) {
      tokenCache.delete(token);
      console.warn(`[Security Alert] Non-admin user (${user.email}) attempted administrative API access.`);
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: "Forbidden. Administrative privileges required." },
          { status: 403 }
        ),
      };
    }

    // Cache verified user
    pruneTokenCache();
    tokenCache.set(token, {
      user,
      expiresAt: now + CACHE_TTL_MS,
    });

    return {
      authenticated: true,
      user,
    };
  } catch (err: any) {
    console.error("Error verifying admin authentication:", err);
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: "Authentication verification failed." },
        { status: 401 }
      ),
    };
  }
}

