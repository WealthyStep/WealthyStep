import crypto from "crypto";
import { supabaseServer } from "@/lib/supabase-server";

// Server-only check
if (typeof window !== "undefined") {
  throw new Error("verified-session.ts cannot be used on the client side");
}

const SESSION_EXPIRY_MINUTES = 15;

function hashSessionToken(token: string): string {
  return crypto.createHash("sha256").update(token.trim()).digest("hex");
}

/**
 * Creates a new secure temporary session token for a verified client.
 * The plaintext token is returned to the client, while its SHA-256 hash is saved in DB.
 */
export async function createVerifiedSession(clientId: string): Promise<string> {
  const plaintextToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashSessionToken(plaintextToken);
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MINUTES * 60 * 1000).toISOString();

  const { error } = await supabaseServer.from("verified_sessions").insert({
    client_id: clientId,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  if (error) {
    console.error("Failed to store verified session in database:", error);
    throw new Error("Failed to initialize verified session.");
  }

  return plaintextToken;
}

/**
 * Validates a session token provided in client request headers (x-session-token).
 * Returns the client ID if valid and unexpired; otherwise returns null.
 */
export async function validateVerifiedSession(token: string | null): Promise<string | null> {
  if (!token || typeof token !== "string" || token.length < 16) {
    return null;
  }

  const tokenHash = hashSessionToken(token);
  const nowIso = new Date().toISOString();

  const { data, error } = await supabaseServer
    .from("verified_sessions")
    .select("client_id, expires_at")
    .eq("token_hash", tokenHash)
    .gt("expires_at", nowIso)
    .single();

  if (error || !data) {
    return null;
  }

  return data.client_id;
}

/**
 * Revokes / deletes an active verified session (e.g. client clicks logout).
 */
export async function revokeVerifiedSession(token: string): Promise<boolean> {
  if (!token) return true;
  const tokenHash = hashSessionToken(token);
  const { error } = await supabaseServer
    .from("verified_sessions")
    .delete()
    .eq("token_hash", tokenHash);

  return !error;
}
