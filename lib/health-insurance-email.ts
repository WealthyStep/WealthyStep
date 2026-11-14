import nodemailer from "nodemailer";
import { InsuredMember } from "./health-insurance-validation";

// Server-only check
if (typeof window !== "undefined") {
  throw new Error("health-insurance-email.ts cannot be used on the client side");
}

export interface HealthInsuranceProposalEmailData {
  id: string;
  proposerName: string;
  proposerPan: string;
  proposerDob: string;
  proposerAadhar?: string;
  proposerMobile: string;
  proposerEmail: string;
  proposerAddress: string;
  employmentStatus: string;
  corporateEmail?: string;
  policyType: string;
  adultsCount: number;
  kidsCount: number;
  relationAdult2?: string;
  relationKids?: string;
  members: InsuredMember[];
  insuredEmail: string;
  insuredMobile: string;
  hasPreExistingIllness: boolean;
  preExistingDetails?: string;
  hasTobaccoAlcoholHabits: boolean;
  habitsDetails?: string;
  currentAddress: string;
  nomineeName: string;
  nomineeDob: string;
  nomineeRelation?: string;
  nomineeAddress: string;
  nomineeMobile: string;
  nomineeEmail: string;
  nomineeBankName: string;
  nomineeBankAccountName: string;
  nomineeBankIfsc: string;
  nomineeBankAccountNumber: string;
  nomineeBankAccountType: string;
  submittedAt: string;
  source?: string;
}

