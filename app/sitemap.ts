import { MetadataRoute } from 'next';
import { mockArticles } from '@/lib/mock-cms';
import { blogs } from '@/lib/data/blogs';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://wealthystep.com';

  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/insurance',
    '/investments',
    '/nri-services',
    '/goal-calculators',
    '/knowledge',
    '/blogs',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const knowledgeRoutes = mockArticles.map((article) => ({
    url: `${baseUrl}/knowledge/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  
  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...knowledgeRoutes, ...blogRoutes];
}
