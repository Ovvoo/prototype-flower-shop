# 🌐 Webhooks

Webhook интеграции с платёжными системами и уведомления о событиях.

---

## ЮKassa Webhook — Уведомление о платеже

Webhook для обработки уведомлений о платежах от ЮKassa.

### Endpoint

```
POST /api/webhooks/yukassa
```

### Тело запроса

```json
{
  "type": "notification",
  "event": "payment.succeeded" | "payment.canceled" | "refund.succeeded",
  "object": {
    "id": "payment_id",
    "status": "succeeded",
    "amount": {
      "value": "3500.00",
      "currency": "RUB"
    },
    "metadata": {
      "order_id": "order_123"
    }
  }
}
```

### Обработка

1. **Верификация подписи** (HMAC SHA256)
   - Проверить, что запрос действительно от ЮKassa
   - Использовать secret key из конфигурации

2. **Обновление статуса заказа:**
   - `payment.succeeded` → `paymentStatus = 'PAID'`, `status = 'CONFIRMED'`
   - `payment.canceled` → `paymentStatus = 'FAILED'`
   - `refund.succeeded` → `paymentStatus = 'REFUNDED'`, `status = 'CANCELLED'`

3. **Отправка уведомлений:**
   - SMS клиенту с подтверждением
   - Email с деталями заказа

4. **Логирование:**
   - Создание записи в `order_history`
   - Запись события в аналитику

### Ответ

```json
{
  "success": true
}
```

### Пример обработчика (tRPC)

```typescript
// server/routers/webhooks.ts
import { publicProcedure, router } from '@/server/trpc';
import * as z from 'zod';
import crypto from 'crypto';

export const webhooksRouter = router({
  yukassa: publicProcedure
    .input(
      z.object({
        type: z.literal('notification'),
        event: z.enum([
          'payment.succeeded',
          'payment.canceled',
          'refund.succeeded',
        ]),
        object: z.object({
          id: z.string(),
          status: z.string(),
          amount: z.object({
            value: z.string(),
            currency: z.string(),
          }),
          metadata: z.object({
            order_id: z.string(),
          }),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // 1. Верификация подписи
        const signature = ctx.headers['x-signature'] as string;
        if (!verifySignature(input, signature)) {
          throw new Error('Invalid signature');
        }

        const { event, object } = input;
        const { order_id } = object.metadata;
        const amount = parseFloat(object.amount.value);

        // 2. Обновление заказа
        const order = await ctx.prisma.order.findUnique({
          where: { id: order_id },
        });

        if (!order) {
          throw new Error('Order not found');
        }

        let newPaymentStatus = 'FAILED';
        let newOrderStatus = order.status;

        if (event === 'payment.succeeded') {
          newPaymentStatus = 'PAID';
          newOrderStatus = 'CONFIRMED';
        } else if (event === 'payment.canceled') {
          newPaymentStatus = 'FAILED';
        } else if (event === 'refund.succeeded') {
          newPaymentStatus = 'REFUNDED';
          newOrderStatus = 'CANCELLED';
        }

        // 3. Сохранить обновление
        await ctx.prisma.order.update({
          where: { id: order_id },
          data: {
            paymentStatus: newPaymentStatus,
            status: newOrderStatus,
            paymentId: object.id,
            paidAt: event === 'payment.succeeded' ? new Date() : null,
          },
        });

        // 4. Создать запись в историю
        await ctx.prisma.orderHistory.create({
          data: {
            orderId: order_id,
            oldStatus: order.status,
            newStatus: newOrderStatus,
            comment: `ЮKassa: ${event}`,
          },
        });

        // 5. Отправить уведомление (SMS/Email)
        await sendOrderNotification(order, newOrderStatus);

        return { success: true };
      } catch (error) {
        console.error('Webhook error:', error);
        // ЮKassa ожидает 200 OK в любом случае
        return { success: false };
      }
    }),
});

function verifySignature(data: any, signature: string): boolean {
  const secret = process.env.YUKASSA_WEBHOOK_SECRET;
  const payload = JSON.stringify(data);
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return expectedSignature === signature;
}

async function sendOrderNotification(order: any, status: string) {
  // Реализация отправки SMS/Email
  // ...
}
```

---

## Типичный workflow платежа

```
1. Клиент создаёт заказ
   POST /api/trpc/orders.create
   ↓ Ответ: { paymentUrl: '...' }

2. Клиент переходит на paymentUrl
   ↓ ЮKassa обрабатывает платёж

3. При успехе ЮKassa отправляет webhook
   POST /api/webhooks/yukassa
   ↓ Мы обновляем статус заказа

4. ЮKassa redirect на successUrl
   ↓ Клиент видит: "Платёж прошёл успешно"

5. Или если отказано:
   ↓ failureUrl
   ↓ Клиент видит: "Платёж не прошёл"
```

---

## Тестирование webhooks локально

Используй **ngrok** для test-режима:

```bash
# Запусти ngrok
ngrok http 3000

# Публичный URL: https://abc123.ngrok.io

# Обнови в ЮKassa админ-панели:
# Webhook URL: https://abc123.ngrok.io/api/webhooks/yukassa

# Отправь тестовый webhook
curl -X POST http://localhost:3000/api/webhooks/yukassa \
  -H "Content-Type: application/json" \
  -H "X-Signature: <valid_signature>" \
  -d '{
    "type": "notification",
    "event": "payment.succeeded",
    "object": {
      "id": "test_payment_123",
      "status": "succeeded",
      "amount": { "value": "1000.00", "currency": "RUB" },
      "metadata": { "order_id": "order_123" }
    }
  }'
```

---

**Статус**: ✅ Готова к имплементации
**Версия**: 1.0