export async function sendHealthInsuranceProposalEmail(
  data: HealthInsuranceProposalEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM || "noreply@wealthystep.com";
  const senderName = "Wealthy Step™ | Insurance Advisory";
  
  const recipientEmail =
    process.env.EMAIL_TO ||
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    "info@wealthystep.com";

  const emailSubject = `🛡️ Health Insurance Proposal: ${data.proposerName} (${data.policyType}) — PAN: ${data.proposerPan}`;

  const cleanMobile = data.proposerMobile.replace(/\D/g, "").slice(-10);
  const whatsappUrl = `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(
    `Hello ${data.proposerName}, thank you for submitting your Health Insurance proposal on Wealthy Step! We are reviewing your details.`
  )}`;

  // Members HTML table rows
  const membersRowsHtml = data.members && data.members.length > 0
    ? data.members.map((m, idx) => `
      <tr style="border-bottom: 1px solid #E2E8D8; background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#FAFBF7'};">
        <td style="padding: 10px 12px; font-weight: 700; color: #180D45; font-size: 12px;">${m.role}</td>
        <td style="padding: 10px 12px; color: #374151; font-size: 12px;">${m.fullName || "—"}</td>
        <td style="padding: 10px 12px; color: #374151; font-size: 12px;">${m.relation || "Self"}</td>
        <td style="padding: 10px 12px; color: #374151; font-size: 12px;">${m.dob || "—"}</td>
        <td style="padding: 10px 12px; color: #374151; font-size: 12px;">${m.gender || "—"}</td>
        <td style="padding: 10px 12px; color: #374151; font-size: 12px;">${m.height || "—"} / ${m.weight || "—"}</td>
      </tr>
    `).join("")
    : `<tr><td colspan="6" style="padding: 12px; text-align: center; color: #6B7280; font-size: 12px;">No specific members recorded</td></tr>`;

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
        <table role="presentation" width="100%" style="max-width: 640px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8D8; overflow: hidden; box-shadow: 0 8px 30px rgba(24, 13, 69, 0.08);">
          
          <!-- Top Navy Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #180D45 0%, #25156B 100%); padding: 28px 24px; text-align: center;">
              <div style="display: inline-block; background-color: rgba(132, 189, 60, 0.2); border: 1px solid #84BD3C; border-radius: 24px; padding: 4px 12px; margin-bottom: 8px;">
                <span style="color: #84BD3C; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
                  ★ NEW HEALTH INSURANCE PROPOSAL ★
                </span>
              </div>
              <h1 style="color: #FFFFFF; margin: 0 0 6px 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">
                Health Insurance Advisory Intake
              </h1>
              <p style="color: rgba(255, 255, 255, 0.85); margin: 0; font-size: 12px; font-weight: 500;">
                Wealthy Step™ • AMFI Registered & Insurance Solutions
              </p>
            </td>
          </tr>

          <!-- Summary Strip -->
          <tr>
            <td style="background-color: #F3F7EB; border-bottom: 1px solid #D6E4BE; padding: 12px 24px;">
              <table role="presentation" width="100%">
                <tr>
                  <td style="color: #446A1B; font-size: 12px; font-weight: 700;">
                    📋 Policy Type: <strong>${data.policyType}</strong> • Plan for: <strong>${data.adultsCount} Adult(s), ${data.kidsCount} Kid(s)</strong>
                  </td>
                  <td align="right" style="color: #6B7280; font-size: 11px;">
                    ${data.submittedAt}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 24px;">
              
              <!-- SECTION 1: PROPOSER DETAILS -->
              <h3 style="color: #180D45; font-size: 14px; font-weight: 800; text-transform: uppercase; margin: 0 0 12px 0; border-bottom: 2px solid #84BD3C; padding-bottom: 6px;">
                1. Proposer Details (Tax 80D Beneficiary)
              </h3>
              <table role="presentation" width="100%" style="font-size: 13px; line-height: 1.6; margin-bottom: 20px;">
                <tr>
                  <td width="35%" style="color: #6B7280; padding: 4px 0;">Full Name:</td>
                  <td style="color: #180D45; font-weight: 700;">${data.proposerName}</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; padding: 4px 0;">PAN Number:</td>
                  <td style="color: #180D45; font-weight: 700;"><span style="background-color: #FEF3C7; padding: 2px 6px; border-radius: 4px; border: 1px solid #F59E0B;">${data.proposerPan}</span></td>
                </tr>
                <tr>
                  <td style="color: #6B7280; padding: 4px 0;">Date of Birth:</td>
                  <td style="color: #180D45;">${data.proposerDob}</td>
                </tr>
                ${data.proposerAadhar ? `
                <tr>
                  <td style="color: #6B7280; padding: 4px 0;">Aadhaar (KYC):</td>
                  <td style="color: #180D45;">••••••••${data.proposerAadhar.slice(-4)}</td>
                </tr>` : ""}
                <tr>
                  <td style="color: #6B7280; padding: 4px 0;">Mobile:</td>
                  <td style="color: #180D45; font-weight: 600;">+91 ${data.proposerMobile}</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; padding: 4px 0;">Email:</td>
                  <td style="color: #180D45;">${data.proposerEmail}</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; padding: 4px 0;">Employment:</td>
                  <td style="color: #180D45;">${data.employmentStatus} ${data.corporateEmail ? `(${data.corporateEmail})` : ""}</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; padding: 4px 0; vertical-align: top;">Residential Address:</td>
                  <td style="color: #180D45;">${data.proposerAddress}</td>
                </tr>
              </table>

              <!-- SECTION 2: INSURED FAMILY MEMBERS -->
              <h3 style="color: #180D45; font-size: 14px; font-weight: 800; text-transform: uppercase; margin: 16px 0 12px 0; border-bottom: 2px solid #84BD3C; padding-bottom: 6px;">
                2. Covered Members (${data.members?.length || 0} Insured)
              </h3>
              <p style="margin: 0 0 10px 0; font-size: 12px; color: #4B5563;">
                Primary Insured Phone: <strong>+91 ${data.insuredMobile}</strong> • Email: <strong>${data.insuredEmail}</strong>
              </p>
              <table role="presentation" width="100%" style="border-collapse: collapse; margin-bottom: 20px; border: 1px solid #E2E8D8; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #F3F7EB; text-align: left; font-size: 11px; text-transform: uppercase; color: #446A1B;">
                    <th style="padding: 8px 12px;">Role</th>
                    <th style="padding: 8px 12px;">Name</th>
                    <th style="padding: 8px 12px;">Relation</th>
                    <th style="padding: 8px 12px;">DOB</th>
                    <th style="padding: 8px 12px;">Gender</th>
                    <th style="padding: 8px 12px;">Ht / Wt</th>
                  </tr>
                </thead>
                <tbody>
                  ${membersRowsHtml}
                </tbody>
              </table>

              <!-- SECTION 3: MEDICAL & LIFESTYLE -->
              <h3 style="color: #180D45; font-size: 14px; font-weight: 800; text-transform: uppercase; margin: 16px 0 12px 0; border-bottom: 2px solid #84BD3C; padding-bottom: 6px;">
                3. Medical & Lifestyle Declarations
              </h3>
              <div style="background-color: ${data.hasPreExistingIllness ? '#FEF2F2' : '#F0FDF4'}; border: 1px solid ${data.hasPreExistingIllness ? '#FECACA' : '#DCFCE7'}; border-radius: 12px; padding: 12px 16px; margin-bottom: 12px;">
                <p style="margin: 0; font-size: 12px; font-weight: 700; color: ${data.hasPreExistingIllness ? '#991B1B' : '#166534'};">
                  Pre-Existing Illness / Surgeries: ${data.hasPreExistingIllness ? "⚠️ YES, HAS HEALTH ISSUES" : "✅ NO PRE-EXISTING ISSUES"}
                </p>
                ${data.hasPreExistingIllness && data.preExistingDetails ? `
                  <p style="margin: 6px 0 0 0; font-size: 12px; color: #7F1D1D; background-color: #FFFFFF; padding: 8px; border-radius: 6px;">
                    ${data.preExistingDetails}
                  </p>
                ` : ""}
              </div>

              <div style="background-color: ${data.hasTobaccoAlcoholHabits ? '#FFFBEB' : '#F0FDF4'}; border: 1px solid ${data.hasTobaccoAlcoholHabits ? '#FDE68A' : '#DCFCE7'}; border-radius: 12px; padding: 12px 16px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 12px; font-weight: 700; color: ${data.hasTobaccoAlcoholHabits ? '#92400E' : '#166534'};">
                  Tobacco / Smoking / Alcohol: ${data.hasTobaccoAlcoholHabits ? "⚠️ YES, HAS HABITS" : "✅ NO HABITS"}
                </p>
                ${data.hasTobaccoAlcoholHabits && data.habitsDetails ? `
                  <p style="margin: 6px 0 0 0; font-size: 12px; color: #78350F; background-color: #FFFFFF; padding: 8px; border-radius: 6px;">
                    ${data.habitsDetails}
                  </p>
                ` : ""}
              </div>

              <!-- SECTION 4: NOMINEE & BANKING -->
              <h3 style="color: #180D45; font-size: 14px; font-weight: 800; text-transform: uppercase; margin: 16px 0 12px 0; border-bottom: 2px solid #84BD3C; padding-bottom: 6px;">
                4. Nominee & Banking Details
              </h3>
              <table role="presentation" width="100%" style="font-size: 13px; line-height: 1.6; margin-bottom: 20px;">
                <tr>
                  <td width="35%" style="color: #6B7280; padding: 4px 0;">Nominee Name:</td>
                  <td style="color: #180D45; font-weight: 700;">${data.nomineeName} (${data.nomineeRelation || "Nominee"})</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; padding: 4px 0;">Nominee DOB:</td>
                  <td style="color: #180D45;">${data.nomineeDob}</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; padding: 4px 0;">Nominee Mobile:</td>
                  <td style="color: #180D45;">+91 ${data.nomineeMobile}</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; padding: 4px 0;">Nominee Email:</td>
                  <td style="color: #180D45;">${data.nomineeEmail}</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; padding: 4px 0;">Nominee Address:</td>
                  <td style="color: #180D45;">${data.nomineeAddress}</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; padding: 4px 0;">Bank Name:</td>
                  <td style="color: #180D45; font-weight: 600;">${data.nomineeBankName}</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; padding: 4px 0;">Account Name:</td>
                  <td style="color: #180D45;">${data.nomineeBankAccountName}</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; padding: 4px 0;">Account Number:</td>
                  <td style="color: #180D45; font-weight: 600;">••••••••${data.nomineeBankAccountNumber.slice(-4)} (${data.nomineeBankAccountType})</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; padding: 4px 0;">IFSC Code:</td>
                  <td style="color: #180D45; font-weight: 700;">${data.nomineeBankIfsc}</td>
                </tr>
              </table>

              <!-- Quick Action Button -->
              <div style="text-align: center; padding-top: 10px;">
                <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background-color: #25D366; color: #FFFFFF; font-weight: 800; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);">
                  💬 Reach Out to Proposer via WhatsApp (+91 ${data.proposerMobile})
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; border-top: 1px solid #E5E7EB; padding: 16px 24px; text-align: center; font-size: 11px; color: #9CA3AF;">
              <p style="margin: 0 0 4px 0;">Wealthy Step™ • AMFI Registered Mutual Fund & SIF Distributor (ARN-322891)</p>
              <p style="margin: 0;">This email is an internal notification generated from the Wealthy Step Insurance Intake Portal.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // Brevo API HTTP dispatch
  if (brevoApiKey) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: recipientEmail, name: "Wealthy Step Desk" }],
          subject: emailSubject,
          htmlContent,
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        return { success: true, messageId: resData.messageId };
      }
      console.warn("Brevo API HTTP returned non-200:", await response.text());
    } catch (err: any) {
      console.warn("Brevo API call failed, falling back to SMTP:", err?.message);
    }
  }

  // SMTP Fallback
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

      const info = await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: recipientEmail,
        subject: emailSubject,
        html: htmlContent,
      });

      return { success: true, messageId: info.messageId };
    } catch (smtpErr: any) {
      console.error("SMTP fallback dispatch failed:", smtpErr?.message);
      return { success: false, error: smtpErr?.message };
    }
  }

  // Local / dev mock
  return { success: true, messageId: `mock-email-${Date.now()}` };
}
