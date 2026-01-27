# ⭐ Reviews API

Отзывы и рейтинги товаров.

---

## **reviews.list** — Список отзывов

Получить отзывы по товару с фильтрацией и пагинацией.

### Запрос

```typescript
{
  productId?: string; // Фильтр по товару
  rating?: number; // Фильтр по рейтингу (1-5)
  page?: number;
  limit?: number;
}
```

### Ответ

```typescript
{
  items: Review[];
  total: number;
  averageRating: number;
  ratingDistribution: {
    1: number; // Количество отзывов с 1 звездой
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

type Review = {
  id: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  rating: number;
  title: string;
  comment: string;
  images: string[];
  createdAt: string;

  // Ответ администрации
  adminReply?: {
    text: string;
    repliedAt: string;
  };

  // Полезность
  helpfulCount: number;
  unhelpfulCount: number;
};
```

### Пример использования

```typescript
const { data: reviews } = trpc.reviews.list.useQuery({
  productId: 'prod_12345',
  page: 1,
  limit: 10,
});

return (
  <div>
    <div className="rating-summary">
      <strong>{reviews.averageRating.toFixed(1)}</strong>
      <StarRating rating={reviews.averageRating} />
      <span>({reviews.total} отзывов)</span>
    </div>

    <div className="rating-distribution">
      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating}>
          <span>{rating} ★</span>
          <ProgressBar
            value={reviews.ratingDistribution[rating]}
            max={reviews.total}
          />
        </div>
      ))}
    </div>

    <div className="reviews">
      {reviews.items.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  </div>
);
```

---

## **reviews.create** — Создать отзыв

Оставить отзыв на товар. Отзыв будет отправлен на модерацию.

### Запрос

```typescript
{
  productId: string;
  orderId?: string; // Если отзыв после покупки
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[]; // URLs загруженных фото
}
```

### Ответ

```typescript
{
  review: Review;
  message: "Отзыв отправлен на модерацию";
}
```

### Пример использования

```typescript
const createReview = trpc.reviews.create.useMutation({
  onSuccess: () => {
    toast.success('Отзыв отправлен на модерацию');
    form.reset();
  },
  onError: (error) => {
    toast.error(error.message);
  },
});

const handleSubmitReview = (data) => {
  createReview.mutate({
    productId: product.id,
    orderId: orderIdIfAvailable,
    rating: data.rating,
    title: data.title,
    comment: data.comment,
    images: uploadedImageUrls,
  });
};

return (
  <form onSubmit={handleSubmitReview}>
    <div>
      <label>Оценка</label>
      <StarRatingPicker {...register('rating')} />
    </div>

    <div>
      <label>Заголовок</label>
      <Input {...register('title')} />
    </div>

    <div>
      <label>Комментарий</label>
      <Textarea {...register('comment')} />
    </div>

    <div>
      <label>Фото (опционально)</label>
      <ImageUploader onUpload={setImageUrls} />
    </div>

    <Button type="submit" disabled={createReview.isPending}>
      Отправить отзыв
    </Button>
  </form>
);
```

---

## **reviews.markHelpful** — Отметить полезным

Отметить отзыв как полезный или неполезный.

### Запрос

```typescript
{
  reviewId: string;
  helpful: boolean; // true = helpful, false = unhelpful
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
const markHelpful = trpc.reviews.markHelpful.useMutation();

const handleMarkHelpful = (reviewId: string, isHelpful: boolean) => {
  markHelpful.mutate({
    reviewId,
    helpful: isHelpful,
  });
};

<div className="helpful-buttons">
  <Button
    size="sm"
    variant="ghost"
    onClick={() => handleMarkHelpful(review.id, true)}
  >
    👍 Полезно ({review.helpfulCount})
  </Button>

  <Button
    size="sm"
    variant="ghost"
    onClick={() => handleMarkHelpful(review.id, false)}
  >
    👎 Бесполезно ({review.unhelpfulCount})
  </Button>
</div>
```

---

**Статус**: ✅ Готова к имплементации
**Версия**: 1.0
