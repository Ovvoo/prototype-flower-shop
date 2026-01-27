# 🔧 ФАЗА 0: SETUP & INFRASTRUCTURE ✅

**Статус:** ✅ Завершена (100%)
**Дата завершения:** 27 января 2026

---

## 0.1. Установка и настройка ✅

### Бэкенд (Laravel 11)

- [x] Установлен Composer
- [x] Создан Laravel 11 проект
- [x] Установлен PHP 8.3 с расширениями (xml, dom, mbstring, curl, zip, pgsql)
- [x] Настроен .env файл для PostgreSQL
- [x] Установлены зависимости:
  - `laravel/sanctum` - API аутентификация
  - `spatie/laravel-sluggable` - автоматическая генерация slug
  - `spatie/laravel-permission` - управление ролями и правами

**Файлы:**
- `/root/projects/prototype-flower-shop/backend/.env`
- `/root/projects/prototype-flower-shop/backend/composer.json`

---

## 0.2. База данных PostgreSQL ✅

- [x] Установлен PostgreSQL 16
- [x] Создана БД `flowershop`
- [x] Настроено подключение в Laravel
- [x] Сервис запущен и работает на порту 5432

**Конфигурация:** `/root/projects/prototype-flower-shop/backend/config/database.php`

---

## 0.3. Миграции базы данных (12 таблиц) ✅

Созданы и выполнены миграции для всех таблиц:

### 1. **users** - пользователи системы
- Поля: id, email, name, phone, password, role, birth_date
- Файл: `database/migrations/2026_01_27_172116_create_users_table.php`

### 2. **categories** - категории товаров (древовидная структура)
- Поля: id, name, slug, description, image_url, parent_id, sort_order, is_active
- Файл: `database/migrations/2026_01_27_172116_create_categories_table.php`

### 3. **products** - товары каталога
- Поля: id, name, slug, description, price, compare_at_price, category_id
- JSON поля: images, flower_types, colors, occasions
- Прочие: stock, sku, weight, height, meta_title, meta_description, is_featured, is_new, is_active, views_count, sales_count
- Файл: `database/migrations/2026_01_27_172116_create_products_table.php`

### 4. **orders** - заказы
- Поля: id, order_number, user_id, subtotal, discount, delivery_fee, total_amount
- Статусы: status, payment_status
- Контакты: customer_name, customer_email, customer_phone
- JSON: delivery_address
- Доп: delivery_date, delivery_time, recipient_name, recipient_phone, greeting_card_text, gift_wrap
- Оплата: payment_method, payment_id, promo_code
- Файл: `database/migrations/2026_01_27_172117_create_orders_table.php`

### 5. **order_items** - товары в заказе
- Поля: id, order_id, product_id, product_name, product_image, price, quantity, subtotal
- Файл: `database/migrations/2026_01_27_172118_create_order_items_table.php`

### 6. **order_history** - история изменений заказа
- Поля: id, order_id, old_status, new_status, changed_by, comment
- Файл: `database/migrations/2026_01_27_172119_create_order_history_table.php`

### 7. **addresses** - адреса доставки пользователей
- Поля: id, user_id, label, city, street, house, apartment, entrance, floor, intercom
- Геоданные: latitude, longitude
- Файл: `database/migrations/2026_01_27_172117_create_addresses_table.php`

### 8. **reviews** - отзывы о товарах
- Поля: id, product_id, user_id, order_id, rating, title, comment
- JSON: images
- Модерация: status, moderated_by, moderated_at
- Ответ: admin_reply, replied_by, replied_at
- Полезность: helpful_count, unhelpful_count
- Файл: `database/migrations/2026_01_27_172117_create_reviews_table.php`

### 9. **promo_codes** - промокоды
- Поля: id, code, discount_type, discount_value, min_order_amount, max_discount
- Применимость: applicable_to, category_ids, product_ids (JSON)
- Лимиты: usage_limit, usage_count, per_user_limit
- Срок: valid_from, valid_until, is_active
- Файл: `database/migrations/2026_01_27_172117_create_promo_codes_table.php`

