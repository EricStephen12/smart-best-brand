'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSiteSettings } from '@/components/site-settings-context'

export default function PromoBanner() {
  const settings = useSiteSettings()
  const [imageError, setImageError] = useState(false)

  const badge = settings.promoBadge ?? 'For Nigerian homes'
  const title = settings.promoTitle ?? 'Comfort that feels like home'
  const ctaLabel = settings.promoCtaLabel ?? 'Discover now'
  const ctaHref = settings.promoCtaHref || '/products'
  const imageUrl = settings.promoImageUrl || ''

  return (
    <section id="promo" className="relative overflow-hidden scroll-mt-16 mx-5 sm:mx-8 lg:mx-12 my-8 rounded-3xl min-h-[420px] sm:min-h-[520px] flex items-center bg-neutral-900">
      {imageUrl && !imageError ? (
        <Image
          src={imageUrl}
          alt={title || 'Promo banner'}
          fill
          unoptimized
          className="object-cover"
          sizes="100vw"
          onError={() => setImageError(true)}
        />
      ) : null}

      {/* Warm dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 rounded-3xl" />

      <div className="relative z-10 px-10 sm:px-16 max-w-xl">
        {badge ? <p className="section-label text-white/70 mb-4">{badge}</p> : null}
        {title ? (
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight leading-[1.05] mb-6">
            {title}
          </h2>
        ) : null}
        {ctaLabel ? (
          <Link
            href={ctaHref}
            className="inline-flex items-center bg-white text-neutral-900 px-7 py-3.5 text-sm font-semibold rounded-full hover:bg-neutral-100 transition-colors"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  )
}
