/**
 * HomeClient Component
 * Клиентская часть главной страницы с интерактивной логикой
 */

'use client';

import Link from "next/link";
import { useFeaturedProducts, useCategories } from "@/lib/hooks";
import { useCart } from "@/contexts/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton, CategoryCardSkeleton } from "@/components/ui/Skeleton";

export function HomeClient() {
  const { data: featuredProducts, loading: productsLoading } = useFeaturedProducts();
  const { data: categories, loading: categoriesLoading } = useCategories();
  const { addItem } = useCart();

  // Показываем только корневые категории с эмодзи
  const categoryEmojis: Record<string, string> = {
    'bukety': '💐',
    'komnatnye-rasteniya': '🌿',
    'podarki': '🎁',
    'svadebnaya-floristika': '💒',
  };

  const displayCategories = categories
    .filter(cat => cat.parent_id === null)
    .map(cat => ({
      ...cat,
      emoji: categoryEmojis[cat.slug] || '🌸',
    }));

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-r from-pink-100 to-purple-100 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Свежие цветы<br />
              <span className="text-pink-600">каждый день</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8">
              Доставка букетов по Москве за 2 часа.<br />
              Гарантия свежести 7 дней.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/catalog" className="bg-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-pink-700 transition text-center min-h-[48px] sm:min-h-[52px] flex items-center justify-center">
                Смотреть каталог
              </Link>
              <a href="#featured" className="bg-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-50 transition text-center min-h-[48px] sm:min-h-[52px] flex items-center justify-center">
                Популярные букеты
              </a>
            </div>
          </div>
        </div>
        {/* Decorative elements - hidden on mobile */}
        <div className="hidden sm:block absolute right-10 top-20 text-6xl lg:text-8xl opacity-20">🌸</div>
        <div className="hidden sm:block absolute right-40 bottom-20 text-4xl lg:text-6xl opacity-20">🌹</div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12">Категории</h2>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <CategoryCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {displayCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/catalog?category=${cat.slug}`}
                  className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 sm:p-8 rounded-2xl hover:shadow-xl transition-all hover:scale-105 min-h-[140px] sm:min-h-[160px] flex flex-col justify-center touch-manipulation"
                >
                  <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">{cat.emoji}</div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{cat.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{cat.products_count || 0} товаров</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-2 sm:mb-4">Популярные букеты</h2>
          <p className="text-sm sm:text-base text-center text-gray-600 mb-8 sm:mb-12">Самые любимые композиции наших клиентов</p>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(p) => addItem(p, 1)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🚚</div>
              <h3 className="font-bold text-lg sm:text-xl mb-2">Быстрая доставка</h3>
              <p className="text-sm sm:text-base text-gray-600">Доставим за 2 часа или к нужному времени</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🌸</div>
              <h3 className="font-bold text-lg sm:text-xl mb-2">Свежие цветы</h3>
              <p className="text-sm sm:text-base text-gray-600">Работаем только с проверенными поставщиками</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">💳</div>
              <h3 className="font-bold text-lg sm:text-xl mb-2">Удобная оплата</h3>
              <p className="text-sm sm:text-base text-gray-600">Онлайн или наличными курьеру</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Подарите радость сегодня!</h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8">Бесплатная доставка при заказе от 3000 ₽</p>
          <Link href="/catalog" className="bg-white text-pink-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-100 transition inline-block min-h-[48px] sm:min-h-[52px] flex items-center justify-center mx-auto max-w-xs touch-manipulation">
            Выбрать букет
          </Link>
        </div>
      </section>
    </>
  );
}
