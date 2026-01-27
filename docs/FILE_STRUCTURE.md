# 📁 ФАЙЛОВАЯ СТРУКТУРА ПРОЕКТА

**Проект:** Интернет-магазин цветочного салона
**Стек:** Next.js 16 + Laravel 11 + PostgreSQL 16
**Принципы организации:** Модульность, масштабируемость, чистая архитектура

---

## 🏗️ ОБЩАЯ СТРУКТУРА

```
prototype-flower-shop/
├── app/                    # Next.js 16 Frontend
├── backend/                # Laravel 11 Backend
├── docs/                   # Документация проекта
├── .gitignore
└── README.md
```

---

## 🎨 FRONTEND СТРУКТУРА (Next.js 16)

### Корневая директория `/app`

```
app/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (навигация + footer)
│   ├── page.tsx            # Главная страница
│   ├── globals.css         # Глобальные стили (Tailwind)
│   │
│   ├── catalog/
│   │   └── page.tsx        # Каталог товаров
│   │
│   ├── product/
│   │   └── [id]/
│   │       └── page.tsx    # Карточка товара
│   │
│   ├── cart/
│   │   └── page.tsx        # Корзина
│   │
│   ├── checkout/
│   │   └── page.tsx        # Оформление заказа [TODO]
│   │
│   ├── order/
│   │   └── [orderNumber]/
│   │       └── page.tsx    # Детали заказа [TODO]
│   │
│   ├── profile/
│   │   ├── layout.tsx      # Layout с sidebar [TODO]
│   │   ├── page.tsx        # Профиль [TODO]
│   │   ├── orders/
│   │   │   └── page.tsx    # История заказов [TODO]
│   │   └── addresses/
│   │       └── page.tsx    # Адреса доставки [TODO]
│   │
│   ├── admin/
│   │   ├── layout.tsx      # Admin layout [TODO]
│   │   ├── page.tsx        # Dashboard [TODO]
│   │   ├── orders/
│   │   │   ├── page.tsx    # Список заказов [TODO]
│   │   │   └── [id]/
│   │   │       └── page.tsx # Детали заказа [TODO]
│   │   └── products/
│   │       ├── page.tsx    # Список товаров [TODO]
│   │       ├── new/
│   │       │   └── page.tsx # Создание товара [TODO]
│   │       └── [id]/
│   │           └── page.tsx # Редактирование товара [TODO]
│   │
│   ├── blog/
│   │   ├── page.tsx        # Список новостей [TODO]
│   │   └── [slug]/
│   │       └── page.tsx    # Детали новости [TODO]
│   │
│   └── [slug]/
│       └── page.tsx        # Динамические страницы (about, contacts и т.д.) [TODO]
│
├── components/             # React компоненты
│   ├── Navigation.tsx      # ✅ Главная навигация (header)
│   │
│   ├── auth/               # Авторизация [TODO]
│   │   ├── AuthModal.tsx
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   │
│   ├── checkout/           # Оформление заказа [TODO]
│   │   ├── CheckoutForm.tsx
│   │   ├── ContactStep.tsx
│   │   ├── DeliveryStep.tsx
│   │   ├── RecipientStep.tsx
│   │   ├── PaymentStep.tsx
│   │   ├── OrderSummary.tsx
│   │   └── ProgressIndicator.tsx
│   │
│   ├── profile/            # Личный кабинет [TODO]
│   │   ├── ProfileForm.tsx
│   │   ├── ProfileSidebar.tsx
│   │   ├── OrderCard.tsx
│   │   └── OrdersFilter.tsx
│   │
│   ├── order/              # Заказы [TODO]
│   │   ├── OrderDetails.tsx
│   │   ├── OrderStatus.tsx
│   │   └── OrderItems.tsx
│   │
│   ├── admin/              # Админ-панель [TODO]
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminHeader.tsx
│   │   ├── OrdersTable.tsx
│   │   ├── OrdersFilter.tsx
│   │   ├── OrderRow.tsx
│   │   ├── ProductsTable.tsx
│   │   ├── ProductsFilter.tsx
│   │   ├── ProductForm.tsx
│   │   ├── ImageUpload.tsx
│   │   └── TagsInput.tsx
│   │
│   ├── blog/               # Блог [TODO]
│   │   ├── BlogCard.tsx
│   │   ├── BlogFilter.tsx
│   │   ├── BlogPost.tsx
│   │   └── ShareButtons.tsx
│   │
│   ├── review/             # Отзывы [TODO]
│   │   ├── ReviewList.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── ReviewForm.tsx
│   │   ├── RatingSummary.tsx
│   │   └── StarRating.tsx
│   │
│   ├── page/               # Страницы контента [TODO]
│   │   └── PageContent.tsx
│   │
│   ├── seo/                # SEO [TODO]
│   │   ├── SEO.tsx
│   │   └── StructuredData.tsx
│   │
│   └── common/             # Переиспользуемые компоненты [TODO]
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Checkbox.tsx
│       ├── Modal.tsx
│       ├── Pagination.tsx
│       └── OptimizedImage.tsx
│
├── contexts/               # React Context
│   └── CartContext.tsx     # ✅ Контекст корзины (state + actions)
│
├── lib/                    # Библиотеки и утилиты
│   ├── types/              # TypeScript типы
│   │   ├── index.ts        # ✅ Экспорт всех типов
│   │   ├── product.ts      # ✅ Product, ProductFilters, ProductWithRelated
│   │   ├── order.ts        # ✅ Order, OrderStatus, DeliveryAddress
│   │   ├── user.ts         # ✅ User, RegisterData, LoginData
│   │   ├── review.ts       # ✅ Review, ReviewStatus
│   │   ├── promo.ts        # ✅ PromoCode, ValidatePromoCodeRequest
│   │   ├── common.ts       # ✅ PaginatedResponse, ApiError, Category
│   │   ├── checkout.ts     # [TODO] CheckoutData, CheckoutStep
│   │   └── admin.ts        # [TODO] AdminStats, AdminFilters
│   │
│   ├── api/                # API клиенты
│   │   ├── client.ts       # ✅ ApiClient singleton (базовый клиент)
│   │   ├── products.ts     # ✅ productsApi (CRUD товаров)
│   │   ├── categories.ts   # ✅ categoriesApi (список категорий)
│   │   ├── auth.ts         # ✅ authApi (register, login, logout)
│   │   ├── orders.ts       # ✅ ordersApi (создание, список)
│   │   ├── reviews.ts      # ✅ reviewsApi (список, создание)
│   │   ├── promo.ts        # ✅ promoApi (валидация)
│   │   ├── pages.ts        # [TODO] pagesApi (CMS страницы)
│   │   ├── blog.ts         # [TODO] blogApi (новости)
│   │   ├── payments.ts     # [TODO] paymentsApi (ЮKassa)
│   │   └── admin/          # [TODO] Админские API
│   │       ├── orders.ts
│   │       └── products.ts
│   │
│   ├── hooks/              # Custom React Hooks
│   │   ├── index.ts        # ✅ Экспорт всех hooks
│   │   ├── useProducts.ts  # ✅ useProducts, useFeaturedProducts, useProduct
│   │   ├── useCategories.ts # ✅ useCategories
│   │   ├── useAuth.ts      # ✅ useAuth (login, register, logout)
│   │   ├── useOrders.ts    # [TODO] useOrders, useOrder
│   │   ├── useReviews.ts   # [TODO] useReviews
│   │   ├── useCheckout.ts  # [TODO] useCheckout (мульти-степ форма)
│   │   └── useAdminOrders.ts # [TODO] useAdminOrders
│   │
│   ├── validation/         # Схемы валидации (Yup/Zod)
│   │   ├── auth.ts         # [TODO] loginSchema, registerSchema
│   │   ├── checkout.ts     # [TODO] contactSchema, deliverySchema
│   │   └── product.ts      # [TODO] productSchema (для админки)
│   │
│   └── utils/              # Утилиты
│       ├── format.ts       # [TODO] formatPrice, formatDate
│       ├── schema.ts       # [TODO] Генераторы JSON-LD (Schema.org)
│       └── constants.ts    # [TODO] Константы приложения
│
├── public/                 # Статические файлы
│   ├── images/             # Изображения
│   ├── robots.txt          # [TODO] Правила для поисковых ботов
│   └── favicon.ico
│
├── .env.local              # ✅ Переменные окружения (NEXT_PUBLIC_API_URL)
├── next.config.ts          # Конфигурация Next.js
├── tailwind.config.ts      # Конфигурация Tailwind CSS
├── tsconfig.json           # Конфигурация TypeScript
├── package.json            # Зависимости npm
└── pnpm-lock.yaml          # Lock file для pnpm
```

