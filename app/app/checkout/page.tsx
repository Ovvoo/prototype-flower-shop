// 🛒 Checkout Page
// Страница оформления заказа

'use client'

import { useRouter } from 'next/navigation'
import { useCartContext } from '@/contexts/CartContext'
import { useCheckoutForm } from '@/lib/hooks/useCheckoutForm'
import { StepIndicator } from '@/components/checkout/StepIndicator'
import { ContactForm } from '@/components/checkout/ContactForm'
import { DeliveryForm } from '@/components/checkout/DeliveryForm'
import { RecipientForm } from '@/components/checkout/RecipientForm'
import { PaymentMethodSelector } from '@/components/checkout/PaymentMethodSelector'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { useEffect } from 'react'

/**
 * Страница оформления заказа
 */
export default function CheckoutPage() {
  const router = useRouter()
  const { items } = useCartContext()

  const {
    form,
    handleSubmit,
    isSubmitting,
    submitError,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    getCurrentStepMeta,
    totalSteps,
  } = useCheckoutForm()

  // Redirect если корзина пустая
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  const stepMeta = getCurrentStepMeta()
  const giftWrap = form.watch('gift_wrap') as boolean | undefined

  // Если корзина пустая, показываем loading
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Оформление заказа
          </h1>
          <p className="text-gray-600 mt-2">
            Заполните форму для оформления заказа
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepMeta={stepMeta}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Forms Column */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Contact */}
              {currentStep === 1 && <ContactForm form={form} />}

              {/* Step 2: Delivery */}
              {currentStep === 2 && <DeliveryForm form={form} />}

              {/* Step 3: Recipient */}
              {currentStep === 3 && <RecipientForm form={form} />}

              {/* Step 4: Payment */}
              {currentStep === 4 && <PaymentMethodSelector form={form} />}

              {/* Ошибка оформления заказа */}
              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {submitError}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {/* Back Button */}
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-8 py-3 rounded-lg border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    ← Назад
                  </button>
                )}

                {/* Next/Submit Button */}
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="flex-1 px-8 py-3 rounded-lg bg-pink-600 text-white font-semibold hover:bg-pink-700 transition-all"
                  >
                    Далее →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-8 py-3 rounded-lg bg-pink-600 text-white font-semibold hover:bg-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-1">
            <OrderSummary giftWrap={giftWrap} />
          </div>
        </div>
      </div>
    </div>
  )
}
