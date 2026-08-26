const fs = require('fs');
const path = require('path');

function updateBlogSlug() {
  const filePath = 'd:/Projects/wealthystep/app/blogs/[slug]/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');

  // Update generateMetadata
  const metadataReplacement = `export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) return { title: "Blog Not Found" };

  return {
    title: \`\${blog.title} | Wealthy Step\`,
    description: blog.excerpt,
    alternates: {
      canonical: \`/blogs/\${slug}\`,
    },
    openGraph: {
      title: \`\${blog.title} | Wealthy Step\`,
      description: blog.excerpt,
      url: \`/blogs/\${slug}\`,
      type: "article",
    },
  };
}`;
  content = content.replace(/export async function generateMetadata[\s\S]*?^}/m, metadataReplacement);

  // Add JSON-LD to JSX
  const jsxReplacement = `return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
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
            "publisher": {
              "@type": "Organization",
              "name": "Wealthy Step",
              "url": "https://wealthystep.com"
            }
          })
        }}
      />
      <InnerHero`;
  content = content.replace(/return \(\s*<main className="min-h-screen bg-gray-50 flex flex-col">\s*<InnerHero/, jsxReplacement);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated app/blogs/[slug]/page.tsx');
}

function updateKnowledgeSlug() {
  const filePath = 'd:/Projects/wealthystep/app/knowledge/[slug]/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the async issue in page.tsx if there is one (Next.js 15+ needs awaited params)
  const metadataReplacement = `export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);
  
  if (!article) {
    return {
      title: "Article Not Found | Wealthy Step",
    };
  }

  return {
    title: \`\${article.title} | Wealthy Step\`,
    description: article.excerpt,
    alternates: {
      canonical: \`/knowledge/\${resolvedParams.slug}\`,
    },
    openGraph: {
      title: \`\${article.title} | Wealthy Step\`,
      description: article.excerpt,
      url: \`/knowledge/\${resolvedParams.slug}\`,
      type: "article",
    },
  };
}`;
  content = content.replace(/export function generateMetadata[\s\S]*?^}/m, metadataReplacement);

  // Fix page component signature to use async params
  const pageSig = `export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);`;
  
  content = content.replace(/export default function ArticlePage\(\{ params \}: \{ params: \{ slug: string \} \}\) \{\s*const article = getArticleBySlug\(params\.slug\);/, pageSig);

  // Add JSON-LD
  const jsxReplacement = `return (
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
            "author": {
              "@type": "Person",
              "name": article.author.name
            },
            "publisher": {
              "@type": "Organization",
              "name": "Wealthy Step",
              "url": "https://wealthystep.com"
            }
          })
        }}
      />
      {/* Article Header */}`;
  content = content.replace(/return \(\s*<article className="min-h-screen bg-white">\s*\{\/\* Article Header \*\/\}/, jsxReplacement);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated app/knowledge/[slug]/page.tsx');
}

updateBlogSlug();
updateKnowledgeSlug();
