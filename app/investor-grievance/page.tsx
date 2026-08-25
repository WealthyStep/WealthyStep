import { Metadata } from "next";
import { InnerHero } from "@/components/sections/InnerHero";

export const metadata: Metadata = {
  title: "Investor Grievance Redressal | Wealthy Step",
  description: "Wealthy Step investor grievance redressal process.",
};

export default function InvestorGrievancePage() {
  return (
    <>
      <InnerHero
        title="Investor Grievance"
        subtitle="We Are Here For You"
        description="Our commitment to delivering transparent and prompt services to our investors."
        bgImage="/images/contact-hero.jpg"
      />
      <section className="py-8 md:py-12 flex-1">
        <div className="container mx-auto max-w-4xl px-4 xl:px-0">
          <div className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-lime">
            <h2 className="text-2xl font-bold font-heading mb-6 text-navy">Investor Grievance</h2>
            
            <p className="mb-6 text-text-body">
              At Wealthy Step, we are committed to delivering transparent, prompt, and reliable services to our valued investors. We recognize the importance of addressing investor grievances fairly and efficiently.
            </p>

            <p className="mb-4 text-text-body">
              If you have any queries, complaints, or feedback regarding our mutual fund distribution services, please feel free to reach out to us:
            </p>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8 space-y-3 text-text-body">
              <div><strong>Call:</strong> <a href="tel:+919000929666" className="text-lime hover:underline font-bold">+91 9000929666</a></div>
              <div><strong>Email:</strong> <a href="mailto:info@wealthystep.com" className="text-lime hover:underline font-bold">info@wealthystep.com</a></div>
              <div><strong>Address:</strong> <a href="https://maps.app.goo.gl/Hk3E9w3WdQx8S7eG7" target="_blank" rel="noreferrer" className="text-lime hover:underline font-bold">Pranava Business Park, 7th Floor, Kondapur, Hyderabad, Telangana 500081</a></div>
            </div>

            <p className="mb-6 text-text-body">
              We aim to acknowledge and respond to all investor communications within 24 business hours.
            </p>

            <p className="mb-6 text-text-body">
              If your concern is not resolved to your satisfaction within the specified timeframe, or if you require further escalation, you may directly contact our Founder for resolution:
            </p>

            <div className="bg-navy text-white p-6 rounded-xl mb-8">
              <strong>LTM Ventures India LLP</strong><br />
              Call: <a href="tel:+919000929666" className="text-lime hover:underline font-bold">+91 9000929666</a>
            </div>

            <p className="text-text-body italic">
              Your trust matters to us. We are here to make your experience with Wealthy Step smooth, secure, and supportive.
            </p>

          </div>
        </div>
      </section>
    </>
  );
}
