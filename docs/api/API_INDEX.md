# 🔌 API Спецификация — Оглавление

Проект использует **tRPC** для type-safe API. Все эндпоинты автоматически типизированы между клиентом и сервером.

**Базовый URL**: `/api/trpc`

---

## 🔐 Аутентификация

### NextAuth.js сессии

```typescript
// Получение текущего пользователя
const { data: session } = useSession();

// session.user содержит:
{
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'CUSTOMER';
}
```

### Защищённые эндпоинты

Требуют авторизации через NextAuth.js middleware:
- `/api/trpc/orders.*` — управление заказами
- `/api/trpc/admin.*` — админские операции
- `/api/trpc/user.*` — данные пользователя

---

## 📚 Документация по группам

| Раздел | Описание |
|--------|----------|
| @docs/api/API_PRODUCTS.md | Получение товаров, фильтрация, поиск |
| @docs/api/API_CART.md | Управление корзиной |
| @docs/api/API_ORDERS.md | Создание и отслеживание заказов |
| @docs/api/API_USER.md | Аутентификация, профиль, адреса |
| @docs/api/API_REVIEWS.md | Отзывы и рейтинги |
| @docs/api/API_PROMO.md | Валидация промокодов |
| @docs/api/API_ADMIN.md | Аналитика и управление товарами/заказами |
| @docs/api/API_WEBHOOKS.md | Webhooks платежных систем |

---

## 🔒 Rate Limiting

### Лимиты по эндпоинтам

| Эндпоинт | Лимит | Период |
|----------|-------|--------|
| `user.register` | 5 попыток | 15 минут |
| `user.login` | 5 попыток | 15 минут |
| `orders.create` | 10 заказов | 1 час |
| `reviews.create` | 5 отзывов | 1 день |
| Остальные | 100 запросов | 1 минута |

### Заголовки ответа

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706362800
```

---

## ❌ Обработка ошибок

### Формат ошибки

```typescript
{
  error: {
    code: string; // "VALIDATION_ERROR", "NOT_FOUND", "UNAUTHORIZED"
    message: string; // Человеко-читаемое сообщение
    details?: any; // Дополнительные детали (например, Zod ошибки)
  };
}
```

### HTTP статусы

- `200` — Успех
- `400` — Ошибка валидации
- `401` — Не авторизован
- `403` — Доступ запрещён
- `404` — Не найдено
- `429` — Превышен rate limit
- `500` — Внутренняя ошибка сервера

---

## 🧪 Базовый пример использования (tRPC)

### Клиентская часть (React)

```typescript
import { trpc } from '@/lib/trpc';

function ProductList() {
  // Query
  const { data, isLoading, error } = trpc.products.list.useQuery({
    categoryId: 'cat_bouquets',
    page: 1,
    limit: 24,
  });

  // Mutation
  const addToCart = trpc.cart.add.useMutation({
    onSuccess: () => {
      toast.success('Добавлено в корзину');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAddToCart = (productId: string) => {
    addToCart.mutate({ productId, quantity: 1 });
  };

  if (isLoading) return <Skeleton />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      {data.items.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => handleAddToCart(product.id)}
        />
      ))}
    </div>
  );
}
```

### Серверная часть (tRPC Router)

```typescript
import { router, publicProcedure } from '@/server/trpc';
import * as z from 'zod';

export const productsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        priceFrom: z.number().optional(),
        priceTo: z.number().optional(),
        page: z.number().default(1),
        limit: z.number().default(24),
      })
    )
    .query(async ({ input, ctx }) => {
      const { categoryId, priceFrom, priceTo, page, limit } = input;

      const where = {
        ...(categoryId && { categoryId }),
        ...(priceFrom && { price: { gte: priceFrom } }),
        ...(priceTo && { price: { lte: priceTo } }),
        isActive: true,
      };

      const [items, total] = await Promise.all([
        ctx.prisma.product.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            category: true,
          },
        }),
        ctx.prisma.product.count({ where }),
      ]);

      return {
        items,
        total,
        page,
        pages: Math.ceil(total / limit),
      };
    }),
});
```

---

**Статус**: ✅ Готова к имплементации
**Версия**: 1.0
**Последнее обновление**: Январь 2026
