'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { PRICE_RANGES } from '@/lib/constants'

type ShopBrand = { id: string; name: string }
type ShopCategory = { id: string; name: string; slug?: string | null }
type ShopSize = { id: string; label: string }

type ShopProduct = {
  id: string
  name: string
  slug: string
  brandId: string
  images: string[]
  brand?: { name: string } | null
  categories: Array<{ categoryId: string; category?: { name: string } | null }>
  variants: Array<{
    sizeId: string
    price: number
    promoPrice: number | null
  }>
}

const chipBase =
  'px-4 py-1.5 text-[11px] font-medium rounded-full border transition-colors'
const chipActive = 'bg-brand-primary text-white border-brand-primary'
const chipIdle = 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900'

export default function ShopSection({
  initialProducts,
  brands,
  categories,
  sizes,
}: {
  initialProducts: ShopProduct[]
  brands: ShopBrand[]
  categories: ShopCategory[]
  sizes: ShopSize[]
}) {
  const searchParams = useSearchParams()
  const [selectedBrandId, setSelectedBrandId] = useState('All')
  const [selectedCategoryId, setSelectedCategoryId] = useState('All')
  const [selectedSizeId, setSelectedSizeId] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState(initialProducts)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam && categories?.length) {
      const match = categories.find(
        (c) =>
          c.name.toLowerCase() === categoryParam.toLowerCase() ||
          c.slug?.toLowerCase() === categoryParam.toLowerCase()
      )
      if (match) setSelectedCategoryId(match.id)
    }

    const brandParam = searchParams.get('brand')
    if (brandParam && brands?.length) {
      const match = brands.find((b) => b.name.toLowerCase() === brandParam.toLowerCase())
      if (match) setSelectedBrandId(match.id)
    }

    const queryParam = searchParams.get('search') || searchParams.get('q')
    if (queryParam) {
      setSearchQuery(queryParam)
    }
  }, [searchParams, categories, brands])

  useEffect(() => {
    let result = initialProducts

    if (selectedBrandId !== 'All') {
      result = result.filter((p) => p.brandId === selectedBrandId)
    }

    if (selectedCategoryId !== 'All') {
      result = result.filter((p) => p.categories.some((c) => c.categoryId === selectedCategoryId))
    }

    if (selectedSizeId !== 'All') {
      result = result.filter((p) => p.variants.some((v) => v.sizeId === selectedSizeId))
    }

    if (selectedPriceRange !== 'All') {
      const range = PRICE_RANGES.find((r) => r.label === selectedPriceRange)
      if (range) {
        result = result.filter((p) => {
          const minProductPrice = Math.min(...p.variants.map((v) => v.promoPrice || v.price))
          return minProductPrice >= range.min && minProductPrice <= range.max
        })
      }
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand?.name || '').toLowerCase().includes(q)
      )
    }

    setFilteredProducts(result)
  }, [
    selectedBrandId,
    selectedCategoryId,
    selectedSizeId,
    selectedPriceRange,
    searchQuery,
    initialProducts,
  ])

  const clearFilters = () => {
    setSelectedBrandId('All')
    setSelectedCategoryId('All')
    setSelectedSizeId('All')
    setSelectedPriceRange('All')
    setSearchQuery('')
  }

  const isFiltered =
    selectedBrandId !== 'All' ||
    selectedCategoryId !== 'All' ||
    selectedSizeId !== 'All' ||
    selectedPriceRange !== 'All' ||
    searchQuery !== ''

  return (
    <section className="min-h-screen bg-white py-16 sm:py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-10 sm:mb-14">
          <div className="w-full max-w-sm relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-neutral-700 transition-colors" />
            <input
              type="text"
              placeholder="Search by name or brand…"
              className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-full text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6 mb-10 sm:mb-14">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                  showFilters
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {showFilters ? 'Hide filters' : 'Filters'}
              </button>

              {isFiltered ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-400 hover:text-neutral-900 transition-colors px-2"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </button>
              ) : null}
            </div>

            <p className="hidden md:block text-sm text-neutral-400">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          <AnimatePresence>
            {showFilters ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-8 pb-2"
              >
                <FilterGroup label="Brand">
                  <Chip
                    active={selectedBrandId === 'All'}
                    onClick={() => setSelectedBrandId('All')}
                    accent
                  >
                    All brands
                  </Chip>
                  {brands.map((brand) => (
                    <Chip
                      key={brand.id}
                      active={selectedBrandId === brand.id}
                      onClick={() => setSelectedBrandId(brand.id)}
                      accent
                    >
                      {brand.name}
                    </Chip>
                  ))}
                </FilterGroup>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FilterGroup label="Category">
                    <Chip
                      active={selectedCategoryId === 'All'}
                      onClick={() => setSelectedCategoryId('All')}
                    >
                      All
                    </Chip>
                    {categories.map((cat) => (
                      <Chip
                        key={cat.id}
                        active={selectedCategoryId === cat.id}
                        onClick={() => setSelectedCategoryId(cat.id)}
                      >
                        {cat.name}
                      </Chip>
                    ))}
                  </FilterGroup>

                  <FilterGroup label="Size">
                    <Chip
                      active={selectedSizeId === 'All'}
                      onClick={() => setSelectedSizeId('All')}
                    >
                      All sizes
                    </Chip>
                    {sizes.map((size) => (
                      <Chip
                        key={size.id}
                        active={selectedSizeId === size.id}
                        onClick={() => setSelectedSizeId(size.id)}
                      >
                        {size.label}
                      </Chip>
                    ))}
                  </FilterGroup>

                  <FilterGroup label="Price">
                    {PRICE_RANGES.map((range) => (
                      <Chip
                        key={range.label}
                        active={selectedPriceRange === range.label}
                        onClick={() => setSelectedPriceRange(range.label)}
                      >
                        {range.label}
                      </Chip>
                    ))}
                  </FilterGroup>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-20 sm:py-28 text-center">
            <p className="font-display text-2xl sm:text-3xl font-semibold text-neutral-900 mb-3">
              No products found
            </p>
            <p className="text-sm text-neutral-500 mb-8">
              Try a different search or clear your filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function Chip({
  children,
  active,
  onClick,
  accent = false,
}: {
  children: ReactNode
  active: boolean
  onClick: () => void
  accent?: boolean
}) {
  const activeClass = accent
    ? 'bg-sky-600 text-white border-sky-600'
    : chipActive

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${chipBase} ${active ? activeClass : chipIdle}`}
    >
      {children}
    </button>
  )
}

function ProductCard({ product, index }: { product: ShopProduct; index: number }) {
  const prices = product.variants.map((v) => v.price)
  const promos = product.variants
    .map((v) => v.promoPrice)
    .filter((p): p is number => typeof p === 'number' && p > 0)
  const minPrice = prices.length ? Math.min(...prices) : 0
  const minPromo = promos.length ? Math.min(...promos) : Infinity
  const display = minPromo !== Infinity ? minPromo : minPrice
  const onSale = minPromo !== Infinity && minPromo < minPrice
  const hasSecond = Boolean(product.images?.[1])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.24) }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        {/* Clean image canvas */}
        <div className="relative aspect-square bg-[#F5F3EF] rounded-2xl overflow-hidden mb-3">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-700 ${
                hasSecond
                  ? 'group-hover:opacity-0 group-hover:scale-105'
                  : 'group-hover:scale-105'
              }`}
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-neutral-300" />
            </div>
          )}

          {hasSecond ? (
            <Image
              src={product.images[1]}
              alt=""
              fill
              className="object-cover absolute inset-0 opacity-0 scale-105 transition-all duration-700 group-hover:opacity-100 group-hover:scale-100"
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            />
          ) : null}

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

        {/* Line 2: Category/Brand on left, Original price on right */}
        <div className="flex items-center justify-between gap-2 mt-1">
          <p className="text-[11px] font-medium text-neutral-400 font-sans truncate">
            {product.categories?.[0]?.category?.name || product.brand?.name || 'Original'}
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
}
