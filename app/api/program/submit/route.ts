import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { validateParticipantInput } from "@/lib/program-validation";
import { recordAuditLog } from "@/lib/audit";
import { sendParticipantNotificationEmail } from "@/lib/participant-email";

// Simple in-memory IP rate limiter to protect against spam flooding
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_SUBMISSIONS_PER_IP = 15;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  record.count += 1;
  return record.count > MAX_SUBMISSIONS_PER_IP;
}

export async function POST(request: Request) {
  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  // 1. IP Rate Limiting Check
  if (isRateLimited(ipAddress)) {
    return NextResponse.json(
      { error: "Too many submissions from this device. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));

    // 2. Invisible Honeypot Trap
    if (body.website && String(body.website).trim().length > 0) {
      console.warn(`[Bot Detected] Honeypot field filled by IP: ${ipAddress}`);
      return NextResponse.json(
        { success: true, message: "Submission received successfully." },
        { status: 200 }
      );
    }

    // 3. Cloudflare Turnstile Verification
    const turnstileToken = body.turnstileToken;
    const turnstileSecret =
      process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ||
      process.env.TURNSTILE_SECRET_KEY ||
      "1x0000000000000000000000000000000AA"; // Cloudflare official test key

    if (turnstileToken && turnstileSecret) {
      try {
        const verifyFormData = new URLSearchParams();
        verifyFormData.append("secret", turnstileSecret);
        verifyFormData.append("response", turnstileToken);
        if (ipAddress && ipAddress !== "unknown") {
          verifyFormData.append("remoteip", ipAddress);
        }

        const turnstileRes = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            body: verifyFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );

        const turnstileResult = await turnstileRes.json();
        // If not successful and not in development test key, reject
        if (!turnstileResult.success && turnstileSecret !== "1x0000000000000000000000000000000AA") {
          console.warn("Cloudflare Turnstile verification failed:", turnstileResult);
          return NextResponse.json(
            {
              error: "Human verification failed. Please refresh the page and try again.",
              field: "turnstile",
            },
            { status: 400 }
          );
        }
      } catch (cfErr) {
        console.warn("Error contacting Cloudflare Turnstile service:", cfErr);
        // Fail-open for network outages so legitimate webinar attendees are never blocked
      }
    }

    // 4. Server-Side Input Validation
    const validation = validateParticipantInput({
      name: body.name,
      email: body.email,
      mobile: body.mobile,
      age: body.age,
      occupation: body.occupation,
      interested_in: body.interested_in,
      consent_given: body.consent_given,
      session_date: body.session_date,
    });

    if (!validation.valid || !validation.sanitized) {
      return NextResponse.json(
        { error: validation.error, field: validation.field },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      mobile,
      age,
      occupation,
      interested_in,
      consent_given,
      consent_text,
      session_date,
    } = validation.sanitized;

    // 5. Store Participant in Supabase PostgreSQL
    const { data, error: dbError } = await supabaseServer
      .from("program_participants")
      .insert({
        name,
        email,
        mobile,
        age,
        occupation,
        interested_in,
        consent_given,
        consent_text,
        status: "New",
        notes: `📅 Session Date: ${session_date}`,
        source: body.source || "Financial Freedom Awareness Program",
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select("id, name, created_at")
      .single();

    if (dbError) {
      console.error("Supabase insert error in /api/program/submit:", dbError);

      if (
        (dbError as any)?.code === "PGRST205" ||
        (dbError as any)?.code === "42P01" ||
        dbError.message?.includes("schema cache") ||
        dbError.message?.includes("does not exist")
      ) {
        return NextResponse.json(
          {
            error:
              "The participant database table is currently being initialized. Please run sql/program_participants.sql in the Supabase SQL Editor.",
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: "Unable to save your details right now. Please try again." },
        { status: 500 }
      );
    }

    // 6. Fast Concurrent Email Notification (Non-blocking)
    // Dispatches the modern, high-converting notification email to the advisor/client
    sendParticipantNotificationEmail({
      id: data.id,
      name,
      email,
      mobile,
      age,
      occupation,
      interested_in,
      sessionDate: session_date,
      submittedAt: new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
      }),
      source: body.source || "Financial Freedom Awareness Program",
    }).catch((emailErr) => {
      console.error("Non-blocking participant notification email error:", emailErr);
    });

    // 7. Audit Logging (Background, non-blocking)
    try {
      await recordAuditLog({
        actor: `participant:${data.id}`,
        action: "PROGRAM_PARTICIPANT_REGISTERED",
        targetType: "program_participants",
        targetId: data.id,
        details: {
          name,
          email,
          mobile: `***${mobile.slice(-4)}`,
          occupation,
          interestsCount: interested_in.length,
          sessionDate: session_date,
        },
        ipAddress,
      });
    } catch (auditErr) {
      console.warn("Failed to write audit log for participant submission:", auditErr);
    }

    // 8. Millisecond Response Transition
    return NextResponse.json(
      {
        success: true,
        message: "Your details have been successfully submitted! Thank you.",
        id: data.id,
        participant: {
          name: data.name,
          createdAt: data.created_at,
          sessionDate: session_date,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Unexpected error in /api/program/submit:", err);
    return NextResponse.json(
      { error: "A server error occurred. Please try again." },
      { status: 500 }
    );
  }
}
