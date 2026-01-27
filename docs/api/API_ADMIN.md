# 🔐 Admin API

Аналитика, управление заказами и товарами (только для администраторов).

---

## 📊 Analytics API

### **analytics.dashboard** — Дашборд метрики

Получить общую статистику и графики продаж за период.

**Запрос:**
```typescript
{
  period: 'today' | 'week' | 'month' | 'year';
  compareWith?: 'previous_period'; // Сравнение с предыдущим периодом
}
```

**Ответ:**
```typescript
{
  revenue: {
    current: number;
    previous?: number;
    change?: number; // +15% или -10%
  };
  orderCount: {
    current: number;
    previous?: number;
    change?: number;
  };
  averageOrderValue: {
    current: number;
    previous?: number;
    change?: number;
  };
  conversionRate: {
    current: number; // Процент
    previous?: number;
    change?: number;
  };

  // График продаж (по дням/неделям/месяцам)
  salesChart: {
    labels: string[]; // Даты
    values: number[]; // Выручка
  };

  // Топ-10 товаров
  topProducts: {
    productId: string;
    name: string;
    revenue: number;
    salesCount: number;
  }[];
}
```

**Пример использования:**
```typescript
const { data: dashboard } = trpc.analytics.dashboard.useQuery({
  period: 'month',
  compareWith: 'previous_period',
});

return (
  <div className="dashboard">
    <div className="metrics">
      <MetricCard
        label="Выручка"
        value={formatCurrency(dashboard.revenue.current)}
        change={dashboard.revenue.change}
      />
      <MetricCard
        label="Заказов"
        value={dashboard.orderCount.current}
        change={dashboard.orderCount.change}
      />
      <MetricCard
        label="Средний чек"
        value={formatCurrency(dashboard.averageOrderValue.current)}
        change={dashboard.averageOrderValue.change}
      />
      <MetricCard
        label="Конверсия"
        value={`${dashboard.conversionRate.current}%`}
        change={dashboard.conversionRate.change}
      />
    </div>

    <LineChart
      labels={dashboard.salesChart.labels}
      values={dashboard.salesChart.values}
      title="Продажи по дням"
    />

    <TopProductsTable products={dashboard.topProducts} />
  </div>
);
```

---

## 📦 Orders Management

### **admin.orders.list** — Список заказов (админ)

Получить список всех заказов с возможностью фильтрации.

**Запрос:**
```typescript
{
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  dateFrom?: string; // ISO date
  dateTo?: string;
  search?: string; // Поиск по номеру, имени, телефону
  page?: number;
  limit?: number;
}
```

**Ответ:**
```typescript
{
  items: Order[];
  total: number;
  page: number;
  pages: number;
}
```

---

### **admin.orders.updateStatus** — Обновить статус заказа

Изменить статус заказа и отправить уведомление клиенту.

**Запрос:**
```typescript
{
  orderId: string;
  newStatus: OrderStatus;
  comment?: string; // Комментарий к изменению
}
```

**Ответ:**
```typescript
{
  order: Order;
  message: "Статус обновлён, клиенту отправлено SMS уведомление";
}
```

**Пример использования:**
```typescript
const updateOrderStatus = trpc.admin.orders.updateStatus.useMutation({
  onSuccess: (data) => {
    toast.success(data.message);
    queryClient.invalidateQueries();
  },
});

const handleStatusChange = (orderId: string, newStatus: string) => {
  updateOrderStatus.mutate({
    orderId,
    newStatus,
    comment: `Статус обновлён администратором`,
  });
};
```

---

## 📦 Products Management

### **admin.products.create** — Создать товар

Создать новый товар в каталоге.

**Запрос:**
```typescript
{
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  images: string[];
  stock: number;
  sku: string;
  weight?: number;
  height?: number;
  flowerTypes?: string[];
  colors?: string[];
  occasions?: string[];
  metaTitle?: string;
  metaDescription?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isActive?: boolean;
}
```

**Ответ:**
```typescript
{
  product: Product;
}
```

**Пример использования:**
```typescript
const createProduct = trpc.admin.products.create.useMutation({
  onSuccess: () => {
    toast.success('Товар создан');
    navigate('/admin/products');
  },
});

const handleCreateProduct = (formData) => {
  createProduct.mutate({
    name: formData.name,
    slug: formData.slug,
    description: formData.description,
    price: formData.price,
    compareAtPrice: formData.compareAtPrice,
    categoryId: formData.categoryId,
    images: uploadedImageUrls,
    stock: formData.stock,
    sku: formData.sku,
    flowerTypes: formData.flowerTypes,
    colors: formData.colors,
    occasions: formData.occasions,
    isFeatured: formData.isFeatured,
    isNew: formData.isNew,
  });
};
```

---

### **admin.products.update** — Обновить товар

Изменить информацию о товаре.

**Запрос:**
```typescript
{
  productId: string;
  data: {
    // Любые поля из create (частичное обновление)
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    isFeatured?: boolean;
    // ... и т.д.
  };
}
```

**Ответ:**
```typescript
{
  product: Product;
}
```

**Пример использования:**
```typescript
const updateProduct = trpc.admin.products.update.useMutation({
  onSuccess: () => {
    toast.success('Товар обновлён');
  },
});

const handleUpdatePrice = (productId: string, newPrice: number) => {
  updateProduct.mutate({
    productId,
    data: { price: newPrice },
  });
};

const handleToggleFeatured = (productId: string, isFeatured: boolean) => {
  updateProduct.mutate({
    productId,
    data: { isFeatured },
  });
};
```

---

### **admin.products.delete** — Удалить товар

Удалить товар из каталога.

**Запрос:**
```typescript
{
  productId: string;
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
const deleteProduct = trpc.admin.products.delete.useMutation({
  onSuccess: () => {
    toast.success('Товар удалён');
    queryClient.invalidateQueries();
  },
  onError: (error) => {
    toast.error(error.message);
  },
});

const handleDeleteProduct = (productId: string) => {
  if (confirm('Вы уверены?')) {
    deleteProduct.mutate({ productId });
  }
};
```

---

**Статус**: ✅ Готова к имплементации
**Версия**: 1.0
