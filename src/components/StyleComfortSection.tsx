'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useSiteSettings } from '@/components/site-settings-context'
import { STYLE_COMFORT_CONTENT, CURATED_COMBOS_SLIDES } from '@/lib/constants'

export default function StyleComfortSection() {
  const settings = useSiteSettings()
  
  let customData: any = null
  try {
    if (settings.styleComfortJson) {
      customData = JSON.parse(settings.styleComfortJson)
    }
  } catch {}

  const title = customData?.title || STYLE_COMFORT_CONTENT.title
  const description = customData?.description || settings.storySecondaryText || STYLE_COMFORT_CONTENT.description
  const imageSrc = customData?.imageUrl || STYLE_COMFORT_CONTENT.imageUrl
  const imageAlt = customData?.imageAlt || STYLE_COMFORT_CONTENT.imageAlt
  const stats = (customData?.stats && Array.isArray(customData.stats) && customData.stats.length > 0)
    ? customData.stats
    : STYLE_COMFORT_CONTENT.stats
  const slides = (customData?.slides && Array.isArray(customData.slides) && customData.slides.length > 0)
    ? customData.slides
    : CURATED_COMBOS_SLIDES

  const [comboIndex, setComboIndex] = useState(0)
  const total = slides.length
  const slide = slides[comboIndex] || slides[0]

  const prev = () => setComboIndex((i) => (i - 1 + total) % total)
  const next = () => setComboIndex((i) => (i + 1) % total)

  return (
    <>
      {/* ── Section 1: Style Meets Comfort (Woodora Exact) ── */}
      <section className="bg-white py-20 sm:py-24 lg:py-32 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Column: Heading, description, and stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-neutral-900 leading-[1.08] uppercase font-sans whitespace-pre-line">
                  {title}
                </h2>

                <p className="mt-6 sm:mt-7 text-xs sm:text-[13px] text-neutral-500 font-normal leading-relaxed max-w-md">
                  {description}
                </p>
              </div>

              {/* Stats row below */}
              <div className="mt-16 sm:mt-24 lg:mt-28 grid grid-cols-2 gap-8 sm:gap-12 max-w-md">
                {stats.map((stat: { value: string; label: string }, idx: number) => (
                  <div key={idx}>
                    <p className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-neutral-900 leading-none tracking-tight">
                      {stat.value}
                    </p>
                    <p className="mt-2.5 text-xs text-neutral-500 leading-relaxed font-normal">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Square clean image frame (no heavy radius) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[560px] aspect-square overflow-hidden bg-neutral-100">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  )
}
