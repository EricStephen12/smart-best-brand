'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSiteSettings } from '@/components/site-settings-context'
import { HERO_BANNERS, ANIMATION } from '@/lib/constants'

export type HeroBanner = {
  id: string
  title: string
  subtitle: string | null
  imageUrl: string
  ctaLabel: string | null
  ctaHref: string | null
}

// Floating price tags that appear over the hero image
const PRICE_TAGS = [
  { label: '₦95,000', position: 'bottom-[22%] left-[8%]', delay: 0.3 },
  { label: '₦210,000', position: 'top-[38%] right-[12%]', delay: 0.5 },
  { label: '₦48,500', position: 'bottom-[30%] right-[28%]', delay: 0.7 },
]

export default function HeroSection({ banners = [] }: { banners?: HeroBanner[] }) {
  const settings = useSiteSettings()
  const [liveBanners, setLiveBanners] = useState<HeroBanner[]>(banners)

  // Listen for iframe live preview banner updates from site settings customizer
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

  const activeBanners = liveBanners.filter((b: any) => b.isActive !== false)
  const firstBanner = activeBanners[0]
  const primarySlide: HeroBanner = {
    id: firstBanner?.id || 'hero-primary',
    title: settings.heroTitle || firstBanner?.title || 'Quality mattresses, pillows & furniture',
    subtitle: settings.heroSubtitle ?? firstBanner?.subtitle ?? 'Authentic comfort for Nigerian homes',
    imageUrl: firstBanner?.imageUrl || '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
    ctaLabel: settings.heroCtaLabel || firstBanner?.ctaLabel || 'Shop products',
    ctaHref: settings.heroCtaHref || firstBanner?.ctaHref || '/products',
  }

  const additionalSlides = activeBanners.length > 1 ? activeBanners.slice(1) : HERO_BANNERS.slice(1)
  const slides = [primarySlide, ...additionalSlides]
  const [index, setIndex] = useState(0)

  useEffect(() => { setIndex(0) }, [settings.heroTitle, settings.heroSubtitle, settings.heroCtaLabel, settings.heroCtaHref])
  useEffect(() => { setIndex(0) }, [slides.length])

  useEffect(() => {
    if (slides.length < 2) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, ANIMATION.heroAutoPlayIntervalMs)
    return () => window.clearInterval(id)
  }, [slides.length])

  const go = (dir: -1 | 1) => setIndex((i) => (i + dir + slides.length) % slides.length)
  const slide = slides[Math.min(index, slides.length - 1)]

  return (
    <section id="hero" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-neutral-100 scroll-mt-16">
      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle gradient overlay — lighter than before */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/55 pointer-events-none" />

      {/* Floating price tags */}
      {PRICE_TAGS.map((tag, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: tag.delay, duration: 0.5 }}
          className={`absolute z-20 hidden sm:flex ${tag.position}`}
        >
          <span className="bg-white/95 backdrop-blur-sm text-neutral-900 text-[13px] font-semibold px-4 py-2 rounded-full shadow-lg shadow-black/10">
            {tag.label}
          </span>
        </motion.div>
      ))}

      {/* Main copy — left-aligned like Woodora */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 sm:px-12 lg:px-20 pb-16 sm:pb-20 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={`copy-${slide.id}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-white leading-[0.92] tracking-[-0.03em] mb-6 uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {slide.title}
            </h1>
            {slide.subtitle ? (
              <p className="text-sm sm:text-base text-white/75 max-w-md leading-relaxed mb-8">
                {slide.subtitle}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={slide.ctaHref || '/products'}
                className="inline-flex items-center bg-white text-neutral-900 px-7 py-3.5 text-sm font-semibold rounded-full hover:bg-neutral-100 transition-colors duration-300"
              >
                {slide.ctaLabel || 'Shop Now'}
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center border border-white/60 text-white px-7 py-3.5 text-sm font-medium rounded-full hover:bg-white/10 transition-colors duration-300"
              >
                Our story
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide controls */}
      {slides.length > 1 ? (
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1 text-white/80">
            <button type="button" aria-label="Previous slide" onClick={() => go(-1)}
              className="p-1.5 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button type="button" aria-label="Next slide" onClick={() => go(1)}
              className="p-1.5 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
