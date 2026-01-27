// ✅ Order Success Page
// Страница подтверждения заказа

import Link from 'next/link'

interface OrderPageProps {
  params: Promise<{ orderNumber: string }>
}

/**
 * Страница успешного оформления заказа
 */
export default async function OrderSuccessPage({ params }: OrderPageProps) {
  const { orderNumber } = await params

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Заказ успешно оформлен!
          </h1>
          <p className="text-gray-600">
            Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время.
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-lg p-8 shadow-sm border mb-6">
          <div className="text-center mb-6 pb-6 border-b">
            <p className="text-sm text-gray-600 mb-2">Номер заказа</p>
            <p className="text-2xl font-bold text-pink-600">{orderNumber}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">
                  Подтверждение отправлено
                </p>
                <p className="text-sm text-gray-600">
                  Детали заказа отправлены на вашу электронную почту
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Что дальше?</p>
                <p className="text-sm text-gray-600">
                  Наш менеджер свяжется с вами в течение 15 минут для
                  подтверждения деталей
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Время доставки</p>
                <p className="text-sm text-gray-600">
                  Ваш заказ будет доставлен в указанное время
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 px-6 py-3 rounded-lg bg-pink-600 text-white font-semibold text-center hover:bg-pink-700 transition-all"
          >
            Вернуться на главную
          </Link>
          <Link
            href="/catalog"
            className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 font-semibold text-gray-700 text-center hover:bg-gray-50 transition-all"
          >
            Продолжить покупки
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Полезно знать:</strong> Вы можете отслеживать статус
            заказа в личном кабинете или по ссылке из письма с подтверждением.
          </p>
        </div>
      </div>
    </div>
  )
}
