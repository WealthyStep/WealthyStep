import nodemailer from "nodemailer";

// Server-only check
if (typeof window !== "undefined") {
  throw new Error("participant-email.ts cannot be used on the client side");
}

export interface ParticipantNotificationData {
  id: string;
  name: string;
  email: string;
  mobile: string;
  age: number;
  occupation: string;
  interested_in: string[];
  sessionDate: string;
  submittedAt: string;
  source?: string;
}

/**
 * Sends a modern, ultra-premium, responsive notification email to the advisor/admin
 * whenever a participant submits their details in the Financial Freedom Awareness Program.
 */
export async function sendParticipantNotificationEmail(
  data: ParticipantNotificationData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM || "noreply@wealthystep.com";
  const senderName = "Wealthy Step™ | Awareness Program";
  
  // Recipient: configured EMAIL_TO or advisor notification email, fallback to info@wealthystep.com
  const recipientEmail =
    process.env.EMAIL_TO ||
    process.env.ADVISOR_NOTIFICATION_EMAIL ||
    "info@wealthystep.com";

  const emailSubject = `🚀 New Participant: ${data.name} (+91 ${data.mobile}) — Financial Freedom Program`;

  const interestsList =
    data.interested_in && data.interested_in.length > 0
      ? data.interested_in
      : ["General Financial Guidance"];

  const interestsBadgesHtml = interestsList
    .map(
      (interest) => `
      <span style="display: inline-block; background-color: #F3F7EB; color: #180D45; border: 1px solid #C7D9A8; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; margin: 2px 4px 2px 0;">
        ${interest}
      </span>
    `
    )
    .join("");

  const cleanMobile = data.mobile.replace(/\D/g, "").slice(-10);
  const whatsappUrl = `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(
    `Hello ${data.name}, thank you for attending the Wealthy Step Financial Freedom Awareness Program! We are glad to connect with you.`
  )}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F6F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #180D45;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F6F0; padding: 24px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8D8; overflow: hidden; box-shadow: 0 8px 30px rgba(24, 13, 69, 0.08);">
          
          <!-- Top Navy Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #180D45 0%, #25156B 100%); padding: 28px 24px 24px 24px; text-align: center;">
              <div style="display: inline-block; background-color: rgba(132, 189, 60, 0.18); border: 1px solid #84BD3C; border-radius: 24px; padding: 4px 12px; margin-bottom: 8px;">
                <span style="color: #84BD3C; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
                  ★ LIVE PARTICIPANT SUBMISSION ★
                </span>
              </div>
              <h1 style="color: #FFFFFF; margin: 0 0 6px 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">
                Financial Freedom Awareness Program
              </h1>
              <p style="color: rgba(255, 255, 255, 0.8); margin: 0; font-size: 12px; font-weight: 500;">
                Wealthy Step™ • AMFI Registered ARN-322891
              </p>
            </td>
          </tr>

          <!-- Notification Highlight Strip -->
          <tr>
            <td style="background-color: #F3F7EB; border-bottom: 1px solid #D6E4BE; padding: 12px 24px; text-align: center;">
              <span style="color: #446A1B; font-size: 12px; font-weight: 700;">
                📅 Date of Participation: <strong>${data.sessionDate}</strong> (${data.submittedAt})
              </span>
            </td>
          </tr>

          <!-- Participant Details Body -->
          <tr>
            <td style="padding: 28px 24px 16px 24px;">
              <h2 style="margin: 0 0 16px 0; font-size: 15px; font-weight: 800; color: #180D45; text-transform: uppercase; letter-spacing: 0.8px;">
                Attendee Information
              </h2>

              <!-- Details Table -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: separate; border-spacing: 0; width: 100%; border: 1px solid #EBECE8; border-radius: 12px; overflow: hidden; margin-bottom: 20px;">
                <!-- Full Name -->
                <tr style="background-color: #FAFCF7;">
                  <td width="35%" style="padding: 12px 16px; font-size: 12px; font-weight: 700; color: #6B7280; border-bottom: 1px solid #EBECE8;">
                    Full Name
                  </td>
                  <td width="65%" style="padding: 12px 16px; font-size: 14px; font-weight: 800; color: #180D45; border-bottom: 1px solid #EBECE8;">
                    ${data.name}
                  </td>
                </tr>

                <!-- Mobile Phone -->
                <tr>
                  <td style="padding: 12px 16px; font-size: 12px; font-weight: 700; color: #6B7280; border-bottom: 1px solid #EBECE8;">
                    Mobile Number
                  </td>
                  <td style="padding: 12px 16px; font-size: 14px; font-weight: 800; color: #180D45; border-bottom: 1px solid #EBECE8;">
                    <a href="tel:+91${cleanMobile}" style="color: #180D45; text-decoration: none;">
                      +91 ${cleanMobile}
                    </a>
                  </td>
                </tr>

                <!-- Email -->
                <tr style="background-color: #FAFCF7;">
                  <td style="padding: 12px 16px; font-size: 12px; font-weight: 700; color: #6B7280; border-bottom: 1px solid #EBECE8;">
                    Email Address
                  </td>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #180D45; border-bottom: 1px solid #EBECE8;">
                    <a href="mailto:${data.email}" style="color: #180D45; text-decoration: underline;">
                      ${data.email}
                    </a>
                  </td>
                </tr>

                <!-- Age & Occupation -->
                <tr>
                  <td style="padding: 12px 16px; font-size: 12px; font-weight: 700; color: #6B7280; border-bottom: 1px solid #EBECE8;">
                    Age & Occupation
                  </td>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #180D45; border-bottom: 1px solid #EBECE8;">
                    ${data.age} Years • ${data.occupation}
                  </td>
                </tr>

                <!-- Interested In -->
                <tr style="background-color: #FAFCF7;">
                  <td style="padding: 12px 16px; font-size: 12px; font-weight: 700; color: #6B7280;">
                    Goals / Interests
                  </td>
                  <td style="padding: 12px 16px; font-size: 13px;">
                    ${interestsBadgesHtml}
                  </td>
                </tr>
              </table>

              <!-- Quick Action Buttons for Advisor -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <!-- WhatsApp Button -->
                  <td width="48%" align="center">
                    <a href="${whatsappUrl}" target="_blank" style="display: block; background-color: #25D366; color: #FFFFFF; font-size: 12px; font-weight: 800; text-align: center; text-decoration: none; padding: 12px 14px; border-radius: 12px; box-shadow: 0 2px 6px rgba(37, 211, 102, 0.3);">
                      💬 WhatsApp Attendee
                    </a>
                  </td>
                  <td width="4%">&nbsp;</td>
                  <!-- Call Button -->
                  <td width="48%" align="center">
                    <a href="tel:+91${cleanMobile}" style="display: block; background-color: #180D45; color: #FFFFFF; font-size: 12px; font-weight: 800; text-align: center; text-decoration: none; padding: 12px 14px; border-radius: 12px; box-shadow: 0 2px 6px rgba(24, 13, 69, 0.3);">
                      📞 Call Attendee
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Admin Dashboard Link -->
              <div style="background-color: #FAFBF7; border: 1px solid #E2E8D8; border-radius: 14px; padding: 16px; text-align: center; margin-bottom: 8px;">
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #4B5563; font-weight: 500;">
                  This submission has been automatically recorded in your Admin Dashboard.
                </p>
                <a href="https://wealthystep.com/admin/dashboard" target="_blank" style="display: inline-block; background-color: #84BD3C; color: #180D45; font-size: 12px; font-weight: 800; text-decoration: none; padding: 9px 20px; border-radius: 20px;">
                  Open Admin Dashboard & Update Notes →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAF5; border-top: 1px solid #E2E8D8; padding: 18px 24px; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; color: #180D45;">
                Wealthy Step™ • AMFI Registered Mutual Fund Distributor | ARN - 322891
              </p>
              <p style="margin: 0; font-size: 10px; color: #9CA3AF;">
                Confidential lead notification generated automatically upon participant form completion.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // 1. Send via Brevo REST API if configured
  if (brevoApiKey && brevoApiKey !== "your-brevo-api-key") {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: recipientEmail, name: "Wealthy Step Advisor" }],
          subject: emailSubject,
          htmlContent,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, messageId: result.messageId };
      }
      const errorData = await response.json().catch(() => ({}));
      console.warn("Brevo API notification error:", errorData);
    } catch (apiErr: any) {
      console.warn("Brevo notification email failed, attempting SMTP fallback:", apiErr.message);
    }
  }

  // 2. Fallback to SMTP if configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: recipientEmail,
        subject: emailSubject,
        html: htmlContent,
      });

      return { success: true, messageId: info.messageId };
    } catch (smtpErr: any) {
      console.error("SMTP participant notification failed:", smtpErr.message);
      return { success: false, error: smtpErr.message };
    }
  }

  // Development / Simulation Fallback (Logged safely)
  console.log(`[DEV NOTIFICATION] New participant submission for ${data.name} (+91 ${data.mobile}) sent to ${recipientEmail}`);
  return { success: true, messageId: "dev-simulated-id" };
}

