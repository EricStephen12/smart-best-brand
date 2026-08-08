'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import SectionHeading from '@/components/SectionHeading'
import EditorialBackdrop from '@/components/EditorialBackdrop'

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

  return (
    <section className="relative bg-white py-16 sm:py-20 md:py-24 overflow-hidden border-t border-blue-950/5">
      <EditorialBackdrop text="Shop" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 sm:mb-14">
          <SectionHeading
            eyebrow="Shop"
            title="Best sellers"
            description="Popular pieces — or browse the full catalogue."
            className="!mb-0"
          />
          <Link
            href="/products"
            className="text-[11px] font-black tracking-[0.25em] uppercase text-sky-700 hover:text-blue-950 transition-colors shrink-0 sm:mb-2"
          >
            Browse all →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
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
                  <div className="relative aspect-square bg-[var(--brand-bg)] overflow-hidden mb-3 border border-blue-950/5">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width:768px) 50vw, 25vw"
                      />
                    ) : null}
                    {onSale ? (
                      <span className="absolute top-3 left-3 bg-sky-600 text-white text-[9px] font-black tracking-widest uppercase px-2 py-1">
                        Sale
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[10px] font-medium text-stone-400 tracking-[0.18em] uppercase mb-1">
                    {category || product.brand?.name || 'Product'}
                  </p>
                  <h3 className="text-sm font-medium text-blue-950 line-clamp-2 group-hover:text-sky-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-blue-950/70 mt-1 font-medium">
                    ₦{display.toLocaleString()}
                    {onSale ? (
                      <span className="ml-2 text-stone-300 line-through text-xs font-normal">
                        ₦{minPrice.toLocaleString()}
                      </span>
                    ) : null}
                  </p>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex border border-blue-950 text-blue-950 px-10 py-3.5 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-blue-950 hover:text-white transition-colors"
          >
            View all products
          </Link>
        </div>
      </div>
    </section>
  )
}