---

## ⚙️ BACKEND СТРУКТУРА (Laravel 11)

### Корневая директория `/backend`

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/                    # API контроллеры
│   │   │   │   ├── ProductController.php       # ✅ CRUD товаров
│   │   │   │   ├── CategoryController.php      # ✅ Категории
│   │   │   │   ├── AuthController.php          # ✅ Авторизация
│   │   │   │   ├── OrderController.php         # ✅ Заказы
│   │   │   │   ├── ReviewController.php        # ✅ Отзывы
│   │   │   │   ├── PromoCodeController.php     # ✅ Промокоды
│   │   │   │   ├── PageController.php          # [TODO] CMS страницы
│   │   │   │   ├── BlogPostController.php      # [TODO] Новости
│   │   │   │   └── PaymentController.php       # [TODO] Платежи
│   │   │   │
│   │   │   ├── Admin/                  # Админские контроллеры [TODO]
│   │   │   │   ├── OrderController.php
│   │   │   │   ├── ProductController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   ├── ReviewController.php
│   │   │   │   ├── PageController.php
│   │   │   │   └── AnalyticsController.php
│   │   │   │
│   │   │   ├── SitemapController.php   # [TODO] Генерация sitemap.xml
│   │   │   └── WebhookController.php   # [TODO] ЮKassa webhooks
│   │   │
│   │   ├── Requests/               # Form Requests (валидация)
│   │   │   ├── RegisterRequest.php             # ✅ Регистрация
│   │   │   ├── LoginRequest.php                # ✅ Вход
│   │   │   ├── StoreOrderRequest.php           # ✅ Создание заказа
│   │   │   ├── StoreReviewRequest.php          # ✅ Создание отзыва
│   │   │   ├── ValidatePromoCodeRequest.php    # ✅ Валидация промокода
│   │   │   ├── UpdateProfileRequest.php        # [TODO] Обновление профиля
│   │   │   │
│   │   │   └── Admin/                  # Админские запросы [TODO]
│   │   │       ├── StoreProductRequest.php
│   │   │       ├── UpdateProductRequest.php
│   │   │       └── UpdateOrderStatusRequest.php
│   │   │
│   │   ├── Resources/              # API Resources (форматирование JSON)
│   │   │   ├── ProductResource.php             # ✅ Товар
│   │   │   ├── CategoryResource.php            # ✅ Категория
│   │   │   ├── OrderResource.php               # ✅ Заказ
│   │   │   ├── OrderItemResource.php           # ✅ Товар в заказе
│   │   │   ├── ReviewResource.php              # ✅ Отзыв
│   │   │   ├── UserResource.php                # ✅ Пользователь
│   │   │   ├── PromoCodeResource.php           # ✅ Промокод
│   │   │   ├── PageResource.php                # [TODO] Страница
│   │   │   └── BlogPostResource.php            # [TODO] Новость
│   │   │
│   │   ├── Middleware/             # Middleware
│   │   │   └── IsAdmin.php         # [TODO] Проверка роли админа
│   │   │
│   │   └── Kernel.php              # HTTP Kernel (регистрация middleware)
│   │
│   ├── Models/                     # Eloquent Models
│   │   ├── User.php                # ✅ Пользователь
│   │   ├── Product.php             # ✅ Товар
│   │   ├── Category.php            # ✅ Категория
│   │   ├── Order.php               # ✅ Заказ
│   │   ├── OrderItem.php           # ✅ Товар в заказе
│   │   ├── OrderHistory.php        # ✅ История заказа
│   │   ├── Address.php             # ✅ Адрес доставки
│   │   ├── Review.php              # ✅ Отзыв
│   │   ├── PromoCode.php           # ✅ Промокод
│   │   ├── Page.php                # ✅ CMS страница
│   │   ├── BlogPost.php            # ✅ Новость
│   │   └── Promotion.php           # ✅ Акция/баннер
│   │
│   ├── Services/                   # Бизнес-логика (сервисы)
│   │   ├── OrderService.php        # ✅ Создание заказа, расчеты
│   │   ├── PaymentService.php      # [TODO] ЮKassa интеграция
│   │   └── ImageService.php        # [TODO] Обработка изображений
│   │
│   ├── Events/                     # Events [TODO]
│   │   ├── OrderCreated.php        # После создания заказа
│   │   └── OrderStatusChanged.php  # После изменения статуса
│   │
│   ├── Listeners/                  # Event Listeners [TODO]
│   │   ├── SendOrderConfirmation.php
│   │   └── NotifyAdminNewOrder.php
│   │
│   └── Mail/                       # Mailable классы [TODO]
│       ├── OrderConfirmed.php
│       ├── NewOrderNotification.php
│       └── OrderStatusChanged.php
│
├── database/
│   ├── migrations/                 # Миграции БД
│   │   ├── 2026_01_27_172116_create_users_table.php          # ✅
│   │   ├── 2026_01_27_172116_create_categories_table.php     # ✅
│   │   ├── 2026_01_27_172116_create_products_table.php       # ✅
│   │   ├── 2026_01_27_172117_create_orders_table.php         # ✅
│   │   ├── 2026_01_27_172118_create_order_items_table.php    # ✅
│   │   ├── 2026_01_27_172119_create_order_history_table.php  # ✅
│   │   ├── 2026_01_27_172117_create_addresses_table.php      # ✅
│   │   ├── 2026_01_27_172117_create_reviews_table.php        # ✅
│   │   ├── 2026_01_27_172117_create_promo_codes_table.php    # ✅
│   │   ├── 2026_01_27_172117_create_pages_table.php          # ✅
│   │   ├── 2026_01_27_172117_create_blog_posts_table.php     # ✅
│   │   └── 2026_01_27_172117_create_promotions_table.php     # ✅
│   │
│   ├── seeders/                    # Seeders (наполнение БД)
│   │   ├── DatabaseSeeder.php      # ✅ Главный seeder
│   │   ├── UserSeeder.php          # ✅ 10 пользователей
│   │   ├── CategorySeeder.php      # ✅ 16 категорий
│   │   ├── ProductSeeder.php       # ✅ 30 товаров
│   │   ├── PromoCodeSeeder.php     # ✅ 5 промокодов
│   │   ├── PageSeeder.php          # ✅ 4 страницы
│   │   ├── BlogPostSeeder.php      # ✅ 6 новостей
│   │   └── PromotionSeeder.php     # ✅ 3 акции
│   │
│   └── factories/                  # Factories [TODO]
│       ├── ProductFactory.php
│       └── OrderFactory.php
│
├── routes/
│   ├── api.php                     # ✅ API роуты (~30 эндпоинтов)
│   └── web.php                     # [TODO] Web роуты (sitemap, webhooks)
│
├── config/                         # Конфигурация Laravel
│   ├── database.php                # ✅ PostgreSQL настройки
│   ├── sanctum.php                 # ✅ Sanctum (SPA auth)
│   ├── cors.php                    # ✅ CORS настройки
│   └── services.php                # [TODO] ЮKassa credentials
│
├── resources/
│   └── views/
│       └── emails/                 # Email шаблоны [TODO]
│           ├── order-confirmed.blade.php
│           ├── new-order-notification.blade.php
│           └── order-status-changed.blade.php
│
├── storage/
│   ├── app/
│   │   └── public/
│   │       └── products/           # Изображения товаров
│   └── logs/                       # Логи
│
├── tests/                          # Тесты [TODO]
│   ├── Feature/
│   │   ├── ProductApiTest.php
│   │   ├── OrderApiTest.php
│   │   └── AuthTest.php
│   └── Unit/
│       └── OrderServiceTest.php
│
├── .env                            # ✅ Переменные окружения
├── composer.json                   # ✅ PHP зависимости
├── composer.lock
├── artisan                         # CLI Laravel
└── API_ENDPOINTS.md                # ✅ Документация API

