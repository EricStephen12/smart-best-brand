'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import SectionHeading from '@/components/SectionHeading'
import EditorialBackdrop from '@/components/EditorialBackdrop'

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

const PRICE_RANGES = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Under 50k', min: 0, max: 50000 },
  { label: '50k - 200k', min: 50000, max: 200000 },
  { label: '200k - 500k', min: 200000, max: 500000 },
  { label: 'Above 500k', min: 500000, max: Infinity },
]

const chipBase =
  'px-4 py-2 text-[10px] font-black tracking-[0.18em] uppercase border transition-colors'
const chipActive = 'bg-blue-950 text-white border-blue-950'
const chipIdle = 'bg-transparent text-blue-950/60 border-blue-950/15 hover:border-blue-950/40 hover:text-blue-950'

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
    <section className="relative min-h-screen bg-white py-16 sm:py-20 md:py-24 overflow-hidden border-t border-blue-950/5">
      <EditorialBackdrop text="Shop" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10 sm:mb-14">
          <SectionHeading
            eyebrow="Catalogue"
            title="All products"
            description="Mattresses, pillows & furniture — filter by brand, size, or price."
            className="!mb-0"
          />

          <div className="w-full max-w-md relative group shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-sky-700 transition-colors" />
            <input
              type="text"
              placeholder="Search by name or brand…"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-blue-950/15 text-sm font-medium text-blue-950 placeholder:text-stone-400 focus:outline-none focus:border-blue-950/40 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6 mb-10 sm:mb-14">
          <div className="flex items-center justify-between border-b border-blue-950/5 pb-5">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-5 py-3 text-[10px] font-black tracking-[0.2em] uppercase border transition-colors ${
                  showFilters
                    ? 'bg-blue-950 text-white border-blue-950'
                    : 'border-blue-950 text-blue-950 hover:bg-blue-950 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {showFilters ? 'Hide filters' : 'Filters'}
              </button>

              {isFiltered ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-blue-950 transition-colors px-2"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear filters
                </button>
              ) : null}
            </div>

            <p className="hidden md:block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-20 sm:py-28 text-center">
            <p className="font-playfair text-2xl sm:text-3xl font-semibold text-blue-950 mb-3">
              No products found
            </p>
            <p className="text-sm text-stone-500 mb-8">
              Try a different search or clear your filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex border border-blue-950 text-blue-950 px-10 py-3.5 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-blue-950 hover:text-white transition-colors"
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
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400">{label}</p>
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
  const category = product.categories?.[0]?.category?.name
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
        <div className="relative aspect-square bg-[var(--brand-bg)] overflow-hidden mb-3 border border-blue-950/5">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-700 ${
                hasSecond
                  ? 'group-hover:opacity-0 group-hover:scale-[1.03]'
                  : 'group-hover:scale-[1.03]'
              }`}
              sizes="(max-width:768px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-stone-300" />
            </div>
          )}

          {hasSecond ? (
            <Image
              src={product.images[1]}
              alt=""
              fill
              className="object-cover absolute inset-0 opacity-0 scale-105 transition-all duration-700 group-hover:opacity-100 group-hover:scale-100"
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
}
