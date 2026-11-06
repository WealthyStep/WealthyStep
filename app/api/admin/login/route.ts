import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
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

    const response = NextResponse.json({
      success: true,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        expires_in: data.session.expires_in,
        token_type: data.session.token_type,
        user: data.user,
      },
      user: data.user,
    });

    // Set cookie for session resilience
    response.cookies.set("sb-access-token", data.session.access_token, {
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: data.session.expires_in || 3600 * 24,
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
