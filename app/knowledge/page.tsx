import { InnerHero } from "@/components/sections/InnerHero";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { mockArticles } from "@/lib/mock-cms";
import { BookOpen } from "lucide-react";
import { constructMetadata, ROUTES_SEO } from "@/lib/seo";

export const metadata = constructMetadata(ROUTES_SEO.knowledge);

export default function KnowledgePage() {
  return (
    <>
      <InnerHero
        title="Knowledge Center"
        subtitle="Insights & Research"
        description="Stay informed with our latest market analysis, financial guides, and investment strategies."
        icon={BookOpen}
      />

      <section className="section-white pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mockArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
