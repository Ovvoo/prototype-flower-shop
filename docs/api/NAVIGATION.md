# API Navigation Map

## 🗺️ Быстрая навигация

### 🟢 Начи́наешь работу?
1. Прочитай [@API_INDEX.md](API_INDEX.md) — обзор tRPC, аутентификация, ошибки
2. Выбери раздел API нужный для задачи

---

## 🏗️ API Endpoints по категориям

### 📦 **Products** — Каталог товаров
**Файл:** [@API_PRODUCTS.md](API_PRODUCTS.md)

```
GET  products.list          → Список с фильтрацией и пагинацией
GET  products.getById       → Детали товара + похожие товары
POST products.incrementViews → Увеличить счётчик просмотров
```

---

### 🛒 **Cart** — Корзина покупателя
**Файл:** [@API_CART.md](API_CART.md)

```
POST cart.add       → Добавить товар
PUT  cart.update    → Изменить количество / удалить
GET  cart.get       → Получить корзину
POST cart.clear     → Очистить корзину
```

---

### 📦 **Orders** — Заказы
**Файл:** [@API_ORDERS.md](API_ORDERS.md)

```
POST orders.create      → Создать заказ из корзины
GET  orders.getById     → Детали заказа
GET  orders.list        → Мои заказы (для клиента)
GET  orders.trackStatus → Отследить статус доставки
```

---

### 🔑 **User** — Аутентификация и профиль
**Файл:** [@API_USER.md](API_USER.md)

**Пользователь:**
```
POST user.register        → Регистрация
POST user.login          → Вход (NextAuth)
GET  user.getProfile     → Мой профиль
PUT  user.updateProfile  → Обновить профиль
POST user.changePassword → Сменить пароль
```

**Адреса доставки:**
```
GET  addresses.list   → Мои адреса
POST addresses.create → Сохранить новый адрес
PUT  addresses.update → Изменить адрес
DEL  addresses.delete → Удалить адрес
```

---

### ⭐ **Reviews** — Отзывы и рейтинги
**Файл:** [@API_REVIEWS.md](API_REVIEWS.md)

```
GET  reviews.list      → Отзывы на товар
POST reviews.create    → Оставить отзыв
POST reviews.markHelpful → Отметить полезным/бесполезным
```

---

### 🎟️ **Promo** — Промокоды
**Файл:** [@API_PROMO.md](API_PROMO.md)

```
POST promoCodes.validate → Проверить и применить промокод
```

---

### 🔐 **Admin** — Администрирование
**Файл:** [@API_ADMIN.md](API_ADMIN.md)

**Аналитика:**
```
GET analytics.dashboard → Выручка, заказы, топ-товары, графики
```

**Управление заказами (админ):**
```
GET  admin.orders.list        → Все заказы
POST admin.orders.updateStatus → Изменить статус, отправить SMS
```

**Управление товарами (админ):**
```
POST admin.products.create → Создать товар
PUT  admin.products.update → Изменить товар
DEL  admin.products.delete → Удалить товар
```

---

### 🌐 **Webhooks** — События и платежи
**Файл:** [@API_WEBHOOKS.md](API_WEBHOOKS.md)

```
POST /api/webhooks/yukassa → Уведомления от ЮKassa о платежах
```

---

## 🎯 Примеры использования по задачам

### Задача: Показать каталог товаров

```typescript
// 1. Читай: @API_PRODUCTS.md → products.list
// 2. Использование в React:
const { data } = trpc.products.list.useQuery({
  categoryId: 'cat_bouquets',
  priceFrom: 1000,
  sortBy: 'popularity',
  page: 1,
});
```

### Задача: Добавить товар в корзину

```typescript
// 1. Читай: @API_CART.md → cart.add
// 2. Использование:
const addToCart = trpc.cart.add.useMutation();
addToCart.mutate({ productId: 'prod_123', quantity: 1 });
```

### Задача: Оформить заказ

```typescript
// 1. Читай: @API_ORDERS.md → orders.create
// 2. Заполнить форму доставки
// 3. Использование:
const createOrder = trpc.orders.create.useMutation();
createOrder.mutate({
  customerName: '...',
  customerEmail: '...',
  deliveryAddress: { ... },
  paymentMethod: 'online',
});
```

### Задача: Применить промокод

```typescript
// 1. Читай: @API_PROMO.md → promoCodes.validate
// 2. Использование:
const validatePromo = trpc.promoCodes.validate.useMutation();
validatePromo.mutate({
  code: 'SALE2026',
  cartTotal: 5000,
});
```

### Задача: Показать отзывы товара

```typescript
// 1. Читай: @API_REVIEWS.md → reviews.list
// 2. Использование:
const { data: reviews } = trpc.reviews.list.useQuery({
  productId: 'prod_123',
  page: 1,
});
```

### Задача: Статистика админа

```typescript
// 1. Читай: @API_ADMIN.md → analytics.dashboard
// 2. Использование:
const { data: dashboard } = trpc.analytics.dashboard.useQuery({
  period: 'month',
  compareWith: 'previous_period',
});
```

---

## 📊 Матрица авторизации

| API | Публичный | С логином | ADMIN | MANAGER |
|-----|-----------|-----------|-------|---------|
| products.* | ✅ | ✅ | ✅ | ✅ |
| cart.* | ✅ | ✅ | ✅ | ✅ |
| orders.create | ✅ | ✅ | - | - |
| orders.getById | ✅ | ✅ | ✅ | ✅ |
| orders.list | - | ✅ | ✅ | ✅ |
| user.* | ✅ | ✅ | ✅ | ✅ |
| addresses.* | - | ✅ | ✅ | ✅ |
| reviews.* | ✅ | ✅ | ✅ | ✅ |
| promoCodes.* | ✅ | ✅ | ✅ | ✅ |
| analytics.* | - | - | ✅ | ✅ |
| admin.* | - | - | ✅ | ✅ |
| webhooks.* | ✅ | - | - | - |

---

## 🔗 Ссылки на документацию

- **Backend DB Schema**: @docs/DATABASE_SCHEMA.md
- **Frontend Rules**: @.claude/rules/07-modularity-components.md
- **TypeScript Tips**: @.claude/rules/08-typescript-gotchas.md

---

**Статус**: ✅ Навигация готова
