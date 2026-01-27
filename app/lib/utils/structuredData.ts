/**
 * Structured Data (JSON-LD) Utilities
 * Генерация schema.org разметки для SEO
 */

import type { Product, Review } from '@/lib/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowershop.ru';
const SITE_NAME = 'Цветочный магазин';

/**
 * Organization Schema (для главной страницы)
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/images/og-default.jpg`,
    description: 'Доставка свежих цветов и букетов по Москве за 2 часа. Гарантия свежести 7 дней.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Тверская, 12',
      addressLocality: 'Москва',
      postalCode: '125009',
      addressCountry: 'RU',
    },
    telephone: '+7 (495) 123-45-67',
    email: 'info@flowershop.ru',
    openingHours: 'Mo-Su 09:00-21:00',
    priceRange: '₽₽',
    sameAs: [
      'https://vk.com/flowershop',
      'https://instagram.com/flowershop',
      'https://facebook.com/flowershop',
    ],
  };
}

/**
 * WebSite Schema с SearchAction
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: 'Доставка свежих цветов и букетов по Москве',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/catalog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Product Schema
 */
export function generateProductSchema(product: Product) {
  const offers = {
    '@type': 'Offer',
    url: `${SITE_URL}/product/${product.id}`,
    priceCurrency: 'RUB',
    price: product.price.toString(),
    priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 дней
    itemCondition: 'https://schema.org/NewCondition',
    availability:
      product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    seller: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images || [],
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers,
  };

  // Добавляем aggregateRating если есть отзывы
  if (product.average_rating && product.reviews_count && product.reviews_count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.average_rating.toString(),
      reviewCount: product.reviews_count.toString(),
      bestRating: '5',
      worstRating: '1',
    };
  }

  return schema;
}

/**
 * Review Schema (для отзыва)
 */
export function generateReviewSchema(review: Review, productName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      name: productName,
    },
    author: {
      '@type': 'Person',
      name: review.user.name,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    reviewBody: review.comment,
    datePublished: review.created_at,
  };
}

/**
 * BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Article/BlogPosting Schema
 */
export function generateArticleSchema(article: {
  title: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  author?: string;
  published_at?: string;
  updated_at?: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt || article.content.replace(/<[^>]*>/g, '').slice(0, 160),
    image: article.cover_image,
    author: {
      '@type': 'Person',
      name: article.author || SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${article.slug}`,
    },
  };
}

/**
 * FAQ Schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
