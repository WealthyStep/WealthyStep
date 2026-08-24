import { MetadataRoute } from 'next';
import { mockArticles } from '@/lib/mock-cms';

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
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const dynamicRoutes = mockArticles.map((article) => ({
    url: `${baseUrl}/knowledge/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
