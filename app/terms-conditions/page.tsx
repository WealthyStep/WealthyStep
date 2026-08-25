import { Metadata } from "next";
import { InnerHero } from "@/components/sections/InnerHero";

export const metadata: Metadata = {
  title: "Terms & Conditions | Wealthy Step",
  description: "Terms and conditions for Wealthy Step services.",
};

export default function TermsConditionsPage() {
  return (
    <>
      <InnerHero
        title="Terms & Conditions"
        subtitle="Important Information"
        description="Understanding the terms of investing through Mutual Fund Distributors."
        bgImage="/images/contact-hero.jpg"
      />
      <section className="py-8 md:py-12 flex-1">
        <div className="container mx-auto max-w-4xl px-4 xl:px-0">
          <div className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-lime">
            <h2 className="text-2xl font-bold font-heading mb-6 text-navy">Terms & Conditions</h2>
            
            <p className="mb-6 text-text-body">
              When investing through Mutual Fund Distributors (MFDs), investors need to understand the following terms and conditions:
            </p>

            <ul className="space-y-4 mb-8 text-text-body list-disc pl-6">
              <li><strong>Net Asset Value (NAV):</strong> The value of mutual fund units is based on the applicable NAV, which fluctuates based on market conditions.</li>
              <li><strong>Commissions and Fees:</strong> Distributors may receive commissions (upfront, trail, or otherwise) from Asset Management Companies (AMCs). These should be transparently disclosed to the investor.</li>
              <li><strong>Entry and Exit Loads:</strong> Some mutual fund schemes may charge entry (at the time of purchase) or exit loads (at the time of redemption). Investors should be informed about these charges beforehand.</li>
              <li><strong>Execution-Only Platform:</strong> MFDs may offer an execution-only platform, meaning they execute transactions without providing investment advice.</li>
              <li><strong>KYC Compliance:</strong> Investors must complete the Know Your Customer (KYC) process before investing.</li>
              <li><strong>Right to Information:</strong> Investors have the right to receive all relevant information about the mutual fund schemes, including scheme information documents, key information memorandums, and periodic statements.</li>
            </ul>

          </div>
        </div>
      </section>
    </>
  );
}
