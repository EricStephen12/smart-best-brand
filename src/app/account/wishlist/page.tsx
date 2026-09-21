'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useWishlist } from '@/lib/wishlist-context'
import { useCart } from '@/lib/cart-context'
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleMoveToCart = (item: any) => {
    const defaultVariant =
      item.variants?.find((v: any) => v.stock > 0 && v.price > 0) ||
      item.variants?.[0]

    if (!defaultVariant || defaultVariant.stock <= 0) {
      toast.error('This product is currently out of stock')
      return
    }

    addToCart(item, defaultVariant)
    toast.success(`${item.name} added to your bag`)
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">
              My Saved Items
            </h1>
            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Keep track of products you love and quickly add them to your cart.
          </p>
        </div>

        {items.length > 0 ? (
          <button
            type="button"
            onClick={clearWishlist}
            className="text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-rose-600 transition-colors self-start sm:self-auto"
          >
            Clear Wishlist
          </button>
        ) : null}
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-sm max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-500">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-blue-950 mb-2">Your wishlist is empty</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Tap the heart icon on any mattress or luxury home product to save it here for later.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-sky-700 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Collection</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const hasPromo = Boolean(item.promoPrice && item.promoPrice > 0)
            const displayPrice = hasPromo ? item.promoPrice : item.price

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm flex flex-col group hover:border-blue-950/25 transition-all"
              >
                {/* Image & Link */}
                <Link href={`/products/${item.slug}`} className="block relative aspect-[4/3] bg-stone-50 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                  )}

                  {hasPromo ? (
                    <span className="absolute top-3 left-3 bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                      Sale
                    </span>
                  ) : null}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeItem(item.id)
                    }}
                    aria-label="Remove from wishlist"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-white shadow transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Link>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {item.brandName || item.categoryName ? (
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1">
                        {item.brandName || item.categoryName}
                      </p>
                    ) : null}

                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-semibold text-blue-950 hover:text-sky-700 transition-colors line-clamp-1 block mb-2"
                    >
                      {item.name}
                    </Link>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-base font-bold text-blue-950 font-mono">
                        {displayPrice && displayPrice > 0
                          ? `₦${displayPrice.toLocaleString()}`
                          : 'Custom Quote'}
                      </span>
                      {hasPromo && item.price ? (
                        <span className="text-xs text-stone-400 line-through font-mono">
                          ₦{item.price.toLocaleString()}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-blue-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-sky-700 transition-colors shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                    <Link
                      href={`/products/${item.slug}`}
                      className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center text-slate-500 hover:text-blue-950 hover:border-stone-400 transition-all shrink-0"
                      title="View product details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
