# 🛒 Cart API

Управление корзиной покупателя (добавление, обновление, удаление товаров).

---

## **cart.add** — Добавить в корзину

Добавить товар в корзину или увеличить количество существующего товара.

### Запрос

```typescript
{
  productId: string;
  quantity: number;
}
```

### Ответ

```typescript
{
  cart: Cart;
}

type Cart = {
  items: CartItem[];
  subtotal: number;
  itemsCount: number;
};

type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  subtotal: number; // product.price * quantity
};
```

### Пример использования

```typescript
const addToCart = trpc.cart.add.useMutation({
  onSuccess: (data) => {
    console.log(`Товаров в корзине: ${data.cart.itemsCount}`);
    toast.success('Добавлено в корзину');
  },
  onError: (error) => {
    toast.error(error.message);
  },
});

const handleAddToCart = (productId: string) => {
  addToCart.mutate({ productId, quantity: 1 });
};
```

---

## **cart.update** — Обновить количество

Изменить количество товара в корзине или удалить его (количество = 0).

### Запрос

```typescript
{
  cartItemId: string;
  quantity: number; // 0 = удалить из корзины
}
```

### Ответ

```typescript
{
  cart: Cart;
}
```

### Пример использования

```typescript
const updateCart = trpc.cart.update.useMutation();

// Увеличить количество
const handleIncrement = (cartItemId: string) => {
  updateCart.mutate({ cartItemId, quantity: quantity + 1 });
};

// Удалить из корзины
const handleRemove = (cartItemId: string) => {
  updateCart.mutate({ cartItemId, quantity: 0 });
};

// С компонентом QuantitySelector
<QuantitySelector
  value={item.quantity}
  onChange={(newQty) => updateCart.mutate({
    cartItemId: item.id,
    quantity: newQty,
  })}
  max={item.product.stock}
/>
```

---

## **cart.get** — Получить корзину

Получить текущее содержимое корзины.

### Запрос

(без параметров)

### Ответ

```typescript
{
  cart: Cart;
}
```

### Пример использования

```typescript
const { data: cart, isLoading } = trpc.cart.get.useQuery();

return (
  <div>
    <h1>Корзина ({cart.itemsCount})</h1>
    {cart.items.map((item) => (
      <div key={item.id}>
        <span>{item.product.name}</span>
        <span>{item.quantity} x {item.product.price}₽</span>
        <span>Итого: {item.subtotal}₽</span>
      </div>
    ))}
    <div className="total">
      Сумма: <strong>{cart.subtotal}₽</strong>
    </div>
  </div>
);
```

---

## **cart.clear** — Очистить корзину

Удалить все товары из корзины.

### Запрос

(без параметров)

### Ответ

```typescript
{
  success: boolean;
}
```

### Пример использования

```typescript
const clearCart = trpc.cart.clear.useMutation({
  onSuccess: () => {
    toast.success('Корзина очищена');
  },
});

<Button
  variant="secondary"
  onClick={() => clearCart.mutate()}
>
  Очистить корзину
</Button>
```

---

**Статус**: ✅ Готова к имплементации
**Версия**: 1.0
