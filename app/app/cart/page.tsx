"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { QuantitySelector } from "@/components/QuantitySelector";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    itemsCount,
    subtotal,
    discount,
    deliveryFee,
    total,
    promoCode,
    applyPromoCode,
    removePromoCode
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) {
      setPromoError("Введите промокод");
      return;
    }

    setPromoLoading(true);
    setPromoError("");

    const result = await applyPromoCode(promoInput.trim().toUpperCase());

    setPromoLoading(false);

    if (!result.valid) {
      setPromoError(result.error || "Неверный промокод");
    } else {
      setPromoInput("");
    }
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setPromoError("");
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl sm:text-8xl mb-4">🛒</div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Корзина пуста</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Добавьте товары из каталога</p>
          <Button href="/catalog" size="lg" className="w-full sm:w-auto">
            Перейти в каталог
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">Корзина</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="bg-white rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Link href={`/product/${item.product.id}`} className="shrink-0 mx-auto sm:mx-0">
                  <div className="relative w-full h-48 sm:w-32 sm:h-32 rounded-lg overflow-hidden">
                    <Image
                      src={item.product.main_image}
                      alt={item.product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 128px"
                      className="object-cover hover:opacity-80 transition"
                    />
                  </div>
                </Link>
                <div className="flex-1 flex flex-col">
                  <Link href={`/product/${item.product.id}`}>
                    <h3 className="font-bold text-base sm:text-lg mb-2 hover:text-pink-600 transition">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-xl sm:text-2xl font-bold text-pink-600 mb-3 sm:mb-4">
                    {item.product.price.toLocaleString()} ₽
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-auto">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(value) => updateQuantity(item.product.id, value)}
                      min={1}
                      max={item.product.stock}
                      size="sm"
                    />
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-gray-400 hover:text-red-600 transition text-sm sm:text-base min-h-[44px] flex items-center justify-center sm:justify-start touch-manipulation"
                    >
                      Удалить
                    </button>
                  </div>
                  {item.quantity >= item.product.stock && (
                    <p className="text-sm text-orange-600 mt-2">
                      Максимальное количество: {item.product.stock} шт.
                    </p>
                  )}
                </div>
                <div className="text-right sm:text-right shrink-0 sm:ml-4">
                  <p className="text-lg sm:text-xl font-bold">
                    {(item.product.price * item.quantity).toLocaleString()} ₽
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg p-4 sm:p-6 lg:sticky lg:top-24">
              <h3 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6">Итого</h3>

              <div className="space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Товары ({itemsCount})</span>
                  <span className="font-semibold">{subtotal.toLocaleString()} ₽</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 text-sm sm:text-base">
                    <span>Скидка {promoCode && `(${promoCode})`}</span>
                    <span className="font-semibold">−{discount.toLocaleString()} ₽</span>
                  </div>
                )}
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Доставка</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? "Бесплатно" : `${deliveryFee.toLocaleString()} ₽`}
                  </span>
                </div>
                {subtotal < 3000 && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    Бесплатная доставка от 3000₽<br />
                    Осталось: {(3000 - subtotal).toLocaleString()} ₽
                  </p>
                )}
              </div>

              <hr className="my-4 sm:my-6" />

              <div className="flex justify-between text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                <span>Итого:</span>
                <span className="text-pink-600">{total.toLocaleString()} ₽</span>
              </div>

              {/* Promo Code */}
              <div className="mb-4 sm:mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Промокод"
                    className="flex-1 px-4 py-3 min-h-[48px] text-base sm:text-sm border rounded-lg"
                    disabled={!!promoCode}
                  />
                  <button
                    onClick={promoCode ? handleRemovePromo : handleApplyPromo}
                    disabled={promoLoading}
                    className={`px-4 py-3 min-h-[48px] min-w-[56px] rounded-lg font-semibold transition touch-manipulation ${
                      promoCode
                        ? "bg-gray-200 hover:bg-gray-300"
                        : "bg-pink-600 text-white hover:bg-pink-700"
                    } disabled:opacity-50`}
                  >
                    {promoLoading ? "..." : promoCode ? "✕" : "OK"}
                  </button>
                </div>
                {promoError && (
                  <p className="text-xs sm:text-sm text-red-600 mt-2">{promoError}</p>
                )}
                {promoCode && (
                  <p className="text-xs sm:text-sm text-green-600 mt-2">✓ Промокод применён!</p>
                )}
                {!promoCode && !promoError && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">Попробуйте: FLOWERS10, WELCOME2024</p>
                )}
              </div>

              <Button href="/checkout" className="w-full mb-3 sm:mb-4" size="lg">
                Оформить заказ
              </Button>

              <Link href="/catalog" className="block text-center text-sm sm:text-base text-pink-600 hover:underline min-h-[44px] flex items-center justify-center">
                Продолжить покупки
              </Link>

              {/* Security Badges */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t space-y-2 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>Безопасная оплата</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Гарантия свежести</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>↩</span>
                  <span>Возврат в течение 24ч</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
