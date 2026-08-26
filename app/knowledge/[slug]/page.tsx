import { getArticleBySlug, mockArticles } from "@/lib/mock-cms";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

// This enables Static Site Generation for all known articles at build time
export function generateStaticParams() {
  return mockArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);
  
  if (!article) {
    return {
      title: "Article Not Found | Wealthy Step",
    };
  }

  return {
    title: `${article.title} | Wealthy Step`,
    description: article.excerpt,
    alternates: {
      canonical: `/knowledge/${resolvedParams.slug}`,
    },
    openGraph: {
      title: `${article.title} | Wealthy Step`,
      description: article.excerpt,
      url: `/knowledge/${resolvedParams.slug}`,
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.excerpt,
            "datePublished": article.date,
            "dateModified": article.updatedAt || article.date,
            "author": {
              "@type": "Person",
              "name": article.author.name
            },
            "publisher": {
              "@type": "Organization",
              "name": "Wealthy Step",
              "url": "https://wealthystep.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://wealthystep.com/logo.svg"
              }
            }
          })
        }}
      />
      {/* Article Header */}
      
      <header className="bg-navy pt-4 md:pt-8 pb-3 md:pb-5 px-4">
        <div className="container mx-auto max-w-[1200px]">
          <Breadcrumbs 
            items={[
              { label: 'Knowledge Center', href: '/knowledge' },
              { label: article.title, href: `/knowledge/${article.slug}` }
            ]} 
          />
          <div className="flex items-center gap-3 my-2 md:my-3">
            <span className="inline-flex items-center rounded-full bg-lime/20 px-3 py-1 text-sm font-semibold text-lime uppercase tracking-wider">
              {article.category}
            </span>
            <span className="flex items-center text-sm text-cream/70">
              <Clock className="mr-1 h-4 w-4" />
              {article.readTime}
            </span>
          </div>
          
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2 md:mb-4 max-w-[900px]">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-between border-t border-white/10 pt-2 md:pt-3 max-w-[900px]">
            <div className="text-left text-sm text-cream/60">
              Published on <span className="text-white font-medium ml-1">{article.date}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      {/* We use basic typography styles here without requiring the official @tailwindcss/typography plugin to keep the setup lean. */}
      <div className="pt-3 md:pt-6 pb-6 md:pb-12 px-4">
        <div className="container mx-auto max-w-[800px]">
          {/* Featured Image */}
          {article.image && (
            <div className="w-full aspect-video relative mb-5 md:mb-8 rounded-xl md:rounded-2xl overflow-hidden shadow-sm">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div 
            className="text-text-dark text-base md:text-lg leading-relaxed [&>p]:mb-3 md:[&>p]:mb-4 [&>h2]:text-xl [&>h2]:md:text-3xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-6 [&>h2]:text-navy [&>h3]:text-lg [&>h3]:md:text-2xl [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:mt-5 [&>h3]:text-navy [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ul>li]:mb-1 [&>strong]:font-semibold [&>strong]:text-navy"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>
    </article>
  );
}
