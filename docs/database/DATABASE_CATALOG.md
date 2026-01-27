# Каталог товаров

---

## 1. **categories** — Категории товаров

```sql
CREATE TABLE categories (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url   TEXT,
  parent_id   TEXT REFERENCES categories(id),
  sort_order  INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
```

**Структура категорий (пример):**
```
Букеты (parent_id = NULL)
├─ Свадебные (parent_id = "букеты")
├─ Романтические
└─ Праздничные

Комнатные растения
├─ Суккуленты
└─ Орхидеи

Подарочные наборы
Сопутствующие товары
```

**Поля:**
- `parent_id` — ID родительской категории (NULL для корневых)
- `slug` — ЧПУ (например: `wedding-bouquets`)
- `sort_order` — Порядок сортировки
- `is_active` — Показывать на сайте

---

## 2. **products** — Товары

```sql
CREATE TABLE products (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  price       DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2), -- Старая цена для скидок
  category_id TEXT NOT NULL REFERENCES categories(id),

  -- Изображения (JSON массив URLs)
  images      JSONB DEFAULT '[]',

  -- Характеристики
  stock       INTEGER DEFAULT 0,
  sku         TEXT UNIQUE,
  weight      INTEGER, -- грамм
  height      INTEGER, -- см

  -- Атрибуты для фильтров
  flower_types TEXT[], -- ["роза", "лилия", "тюльпан"]
  colors      TEXT[], -- ["красный", "белый", "розовый"]
  occasions   TEXT[], -- ["свадьба", "день рождения"]

  -- SEO
  meta_title       TEXT,
  meta_description TEXT,

  -- Состояние
  is_featured BOOLEAN DEFAULT false, -- Хит продаж
  is_new      BOOLEAN DEFAULT false, -- Новинка
  is_active   BOOLEAN DEFAULT true,  -- Опубликован

  -- Метрики
  views_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_flower_types ON products USING GIN(flower_types);
```

**Поля:**
- `compare_at_price` — Для отображения "было 5000₽ → стало 3990₽"
- `images` — JSON массив: `["https://cdn.com/img1.webp", "https://..."]`
- `flower_types` — Массив типов цветов (для фильтра)
- `colors` — Массив цветов (для фильтра)
- `occasions` — Массив поводов (для фильтра)
- `is_featured` — Показывать в блоке "Хиты продаж"
- `views_count` — Счётчик просмотров
- `sales_count` — Счётчик продаж

---

**Статус**: ✅ Готова к имплементации
**Версия**: 1.0
