# Модульность и переиспользование компонентов

## Структура компонентов

```
app/components/
├── ui/              # Базовые UI примитивы
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Textarea.tsx
│   └── Skeleton.tsx
├── checkout/        # Компоненты checkout flow
├── ProductCard.tsx  # Карточка товара
├── QuantitySelector.tsx
├── PriceDisplay.tsx
└── Navigation.tsx
```

## Правила создания компонентов

### Когда создавать компонент

| Ситуация | Действие |
|----------|----------|
| UI элемент используется 2+ раз | Создать компонент |
| Inline стили > 3 строк | Вынести в компонент |
| Логика + разметка смешаны | Разделить |
| Skeleton для загрузки | Добавить в ui/Skeleton.tsx |

### Обязательные компоненты

```tsx
// Кнопки — ВСЕГДА через Button
<Button variant="primary">Текст</Button>
<Button variant="secondary" href="/link">Ссылка</Button>

// Цены — ВСЕГДА через PriceDisplay
<PriceDisplay price={1000} compareAtPrice={1500} size="lg" />

// Количество — ВСЕГДА через QuantitySelector
<QuantitySelector value={qty} onChange={setQty} max={stock} />

// Карточки товаров — ВСЕГДА через ProductCard
<ProductCard product={product} onAddToCart={handleAdd} />
```

### Запрещено

```tsx
// ❌ Inline button стили
<button className="bg-pink-600 text-white px-4 py-2...">

// ❌ Дублирование логики цен
<span className="text-2xl font-bold text-pink-600">
  {price.toLocaleString()} ₽
</span>

// ❌ Копирование карточки товара
<div className="bg-white rounded-2xl overflow-hidden...">
```

## Именование

| Тип | Паттерн | Пример |
|-----|---------|--------|
| UI примитивы | `PascalCase` | `Button`, `Input` |
| Составные | `EntityAction` | `ProductCard`, `OrderSummary` |
| Формы | `EntityForm` | `DeliveryForm`, `ContactForm` |
| Скелетоны | `EntitySkeleton` | `ProductCardSkeleton` |

## Props интерфейсы

```tsx
// Всегда явно типизировать props
interface ProductCardProps {
  product: Product        // Из @/lib/types
  onAddToCart?: (product: Product) => void
}

// Использовать существующие типы
import type { Product } from '@/lib/types'
```

## Импорты

```tsx
// Компоненты — относительный путь через alias
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/ProductCard'

// Типы — из централизованного места
import type { Product, Category } from '@/lib/types'

// Хуки — из index
import { useProducts, useCategories } from '@/lib/hooks'
```
