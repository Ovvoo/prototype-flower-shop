"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useProducts, useCategories, useAvailableFilters } from "@/lib/hooks";
import { useCart } from "@/contexts/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { FilterGroup } from "@/components/catalog/FilterGroup";
import { FiltersSkeleton } from "@/components/catalog/FiltersSkeleton";
import type { ProductFilters } from "@/lib/types";

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Инициализация фильтров из URL параметров
  const [filters, setFilters] = useState<ProductFilters>({
    category_id: searchParams.get('category') ? parseInt(searchParams.get('category')!) : undefined,
    price_from: searchParams.get('price_from') ? parseInt(searchParams.get('price_from')!) : undefined,
    price_to: searchParams.get('price_to') ? parseInt(searchParams.get('price_to')!) : undefined,
    flower_types: searchParams.get('flower_types') ? searchParams.get('flower_types')!.split(',') : undefined,
    colors: searchParams.get('colors') ? searchParams.get('colors')!.split(',') : undefined,
    occasions: searchParams.get('occasions') ? searchParams.get('occasions')!.split(',') : undefined,
    sort_by: (searchParams.get('sort') as ProductFilters['sort_by']) || 'popularity',
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    per_page: 24,
  });

  // Загрузка товаров и категорий
  const { data: productsData, loading: productsLoading, error: productsError } = useProducts(filters);
  const { data: categories, loading: categoriesLoading } = useCategories();
  const { data: availableFilters, loading: filtersLoading } = useAvailableFilters();

  // Обновление URL при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category_id) params.set('category', filters.category_id.toString());
    if (filters.price_from) params.set('price_from', filters.price_from.toString());
    if (filters.price_to) params.set('price_to', filters.price_to.toString());
    if (filters.flower_types && filters.flower_types.length > 0) {
      params.set('flower_types', filters.flower_types.join(','));
    }
    if (filters.colors && filters.colors.length > 0) {
      params.set('colors', filters.colors.join(','));
    }
    if (filters.occasions && filters.occasions.length > 0) {
      params.set('occasions', filters.occasions.join(','));
    }
    if (filters.sort_by) params.set('sort', filters.sort_by);
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString());

    const queryString = params.toString();
    router.push(`/catalog${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [filters, router]);

  // Обработчики фильтров
  const handleCategoryChange = (categoryId?: number) => {
    setFilters(prev => ({ ...prev, category_id: categoryId, page: 1 }));
  };

  const handlePriceRangeChange = (priceFrom?: number, priceTo?: number) => {
    setFilters(prev => ({ ...prev, price_from: priceFrom, price_to: priceTo, page: 1 }));
  };

  const handleSortChange = (sortBy: ProductFilters['sort_by']) => {
    setFilters(prev => ({ ...prev, sort_by: sortBy }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFlowerTypesChange = (values: string[]) => {
    setFilters(prev => ({ ...prev, flower_types: values.length > 0 ? values : undefined, page: 1 }));
  };

  const handleColorsChange = (values: string[]) => {
    setFilters(prev => ({ ...prev, colors: values.length > 0 ? values : undefined, page: 1 }));
  };

  const handleOccasionsChange = (values: string[]) => {
    setFilters(prev => ({ ...prev, occasions: values.length > 0 ? values : undefined, page: 1 }));
  };

  // Filters Sidebar Component
  const FiltersSidebar = () => (
    <>
      <h3 className="font-bold mb-4">Категории</h3>

      {categoriesLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryChange(undefined)}
            className={`w-full text-left px-4 py-3 rounded-lg transition min-h-[44px] touch-manipulation ${
              !filters.category_id ? "bg-pink-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            Все товары
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition min-h-[44px] touch-manipulation ${
                filters.category_id === category.id ? "bg-pink-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              {category.name}
              {category.products_count !== undefined && (
                <span className="ml-2 text-sm opacity-70">({category.products_count})</span>
              )}
            </button>
          ))}
        </div>
      )}

      <hr className="my-6" />

      <h3 className="font-bold mb-4">Цена</h3>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer min-h-[44px] py-2 touch-manipulation">
          <input
            type="radio"
            name="price"
            checked={!filters.price_from && !filters.price_to}
            onChange={() => handlePriceRangeChange(undefined, undefined)}
            className="w-4 h-4"
          />
          <span className="text-sm">Любая</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer min-h-[44px] py-2 touch-manipulation">
          <input
            type="radio"
            name="price"
            checked={filters.price_from === 0 && filters.price_to === 2000}
            onChange={() => handlePriceRangeChange(0, 2000)}
            className="w-4 h-4"
          />
          <span className="text-sm">До 2000₽</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer min-h-[44px] py-2 touch-manipulation">
          <input
            type="radio"
            name="price"
            checked={filters.price_from === 2000 && filters.price_to === 5000}
            onChange={() => handlePriceRangeChange(2000, 5000)}
            className="w-4 h-4"
          />
          <span className="text-sm">2000₽ - 5000₽</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer min-h-[44px] py-2 touch-manipulation">
          <input
            type="radio"
            name="price"
            checked={filters.price_from === 5000 && !filters.price_to}
            onChange={() => handlePriceRangeChange(5000, undefined)}
            className="w-4 h-4"
          />
          <span className="text-sm">От 5000₽</span>
        </label>
      </div>

      <hr className="my-6" />

      {/* Расширенные фильтры */}
      {filtersLoading ? (
        <FiltersSkeleton />
      ) : (
        <>
          <FilterGroup
            title="Типы цветов"
            options={availableFilters.flower_types}
            selectedValues={filters.flower_types || []}
            onChange={handleFlowerTypesChange}
            defaultOpen
          />

          <FilterGroup
            title="Цвета"
            options={availableFilters.colors}
            selectedValues={filters.colors || []}
            onChange={handleColorsChange}
          />

          <FilterGroup
            title="Поводы"
            options={availableFilters.occasions}
            selectedValues={filters.occasions || []}
            onChange={handleOccasionsChange}
          />
        </>
      )}

      {/* Reset Filters */}
      {(filters.category_id || filters.price_from || filters.price_to || filters.flower_types?.length || filters.colors?.length || filters.occasions?.length) && (
        <>
          <hr className="my-6" />
          <button
            onClick={() => setFilters({
              ...filters,
              category_id: undefined,
              price_from: undefined,
              price_to: undefined,
              flower_types: undefined,
              colors: undefined,
              occasions: undefined,
              page: 1
            })}
            className="w-full px-4 py-3 min-h-[48px] text-sm text-pink-600 hover:bg-pink-50 rounded-lg transition touch-manipulation"
          >
            Сбросить все фильтры
          </button>
        </>
      )}
    </>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Каталог товаров</h1>

          {/* Mobile Filters Button */}
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 border rounded-lg min-h-[44px] hover:bg-gray-50 transition touch-manipulation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm">Фильтры</span>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <FiltersSidebar />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-sm sm:text-base text-gray-600">
                {productsLoading ? (
                  <span className="inline-block w-32 h-6 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  `Найдено товаров: ${productsData?.meta?.total || productsData?.total || 0}`
                )}
              </p>
              <select
                className="w-full sm:w-auto px-4 py-3 min-h-[48px] text-base sm:text-sm border rounded-lg bg-white cursor-pointer"
                value={filters.sort_by || 'popularity'}
                onChange={(e) => handleSortChange(e.target.value as ProductFilters['sort_by'])}
              >
                <option value="popularity">По популярности</option>
                <option value="price_asc">Цена: низкая → высокая</option>
                <option value="price_desc">Цена: высокая → низкая</option>
                <option value="newest">Новинки</option>
              </select>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : productsError ? (
              <div className="bg-white rounded-lg p-8 sm:p-12 text-center">
                <p className="text-red-600 mb-4">Ошибка загрузки товаров</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 min-h-[48px] bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition touch-manipulation"
                >
                  Попробовать снова
                </button>
              </div>
            ) : productsData?.data.length === 0 ? (
              <div className="bg-white rounded-lg p-8 sm:p-12 text-center">
                <div className="text-5xl sm:text-6xl mb-4">🌸</div>
                <p className="text-gray-600 mb-4">Товары не найдены</p>
                <button
                  onClick={() => setFilters({
                    ...filters,
                    category_id: undefined,
                    price_from: undefined,
                    price_to: undefined,
                    flower_types: undefined,
                    colors: undefined,
                    occasions: undefined,
                    page: 1
                  })}
                  className="px-6 py-3 min-h-[48px] bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition touch-manipulation"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {productsData?.data.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={(p) => addItem(p, 1)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {productsData && (productsData.meta?.last_page || productsData.last_page) > 1 && (
                  <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    <button
                      onClick={() => handlePageChange(Math.max(1, filters.page! - 1))}
                      disabled={filters.page === 1}
                      className="w-full sm:w-auto px-4 py-3 min-h-[48px] border rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                    >
                      ← Назад
                    </button>

                    {/* Desktop: show all pages */}
                    <div className="hidden sm:flex gap-2">
                      {Array.from({ length: Math.min(productsData.meta?.last_page || productsData.last_page, 10) }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 min-w-[44px] min-h-[44px] rounded-lg transition touch-manipulation ${
                            filters.page === page
                              ? 'bg-pink-600 text-white'
                              : 'border hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      {(productsData.meta?.last_page || productsData.last_page) > 10 && <span className="px-2 py-2">...</span>}
                    </div>

                    {/* Mobile: show current page */}
                    <div className="sm:hidden text-gray-600">
                      Страница {filters.page} из {productsData.meta?.last_page || productsData.last_page}
                    </div>

                    <button
                      onClick={() => handlePageChange(Math.min(productsData.meta?.last_page || productsData.last_page, filters.page! + 1))}
                      disabled={filters.page === (productsData.meta?.last_page || productsData.last_page)}
                      className="w-full sm:w-auto px-4 py-3 min-h-[48px] border rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                    >
                      Вперед →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[90vw]
            bg-white shadow-xl overflow-y-auto animate-slide-in-right">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">Фильтры</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center
                  hover:bg-gray-100 rounded-lg transition touch-manipulation"
                aria-label="Закрыть фильтры"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <FiltersSidebar />
            </div>
            <div className="p-6 border-t sticky bottom-0 bg-white">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full bg-pink-600 text-white py-3 rounded-lg min-h-[48px] hover:bg-pink-700 transition touch-manipulation"
              >
                Показать товары
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Wrap with Suspense for useSearchParams
export default function CatalogPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="h-12 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    }>
      <CatalogContent />
    </Suspense>
  );
}
