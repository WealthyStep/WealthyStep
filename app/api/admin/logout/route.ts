import { NextResponse } from "next/server";
import { invalidateAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    // Extract token if present
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    let token: string | null = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }

    if (!token) {
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split(";").map((c) => {
            const [key, ...v] = c.trim().split("=");
            return [key, decodeURIComponent(v.join("="))];
          })
        );
        token = cookies["sb-access-token"] || null;
      }
    }

    if (token) {
      invalidateAdminSession(token);
    }

    const response = NextResponse.json({
      success: true,
      message: "Admin session terminated successfully.",
    });

    // Invalidate HttpOnly cookie immediately
    response.cookies.set("sb-access-token", "", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (err: any) {
    console.error("Logout error in /api/admin/logout:", err);
    return NextResponse.json(
      { error: "Internal server error during logout." },
      { status: 500 }
    );
  }
}

