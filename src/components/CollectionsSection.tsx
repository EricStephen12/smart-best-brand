'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSiteSettings } from '@/components/site-settings-context'
import { COLLECTIONS_SECTION } from '@/lib/constants'

export type CollectionTile = {
  id: string
  name: string
  href: string
  imageUrl: string | null
}

const FALLBACK_IMAGES = [
  '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
  '/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg',
  '/images/hero/Luxury MasterBedroom - Nesreen Maher.jpeg',
  '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
]

export default function CollectionsSection({ collections }: { collections: CollectionTile[] }) {
  if (!collections.length) return null
  const settings = useSiteSettings()
  const collectionsTitle = settings.collectionsTitle || COLLECTIONS_SECTION.title
  const collectionsDescription = settings.collectionsDescription || COLLECTIONS_SECTION.description

  return (
    <section id="collections" className="bg-white py-20 sm:py-24 md:py-28 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="section-label mb-3">{collectionsDescription}</p>
          <h2 className="section-title">{collectionsTitle}</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {collections.map((item, index) => {
            const image = item.imageUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.24) }}
              >
                <Link href={item.href} className="group block">
                  <div className="relative aspect-[3/4] bg-[#F2ECE2] overflow-hidden mb-4 rounded-2xl">
                    <Image
                      src={image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      sizes="(max-width:768px) 50vw, 25vw"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-500 flex items-end justify-center pb-5 rounded-2xl">
                      <span className="bg-white text-neutral-900 text-xs font-semibold px-5 py-2 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Shop now
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-neutral-900 text-center tracking-wide">
                    {item.name}
                  </p>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
