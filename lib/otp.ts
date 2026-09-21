import crypto from "crypto";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

// Server-only check
if (typeof window !== "undefined") {
  throw new Error("otp.ts cannot be used on the client side");
}

/**
 * Generates a cryptographically secure 6-digit numeric OTP.
 */
export function generateOtp(): string {
  const num = crypto.randomInt(100000, 1000000);
  return num.toString();
}

/**
 * Hashes an OTP with a secret pepper to prevent plaintext storage in the database.
 */
export function hashOtp(otp: string): string {
  const pepper = process.env.OTP_PEPPER || "wealthystep-default-secure-pepper-2026";
  return crypto.createHmac("sha256", pepper).update(otp.trim()).digest("hex");
}

/**
 * Sends a branded transactional OTP email using Brevo (API / SMTP).
 */
export async function sendOtpEmail({
  toEmail,
  clientName,
  otp,
}: {
  toEmail: string;
  clientName: string;
  otp: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM || "noreply@wealthystep.com";
  const senderName = "Wealthy Step | Document Vault";

  const emailSubject = `${otp} is your Wealthy Step Policy Retrieval OTP`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAF5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #180D45;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAF5; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="540px" style="max-width: 540px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8D8; overflow: hidden; box-shadow: 0 4px 20px rgba(24, 13, 69, 0.06);">
          <!-- Header Banner with Logo -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 26px 32px 18px 32px; text-align: center; border-bottom: 2px solid #F3F7EB;">
              <a href="https://wealthystep.com" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="cid:wealthystep-logo" alt="Wealthy Step" width="220" style="width: 220px; max-width: 100%; height: auto; display: block; margin: 0 auto; border: 0;" />
              </a>
              <p style="color: #180D45; margin: 8px 0 0 0; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
                Policy Document Vault
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #180D45; font-weight: 600;">
                Hello ${clientName || "Valued Client"},
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #4A4A4A;">
                You requested a secure One-Time Password (OTP) to view and download your policy documents from Wealthy Step.
              </p>

              <!-- OTP Display Box -->
              <div style="background-color: #F3F7EB; border: 2px dashed #84BD3C; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
                <div style="font-size: 11px; font-weight: 700; color: #618A2B; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
                  Your 6-Digit Verification Code
                </div>
                <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #180D45; font-family: monospace;">
                  ${otp}
                </div>
                <div style="font-size: 12px; color: #618A2B; margin-top: 6px; font-weight: 500;">
                  ⏱️ Valid for 5 minutes only
                </div>
              </div>

              <!-- Security Notice -->
              <div style="background-color: #FFF9E6; border-left: 4px solid #F5B921; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #8A6508;">
                  <strong>Security Reminder:</strong> Wealthy Step advisors will never ask you for your OTP over phone or SMS. Do not share this code with anyone.
                </p>
              </div>

              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #71717A;">
                If you did not initiate this request, you can safely disregard this email. Your documents remain securely protected.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAF5; border-top: 1px solid #E2E8D8; padding: 20px 32px; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #180D45;">
                Wealthy Step | AMFI Registered Mutual Fund & Insurance Distributor
              </p>
              <p style="margin: 0; font-size: 11px; color: #8C8C8C;">
                © ${new Date().getFullYear()} Wealthy Step. All rights reserved.
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

  // 1. Send using Brevo REST API if API Key is configured
  if (brevoApiKey && brevoApiKey !== "your-brevo-api-key") {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: toEmail, name: clientName || undefined }],
          subject: emailSubject,
          htmlContent: htmlContent.replace('src="cid:wealthystep-logo"', 'src="https://wealthystep.com/logo.png"'),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Brevo API error:", errorData);
        throw new Error(errorData.message || `Brevo API HTTP ${response.status}`);
      }

      const result = await response.json();
      return { success: true, messageId: result.messageId };
    } catch (apiErr: any) {
      console.error("Brevo REST API sending failed:", apiErr.message);
      // Fall through to SMTP fallback if available
    }
  }

  // 2. Fallback to SMTP if configured in environment
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

      const attachments: any[] = [];
      const logoPath = path.join(process.cwd(), "public", "logo.png");
      if (fs.existsSync(logoPath)) {
        attachments.push({
          filename: "logo.png",
          path: logoPath,
          cid: "wealthystep-logo",
        });
      }

      const info = await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: toEmail,
        subject: emailSubject,
        html: htmlContent,
        attachments,
      });

      return { success: true, messageId: info.messageId };
    } catch (smtpErr: any) {
      console.error("SMTP fallback delivery error:", smtpErr);
      return { success: false, error: smtpErr.message };
    }
  }

  // 3. In local development / testing without keys, log OTP
  if (process.env.NODE_ENV !== "production") {
    console.log(`[DEV OTP] Generated OTP for ${toEmail}: ${otp}`);
    return { success: true, messageId: "dev-mock-id" };
  }

  return {
    success: false,
    error: "No email delivery provider configured (missing BREVO_API_KEY and SMTP credentials).",
  };
}
