'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSiteSettings } from '@/components/site-settings-context'
import { FEATURED_SECTION } from '@/lib/constants'

type FeaturedProduct = {
  id: string
  name: string
  slug: string
  images: string[]
  brand?: { name: string } | null
  categories?: Array<{ category?: { name: string } | null }>
  variants: Array<{ price: number; promoPrice: number | null }>
}

export default function FeaturedProducts({ products }: { products: FeaturedProduct[] }) {
  if (!products.length) return null
  const settings = useSiteSettings()
  const featuredTitle = settings.featuredTitle || FEATURED_SECTION.title
  const featuredDescription = settings.featuredDescription || FEATURED_SECTION.description

  return (
    <section id="featured" className="bg-[#F2ECE2] py-20 sm:py-24 md:py-28 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section header — Woodora style */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-2">
              Featured
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 uppercase font-sans">
              {featuredTitle}
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-500 transition-colors pb-1 border-b border-neutral-900 hover:border-neutral-500 shrink-0 self-start sm:self-end"
          >
            <span>Browse all</span>
            <span className="text-sm">→</span>
          </Link>
        </div>

        {/* Product grid — Woodora clean cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8 sm:gap-x-6 sm:gap-y-10">
          {products.map((product, index) => {
            const prices = product.variants?.map((v) => v.price) || [0]
            const promos =
              product.variants
                ?.map((v) => v.promoPrice)
                .filter((p): p is number => typeof p === 'number' && p > 0) || []
            const minPrice = Math.min(...prices)
            const minPromo = promos.length ? Math.min(...promos) : Infinity
            const display = minPromo !== Infinity ? minPromo : minPrice
            const onSale = minPromo !== Infinity && minPromo < minPrice
            const category = product.categories?.[0]?.category?.name

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.25) }}
              >
                <Link href={`/products/${product.slug}`} className="group block">
                  {/* Clean image canvas */}
                  <div className="relative aspect-square bg-[#F5F3EF] rounded-2xl overflow-hidden mb-3">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-neutral-200" />
                      </div>
                    )}

                    {/* Sale badge */}
                    {onSale ? (
                      <span className="absolute top-3 left-3 bg-brand-primary text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Sale
                      </span>
                    ) : null}

                    {/* Woodora round plus button */}
                    <div className="absolute bottom-3 right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-light shadow-sm group-hover:scale-110 active:scale-95 transition-all duration-300">
                      <span className="leading-none text-base font-light">+</span>
                    </div>
                  </div>

                  {/* Line 1: Title on left, Price on right */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs sm:text-[13px] font-bold text-neutral-900 uppercase tracking-tight font-sans line-clamp-1 group-hover:text-neutral-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] font-bold text-neutral-900 font-sans shrink-0">
                      ₦{display.toLocaleString()}
                    </p>
                  </div>

                  {/* Line 2: Brand/Category on left, Original price on right */}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-[11px] font-medium text-neutral-400 font-sans truncate">
                      {category || product.brand?.name || 'Original'}
                    </p>
                    {onSale ? (
                      <span className="text-[11px] text-neutral-400 line-through font-sans shrink-0">
                        ₦{minPrice.toLocaleString()}
                      </span>
                    ) : null}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* See all CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/products"
            className="btn-primary"
          >
            View all products
          </Link>
        </div>
      </div>
    </section>
  )
}