### 10. **pages** - CMS страницы
- Поля: id, title, slug, content, meta_title, meta_description, cover_image
- Статус: is_published, published_at
- Версионирование: version
- Автор: created_by, updated_by
- Файл: `database/migrations/2026_01_27_172117_create_pages_table.php`

### 11. **blog_posts** - новости и статьи
- Поля: id, title, slug, excerpt, content, cover_image
- Категории: category, tags (JSON)
- SEO: meta_title, meta_description
- Статус: is_published, published_at
- Метрики: views_count
- Автор: author_id
- Файл: `database/migrations/2026_01_27_172117_create_blog_posts_table.php`

### 12. **promotions** - акции и баннеры
- Поля: id, title, description, image_url, link_to
- Отображение: placement, sort_order
- Период: valid_from, valid_until, is_active
- Файл: `database/migrations/2026_01_27_172117_create_promotions_table.php`

**Результат:** Все миграции выполнены успешно (`php artisan migrate`)

---

## 0.4. Eloquent Models с Relationships ✅

Созданы 12 моделей с полной настройкой relationships и casts:

### 1. **User** (`app/Models/User.php`)
- Relationships: hasMany(Order), hasMany(Review), hasMany(Address), hasMany(BlogPost)
- Fillable: name, email, phone, password, role, birth_date
- Casts: email_verified_at, password, birth_date

### 2. **Category** (`app/Models/Category.php`)
- Relationships: hasMany(Product), belongsTo(Category, 'parent'), hasMany(Category, 'children')
- Fillable: name, slug, description, image_url, parent_id, sort_order, is_active
- Sluggable: name → slug

### 3. **Product** (`app/Models/Product.php`)
- Relationships: belongsTo(Category), hasMany(Review), hasMany(OrderItem)
- Fillable: name, slug, description, price, compare_at_price, category_id, images, stock, sku, weight, height, flower_types, colors, occasions, meta_title, meta_description, is_featured, is_new, is_active, views_count, sales_count
- Casts: images, flower_types, colors, occasions (array); price, compare_at_price (decimal:2); is_featured, is_new, is_active (boolean)

### 4. **Order** (`app/Models/Order.php`)
- Relationships: belongsTo(User), hasMany(OrderItem, 'items'), hasMany(OrderHistory, 'history')
- Fillable: order_number, user_id, subtotal, discount, delivery_fee, total_amount, status, payment_status, customer_name, customer_email, customer_phone, delivery_address, delivery_date, delivery_time, recipient_name, recipient_phone, greeting_card_text, gift_wrap, payment_method, payment_id, promo_code
- Casts: delivery_address (array), суммы (decimal:2)

### 5. **OrderItem** (`app/Models/OrderItem.php`)
- Relationships: belongsTo(Order), belongsTo(Product)
- Fillable: order_id, product_id, product_name, product_image, price, quantity, subtotal

### 6. **OrderHistory** (`app/Models/OrderHistory.php`)
- Relationships: belongsTo(Order), belongsTo(User, 'changer')
- Fillable: order_id, old_status, new_status, changed_by, comment

### 7. **Address** (`app/Models/Address.php`)
- Relationships: belongsTo(User)
- Fillable: user_id, label, city, street, house, apartment, entrance, floor, intercom, latitude, longitude, is_default

### 8. **Review** (`app/Models/Review.php`)
- Relationships: belongsTo(Product), belongsTo(User), belongsTo(Order), belongsTo(User, 'moderator'), belongsTo(User, 'replier')
- Fillable: product_id, user_id, order_id, rating, title, comment, images, status, moderated_by, moderated_at, admin_reply, replied_by, replied_at, helpful_count, unhelpful_count

