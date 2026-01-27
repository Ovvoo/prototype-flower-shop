# 🗄️ Схема базы данных

## Обзор

PostgreSQL база данных с использованием Prisma ORM для type-safe доступа.

---

## 📊 ER-диаграмма (текстовое представление)

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   User      │────1:N──│    Order     │────N:1──│  OrderItem  │
│             │         │              │         │             │
│ - id        │         │ - id         │         │ - id        │
│ - email     │         │ - userId     │         │ - orderId   │
│ - name      │         │ - orderNumber│         │ - productId │
│ - role      │         │ - status     │         │ - quantity  │
└─────────────┘         └──────────────┘         └─────────────┘
                              │                         │
                              │                         │
                              │                         │
┌─────────────┐               │                   ┌─────────────┐
│   Address   │───────────────┘                   │   Product   │
│             │                                   │             │
│ - id        │                                   │ - id        │
│ - userId    │                                   │ - name      │
│ - city      │                                   │ - price     │
│ - street    │                                   │ - categoryId│
└─────────────┘                                   └─────────────┘
                                                        │
                                                        │
                                                  ┌─────────────┐
                                                  │  Category   │
                                                  │             │
                                                  │ - id        │
                                                  │ - name      │
                                                  │ - parentId  │
                                                  └─────────────┘
```

---

## 📑 Группы таблиц

### Пользователи и адреса
Аутентификация, профили, сохранённые адреса доставки.
Смотри [@DATABASE_USERS.md](./DATABASE_USERS.md)

- **users** — Система аутентификации и роли
- **addresses** — Сохранённые адреса клиентов

### Каталог товаров
Категории и товары с характеристиками, фильтрами, метриками.
Смотри [@DATABASE_CATALOG.md](./DATABASE_CATALOG.md)

- **categories** — Древовидная структура категорий
- **products** — Товары с атрибутами и изображениями

### Заказы
Заказы, позиции, история изменений статусов.
Смотри [@DATABASE_ORDERS.md](./DATABASE_ORDERS.md)

- **orders** — Основная таблица заказов
- **order_items** — Позиции заказа (снапшот товаров)
- **order_history** — История изменения статусов

### Контент и CMS
Отзывы, страницы, блог, акции.
Смотри [@DATABASE_CONTENT.md](./DATABASE_CONTENT.md)

- **reviews** — Отзывы с модерацией
- **pages** — Контентные страницы (CMS)
- **blog_posts** — Блог и новости
- **promotions** — Баннеры и акции

### Промокоды
Система скидок и промокодов.
Смотри [@DATABASE_PROMO.md](./DATABASE_PROMO.md)

- **promo_codes** — Промокоды с условиями применения

### Примеры SQL запросов
Популярные и полезные запросы для аналитики.
Смотри [@DATABASE_QUERIES.md](./DATABASE_QUERIES.md)

---

## 🔐 Безопасность

### 1. **Row Level Security (RLS)**

Supabase поддерживает RLS — ограничение доступа на уровне строк:

```sql
-- Пример: Клиенты видят только свои заказы
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY orders_select_policy ON orders
  FOR SELECT
  USING (auth.uid() = user_id OR auth.role() IN ('ADMIN', 'MANAGER'));
```

### 2. **Хеширование паролей**

```typescript
import bcrypt from 'bcrypt';

// При регистрации
const passwordHash = await bcrypt.hash(password, 12); // 12 rounds

// При входе
const isValid = await bcrypt.compare(password, user.password_hash);
```

### 3. **SQL Injection защита**

Prisma ORM автоматически экранирует все параметры:

```typescript
// ✅ Безопасно (параметризованный запрос)
const user = await prisma.user.findUnique({
  where: { email: userInput }
});

// ❌ Никогда не использовать raw SQL с interpolation
await prisma.$executeRaw`SELECT * FROM users WHERE email = ${userInput}`;
```

---

## 🚀 Миграции

### Создание миграции

```bash
# Изменить schema.prisma → Создать миграцию
npx prisma migrate dev --name add_promotions_table

# Применить миграции на продакшн
npx prisma migrate deploy
```

### Seed данных

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Создать тестовые категории
  await prisma.category.createMany({
    data: [
      { name: 'Букеты', slug: 'bouquets' },
      { name: 'Комнатные растения', slug: 'indoor-plants' },
      { name: 'Подарочные наборы', slug: 'gift-sets' },
    ],
  });

  // Создать админа
  await prisma.user.create({
    data: {
      email: 'admin@flowershop.ru',
      name: 'Администратор',
      role: 'ADMIN',
      password_hash: await bcrypt.hash('secure_password', 12),
    },
  });
}

main();
```

---

**Статус**: ✅ Готова к имплементации
**Версия**: 1.0
