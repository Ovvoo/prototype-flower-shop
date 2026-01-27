# 🎟️ Promo Codes API

Валидация и применение промокодов.

---

## **promoCodes.validate** — Валидация промокода

Проверить корректность и применимость промокода к корзине.

### Запрос

```typescript
{
  code: string;
  cartTotal: number; // Сумма корзины (для проверки min_order_amount)
}
```

### Ответ

```typescript
{
  valid: boolean;
  promoCode?: {
    code: string;
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discountValue: number;
    calculatedDiscount: number; // Сколько скидка в рублях
  };
  error?: string; // Если !valid
}

// Примеры ошибок:
"Промокод не найден"
"Промокод истёк"
"Промокод уже использован максимальное количество раз"
"Минимальная сумма заказа для этого промокода: 3000₽"
```

### Пример использования

```typescript
import { trpc } from '@/lib/trpc';
import { useState } from 'react';

function PromoCodeInput() {
  const [code, setCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  const cart = trpc.cart.get.useQuery();

  const validatePromo = trpc.promoCodes.validate.useMutation({
    onSuccess: (result) => {
      if (result.valid && result.promoCode) {
        setAppliedCode(result.promoCode.code);
        setDiscount(result.promoCode.calculatedDiscount);
        toast.success(`Скидка ${result.promoCode.calculatedDiscount}₽ применена`);
        setCode('');
      } else {
        toast.error(result.error || 'Невалидный промокод');
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleApplyPromo = () => {
    if (!code.trim()) return;

    validatePromo.mutate({
      code: code.toUpperCase(),
      cartTotal: cart.data?.cart.subtotal || 0,
    });
  };

  const handleRemovePromo = () => {
    setAppliedCode(null);
    setDiscount(0);
    setCode('');
  };

  if (appliedCode) {
    return (
      <div className="promo-applied">
        <span className="badge">{appliedCode}</span>
        <span className="discount">-{discount}₽</span>
        <Button size="sm" variant="ghost" onClick={handleRemovePromo}>
          ✕
        </Button>
      </div>
    );
  }

  return (
    <div className="promo-input">
      <Input
        placeholder="Введите промокод"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
      />
      <Button
        onClick={handleApplyPromo}
        disabled={validatePromo.isPending || !code.trim()}
      >
        Применить
      </Button>
    </div>
  );
}
```

---

### Типичные типы промокодов

**Процент на все товары:**
```
Code: SALE2026
Скидка: 20%
Применяется к: Все товары
Действителен: 2026-01-01 до 2026-12-31
```

**Фиксированная сумма при минимальном заказе:**
```
Code: WELCOME
Скидка: 500₽
Минимальная сумма: 3000₽
Применяется к: Все товары
```

**Скидка на категорию:**
```
Code: FLOWERS15
Скидка: 15%
Применяется к: Только букеты
```

---

### Интеграция с checkout

```typescript
function CheckoutForm() {
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const createOrder = trpc.orders.create.useMutation();

  const handleSubmitOrder = async (formData) => {
    createOrder.mutate({
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      deliveryAddress: formData.address,
      deliveryDate: formData.deliveryDate,
      deliveryTime: formData.deliveryTime,
      paymentMethod: formData.paymentMethod,
      promoCode: promoCode || undefined,
    });
  };

  return (
    <div>
      <PromoCodeInput
        onApply={(code, discount) => {
          setPromoCode(code);
          setDiscountAmount(discount);
        }}
      />

      <OrderSummary
        subtotal={cart.subtotal}
        discount={discountAmount}
        deliveryFee={deliveryFee}
        total={cart.subtotal - discountAmount + deliveryFee}
      />

      <form onSubmit={handleSubmitOrder}>
        {/* Форма заказа */}
      </form>
    </div>
  );
}
```

---

**Статус**: ✅ Готова к имплементации
**Версия**: 1.0
