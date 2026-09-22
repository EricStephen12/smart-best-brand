import React from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { getAllDeliveryLocations } from '@/actions/delivery-locations'
import { getSiteSettings } from '@/actions/site-settings'
import { brandNameParts } from '@/lib/site-settings'
import CheckoutClientWrapper from '@/components/CheckoutClientWrapper'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  const [locationsResult, siteSettings] = await Promise.all([
    getAllDeliveryLocations(),
    getSiteSettings(),
  ])
  const zones = locationsResult.success ? locationsResult.data : []
  const brand = brandNameParts(siteSettings.siteName)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Minimal checkout header ── */}
      <header className="border-b border-blue-950/8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-base font-black tracking-widest uppercase text-blue-950"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {brand.lead}
            <span className="text-sky-600">{brand.accent}</span>
          </Link>

          <div className="flex items-center gap-1.5 text-stone-400">
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure checkout</span>
          </div>

          <Link
            href="/products"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-blue-950 transition-colors"
          >
            ← Back to shop
          </Link>
        </div>
      </header>

      {/* ── Checkout body ── */}
      <div className="flex-1 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <CheckoutClientWrapper zones={zones || []} />
        </div>
      </div>

      {/* ── Minimal footer ── */}
      <footer className="border-t border-blue-950/8 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-5 text-[10px] font-medium text-stone-400">
          <span>© {new Date().getFullYear()} {siteSettings.siteName}</span>
          <Link href="/contact" className="hover:text-blue-950 transition-colors">Contact</Link>
          <Link href="/faqs" className="hover:text-blue-950 transition-colors">FAQs</Link>
        </div>
      </footer>
    </div>
  )
}
