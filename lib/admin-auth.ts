import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import type { User } from "@supabase/supabase-js";

export type AdminAuthResult =
  | { authenticated: true; user: User }
  | { authenticated: false; response: NextResponse };

// In-memory cache for authenticated admin sessions (TTL: 2 minutes)
interface CachedUser {
  user: User;
  expiresAt: number;
}
const tokenCache = new Map<string, CachedUser>();
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

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
 * Extracts and verifies the admin session from incoming Next.js Request headers or cookies.
 * Returns the authenticated Supabase user or an appropriate 401 Unauthorized NextResponse.
 */
export async function requireAdmin(request: Request): Promise<AdminAuthResult> {
  try {
    let token: string | null = null;

    // 1. Check Authorization Header (Bearer <token>)
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
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
      return {
        authenticated: true,
        user: cached.user,
      };
    }

    // Validate the token with Supabase Auth
    const { data: { user }, error } = await supabaseServer.auth.getUser(token);

    if (error || !user) {
      tokenCache.delete(token);
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: "Unauthorized. Invalid or expired session." },
          { status: 401 }
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

