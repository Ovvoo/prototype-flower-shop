/**
 * ProductPageClient Component
 * Клиентская часть страницы товара с интерактивной логикой
 */

'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useProduct } from "@/lib/hooks";
import { useCart } from "@/contexts/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { QuantitySelector } from "@/components/QuantitySelector";
import { PriceDisplay } from "@/components/PriceDisplay";
import { ProductDetailSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { RatingSummary } from "@/components/review/RatingSummary";
import { ReviewList } from "@/components/review/ReviewList";
import { ReviewForm } from "@/components/review/ReviewForm";
import { reviewsApi } from "@/lib/api/reviews";
import { apiClient } from "@/lib/api";
import type { Review } from "@/lib/types/review";

export function ProductPageClient({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsTotalPages, setReviewsTotalPages] = useState(1);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  });

  // Загрузка данных товара
  const { data: productData, loading, error } = useProduct(parseInt(productId));

  // Проверка авторизации
  const isAuthenticated = apiClient.getToken() !== null;

  // Загрузка отзывов
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await reviewsApi.getReviews({
          product_id: parseInt(productId),
          page: reviewsPage
        });

        setReviews(response.data);
        setReviewsTotal(response.total);
        setReviewsTotalPages(response.last_page);

        // Вычисляем средний рейтинг и распределение
        if (response.meta) {
          setAverageRating(response.meta.average_rating || 0);
          setRatingDistribution(response.meta.rating_distribution || {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
          });
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [productId, reviewsPage]);

  const handleAddToCart = () => {
    if (productData?.product) {
      addItem(productData.product, quantity);
      // Можно добавить toast уведомление
    }
  };

  const handleSubmitReview = async (data: { rating: number; title: string; comment: string; images: string[] }) => {
    await reviewsApi.createReview({
      product_id: parseInt(productId),
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      images: data.images
    });

    // Перезагрузить отзывы
    setReviewsPage(1);
  };

  const handleVoteReview = async (reviewId: number, helpful: boolean) => {
    try {
      if (helpful) {
        await reviewsApi.markHelpful(reviewId);
      } else {
        await reviewsApi.markUnhelpful(reviewId);
      }
    } catch (err) {
      console.error('Failed to vote review:', err);
    }
  };

  const handleAuthRequired = () => {
    alert('Для написания отзыва необходимо войти в аккаунт');
    // TODO: Открыть модальное окно авторизации
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 sm:py-12">
          <ProductDetailSkeleton />
        </div>
      </main>
    );
  }

  // Error state
  if (error || !productData) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 sm:py-12">
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center">
            <div className="text-5xl sm:text-6xl mb-4">😔</div>
            <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Товар не найден</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6">Возможно, товар был удален или перемещен</p>
            <Button href="/catalog" size="lg">
              Вернуться в каталог
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const { product, related_products } = productData;
  const images = product.images || [product.main_image];

  return (
    <div className="container mx-auto px-4 py-6 sm:py-12">
      {/* Breadcrumbs */}
      <div className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-pink-600">Главная</Link>
        <span className="mx-1 sm:mx-2">/</span>
        <Link href="/catalog" className="hover:text-pink-600">Каталог</Link>
        {product.category && (
          <>
            <span className="mx-1 sm:mx-2">/</span>
            <Link href={`/catalog?category=${product.category.id}`} className="hover:text-pink-600">
              {product.category.name}
            </Link>
          </>
        )}
        <span className="mx-1 sm:mx-2">/</span>
        <span className="truncate inline-block max-w-[120px] sm:max-w-none">{product.name}</span>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Images Gallery */}
          <div>
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-200 rounded-xl overflow-hidden mb-3 sm:mb-4">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
                quality={90}
              />
              {product.discount_percent && (
                <span className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold z-10">
                  Скидка -{product.discount_percent}%
                </span>
              )}
              {product.is_new && (
                <span className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-pink-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold z-10">
                  Новинка
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-2 shrink-0 relative touch-manipulation ${
                      selectedImage === idx ? "border-pink-600" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">{product.name}</h1>

            {product.average_rating !== undefined && product.reviews_count !== undefined && (
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="flex text-yellow-400 text-base sm:text-lg">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>{i < Math.round(product.average_rating) ? '★' : '☆'}</span>
                  ))}
                </div>
                <span className="text-sm sm:text-base text-gray-600">({product.reviews_count} отзывов)</span>
              </div>
            )}

            <div className="mb-4 sm:mb-6">
              <PriceDisplay
                price={product.price}
                compareAtPrice={product.compare_at_price}
                size="lg"
              />
            </div>

            <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 whitespace-pre-line">{product.description}</p>

            {/* Composition */}
            {(product.flower_types?.length || product.colors?.length || product.height) && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-bold mb-2">Характеристики:</h3>

                {product.flower_types && product.flower_types.length > 0 && (
                  <div className="mb-2">
                    <span className="font-semibold">Состав: </span>
                    <span className="text-gray-700">{product.flower_types.join(', ')}</span>
                  </div>
                )}

                {product.colors && product.colors.length > 0 && (
                  <div className="mb-2">
                    <span className="font-semibold">Цвета: </span>
                    <span className="text-gray-700">{product.colors.join(', ')}</span>
                  </div>
                )}

                {product.height && (
                  <div className="mb-2">
                    <span className="font-semibold">Высота: </span>
                    <span className="text-gray-700">{product.height} см</span>
                  </div>
                )}

                {product.weight && (
                  <div>
                    <span className="font-semibold">Вес: </span>
                    <span className="text-gray-700">{product.weight} г</span>
                  </div>
                )}
              </div>
            )}

            {/* Stock status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold">✓ В наличии ({product.stock} шт.)</span>
              ) : (
                <span className="text-red-600 font-semibold">Нет в наличии</span>
              )}
            </div>

            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={product.stock}
                size="md"
              />
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1"
                size="lg"
              >
                {product.stock === 0 ? 'Нет в наличии' : 'Добавить в корзину'}
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-base sm:text-lg">🚚</span>
                <span>Доставка сегодня при заказе до 18:00</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-base sm:text-lg">✓</span>
                <span>Гарантия свежести 7 дней</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-base sm:text-lg">💳</span>
                <span>Оплата онлайн или при получении</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-8 sm:mb-12">
        {!reviewsLoading && (
          <>
            {/* Rating Summary */}
            {reviewsTotal > 0 && (
              <RatingSummary
                averageRating={averageRating}
                totalReviews={reviewsTotal}
                ratingDistribution={ratingDistribution}
              />
            )}

            {/* Review Form */}
            <ReviewForm
              productId={parseInt(productId)}
              onSubmit={handleSubmitReview}
              isAuthenticated={isAuthenticated}
              onAuthRequired={handleAuthRequired}
            />

            {/* Reviews List */}
            <ReviewList
              reviews={reviews}
              totalReviews={reviewsTotal}
              currentPage={reviewsPage}
              totalPages={reviewsTotalPages}
              onPageChange={setReviewsPage}
              onVote={handleVoteReview}
            />
          </>
        )}

        {reviewsLoading && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">Загрузка отзывов...</p>
          </div>
        )}
      </div>

      {/* Related Products */}
      {related_products && related_products.length > 0 && (
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Похожие товары</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {related_products.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onAddToCart={(p) => addItem(p, 1)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
