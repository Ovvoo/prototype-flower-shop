/**
 * Robots.txt Generator
 * Настройка индексации для поисковых систем
 */

import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowershop.ru';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/*',
          '/api/*',
          '/checkout',
          '/cart',
          '/profile/*',
          '/order/*',
          '/_next/*',
          '/static/*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/*',
          '/api/*',
          '/checkout',
          '/cart',
          '/profile/*',
          '/order/*',
        ],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: [
          '/admin/*',
          '/api/*',
          '/checkout',
          '/cart',
          '/profile/*',
          '/order/*',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
