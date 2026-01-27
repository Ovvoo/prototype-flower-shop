/**
 * Metadata Utilities
 * Утилиты для генерации SEO метаданных
 */

import type { Metadata } from 'next';
import type { Product, Category } from '@/lib/types';

const SITE_NAME = 'Цветочный магазин';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowershop.ru';
const DEFAULT_IMAGE = `${SITE_URL}/images/og-default.jpg`;

/**
 * Базовые метаданные (используются как fallback)
 */
export const DEFAULT_METADATA: Metadata = {
  title: {
    default: `${SITE_NAME} — Доставка цветов в Москве`,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Доставка свежих цветов и букетов по Москве. Гарантия свежести 7 дней. Быстрая доставка за 2 часа.',
  keywords: ['цветы', 'букеты', 'доставка цветов', 'купить цветы', 'москва', 'розы', 'букет на заказ'],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@flowershop',
    creator: '@flowershop',
  },
};

/**
 * Генерация метаданных для главной страницы
 */
export function generateHomeMetadata(): Metadata {
  return {
    title: 'Главная',
    description: 'Доставка свежих цветов и букетов по Москве за 2 часа. Гарантия свежести 7 дней. Бесплатная доставка от 3000₽.',
    alternates: {
      canonical: generateCanonicalUrl('/'),
    },
    openGraph: {
      title: `${SITE_NAME} — Доставка цветов в Москве`,
      description: 'Свежие цветы с доставкой за 2 часа. Гарантия свежести 7 дней.',
      url: SITE_URL,
      images: [
        {
          url: DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: 'Цветочный магазин',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} — Доставка цветов в Москве`,
      description: 'Свежие цветы с доставкой за 2 часа. Гарантия свежести 7 дней.',
      images: [DEFAULT_IMAGE],
    },
  };
}

/**
 * Генерация метаданных для каталога
 */
export function generateCatalogMetadata(
  category?: Category,
  totalProducts?: number
): Metadata {
  const title = category
    ? `${category.name} — Каталог`
    : 'Каталог товаров';

  const description = category
    ? `${category.name}: ${totalProducts || 'Много'} товаров в наличии. Доставка по Москве за 2 часа.`
    : `Каталог цветов и букетов. ${totalProducts || 'Большой'} выбор товаров. Доставка по Москве за 2 часа.`;

  const catalogUrl = category
    ? `/catalog?category=${category.slug}`
    : '/catalog';

  return {
    title,
    description,
    alternates: {
      canonical: generateCanonicalUrl(catalogUrl),
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: category
        ? `${SITE_URL}/catalog?category=${category.slug}`
        : `${SITE_URL}/catalog`,
      images: [
        {
          url: category?.image_url || DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: category?.name || 'Каталог',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [category?.image_url || DEFAULT_IMAGE],
    },
  };
}

/**
 * Генерация метаданных для страницы товара
 */
export function generateProductMetadata(product: Product): Metadata {
  // Обрезаем описание до 160 символов для meta description
  const truncatedDescription = product.description?.length > 160
    ? `${product.description.slice(0, 157)}...`
    : product.description;

  const price = product.price.toLocaleString('ru-RU');
  const availability = product.stock > 0 ? 'В наличии' : 'Нет в наличии';

  return {
    title: `${product.name} — купить в Москве`,
    description: truncatedDescription || `${product.name}. Цена: ${price}₽. ${availability}. Доставка по Москве за 2 часа.`,
    keywords: [
      product.name,
      ...(product.flower_types || []),
      ...(product.colors || []),
      'купить',
      'доставка',
      'москва',
    ],
    alternates: {
      canonical: generateCanonicalUrl(`/product/${product.id}`),
    },
    openGraph: {
      title: `${product.name} | ${SITE_NAME}`,
      description: truncatedDescription || product.name,
      url: `${SITE_URL}/product/${product.id}`,
      images: [
        {
          url: product.main_image || product.images?.[0] || DEFAULT_IMAGE,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ${SITE_NAME}`,
      description: truncatedDescription || product.name,
      images: [product.main_image || product.images?.[0] || DEFAULT_IMAGE],
    },
  };
}

/**
 * Генерация метаданных для динамических страниц контента
 */
export function generatePageMetadata(page: {
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  cover_image?: string;
  slug: string;
}): Metadata {
  const title = page.meta_title || page.title;
  const description = page.meta_description || page.content.replace(/<[^>]*>/g, '').slice(0, 160);

  return {
    title,
    description,
    alternates: {
      canonical: generateCanonicalUrl(`/${page.slug}`),
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/${page.slug}`,
      images: page.cover_image
        ? [
            {
              url: page.cover_image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [
            {
              url: DEFAULT_IMAGE,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [page.cover_image || DEFAULT_IMAGE],
    },
  };
}

/**
 * Генерация метаданных для блога/статьи
 */
export function generateBlogPostMetadata(post: {
  title: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  slug: string;
  author?: string;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
}): Metadata {
  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || post.content.replace(/<[^>]*>/g, '').slice(0, 160);

  return {
    title,
    description,
    authors: post.author ? [{ name: post.author }] : undefined,
    alternates: {
      canonical: generateCanonicalUrl(`/blog/${post.slug}`),
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/blog/${post.slug}`,
      images: post.cover_image
        ? [
            {
              url: post.cover_image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
      type: 'article',
      publishedTime: post.published_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

/**
 * Обрезка текста до определенной длины
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Генерация canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
