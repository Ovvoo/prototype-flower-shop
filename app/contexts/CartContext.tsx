/**
 * Cart Context
 * Переиспользуемый контекст для управления корзиной
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ValidatePromoCodeResponse, CartItem } from '@/lib/types';
import { promoApi } from '@/lib/api';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemsCount: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  promoCode: string | null;
  applyPromoCode: (code: string) => Promise<ValidatePromoCodeResponse>;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'flower-shop-cart';
const PROMO_STORAGE_KEY = 'flower-shop-promo';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  // Загрузить корзину из localStorage при монтировании
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    const savedPromo = localStorage.getItem(PROMO_STORAGE_KEY);

    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
      }
    }

    if (savedPromo) {
      try {
        const promo = JSON.parse(savedPromo);
        setPromoCode(promo.code);
        setDiscount(promo.discount);
      } catch (error) {
        console.error('Ошибка загрузки промокода:', error);
      }
    }
  }, []);

  // Вычисляемые значения (moved before useEffects to avoid hoisting issues)
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const deliveryFee = subtotal >= 3000 ? 0 : 500;

  const total = subtotal - discount + deliveryFee;

  // Сохранять корзину в localStorage при изменении
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [items]);

  const addItem = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);

      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { product, quantity }];
    });
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode(null);
    setDiscount(0);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(PROMO_STORAGE_KEY);
  };

  const applyPromoCode = async (code: string): Promise<ValidatePromoCodeResponse> => {
    try {
      const result = await promoApi.validatePromoCode({
        code,
        cart_total: subtotal,
      });

      if (result.valid && result.calculated_discount) {
        setPromoCode(code);
        setDiscount(result.calculated_discount);

        // Сохранить промокод в localStorage
        localStorage.setItem(
          PROMO_STORAGE_KEY,
          JSON.stringify({ code, discount: result.calculated_discount })
        );
      }

      return result;
    } catch (error) {
      return {
        valid: false,
        error: 'Ошибка при проверке промокода',
      };
    }
  };

  const removePromoCode = () => {
    setPromoCode(null);
    setDiscount(0);
    localStorage.removeItem(PROMO_STORAGE_KEY);
  };

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemsCount,
    subtotal,
    discount,
    deliveryFee,
    total,
    promoCode,
    applyPromoCode,
    removePromoCode,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}

// Alias для обратной совместимости
export const useCartContext = useCart;
