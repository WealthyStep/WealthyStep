import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Article } from "@/lib/mock-cms";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";

interface ArticleCardProps {
  article: Article;
  className?: string;
  delay?: number;
}

export function ArticleCard({ article, className, delay = 0 }: ArticleCardProps) {
  return (
    <FadeIn delay={delay} className="h-full">
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white border border-border-sage/30 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1",
          className
        )}
      >
        <div className="relative h-48 w-full bg-cream overflow-hidden border-b border-border-sage/30">
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-lime/10 group-hover:scale-105 transition-transform duration-500 ease-out" />
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <span className="font-heading text-xl text-navy">{article.category}</span>
              </div>
            </>
          )}
        </div>

        <div className="p-6 md:p-8 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center rounded-full bg-lime/10 px-2.5 py-0.5 text-xs font-semibold text-lime uppercase tracking-wider">
              {article.category}
            </span>
            <span className="flex items-center text-xs text-text-body/70">
              <Clock className="mr-1 h-3 w-3" />
              {article.readTime}
            </span>
          </div>
          
          <h3 className="mb-3 font-heading text-xl font-bold text-text-dark group-hover:text-navy transition-colors">
            <Link href={`/knowledge/${article.slug}`}>
              <span className="absolute inset-0 z-10" />
              {article.title}
            </Link>
          </h3>
          
          <p className="mb-6 text-text-body text-sm leading-relaxed flex-1 line-clamp-3">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between border-t border-border-sage/30 pt-4 mt-auto">
            <p className="text-xs font-medium text-text-body/70">{article.date}</p>
            <span className="inline-flex items-center text-sm font-semibold text-lime group-hover:text-cta-green transition-colors z-20 relative">
              Read <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </article>
    </FadeIn>
  );
}