### 9. **PromoCode** (`app/Models/PromoCode.php`)
- Fillable: code, discount_type, discount_value, min_order_amount, max_discount, applicable_to, category_ids, product_ids, usage_limit, usage_count, per_user_limit, valid_from, valid_until, is_active
- Casts: category_ids, product_ids (array); суммы (decimal:2); даты (datetime)

### 10. **Page** (`app/Models/Page.php`)
- Relationships: belongsTo(User, 'creator'), belongsTo(User, 'updater')
- Fillable: title, slug, content, meta_title, meta_description, cover_image, is_published, published_at, version, created_by, updated_by
- Sluggable: title → slug

### 11. **BlogPost** (`app/Models/BlogPost.php`)
- Relationships: belongsTo(User, 'author')
- Fillable: title, slug, excerpt, content, cover_image, category, tags, meta_title, meta_description, is_published, published_at, views_count, author_id
- Sluggable: title → slug

### 12. **Promotion** (`app/Models/Promotion.php`)
- Fillable: title, description, image_url, link_to, placement, sort_order, valid_from, valid_until, is_active

**Особенности:**
- Spatie Sluggable для автоматической генерации слагов
- SoftDeletes где применимо
- Type casting для JSON полей
- Fillable/Guarded защита массового назначения

---

## 0.5. Seeders с тестовыми данными ✅

Созданы 7 seeders с русскоязычными данными:

### 1. **UserSeeder** - 10 пользователей
- 1 админ: admin@flowershop.ru / password
- 1 менеджер: manager@flowershop.ru / password
- 8 покупателей с русскими именами

### 2. **CategorySeeder** - 4 корневые категории + 12 подкатегорий
- Букеты (8 подкатегорий): Розы, Тюльпаны, Лилии, Пионы, Хризантемы, Орхидеи, Смешанные, Сухоцветы
- Комнатные растения (2): Цветущие, Декоративно-лиственные
- Подарки (1): Подарочные наборы
- Свадебная флористика (1): Букет невесты

### 3. **ProductSeeder** - 30 товаров
- Реалистичные названия букетов
- Описания на русском языке
- Цены от 990₽ до 8990₽
- Изображения с Unsplash
- Характеристики: состав, цвета, высота, вес
- Остатки на складе

### 4. **PromoCodeSeeder** - 5 промокодов
- FLOWERS10: 10% скидка
- WELCOME2024: 500₽ скидка
- SUMMER30: 30% скидка на букеты
- BIRTHDAY15: 15% скидка
- VIP1000: 1000₽ скидка от 5000₽

### 5. **PageSeeder** - 4 страницы
- О компании
- Доставка и оплата
- Советы по уходу
- Контакты

### 6. **BlogPostSeeder** - 6 новостей
- Темы: сезонные цветы, уход, тренды, подарки
- Категории: Новости, Советы, Тренды

### 7. **PromotionSeeder** - 3 акции
- Скидка на розы
- Бесплатная доставка
- Букет в подарок

**Результат:** База данных наполнена тестовыми данными (`php artisan db:seed`)

**Файлы:**
- `database/seeders/DatabaseSeeder.php` - главный seeder
- `database/seeders/{Model}Seeder.php` - индивидуальные seeders

---

## 📊 ИТОГИ ФАЗЫ 0

### Завершено
- ✅ 12 миграций БД (PostgreSQL 16)
- ✅ 12 Eloquent моделей с relationships
- ✅ 7 seeders с полной подготовкой данных
- ✅ Все роли и разрешения настроены

### Архитектура
- ✅ Модульная структура (одна таблица = одна миграция, одна модель)
- ✅ Relationships между всеми таблицами
- ✅ Type casting для безопасности
- ✅ Валидация на уровне БД (constraints)

### Качество
- ✅ Русскоязычные данные для тестирования
- ✅ Реалистичные цены и состав товаров
- ✅ Полная иерархия категорий
- ✅ Готово к интеграции с API

---

**Версия документа:** 1.0
**Дата обновления:** 28 января 2026
