'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/cart-context'
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  MessageCircle,
  ShieldCheck,
  Truck,
  ChevronRight,
} from 'lucide-react'
import CustomRequestModal from '@/components/CustomRequestModal'
import ProductReviews, { type ReviewItem } from '@/components/ProductReviews'
import RelatedProducts from '@/components/RelatedProducts'
import EditorialBackdrop from '@/components/EditorialBackdrop'
import { getWhatsAppUrl } from '@/lib/contact-channels'
import toast from 'react-hot-toast'

interface ProductDetailViewProps {
  product: any
  reviews?: ReviewItem[]
  averageRating?: number
  reviewCount?: number
  relatedProducts?: any[]
  relatedCategoryLabel?: string
}

function stockLabel(stock: number) {
  if (stock <= 0) return { text: 'Out of stock', className: 'text-red-600' }
  if (stock <= 5) return { text: `Only ${stock} left`, className: 'text-amber-600' }
  return { text: 'In stock', className: 'text-emerald-700' }
}

export default function ProductDetailView({
  product,
  reviews = [],
  averageRating = 0,
  reviewCount = 0,
  relatedProducts = [],
  relatedCategoryLabel,
}: ProductDetailViewProps) {
  const { addToCart } = useCart()

  const initialVariant =
    product?.variants?.find((v: any) => v.price > 0 && v.stock > 0) ||
    product?.variants?.find((v: any) => v.price > 0) ||
    product?.variants?.[0] || { size: { label: 'Standard' }, price: 0, stock: 0 }

  const [selectedVariant, setSelectedVariant] = useState(initialVariant)
  const [activeImage, setActiveImage] = useState(product?.images?.[0] || '/images/placeholder.jpg')
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false)

  if (!product) return null

  const stock = typeof selectedVariant.stock === 'number' ? selectedVariant.stock : 0
  const availability = stockLabel(stock)
  const canAddToCart = selectedVariant.price > 0 && stock > 0
  const category = product.categories?.[0]?.category?.name
  const priceLabel =
    !selectedVariant.price || selectedVariant.price === 0
      ? 'Custom quote'
      : `₦${(selectedVariant.promoPrice || selectedVariant.price).toLocaleString()}`

  const handleWhatsAppOrder = () => {
    const isCustom = !selectedVariant.price || selectedVariant.price === 0
    const text = `Hello Smart Best Brands, I would like to ${isCustom ? 'request a custom size' : `order ${product.name} (${selectedVariant.size.label})`}${product.isNegotiable ? ' and discuss the price' : ''}.${!isCustom ? ` Price: ₦${(selectedVariant.promoPrice || selectedVariant.price).toLocaleString()}.` : ''} ${window.location.href}`
    const url = getWhatsAppUrl(text)
    if (!url) {
      toast.error('WhatsApp is not configured. Please use Contact.')
      return
    }
    window.open(url, '_blank')
  }

  const handleAddToCart = () => {
    if (!canAddToCart) {
      toast.error(stock <= 0 ? 'This size is out of stock' : 'This item cannot be added yet')
      return
    }
    addToCart(product, selectedVariant)
    toast.success('Added to cart')
  }

  const specs = [
    { label: 'Firmness', value: product.firmness },
    { label: 'Material', value: product.materials },
    { label: 'Warranty', value: product.warranty },
  ].filter((s) => s.value)

  return (
    <div className="relative pt-24 sm:pt-28 pb-20 sm:pb-24 bg-white border-t border-blue-950/5 overflow-hidden">
      <EditorialBackdrop text="Sleep" size="xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.2em] uppercase text-stone-400 hover:text-blue-950 transition-colors mb-8 sm:mb-12"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Gallery */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative aspect-[4/5] sm:aspect-[5/6] bg-[var(--brand-bg)] overflow-hidden border border-blue-950/5">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />
            </div>
            {product.images?.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden border transition-colors ${
                      activeImage === img
                        ? 'border-blue-950'
                        : 'border-blue-950/10 hover:border-blue-950/35'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Buy column */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start space-y-7">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-1 h-5 rounded-full bg-sky-600 shrink-0" />
                <p className="text-[11px] font-black tracking-[0.35em] uppercase text-sky-600">
                  {category || product.brand?.name || 'Product'}
                </p>
              </div>
              <h1 className="font-playfair text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-blue-950 tracking-tight leading-[1.08]">
                {product.name}
              </h1>
              {product.brand?.name ? (
                <p className="mt-3 text-sm text-stone-500">by {product.brand.name}</p>
              ) : null}

              {reviewCount > 0 ? (
                <a
                  href="#reviews"
                  className="inline-flex items-center gap-2 mt-4 text-sm text-stone-500 hover:text-blue-950 transition-colors"
                >
                  <span className="inline-flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.round(averageRating) ? 'fill-current' : 'text-stone-200'
                        }`}
                      />
                    ))}
                  </span>
                  {averageRating.toFixed(1)} · {reviewCount} review{reviewCount === 1 ? '' : 's'}
                </a>
              ) : null}
            </div>

            <div className="border-y border-blue-950/8 py-5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-playfair text-3xl sm:text-4xl font-semibold text-blue-950">
                  {priceLabel}
                </span>
                {selectedVariant.promoPrice && selectedVariant.price > 0 ? (
                  <span className="text-base text-stone-300 line-through">
                    ₦{selectedVariant.price.toLocaleString()}
                  </span>
                ) : null}
                {product.isNegotiable ? (
                  <span className="text-[10px] font-black tracking-[0.15em] uppercase text-sky-700">
                    Negotiable
                  </span>
                ) : null}
              </div>
              <p className={`mt-2 text-sm font-medium ${availability.className}`}>
                {availability.text}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400">
                  Size
                </p>
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(true)}
                  className="text-[11px] font-black tracking-[0.12em] uppercase text-sky-700 inline-flex items-center gap-1 hover:text-blue-950 transition-colors"
                >
                  Custom size <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => {
                  const active = selectedVariant.id === v.id
                  const out = v.stock <= 0
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      disabled={out && !active}
                      className={`min-w-[4.5rem] px-4 py-2.5 text-[11px] font-black tracking-[0.12em] uppercase border transition-colors ${
                        active
                          ? 'bg-blue-950 text-white border-blue-950'
                          : out
                            ? 'border-blue-950/10 text-stone-300 cursor-not-allowed'
                            : 'border-blue-950/20 text-blue-950 hover:border-blue-950'
                      }`}
                    >
                      {v.size.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {specs.length > 0 ? (
              <dl className="space-y-0">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between gap-4 py-3 border-b border-blue-950/6 text-sm"
                  >
                    <dt className="text-stone-400 tracking-wide">{spec.label}</dt>
                    <dd className="text-blue-950 font-medium text-right">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {product.description ? (
              <p className="text-stone-500 text-sm leading-relaxed">{product.description}</p>
            ) : null}

            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-950 text-white text-[11px] font-black tracking-[0.18em] uppercase py-4 hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to cart
              </button>
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full inline-flex items-center justify-center gap-2 border border-blue-950 text-blue-950 text-[11px] font-black tracking-[0.18em] uppercase py-4 hover:bg-blue-950 hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Order on WhatsApp
              </button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-500">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-700" />
                Authentic
              </span>
              <span className="inline-flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-700" />
                Delivery available
              </span>
            </div>
          </div>
        </div>

        <ProductReviews
          productId={product.id}
          productSlug={product.slug}
          reviews={reviews}
          averageRating={averageRating}
          count={reviewCount}
        />

        <RelatedProducts products={relatedProducts} categoryLabel={relatedCategoryLabel} />
      </div>

      <CustomRequestModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        productName={product.name}
      />
    </div>
  )
}
