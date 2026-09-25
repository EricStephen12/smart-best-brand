'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import EditorialBackdrop from '@/components/EditorialBackdrop'
import { useSiteSettings } from '@/components/site-settings-context'

export default function StorySection({ brandCount }: { brandCount?: number }) {
  const containerRef = useRef(null)
  const settings = useSiteSettings()

  const storyBadge = settings.storyBadge || 'Our Story'
  const storyTitle = settings.storyTitle || 'The Real Thing, Delivered to Your Door.'
  const storyText = settings.storyText || "We built Smart Best Brands around one frustration: too many Nigerians were paying full price for fake foam. So we went directly to the source — authorised distributors for Mouka, Vitafoam, Royal Foam, and more — and made genuine quality accessible to every home."
  const secondaryBadge = settings.storySecondaryBadge || 'Our Promise'
  const secondaryTitle = settings.storySecondaryTitle || 'Factory-Direct. Sealed. Guaranteed.'
  const secondaryText = settings.storySecondaryText || 'Every piece leaves the factory in its original packaging and arrives at your door the same way — warranty card intact, seal unbroken. No middlemen, no substitutions, no surprises.'
  const mainImage = settings.storyImageUrl || '/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg'

  // Stats
  const statOneBadge = settings.statOneBadge || 'Partner Brands'
  const statOneValue = settings.statOneValue || (brandCount ? brandCount.toString().padStart(2, '0') : '07')
  const statTwoBadge = settings.statTwoBadge || 'Original Stock'
  const statTwoValue = settings.statTwoValue || '100%'
  const storyLinkLabel = settings.storyLinkLabel || 'Our full story →'

  return (
    <section ref={containerRef} id="story" className="relative py-16 sm:py-24 md:py-28 bg-white overflow-hidden border-y border-blue-950/5 scroll-mt-16">
      <EditorialBackdrop text="Rest" size="xl" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Editorial Layout 1 */}
        <div id="story-1" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16 sm:mb-24 md:mb-28 scroll-mt-24">

          {/* Main Large Image */}
          <div className="lg:col-span-7">
            <RevealImage
              src={mainImage}
              alt={storyTitle}
              className="aspect-[4/5] md:aspect-[16/10] rounded-none"
            />
          </div>

          {/* Overlapping Text Content */}
          <div className="lg:col-span-5 lg:-ml-24 z-10 relative">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="bg-white/95 backdrop-blur-md border border-blue-950/5 p-8 sm:p-12 md:p-16 rounded-none space-y-6 sm:space-y-8 shadow-xl shadow-blue-950/5"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-1 h-8 bg-sky-600 rounded-full" />
                <span className="text-sm sm:text-xl md:text-2xl font-black tracking-[0.5em] text-sky-600 uppercase">{storyBadge}</span>
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-blue-950 tracking-[-0.04em] leading-[0.9]">
                {storyTitle}
              </h3>
              <p className="text-lg text-stone-500 font-medium leading-[1.6]">
                {storyText}
              </p>
              <div className="pt-4">
                <div className="w-12 h-[1px] bg-blue-950"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Editorial Layout 2 */}
        <div id="story-2" className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center scroll-mt-24">

          {/* Content Left */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1 h-8 bg-sky-600 rounded-full" />
                  <span className="text-sm sm:text-xl md:text-2xl font-black tracking-[0.5em] text-sky-600 uppercase">{secondaryBadge}</span>
                </div>
                <h3 className="text-4xl md:text-6xl font-black text-blue-950 tracking-[-0.04em] leading-[0.9]">
                  {secondaryTitle}
                </h3>
              </div>

              <p className="text-lg text-stone-500 font-medium leading-[1.6]">
                {secondaryText}
              </p>

              <div id="story-stats" className="flex gap-12 scroll-mt-24">
                <div>
                  <h4 className="font-black text-4xl text-blue-950 leading-none mb-2">{statOneValue}</h4>
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{statOneBadge}</p>
                </div>
                <div>
                  <h4 className="font-black text-4xl text-blue-950 leading-none mb-2">{statTwoValue}</h4>
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{statTwoBadge}</p>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/about" className="text-[10px] font-black tracking-[0.3em] text-blue-950 uppercase border-b-2 border-sky-600 pb-2 hover:text-sky-600 transition-colors inline-block">
                  {storyLinkLabel}
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Images Right */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8">
                <RevealImage
                  src="/images/hero/Luxury MasterBedroom - Nesreen Maher.jpeg"
                  alt="A bedroom styled with quality furniture and bedding"
                  className="aspect-square rounded-xl"
                />
              </div>
              <div className="col-span-4 self-end">
                <RevealImage
                  src="/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg"
                  alt="Premium bedding and mattress texture"
                  className="aspect-[3/4] rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

function RevealImage({ src, alt, className }: { src: string, alt: string, className: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref} className={`relative overflow-hidden group ${className}`}>
      <motion.div
        initial={{ scale: 1.2 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </motion.div>
      <motion.div
        initial={{ translateZ: 0, scaleY: 1 }}
        animate={isInView ? { scaleY: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="absolute inset-0 bg-blue-950 origin-top z-10"
      />
    </div>
  )
}
