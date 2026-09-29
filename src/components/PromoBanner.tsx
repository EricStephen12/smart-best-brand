'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSiteSettings } from '@/components/site-settings-context'
import { PROMO_BANNER } from '@/lib/constants'

export default function PromoBanner() {
  const settings = useSiteSettings()

  const badge = settings.promoBadge || PROMO_BANNER.badge
  const title = settings.promoTitle || PROMO_BANNER.title
  const ctaLabel = settings.promoCtaLabel || PROMO_BANNER.ctaLabel
  const ctaHref = settings.promoCtaHref || PROMO_BANNER.ctaHref
  const imageUrl = settings.promoImageUrl || PROMO_BANNER.imageUrl

  return (
    <section id="promo" className="relative overflow-hidden scroll-mt-16 mx-5 sm:mx-8 lg:mx-12 my-8 rounded-3xl min-h-[420px] sm:min-h-[520px] flex items-center">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        sizes="100vw"
      />
      {/* Warm dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/20 rounded-3xl" />

      <div className="relative z-10 px-10 sm:px-16 max-w-xl">
        <p className="section-label text-white/60 mb-4">{badge}</p>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight leading-[1.05] mb-6">
          {title}
        </h2>
        <p className="text-sm text-white/65 mb-8 leading-relaxed max-w-sm">
          Premium mattresses, luxury furniture, and quality bedding — crafted for Nigerian homes.
        </p>
        <Link
          href={ctaHref}
          className="inline-flex items-center bg-white text-neutral-900 px-7 py-3.5 text-sm font-semibold rounded-full hover:bg-neutral-100 transition-colors"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  )
}
