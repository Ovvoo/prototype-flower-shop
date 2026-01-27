# 📐 ФАЗА 2A: TYPES & API CLIENT ✅

**Статус:** ✅ Завершена (100%)
**Дата завершения:** 27 января 2026
**Часть:** Фундамент ФАЗЫ 2

---

## 2A.1. TypeScript Types (7 типов) ✅

### Product Types
**Файл:** `app/lib/types/product.ts`

```typescript
interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  compare_at_price: number | null
  main_image: string
  images: string[]
  category: Category | null
  stock: number
  sku: string
  weight: number | null
  height: number | null
  flower_types: string[] | null
  colors: string[] | null
  occasions: string[] | null
  is_featured: boolean
  is_new: boolean
  is_active: boolean
  rating: number
  review_count: number
  discount_percent: number | null
  created_at: string
  updated_at: string
}

interface ProductWithRelated {
  product: Product
  related_products: Product[]
}
```

---

### Order Types
**Файл:** `app/lib/types/order.ts`

```typescript
interface Order {
  id: number
  order_number: string
  user_id: number | null
  subtotal: number
  discount: number
  delivery_fee: number
  total_amount: number
  status: OrderStatus
  payment_status: PaymentStatus
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: DeliveryAddress
  delivery_date: string
  delivery_time: string
  recipient_name: string | null
  recipient_phone: string | null
  greeting_card_text: string | null
  gift_wrap: boolean
  payment_method: PaymentMethod
  created_at: string
  updated_at: string
}

type OrderStatus = 'new' | 'confirmed' | 'processing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
type PaymentMethod = 'online' | 'cash_on_delivery'

interface DeliveryAddress {
  city: string
  street: string
  house: string
  apartment?: string
  entrance?: string
  floor?: string
  intercom?: string
}
```

---

### User Types
**Файл:** `app/lib/types/user.ts`

```typescript
interface User {
  id: number
  name: string
  email: string
  phone: string
  role: UserRole
  birth_date: string | null
  created_at: string
  updated_at: string
}

type UserRole = 'admin' | 'manager' | 'customer'

interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
}

interface LoginData {
  email: string
  password: string
}

interface AuthResponse {
  user: User
  token: string
}
```

---

### Review Types
**Файл:** `app/lib/types/review.ts`

```typescript
interface Review {
  id: number
  product_id: number
  user_id: number
  order_id: number | null
  rating: number
  title: string
  comment: string
  images: string[] | null
  status: ReviewStatus
  admin_reply: string | null
  helpful_count: number
  unhelpful_count: number
  user: { id: number; name: string }
  created_at: string
}

type ReviewStatus = 'pending' | 'approved' | 'rejected'
```

---

### PromoCode Types
**Файл:** `app/lib/types/promo.ts`

```typescript
interface PromoCode {
  id: number
  code: string
  discount_type: DiscountType
  discount_value: number
  min_order_amount: number | null
  max_discount: number | null
  usage_limit: number | null
  usage_count: number
  valid_from: string | null
  valid_until: string | null
  is_active: boolean
}

type DiscountType = 'percentage' | 'fixed_amount'

interface ValidatePromoCodeResponse {
  valid: boolean
  error?: string
  discount_type?: DiscountType
  discount_value?: number
  calculated_discount?: number
}
```

---

### Common Types
**Файл:** `app/lib/types/common.ts`

```typescript
interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
}

interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: number | null
  sort_order: number
  is_active: boolean
  products_count?: number
  children?: Category[]
}
```

---

### Cart Types
**Файл:** `app/lib/types/cart.ts`

```typescript
interface CartItem {
  product: Product
  quantity: number
}

interface CartSummary {
  items: CartItem[]
  itemsCount: number
  subtotal: number
  discount: number
  deliveryFee: number
  total: number
  promoCode: string | null
}
```

---

### Checkout Types
**Файл:** `app/lib/types/checkout.ts`

Типы для многошагового процесса оформления заказа:
- `ContactData` - контактные данные
- `DeliveryData` - данные доставки
- `RecipientData` - данные получателя
- `PaymentData` - способ оплаты
- `CheckoutFormData` - полная форма
- `CheckoutStep` - тип шагов (1-4)
- `DELIVERY_CITIES` - константа городов
- `DELIVERY_TIME_SLOTS` - временные слоты
- `CHECKOUT_CONSTANTS` - бизнес-константы

---

## 2A.2. API Client (1 класс) ✅

