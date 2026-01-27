# PHASE 7: Advanced Catalog Filters (EPIC 7)

**Дата выполнения:** 29 января 2026 (поздний вечер)
**Затраченное время:** ~6 часов (Backend: 1.5h, Frontend: 3.5h, Testing: 1h)
**Статус:** ✅ Завершено

---

## 🎯 Цель задачи

Добавить расширенные фильтры по типам цветов, цветам и поводам с checkbox UI, URL синхронизацией и модульной архитектурой.

## 📋 Что было сделано

### Backend (Laravel)

#### 1. Изменена логика фильтрации (AND → OR)

**Файл:** `backend/app/Http/Controllers/Api/ProductController.php`

**Было (AND логика):**
- Выбор "Роза" + "Пион" → показывает только товары с ОБОИМИ типами
- Слишком строгая фильтрация, мало результатов

**Стало (OR логика):**
```php
// Фильтрация по типу цветов (OR логика)
if ($request->filled('flower_types')) {
    $flowerTypes = is_array($request->flower_types)
        ? $request->flower_types
        : explode(',', $request->flower_types);

    $query->where(function ($q) use ($flowerTypes) {
        foreach ($flowerTypes as $type) {
            $q->orWhereJsonContains('flower_types', trim($type));
        }
    });
}
```

То же самое для `colors` и `occasions`.

**Результат:**
- Выбор "Роза" + "Пион" → показывает товары с розами ИЛИ пионами
- Лучший UX, больше релевантных результатов

#### 2. Новый endpoint для доступных фильтров

**Route:** `GET /api/products/filters`

**Метод:** `ProductController::availableFilters()`

```php
public function availableFilters()
{
    return \Cache::remember('available_filters', 3600, function () {
        $products = Product::active()->get(['flower_types', 'colors', 'occasions']);

        $flowerTypes = [];
        $colors = [];
        $occasions = [];

        foreach ($products as $product) {
            $flowerTypes = array_merge($flowerTypes, $product->flower_types ?? []);
            $colors = array_merge($colors, $product->colors ?? []);
            $occasions = array_merge($occasions, $product->occasions ?? []);
        }

        return [
            'flower_types' => array_values(array_unique($flowerTypes)),
            'colors' => array_values(array_unique($colors)),
            'occasions' => array_values(array_unique($occasions)),
        ];
    });
}
```

**Особенности:**
- Кэширование на 1 час (3600 сек) для производительности
- Возвращает только уникальные значения
- Только для активных товаров (`Product::active()`)

**Пример ответа:**
```json
{
  "flower_types": ["Роза", "Тюльпан", "Хризантема", "Гербера", "Альстромерия", "Пион", "Гортензия", "Эустома"],
  "colors": ["Белый", "Красный", "Желтый", "Розовый", "Оранжевый", "Зеленый"],
  "occasions": ["Свадьба", "Извинение", "Благодарность", "8 марта", "День рождения", "Весна", "Выпускной", "Праздник", "Юбилей", "Признание", "Романтика", "Корпоратив"]
}
```

---

### Frontend (Next.js + React + TypeScript)

#### 1. Новые типы

**Файл:** `app/lib/types/product.ts`

```typescript
export interface AvailableFilters {
  flower_types: string[];
  colors: string[];
  occasions: string[];
}
```

#### 2. Расширение API клиента

**Файл:** `app/lib/api/products.ts`

```typescript
getAvailableFilters(): Promise<AvailableFilters> {
  return apiClient.get<AvailableFilters>('/products/filters');
}
```

#### 3. Новый хук

**Файл:** `app/lib/hooks/useProducts.ts`

```typescript
export function useAvailableFilters() {
  const [data, setData] = useState<AvailableFilters>({
    flower_types: [],
    colors: [],
    occasions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await productsApi.getAvailableFilters();
        setData(result);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  return { data, loading, error };
}
```

#### 4. Новые компоненты

##### CheckboxFilter.tsx (21 строка)

Переиспользуемый компонент чекбокса с:
- Touch-friendly высота (44px minimum)
- Hover эффект (bg-gray-50)
- Pink-600 акцент для checked состояния
- Callback `onChange(value, checked)`

```typescript
export function CheckboxFilter({ label, value, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer min-h-[44px] py-2
                      touch-manipulation hover:bg-gray-50 rounded-lg px-2 transition">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(value, e.target.checked)}
        className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}
```

