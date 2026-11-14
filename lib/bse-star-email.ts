import nodemailer from "nodemailer";
import { BseStarAccountOpeningInput } from "./bse-star-validation";

// Server-only check
if (typeof window !== "undefined") {
  throw new Error("bse-star-email.ts cannot be used on the client side");
}

export interface BseStarEmailPayload {
  id: string;
  data: BseStarAccountOpeningInput;
  submittedAt: string;
}

export async function sendBseStarNotificationEmails(
  payload: BseStarEmailPayload
): Promise<{ success: boolean; adminMessageId?: string; userMessageId?: string; error?: string }> {
  const { id, data, submittedAt } = payload;

  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM || "noreply@wealthystep.com";
  const senderName = "Wealthy Step™ | Mutual Funds Desk";
  
  const adminEmail =
    process.env.EMAIL_TO ||
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    "mrsivagoram@gmail.com";

  const adminSubject = `📊 BSE Star MF Account Application: ${data.fullName} — PAN: ${data.panNumber}`;
  const userSubject = `🌱 BSE Star Mutual Fund Account Opening Details Received — Wealthy Step™`;

  const cleanMobile = (data.mobile || "").replace(/\D/g, "").slice(-10);
  const whatsappUrl = `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(
    `Hello ${data.fullName}, thank you for submitting your BSE Star Mutual Fund account details on Wealthy Step! We are reviewing your documents.`
  )}`;

  // Nominees HTML Table Rows
  const nomineesHtml = data.nominees && data.nominees.length > 0
    ? data.nominees.map((n, idx) => `
      <tr style="border-bottom: 1px solid #E2E8D8; background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#FAFBF7'};">
        <td style="padding: 10px 12px; font-weight: 700; color: #180D45; font-size: 12px;">#${idx + 1}: ${n.name}</td>
        <td style="padding: 10px 12px; color: #374151; font-size: 12px;">${n.relation}</td>
        <td style="padding: 10px 12px; color: #374151; font-size: 12px;">XXXX-XXXX-${n.aadharLast4}</td>
        <td style="padding: 10px 12px; color: #374151; font-size: 12px;">${n.dob}</td>
        <td style="padding: 10px 12px; color: #374151; font-size: 12px;">${n.mobile} (${n.mobileBelongsTo || "Nominee"})</td>
        <td style="padding: 10px 12px; color: #374151; font-size: 12px;">${n.email} (${n.emailBelongsTo || "Nominee"})</td>
        <td style="padding: 10px 12px; color: #180D45; font-weight: 800; font-size: 12px;">${n.percentage}%</td>
      </tr>
    `).join("")
    : `<tr><td colspan="7" style="padding: 12px; text-align: center; color: #6B7280; font-size: 12px;">No nominee details recorded</td></tr>`;

  // Files summary HTML
  const aadharFilesCount = data.aadharFiles?.length || 0;
  const panFilesCount = data.panFiles?.length || 0;
  const bankFilesCount = data.bankFiles?.length || 0;

  // 1. Admin Email HTML Content
  const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${adminSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F6F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #180D45;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F6F0; padding: 24px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 660px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8D8; overflow: hidden; box-shadow: 0 8px 30px rgba(24, 13, 69, 0.08);">
          <tr>
            <td style="background: linear-gradient(135deg, #180D45 0%, #25156B 100%); padding: 28px 24px; text-align: center;">
              <div style="display: inline-block; background-color: rgba(132, 189, 60, 0.2); border: 1px solid #84BD3C; border-radius: 24px; padding: 4px 12px; margin-bottom: 8px;">
                <span style="color: #84BD3C; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
                  BSE Star MF &bull; Account Creation Intake
                </span>
              </div>
              <h1 style="color: #FFFFFF; font-size: 20px; font-weight: 800; margin: 0 0 6px 0;">New Account Details Submitted</h1>
              <p style="color: #D1D5DB; font-size: 12px; margin: 0;">Ref ID: <strong style="color: #84BD3C; font-family: monospace;">${id}</strong> &bull; ${submittedAt}</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px;">
              <!-- Quick CTAs -->
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background-color: #25D366; color: #FFFFFF; text-decoration: none; padding: 10px 20px; border-radius: 12px; font-weight: 700; font-size: 13px; margin: 4px;">
                  💬 Open WhatsApp Chat (+91 ${cleanMobile})
                </a>
                <a href="mailto:${data.email}?subject=Regarding%20your%20BSE%20Star%20MF%20Account%20Creation" style="display: inline-block; background-color: #180D45; color: #FFFFFF; text-decoration: none; padding: 10px 20px; border-radius: 12px; font-weight: 700; font-size: 13px; margin: 4px;">
                  ✉️ Email Applicant (${data.email})
                </a>
              </div>

              <!-- Section 1: Personal Details -->
              <h3 style="color: #180D45; font-size: 14px; font-weight: 800; border-bottom: 2px solid #84BD3C; padding-bottom: 6px; margin: 20px 0 12px 0;">
                1. Personal Details
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.5;">
                <tr><td style="padding: 6px 0; color: #6B7280; width: 35%;">Full Name (Aadhaar/PAN):</td><td style="padding: 6px 0; font-weight: 700; color: #180D45;">${data.fullName}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">Mobile Number:</td><td style="padding: 6px 0; font-weight: 700; color: #180D45;">+91 ${data.mobile}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">Email ID:</td><td style="padding: 6px 0; font-weight: 700; color: #180D45;"><a href="mailto:${data.email}" style="color: #180D45;">${data.email}</a></td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">Date of Birth:</td><td style="padding: 6px 0; font-weight: 700; color: #180D45;">${data.dob}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">Place of Birth:</td><td style="padding: 6px 0; font-weight: 700; color: #180D45;">${data.placeOfBirth}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">Occupation:</td><td style="padding: 6px 0; font-weight: 700; color: #180D45;">${data.occupation}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">Marital Status:</td><td style="padding: 6px 0; font-weight: 700; color: #180D45;">${data.maritalStatus} ${data.marriageDate ? `(Married Date: ${data.marriageDate})` : ''}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">Blood Group:</td><td style="padding: 6px 0; font-weight: 700; color: #180D45;">${data.bloodGroup || 'Not specified'}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280; vertical-align: top;">Present Address:</td><td style="padding: 6px 0; font-weight: 600; color: #374151;">${data.presentAddress}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280; vertical-align: top;">Permanent Address:</td><td style="padding: 6px 0; font-weight: 600; color: #374151;">${data.permanentAddress}</td></tr>
              </table>

              <!-- Section 2: KYC & Identification -->
              <h3 style="color: #180D45; font-size: 14px; font-weight: 800; border-bottom: 2px solid #84BD3C; padding-bottom: 6px; margin: 24px 0 12px 0;">
                2. KYC Details & Documents
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.5;">
                <tr><td style="padding: 6px 0; color: #6B7280; width: 35%;">Is KYC Done?:</td><td style="padding: 6px 0; font-weight: 800; color: ${data.isKycDone === 'Yes' ? '#047857' : '#B45309'};">${data.isKycDone}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">PAN Number:</td><td style="padding: 6px 0; font-weight: 800; color: #180D45; letter-spacing: 1px;">${data.panNumber}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">Aadhaar Number:</td><td style="padding: 6px 0; font-weight: 700; color: #180D45; letter-spacing: 1px;">${data.aadharNumber}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">Aadhaar Attachments:</td><td style="padding: 6px 0; font-weight: 600; color: #374151;">${aadharFilesCount} file(s) attached</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">PAN Card Attachment:</td><td style="padding: 6px 0; font-weight: 600; color: #374151;">${panFilesCount} file(s) attached</td></tr>
              </table>

              <!-- Section 3: Bank Details -->
              <h3 style="color: #180D45; font-size: 14px; font-weight: 800; border-bottom: 2px solid #84BD3C; padding-bottom: 6px; margin: 24px 0 12px 0;">
                3. Bank Details & Mandate
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.5;">
                <tr><td style="padding: 6px 0; color: #6B7280; width: 35%;">Bank Name:</td><td style="padding: 6px 0; font-weight: 700; color: #180D45;">${data.bankName}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">Branch Name:</td><td style="padding: 6px 0; font-weight: 700; color: #180D45;">${data.bankBranch}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">Account Number:</td><td style="padding: 6px 0; font-weight: 800; color: #180D45; font-family: monospace;">${data.accountNumber}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">Account Type:</td><td style="padding: 6px 0; font-weight: 700; color: #180D45;">${data.accountType}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">IFSC Code:</td><td style="padding: 6px 0; font-weight: 800; color: #180D45; font-family: monospace;">${data.ifscCode}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">MICR Code:</td><td style="padding: 6px 0; font-weight: 600; color: #374151;">${data.micrCode || '—'}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">Bank City & Pincode:</td><td style="padding: 6px 0; font-weight: 600; color: #374151;">${data.bankCity} — ${data.pinCode}</td></tr>
                <tr><td style="padding: 6px 0; color: #6B7280;">Cheque / Statement:</td><td style="padding: 6px 0; font-weight: 600; color: #374151;">${bankFilesCount} file(s) attached</td></tr>
              </table>

              <!-- Section 4: Nominee Details -->
              <h3 style="color: #180D45; font-size: 14px; font-weight: 800; border-bottom: 2px solid #84BD3C; padding-bottom: 6px; margin: 24px 0 12px 0;">
                4. Nominee Allocation (${data.nomineesCount} Nominee${data.nomineesCount > 1 ? 's' : ''})
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 12px;">
                <thead>
                  <tr style="background-color: #180D45; color: #FFFFFF;">
                    <th style="padding: 8px; text-align: left;">Name</th>
                    <th style="padding: 8px; text-align: left;">Relation</th>
                    <th style="padding: 8px; text-align: left;">Aadhaar Last 4</th>
                    <th style="padding: 8px; text-align: left;">DOB</th>
                    <th style="padding: 8px; text-align: left;">Mobile</th>
                    <th style="padding: 8px; text-align: left;">Email</th>
                    <th style="padding: 8px; text-align: left;">Share</th>
                  </tr>
                </thead>
                <tbody>
                  ${nomineesHtml}
                </tbody>
              </table>

              ${data.clientNote ? `
                <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px; margin-top: 16px;">
                  <span style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase;">Note from Applicant:</span>
                  <p style="margin: 6px 0 0 0; font-size: 12px; color: #1E293B; line-height: 1.5;">${data.clientNote}</p>
                </div>
              ` : ''}

              <!-- Declaration & Verification -->
              <div style="margin-top: 20px; padding: 12px 16px; background-color: #ECFDF5; border-radius: 12px; border: 1px solid #A7F3D0; font-size: 11px; color: #065F46;">
                ✔ Applicant accepted voluntary declaration for BSE Star account opening and data processing on ${submittedAt}.
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color: #FAFBF7; padding: 16px 24px; text-align: center; border-top: 1px solid #E2E8D8;">
              <p style="margin: 0; font-size: 11px; color: #6B7280;">
                Wealthy Step™ &bull; AMFI Registered Mutual Fund Distributor &bull; ARN-322891
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  // 2. User Acknowledgment Email HTML Content
  const userHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${userSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F6F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #180D45;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F6F0; padding: 24px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8D8; overflow: hidden; box-shadow: 0 8px 30px rgba(24, 13, 69, 0.08);">
          <tr>
            <td style="background: linear-gradient(135deg, #180D45 0%, #25156B 100%); padding: 28px 24px; text-align: center;">
              <h1 style="color: #FFFFFF; font-size: 20px; font-weight: 800; margin: 0 0 6px 0;">We&apos;ve Received Your Details! 🌱</h1>
              <p style="color: #84BD3C; font-size: 13px; font-weight: 700; margin: 0;">BSE Star Mutual Fund Account Creation</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px;">
              <p style="font-size: 14px; color: #180D45; margin-top: 0;">Dear <strong>${data.fullName}</strong>,</p>
              <p style="font-size: 13px; color: #4B5563; line-height: 1.6;">
                Thank you for providing your details for opening your <strong>BSE Star Mutual Fund Account</strong> with <strong>Wealthy Step™</strong>.
              </p>
              <p style="font-size: 13px; color: #4B5563; line-height: 1.6;">
                Our compliance &amp; onboarding desk has received your submission (Ref ID: <code style="background-color: #F3F4F6; padding: 2px 6px; border-radius: 4px; font-weight: 700; color: #180D45;">${id}</code>).
              </p>

              <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 14px; padding: 16px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #180D45; font-size: 13px; font-weight: 800;">Summary of Submission:</h4>
                <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #374151; line-height: 1.6;">
                  <li><strong>Full Name:</strong> ${data.fullName}</li>
                  <li><strong>PAN Number:</strong> ${data.panNumber}</li>
                  <li><strong>Bank &amp; Branch:</strong> ${data.bankName} (${data.bankBranch})</li>
                  <li><strong>Account Number:</strong> XXXX-XXXX-${data.accountNumber.slice(-4)}</li>
                  <li><strong>Nominee Count:</strong> ${data.nomineesCount}</li>
                </ul>
              </div>

              <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 14px; padding: 16px; margin: 20px 0;">
                <h4 style="margin: 0 0 6px 0; color: #065F46; font-size: 13px; font-weight: 800;">What Happens Next?</h4>
                <ol style="margin: 0; padding-left: 18px; font-size: 12px; color: #047857; line-height: 1.6;">
                  <li>Our NISM Certified Wealth Desk verifies your KYC status with KRA.</li>
                  <li>We initiate your BSE Star client registration and set up your investment portfolio mandate.</li>
                  <li>You will receive an official BSE Star verification link/SMS for one-time confirmation.</li>
                </ol>
              </div>

              <p style="font-size: 13px; color: #4B5563; line-height: 1.6;">
                If you have any questions or wish to update any detail, feel free to reply directly to this email or message us on WhatsApp.
              </p>

              <p style="font-size: 13px; color: #180D45; margin-bottom: 0;">
                Warm regards,<br>
                <strong>Wealthy Step™ Advisory Team</strong><br>
                <span style="font-size: 11px; color: #6B7280;">AMFI Registered Mutual Fund Distributor | ARN-322891</span>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #FAFBF7; padding: 14px 24px; text-align: center; border-top: 1px solid #E2E8D8;">
              <p style="margin: 0; font-size: 11px; color: #9CA3AF;">
                All information provided is kept strictly confidential and used solely for regulatory account opening.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  let adminMessageId: string | undefined;
  let userMessageId: string | undefined;

  // 1. Try Brevo HTTP API
  if (brevoApiKey) {
    try {
      // Send to Admin
      const adminRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
          accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: adminEmail, name: "Wealthy Step Desk" }],
          subject: adminSubject,
          htmlContent: adminHtml,
        }),
      });

      if (adminRes.ok) {
        const resData = await adminRes.json();
        adminMessageId = resData.messageId;
      }

      // Send to User
      if (data.email) {
        const userRes = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": brevoApiKey,
            accept: "application/json",
          },
          body: JSON.stringify({
            sender: { name: senderName, email: senderEmail },
            to: [{ email: data.email, name: data.fullName }],
            subject: userSubject,
            htmlContent: userHtml,
          }),
        });

        if (userRes.ok) {
          const resData = await userRes.json();
          userMessageId = resData.messageId;
        }
      }

      return { success: true, adminMessageId, userMessageId };
    } catch (err: any) {
      console.warn("Brevo API call failed for BSE Star email, falling back to SMTP:", err?.message);
    }
  }

  // 2. SMTP Fallback
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      // Admin Email
      const adminInfo = await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml,
      });
      adminMessageId = adminInfo.messageId;

      // User Email
      if (data.email) {
        const userInfo = await transporter.sendMail({
          from: `"${senderName}" <${senderEmail}>`,
          to: data.email,
          subject: userSubject,
          html: userHtml,
        });
        userMessageId = userInfo.messageId;
      }

      return { success: true, adminMessageId, userMessageId };
    } catch (smtpErr: any) {
      console.error("SMTP fallback dispatch failed for BSE Star email:", smtpErr?.message);
      return { success: false, error: smtpErr?.message };
    }
  }

  // Dev / Mock fallback
  return {
    success: true,
    adminMessageId: `mock-bse-admin-${Date.now()}`,
    userMessageId: `mock-bse-user-${Date.now()}`,
  };
}
