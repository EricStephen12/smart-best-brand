'use client'

import { useSiteSettings } from '@/components/site-settings-context'
import { SHOP_HEADER } from '@/lib/constants'

export default function ProductsHeader() {
  const settings = useSiteSettings()
  const shopTitle = settings.shopPageTitle || SHOP_HEADER.title
  const shopTagline = settings.shopPageTagline || SHOP_HEADER.tagline

  return (
    <div id="products-header" className="border-b border-blue-950/5 bg-transparent pt-10 pb-0 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-8">
          <div>
            <p className="text-[10px] font-black tracking-[0.35em] uppercase text-[var(--brand-accent)] mb-2">
              {settings.siteName || 'Smart Best Brands'}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-neutral-900 tracking-tight leading-none">
              {shopTitle}
            </h1>
          </div>
          <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
            {shopTagline}
          </p>
        </div>
      </div>
    </div>
  )
}