##### FilterGroup.tsx (88 строк)

Accordion секция фильтров с:
- Открытие/закрытие (defaultOpen prop)
- "Показать все" если > 10 опций (maxVisible prop)
- Анимация стрелки при открытии
- Touch-friendly кнопки (44px)

**Особенности:**
```typescript
- defaultOpen: boolean (по умолчанию закрыто, "Типы цветов" открыто)
- maxVisible: number (по умолчанию 10)
- Collapse/expand анимация
- Показывает количество при "Показать все"
```

##### FiltersSkeleton.tsx (15 строк)

Loading placeholder:
- 3 секции (заголовок + 4 чекбокса в каждой)
- Pulse анимация
- Серые блоки (bg-gray-100, bg-gray-200)

#### 5. Интеграция в каталог

**Файл:** `app/app/catalog/page.tsx`

**Изменения:**

1. **Импорты:**
```typescript
import { useAvailableFilters } from "@/lib/hooks";
import { FilterGroup } from "@/components/catalog/FilterGroup";
import { FiltersSkeleton } from "@/components/catalog/FiltersSkeleton";
```

2. **State инициализация (из URL):**
```typescript
flower_types: searchParams.get('flower_types')
  ? searchParams.get('flower_types')!.split(',')
  : undefined,
colors: searchParams.get('colors')
  ? searchParams.get('colors')!.split(',')
  : undefined,
occasions: searchParams.get('occasions')
  ? searchParams.get('occasions')!.split(',')
  : undefined,
```

3. **Загрузка доступных фильтров:**
```typescript
const { data: availableFilters, loading: filtersLoading } = useAvailableFilters();
```

4. **URL синхронизация:**
```typescript
if (filters.flower_types && filters.flower_types.length > 0) {
  params.set('flower_types', filters.flower_types.join(','));
}
if (filters.colors && filters.colors.length > 0) {
  params.set('colors', filters.colors.join(','));
}
if (filters.occasions && filters.occasions.length > 0) {
  params.set('occasions', filters.occasions.join(','));
}
```

5. **Handlers:**
```typescript
const handleFlowerTypesChange = (values: string[]) => {
  setFilters(prev => ({
    ...prev,
    flower_types: values.length > 0 ? values : undefined,
    page: 1
  }));
};
// То же для colors и occasions
```

6. **UI в сайдбаре:**
```typescript
<hr className="my-6" />

{filtersLoading ? (
  <FiltersSkeleton />
) : (
  <>
    <FilterGroup
      title="Типы цветов"
      options={availableFilters.flower_types}
      selectedValues={filters.flower_types || []}
      onChange={handleFlowerTypesChange}
      defaultOpen // Открыта по умолчанию
    />

    <FilterGroup
      title="Цвета"
      options={availableFilters.colors}
      selectedValues={filters.colors || []}
      onChange={handleColorsChange}
    />

    <FilterGroup
      title="Поводы"
      options={availableFilters.occasions}
      selectedValues={filters.occasions || []}
      onChange={handleOccasionsChange}
    />
  </>
)}
```

7. **Обновлена кнопка "Сбросить все фильтры":**
```typescript
{(filters.category_id || filters.price_from || filters.price_to ||
  filters.flower_types?.length || filters.colors?.length || filters.occasions?.length) && (
  <button onClick={() => setFilters({
    ...filters,
    category_id: undefined,
    price_from: undefined,
    price_to: undefined,
    flower_types: undefined,
    colors: undefined,
    occasions: undefined,
    page: 1
  })}>
    Сбросить все фильтры
  </button>
)}
```

---

## 📊 Статистика

### Backend
- **1 endpoint добавлен:** `GET /api/products/filters`
- **1 метод изменен:** OR логика вместо AND
- **1 route добавлен** в `routes/api.php`

### Frontend
- **3 новых компонента:** CheckboxFilter, FilterGroup, FiltersSkeleton
- **1 новый тип:** AvailableFilters
- **1 новый метод API:** getAvailableFilters()
- **1 новый хук:** useAvailableFilters()
- **1 страница обновлена:** catalog/page.tsx

**Всего строк кода:** ~250 строк
- Backend: ~40 строк
- Frontend: ~210 строк (компоненты + интеграция)

