# 📋 RULES CHEATSHEET - Быстрая памятка

## 🚫 КРИТИЧЕСКИЕ ОШИБКИ (НЕ ДЕЛАЙ!)

```typescript
// ❌ НЕПРАВИЛЬНО
export function Component(props: any) { }           // any запрещен!
export default function Component() { }             // default export плохо
const myComponent = () => { }                       // arrow functions для компонентов плохо
function Component({ params }) {                    // Next.js 16: params async!
  const { id } = params                            // забыли await!
}

// ✅ ПРАВИЛЬНО
export function Component(props: ComponentProps): JSX.Element { }
export function Component() { }                     // named export
export async function Page({ params }: { params: Promise<{id: string}> }) {
  const { id } = await params                      // await обязателен!
}
```

---

## 📏 ЛИМИТЫ РАЗМЕРОВ (СТРОГО!)

| Тип файла | Лимит | Действие при превышении |
|-----------|-------|-------------------------|
| Component | 200   | Разбить на несколько компонентов |
| Page      | 200   | Вынести логику в components |
| Validation| 150   | Разделить схемы по файлам |
| Service   | 300   | Разбить на методы |
| Utility   | 50    | Одна функция = один файл |

**Проверка**: `wc -l filename.tsx` перед коммитом!

---

## 🎨 СТИЛЬ ПРОЕКТА

### Цвета
```tsx
primary:   className="bg-pink-600 hover:bg-pink-700"
secondary: className="bg-gray-200 hover:bg-gray-300"
success:   className="bg-green-600"
error:     className="bg-red-600"
```

### Карточки
```tsx
className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6"
```

### Кнопки
```tsx
<Button variant="primary" size="md">Текст</Button>
// Размеры: sm, md, lg
// Варианты: primary, secondary, ghost
```

### Responsive
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
// mobile-first: базовые стили → md: (768px) → lg: (1024px)
```

---

## 📝 ФОРМЫ (ВСЕГДА ОДИН ПАТТЕРН!)

```typescript
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// 1. Схема валидации
const schema = yup.object({
  name: yup.string().required('Введите имя'),
  email: yup.string().email('Некорректный email').required(),
})

// 2. Тип из схемы
type FormValues = yup.InferType<typeof schema>

// 3. В компоненте
export function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,  // as any для обхода типов
  })

  const onSubmit = (data: FormValues) => {
    // handle submit
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('name')}
        label="Имя"
        error={errors.name?.message}
      />
    </form>
  )
}
```

---

## 🧩 КОМПОНЕНТЫ (ПАТТЕРН)

```typescript
// 1. Импорты
'use client'  // ТОЛЬКО если нужен useState/onClick/useEffect!
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

// 2. Типы (ВСЕГДА!)
interface MyComponentProps {
  title: string
  onAction: (id: string) => void
  isLoading?: boolean  // опциональные с ?
}

// 3. Компонент (named export!)
export function MyComponent({ title, onAction, isLoading = false }: MyComponentProps): JSX.Element {
  // state
  const [active, setActive] = useState(false)

  // handlers
  const handleClick = () => {
    onAction('123')
  }

  // render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  )
}
```

---

## 🗂️ СТРУКТУРА ФАЙЛОВ (ВСЕГДА!)

```
components/
├── feature/              # Группируй по фичам
│   ├── FeatureCard.tsx  # Главный компонент
│   ├── FeatureForm.tsx  # Форма
│   └── FeatureList.tsx  # Список
└── ui/                   # Переиспользуемые UI
    ├── Button.tsx
    └── Modal.tsx

lib/
├── types/               # Типы
│   └── feature.ts
├── api/                 # API services
│   └── feature.ts
├── hooks/               # Custom hooks
│   └── useFeature.ts
└── validation/          # Yup schemas
    └── featureSchema.ts
```

---

## 🔧 ЧАСТЫЕ ЗАДАЧИ

### Создать карточку

```typescript
interface CardProps {
  item: Item
  onAction: (id: string) => void
}

