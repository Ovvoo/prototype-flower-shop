# Заказы

---

## 1. **orders** — Заказы

```sql
CREATE TABLE orders (
  id             TEXT PRIMARY KEY,
  order_number   TEXT UNIQUE NOT NULL, -- Человеко-читаемый номер: #12345

  -- Связи
  user_id        TEXT REFERENCES users(id),

  -- Суммы
  subtotal       DECIMAL(10, 2) NOT NULL, -- Сумма товаров
  discount       DECIMAL(10, 2) DEFAULT 0, -- Скидка по промокоду
  delivery_fee   DECIMAL(10, 2) DEFAULT 0, -- Стоимость доставки
  total_amount   DECIMAL(10, 2) NOT NULL, -- Итого к оплате

  -- Статус
  status         TEXT DEFAULT 'NEW', -- NEW, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
  payment_status TEXT DEFAULT 'PENDING', -- PENDING, PAID, FAILED, REFUNDED

  -- Контакт клиента
  customer_name  TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,

  -- Доставка (JSON)
  delivery_address JSONB NOT NULL, -- {city, street, house, apartment, entrance, floor, intercom}
  delivery_date    DATE NOT NULL,
  delivery_time    TEXT NOT NULL, -- "9-12", "12-15", "15-18", "18-21"
  delivery_comment TEXT,

  -- Получатель (если отличается от заказчика)
  recipient_name  TEXT,
  recipient_phone TEXT,

  -- Дополнительно
  greeting_card_text TEXT, -- Текст открытки
  gift_wrap          TEXT, -- "standard" | "premium" | NULL

  -- Оплата
  payment_method TEXT NOT NULL, -- "online" | "cash_on_delivery"
  payment_id     TEXT, -- ID транзакции в ЮKassa
  paid_at        TIMESTAMP,

  -- Промокод
  promo_code     TEXT,

  -- Метаданные
  ip_address     TEXT,
  user_agent     TEXT,

  created_at     TIMESTAMP DEFAULT NOW(),
  updated_at     TIMESTAMP DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

**Workflow статусов:**
```
NEW → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
  ↓
CANCELLED (в любой момент до SHIPPED)
```

**Поля:**
- `order_number` — Красивый номер: `#12345`, `#12346`, ...
- `delivery_address` — JSON с полным адресом
- `delivery_time` — Слот времени доставки
- `greeting_card_text` — Текст открытки (до 200 символов)
- `gift_wrap` — Тип упаковки (NULL = стандартная бесплатная)

---

## 2. **order_items** — Позиции заказа

```sql
CREATE TABLE order_items (
  id         TEXT PRIMARY KEY,
  order_id   TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),

  -- Снапшот товара на момент заказа
  product_name  TEXT NOT NULL,
  product_image TEXT,

  -- Цена и количество
  price    DECIMAL(10, 2) NOT NULL, -- Цена за штуку
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal DECIMAL(10, 2) NOT NULL, -- price * quantity

  created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
```

**Зачем снапшот товара:**
- Цена товара может измениться в будущем
- Товар может быть удалён
- Заказ должен хранить состояние на момент покупки

---

## 3. **order_history** — История изменений заказа

```sql
CREATE TABLE order_history (
  id         TEXT PRIMARY KEY,
  order_id   TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

  -- Изменения
  old_status TEXT,
  new_status TEXT NOT NULL,

  -- Кто и когда
  changed_by TEXT REFERENCES users(id), -- NULL если автоматически
  comment    TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_order_history_order ON order_history(order_id);
```

**Пример:**
```
NEW → CONFIRMED (by admin_id) "Клиент подтвердил по телефону"
CONFIRMED → PROCESSING (by manager_id) "Букет собран"
PROCESSING → SHIPPED (by system) "Курьер получил заказ"
SHIPPED → DELIVERED (by courier_id) "Доставлен, клиент расписался"
```

---

**Статус**: ✅ Готова к имплементации
**Версия**: 1.0