### ApiClient
**Файл:** `app/lib/api/client.ts`

Singleton класс для управления API:
- Управление токеном (setToken, getToken, clearToken)
- Автоматическое добавление токена в заголовки
- Обработка ошибок API
- Методы: GET, POST, PUT, DELETE
- Сохранение токена в localStorage

**Использование:**
```typescript
const client = ApiClient.getInstance()
client.setToken('your-token')
const data = await client.get<Product[]>('/products')
```

---

## 2A.3. API Services (6 сервисов) ✅

Каждый сервис инкапсулирует API вызовы для конкретного домена:

| Сервис | Методы | Файл |
|--------|--------|------|
| **productsApi** | getProducts, getProduct, getFeaturedProducts, getNewProducts | `lib/api/products.ts` |
| **categoriesApi** | getCategories, getCategory | `lib/api/categories.ts` |
| **authApi** | register, login, logout, me | `lib/api/auth.ts` |
| **ordersApi** | createOrder, getOrders, getOrder | `lib/api/orders.ts` |
| **reviewsApi** | getReviews, createReview | `lib/api/reviews.ts` |
| **promoApi** | validatePromoCode | `lib/api/promo.ts` |

Все сервисы используют ApiClient для HTTP вызовов.

---

## 2A.4. React Hooks (3 базовых хука) ✅

| Хук | Назначение | Файл |
|-----|-----------|------|
| **useProducts** | Загрузка списка товаров с фильтрацией | `lib/hooks/useProducts.ts` |
| **useCategories** | Загрузка категорий товаров | `lib/hooks/useCategories.ts` |
| **useAuth** | Управление аутентификацией пользователя | `lib/hooks/useAuth.ts` |

Каждый хук обрабатывает loading, error состояния и инкапсулирует API логику.

---

## 2A.5. React Context (1 контекст) ✅

### CartContext
**Файл:** `app/contexts/CartContext.tsx`

**Провайдер:** `CartProvider` — обертка для приложения
**Хук:** `useCart()` — использование в компонентах

**State:**
- items: CartItem[] — товары в корзине
- promoCode: string | null — примененный промокод
- discount: number — размер скидки

**Computed Properties:**
- itemsCount: number — количество позиций
- subtotal: number — сумма без доставки и скидок
- deliveryFee: number — стоимость доставки (0, если ≥3000₽)
- total: number — итоговая сумма

**Actions:**
- addItem(product, quantity) — добавить товар
- removeItem(productId) — удалить товар
- updateQuantity(productId, quantity) — изменить количество
- clearCart() — очистить корзину
- applyPromoCode(code) — применить промокод
- removePromoCode() — убрать промокод

**Persistence:**
- localStorage keys: `flower-shop-cart`, `flower-shop-promo`
- Автоматическое восстановление при перезагрузке

---

## 📊 СТАТИСТИКА ФАЗЫ 2A

### Созданные файлы (15 файлов)

**Типы (8 файлов):**
- `lib/types/product.ts`
- `lib/types/order.ts`
- `lib/types/user.ts`
- `lib/types/review.ts`
- `lib/types/promo.ts`
- `lib/types/common.ts`
- `lib/types/cart.ts`
- `lib/types/checkout.ts`
- `lib/types/index.ts` (экспорт)

**API (7 файлов):**
- `lib/api/client.ts` (singleton)
- `lib/api/products.ts`
- `lib/api/categories.ts`
- `lib/api/auth.ts`
- `lib/api/orders.ts`
- `lib/api/reviews.ts`
- `lib/api/promo.ts`

**Хуки (3 файла):**
- `lib/hooks/useProducts.ts`
- `lib/hooks/useCategories.ts`
- `lib/hooks/useAuth.ts`

**Context (1 файл):**
- `contexts/CartContext.tsx`

**Всего кода:** ~1,000 строк TypeScript

---

## ✅ Особенности

✅ **Type Safety**
- Все типы явные, нет `any`
- Использование TypeScript generics
- Union types для состояний

✅ **Singleton Pattern**
- ApiClient используется как singleton
- Гарантирует единственный экземпляр

✅ **Persistence**
- CartContext сохраняется в localStorage
- Автоматическое восстановление при перезагрузке

✅ **Composability**
- Хуки строят на основе API сервисов
- Context использует хуки для логики
- Легко комбинировать и расширять

---

**Версия документа:** 1.0
**Дата обновления:** 28 января 2026
