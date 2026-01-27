# ⚡ Quick Start для нового чата

## Копируй и вставляй в новый чат:

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

## 📋 Что сделано (78% завершено):

✅ **Setup & Infrastructure** (100%)
✅ **Backend API - Публичная часть** (100%) - 30 endpoints
✅ **Frontend - Публичная часть** (85%) - главная, каталог, товар, корзина, checkout
✅ **Админ-панель MVP** (100%) - Dashboard, Orders, Products, Categories, PromoCodes

## 🔴 Что делать дальше (11 критичных задач, ~45 часов):

1. **Email уведомления** (4 ч) - Laravel Mail + Mailable классы
2. **Завершить Checkout** (4 ч) - интеграция компонентов в flow
3. **Order Details Page** (2 ч) - `/order/[orderNumber]`
4. **Личный кабинет** (~24 ч):
   - Update profile endpoint
   - Auth modal integration
   - Profile page
   - Order history page
5. **Admin доработки** (~8 ч):
   - Order details page
   - Product/Category/PromoCode forms

**Полный список**: `docs/backlog/BACKLOG_CRITICAL.md`

---

## 📂 Ключевые файлы:

- `CLAUDE.md` - основные правила проекта
- `docs/CONTINUATION_PROMPT.md` - полный промпт с контекстом
- `docs/backlog/INDEX.md` - все задачи (42 задачи)
- `docs/completed/INDEX.md` - что уже сделано
- `.claude/rules/` - правила кодирования

---

## 🚀 Команды:

```bash
cd /root/projects/prototype-flower-shop/app
pnpm dev              # Dev server
npx tsc --noEmit      # Type check
pnpm build            # Production build
```

```bash
cd /root/projects/prototype-flower-shop/backend
php artisan route:list  # Routes list
php artisan serve       # Backend server
```
