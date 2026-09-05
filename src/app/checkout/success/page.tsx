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
          {method === 'PAYSTACK'
            ? 'Payment received'
            : method === 'BANK_TRANSFER'
            ? 'Order reserved'
            : 'Order placed'}
        </h1>

        {orderNumber ? (
          <p className="text-sm text-stone-500 mb-2">
            Order number:{' '}
            <span className="font-mono font-bold text-blue-950 bg-stone-100 px-2 py-0.5">{orderNumber}</span>
          </p>
        ) : null}

        {method === 'BANK_TRANSFER' ? (
          <div className="my-6 p-5 bg-stone-50 border border-blue-950/10 text-left rounded-none space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                Direct Bank Transfer Details
              </span>
              <span className="text-[9px] font-bold text-sky-800 uppercase tracking-widest bg-sky-50 px-2 py-0.5 border border-sky-200">
                Pending Transfer
              </span>
            </div>
            <div className="text-xs space-y-1.5 text-blue-950 pt-1">
              <p><strong className="text-stone-500">Bank:</strong> Moniepoint MFB / Zenith Bank</p>
              <p><strong className="text-stone-500">Account Name:</strong> Smart Best Brands Nigeria</p>
              <p className="flex items-center gap-2">
                <strong className="text-stone-500">Account Number:</strong>
                <span className="font-mono font-bold text-sm bg-white px-2.5 py-1 border border-blue-950/20 select-all">08064619479</span>
              </p>
              <p className="flex items-center gap-2 pt-1 border-t border-blue-950/5">
                <strong className="text-stone-500">Transfer Narration:</strong>
                <span className="font-mono font-bold text-sky-700 select-all">{orderNumber || 'Order Number'}</span>
              </p>
            </div>
            <p className="text-[11px] text-stone-500 border-t border-blue-950/8 pt-2 leading-relaxed">
              Kindly ensure your order reference is included in your bank transfer narration so our fulfillment desk can immediately verify and dispatch your package.
            </p>
          </div>
        ) : null}

        <p className="text-stone-500 text-sm mb-10 leading-relaxed max-w-md mx-auto">
          {method === 'WHATSAPP'
            ? 'We saved your order. Continue on WhatsApp if the chat opened, or message us with your order number.'
            : method === 'BANK_TRANSFER'
            ? 'An official invoice and order confirmation has been emailed to you. Your order will be dispatched once the transfer reflects.'
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
