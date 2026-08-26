import { InnerHero } from "@/components/sections/InnerHero";
import { ShieldAlert } from "lucide-react";
import { Metadata } from "next";
import { FadeIn } from "@/components/ui/fade-in";

export const metadata: Metadata = {
  title: "Privacy Policy | Wealthy Step",
  description: "Read the Wealthy Step privacy policy to understand how we protect your data and personal information.",
  alternates: {
    canonical: '/privacy-policy'
  },
  openGraph: {
    title: "Privacy Policy | Wealthy Step",
    description: "Read the Wealthy Step privacy policy to understand how we protect your data and personal information.",
    url: '/privacy-policy',
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <InnerHero
        title="Privacy Policy"
        subtitle="Home / Privacy Policy"
        description="Learn how LTM Ventures India LLP uses and protects any information that you share when you use this website."
        icon={ShieldAlert}
      />

      <section className="py-10 md:py-16">
        <div className="container mx-auto max-w-4xl px-4 xl:px-0">
          <FadeIn>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 prose prose-navy max-w-none">
              
              <p>
                This Privacy Policy sets out how LTM Ventures India LLP uses and protects any information that you share when you use this website. LTM Ventures India LLP is committed to ensuring that your privacy is protected at all times. Should we ask you to provide certain information by which you can be identified when using this website, you can be assured that it will only be used in accordance with this Privacy Statement.
              </p>
              
              <p>
                LTM Ventures India LLP understands that our relationship is strongly built on trust and faith. In the course of using information on this website or availing of the services, LTM Ventures India LLP may become privy to the personal information of its customers, including information that is of a confidential nature.
              </p>
              
              <p>
                LTM Ventures India LLP is strictly committed to protecting the privacy of its customers and has taken reasonable measures to protect the confidentiality of customer information and its transmission through the World Wide Web. However, it shall not be liable in any manner for the disclosure of confidential information in accordance with this Privacy Commitment, in terms of the agreement, if any, with the customer, or for reasons beyond its control.
              </p>
              
              <p>
                We may, however, be required to disclose your personal information to Government bodies, Judicial bodies, our Regulators, or any person to whom the Firm is under an obligation to make disclosure under the requirements of any law binding on the Firm or any of its branches, if required.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4 font-heading">Hyperlink Policy for User</h2>
              <p>
                Any hyperlink to other Internet sites is at the customer's own risk. The contents of such websites and the accuracy of opinions expressed are not verified, monitored, or endorsed by LTM Ventures India LLP in any way or manner. LTM Ventures India LLP is not responsible for the setup of any hyperlink from a third-party website to LTM Ventures India LLP.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4 font-heading">What We Collect</h2>
              <p>We may collect the following information:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Name and contact details</li>
                <li>Personal information directly from you, such as name, email address, contact details, or other identifiers when you register, transact, or interact with the application.</li>
              </ul>
              
              <p>
                Your personal information is used to provide access to features, personalize your experience, and communicate with you regarding your account or transactions. We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <p>
                You have the right to control and manage your personal information. You can update details, manage communication preferences, or exercise your rights under applicable data protection laws. You may also request the deletion of your account or personal information through the application or by contacting us.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4 font-heading">Collection/Use of Image Data</h2>
              <p>
                When you grant permission, our application may access your device's camera or photo gallery to enable features involving capturing or uploading images. Images may be used for document verification in Video KYC. We do not share image data with third parties unless required by law or necessary to provide services requested by you.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4 font-heading">Use of Location Data</h2>
              <p>
                Location access may be used for identity verification and enabling application functionalities.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4 font-heading">Security</h2>
              <p>
                We are committed to ensuring that your information is secure. Suitable physical, electronic, and managerial procedures are in place to safeguard the information collected.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4 font-heading">Links to Other Websites</h2>
              <p>
                Our website may contain links to other websites. Once you leave our site, we do not have control over those websites and are not responsible for the protection and privacy of any information you provide there.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4 font-heading">Controlling your personal information</h2>
              <p>
                If you believe that any of your information is incorrect or incomplete, please email us at <strong>info@wealthystep.com</strong>. We will promptly correct any information found to be incorrect.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-10 mb-4 font-heading">Security Certificates</h2>
              <p>
                We recognize the security implications of handling financial data. Safeguards include: When it comes to data security, our goal is to ensure that:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Your data is stored safely and securely.</li>
                <li>Passwords are one-way encrypted before being stored in the database for high security.</li>
                <li>All communication with you, or with mutual fund companies and other service providers are encrypted using the highest standards.</li>
                <li>Your data is not shared with anyone, unless you have explicitly requested us to do so to fulfil a transaction request.</li>
              </ul>
              <p>
                To ensure that we achieve these goals, we have a variety of certifications/trust verifications in place for our firm, both from technical and legal/operational perspectives. All our communications are encrypted by 256-bit encryption, and our data is hosted with top-tier hosting service providers. Also, our data is continuously backed up to ensure continuity of operations.
              </p>

            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
