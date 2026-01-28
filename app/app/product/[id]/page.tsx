/**
 * Product Page
 * Страница товара с SEO метаданными
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchProduct } from '@/lib/utils/serverFetch';
import { generateProductMetadata } from '@/lib/utils/metadata';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/utils/structuredData';
import { StructuredData } from '@/components/StructuredData';
import { ProductPageClient } from '@/components/product/ProductPageClient';

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Генерация метаданных для страницы товара
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const productData = await fetchProduct(id);

  if (!productData?.product) {
    return {
      title: 'Товар не найден',
    };
  }

  return generateProductMetadata(productData.product);
}

/**
 * Страница товара (серверный компонент)
 */
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const productData = await fetchProduct(id);

  if (!productData?.product) {
    notFound();
  }

  const { product } = productData;

  // Structured data для товара
  const breadcrumbItems = [
    { name: 'Главная', url: '/' },
    { name: 'Каталог', url: '/catalog' },
  ];

  if (product.category) {
    breadcrumbItems.push({
      name: product.category.name,
      url: `/catalog?category=${product.category.id}`,
    });
  }

  breadcrumbItems.push({
    name: product.name,
    url: `/product/${product.id}`,
  });

  const structuredData = [
    generateProductSchema(product),
    generateBreadcrumbSchema(breadcrumbItems),
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <main className="min-h-screen bg-gray-50">
        <ProductPageClient productId={id} />
      </main>
    </>
  );
}
