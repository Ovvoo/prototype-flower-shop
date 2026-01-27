/**
 * Home Page
 * Главная страница с SEO метаданными
 */

import type { Metadata } from 'next';
import { generateHomeMetadata } from '@/lib/utils/metadata';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/lib/utils/structuredData';
import { StructuredData } from '@/components/StructuredData';
import { HomeClient } from '@/components/home/HomeClient';

// Генерация метаданных
export const metadata: Metadata = generateHomeMetadata();

export default function HomePage() {
  // Structured data для главной страницы
  const structuredData = [
    generateOrganizationSchema(),
    generateWebSiteSchema(),
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <main>
        <HomeClient />
      </main>
    </>
  );
}
