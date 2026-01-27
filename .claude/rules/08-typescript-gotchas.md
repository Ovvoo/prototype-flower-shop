# TypeScript: типичные ошибки в проекте

## React Hook Form + Yup

### Проблема: `watch()` возвращает `unknown`

```tsx
// ❌ Ошибка: Type 'unknown' is not assignable to type 'boolean'
const giftWrap = form.watch('gift_wrap')
{giftWrap && <span>...</span>}

// ✅ Решение: явное приведение типа
const giftWrap = form.watch('gift_wrap') as boolean | undefined
```

### Проблема: nested fields в register()

```tsx
// ❌ Ошибка: '"delivery_address.city"' not assignable to parameter
{...register('delivery_address.city')}

// ✅ Решение: FieldPath assertion
import { FieldPath } from 'react-hook-form'
{...register('delivery_address.city' as FieldPath<CheckoutFormValues>)}

// И для errors:
const addressErrors = errors.delivery_address as Record<string, { message?: string }> | undefined
error={addressErrors?.city?.message}
```

### Проблема: yupResolver type mismatch

```tsx
// ❌ Ошибка: Type 'Resolver<...>' is not assignable
const form = useForm<CheckoutFormValues>({
  resolver: yupResolver(checkoutSchema),
})

// ✅ Решение: any cast (известная проблема yup + react-hook-form)
const form = useForm<CheckoutFormValues>({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolver: yupResolver(checkoutSchema) as any,
})
```

## API и типы

### Проблема: HeadersInit не индексируется

```tsx
// ❌ Ошибка: Expression can't be used to index type 'HeadersInit'
const headers: HeadersInit = { ... }
headers['Authorization'] = token

// ✅ Решение: Record<string, string>
const headers: Record<string, string> = { ... }
headers['Authorization'] = token
```

### Проблема: несоответствие API response и типа

```tsx
// ❌ Тип говорит `data`, API возвращает `product`
interface ProductWithRelated {
  data: Product  // Неверно!
}

// ✅ Проверить реальный ответ API, исправить тип
interface ProductWithRelated {
  product: Product
  related_products: Product[]
}
```

## Next.js 16

### Проблема: useSearchParams без Suspense

```tsx
// ❌ Ошибка при build: useSearchParams() should be wrapped in suspense
export default function CatalogPage() {
  const searchParams = useSearchParams()
  // ...
}

// ✅ Решение: обернуть в Suspense
function CatalogContent() {
  const searchParams = useSearchParams()
  // ...
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CatalogContent />
    </Suspense>
  )
}
```

## Проверка перед коммитом

```bash
# Всегда запускать перед коммитом
pnpm build

# Или только type check
npx tsc --noEmit
```

## Частые несоответствия полей

| API / Тип | Код | Исправление |
|-----------|-----|-------------|
| `average_rating` | `rating` | Использовать `average_rating` |
| `reviews_count` | `review_count` | Использовать `reviews_count` |
| `compare_at_price` | `compareAtPrice` | snake_case как в API |
