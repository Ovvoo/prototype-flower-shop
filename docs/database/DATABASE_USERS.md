# Пользователи и адреса

---

## 1. **users** — Пользователи системы

```sql
CREATE TABLE users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  phone         TEXT,
  password_hash TEXT,
  role          TEXT DEFAULT 'CUSTOMER', -- ADMIN, MANAGER, CUSTOMER
  birth_date    DATE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Поля:**
- `id` — UUID пользователя (cuid)
- `email` — Email для входа (уникальный)
- `name` — Полное имя
- `phone` — Телефон (формат: +79991234567)
- `password_hash` — Bcrypt хеш пароля (12 rounds)
- `role` — Роль: ADMIN, MANAGER, CUSTOMER
- `birth_date` — Дата рождения (для персональных скидок)

**Связи:**
- `1:N` с `orders` (один пользователь → много заказов)
- `1:N` с `addresses` (один пользователь → много адресов)
- `1:N` с `reviews` (один пользователь → много отзывов)

---

## 2. **addresses** — Сохранённые адреса клиентов

```sql
CREATE TABLE addresses (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Данные адреса
  label      TEXT, -- "Дом", "Работа", "Родители"
  city       TEXT NOT NULL,
  street     TEXT NOT NULL,
  house      TEXT NOT NULL,
  apartment  TEXT,
  entrance   TEXT,
  floor      TEXT,
  intercom   TEXT,

  -- Координаты (для зон доставки)
  latitude   DECIMAL(10, 8),
  longitude  DECIMAL(11, 8),

  is_default BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_addresses_user ON addresses(user_id);
```

**Поля:**
- `label` — Метка адреса (Дом, Работа, Родители и т.д.)
- `apartment`, `entrance`, `floor`, `intercom` — Детали входа в дом
- `latitude`, `longitude` — Координаты для определения зон доставки
- `is_default` — Адрес по умолчанию при оформлении заказа

**Использование:**
- При оформлении заказа: выбор из сохранённых адресов
- Быстрое оформление для постоянных клиентов
- Определение доступности доставки по координатам

---

**Статус**: ✅ Готова к имплементации
**Версия**: 1.0
