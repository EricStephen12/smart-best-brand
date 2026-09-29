'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSiteSettings } from '@/components/site-settings-context'
import { STORY_CONTENT } from '@/lib/constants'

export default function StorySection({ brandCount }: { brandCount?: number }) {
  const containerRef = useRef(null)
  const settings = useSiteSettings()

  const storyBadge = settings.storyBadge || STORY_CONTENT.badge
  const storyTitle = settings.storyTitle || STORY_CONTENT.title
  const storyText = settings.storyText || STORY_CONTENT.text
  const secondaryBadge = settings.storySecondaryBadge || STORY_CONTENT.secondaryBadge
  const secondaryTitle = settings.storySecondaryTitle || STORY_CONTENT.secondaryTitle
  const secondaryText = settings.storySecondaryText || STORY_CONTENT.secondaryText
  const mainImage = settings.storyImageUrl || '/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg'

  const statOneBadge = settings.statOneBadge || STORY_CONTENT.stats.statOneBadge
  const statOneValue = settings.statOneValue || (brandCount ? brandCount.toString().padStart(2, '0') : STORY_CONTENT.stats.statOneValue)
  const statTwoBadge = settings.statTwoBadge || STORY_CONTENT.stats.statTwoBadge
  let customStyleComfort: any = null
  try {
    if (settings.styleComfortJson) {
      customStyleComfort = JSON.parse(settings.styleComfortJson)
    }
  } catch {}

  const secondaryImage = customStyleComfort?.storySecondaryImage || '/images/hero/Luxury MasterBedroom - Nesreen Maher.jpeg'
  const statTwoValue = settings.statTwoValue || STORY_CONTENT.stats.statTwoValue
  const storyLinkLabel = settings.storyLinkLabel || STORY_CONTENT.storyLinkLabel

  return (
    <section ref={containerRef} id="story" className="bg-[#F2ECE2] py-20 sm:py-24 md:py-28 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Layout 1 — Image + overlapping text */}
        <div id="story-1" className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20 sm:mb-28">
          {/* Image */}
          <div className="lg:order-1">
            <RevealImage
              src={mainImage}
              alt={storyTitle}
              className="aspect-[4/5] md:aspect-[5/4] rounded-3xl"
            />
          </div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="lg:order-2 space-y-6"
          >
            <p className="section-label">{storyBadge}</p>
            <h2 className="section-title">{storyTitle}</h2>
            <p className="text-base text-neutral-500 leading-relaxed">
              {storyText}
            </p>
            <div className="w-10 h-px bg-neutral-300" />

            {/* Stats */}
            <div className="flex gap-10 pt-2">
              <div>
                <p className="text-4xl font-semibold text-neutral-900 font-display tracking-tight">{statOneValue}</p>
                <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest mt-1">{statOneBadge}</p>
              </div>
              <div>
                <p className="text-4xl font-semibold text-neutral-900 font-display tracking-tight">{statTwoValue}</p>
                <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest mt-1">{statTwoBadge}</p>
              </div>
            </div>

            <Link href="/about" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-neutral-500 transition-colors">
              {storyLinkLabel || 'Learn more'} <span>→</span>
            </Link>
          </motion.div>
        </div>

        {/* Layout 2 — "Style Meets Comfort" row */}
        <div id="story-2" className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            viewport={{ once: true }}
            className="space-y-6 order-2 lg:order-1"
          >
            <p className="section-label">{secondaryBadge}</p>
            <h2 className="section-title">{secondaryTitle}</h2>
            <p className="text-base text-neutral-500 leading-relaxed">{secondaryText}</p>

            <Link href="/about" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-neutral-500 transition-colors">
              {storyLinkLabel || 'Learn more'} <span>→</span>
            </Link>
          </motion.div>

          {/* Images right */}
          <div className="order-1 lg:order-2 grid grid-cols-12 gap-4">
            <div className="col-span-7">
              <RevealImage
                src={secondaryImage}
                alt="Premium bedroom furniture"
                className="aspect-square rounded-3xl"
              />
            </div>
            <div className="col-span-5 self-end">
              <RevealImage
                src="/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg"
                alt="Premium mattress"
                className="aspect-[3/4] rounded-2xl"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

function RevealImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} className={`relative overflow-hidden group ${className}`}>
      <motion.div
        initial={{ scale: 1.12 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
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
        initial={{ scaleY: 1 }}
        animate={isInView ? { scaleY: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="absolute inset-0 bg-[#E5DCCE] origin-top z-10"
      />
    </div>
  )
}
