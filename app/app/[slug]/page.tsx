/**
 * Dynamic Content Page
 * Динамические страницы контента (О компании, Доставка, Контакты и т.д.)
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { generateBreadcrumbSchema } from '@/lib/utils/structuredData';
import { StructuredData } from '@/components/StructuredData';

import { isDemoMode, getMockResponse } from '@/lib/mock/handler';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  cover_image: string | null;
}

async function fetchPage(slug: string): Promise<Page | null> {
  if (isDemoMode()) {
    const mock = getMockResponse(`/pages/${slug}`) as { data: Page } | null;
    return mock?.data || null;
  }

  try {
    const response = await fetch(`${API_URL}/pages/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch page:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchPage(slug);

  if (!page) {
    return {
      title: 'Страница не найдена',
    };
  }

  return generatePageMetadata({
    ...page,
    meta_title: page.meta_title ?? undefined,
    meta_description: page.meta_description ?? undefined,
    cover_image: page.cover_image ?? undefined,
  });
}

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await fetchPage(slug);

  if (!page) {
    notFound();
  }

  // Breadcrumbs structured data
  const breadcrumbItems = [
    { name: 'Главная', url: '/' },
    { name: page.title, url: `/${page.slug}` },
  ];

  const structuredData = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      <StructuredData data={structuredData} />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 sm:py-12">
          {/* Breadcrumbs */}
          <div className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8">
            <Link href="/" className="hover:text-pink-600">
              Главная
            </Link>
            <span className="mx-1 sm:mx-2">/</span>
            <span>{page.title}</span>
          </div>

          {/* Page Content */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-12">
            {/* Cover Image */}
            {page.cover_image && (
              <div className="mb-6 sm:mb-8">
                <img
                  src={page.cover_image}
                  alt={page.title}
                  className="w-full h-64 sm:h-96 object-cover rounded-xl"
                />
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">
              {page.title}
            </h1>

            {/* HTML Content */}
            <div
              className="prose prose-pink max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-700 prose-p:mb-4 prose-p:leading-relaxed
                prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                prose-li:mb-2 prose-li:text-gray-700
                prose-strong:text-gray-900 prose-strong:font-semibold
                sm:prose-lg"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
