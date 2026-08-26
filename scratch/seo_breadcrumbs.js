const fs = require('fs');
const path = require('path');

function updateBlogSlug() {
  const filePath = 'd:/Projects/wealthystep/app/blogs/[slug]/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');

  // Add Breadcrumbs import
  if (!content.includes('import { Breadcrumbs }')) {
    content = content.replace(
      /import \{ FadeIn \} from "@\/components\/ui\/fade-in";/,
      `import { FadeIn } from "@/components/ui/fade-in";\nimport { Breadcrumbs } from "@/components/seo/Breadcrumbs";`
    );
  }

  // Update JSX to include Breadcrumbs
  if (!content.includes('<Breadcrumbs')) {
    const breadcrumbJSX = `
      <div className="bg-navy px-4 pt-32 pb-8">
        <div className="container mx-auto max-w-[800px]">
          <Breadcrumbs 
            items={[
              { label: 'Blogs', href: '/blogs' },
              { label: blog.title, href: \`/blogs/\${blog.slug}\` }
            ]} 
          />
        </div>
      </div>
      <InnerHero`;
    content = content.replace(/<InnerHero/, breadcrumbJSX);
  }

  // Add dateModified to JSON-LD
  content = content.replace(
    /"datePublished": blog\.date,/,
    `"datePublished": blog.date,\n            "dateModified": blog.updatedAt || blog.date,`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated app/blogs/[slug]/page.tsx');
}

function updateKnowledgeSlug() {
  const filePath = 'd:/Projects/wealthystep/app/knowledge/[slug]/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');

  // Add Breadcrumbs import
  if (!content.includes('import { Breadcrumbs }')) {
    content = content.replace(
      /import \{ Metadata \} from "next";/,
      `import { Metadata } from "next";\nimport { Breadcrumbs } from "@/components/seo/Breadcrumbs";`
    );
  }

  // Update JSX to include Breadcrumbs and remove the old back link
  if (!content.includes('<Breadcrumbs')) {
    const headerReplacement = `
      <header className="bg-navy pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-[800px]">
          <Breadcrumbs 
            items={[
              { label: 'Knowledge Center', href: '/knowledge' },
              { label: article.title, href: \`/knowledge/\${article.slug}\` }
            ]} 
          />
          <div className="flex items-center gap-3 mb-6 mt-4">`;
    
    // Using a regex to replace the old back link block
    content = content.replace(
      /<header className="bg-navy pt-32 pb-16 px-4">[\s\S]*?<div className="flex items-center gap-3 mb-6">/,
      headerReplacement
    );
  }

  // Add dateModified to JSON-LD
  content = content.replace(
    /"datePublished": article\.date,/,
    `"datePublished": article.date,\n            "dateModified": article.updatedAt || article.date,`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated app/knowledge/[slug]/page.tsx');
}

updateBlogSlug();
updateKnowledgeSlug();