```

---

## 📚 ДОКУМЕНТАЦИЯ (/docs)

```
docs/
├── INDEX.md                    # ✅ Индекс документации
├── SUMMARY.md                  # ✅ Краткое описание проекта
├── First_wants.md              # ✅ Техническое задание
├── DATABASE_SCHEMA.md          # ✅ Схема базы данных
├── API_SPEC.md                 # ✅ Спецификация API
├── COMPLETED_TASKS.md          # ✅ Журнал выполненных задач (НОВЫЙ)
├── BACKLOG.md                  # ✅ Бэклог оставшихся задач (НОВЫЙ)
├── FILE_STRUCTURE.md           # ✅ Файловая структура проекта (ЭТОТ ФАЙЛ)
├── PROGRESS.md                 # [TODO] Общий прогресс по фазам
└── diagrams/                   # Диаграммы (UML, ERD и т.д.)
    └── ...
```

---

## 🎯 ПРИНЦИПЫ ОРГАНИЗАЦИИ ФАЙЛОВ

### 1. Модульность

**Каждый модуль - самодостаточен:**
```
feature/
├── Component.tsx       # UI компонент
├── useFeature.ts       # Custom hook
├── types.ts            # TypeScript типы
├── api.ts              # API клиент
└── validation.ts       # Валидация
```

**Пример: Auth модуль**
```
components/auth/
├── AuthModal.tsx
├── LoginForm.tsx
└── RegisterForm.tsx

