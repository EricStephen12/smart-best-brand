'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import EditorialBackdrop from '@/components/EditorialBackdrop'

export type HeroBanner = {
  id: string
  title: string
  subtitle: string | null
  imageUrl: string
  ctaLabel: string | null
  ctaHref: string | null
}

const FALLBACKS: HeroBanner[] = [
  {
    id: 'fallback-1',
    title: 'Pure Comfort',
    subtitle: 'Mattresses, pillows & furniture for Nigerian homes.',
    imageUrl: '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
    ctaLabel: 'View the Collection',
    ctaHref: '/products',
  },
  {
    id: 'fallback-2',
    title: 'Rest Well',
    subtitle: 'Trusted brands. Clear pricing. Delivery you can count on.',
    imageUrl: '/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg',
    ctaLabel: 'Shop products',
    ctaHref: '/products',
  },
  {
    id: 'fallback-3',
    title: 'Live Better',
    subtitle: 'From bedroom to living space — comfort that fits your home.',
    imageUrl: '/images/hero/Luxury MasterBedroom - Nesreen Maher.jpeg',
    ctaLabel: 'Explore now',
    ctaHref: '/products',
  },
]

/** Full-bleed hero with title text + real multi-image slides. */
export default function HeroSection({ banners = [] }: { banners?: HeroBanner[] }) {
  const slides = banners.length > 0 ? banners : FALLBACKS
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [slides.length])

  useEffect(() => {
    if (slides.length < 2) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 6500)
    return () => window.clearInterval(id)
  }, [slides.length])

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + slides.length) % slides.length)
  }

  const slide = slides[Math.min(index, slides.length - 1)]

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-neutral-900">
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/30 pointer-events-none" />
      <EditorialBackdrop text="Comfort" light />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`copy-${slide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="text-[10px] sm:text-[11px] font-black tracking-[0.45em] uppercase text-white/70 mb-5">
              New collection
            </p>
            <h1 className="font-playfair text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-[-0.03em] text-white leading-[0.95]">
              {slide.title}
            </h1>
            {slide.subtitle ? (
              <p className="mt-5 text-sm sm:text-base text-white/80 max-w-lg mx-auto leading-relaxed font-medium">
                {slide.subtitle}
              </p>
            ) : null}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href={slide.ctaHref || '/products'}
                className="inline-flex border border-white/90 text-white px-7 sm:px-8 py-3.5 text-[11px] font-medium tracking-[0.14em] uppercase hover:bg-white hover:text-neutral-950 transition-colors duration-300"
              >
                {slide.ctaLabel || 'Shop new'}
              </Link>
              <Link
                href="/products"
                className="inline-flex border border-white/50 text-white/90 px-7 sm:px-8 py-3.5 text-[11px] font-medium tracking-[0.14em] uppercase hover:border-white hover:text-white transition-colors duration-300"
              >
                Shop all
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 ? (
        <div className="absolute bottom-8 right-6 sm:bottom-12 sm:right-12 z-20 flex items-center gap-4">
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
                onClick={() => setIndex(i)}
                className={`h-0.5 transition-all duration-300 ${
                  i === index ? 'w-8 bg-white' : 'w-4 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1 text-white/85">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(-1)}
              className="p-1.5 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(1)}
              className="p-1.5 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
