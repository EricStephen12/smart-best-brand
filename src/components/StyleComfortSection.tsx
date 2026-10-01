'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useSiteSettings } from '@/components/site-settings-context'

export default function StyleComfortSection() {
  const settings = useSiteSettings()
  const [hasImageError, setHasImageError] = useState(false)
  
  let customData: any = null
  try {
    if (settings.styleComfortJson) {
      customData = JSON.parse(settings.styleComfortJson)
    }
  } catch {}

  const title = customData?.title ?? ''
  const description = customData?.description ?? ''
  const imageSrc = customData?.imageUrl || ''
  const imageAlt = customData?.imageAlt || ''
  const stats = (customData?.stats && Array.isArray(customData.stats))
    ? customData.stats
    : []

  return (
    <section id="style-comfort" className="bg-white py-20 sm:py-24 lg:py-32 scroll-mt-16">
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
              {title ? (
                <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-neutral-900 leading-[1.08] uppercase font-sans whitespace-pre-line">
                  {title}
                </h2>
              ) : null}

              {description ? (
                <p className="mt-6 sm:mt-7 text-xs sm:text-[13px] text-neutral-500 font-normal leading-relaxed max-w-md">
                  {description}
                </p>
              ) : null}
            </div>

            {/* Stats row below */}
            {stats.length > 0 && (
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
            )}
          </motion.div>

          {/* Right Column: Square clean image frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[560px] aspect-square overflow-hidden bg-neutral-100 rounded-2xl">
              {imageSrc && !hasImageError ? (
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 50vw"
                  onError={() => setHasImageError(true)}
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                  <span>No photo uploaded</span>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
