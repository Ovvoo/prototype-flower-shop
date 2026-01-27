# 🚀 Continuation Prompt для Claude Code

**Используй этот промпт при создании нового чата для продолжения разработки проекта.**

---

## 📋 Краткий контекст

Я работаю над проектом **интернет-магазина цветочного салона**:
- **Backend**: Laravel 11 + PostgreSQL 16
- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- **Локация**: `/root/projects/prototype-flower-shop`
- **UI язык**: Русский
- **Валюта**: ₽ (рубли)

**Текущий прогресс**: 78% (4.7 из 6 фаз завершено)

---

## 🎯 Что уже реализовано

### ✅ Завершенные фазы:

1. **Setup & Infrastructure** (100%)
   - PostgreSQL БД с 12 таблицами
   - Eloquent модели с relationships
   - Seeders с русскоязычными данными

2. **Backend API - Публичная часть** (100%)
   - Products API (list, featured, show)
   - Categories API (tree structure)
   - Orders API (create, show, track)
   - Auth API (register, login)
   - Reviews API
   - PromoCode validation

3. **Frontend - Публичная часть** (85%)
   - Главная, каталог, страница товара, корзина
   - Checkout components (ContactStep, DeliveryStep, RecipientStep, PaymentStep)
   - Navigation, UI компоненты (Button, Input, Select, Textarea, Skeleton)
   - CartContext
   - TypeScript types + API client

4. **Админ-панель MVP** (100%)
   - Dashboard со статистикой
   - Orders management (list, filters)
   - Products management (list, filters, delete)
   - Categories management (tree view)
   - Promo Codes management (list)
   - Middleware IsAdmin
   - Reusable components (DataTable, StatusBadge, AdminCard, AdminSidebar)

---

## 📂 Ключевые документы (ОБЯЗАТЕЛЬНО ПРОЧИТАЙ)

### **Основные инструкции:**
```
@/root/projects/prototype-flower-shop/CLAUDE.md
@/root/projects/prototype-flower-shop/.claude/rules/07-modularity-components.md
@/root/projects/prototype-flower-shop/.claude/rules/08-typescript-gotchas.md
```

### **API & Database:**
```
@/root/projects/prototype-flower-shop/docs/api/NAVIGATION.md
@/root/projects/prototype-flower-shop/docs/database/DATABASE_INDEX.md
```

### **Backlog & Progress:**
```
@/root/projects/prototype-flower-shop/docs/backlog/INDEX.md
@/root/projects/prototype-flower-shop/docs/backlog/BACKLOG_CRITICAL.md
@/root/projects/prototype-flower-shop/docs/completed/INDEX.md
@/root/projects/prototype-flower-shop/docs/completed/PHASE_3_ADMIN_PANEL.md
```

---

## 🔴 Что нужно сделать дальше

### **Критичные задачи (MVP)** - 11 задач, ~45 часов

#### Приоритет 1: Email уведомления (TASK-1.2, 4 ч)
- Настроить Laravel Mail
- Создать Mailable классы (OrderConfirmed, NewOrderNotification, OrderStatusChanged)
- Blade шаблоны писем
- Queue для асинхронной отправки

#### Приоритет 2: Завершить Checkout (TASK-1.3, 4 ч)
**Статус**: Компоненты готовы, нужна интеграция
- Объединить ContactStep, DeliveryStep, RecipientStep, PaymentStep в единый flow
- Multi-step navigation с прогресс-баром
- Validation и error handling
- Очистка корзины после заказа

#### Приоритет 3: Order Details Page (TASK-1.4, 2 ч)
**Статус**: Success page готова, нужна details page
- Страница `/order/[orderNumber]` с полной информацией
- Детали доставки, товары, статус, история

#### Приоритет 4: Личный кабинет (TASK-2.2 - 2.6, ~24 ч)
- Update profile endpoint (backend)
- Auth modal integration (частично готово)
- Интеграция auth в навигацию
- Страница профиля `/profile`
- История заказов `/profile/orders`

