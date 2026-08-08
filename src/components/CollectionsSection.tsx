'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import SectionHeading from '@/components/SectionHeading'
import EditorialBackdrop from '@/components/EditorialBackdrop'

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

  return (
    <section className="relative bg-white py-16 sm:py-20 md:py-24 border-t border-blue-950/5 overflow-hidden">
      <EditorialBackdrop text="Collect" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our collections"
          description="Mattresses, pillows, furniture — pick a collection and start shopping."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
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
                  <div className="relative aspect-square bg-white overflow-hidden mb-3 border border-blue-950/5">
                    <Image
                      src={image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width:768px) 50vw, 25vw"
                    />
                  </div>
                  <p className="text-sm font-semibold tracking-[0.12em] uppercase text-blue-950">
                    {item.name}
                  </p>
                  <p className="mt-1 text-[11px] text-sky-700 tracking-wide group-hover:underline underline-offset-4">
                    Shop now
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
