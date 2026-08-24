import { InnerHero } from "@/components/sections/InnerHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { InfoCard } from "@/components/cards/InfoCard";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Wealthy Step",
  description: "Get in touch with Wealthy Step's financial advisors.",
};

export default function ContactPage() {
  return (
    <>
      <InnerHero
        title="Get In Touch"
        subtitle="Contact Us"
        description="Have questions about your financial journey? Our expert advisors are here to help you take the next step."
        bgImage="/9.jpg"
      />

      <section className="section-white py-16 md:py-24">
        <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
          <div className="grid gap-12 lg:grid-cols-2">
            
            {/* Contact Details Grid */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-text-dark">We're here to help</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <InfoCard
                  icon={MapPin}
                  title="Our Office"
                  description={
                    <>
                      123 Financial District,<br />
                      Suite 400<br />
                      Mumbai, MH 400001
                    </>
                  }
                />
                <InfoCard
                  icon={Phone}
                  title="Call Us"
                  description={
                    <>
                      <a href="tel:+919876543210" className="hover:text-lime block">+91 98765 43210</a>
                      <a href="tel:+919876543211" className="hover:text-lime block">+91 98765 43211</a>
                    </>
                  }
                />
                <InfoCard
                  icon={Mail}
                  title="Email Us"
                  description={
                    <>
                      <a href="mailto:hello@wealthystep.com" className="hover:text-lime block">hello@wealthystep.com</a>
                      <a href="mailto:support@wealthystep.com" className="hover:text-lime block">support@wealthystep.com</a>
                    </>
                  }
                />
                <InfoCard
                  icon={Clock}
                  title="Working Hours"
                  description={
                    <>
                      Mon - Fri: 9:00 AM - 6:00 PM<br />
                      Sat: 10:00 AM - 2:00 PM<br />
                      Sun: Closed
                    </>
                  }
                />
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-text-dark">Send us a message</h2>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