lib/hooks/
└── useAuth.ts

lib/api/
└── auth.ts

lib/types/
└── user.ts

lib/validation/
└── auth.ts
```

---

### 2. Именование файлов

**React компоненты:** PascalCase
- ✅ `ProductCard.tsx`
- ✅ `OrderSummary.tsx`
- ❌ `product-card.tsx`

**Hooks:** camelCase с префиксом `use`
- ✅ `useProducts.ts`
- ✅ `useAuth.ts`
- ❌ `productsHook.ts`

**API модули:** camelCase
- ✅ `products.ts`
- ✅ `auth.ts`
- ❌ `ProductsApi.ts`

**Types:** camelCase
- ✅ `product.ts`
- ✅ `order.ts`
- ❌ `ProductTypes.ts`

**Laravel Controllers:** PascalCase + Controller suffix
- ✅ `ProductController.php`
- ✅ `OrderController.php`
- ❌ `product.controller.php`

**Laravel Models:** PascalCase, singular
- ✅ `Product.php`
- ✅ `Order.php`
- ❌ `Products.php`

**Laravel Migrations:** snake_case с timestamp
- ✅ `2026_01_27_172116_create_products_table.php`
- ❌ `CreateProductsTable.php`

---

### 3. Импорты

**Использовать абсолютные пути (TypeScript path mapping):**
```typescript
// ✅ Хорошо
import { useProducts } from '@/lib/hooks';
import { Product } from '@/lib/types';

