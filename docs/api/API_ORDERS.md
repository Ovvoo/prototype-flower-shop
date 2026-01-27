# 📦 Orders API

Создание, получение и отслеживание заказов.

---

## **orders.create** — Создать заказ

Создать новый заказ из корзины.

### Запрос

```typescript
{
  // Контакт
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Доставка
  deliveryAddress: {
    city: string;
    street: string;
    house: string;
    apartment?: string;
    entrance?: string;
    floor?: string;
    intercom?: string;
  };
  deliveryDate: string; // ISO date
  deliveryTime: '9-12' | '12-15' | '15-18' | '18-21';
  deliveryComment?: string;

  // Получатель (если отличается от заказчика)
  recipientName?: string;
  recipientPhone?: string;

  // Дополнительно
  greetingCardText?: string;
  giftWrap?: 'standard' | 'premium';

  // Оплата
  paymentMethod: 'online' | 'cash_on_delivery';

  // Промокод
  promoCode?: string;
}
```

### Ответ

```typescript
{
  order: {
    id: string;
    orderNumber: string; // #12345
    totalAmount: number;
    status: 'NEW';
    paymentStatus: 'PENDING' | 'PAID';
    paymentUrl?: string; // Если paymentMethod = 'online'
  };
}
```

### Процесс обработки

1. Валидация данных (Zod схемы)
2. Применение промокода (если есть)
3. Расчёт доставки
4. Создание заказа в БД
5. Если online → создание платежа в ЮKassa
6. Отправка SMS/Email подтверждения

### Пример использования

```typescript
const createOrder = trpc.orders.create.useMutation({
  onSuccess: (data) => {
    if (data.order.paymentUrl) {
      // Перенаправить на оплату
      window.location.href = data.order.paymentUrl;
    } else {
      // Заказ создан, но оплата наличными
      navigate(`/orders/${data.order.id}`);
    }
  },
  onError: (error) => {
    toast.error(error.message);
  },
});

const handleSubmitOrder = (formData) => {
  createOrder.mutate({
    customerName: formData.name,
    customerEmail: formData.email,
    customerPhone: formData.phone,
    deliveryAddress: formData.address,
    deliveryDate: formData.deliveryDate,
    deliveryTime: formData.deliveryTime,
    paymentMethod: formData.paymentMethod,
    promoCode: formData.promoCode,
  });
};
```

---

## **orders.getById** — Получить заказ

Получить детальную информацию о конкретном заказе.

### Запрос

```typescript
{
  orderId: string;
}
```

### Ответ

```typescript
{
  id: string;
  orderNumber: string;

  // Суммы
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;

  // Статусы
  status: OrderStatus;
  paymentStatus: PaymentStatus;

  // Контакт
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Доставка
  deliveryAddress: Address;
  deliveryDate: string;
  deliveryTime: string;

  // Товары
  items: OrderItem[];

  // История
  history: OrderHistoryItem[];

  createdAt: string;
}
```

---

## **orders.list** — Список заказов (для клиента)

Получить список заказов текущего пользователя.

### Запрос

```typescript
{
  page?: number;
  limit?: number;
  status?: OrderStatus;
}
```

### Ответ

```typescript
{
  items: Order[];
  total: number;
  page: number;
  pages: number;
}
```

### Пример использования

```typescript
const { data: orders, isLoading } = trpc.orders.list.useQuery({
  page: 1,
  status: 'DELIVERED',
});

return (
  <div>
    {orders.items.map((order) => (
      <Link key={order.id} href={`/orders/${order.id}`}>
        <div>
          <span>{order.orderNumber}</span>
          <span>{order.totalAmount}₽</span>
          <span>{order.status}</span>
        </div>
      </Link>
    ))}
  </div>
);
```

---

## **orders.trackStatus** — Отследить статус

Получить информацию о статусе заказа с временной шкалой.

### Запрос

```typescript
{
  orderNumber: string; // #12345
}
```

### Ответ

```typescript
{
  orderNumber: string;
  status: OrderStatus;
  statusLabel: string; // "Заказ собирается"
  estimatedDelivery: string; // "Сегодня, 15:00-18:00"
  timeline: {
    step: string;
    label: string;
    completedAt?: string;
    isActive: boolean;
  }[];
}

// Пример timeline:
[
  { step: 'NEW', label: 'Заказ получен', completedAt: '2026-01-27T10:00:00Z', isActive: false },
  { step: 'CONFIRMED', label: 'Подтверждён', completedAt: '2026-01-27T10:30:00Z', isActive: false },
  { step: 'PROCESSING', label: 'Собирается', completedAt: null, isActive: true },
  { step: 'SHIPPED', label: 'В доставке', completedAt: null, isActive: false },
  { step: 'DELIVERED', label: 'Доставлен', completedAt: null, isActive: false },
]
```

### Пример использования

```typescript
const trackOrder = trpc.orders.trackStatus.useQuery(
  { orderNumber: '#12345' },
  { enabled: !!orderNumber }
);

return (
  <div>
    <h2>{trackOrder.data?.statusLabel}</h2>
    <p>Примерно: {trackOrder.data?.estimatedDelivery}</p>

    <div className="timeline">
      {trackOrder.data?.timeline.map((step) => (
        <div key={step.step} className={step.isActive ? 'active' : ''}>
          <div className="dot" />
          <span>{step.label}</span>
          {step.completedAt && <time>{formatDate(step.completedAt)}</time>}
        </div>
      ))}
    </div>
  </div>
);
```

---

**Статус**: ✅ Готова к имплементации
**Версия**: 1.0
