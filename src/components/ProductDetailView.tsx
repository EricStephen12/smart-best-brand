'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import {
  Star,
  ShoppingBag,
  Heart,
  MessageCircle,
  Check,
  BadgePercent,
  Minus,
  Plus,
} from 'lucide-react'
import CustomRequestModal from '@/components/CustomRequestModal'
import ProductReviews, { type ReviewItem } from '@/components/ProductReviews'
import RelatedProducts from '@/components/RelatedProducts'
import { getWhatsAppUrl } from '@/lib/contact-channels'
import { useSiteSettings } from '@/components/site-settings-context'
import { PRODUCT_NEWSLETTER } from '@/lib/constants'
import toast from 'react-hot-toast'

const COLOR_NAME_TO_HEX: Record<string, string> = {
  'oatmeal bouclé': '#EBE7DF',
  'warm camel': '#9B7C5F',
  'charcoal black': '#1C1917',
  'chalk white': '#F5F5F0',
  'deep ocean navy': '#1E293B',
  'forest green': '#2D3B2D',
  'stone grey': '#78716C',
  'warm terracotta': '#9C4221',
  'cream beige': '#D6C7B2',
}

function getProductColorHex(name: string): string {
  const lower = name.toLowerCase().trim()
  if (COLOR_NAME_TO_HEX[lower]) return COLOR_NAME_TO_HEX[lower]
  if (lower.includes('white') || lower.includes('chalk')) return '#F8FAFC'
  if (lower.includes('black') || lower.includes('charcoal')) return '#18181B'
  if (lower.includes('navy') || lower.includes('blue')) return '#1E3A8A'
  if (lower.includes('green') || lower.includes('moss') || lower.includes('olive')) return '#166534'
  if (lower.includes('brown') || lower.includes('camel') || lower.includes('tan')) return '#92400E'
  if (lower.includes('grey') || lower.includes('gray')) return '#71717A'
  if (lower.includes('cream') || lower.includes('beige') || lower.includes('oatmeal')) return '#F5F5DC'
  if (lower.includes('gold') || lower.includes('yellow')) return '#D97706'
  if (lower.includes('red') || lower.includes('terracotta') || lower.includes('rust')) return '#991B1B'
  return '#CBD5E1'
}

interface ProductDetailViewProps {
  product: any
  reviews?: ReviewItem[]
  averageRating?: number
  reviewCount?: number
  relatedProducts?: any[]
  relatedCategoryLabel?: string
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
  const { isInWishlist, toggleWishlist } = useWishlist()
  const settings = useSiteSettings()

  const initialVariant =
    product?.variants?.find((v: any) => v.price > 0 && v.stock > 0) ||
    product?.variants?.find((v: any) => v.price > 0) ||
    product?.variants?.[0] || { size: { label: 'Standard' }, price: 0, stock: 0 }

  const availableColors: Array<{ name: string; hex: string }> = useMemo(() => {
    if (Array.isArray(product?.colors) && product.colors.length > 0) {
      return product.colors
        .filter((c: string) => Boolean(c && c.trim()))
        .map((c: string) => ({
          name: c.trim(),
          hex: getProductColorHex(c),
        }))
    }
    return []
  }, [product?.colors])

