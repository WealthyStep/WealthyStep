import { Metadata } from "next";
import { InnerHero } from "@/components/sections/InnerHero";

export const metadata: Metadata = {
  title: "Important Links | Wealthy Step",
  description: "Essential regulatory and informational links for investors.",
};

export default function ImportantLinksPage() {
  return (
    <>
      <InnerHero
        title="Important Links"
        subtitle="Investor Resources"
        description="Essential links for mutual fund investors in India."
        bgImage="/images/contact-hero.jpg"
      />
      <section className="py-8 md:py-12 flex-1">
        <div className="container mx-auto max-w-4xl px-4 xl:px-0">
          <div className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-lime">
            <h2 className="text-2xl font-bold font-heading mb-6 text-navy">Important Links</h2>
            
            <p className="mb-6 text-text-body">
              Here are some essential links for investors:
            </p>

            <ul className="space-y-6 mb-8 text-text-body">
              <li>
                <strong>Association of Mutual Funds in India (AMFI):</strong> Provides information on mutual funds, including NAVs, fund performance, and investor education.<br/>
                <a href="https://www.amfiindia.com/" target="_blank" rel="noreferrer" className="text-lime hover:underline font-bold mt-1 inline-block">Visit AMFI Website &rarr;</a>
              </li>
              <li>
                <strong>Securities and Exchange Board of India (SEBI):</strong> The regulatory body for securities markets in India, offering guidelines, circulars, and investor protection information.<br/>
                <a href="https://www.sebi.gov.in/" target="_blank" rel="noreferrer" className="text-lime hover:underline font-bold mt-1 inline-block">Visit SEBI Website &rarr;</a>
              </li>
              <li>
                <strong>Registrar and Transfer Agent (RTA):</strong><br/>
                <a href="https://www.camsonline.com/" target="_blank" rel="noreferrer" className="text-lime hover:underline font-bold mt-1 inline-block mr-4">CAMS Online &rarr;</a>
                <a href="https://mfs.kfintech.com/" target="_blank" rel="noreferrer" className="text-lime hover:underline font-bold mt-1 inline-block">KFintech &rarr;</a>
              </li>
              <li>
                <strong>CDSL/NSDL (Depositories):</strong><br/>
                <a href="https://www.cdslindia.com/" target="_blank" rel="noreferrer" className="text-lime hover:underline font-bold mt-1 inline-block mr-4">CDSL India &rarr;</a>
                <a href="https://nsdl.co.in/related/wrld.php" target="_blank" rel="noreferrer" className="text-lime hover:underline font-bold mt-1 inline-block">NSDL &rarr;</a>
              </li>
            </ul>

          </div>
        </div>
      </section>
    </>
  );
}
