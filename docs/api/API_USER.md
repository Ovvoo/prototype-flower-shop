# 🔑 User & Auth API

Аутентификация, профиль пользователя и управление адресами доставки.

---

## **user.register** — Регистрация

Создать новый аккаунт пользователя.

### Запрос

```typescript
{
  email: string;
  password: string; // Минимум 8 символов
  name: string;
  phone?: string;
}
```

### Ответ

```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
  };
  session: Session;
}
```

---

## **user.login** — Вход

Вход в аккаунт через NextAuth.js.

### Использование

```typescript
import { signIn } from 'next-auth/react';

const handleLogin = async (email: string, password: string) => {
  const result = await signIn('credentials', {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    toast.error(result.error);
  } else {
    navigate('/catalog');
  }
};
```

---

## **user.getProfile** — Получить профиль

Получить данные текущего пользователя.

### Запрос

(без параметров, берёт из сессии)

### Ответ

```typescript
{
  id: string;
  email: string;
  name: string;
  phone: string;
  birthDate?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'MANAGER';
  createdAt: string;

  // Статистика
  orderCount: number;
  totalSpent: number;
}
```

### Пример использования

```typescript
const { data: profile, isLoading } = trpc.user.getProfile.useQuery();

if (isLoading) return <Skeleton />;

return (
  <div>
    <h1>{profile.name}</h1>
    <p>Email: {profile.email}</p>
    <p>Телефон: {profile.phone}</p>
    <p>Заказов: {profile.orderCount}</p>
    <p>Потрачено: {profile.totalSpent}₽</p>
  </div>
);
```

---

## **user.updateProfile** — Обновить профиль

Обновить информацию профиля пользователя.

### Запрос

```typescript
{
  name?: string;
  phone?: string;
  birthDate?: string; // ISO date
}
```

### Ответ

```typescript
{
  user: User;
}
```

### Пример использования

```typescript
const updateProfile = trpc.user.updateProfile.useMutation({
  onSuccess: () => {
    toast.success('Профиль обновлён');
  },
});

const handleUpdateProfile = (data) => {
  updateProfile.mutate({
    name: data.name,
    phone: data.phone,
    birthDate: data.birthDate,
  });
};
```

---

## **user.changePassword** — Сменить пароль

Изменить пароль текущего пользователя.

### Запрос

```typescript
{
  currentPassword: string;
  newPassword: string;
}
```

### Ответ

```typescript
{
  success: boolean;
}
```

---

## 📍 Addresses API

Управление сохранённых адресов доставки.

### **addresses.list** — Список адресов

Получить все сохранённые адреса пользователя.

**Запрос:** (без параметров)

**Ответ:**
```typescript
{
  addresses: Address[];
}

type Address = {
  id: string;
  label: string; // "Дом", "Работа"
  city: string;
  street: string;
  house: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  intercom?: string;
  isDefault: boolean;
};
```

---

### **addresses.create** — Добавить адрес

Сохранить новый адрес доставки.

**Запрос:**
```typescript
{
  label: string;
  city: string;
  street: string;
  house: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  intercom?: string;
  isDefault?: boolean;
}
```

**Ответ:**
```typescript
{
  address: Address;
}
```

**Пример использования:**
```typescript
const addAddress = trpc.addresses.create.useMutation({
  onSuccess: () => {
    toast.success('Адрес сохранён');
  },
});

<Button onClick={() => addAddress.mutate({
  label: 'Дом',
  city: 'Москва',
  street: 'Ленина',
  house: '15',
  apartment: '42',
  isDefault: true,
})}>
  Сохранить адрес
</Button>
```

---

### **addresses.update** — Обновить адрес

Изменить сохранённый адрес.

**Запрос:**
```typescript
{
  addressId: string;
  data: {
    label?: string;
    city?: string;
    street?: string;
    house?: string;
    apartment?: string;
    entrance?: string;
    floor?: string;
    intercom?: string;
    isDefault?: boolean;
  };
}
```

**Ответ:**
```typescript
{
  address: Address;
}
```

---

### **addresses.delete** — Удалить адрес

Удалить сохранённый адрес.

**Запрос:**
```typescript
{
  addressId: string;
}
```

**Ответ:**
```typescript
{
  success: boolean;
}
```

**Пример использования:**
```typescript
const deleteAddress = trpc.addresses.delete.useMutation();

<Button
  variant="secondary"
  onClick={() => deleteAddress.mutate({ addressId: 'addr_123' })}
>
  Удалить
</Button>
```

---

**Статус**: ✅ Готова к имплементации
**Версия**: 1.0