export function ItemCard({ item, onAction }: CardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold">{item.title}</h3>
      <p className="text-gray-600 mt-2">{item.description}</p>
      <Button onClick={() => onAction(item.id)} className="mt-4">
        Действие
      </Button>
    </div>
  )
}
```

### Создать список с фильтром

```typescript
export function ItemList() {
  const [filter, setFilter] = useState<string>('all')
  const [items, setItems] = useState<Item[]>([])

  const filteredItems = items.filter(item =>
    filter === 'all' || item.status === filter
  )

  return (
    <div>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">Все</option>
        <option value="active">Активные</option>
      </select>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
```

### Создать modal

```typescript
import { Modal } from '@/components/ui/Modal'

export function MyModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Заголовок" size="md">
      <div>Контент модального окна</div>
    </Modal>
  )
}
```

### Loading state

```typescript
export function Page() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<Data | null>(null)

  useEffect(() => {
    fetchData().then(setData).finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <Skeleton variant="card" />
  }

  if (!data) {
    return <div>Нет данных</div>
  }

  return <div>{/* render data */}</div>
}
```

---

## 🚀 КОМАНДЫ (ЗАУЧИ!)

```bash
# Dev server
pnpm dev

# TypeScript check
npx tsc --noEmit

# Размеры файлов
wc -l path/to/file.tsx

# Найти файлы > 200 строк
find . -name "*.tsx" -exec wc -l {} + | awk '$1 > 200'

# Grep по коду
grep -r "TODO" components/

# Структура папок
tree -L 3 -I node_modules
```

---

## ✅ ЧЕКЛИСТ ПЕРЕД КОММИТОМ

- [ ] Все файлы < 200 строк (`wc -l`)
- [ ] TypeScript без ошибок (`npx tsc --noEmit`)
- [ ] Нет `any` типов
- [ ] Нет `console.log`
- [ ] Нет закомментированного кода
- [ ] Нет TODO (или задокументированы)
- [ ] Все типы явные
- [ ] Используются существующие UI компоненты
- [ ] Русский язык в UI
- [ ] Dev server запускается
- [ ] Документация обновлена

---

## 🎯 DRY ПРИНЦИП

### ❌ Плохо (дублирование)
```typescript
// Component1.tsx
<div className="bg-white rounded-2xl shadow-lg p-6">...</div>

// Component2.tsx
<div className="bg-white rounded-2xl shadow-lg p-6">...</div>

// Component3.tsx
<div className="bg-white rounded-2xl shadow-lg p-6">...</div>
```

### ✅ Хорошо (переиспользование)
```typescript
// components/ui/Card.tsx
export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {children}
    </div>
  )
}

// Использование везде
<Card>...</Card>
```

---

## 🔍 DEBUGGING

### TypeScript ошибки
```bash
# Подробный вывод
npx tsc --noEmit --pretty

# Только ошибки конкретного файла
npx tsc --noEmit path/to/file.tsx
```

### Dev server не запускается
```bash
# Очистить cache
rm -rf .next
pnpm dev

# Проверить порт
lsof -i :3000
```

### Import ошибки
```typescript
// ✅ Всегда используй alias
import { Button } from '@/components/ui/Button'

// ❌ Не используй относительные пути
import { Button } from '../../../components/ui/Button'
```

---

## 📚 БЫСТРЫЙ REFERENCE

### Существующие компоненты
- `<Button>` - /components/ui/Button.tsx
- `<Input>` - /components/ui/Input.tsx
- `<Select>` - /components/ui/Select.tsx
- `<Textarea>` - /components/ui/Textarea.tsx
- `<Modal>` - /components/ui/Modal.tsx
- `<Skeleton>` - /components/ui/Skeleton.tsx

### Типы
- Order, OrderStatus - /lib/types/order.ts
- User, UserRole - /lib/types/user.ts
- Product - /lib/types/product.ts
- PaginatedResponse - /lib/types/common.ts

### API
- ordersApi - /lib/api/orders.ts
- authApi - /lib/api/auth.ts
- productsApi - /lib/api/products.ts

---

**Печатай или держи открытым при кодинге!** 🎯
