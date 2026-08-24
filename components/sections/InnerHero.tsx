import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { FadeInStagger, FadeInStaggerItem } from "@/components/ui/fade-in";
import Image from "next/image";

interface InnerHeroProps {
  title: string;
  subtitle?: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
  bgImage?: string;
}

export function InnerHero({
  title,
  subtitle,
  description,
  icon: Icon,
  className,
  bgImage,
}: InnerHeroProps) {
  return (
    <section className={cn("relative section-navy py-16 md:py-24 text-center overflow-hidden", className)}>
      {bgImage && (
        <>
          <div className="absolute inset-0 z-0">
            <Image 
              src={bgImage} 
              alt={title} 
              fill 
              className="object-cover opacity-30 mix-blend-overlay"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40 z-0"></div>
        </>
      )}
      <FadeInStagger className="relative z-10 container mx-auto max-w-[800px] px-4 xl:px-0 flex flex-col items-center">
        {Icon && (
          <FadeInStaggerItem>
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-lime/20 text-lime">
              <Icon className="h-8 w-8" />
            </div>
          </FadeInStaggerItem>
        )}
        {subtitle && (
          <FadeInStaggerItem>
            <span className="text-sm font-semibold tracking-widest text-lime uppercase mb-4 block">
              {subtitle}
            </span>
          </FadeInStaggerItem>
        )}
        <FadeInStaggerItem>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-white drop-shadow-md">
            {title}
          </h1>
        </FadeInStaggerItem>
        <FadeInStaggerItem>
          <p className="text-lg text-cream/90 max-w-2xl mx-auto drop-shadow">
            {description}
          </p>
        </FadeInStaggerItem>
      </FadeInStagger>
    </section>
  );
}
