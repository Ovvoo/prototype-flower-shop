# Промокоды

---

## **promo_codes** — Промокоды и система скидок

```sql
CREATE TABLE promo_codes (
  id               TEXT PRIMARY KEY,
  code             TEXT UNIQUE NOT NULL, -- "SALE2026", "BIRTHDAY"

  -- Скидка
  discount_type    TEXT NOT NULL, -- "PERCENTAGE" | "FIXED_AMOUNT"
  discount_value   DECIMAL(10, 2) NOT NULL, -- 20 (для 20%) или 500 (для 500₽)

  -- Условия
  min_order_amount DECIMAL(10, 2), -- Минимальная сумма заказа
  max_discount     DECIMAL(10, 2), -- Максимальная скидка (для процентов)

  -- Применимость
  applicable_to    TEXT DEFAULT 'ALL', -- "ALL" | "CATEGORY" | "PRODUCT"
  category_ids     TEXT[], -- Если applicable_to = "CATEGORY"
  product_ids      TEXT[], -- Если applicable_to = "PRODUCT"

  -- Лимиты
  usage_limit      INTEGER, -- NULL = без лимита
  usage_count      INTEGER DEFAULT 0,
  per_user_limit   INTEGER DEFAULT 1, -- Сколько раз один юзер может использовать

  -- Срок действия
  valid_from       TIMESTAMP NOT NULL,
  valid_until      TIMESTAMP NOT NULL,

  is_active        BOOLEAN DEFAULT true,

  created_at       TIMESTAMP DEFAULT NOW()
);

-- Индексы
CREATE UNIQUE INDEX idx_promo_codes_code ON promo_codes(UPPER(code));
CREATE INDEX idx_promo_codes_valid ON promo_codes(valid_from, valid_until) WHERE is_active = true;
```

**Поля:**
- `discount_type` — Тип скидки: PERCENTAGE (%) или FIXED_AMOUNT (₽)
- `discount_value` — Размер скидки (20 для 20% или 500 для 500₽)
- `min_order_amount` — Минимальная сумма заказа для применения
- `max_discount` — Максимальная скидка при процентной скидке (чтобы 20% на дорогой товар не была бесконечной)
- `applicable_to` — Применяется ко всем товарам, конкретной категории или списку товаров
- `usage_limit` — Общий лимит использования промокода (NULL = без лимита)
- `per_user_limit` — Сколько раз один пользователь может применить этот код

---

## Примеры промокодов

### 1. Сезонная скидка (20% на все)

```sql
INSERT INTO promo_codes (
  code,
  discount_type,
  discount_value,
  valid_from,
  valid_until,
  is_active
) VALUES (
  'SALE2026',
  'PERCENTAGE',
  20,
  '2026-01-01',
  '2026-12-31',
  true
);
```

### 2. Фиксированная скидка на заказ от суммы

```sql
INSERT INTO promo_codes (
  code,
  discount_type,
  discount_value,
  min_order_amount,
  valid_from,
  valid_until,
  per_user_limit
) VALUES (
  'WELCOME',
  'FIXED_AMOUNT',
  500,
  3000,
  '2026-01-01',
  '2026-02-28',
  1
);
```

### 3. Скидка на категорию

```sql
INSERT INTO promo_codes (
  code,
  discount_type,
  discount_value,
  applicable_to,
  category_ids,
  valid_from,
  valid_until
) VALUES (
  'FLOWERS15',
  'PERCENTAGE',
  15,
  'CATEGORY',
  ARRAY['cat_bouquets'],
  '2026-01-01',
  '2026-02-28'
);
```

### 4. Ограниченный промокод с лимитом

```sql
INSERT INTO promo_codes (
  code,
  discount_type,
  discount_value,
  max_discount,
  usage_limit,
  per_user_limit,
  valid_from,
  valid_until
) VALUES (
  'BLACKFRIDAY',
  'PERCENTAGE',
  30,
  5000,
  100,
  2,
  '2026-11-29',
  '2026-12-01'
);
```

---

## Проверка валидности промокода

**SQL запрос:**
```sql
SELECT *
FROM promo_codes
WHERE
  UPPER(code) = UPPER($1)
  AND is_active = true
  AND valid_from <= NOW()
  AND valid_until >= NOW()
  AND (usage_limit IS NULL OR usage_count < usage_limit);
```

**Проверка в приложении:**
1. Промокод существует и активен
2. Текущее время в диапазоне valid_from до valid_until
3. Не превышен общий лимит использования
4. Не превышен лимит на пользователя
5. Сумма заказа >= min_order_amount
6. Товары/категории совпадают с applicable_to

---

**Статус**: ✅ Готова к имплементации
**Версия**: 1.0
