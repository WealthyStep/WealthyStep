import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { leadDataSchema } from '@/lib/chatbot/validators';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Server-side validation
    const parsed = leadDataSchema.parse(body);

    // 2. Honeypot check
    if (parsed.website && parsed.website.length > 0) {
      // Spam bot filled the honeypot
      return NextResponse.json({ success: true }); // Fake success to deter bots
    }

    // 3. Email configuration check
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    const emailTo = process.env.EMAIL_TO;
    
    if (!smtpHost || !smtpUser || !smtpPass || !emailTo) {
      console.warn("Chatbot Email submission attempted but SMTP variables are not configured in environment.");
      // If we are in development or config is missing, simulate success for testing
      // In production, you would throw an error or handle it.
      return NextResponse.json({ 
        success: true, 
        mocked: true, 
        message: "Email credentials not configured. Returning mock success." 
      });
    }

    // 4. Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // 5. Sanitize HTML
    // (Zod already sanitized and validated the raw text length and basic format)
    const safeName = parsed.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeMessage = parsed.message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const refId = `WS-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; border-radius: 0 !important; }
            .content-box { padding: 20px 15px !important; }
            .header-box { padding: 25px 15px !important; }
            .logo-img { height: 40px !important; }
            .table-label { width: 80px !important; font-size: 13px !important; }
            .table-value { font-size: 14px !important; }
            .source-badge { font-size: 10px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f4f7f6; padding: 20px 10px;">
          <tr>
            <td align="center">
              <table class="email-container" width="600" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); border: 1px solid #eef2f6;">
                
                <!-- Header with White Background for Logo -->
                <tr>
                  <td class="header-box" align="center" style="background-color: #ffffff; padding: 35px 30px 25px; border-bottom: 2px solid #f8fafc;">
                    <img class="logo-img" src="https://wealthystepwebsite.vercel.app/logo.png" alt="Wealthy Step" style="height: 52px; width: auto; display: block; margin: 0 auto 20px auto; border: 0;" />
                    <div class="source-badge" style="background-color: #f0fdf4; border: 1px solid #bce640; color: #166534; display: inline-block; padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 15px;">
                      Source: ${parsed.source || 'Website'}
                    </div>
                    <h2 style="margin: 0; font-size: 24px; font-weight: 800; color: #180D45;">New Enquiry Received</h2>
                    <p style="margin: 8px 0 0 0; font-size: 13px; color: #94a3b8; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">Ref ID: ${refId}</p>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td class="content-box" style="padding: 30px; background-color: #ffffff;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td class="table-label" style="padding: 14px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 110px; font-size: 14px; vertical-align: top;"><strong>Name</strong></td>
                        <td class="table-value" style="padding: 14px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 15px; font-weight: 600; vertical-align: top;">${safeName}</td>
                      </tr>
                      <tr>
                        <td class="table-label" style="padding: 14px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; vertical-align: top;"><strong>Mobile</strong></td>
                        <td class="table-value" style="padding: 14px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 15px; font-weight: 600; vertical-align: top;">${parsed.phone}</td>
                      </tr>
                      <tr>
                        <td class="table-label" style="padding: 14px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; vertical-align: top;"><strong>Email</strong></td>
                        <td class="table-value" style="padding: 14px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 15px; font-weight: 600; vertical-align: top;">
                          <a href="mailto:${parsed.email}" style="color: #281475; text-decoration: none; border-bottom: 1px solid #bce640;">${parsed.email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td class="table-label" style="padding: 14px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; vertical-align: top;"><strong>Service</strong></td>
                        <td class="table-value" style="padding: 14px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 15px; font-weight: 600; vertical-align: top;">
                          <span style="background-color: #f8fafc; padding: 5px 12px; border-radius: 6px; border: 1px solid #e2e8f0; color: #180D45;">${parsed.service}</span>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Message Box -->
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                      <tr>
                        <td>
                          <strong style="color: #475569; display: block; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Client Message</strong>
                          <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #bce640; color: #334155; font-size: 15px; line-height: 1.6; white-space: pre-wrap; box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.02);">${safeMessage}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td align="center" style="background-color: #f8fafc; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 8px 0;">This enquiry was securely generated by the <strong>Wealthy Step</strong> platform.</p>
                    <p style="margin: 0; opacity: 0.8;">Received on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // 6. Send Email
    await transporter.sendMail({
      from: `"Wealthy Step" <${process.env.EMAIL_FROM || smtpUser}>`,
      to: emailTo,
      subject: `[${parsed.source || 'Website'}] New Enquiry - ${parsed.service} (${safeName})`,
      html: htmlBody,
    });

    return NextResponse.json({ success: true, ref: refId });
    
  } catch (error) {
    console.error("Chatbot submission error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: (error as any).errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
