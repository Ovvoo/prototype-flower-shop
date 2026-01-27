# Примеры SQL запросов

Полезные запросы для аналитики, отчётов и оптимизации.

---

## 📊 Популярные товары

Топ-10 товаров по продажам с рейтингом и количеством отзывов:

```sql
SELECT
  p.id,
  p.name,
  p.price,
  p.sales_count,
  p.views_count,
  ROUND(AVG(r.rating)::DECIMAL, 2) as avg_rating,
  COUNT(r.id) as review_count
FROM products p
LEFT JOIN reviews r ON r.product_id = p.id AND r.status = 'APPROVED'
WHERE p.is_active = true
GROUP BY p.id, p.name, p.price, p.sales_count, p.views_count
ORDER BY p.sales_count DESC
LIMIT 10;
```

---

## 📈 Воронка продаж

Анализ конверсии: посещения → добавления в корзину → заказы.

```sql
WITH funnel AS (
  SELECT
    COUNT(DISTINCT ip_address) as visitors,
    COUNT(DISTINCT CASE WHEN cart_items > 0 THEN ip_address END) as added_to_cart,
    COUNT(DISTINCT order_id) as orders
  FROM analytics_events
  WHERE created_at >= NOW() - INTERVAL '7 days'
)
SELECT
  visitors,
  added_to_cart,
  orders,
  ROUND((added_to_cart::DECIMAL / visitors * 100), 2) as add_to_cart_rate,
  ROUND((orders::DECIMAL / added_to_cart * 100), 2) as conversion_rate
FROM funnel;
```

---

## 💰 Выручка по датам

Ежедневная выручка за последний месяц:

```sql
SELECT
  DATE(o.created_at) as order_date,
  COUNT(o.id) as orders_count,
  SUM(o.total_amount) as total_revenue,
  ROUND(AVG(o.total_amount), 2) as avg_order_value
FROM orders o
WHERE o.status != 'CANCELLED'
  AND o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(o.created_at)
ORDER BY order_date DESC;
```

---

## 👥 Анализ клиентов

Повторные клиенты и их средний чек:

```sql
SELECT
  u.id,
  u.name,
  u.email,
  COUNT(o.id) as total_orders,
  SUM(o.total_amount) as total_spent,
  ROUND(AVG(o.total_amount), 2) as avg_order_value,
  MIN(o.created_at) as first_order_date,
  MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.status != 'CANCELLED'
WHERE u.role = 'CUSTOMER'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 1
ORDER BY total_spent DESC;
```

---

## 📦 Статус заказов

Распределение заказов по статусам за последний месяц:

```sql
SELECT
  o.status,
  o.payment_status,
  COUNT(o.id) as order_count,
  SUM(o.total_amount) as total_amount,
  ROUND(AVG(o.total_amount), 2) as avg_amount
FROM orders o
WHERE o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY o.status, o.payment_status
ORDER BY order_count DESC;
```

---

## 🎯 Отзывы по рейтингам

Распределение отзывов по рейтингам:

```sql
SELECT
  r.rating,
  COUNT(r.id) as review_count,
  ROUND(COUNT(r.id)::DECIMAL /
    (SELECT COUNT(*) FROM reviews WHERE status = 'APPROVED') * 100, 2) as percentage
FROM reviews r
WHERE r.status = 'APPROVED'
GROUP BY r.rating
ORDER BY r.rating DESC;
```

---

## 🏆 Эффективность категорий

Доход и продажи по категориям:

```sql
SELECT
  c.name,
  COUNT(DISTINCT o.id) as orders,
  COUNT(oi.id) as items_sold,
  SUM(oi.subtotal) as total_revenue,
  ROUND(AVG(oi.price), 2) as avg_item_price
FROM categories c
JOIN products p ON p.category_id = c.id
JOIN order_items oi ON oi.product_id = p.id
JOIN orders o ON o.id = oi.order_id
WHERE o.status != 'CANCELLED'
  AND o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY c.id, c.name
ORDER BY total_revenue DESC;
```

---

## 🎁 Эффективность промокодов

Какие промокоды дают результат:

```sql
SELECT
  o.promo_code,
  COUNT(o.id) as usage_count,
  SUM(o.discount) as total_discount,
  ROUND(AVG(o.discount), 2) as avg_discount,
  ROUND(AVG(o.total_amount), 2) as avg_order_value
FROM orders o
WHERE o.promo_code IS NOT NULL
  AND o.status != 'CANCELLED'
  AND o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY o.promo_code
ORDER BY usage_count DESC;
```

---

## 📍 Популярные адреса доставки

Города, в которые доставляется больше всего:

```sql
SELECT
  o.delivery_address->>'city' as city,
  COUNT(o.id) as delivery_count,
  ROUND(AVG(o.delivery_fee), 2) as avg_delivery_fee,
  SUM(o.total_amount) as total_revenue
FROM orders o
WHERE o.status IN ('SHIPPED', 'DELIVERED')
  AND o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY o.delivery_address->>'city'
ORDER BY delivery_count DESC
LIMIT 20;
```

---

## ⏰ Время доставки

Анализ временных окон доставки:

```sql
SELECT
  o.delivery_time,
  COUNT(o.id) as orders,
  ROUND(AVG(o.delivery_fee), 2) as avg_delivery_fee
FROM orders o
WHERE o.status IN ('SHIPPED', 'DELIVERED')
  AND o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY o.delivery_time
ORDER BY orders DESC;
```

---

## 🔍 Товары без продаж

Товары, которые долго лежат без продаж:

```sql
SELECT
  p.id,
  p.name,
  c.name as category,
  p.price,
  p.stock,
  p.views_count,
  p.sales_count,
  EXTRACT(DAY FROM NOW() - p.updated_at) as days_without_sale
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE p.is_active = true
  AND p.sales_count = 0
  AND p.created_at < NOW() - INTERVAL '30 days'
ORDER BY p.views_count DESC;
```

---

**Статус**: ✅ Готова к имплементации
**Версия**: 1.0
