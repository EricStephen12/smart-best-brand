'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const CheckoutForm = dynamic(() => import('./CheckoutForm'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-7 space-y-4">
        <div className="h-64 bg-[var(--brand-bg)] border border-blue-950/5" />
        <div className="h-40 bg-[var(--brand-bg)] border border-blue-950/5" />
      </div>
      <div className="lg:col-span-5">
        <div className="h-80 bg-[var(--brand-bg)] border border-blue-950/5" />
      </div>
    </div>
  ),
})

interface CheckoutClientWrapperProps {
  zones: Array<{ id: string; name: string; basePrice: number }>
}

export default function CheckoutClientWrapper({ zones }: CheckoutClientWrapperProps) {
  return <CheckoutForm zones={zones} />
}