// ❌ Плохо
import { useProducts } from '../../../lib/hooks';
import { Product } from '../../../lib/types';
```

**Группировка импортов:**
```typescript
// 1. React и сторонние библиотеки
import { useState } from 'react';
import Link from 'next/link';

// 2. Локальные модули
import { useProducts } from '@/lib/hooks';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product/ProductCard';

// 3. Стили
import styles from './styles.module.css';
```

---

### 4. Структура компонентов

**Порядок секций в компоненте:**
```typescript
// 1. Imports
import ...

// 2. Types/Interfaces
interface Props {
  ...
}

// 3. Component
export default function Component({ props }: Props) {
  // 3.1. Hooks
  const [state, setState] = useState();
  const { data } = useCustomHook();

  // 3.2. Effects
  useEffect(() => {
    ...
  }, []);

  // 3.3. Handlers
  const handleClick = () => {
    ...
  };

  // 3.4. Computed values
  const computed = useMemo(() => {
    ...
  }, [deps]);

  // 3.5. Early returns
  if (loading) return <Loader />;
  if (error) return <Error />;

  // 3.6. JSX
  return (
    ...
  );
}
```

---

### 5. Переиспользование кода

**DRY (Don't Repeat Yourself) - не дублируйте код:**

❌ **Плохо:**
```typescript
// В 10 компонентах:
const formatPrice = (price: number) => {
  return price.toLocaleString() + ' ₽';
};
```

✅ **Хорошо:**
```typescript
// lib/utils/format.ts
export const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU') + ' ₽';
};