  const [selectedVariant, setSelectedVariant] = useState(initialVariant)
  const [activeImage, setActiveImage] = useState(product?.images?.[0] || '')
  const [selectedColor, setSelectedColor] = useState<string>(() => {
    if (Array.isArray(product?.colors) && product.colors.length > 0) {
      return product.colors[0]?.trim() || ''
    }
    return ''
  })
  const [quantity, setQuantity] = useState(1)
  const [activeTabId, setActiveTabId] = useState<string>('')
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Build tabs dynamically based strictly on available data
  const tabs = useMemo(() => {
    const list: Array<{ id: string; label: string; content: React.ReactNode }> = []

    if (product?.description && product.description.trim()) {
      list.push({
        id: 'description',
        label: 'Description',
        content: (
          <div className="space-y-4">
            {product.description.split(/\n+/).filter(Boolean).map((para: string, idx: number) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        ),
      })
    }

    if (product?.dimensions && product.dimensions.trim()) {
      list.push({
        id: 'dimensions',
        label: 'Dimensions',
        content: (
          <div className="space-y-4">
            {product.dimensions.split(/\n+/).filter(Boolean).map((para: string, idx: number) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        ),
      })
    }

    const hasMaterialsCare = Boolean(product?.materialsCare && product.materialsCare.trim())
    const hasMaterials = Boolean(product?.materials && product.materials.trim())
    if (hasMaterialsCare || hasMaterials) {
      list.push({
        id: 'materials',
        label: 'Materials & care',
        content: (
          <div className="space-y-4">
            {hasMaterials ? (
              <p><strong>Composition / Materials:</strong> {product.materials}</p>
            ) : null}
            {hasMaterialsCare ? (
              product.materialsCare.split(/\n+/).filter(Boolean).map((para: string, idx: number) => (
                <p key={idx}>{para}</p>
              ))
            ) : null}
          </div>
        ),
      })
    }

    const shippingText = (product?.shippingDelivery && product.shippingDelivery.trim()) || (settings?.deliveryPolicy && settings.deliveryPolicy.trim())
    if (shippingText) {
      list.push({
        id: 'shipping',
        label: 'Shipping & delivery',
        content: (
          <div className="space-y-4">
            {shippingText.split(/\n+/).filter(Boolean).map((para: string, idx: number) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        ),
      })
    }

    return list
  }, [product, settings?.deliveryPolicy])

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0]

  const hasSpecs = Boolean(
    product?.brand?.name ||
    (product?.type && product.type.trim()) ||
    (product?.materials && product.materials.trim()) ||
    (product?.firmness && product.firmness.trim()) ||
    (product?.finishing && product.finishing.trim()) ||
    (product?.warranty && product.warranty.trim())
  )

  if (!product) return null

  const isSaved = mounted && isInWishlist(product.id)
  const stock = typeof selectedVariant.stock === 'number' ? selectedVariant.stock : 0
  const canAddToCart = selectedVariant.price > 0 && stock > 0
  const category = product.categories?.[0]?.category?.name || 'Furniture'
  const brandName = product.brand?.name || settings.siteName || 'Smart Best Brands'

  const currentPrice = selectedVariant.promoPrice || selectedVariant.price || 0
  const originalPrice = selectedVariant.price || 0
  const onSale = selectedVariant.promoPrice && selectedVariant.promoPrice < originalPrice
  const discountPercent = onSale ? Math.round(((originalPrice - selectedVariant.promoPrice) / originalPrice) * 100) : 0

  const handleAddToCart = () => {
    if (!canAddToCart) {
      toast.error(stock <= 0 ? 'This size is out of stock' : 'This item cannot be added yet')
      return
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedVariant)
    }
    toast.success(`Added ${quantity > 1 ? `${quantity} items` : 'item'} to cart`)
  }

  const handleWhatsAppOrder = () => {
    const text = `Hello ${brandName}, I would like to order ${product.name} (${selectedVariant.size?.label || 'Standard'})${selectedColor ? ` in ${selectedColor}` : ''}. Price: ₦${currentPrice.toLocaleString()}. Quantity: ${quantity}. ${window.location.href}`
    const url = getWhatsAppUrl(text, { whatsappNumber: settings.whatsappNumber })
    if (!url) {
      toast.error('WhatsApp is not configured. Please use Contact.')
      return
    }
    window.open(url, '_blank')
  }

  const handleNegotiateWhatsApp = () => {
    const text = `Hello ${brandName}, I would like to discuss pricing for ${product.name} (${selectedVariant.size?.label || 'Standard'}) currently listed at ₦${currentPrice.toLocaleString()}. What is your best offer? ${window.location.href}`
    const url = getWhatsAppUrl(text, { whatsappNumber: settings.whatsappNumber })
    if (!url) {
      toast.error('WhatsApp is not configured. Please use Contact.')
      return
    }
    window.open(url, '_blank')
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail) return
    toast.success('Thank you for subscribing to our stories and restocks.')
    setNewsletterEmail('')
  }

  return (
    <div className="bg-white">

      {/* ── 1. Breadcrumbs ── */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-4 text-xs font-sans text-neutral-400">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/products?category=${encodeURIComponent(category)}`} className="hover:text-neutral-900 transition-colors">
              {category}
            </Link>
          </li>
          <li>/</li>
          <li className="text-neutral-900 font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* ── 2. Main Product Section (Luma & Living 2-Column Layout) ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-4 pb-20 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7">
            {/* Main Image Frame */}
            <div className="relative aspect-[4/3] sm:aspect-square bg-[#F5F3EF] rounded-3xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage || 'default'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeImage || product.images?.[0] || '/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg'}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badges on image */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                {onSale ? (
                  <span className="bg-rose-600 text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Sale
                  </span>
                ) : (
                  <span className="bg-brand-primary text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Original
                  </span>
                )}
              </div>

              {/* Heart Wishlist Icon Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-neutral-800 hover:bg-white shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-rose-600' : 'text-neutral-700'}`} />
              </button>
            </div>

            {/* Thumbnail Row Below */}
            {product.images?.length > 1 ? (
              <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-4">
                {product.images.slice(0, 4).map((img: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F5F3EF] border-2 transition-all ${
                      activeImage === img
                        ? 'border-neutral-950 scale-[1.02] shadow-sm'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill unoptimized className="object-cover" sizes="160px" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-start font-sans">

            {/* Category */}
            <p className="text-xs font-semibold text-[#9B7C5F] uppercase tracking-wider mb-2">
              {category}
            </p>

            {/* Product Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-normal font-serif text-neutral-900 leading-[1.12] tracking-tight">
              {product.name}
            </h1>

            {/* Tagline / Subtitle */}
            <p className="text-xs sm:text-[13px] text-neutral-500 font-normal leading-relaxed mt-2.5">
              {product.description?.slice(0, 110) || 'Handcrafted with premium materials, designed for enduring comfort and timeless aesthetics.'}
            </p>

            {/* Star Rating — Real database data */}
            {reviewCount > 0 ? (
              <div className="flex items-center gap-1.5 mt-3 text-xs text-neutral-600">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(averageRating) ? 'fill-current text-amber-500' : 'text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-neutral-900 ml-1">{averageRating.toFixed(1)}</span>
                <span className="text-neutral-400">({reviewCount})</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 mt-3 text-xs text-neutral-400">
                <span>No reviews yet</span>
                <span>·</span>
                <a href="#reviews" className="underline hover:text-neutral-900">Be the first to review</a>
              </div>
            )}

            {/* Price Row */}
            <div className="flex items-baseline gap-3 mt-5 pb-6 border-b border-neutral-100">
              <span className="text-2xl sm:text-3xl font-bold text-neutral-900 font-sans tracking-tight">
                ₦{currentPrice.toLocaleString()}
              </span>
              {onSale ? (
                <>
                  <span className="text-sm sm:text-base text-neutral-400 line-through">
                    ₦{originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-rose-50 text-rose-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Save {discountPercent}%
                  </span>
                </>
              ) : null}
            </div>

            {/* Colour Swatches */}
            {availableColors.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="font-medium text-neutral-900">
                    Colour: <span className="text-neutral-500">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {availableColors.map((swatch) => (
                    <button
                      key={swatch.name}
                      type="button"
                      onClick={() => setSelectedColor(swatch.name)}
                      aria-label={swatch.name}
                      title={swatch.name}
                      style={{ backgroundColor: swatch.hex }}
                      className={`w-7 h-7 rounded-full border border-black/10 transition-all ${
                        selectedColor === swatch.name
                          ? 'ring-2 ring-offset-2 ring-neutral-900 scale-105'
                          : 'hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size / Variant Selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-medium text-neutral-900">Size</span>
                {product.allowCustomSize !== false ? (
                  <button
                    type="button"
                    onClick={() => setIsCustomModalOpen(true)}
                    className="text-xs font-medium text-[#9B7C5F] hover:text-neutral-900 underline transition-colors"
                  >
                    Custom size
                  </button>
                ) : null}
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
                      className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                        active
                          ? 'bg-brand-primary text-white'
                          : out
                          ? 'border border-neutral-200 text-neutral-300 cursor-not-allowed'
                          : 'border border-neutral-300 text-neutral-800 hover:border-neutral-900'
                      }`}
                    >
                      {v.size.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quantity & Add to Cart Row */}
            <div className="mt-8 flex items-center gap-3">
              {/* Quantity Pill */}
              <div className="inline-flex items-center border border-neutral-300 rounded-full px-3 py-2.5 gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-5 h-5 flex items-center justify-center text-neutral-500 hover:text-neutral-900"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center text-xs font-semibold tabular-nums text-neutral-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-5 h-5 flex items-center justify-center text-neutral-500 hover:text-neutral-900"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Add to Cart Button (Brand Navy) */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className="flex-1 btn-primary py-3.5 px-7 flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{stock <= 0 ? 'Out of stock' : 'Add to cart'}</span>
                <ShoppingBag className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Wishlist Text Link */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-rose-600' : 'text-neutral-500'}`} />
                <span>{isSaved ? 'Saved in wishlist' : 'Add to wishlist'}</span>
              </button>
            </div>

            {/* WhatsApp Direct Actions */}
            <div className="mt-5 pt-5 border-t border-neutral-100 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-brand-primary text-brand-primary text-xs font-semibold uppercase tracking-wider py-3 rounded-full hover:bg-brand-primary hover:text-white transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Order on WhatsApp</span>
              </button>
              {product.isNegotiable ? (
                <button
                  type="button"
                  onClick={handleNegotiateWhatsApp}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#F5F3EF] text-neutral-900 text-xs font-semibold uppercase tracking-wider py-3 rounded-full hover:bg-neutral-200 transition-colors"
                >
                  <BadgePercent className="w-3.5 h-3.5 text-[#9B7C5F]" />
                  <span>Negotiate Price</span>
                </button>
              ) : null}
            </div>

            {/* Feature Checklist - only features saved on the product */}
            {Array.isArray(product?.features) && product.features.filter((f: string) => f && f.trim()).length > 0 ? (
              <div className="mt-8 space-y-2.5 text-xs text-neutral-600">
                {product.features.filter((f: string) => f && f.trim()).map((item: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ) : null}

          </div>

        </div>
      </section>

      {/* ── 3. Product Information Tabs & Specifications ── */}
      {(tabs.length > 0 || hasSpecs) && (
        <section className="bg-[#F2ECE2] py-16 sm:py-20 border-y border-[#E5DCCE]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

            {/* Tab Navigation - Only shows tabs that exist for this product */}
            {tabs.length > 0 && (
              <div className="flex items-center gap-8 border-b border-[#E5DCCE] pb-4 mb-10 overflow-x-auto text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {tabs.map((tab) => {
                  const isActive = currentTab?.id === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTabId(tab.id)}
                      className={`pb-4 -mb-4 transition-colors relative whitespace-nowrap ${
                        isActive
                          ? 'text-neutral-900'
                          : 'hover:text-neutral-900'
                      }`}
                    >
                      {tab.label}
                      {isActive ? (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                      ) : null}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Tab Content & Optional Specs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 font-sans">

              {/* Left Column: Active tab content */}
              <div className={`${hasSpecs ? 'lg:col-span-7' : 'lg:col-span-12'} text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal`}>
                {currentTab?.content}
              </div>

              {/* Right Column: Key Specifications Grid - Only display specs that actually have values */}
              {hasSpecs && (
                <div className="lg:col-span-5 bg-white/70 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-[#E5DCCE] space-y-4">
                  {product?.brand?.name ? (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Brand</p>
                      <p className="text-xs sm:text-[13px] font-semibold text-neutral-900 mt-1">{product.brand.name}</p>
                    </div>
                  ) : null}

                  {product?.type && product.type.trim() ? (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Type / Category</p>
                      <p className="text-xs sm:text-[13px] font-semibold text-neutral-900 mt-1">{product.type}</p>
                    </div>
                  ) : null}

                  {product?.materials && product.materials.trim() ? (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Core / Materials</p>
                      <p className="text-xs sm:text-[13px] font-semibold text-neutral-900 mt-1">{product.materials}</p>
                    </div>
                  ) : null}

                  {product?.firmness && product.firmness.trim() ? (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Firmness / Comfort</p>
                      <p className="text-xs sm:text-[13px] font-semibold text-neutral-900 mt-1">{product.firmness}</p>
                    </div>
                  ) : null}

                  {product?.finishing && product.finishing.trim() ? (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Cover &amp; Finishing</p>
                      <p className="text-xs sm:text-[13px] font-semibold text-neutral-900 mt-1">{product.finishing}</p>
                    </div>
                  ) : null}

                  {product?.warranty && product.warranty.trim() ? (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Manufacturer Warranty</p>
                      <p className="text-xs sm:text-[13px] font-semibold text-neutral-900 mt-1">{product.warranty}</p>
                    </div>
                  ) : null}
                </div>
              )}

            </div>

          </div>
        </section>
      )}

      {/* ── 4. Customer Reviews (Pure White) ── */}
      <ProductReviews
        productId={product.id}
        productSlug={product.slug}
        reviews={reviews}
        averageRating={averageRating}
        count={reviewCount}
      />

      {/* ── 5. You May Also Like Related Products (Pure White) ── */}
      <RelatedProducts
        products={relatedProducts}
        categoryLabel={relatedCategoryLabel}
      />

      {/* ── 6. Stay in the loop Newsletter (Navy Dark Background) ── */}
      <section className="bg-navy-dark text-white py-20 sm:py-24 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-normal font-serif text-white tracking-tight">
            {PRODUCT_NEWSLETTER.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-sans mt-3 mb-8 leading-relaxed">
            {PRODUCT_NEWSLETTER.subtitle}
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder={PRODUCT_NEWSLETTER.placeholder}
              required
              className="flex-1 bg-slate-900/60 border border-blue-900/40 rounded-full px-5 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-accent font-sans"
            />
            <button
              type="submit"
              className="bg-white text-neutral-900 hover:bg-neutral-200 rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-wider transition-colors font-sans shrink-0"
            >
              {PRODUCT_NEWSLETTER.buttonLabel}
            </button>
          </form>
        </div>
      </section>

      {/* Custom size inquiry modal */}
      <CustomRequestModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        productName={product.name}
      />

    </div>
  )
}
