'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, MessageCircle, Copy } from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/contact-channels'
import { useSiteSettings } from '@/components/site-settings-context'
import toast from 'react-hot-toast'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  const method = searchParams.get('method')
  const settings = useSiteSettings()

  const bankName = settings.bankName || 'Moniepoint MFB / Zenith Bank'
  const bankAccountName = settings.bankAccountName || 'Smart Best Brands Nigeria'
  const bankAccountNumber = settings.bankAccountNumber || '—'

  const copyAccount = () => {
    if (settings.bankAccountNumber) {
      navigator.clipboard.writeText(settings.bankAccountNumber)
      toast.success('Account number copied!')
    }
  }

  return (
    <div className="min-h-screen bg-white pt-24 sm:pt-28 pb-20 border-t border-blue-950/5 flex items-center justify-center">
      <div className="max-w-lg w-full px-4 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>

        <p className="text-[11px] font-black tracking-[0.35em] uppercase text-sky-600 mb-4">
          {settings.siteName || 'Smart Best Brands'}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-blue-950 tracking-tight mb-4">
          {method === 'PAYSTACK'
            ? 'Payment confirmed.'
            : method === 'BANK_TRANSFER'
            ? 'Order reserved.'
            : 'Order placed.'}
        </h1>

        {orderNumber ? (
          <p className="text-sm text-stone-500 mb-2">
            Order reference:{' '}
            <span className="font-mono font-bold text-blue-950 bg-stone-100 px-2 py-0.5 select-all">
              {orderNumber}
            </span>
          </p>
        ) : null}

        {/* Bank transfer details */}
        {method === 'BANK_TRANSFER' ? (
          <div className="my-8 p-5 bg-stone-50 border border-blue-950/10 text-left space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                Bank Transfer Details
              </span>
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2 py-0.5 border border-amber-200">
                Transfer Pending
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-1">Bank</p>
                <p className="font-semibold text-blue-950">{bankName}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-1">Account Name</p>
                <p className="font-semibold text-blue-950">{bankAccountName}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-1">Account Number</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-lg text-blue-950 tracking-widest select-all">
                    {bankAccountNumber}
                  </span>
                  {settings.bankAccountNumber && (
                    <button
                      type="button"
                      onClick={copyAccount}
                      className="p-1.5 border border-stone-200 hover:border-blue-950 text-stone-400 hover:text-blue-950 transition-colors"
                      title="Copy account number"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              {orderNumber && (
                <div className="sm:col-span-2 pt-3 border-t border-blue-950/8">
                  <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-1">Transfer Narration</p>
                  <p className="font-mono font-bold text-sky-700 select-all">{orderNumber}</p>
                </div>
              )}
            </div>
            <p className="text-[11px] text-stone-500 border-t border-blue-950/8 pt-3 leading-relaxed">
              Include your order reference as the transfer narration. We'll dispatch once the transfer reflects.
            </p>
          </div>
        ) : null}

        {/* Status message */}
        <p className="text-stone-500 text-sm mb-8 leading-relaxed max-w-md mx-auto">
          {method === 'WHATSAPP'
            ? 'Your order has been saved. Tap below to confirm details with our team on WhatsApp.'
            : method === 'BANK_TRANSFER'
            ? 'An order confirmation has been emailed to you. Your order will be dispatched once the transfer reflects.'
            : 'Payment received. An official receipt has been sent to your email and your order is being processed.'}
        </p>

        {/* WhatsApp confirm CTA */}
        {orderNumber && (
          <div className="mb-8">
            <a
              href={
                getWhatsAppUrl(
                  `Hello ${settings.siteName || 'Smart Best Brands'}, I have placed order ${orderNumber} (${method || 'Online'}). Please confirm my order details.`
                ) ?? '#'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#128C7E] hover:bg-[#0e7568] text-white px-7 py-3.5 text-xs font-black uppercase tracking-wider transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Confirm on WhatsApp
            </a>
          </div>
        )}

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center bg-blue-950 text-white px-8 py-3.5 text-[11px] font-black tracking-[0.18em] uppercase hover:bg-sky-700 transition-colors"
          >
            View my orders
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-950/20 border-t-blue-950 rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
