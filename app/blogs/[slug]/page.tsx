import { blogs } from "@/lib/data/blogs";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) return { title: "Blog Not Found" };

  return {
    title: `${blog.title} | Wealthy Step`,
    description: blog.excerpt,
    alternates: {
      canonical: `/blogs/${slug}`,
    },
    openGraph: {
      title: `${blog.title} | Wealthy Step`,
      description: blog.excerpt,
      url: `/blogs/${slug}`,
      type: "article",
    },
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
    <article className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.excerpt,
            "image": blog.image,
            "datePublished": blog.date,
            "dateModified": (blog as any).updatedAt || blog.date,
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
      
      {/* Blog Header */}
      <header className="bg-navy pt-4 md:pt-8 pb-3 md:pb-5 px-4">
        <div className="container mx-auto max-w-[1200px]">
          <Breadcrumbs 
            items={[
              { label: 'Blogs', href: '/blogs' },
              { label: blog.title, href: `/blogs/${blog.slug}` }
            ]} 
          />
          <div className="flex items-center gap-3 my-2 md:my-3">
            <span className="inline-flex items-center rounded-full bg-lime/20 px-3 py-1 text-sm font-semibold text-lime uppercase tracking-wider">
              Article
            </span>
            <span className="flex items-center text-sm text-cream/70">
              <Clock className="mr-1 h-4 w-4" />
              5 min read
            </span>
          </div>
          
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2 md:mb-4 max-w-[900px]">
            {blog.title}
          </h1>
          
          <div className="flex items-center justify-between border-t border-white/10 pt-2 md:pt-3 max-w-[900px]">
            <div className="text-left text-sm text-cream/60">
              Published on <span className="text-white font-medium ml-1">{blog.date}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Blog Content */}
      <div className="pt-3 md:pt-6 pb-6 md:pb-12 px-4">
        <div className="container mx-auto max-w-[800px]">
          {/* Featured Image */}
          {blog.image && (
            <div className="w-full aspect-video relative mb-5 md:mb-8 rounded-xl md:rounded-2xl overflow-hidden shadow-sm">
              <img 
                src={blog.image} 
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div 
            className="text-text-dark text-base md:text-lg leading-relaxed [&>p]:mb-3 md:[&>p]:mb-4 [&>h2]:text-xl [&>h2]:md:text-3xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-6 [&>h2]:text-navy [&>h3]:text-lg [&>h3]:md:text-2xl [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:mt-5 [&>h3]:text-navy [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ul>li]:mb-1 [&>strong]:font-semibold [&>strong]:text-navy"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </div>
    </article>
  );
}
