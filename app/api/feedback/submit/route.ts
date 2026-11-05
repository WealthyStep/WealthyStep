import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { validateParticipantInput } from "@/lib/feedback-validation";
import { recordAuditLog } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const body = await request.json().catch(() => ({}));

    // 1. Honeypot anti-spam check (hidden field)
    if (body.website && String(body.website).trim().length > 0) {
      // Fake success for bots
      return NextResponse.json(
        { success: true, message: "Thank you for submitting your details." },
        { status: 200 }
      );
    }

    // 2. Cloudflare Turnstile Bot Protection
    const turnstileToken = body.turnstileToken;
    const turnstileSecret =
      process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";

    if (turnstileToken) {
      try {
        const formData = new URLSearchParams();
        formData.append("secret", turnstileSecret);
        formData.append("response", turnstileToken);
        if (ipAddress !== "unknown") {
          formData.append("remoteip", ipAddress);
        }

        const verifyRes = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            body: formData,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );

        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          console.warn("Turnstile verification returned non-success:", verifyData);
          return NextResponse.json(
            { error: "Security check failed. Please refresh the page and try again." },
            { status: 400 }
          );
        }
      } catch (turnstileErr) {
        console.error("Turnstile request error:", turnstileErr);
        // Do not crash legitimate users if Cloudflare API has network blip in dev
      }
    }

    // 3. Strict Input Validation
    const validation = validateParticipantInput({
      name: body.name,
      email: body.email,
      mobile: body.mobile,
      age: body.age,
      occupation: body.occupation,
      interested_in: body.interested_in,
      consent_given: body.consent_given,
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
    } = validation.sanitized;

    // 4. Insert into Supabase database
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
        notes: "",
        source: body.source || "Financial Freedom Awareness Program",
        ip_address: ipAddress,
        user_agent: userAgent.slice(0, 500),
      })
      .select("id, name, created_at")
      .single();

    if (dbError) {
      console.error("Supabase insert error in /api/feedback/submit:", dbError);
      const isFetchError =
        (dbError as any)?.name === "AuthRetryableFetchError" ||
        dbError.message?.toLowerCase().includes("fetch failed") ||
        (dbError as any)?.status === 0;

      if (isFetchError) {
        return NextResponse.json(
          {
            error:
              "Unable to connect to the database service. The database may be temporarily paused. Please try again in a few moments.",
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: "Unable to save your details right now. Please try again." },
        { status: 500 }
      );
    }

    // 5. Audit Logging (Background, non-blocking)
    try {
      await recordAuditLog({
        actor: `participant:${data.id}`,
        action: "PROGRAM_FEEDBACK_SUBMITTED",
        targetType: "program_participants",
        targetId: data.id,
        details: {
          name,
          email,
          mobile: `***${mobile.slice(-4)}`,
          occupation,
          interestsCount: interested_in.length,
        },
        ipAddress,
      });
    } catch (auditErr) {
      console.warn("Failed to write audit log for participant submission:", auditErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your details have been successfully submitted! Thank you.",
        id: data.id,
        participant: {
          name: data.name,
          createdAt: data.created_at,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Unexpected error in /api/feedback/submit:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

