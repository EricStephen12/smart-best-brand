'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  const method = searchParams.get('method')

  return (
    <div className="min-h-screen bg-white pt-24 sm:pt-28 pb-20 border-t border-blue-950/5 flex items-center justify-center">
      <div className="max-w-lg w-full px-4 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-6" />

        <p className="text-[11px] font-black tracking-[0.35em] uppercase text-sky-600 mb-4">
          Checkout
        </p>
        <h1 className="font-playfair text-3xl sm:text-4xl font-semibold text-blue-950 tracking-tight mb-4">
          {method === 'PAYSTACK' ? 'Payment received' : 'Order placed'}
        </h1>

        {orderNumber ? (
          <p className="text-sm text-stone-500 mb-2">
            Order number:{' '}
            <span className="font-medium text-blue-950">{orderNumber}</span>
          </p>
        ) : null}

        <p className="text-stone-500 text-sm mb-10 leading-relaxed max-w-md mx-auto">
          {method === 'WHATSAPP'
            ? 'We saved your order. Continue on WhatsApp if the chat opened, or message us with your order number.'
            : 'Thanks — we’re processing your order and will update you by email.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center bg-blue-950 text-white px-8 py-3.5 text-[11px] font-black tracking-[0.18em] uppercase hover:bg-sky-700 transition-colors"
          >
            View orders
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center border border-blue-950 text-blue-950 px-8 py-3.5 text-[11px] font-black tracking-[0.18em] uppercase hover:bg-blue-950 hover:text-white transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-stone-500">
          Loading…
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