#### Приоритет 5: Admin доработки (TASK-3.5, TASK-3.7)
- Admin order details page с timeline
- Product create/edit forms с image upload
- Category create/edit forms
- Promo code create/edit forms

### **Важные задачи (Production)** - 13 задач, ~50 часов
- Дополнительные страницы (О компании, Доставка, Контакты)
- Блог и новости
- SEO оптимизация (sitemap, robots.txt, meta tags, structured data)

### **Желательные задачи** - 11 задач, ~58 часов
- Расширенные фильтры каталога
- Отзывы на товарах (frontend компонент)
- Интеграция ЮKassa
- Performance оптимизация
- Wishlist, сравнение товаров

**Полный список**: `@/root/projects/prototype-flower-shop/docs/backlog/INDEX.md`

---

## 🏗️ Архитектура проекта

### Backend структура:
```
backend/
├── app/
│   ├── Models/ (12 моделей)
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/ (публичные endpoints)
│   │   │   └── Admin/ (admin endpoints)
│   │   ├── Requests/ (Form Requests для валидации)
│   │   ├── Resources/ (API Resources для форматирования)
│   │   └── Middleware/ (IsAdmin)
│   └── Services/ (OrderService)
├── database/
│   ├── migrations/ (12 таблиц)
│   └── seeders/ (7 seeders)
└── routes/api.php (50 endpoints)
```

### Frontend структура:
```
app/
├── app/ (Next.js pages)
│   ├── page.tsx (главная)
│   ├── catalog/page.tsx
│   ├── product/[id]/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── order/[orderNumber]/page.tsx
│   ├── profile/ (будет создано)
│   └── admin/ (5 pages)
│       ├── page.tsx (Dashboard)
│       ├── orders/page.tsx
│       ├── products/page.tsx
│       ├── categories/page.tsx
│       └── promo-codes/page.tsx
├── components/
│   ├── Navigation.tsx
│   ├── ProductCard.tsx, QuantitySelector.tsx, PriceDisplay.tsx
│   ├── ui/ (Button, Input, Select, Textarea, Skeleton)
│   ├── checkout/ (6 компонентов)
│   └── admin/ (AdminSidebar, AdminCard, DataTable, StatusBadge)
├── lib/
│   ├── types/ (10 type files)
│   ├── api/ (7 API services)
│   └── hooks/ (useProducts, useCategories, useAuth, useAdminStats)
└── contexts/
    └── CartContext.tsx
```

---

## ⚙️ Правила разработки

### **Обязательно соблюдай:**

1. **Модульность** (`@.claude/rules/07-modularity-components.md`):
   - Каждый UI элемент, используемый 2+ раз → компонент
   - Кнопки через `<Button variant="primary|secondary|ghost">`
   - Цены через `<PriceDisplay price={} compareAtPrice={}/>`
   - Типы централизованы в `lib/types/`

2. **TypeScript** (`@.claude/rules/08-typescript-gotchas.md`):
   - React Hook Form: watch() возвращает unknown → cast типы
   - Nested fields: использовать FieldPath assertion
   - PaginatedResponse определён в common.ts

3. **Code Style**:
   - Primary color: `pink-600`, `hover:bg-pink-700`
   - Tailwind utility classes, NO CSS modules
   - `"use client"` только для useState/handlers
   - Все UI тексты на русском

4. **Backend**:
   - Валидация через Form Requests
   - Eager loading для relationships
   - Middleware для авторизации
   - API Resources для форматирования

### **Перед коммитом:**
```bash
cd /root/projects/prototype-flower-shop/app
npx tsc --noEmit  # Проверка типов
pnpm build        # Production build
```

---

## 🚦 Workflow для новой задачи

1. **Прочитай требования** из `@docs/backlog/BACKLOG_CRITICAL.md`
2. **Проверь существующий код**:
   - Backend: `backend/app/Http/Controllers/`
   - Frontend: `app/app/`, `app/components/`, `app/lib/`
