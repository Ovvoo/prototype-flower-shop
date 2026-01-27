# 📦 Products API

Получение товаров, фильтрация по категориям, ценам и атрибутам.

---

## **products.list** — Список товаров

Получить отфильтрованный список товаров с пагинацией.

### Запрос

```typescript
{
  categoryId?: string;
  flowerTypes?: string[]; // Фильтр по типу цветов
  colors?: string[]; // Фильтр по цветам
  occasions?: string[]; // Фильтр по поводу
  priceFrom?: number;
  priceTo?: number;
  search?: string; // Поиск по названию
  sortBy?: 'popularity' | 'price_asc' | 'price_desc' | 'newest';
  page?: number; // default: 1
  limit?: number; // default: 24
}
```

### Ответ

```typescript
{
  items: Product[];
  total: number;
  page: number;
  pages: number;
}

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number; // Старая цена для скидки
  images: string[];
  category: { id: string; name: string };
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  rating: number; // Средний рейтинг
  reviewCount: number;
};
```

### Примеры использования

```typescript
// Получить все букеты дороже 1000₽
const { data } = trpc.products.list.useQuery({
  categoryId: 'cat_bouquets',
  priceFrom: 1000,
  priceTo: 5000,
  sortBy: 'popularity',
  page: 1,
  limit: 24,
});

// Поиск по названию
const { data: results } = trpc.products.list.useQuery({
  search: 'роза',
  page: 1,
});

// Фильтр по цветам и поводу
const { data: filtered } = trpc.products.list.useQuery({
  colors: ['красный', 'белый'],
  occasions: ['свадьба'],
  limit: 12,
});
```

---

## **products.getById** — Получить товар

Получить детальную информацию о товаре с похожими товарами.

### Запрос

```typescript
{
  id: string;
}
```

### Ответ

```typescript
{
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: Category;

  // Характеристики
  stock: number;
  sku: string;
  weight: number;
  height: number;

  // Атрибуты
  flowerTypes: string[];
  colors: string[];
  occasions: string[];

  // SEO
  metaTitle: string;
  metaDescription: string;

  // Состояние
  isFeatured: boolean;
  isNew: boolean;

  // Метрики
  rating: number;
  reviewCount: number;
  viewsCount: number;

  // Похожие товары
  relatedProducts: Product[];
}
```

### Пример использования

```typescript
const { data: product, isLoading } = trpc.products.getById.useQuery({
  id: 'prod_12345',
});

if (isLoading) return <ProductSkeleton />;

return (
  <div>
    <h1>{product.name}</h1>
    <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
    <img src={product.images[0]} alt={product.name} />
    <p>{product.description}</p>

    {product.relatedProducts.length > 0 && (
      <section>
        <h2>Похожие товары</h2>
        {product.relatedProducts.map(item => (
          <ProductCard key={item.id} product={item} />
        ))}
      </section>
    )}
  </div>
);
```

---

## **products.incrementViews** — Увеличить счётчик просмотров

Инкрементирует счётчик просмотров при открытии страницы товара. Используется для аналитики популярности.

### Запрос

```typescript
{
  productId: string;
}
```

### Ответ

```typescript
{
  success: boolean;
}
```

### Пример использования

```typescript
const incrementViews = trpc.products.incrementViews.useMutation();

useEffect(() => {
  // Увеличить счётчик при открытии страницы
  incrementViews.mutate({ productId: 'prod_12345' });
}, []);
```

---

**Статус**: ✅ Готова к имплементации
**Версия**: 1.0
