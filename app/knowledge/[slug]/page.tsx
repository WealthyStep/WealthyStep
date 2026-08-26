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
      
      <header className="bg-navy pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-[800px]">
          <Breadcrumbs 
            items={[
              { label: 'Knowledge Center', href: '/knowledge' },
              { label: article.title, href: `/knowledge/${article.slug}` }
            ]} 
          />
          <div className="flex items-center gap-3 mb-6 mt-4">
            <span className="inline-flex items-center rounded-full bg-lime/20 px-3 py-1 text-sm font-semibold text-lime uppercase tracking-wider">
              {article.category}
            </span>
            <span className="flex items-center text-sm text-cream/70">
              <Clock className="mr-1 h-4 w-4" />
              {article.readTime}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-8">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-cream flex items-center justify-center text-navy font-bold font-heading">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{article.author.name}</p>
                <p className="text-cream/60 text-xs">{article.author.role}</p>
              </div>
            </div>
            <div className="text-right text-sm text-cream/60">
              Published on <br />
              <span className="text-white font-medium">{article.date}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      {/* We use basic typography styles here without requiring the official @tailwindcss/typography plugin to keep the setup lean. */}
      <div className="py-16 px-4">
        <div 
          className="container mx-auto max-w-[800px] text-text-dark text-lg leading-loose [&>p]:mb-6 [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:mb-6 [&>h2]:mt-12 [&>h2]:text-navy [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:mb-4 [&>h3]:mt-8 [&>h3]:text-navy [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>strong]:font-semibold [&>strong]:text-navy"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </article>
  );
}