---

## ✅ Verification Checklist

### Backend
- [x] GET /api/products/filters возвращает данные
- [x] OR логика работает (Роза + Пион = товары с розами ИЛИ пионами)
- [x] Кэширование работает (3600 сек)
- [x] Только активные товары в фильтрах

### Frontend
- [x] useAvailableFilters() загружает данные
- [x] FilterGroup рендерится
- [x] URL синхронизация работает (`?flower_types=Роза,Пион`)
- [x] Accordion открывается/закрывается
- [x] "Показать все" работает для длинных списков
- [x] FiltersSkeleton показывается при загрузке
- [x] TypeScript build passes (`npx tsc --noEmit`)
- [x] Production build passes (`pnpm build`)

### UX
- [x] Touch-friendly 44px minimum hit targets
- [x] Pink-600 акцент (checkboxes)
- [x] Hover эффекты
- [x] Адаптивный дизайн (desktop + mobile drawer)
- [x] URL persistence (reload сохраняет фильтры)
- [x] Сброс всех фильтров одной кнопкой

---

## 🎨 Design System Compliance

### Цветовая схема
- ✅ Pink-600 для активных элементов (checkboxes)
- ✅ Gray-50 для hover (checkboxes)
- ✅ Gray-100/200 для skeleton
- ✅ Consistent с остальным UI

### Typography
- ✅ font-semibold для заголовков секций
- ✅ text-sm для чекбоксов
- ✅ Consistent с ProductCard, Button

### Spacing
- ✅ gap-3 между checkbox и label
- ✅ space-y-1 между опциями
- ✅ mb-4 между секциями
- ✅ Consistent с catalog page

### Interactions
- ✅ cursor-pointer на labels
- ✅ transition на hover
- ✅ touch-manipulation для mobile
- ✅ rotate-180 анимация стрелки

---

## 🔧 Технические решения

### 1. Почему OR вместо AND?

**Проблема AND:**
- Пользователь выбирает "Роза" + "Пион"
- Показываются ТОЛЬКО товары с обоими типами
- Слишком мало результатов, плохой UX

**Решение OR:**
- Показывается больше релевантных товаров
- E-commerce стандарт (Amazon, Ozon используют OR)

### 2. Кэширование фильтров

**Зачем:**
- Фильтры меняются редко (при добавлении/удалении товаров)
- Дорогой запрос (итерация по всем товарам)

**Решение:**
- Cache::remember на 1 час
- Сброс при изменении товаров (можно добавить позже)

### 3. URL синхронизация

**Формат:**
```
?flower_types=Роза,Пион&colors=Красный&occasions=8 марта
```

**Преимущества:**
- Shareable links (можно поделиться ссылкой)
- Browser back/forward работает
- Reload сохраняет фильтры

### 4. Accordion вместо всегда открытых секций

**Зачем:**
- Экономия места (12 поводов + 8 типов + 6 цветов = много)
- Фокус на категориях и цене (основные фильтры)
- "Типы цветов" открыты по умолчанию (самый популярный фильтр)

---

## 📝 Изменённые файлы

### Backend (3 файла)
1. `backend/app/Http/Controllers/Api/ProductController.php`
2. `backend/routes/api.php`

### Frontend (7 файлов)
3. `app/lib/types/product.ts`
4. `app/lib/api/products.ts`
5. `app/lib/hooks/useProducts.ts`
6. `app/components/catalog/CheckboxFilter.tsx` ⭐ НОВЫЙ
7. `app/components/catalog/FilterGroup.tsx` ⭐ НОВЫЙ
8. `app/components/catalog/FiltersSkeleton.tsx` ⭐ НОВЫЙ
9. `app/app/catalog/page.tsx`

---

## 🚀 Что дальше?

Возможные улучшения (не в этом EPIC):

1. **Счетчики товаров:** "Роза (15)" показывает количество
2. **Сброс кэша:** При создании/удалении товара очищать Cache
3. **GIN индексы:** Если > 500 товаров, добавить индексы для JSON полей
4. **Фильтры в мобильном drawer:** Уже работают через `<FiltersSidebar />`
5. **Анимация:** Плавное открытие/закрытие accordion (CSS transition)

---

**Статус:** ✅ EPIC 7 завершён
**Версия:** 1.0
**Дата:** 29 января 2026