3. **Создай файлы** согласно архитектуре
4. **Используй существующие компоненты**:
   - Button, Input, Select, Textarea (UI)
   - ProductCard, PriceDisplay, QuantitySelector
   - DataTable, StatusBadge (Admin)
5. **Проверь типы**: `npx tsc --noEmit`
6. **Build**: `pnpm build`
7. **Документируй**: Обнови `docs/completed/` если фаза завершена

---

## 📊 Текущие метрики

- **Backend**: ~1,900 строк PHP (11 контроллеров, 12 requests, 1 middleware)
- **Frontend**: ~5,000 строк TypeScript/TSX (23 компонента, 11 страниц)
- **Database**: 12 таблиц, 7 seeders
- **API**: 50 endpoints (30 публичных + 20 admin)

---

## 🎯 Моя текущая задача

**[Укажи здесь конкретную задачу, над которой работаешь]**

Например:
- Я хочу реализовать TASK-1.2: Email уведомления
- Я хочу завершить checkout integration (TASK-1.3)
- Я хочу создать страницу профиля (TASK-2.5)
- Я хочу добавить admin order details page (TASK-3.5)

---

## 📝 Вопросы для Claude

После загрузки контекста, задай мне следующие вопросы (если нужно уточнение):

1. С какой задачи из бэклога начать?
2. Нужно ли придерживаться какого-то конкретного подхода?
3. Есть ли предпочтения по технологиям (например, для email: Mailgun vs SMTP)?

---

## ✅ Checklist перед стартом

- [ ] Прочитал `@CLAUDE.md`
- [ ] Ознакомился с `@docs/api/NAVIGATION.md`
- [ ] Изучил `@docs/backlog/BACKLOG_CRITICAL.md`
- [ ] Посмотрел существующий код в `backend/app/` и `app/`
- [ ] Понял архитектуру проекта
- [ ] Готов к работе с соблюдением правил модульности и TypeScript

---

## 💡 ШАБЛОН ПРОМПТА ДЛЯ НОВОГО ЧАТА

Скопируй и вставь в новый чат:

```
Привет! Я продолжаю разработку интернет-магазина цветов.

**Проект**: /root/projects/prototype-flower-shop
**Стек**: Next.js 16 + React 19 + TypeScript + Laravel 11 + PostgreSQL 16
**Прогресс**: 78% завершено (4.7 из 6 фаз)

**Последняя завершенная фаза**: Админ-панель MVP (Dashboard, Orders, Products, Categories, Promo Codes)

**Ключевые документы для чтения**:
- @/root/projects/prototype-flower-shop/CLAUDE.md (основные правила)
- @/root/projects/prototype-flower-shop/docs/backlog/BACKLOG_CRITICAL.md (задачи)
- @/root/projects/prototype-flower-shop/docs/completed/PHASE_3_ADMIN_PANEL.md (что сделано)
- @/root/projects/prototype-flower-shop/docs/api/NAVIGATION.md (API)

**Моя следующая задача**: [УКАЖИ ЗДЕСЬ ЗАДАЧУ]

Например:
- Реализовать Email уведомления (TASK-1.2)
- Завершить checkout integration (TASK-1.3)
- Создать страницу профиля (TASK-2.5)
- Добавить admin order details page (TASK-3.5)

**Важные правила**:
- Соблюдай модульность (@.claude/rules/07-modularity-components.md)
- Следи за TypeScript gotchas (@.claude/rules/08-typescript-gotchas.md)
- Используй существующие компоненты (Button, Input, Select, DataTable)
- Primary color: pink-600
- Всё на русском языке

**Перед началом**:
1. Прочитай требования задачи из BACKLOG_CRITICAL.md
2. Проверь существующий код (backend/app/, app/)
3. Создай файлы согласно архитектуре
4. Проверь типы: npx tsc --noEmit
5. Build: pnpm build

Начинай!
```

---

**Версия**: 2.0
**Дата создания**: 28 января 2026
**Последнее обновление**: 28 января 2026 (вечер)
**Автор**: AI Assistant (Claude Sonnet 4.5)
