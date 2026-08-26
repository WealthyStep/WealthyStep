import { Metadata } from "next";
import { ContactHero } from "@/components/sections/contact/ContactHero";
import { ContactQuickInfo } from "@/components/sections/contact/ContactQuickInfo";
import { ContactSplitSection } from "@/components/sections/contact/ContactSplitSection";
import { ContactLocation } from "@/components/sections/contact/ContactLocation";
import { ContactBottomCTA } from "@/components/sections/contact/ContactBottomCTA";

export const metadata: Metadata = {
  title: "Contact Wealthy Step | Investor Support",
  description: "Get in touch with Wealthy Step for support with your mutual fund investments and insurance queries.",
  alternates: {
    canonical: '/contact'
  },
  openGraph: {
    title: "Contact Wealthy Step | Investor Support",
    description: "Get in touch with Wealthy Step for support with your mutual fund investments and insurance queries.",
    url: '/contact',
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <ContactHero />
      <ContactQuickInfo />
      <ContactSplitSection />
      <ContactLocation />
      <ContactBottomCTA />
    </div>
  );
}
