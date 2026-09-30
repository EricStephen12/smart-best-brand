'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSiteSettings } from '@/components/site-settings-context'

export type HeroBanner = {
  id: string
  title: string
  subtitle: string | null
  imageUrl: string
  ctaLabel: string | null
  ctaHref: string | null
}

export default function HeroSection({ banners = [] }: { banners?: HeroBanner[] }) {
  const settings = useSiteSettings()
  const [liveBanners, setLiveBanners] = useState<HeroBanner[]>(banners)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Listen for real-time live preview banner updates from site settings customizer iframe
  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.data?.type === 'UPDATE_SITE_SETTINGS_PREVIEW' && Array.isArray(e.data.banners)) {
        setLiveBanners(e.data.banners)
      }
    }
    window.addEventListener('message', handleMsg)
    return () => window.removeEventListener('message', handleMsg)
  }, [])

  // Sync if banners prop updates from server
  useEffect(() => {
    if (banners && banners.length > 0) setLiveBanners(banners)
  }, [banners])

  // Build active slides list from liveBanners
  const activeBanners = liveBanners.filter((b) => b && (b.imageUrl || b.title))
  const slides = activeBanners.length > 0 ? activeBanners : [
    {
      id: 'default',
      imageUrl: liveBanners[0]?.imageUrl || banners[0]?.imageUrl || '',
      title: settings.heroTitle ?? '',
      subtitle: settings.heroSubtitle ?? '',
      ctaLabel: settings.heroCtaLabel ?? '',
      ctaHref: settings.heroCtaHref || '/products',
    }
  ]

  // Safe index within bounds
  const activeIndex = Math.min(currentIndex, Math.max(0, slides.length - 1))
  const currentSlide = slides[activeIndex]

  // Auto-play only if owner has 2 or more slides
  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % slides.length)
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section id="hero" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-neutral-900 scroll-mt-16">
      {/* Background Image */}
      {currentSlide?.imageUrl ? (
        <div className="absolute inset-0 transition-opacity duration-700">
          <Image
            key={currentSlide.id || activeIndex}
            src={currentSlide.imageUrl}
            alt={currentSlide.title || 'Hero'}
            fill
            priority
            unoptimized
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-neutral-900" />
      )}

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/60 pointer-events-none" />

      {/* Main Copy */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-16 sm:pb-20 max-w-4xl">
        <div>
          {currentSlide?.title ? (
            <h1
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-white leading-[0.92] tracking-[-0.03em] mb-6 uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {currentSlide.title}
            </h1>
          ) : null}

          {currentSlide?.subtitle ? (
            <p className="text-sm sm:text-base text-white/80 max-w-md leading-relaxed mb-8">
              {currentSlide.subtitle}
            </p>
          ) : null}

          {currentSlide?.ctaLabel ? (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={currentSlide.ctaHref || '/products'}
                className="inline-flex items-center bg-white text-neutral-900 px-7 py-3.5 text-sm font-semibold rounded-full hover:bg-neutral-100 transition-colors duration-300"
              >
                {currentSlide.ctaLabel}
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {/* Slide Navigation Controls (Only shown if owner has 2 or more slides) */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 right-6 sm:bottom-12 sm:right-12 z-20 flex items-center gap-3">
          {/* Indicators / Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id || idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === activeIndex ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-1 text-white/80 ml-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous slide"
              className="p-2 rounded-full bg-black/25 hover:bg-black/40 text-white backdrop-blur-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next slide"
              className="p-2 rounded-full bg-black/25 hover:bg-black/40 text-white backdrop-blur-sm transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
