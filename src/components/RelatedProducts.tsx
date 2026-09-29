'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/lib/wishlist-context'

type RelatedProduct = {
  id: string
  name: string
  slug: string
  images: string[]
  brand?: { name: string } | null
  categories?: Array<{ category?: { name: string } | null }>
  variants: Array<{ price: number; promoPrice: number | null }>
}

export default function RelatedProducts({
  products,
  categoryLabel,
}: {
  products: RelatedProduct[]
  categoryLabel?: string
}) {
  const { isInWishlist, toggleWishlist } = useWishlist()

  if (!products.length) return null

  return (
    <section className="py-20 sm:py-24 bg-white border-t border-neutral-100 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-normal font-serif text-neutral-900 tracking-tight">
            You may also like
          </h2>
          <Link
            href="/products"
            className="text-xs font-semibold uppercase tracking-wider text-neutral-900 pb-1 border-b border-neutral-900 hover:text-neutral-500 hover:border-neutral-500 transition-colors"
          >
            Browse all →
          </Link>
        </div>

        {/* 4-Card Grid (Woodora / Luma & Living Style) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-8 sm:gap-x-6">
          {products.slice(0, 4).map((product) => {
            const prices = product.variants?.map((v) => v.price) || [0]
            const promos =
              product.variants
                ?.map((v) => v.promoPrice)
                .filter((p): p is number => typeof p === 'number' && p > 0) || []
            const minPrice = Math.min(...prices)
            const minPromo = promos.length ? Math.min(...promos) : Infinity
            const display = minPromo !== Infinity ? minPromo : minPrice
            const onSale = minPromo !== Infinity && minPromo < minPrice
            const isSaved = isInWishlist(product.id)

            return (
              <div key={product.id} className="group block">
                <Link href={`/products/${product.slug}`} className="block">
                  {/* Clean image canvas */}
                  <div className="relative aspect-square bg-[#F5F3EF] rounded-2xl overflow-hidden mb-3">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width:640px) 50vw, 25vw"
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

                    {/* Wishlist toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        toggleWishlist(product)
                      }}
                      className="absolute top-3 right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-neutral-800 hover:bg-white transition-all shadow-sm"
                      aria-label="Save to wishlist"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                          isSaved ? 'fill-current text-rose-600' : 'text-neutral-700'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Line 1: Title & Price */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs sm:text-[13px] font-bold text-neutral-900 uppercase tracking-tight font-sans line-clamp-1 group-hover:text-neutral-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] font-bold text-neutral-900 font-sans shrink-0">
                      ₦{display.toLocaleString()}
                    </p>
                  </div>

                  {/* Line 2: Rating */}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-sans">
                      <span className="text-amber-500 text-xs">★</span>
                      <span className="font-semibold text-neutral-700">4.8</span>
                      <span className="text-neutral-400">(300 Review)</span>
                    </div>
                    {onSale ? (
                      <span className="text-[11px] text-neutral-400 line-through font-sans">
                        ₦{minPrice.toLocaleString()}
                      </span>
                    ) : null}
                  </div>
                </Link>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
