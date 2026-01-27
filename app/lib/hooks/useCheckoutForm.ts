// 🪝 useCheckoutForm Hook
// Управление состоянием многошаговой формы checkout

'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import {
  type CheckoutStep,
  type StepMeta,
} from '../types/checkout'
import { type CreateOrderRequest } from '../types/order'
import {
  checkoutSchema,
  contactSchema,
  deliverySchema,
  recipientSchema,
  paymentSchema,
  type CheckoutFormValues,
} from '../validation/checkoutSchema'
import { useCartContext } from '@/contexts/CartContext'
import { ordersApi } from '../api/orders'

/**
 * Метаданные шагов
 */
const STEP_METADATA: Record<CheckoutStep, Omit<StepMeta, 'isValid' | 'isComplete'>> = {
  1: {
    step: 1,
    title: 'Контактные данные',
    description: 'Введите ваши данные для связи',
  },
  2: {
    step: 2,
    title: 'Доставка',
    description: 'Укажите адрес и время доставки',
  },
  3: {
    step: 3,
    title: 'Получатель',
    description: 'Данные получателя и дополнения',
  },
  4: {
    step: 4,
    title: 'Оплата',
    description: 'Выберите способ оплаты',
  },
}

/**
 * Схемы валидации для каждого шага
 */
const STEP_SCHEMAS = {
  1: contactSchema,
  2: deliverySchema,
  3: recipientSchema,
  4: paymentSchema,
}

/**
 * Hook для управления checkout формой
 */
export function useCheckoutForm() {
  const router = useRouter()
  const { items, promoCode, clearCart } = useCartContext()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // React Hook Form
  const form = useForm<CheckoutFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(checkoutSchema) as any,
    mode: 'onChange',
    defaultValues: {
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      delivery_address: {
        city: '',
        street: '',
        house: '',
        apartment: '',
        entrance: '',
        floor: '',
        intercom: '',
      },
      delivery_date: '',
      delivery_time: '12-15',
      recipient_name: '',
      recipient_phone: '',
      greeting_card_text: '',
      gift_wrap: false,
      payment_method: 'online',
      promo_code: promoCode || '',
    },
  })

  /**
   * Получить метаданные текущего шага
   */
  const getCurrentStepMeta = useCallback((): StepMeta => {
    const baseMeta = STEP_METADATA[currentStep]
    const stepSchema = STEP_SCHEMAS[currentStep]

    // Проверяем валидность текущего шага
    const formValues = form.getValues()
    let isValid = false

    try {
      stepSchema.validateSync(formValues, { abortEarly: false })
      isValid = true
    } catch {
      isValid = false
    }

    return {
      ...baseMeta,
      isValid,
      isComplete: isValid,
    }
  }, [currentStep, form])

  /**
   * Перейти на следующий шаг
   */
  const goToNextStep = useCallback(async () => {
    const stepMeta = getCurrentStepMeta()

    if (!stepMeta.isValid) {
      // Trigger validation для показа ошибок
      const stepSchema = STEP_SCHEMAS[currentStep]
      const formValues = form.getValues()

      try {
        await stepSchema.validate(formValues, { abortEarly: false })
      } catch (error) {
        // Ошибки уже отображаются через React Hook Form
        return false
      }
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as CheckoutStep)
      return true
    }

    return false
  }, [currentStep, form, getCurrentStepMeta])

  /**
   * Вернуться на предыдущий шаг
   */
  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as CheckoutStep)
    }
  }, [currentStep])

  /**
   * Перейти на конкретный шаг
   */
  const goToStep = useCallback((step: CheckoutStep) => {
    setCurrentStep(step)
  }, [])

  /**
   * Отправить заказ
   */
  const submitOrder = useCallback(
    async (data: CheckoutFormValues): Promise<void> => {
      setIsSubmitting(true)

      try {
        // Подготовить данные заказа
        const orderRequest: CreateOrderRequest = {
          customer_name: data.customer_name as string,
          customer_email: data.customer_email as string,
          customer_phone: data.customer_phone as string,
          delivery_address: data.delivery_address as CreateOrderRequest['delivery_address'],
          delivery_date: data.delivery_date as string,
          delivery_time: data.delivery_time as CreateOrderRequest['delivery_time'],
          recipient_name: data.recipient_name as string | undefined,
          recipient_phone: data.recipient_phone as string | undefined,
          greeting_card_text: data.greeting_card_text as string | undefined,
          gift_wrap: (data.gift_wrap as boolean) || false,
          payment_method: data.payment_method as CreateOrderRequest['payment_method'],
          items: items.map((item) => ({
            product_id: item.product.id, // Already a number
            quantity: item.quantity,
          })),
          promo_code: data.promo_code,
        }

        // Создать заказ через API
        const response = await ordersApi.createOrder(orderRequest)

        // Очистить корзину
        clearCart()

        // Redirect на страницу заказа
        router.push(`/order/${response.order.order_number}`)
      } catch (error) {
        console.error('Failed to create order:', error)
        throw error
      } finally {
        setIsSubmitting(false)
      }
    },
    [items, clearCart, router]
  )

  /**
   * Обработчик отправки формы
   */
  const handleSubmit = form.handleSubmit(async (data) => {
    await submitOrder(data)
  })

  return {
    // Form control
    form,
    handleSubmit,
    isSubmitting,

    // Step navigation
    currentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    getCurrentStepMeta,

    // Utilities
    totalSteps: 4,
  }
}