// В компонентах:
import { formatPrice } from '@/lib/utils/format';
```

---

### 6. Разделение логики и представления

**Бизнес-логика - в hooks, UI - в компонентах:**

❌ **Плохо:**
```typescript
// ProductCard.tsx
export default function ProductCard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return ...
}
```

✅ **Хорошо:**
```typescript
// lib/hooks/useProducts.ts
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}

// ProductCard.tsx
export default function ProductCard() {
  const { products, loading } = useProducts();
  return ...
}
```

---

## 📦 ЗАВИСИМОСТИ

### Frontend (package.json)

```json
{
  "dependencies": {
    "next": "16.1.5",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "typescript": "5.9.3"
  },
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.5"
  }
}
```

### Backend (composer.json)

```json
{
  "require": {
    "php": "^8.3",
    "laravel/framework": "^11.35",
    "laravel/sanctum": "^4.0",
    "spatie/laravel-sluggable": "^3.6",
    "spatie/laravel-permission": "^6.10"
  },
  "require-dev": {
    "laravel/pint": "^1.13",
    "phpunit/phpunit": "^11.0"
  }
}
```

---

## 🔄 WORKFLOW

### Разработка новой фичи

1. **Создать feature branch:**
   ```bash
   git checkout -b feature/checkout-page
   ```

2. **Backend (если нужен API):**
   - Создать миграцию (если новая таблица)
   - Создать/обновить Model
   - Создать Controller
   - Создать Request (валидация)
   - Создать Resource (форматирование)
   - Добавить роуты в `routes/api.php`
   - Тестировать в Postman/Insomnia

3. **Frontend:**
   - Создать TypeScript types в `lib/types/`
   - Создать API client в `lib/api/`
   - Создать custom hook в `lib/hooks/`
   - Создать UI компоненты в `components/`
   - Создать страницу в `app/`
   - Протестировать в браузере

4. **Commit & Push:**
   ```bash
   git add .
   git commit -m "feat: add checkout page"
   git push origin feature/checkout-page
   ```

5. **Pull Request:**
   - Создать PR на GitHub
   - Code review
   - Merge в main

---

## 📝 ЧЕКЛИСТ НОВОГО ФАЙЛА

При создании нового файла проверьте:

- [ ] Файл в правильной директории?
- [ ] Правильное именование (PascalCase / camelCase)?
- [ ] Добавлен JSDoc комментарий (если нужно)?
- [ ] Экспортируется через index.ts (если модуль)?
- [ ] TypeScript типы определены?
- [ ] Нет дублирования кода?
- [ ] Следует принципам модульности?
- [ ] Соблюден code style?

---

**Дата создания:** 27 января 2026
**Версия:** 1.0
**Следующее обновление:** При добавлении новых модулей
