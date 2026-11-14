import nodemailer from "nodemailer";
import { LifeInsuranceProposalInput } from "./life-insurance-validation";

// Server-only check
if (typeof window !== "undefined") {
  throw new Error("life-insurance-email.ts cannot be used on the client side");
}

export interface LifeInsuranceEmailPayload {
  id: string;
  data: LifeInsuranceProposalInput;
  submittedAt: string;
}

export async function sendLifeInsuranceNotificationEmails(
  payload: LifeInsuranceEmailPayload
): Promise<{ success: boolean; adminMessageId?: string; userMessageId?: string; error?: string }> {
  const { id, data, submittedAt } = payload;

  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM || "noreply@wealthystep.com";
  const senderName = "Wealthy Step™ | Life Insurance Advisory";
  
  const adminEmail =
    process.env.EMAIL_TO ||
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    "mrsivagoram@gmail.com";

  const adminSubject = `🛡️ Life & Term Insurance Proposal: ${data.fullName} — PAN: ${data.panNumber}`;
  const userSubject = `✨ Life & Term Insurance Proposal Received — Wealthy Step™`;

  const cleanMobile = (data.proposerMobile || "").replace(/\D/g, "").slice(-10);
  const whatsappUrl = `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(
    `Hello ${data.fullName}, thank you for submitting your Life & Term Insurance details on Wealthy Step! We are reviewing your application.`
  )}`;

  // Document Counts
  const aadharFilesCount = data.aadharFiles?.length || 0;
  const panFilesCount = data.panFiles?.length || 0;
  const selfieFilesCount = data.selfieFiles?.length || 0;
  const chequeFilesCount = data.chequeFiles?.length || 0;
  const companyIdFilesCount = data.companyIdFiles?.length || 0;
  const payslipFilesCount = data.payslipFiles?.length || 0;
  const otherFilesCount = data.otherFiles?.length || 0;

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
                  Life &bull; Term Insurance Intake
                </span>
              </div>
              <h1 style="color: #FFFFFF; font-size: 20px; font-weight: 800; margin: 0 0 6px 0;">New Life Insurance Proposal</h1>
              <p style="color: #D1D5DB; font-size: 12px; margin: 0;">Ref ID: <strong style="color: #84BD3C; font-family: monospace;">${id}</strong> &bull; ${submittedAt}</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px;">
              <!-- Quick CTAs -->
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background-color: #25D366; color: #FFFFFF; text-decoration: none; padding: 10px 20px; border-radius: 12px; font-weight: 700; font-size: 13px; margin: 4px;">
                  💬 Chat on WhatsApp (+91 ${cleanMobile})
                </a>
                <a href="mailto:${data.proposerEmail}?subject=Regarding%20your%20Life%20Insurance%20Proposal" style="display: inline-block; background-color: #180D45; color: #FFFFFF; text-decoration: none; padding: 10px 20px; border-radius: 12px; font-weight: 700; font-size: 13px; margin: 4px;">
                  ✉️ Email Proposer
                </a>
              </div>

              <!-- 1. Insured Person Details -->
              <h3 style="color: #180D45; font-size: 14px; font-weight: 800; border-bottom: 2px solid #84BD3C; padding-bottom: 6px; margin: 20px 0 12px 0;">
                1. Insured Person Details (Section 80C Tax Exemption)
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.5;">
                <tr><td style="padding: 5px 0; color: #6B7280; width: 35%;">Full Name (Aadhaar):</td><td style="padding: 5px 0; font-weight: 700; color: #180D45;">${data.fullName}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Mobile Number:</td><td style="padding: 5px 0; font-weight: 700; color: #180D45;">+91 ${data.proposerMobile}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Email ID:</td><td style="padding: 5px 0; font-weight: 700; color: #180D45;">${data.proposerEmail}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Date of Birth:</td><td style="padding: 5px 0; font-weight: 700; color: #180D45;">${data.dob}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Marital Status:</td><td style="padding: 5px 0; font-weight: 700; color: #180D45;">${data.maritalStatus}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Qualification:</td><td style="padding: 5px 0; font-weight: 700; color: #180D45;">${data.qualification}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Height & Weight:</td><td style="padding: 5px 0; font-weight: 700; color: #180D45;">${data.height} &bull; ${data.weight} Kgs</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Mother's Name:</td><td style="padding: 5px 0; font-weight: 600; color: #374151;">${data.motherFullName}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Father's Name:</td><td style="padding: 5px 0; font-weight: 600; color: #374151;">${data.fatherFullName}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Existing Coverage:</td><td style="padding: 5px 0; font-weight: 700; color: #180D45;">${data.hasExistingPolicies ? `Yes (${data.existingCoverage})` : 'No Existing Policies'}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280; vertical-align: top;">Current Address:</td><td style="padding: 5px 0; font-weight: 600; color: #374151;">${data.currentAddress}</td></tr>
              </table>

              <!-- 2. Employment & Income Details -->
              <h3 style="color: #180D45; font-size: 14px; font-weight: 800; border-bottom: 2px solid #84BD3C; padding-bottom: 6px; margin: 24px 0 12px 0;">
                2. Employment &amp; Income Details
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.5;">
                <tr><td style="padding: 5px 0; color: #6B7280; width: 35%;">Employment Type:</td><td style="padding: 5px 0; font-weight: 700; color: #180D45;">${data.employmentType}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Company Name:</td><td style="padding: 5px 0; font-weight: 700; color: #180D45;">${data.companyName}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Designation:</td><td style="padding: 5px 0; font-weight: 700; color: #180D45;">${data.designation}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Official Email:</td><td style="padding: 5px 0; font-weight: 700; color: #180D45;">${data.companyEmail}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Industry Sector:</td><td style="padding: 5px 0; font-weight: 600; color: #374151;">${data.industry}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Annual Income:</td><td style="padding: 5px 0; font-weight: 800; color: #047857;">${data.annualIncome}</td></tr>
              </table>

              <!-- 3. Health & Habits -->
              <h3 style="color: #180D45; font-size: 14px; font-weight: 800; border-bottom: 2px solid #84BD3C; padding-bottom: 6px; margin: 24px 0 12px 0;">
                3. Health Declarations &amp; Lifestyle Habits
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.5;">
                <tr><td style="padding: 5px 0; color: #6B7280; width: 35%;">Pre-existing Illness:</td><td style="padding: 5px 0; font-weight: 700; color: ${data.hasPreExistingIllness ? '#DC2626' : '#047857'};">${data.hasPreExistingIllness ? 'YES (Declared)' : 'NO'}</td></tr>
                ${data.hasPreExistingIllness ? `<tr><td style="padding: 5px 0; color: #6B7280;">Details:</td><td style="padding: 5px 0; color: #DC2626;">${data.preExistingDetails || 'Not specified'}</td></tr>` : ''}
                <tr><td style="padding: 5px 0; color: #6B7280;">Smoker:</td><td style="padding: 5px 0; font-weight: 700;">${data.isSmoker ? 'YES' : 'NO'}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Drinker:</td><td style="padding: 5px 0; font-weight: 700;">${data.isDrinker ? 'YES' : 'NO'}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Chew Tobacco:</td><td style="padding: 5px 0; font-weight: 700;">${data.chewsTobacco ? 'YES' : 'NO'}</td></tr>
              </table>

              <!-- 4. Nominee Details -->
              <h3 style="color: #180D45; font-size: 14px; font-weight: 800; border-bottom: 2px solid #84BD3C; padding-bottom: 6px; margin: 24px 0 12px 0;">
                4. Nominee &amp; Bank Details
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.5;">
                <tr><td style="padding: 5px 0; color: #6B7280; width: 35%;">Nominee Name:</td><td style="padding: 5px 0; font-weight: 700; color: #180D45;">${data.nomineeName} (${data.isNomineeMinor ? 'Minor' : 'Major'})</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Relation:</td><td style="padding: 5px 0; font-weight: 700; color: #180D45;">${data.nomineeRelation}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Nominee DOB:</td><td style="padding: 5px 0; font-weight: 700; color: #180D45;">${data.nomineeDob}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Nominee Contact:</td><td style="padding: 5px 0; font-weight: 600; color: #374151;">+91 ${data.nomineeMobile} &bull; ${data.nomineeEmail}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Nominee Bank:</td><td style="padding: 5px 0; font-weight: 700; color: #180D45;">${data.nomineeBankName} (A/C: ${data.nomineeBankAccountNumber}, IFSC: ${data.nomineeBankIfsc})</td></tr>
              </table>

              <!-- 5. Documents & Proposer Bank -->
              <h3 style="color: #180D45; font-size: 14px; font-weight: 800; border-bottom: 2px solid #84BD3C; padding-bottom: 6px; margin: 24px 0 12px 0;">
                5. Proposer Bank Details &amp; Uploaded Files
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.5;">
                <tr><td style="padding: 5px 0; color: #6B7280; width: 35%;">Aadhaar & PAN:</td><td style="padding: 5px 0; font-weight: 800; color: #180D45; font-family: monospace;">Aadhaar: ${data.aadharNumber} &bull; PAN: ${data.panNumber}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Proposer Bank:</td><td style="padding: 5px 0; font-weight: 700; color: #180D45;">${data.proposerBankName} (${data.proposerBankBranch})</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Proposer Account:</td><td style="padding: 5px 0; font-weight: 800; color: #180D45; font-family: monospace;">${data.proposerBankAccountNumber} (IFSC: ${data.proposerBankIfsc})</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">A/C Holder Name:</td><td style="padding: 5px 0; font-weight: 600; color: #374151;">${data.proposerBankAccountName}</td></tr>
                <tr><td style="padding: 5px 0; color: #6B7280;">Uploaded Files:</td><td style="padding: 5px 0; font-weight: 600; color: #374151;">Aadhaar: ${aadharFilesCount}, PAN: ${panFilesCount}, Selfie: ${selfieFilesCount}, Cheque: ${chequeFilesCount}, Company ID: ${companyIdFilesCount}, Payslips: ${payslipFilesCount}, Other: ${otherFilesCount}</td></tr>
              </table>

              ${data.clientNotes ? `
                <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px; margin-top: 16px;">
                  <span style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase;">Note from Applicant:</span>
                  <p style="margin: 6px 0 0 0; font-size: 12px; color: #1E293B; line-height: 1.5;">${data.clientNotes}</p>
                </div>
              ` : ''}

              <!-- Declarations Note -->
              <div style="margin-top: 20px; padding: 12px 16px; background-color: #ECFDF5; border-radius: 12px; border: 1px solid #A7F3D0; font-size: 11px; color: #065F46;">
                ✔ Applicant accepted full Utmost Good Faith disclosures and contact permissions on ${submittedAt}.
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color: #FAFBF7; padding: 16px 24px; text-align: center; border-top: 1px solid #E2E8D8;">
              <p style="margin: 0; font-size: 11px; color: #6B7280;">
                Wealthy Step™ &bull; IRDAI Compliant Insurance Advisory &bull; AMFI ARN-322891
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
              <h1 style="color: #FFFFFF; font-size: 20px; font-weight: 800; margin: 0 0 6px 0;">Application Received! 🛡️</h1>
              <p style="color: #84BD3C; font-size: 13px; font-weight: 700; margin: 0;">Life &amp; Term Insurance Planning</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px;">
              <p style="font-size: 14px; color: #180D45; margin-top: 0;">Dear <strong>${data.fullName}</strong>,</p>
              <p style="font-size: 13px; color: #4B5563; line-height: 1.6;">
                Thank you for submitting your <strong>Life &amp; Term Insurance</strong> details with <strong>Wealthy Step™</strong>.
              </p>
              <p style="font-size: 13px; color: #4B5563; line-height: 1.6;">
                Our insurance underwriting desk has safely received your submission (Ref ID: <code style="background-color: #F3F4F6; padding: 2px 6px; border-radius: 4px; font-weight: 700; color: #180D45;">${id}</code>).
              </p>

              <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 14px; padding: 16px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #180D45; font-size: 13px; font-weight: 800;">Summary of Submission:</h4>
                <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #374151; line-height: 1.6;">
                  <li><strong>Proposer Name:</strong> ${data.fullName}</li>
                  <li><strong>PAN:</strong> ${data.panNumber}</li>
                  <li><strong>Company / Profession:</strong> ${data.companyName} (${data.designation})</li>
                  <li><strong>Nominee:</strong> ${data.nomineeName} (${data.nomineeRelation})</li>
                  <li><strong>Section 80C Benefit:</strong> Available for Premium Paid</li>
                </ul>
              </div>

              <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 14px; padding: 16px; margin: 20px 0;">
                <h4 style="margin: 0 0 6px 0; color: #065F46; font-size: 13px; font-weight: 800;">Next Steps:</h4>
                <ol style="margin: 0; padding-left: 18px; font-size: 12px; color: #047857; line-height: 1.6;">
                  <li>Our advisor reviews your financial eligibility and corporate discounts.</li>
                  <li>We prepare tailored term comparison quotes from top life insurers (HDFC Life, ICICI Pru, Tata AIA, Max Life).</li>
                  <li>We coordinate any tele-medical or video verification required by the insurer.</li>
                </ol>
              </div>

              <p style="font-size: 13px; color: #4B5563; line-height: 1.6;">
                If you have questions, reply directly to this email or reach us on WhatsApp.
              </p>

              <p style="font-size: 13px; color: #180D45; margin-bottom: 0;">
                Warm regards,<br>
                <strong>Wealthy Step™ Insurance Advisory Desk</strong><br>
                <span style="font-size: 11px; color: #6B7280;">AMFI Registered Distributor | ARN-322891</span>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #FAFBF7; padding: 14px 24px; text-align: center; border-top: 1px solid #E2E8D8;">
              <p style="margin: 0; font-size: 11px; color: #9CA3AF;">
                All information provided is kept strictly confidential and used solely for insurance advisory &amp; underwriting.
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

      if (data.proposerEmail) {
        const userRes = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": brevoApiKey,
            accept: "application/json",
          },
          body: JSON.stringify({
            sender: { name: senderName, email: senderEmail },
            to: [{ email: data.proposerEmail, name: data.fullName }],
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
      console.warn("Brevo API call failed for Life Insurance email, falling back to SMTP:", err?.message);
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

      const adminInfo = await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml,
      });
      adminMessageId = adminInfo.messageId;

      if (data.proposerEmail) {
        const userInfo = await transporter.sendMail({
          from: `"${senderName}" <${senderEmail}>`,
          to: data.proposerEmail,
          subject: userSubject,
          html: userHtml,
        });
        userMessageId = userInfo.messageId;
      }

      return { success: true, adminMessageId, userMessageId };
    } catch (smtpErr: any) {
      console.error("SMTP fallback dispatch failed for Life Insurance email:", smtpErr?.message);
      return { success: false, error: smtpErr?.message };
    }
  }

  return {
    success: true,
    adminMessageId: `mock-life-admin-${Date.now()}`,
    userMessageId: `mock-life-user-${Date.now()}`,
  };
}
