import { blogs } from "@/lib/data/blogs";
import { notFound } from "next/navigation";
import { InnerHero } from "@/components/sections/InnerHero";
import { BookOpen } from "lucide-react";
import { Metadata } from "next";
import { FadeIn } from "@/components/ui/fade-in";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) return { title: "Blog Not Found" };

  return {
    title: `${blog.title} - Wealthy Step`,
    description: blog.excerpt,
  };
}

export function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <InnerHero
        title={blog.title}
        subtitle="Home / Blogs"
        description={`Published On ${blog.date}`}
        icon={BookOpen}
      />

      <section className="py-6 md:py-8">
        <div className="container mx-auto max-w-4xl px-4 xl:px-0">
          <FadeIn>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="mb-10 rounded-xl overflow-hidden w-full h-[300px] md:h-[450px] relative bg-gray-100">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                <div className="text-sm font-bold text-navy">
                  Published On <span className="text-lime">{blog.date}</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="text-sm font-bold text-navy">
                  Follow Us
                </div>
              </div>

              <div 
                className="prose prose-navy max-w-none prose-headings:font-heading prose-headings:text-navy prose-a:text-lime hover:prose-a:text-navy prose-a:break-all prose-strong:text-navy prose-li:text-text-body prose-p:my-3 prose-headings:my-5 prose-ul:my-3"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
