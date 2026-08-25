"use client";

import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const phoneNumber = "919000929666"; // Standardized format for WhatsApp API
  const message = "Hello! I'm interested in Wealthy Step's financial services and would like to know more.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  // Show button after a slight delay to not distract from initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex items-end justify-end transition-all duration-700 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      )}
    >
      <div className="relative group">
        {/* Tooltip / Message Bubble */}
        <div className="absolute right-full mr-4 bottom-1/2 translate-y-1/2 w-max px-4 py-3 bg-white text-navy text-sm font-semibold rounded-2xl rounded-br-none shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none origin-bottom-right hidden md:block">
          Need expert advice? <span className="text-[#25D366]">Chat with us!</span>
          <div className="absolute right-[-6px] bottom-2 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-[-45deg]"></div>
        </div>

        {/* Floating Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 group/btn outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50 bg-gradient-to-tr from-[#1EBE57] to-[#25D366] overflow-hidden"
          aria-label="Chat with us on WhatsApp"
        >
          {/* Glassmorphism shine effect */}
          <div className="absolute inset-0 bg-white opacity-20 -rotate-45 translate-x-[-150%] group-hover/btn:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>

          {/* Outer Ripple Animation */}
          <div className="absolute inset-0 rounded-full border-2 border-white/60 animate-ping opacity-50"></div>

          {/* WhatsApp Icon SVG (Custom SVG for authentic look) */}
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="w-7 h-7 md:w-8 md:h-8 relative z-10 transform group-hover/btn:rotate-12 transition-transform duration-300"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
