# Контент и CMS

---

## 1. **reviews** — Отзывы

```sql
CREATE TABLE reviews (
  id          TEXT PRIMARY KEY,
  product_id  TEXT REFERENCES products(id) ON DELETE SET NULL,
  user_id     TEXT REFERENCES users(id) ON DELETE SET NULL,
  order_id    TEXT REFERENCES orders(id) ON DELETE SET NULL,

  -- Контент отзыва
  rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title       TEXT,
  comment     TEXT NOT NULL,
  images      TEXT[], -- Фото от клиентов (UGC)

  -- Модерация
  status      TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
  moderated_by TEXT REFERENCES users(id),
  moderated_at TIMESTAMP,

  -- Ответ администрации
  admin_reply TEXT,
  replied_by  TEXT REFERENCES users(id),
  replied_at  TIMESTAMP,

  -- Полезность
  helpful_count   INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

**Workflow:**
1. Клиент оставляет отзыв → `status = PENDING`
2. Админ модерирует → `status = APPROVED` или `REJECTED`
3. Если APPROVED → показывается на сайте
4. Админ может ответить → `admin_reply` заполняется

---

## 2. **pages** — Контентные страницы (CMS)

```sql
CREATE TABLE pages (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  content     TEXT, -- HTML контент (из WYSIWYG редактора)

  -- SEO
  meta_title       TEXT,
  meta_description TEXT,

  -- Медиа
  cover_image TEXT,

  -- Статус
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,

  -- Версионирование
  version     INTEGER DEFAULT 1,

  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW(),

  created_by  TEXT REFERENCES users(id),
  updated_by  TEXT REFERENCES users(id)
);

-- Индексы
CREATE INDEX idx_pages_slug ON pages(slug);
```

**Примеры страниц:**
- `/about-us` — О компании
- `/delivery-info` — Доставка и оплата
- `/care-tips` — Советы по уходу за цветами
- `/contacts` — Контакты

---

## 3. **blog_posts** — Блог/Новости

```sql
CREATE TABLE blog_posts (
  id               TEXT PRIMARY KEY,
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  excerpt          TEXT, -- Краткое описание (для превью)
  content          TEXT NOT NULL,
  cover_image      TEXT,

  -- Категории и теги
  category         TEXT, -- "Советы", "Новости", "Акции"
  tags             TEXT[],

  -- SEO
  meta_title       TEXT,
  meta_description TEXT,

  -- Статус
  is_published     BOOLEAN DEFAULT false,
  published_at     TIMESTAMP,

  -- Метрики
  views_count      INTEGER DEFAULT 0,

  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW(),

  author_id        TEXT REFERENCES users(id)
);

-- Индексы
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
```

---

## 4. **promotions** — Акции и баннеры

```sql
CREATE TABLE promotions (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  image_url   TEXT,

  -- Ссылка
  link_to     TEXT, -- URL или path ("/catalog/bouquets")

  -- Отображение
  placement   TEXT NOT NULL, -- "HOME_SLIDER" | "SIDEBAR" | "POPUP"
  sort_order  INTEGER DEFAULT 0,

  -- Период
  valid_from  TIMESTAMP NOT NULL,
  valid_until TIMESTAMP NOT NULL,

  is_active   BOOLEAN DEFAULT true,

  created_at  TIMESTAMP DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_promotions_placement ON promotions(placement);
CREATE INDEX idx_promotions_active ON promotions(is_active, valid_from, valid_until);
```

---

**Статус**: ✅ Готова к имплементации
**Версия**: 1.0
