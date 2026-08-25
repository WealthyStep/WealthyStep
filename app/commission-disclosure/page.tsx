import { InnerHero } from "@/components/sections/InnerHero";
import { FileText } from "lucide-react";
import { Metadata } from "next";
import { FadeIn } from "@/components/ui/fade-in";

export const metadata: Metadata = {
  title: "Commission Disclosure - Wealthy Step",
  description: "Commission Disclosure under SEBI Circular SEBI/IMD/CIR No.4 /168230/09.",
};

export default function CommissionDisclosurePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <InnerHero
        title="Commission Disclosure"
        subtitle="Home / Commission Disclosure"
        description="Commission Disclosure under SEBI Circular SEBI/IMD/CIR No.4 /168230/09"
        icon={FileText}
      />

      <section className="py-10 md:py-16">
        <div className="container mx-auto max-w-5xl px-4 xl:px-0">
          <FadeIn>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
              
              <p className="text-text-body text-lg mb-8 leading-relaxed">
                The details of the commission earned by us from various Asset Management Companies (AMCs) are as below:
              </p>

              <div className="overflow-x-auto mb-10">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-navy text-white">
                      <th className="p-4 font-heading font-semibold text-[15px] rounded-tl-xl">Scheme Type</th>
                      <th className="p-4 font-heading font-semibold text-[15px]">Trail 1st Year</th>
                      <th className="p-4 font-heading font-semibold text-[15px] rounded-tr-xl">Trail 2nd Year Onwards</th>
                    </tr>
                  </thead>
                  <tbody className="text-text-body text-[15px] divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-navy">Arbitrage Funds</td>
                      <td className="p-4">0.05% to 0.60%</td>
                      <td className="p-4">0.05% to 0.60%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-navy">ELSS Funds</td>
                      <td className="p-4">0.50% to 1.25%</td>
                      <td className="p-4">0.50% to 1.25%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-navy">Equity Oriented Funds</td>
                      <td className="p-4">0.50% to 1.25%</td>
                      <td className="p-4">0.50% to 1.25%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-navy">Aggressive Hybrid Equity Funds</td>
                      <td className="p-4">0.50% to 1.25%</td>
                      <td className="p-4">0.50% to 1.25%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-navy">Fixed Maturity Plans</td>
                      <td className="p-4">0.05% to 0.50%</td>
                      <td className="p-4">0.05% to 0.50%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-navy">Fund of Funds</td>
                      <td className="p-4">0.25% to 1%</td>
                      <td className="p-4">0.25% to 1%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-navy">Gilt Funds</td>
                      <td className="p-4">0.25% to 1%</td>
                      <td className="p-4">0.05% to 0.65%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-navy">Hybrid Debt Funds</td>
                      <td className="p-4">0.05% to 0.75%</td>
                      <td className="p-4">0.05% to 0.75%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-navy">Income Funds</td>
                      <td className="p-4">0.05% to 1%</td>
                      <td className="p-4">0.05% to 1%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-navy">Index Funds</td>
                      <td className="p-4">0.01% to 0.75%</td>
                      <td className="p-4">0.01% to 0.75%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-navy">Liquid Funds / Ultra Short-Term Funds</td>
                      <td className="p-4">0.05% to 0.50%</td>
                      <td className="p-4">0.05% to 0.50%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-navy">Short-Term Income Funds</td>
                      <td className="p-4">0.05% to 0.65%</td>
                      <td className="p-4">0.05% to 0.65%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-navy rounded-bl-xl">Thematic / Sector Funds</td>
                      <td className="p-4">0.50% to 1.25%</td>
                      <td className="p-4 rounded-br-xl">0.50% to 1.25%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-[#F8FAF5] p-6 rounded-xl border border-lime/20">
                <p className="text-text-body text-sm leading-relaxed text-justify">
                  <strong>*Investments in mutual funds are subject to market risk and customers should read the scheme-related documents / key information documents of the Mutual Fund products carefully before investing.</strong> This is on a best-effort basis and rates are updated as and when actual rates are received from AMCs. This is for information purposes only and does not represent any financial or other advice. The information contained in this presentation is general in nature. The client acknowledges that the prices and net asset values of the mutual fund schemes are subject to fluctuation based on the factors and the forces affecting the capital markets. Past performance of the sponsors, mutual funds, or their affiliates do not indicate or guarantee the future performance of any scheme in any manner, and historical performance, when presented, is purely for reference purposes. This page is an integral part of the document generated by us. Investment proposals are prepared on request of the client for general information and reference purposes. It aims to demonstrate a proposal considering the client’s investment objective and investment preferences designed based on information provided by the client. The proposal is purely on a non-binding basis and the client is free to accept or reject the proposal. We shall not be held responsible for any direct or indirect loss caused by relying on this information. The client is free to seek the opinion of the legal, investment, and taxation advisor for making investment decisions.
                </p>
              </div>

            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
