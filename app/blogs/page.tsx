import { InnerHero } from "@/components/sections/InnerHero";
import { BookOpen } from "lucide-react";
import { Metadata } from "next";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/fade-in";
import Link from "next/link";
import Image from "next/image";
import { blogs } from "@/lib/data/blogs";

export const metadata: Metadata = {
  title: "Mutual Fund & Investment Blogs | Wealthy Step",
  description: "Read educational articles on mutual fund investing, SIPs, insurance, and goal-based investment strategies.",
  alternates: {
    canonical: '/blogs'
  },
  openGraph: {
    title: "Mutual Fund & Investment Blogs | Wealthy Step",
    description: "Read educational articles on mutual fund investing, SIPs, insurance, and goal-based investment strategies.",
    url: '/blogs',
    type: "website",
  },
};

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <InnerHero
        title="Blogs"
        subtitle="Home / Blogs"
        description="Insights and updates on goal-based investing and mutual funds."
        icon={BookOpen}
      />

      <section className="py-10 md:py-16">
        <div className="container mx-auto max-w-[1200px] px-4 xl:px-0">
          <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <FadeInStaggerItem key={blog.slug}>
                <Link href={`/blogs/${blog.slug}`} className="group block h-full">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                      {/* We use standard img to bypass Next.js Image optimization rules for external/unknown URLs */}
                      <img 
                        src={blog.image} 
                        alt={blog.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-lime text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                        {blog.date}
                      </div>
                      <h3 className="text-xl font-bold text-navy mb-3 font-heading group-hover:text-lime transition-colors leading-tight">
                        {blog.title}
                      </h3>
                      <p className="text-text-body text-sm leading-relaxed mb-6 flex-grow">
                        {blog.excerpt}
                      </p>
                      <div className="mt-auto flex items-center text-navy font-bold text-sm hover:text-lime transition-colors">
                        Read More <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeInStaggerItem>
            ))}
          </FadeInStagger>
        </div>
      </section>
    </main>
  );
}
