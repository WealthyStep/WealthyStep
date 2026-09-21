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

    // Authenticate securely on the server via Supabase Auth
    const { data, error } = await supabaseServer.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (error || !data.session) {
      console.error("Server-side Supabase sign-in error:", error);
      return NextResponse.json(
        { error: error?.message || "Invalid login credentials. Please check your email and password." },
        { status: 401 }
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
