import { Metadata } from "next";
import { InnerHero } from "@/components/sections/InnerHero";

export const metadata: Metadata = {
  title: "Risk Factors | Wealthy Step",
  description: "Risk factors associated with mutual fund investments.",
};

export default function RiskFactorsPage() {
  return (
    <>
      <InnerHero
        title="Risk Factors"
        subtitle="Important Information"
        description="Understanding the risks associated with investing through Mutual Fund Distributors."
        bgImage="/images/contact-hero.jpg"
      />
      <section className="py-8 md:py-12 flex-1">
        <div className="container mx-auto max-w-4xl px-4 xl:px-0">
          <div className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-lime">
            <h2 className="text-2xl font-bold font-heading mb-6 text-navy">Risk Factors Associated with Investing Through MFDs</h2>
            <h3 className="text-xl font-bold mb-4">Risk Factors Associated with Mutual Fund Investments</h3>
            
            <p className="mb-6 text-text-body">
              Investing through mutual funds involves certain risks, and investors are advised to read all scheme-related documents carefully. Some key risks include:
            </p>

            <ul className="space-y-4 mb-8 text-text-body list-disc pl-6">
              <li><strong>Market Risk:</strong> The value of mutual fund investments may rise or fall due to changes in overall market conditions.</li>
              <li><strong>Liquidity Risk:</strong> Some securities held by mutual funds may not be easily traded in the market, which can affect timely redemptions.</li>
              <li><strong>Credit Risk:</strong> In debt-oriented funds, there is a risk that the issuer of a bond or instrument may default in payment of interest or principal.</li>
              <li><strong>Interest Rate Risk:</strong> Debt fund values are sensitive to interest rate changes. Rising interest rates may negatively impact returns.</li>
              <li><strong>Inflation Risk:</strong> Over time, inflation may reduce the real value of your investment returns.</li>
              <li><strong>Managerial Risk:</strong> Fund performance depends on the decisions of the fund manager. Incorrect calls or strategy may lead to underperformance.</li>
              <li><strong>Scheme-Specific Risks:</strong> Each mutual fund scheme carries unique risks. Investors are advised to read the Scheme Information Document (SID) before investing.</li>
            </ul>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-sm text-text-body italic">
              <strong>Note:</strong> Mutual Fund investments are subject to market risks. Read all scheme-related documents carefully. Past performance is not indicative of future results. As a Mutual Fund Distributor (MFD), we offer execution-only services and do not provide investment advice. Investors are advised to assess their risk tolerance and consult with a financial advisor if needed.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
