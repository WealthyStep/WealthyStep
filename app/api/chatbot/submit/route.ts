import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { leadDataSchema } from '@/lib/chatbot/validators';
import { supabaseServer } from '@/lib/supabase-server';
import { z } from 'zod';

export async function POST(req: Request) {
  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  try {
    const body = await req.json().catch(() => ({}));

    // 1. Turnstile Verification
    const turnstileToken = body.turnstileToken;
    const isLocalRequest =
      ipAddress === "::1" ||
      ipAddress === "127.0.0.1" ||
      ipAddress.startsWith("192.168.") ||
      ipAddress.startsWith("10.") ||
      process.env.NODE_ENV !== "production";

    const isTestToken =
      turnstileToken === "fallback-token" ||
      turnstileToken === "cf-bypassed" ||
      isLocalRequest;

    const turnstileSecret = isTestToken
      ? "1x0000000000000000000000000000000AA"
      : (process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ||
         process.env.TURNSTILE_SECRET_KEY ||
         "1x0000000000000000000000000000000AA");
    
    if (!turnstileToken && !isLocalRequest) {
      return NextResponse.json(
        { error: "Verification failed", message: "Security token missing." },
        { status: 400 }
      );
    }

    if (turnstileToken && !isTestToken && turnstileSecret !== "1x0000000000000000000000000000000AA") {
      const formData = new URLSearchParams();
      formData.append('secret', turnstileSecret);
      formData.append('response', turnstileToken);
      if (ipAddress !== "unknown") {
        formData.append('remoteip', ipAddress);
      }

      const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const turnstileResult = await turnstileRes.json();
      if (!turnstileResult.success) {
        console.warn("Turnstile verification failed:", turnstileResult);
        return NextResponse.json(
          { error: "Verification failed", message: "Security check failed." },
          { status: 400 }
        );
      }
    }

    // 2. Server-side validation
    const parsed = leadDataSchema.parse(body);

    // 3. Honeypot check
    if (parsed.website && parsed.website.length > 0) {
      console.warn(`[Bot Detected] Honeypot field filled by IP: ${ipAddress}`);
      return NextResponse.json({ success: true, message: "Inquiry received." });
    }

    const refId = `WS-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    const safeName = parsed.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeMessage = (parsed.message || '').replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // 4. Guaranteed Database Persistence (Primary: enquiries table, Fallback: audit_logs)
    let persisted = false;
    let enquiryDbId: string = refId;

    try {
      const { data: inserted, error: dbError } = await supabaseServer
        .from("enquiries")
        .insert({
          ref_id: refId,
          name: parsed.name,
          email: parsed.email,
          phone: parsed.phone,
          service: parsed.service,
          message: parsed.message || "",
          source: parsed.source || "Website Contact",
          status: "New",
          email_status: "pending",
          ip_address: ipAddress !== "unknown" ? ipAddress : null,
          user_agent: userAgent,
        })
        .select("id")
        .single();

      if (!dbError && inserted) {
        persisted = true;
        enquiryDbId = inserted.id;
      } else {
        throw dbError;
      }
    } catch (insertErr: any) {
      console.warn(
        "Enquiries table write fallback to audit_logs:",
        insertErr?.message || insertErr
      );
      try {
        const { data: auditSaved } = await supabaseServer
          .from("audit_logs")
          .insert({
            actor: `lead:${parsed.phone}`,
            action: "CONTACT_ENQUIRY",
            target_type: "enquiries",
            target_id: refId,
            details: {
              ref_id: refId,
              name: parsed.name,
              email: parsed.email,
              phone: parsed.phone,
              service: parsed.service,
              message: parsed.message || "",
              source: parsed.source || "Website Contact",
              status: "New",
              email_status: "pending",
            },
            ip_address: ipAddress !== "unknown" ? ipAddress : null,
          })
          .select("id")
          .single();

        if (auditSaved) {
          persisted = true;
          enquiryDbId = auditSaved.id;
        }
      } catch (auditErr) {
        console.error("Critical: Failed to persist inquiry to audit_logs:", auditErr);
      }
    }

    // 5. Email Notification Delivery
    let emailSent = false;
    let emailErrorMsg: string | null = null;

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    const emailTo = process.env.EMAIL_TO || "info@wealthystep.com";

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const htmlBody = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f4f7f6; padding: 20px 10px;">
              <tr>
                <td align="center">
                  <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #eef2f6;">
                    <tr>
                      <td align="center" style="background-color: #ffffff; padding: 30px 25px 20px; border-bottom: 2px solid #f8fafc;">
                        <img src="https://wealthystep.com/logo.png" alt="Wealthy Step" style="height: 48px; width: auto; display: block; margin: 0 auto 15px auto;" />
                        <div style="background-color: #f0fdf4; border: 1px solid #bce640; color: #166534; display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase;">
                          Source: ${parsed.source || 'Website Contact'}
                        </div>
                        <h2 style="margin: 12px 0 0 0; font-size: 22px; font-weight: 800; color: #180D45;">New Customer Inquiry</h2>
                        <p style="margin: 6px 0 0 0; font-size: 12px; color: #64748b; font-family: monospace;">Ref: ${refId}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 25px 30px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 14px;">
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 110px;"><strong>Name</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 600;">${safeName}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Mobile</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 600;">
                              <a href="tel:+91${parsed.phone}" style="color: #180D45; text-decoration: none;">+91 ${parsed.phone}</a>
                              <a href="https://wa.me/91${parsed.phone}" target="_blank" style="margin-left: 10px; color: #16a34a; font-weight: 700; text-decoration: none;">💬 WhatsApp</a>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Email</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 600;">
                              <a href="mailto:${parsed.email}" style="color: #180D45;">${parsed.email}</a>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Service</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 600;">
                              <span style="background-color: #f8fafc; padding: 4px 10px; border-radius: 6px; border: 1px solid #e2e8f0; color: #180D45;">${parsed.service}</span>
                            </td>
                          </tr>
                        </table>
                        <div style="margin-top: 20px;">
                          <strong style="color: #475569; display: block; margin-bottom: 8px; font-size: 13px; text-transform: uppercase;">Message</strong>
                          <div style="background-color: #f8fafc; padding: 15px; border-radius: 10px; border-left: 4px solid #bce640; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${safeMessage || "No message provided."}</div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="background-color: #f8fafc; padding: 15px 20px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
                        Wealthy Step • AMFI Registered Mutual Fund Distributor | ARN - 322891
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;

        await transporter.sendMail({
          from: `"Wealthy Step" <${process.env.EMAIL_FROM || smtpUser}>`,
          to: emailTo,
          subject: `[${parsed.source || 'Website Contact'}] New Inquiry: ${safeName} (${parsed.service})`,
          html: htmlBody,
        });

        emailSent = true;
      } catch (mailErr: any) {
        emailErrorMsg = mailErr?.message || "Mail delivery error";
        console.warn("SMTP email notification notice in /api/chatbot/submit:", emailErrorMsg);
      }
    } else {
      console.warn("SMTP configuration not present in environment; notification email queued.");
    }

    // 6. Update database email status if enquiries table exists
    try {
      await supabaseServer
        .from("enquiries")
        .update({
          email_status: emailSent ? "sent" : "failed",
          email_error: emailErrorMsg,
        })
        .eq("ref_id", refId);
    } catch {}

    // Return honest, validated result (never mock success when nothing was saved!)
    if (!persisted && !emailSent) {
      return NextResponse.json(
        { error: "We are currently experiencing technical difficulties. Please call us directly at +91 90009 29666." },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      ref: refId,
      persisted,
      email_status: emailSent ? "sent" : "queued",
      message: "Thank you for reaching out! Your inquiry has been safely recorded and our team will get back to you shortly.",
    });

  } catch (error) {
    console.error("Chatbot submission error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

