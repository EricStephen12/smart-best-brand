'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  ShoppingCartIcon,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Ruler,
  DollarSign,
  Tag,
  Layers,
  X,
  Image as ImageIcon
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ShopSectionProps {
  initialProducts: any[]
  brands: any[]
  categories: any[]
  sizes: any[]
}

const PRICE_RANGES = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Under 50k', min: 0, max: 50000 },
  { label: '50k - 200k', min: 50000, max: 200000 },
  { label: '200k - 500k', min: 200000, max: 500000 },
  { label: 'Above 500k', min: 500000, max: Infinity }
]

export default function ShopSection({ initialProducts, brands, categories, sizes }: ShopSectionProps) {
  const [selectedBrandId, setSelectedBrandId] = useState('All')
  const [selectedCategoryId, setSelectedCategoryId] = useState('All')
  const [selectedSizeId, setSelectedSizeId] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState(initialProducts)
  const [showFilters, setShowFilters] = useState(false)

  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  useEffect(() => {
    let result = initialProducts

    // Brand Filter
    if (selectedBrandId !== 'All') {
      result = result.filter(p => p.brandId === selectedBrandId)
    }

    // Category Filter
    if (selectedCategoryId !== 'All') {
      result = result.filter(p => p.categories.some((c: any) => c.categoryId === selectedCategoryId))
    }

    // Size Filter
    if (selectedSizeId !== 'All') {
      result = result.filter(p => p.variants.some((v: any) => v.sizeId === selectedSizeId))
    }

    // Price Filter
    if (selectedPriceRange !== 'All') {
      const range = PRICE_RANGES.find(r => r.label === selectedPriceRange)
      if (range) {
        result = result.filter(p => {
          const minProductPrice = Math.min(...p.variants.map((v: any) => v.promoPrice || v.price))
          return minProductPrice >= range.min && minProductPrice <= range.max
        })
      }
    }

    // Search Filter
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(result)
  }, [selectedBrandId, selectedCategoryId, selectedSizeId, selectedPriceRange, searchQuery, initialProducts])

  const clearFilters = () => {
    setSelectedBrandId('All')
    setSelectedCategoryId('All')
    setSelectedSizeId('All')
    setSelectedPriceRange('All')
    setSearchQuery('')
  }

  const isFiltered = selectedBrandId !== 'All' || selectedCategoryId !== 'All' || selectedSizeId !== 'All' || selectedPriceRange !== 'All' || searchQuery !== ''

  return (
    <section ref={containerRef} className="py-16 sm:py-24 md:py-32 bg-white selection:bg-sky-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Elite Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-16 sm:mb-24">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-1 h-8 bg-sky-600 rounded-full" />
              <span className="text-sm sm:text-xl md:text-2xl font-black tracking-[0.5em] text-sky-600 uppercase">Curated Collections</span>
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black text-blue-950 tracking-[-0.04em] leading-[0.9] font-display"
            >
              The Art of <br />
              <span className="text-sky-600 font-display">Modern Living.</span>
            </motion.h3>
          </div>

          {/* Elite Search */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="w-full max-w-md relative group"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by brand or design..."
              className="w-full pl-14 pr-6 py-4 sm:py-5 bg-slate-50 border border-transparent rounded-2xl focus:ring-0 focus:bg-white focus:border-sky-100 transition-all text-sm font-bold text-blue-950 placeholder:text-slate-300 shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>

        {/* Elite Filters Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="space-y-6 sm:space-y-8 mb-12 sm:mb-20"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest
                  ${showFilters ? 'bg-blue-950 text-white' : 'bg-slate-50 text-blue-950 hover:bg-slate-100'}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Refine Search'}
              </button>

              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors px-4"
                >
                  <X className="w-4 h-4" /> Reset Filters
                </button>
              )}
            </div>

            <p className="hidden md:block text-[10px] font-black text-slate-300 uppercase tracking-widest font-sans">
              Showing {filteredProducts.length} Results
            </p>
          </div>

          {/* Expanded Filter UI */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-8 pb-8"
              >
                {/* Brand Filter */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Tag className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Elite Partners</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedBrandId('All')}
                      className={`px-4 sm:px-6 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all
                        ${selectedBrandId === 'All'
                          ? 'bg-sky-600 text-white shadow-lg shadow-sky-200'
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      All Brands
                    </button>
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => setSelectedBrandId(brand.id)}
                        className={`px-4 sm:px-6 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all
                          ${selectedBrandId === brand.id
                            ? 'bg-sky-600 text-white shadow-lg shadow-sky-200'
                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                  {/* Category Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Layers className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Product Type</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategoryId('All')}
                        className={`px-5 py-2.5 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all
                          ${selectedCategoryId === 'All'
                            ? 'bg-blue-950 text-white shadow-xl'
                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        All Types
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategoryId(cat.id)}
                          className={`px-5 py-2.5 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all
                            ${selectedCategoryId === cat.id
                              ? 'bg-blue-950 text-white shadow-xl'
                              : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Ruler className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Global Sizing</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedSizeId('All')}
                        className={`px-5 py-2.5 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all
                          ${selectedSizeId === 'All'
                            ? 'bg-blue-950 text-white shadow-xl'
                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        All Sizes
                      </button>
                      {sizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setSelectedSizeId(size.id)}
                          className={`px-5 py-2.5 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all
                            ${selectedSizeId === size.id
                              ? 'bg-blue-950 text-white shadow-xl'
                              : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <DollarSign className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Price Range</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {PRICE_RANGES.map((range) => (
                        <button
                          key={range.label}
                          onClick={() => setSelectedPriceRange(range.label)}
                          className={`px-5 py-2.5 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all
                            ${selectedPriceRange === range.label
                              ? 'bg-blue-950 text-white shadow-xl'
                              : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 sm:gap-y-16">
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 sm:py-32 text-center"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6 sm:mb-8">
              <Search className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-blue-950 mb-2 font-display uppercase tracking-tight">No Matches Found</h3>
            <p className="text-slate-400 font-medium">Try adjusting your filters or search criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-6 sm:mt-8 text-sky-600 font-black text-[10px] uppercase tracking-[0.2em] hover:text-blue-950 transition-colors"
            >
              Exterminate All Filters &rarr;
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: any, index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const minPrice = Math.min(...product.variants.map((v: any) => v.price))
  const minPromoPrice = Math.min(...product.variants.filter((v: any) => v.promoPrice).map((v: any) => v.promoPrice))
  const finalMinPrice = minPromoPrice !== Infinity ? minPromoPrice : minPrice

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden mb-6 cursor-pointer rounded-2xl sm:rounded-none">
          {/* Primary Image */}
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-[1.5s] ease-out 
              ${isHovered ? 'scale-110 blur-[2px] opacity-0' : 'scale-100 opacity-100'}`}
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-slate-200" />
            </div>
          )}

          {/* Secondary Image - Reveal on Hover */}
          {product.images?.[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-[1s] ease-out
              ${isHovered ? 'scale-105 opacity-100' : 'scale-125 opacity-0'}`}
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          )}

          {/* Glassmorphic Brand Tag */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
            <span className="glass px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[8px] sm:text-[9px] font-black text-blue-950 uppercase tracking-[0.2em] font-sans">
              {product.brand?.name}
            </span>
          </div>

          {/* Promo Price Badge */}
          {minPromoPrice !== Infinity && (
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10">
              <span className="bg-blue-950 text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] shadow-xl font-sans">
                Elite Offer
              </span>
            </div>
          )}

          {/* Quick Add Overlay */}
          <div className={`absolute inset-0 bg-blue-950/20 transition-opacity duration-500 flex items-center justify-center
          ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button className="bg-white text-blue-950 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-500 scale-0 group-hover:scale-100 hover:bg-sky-600 hover:text-white">
              <ShoppingCartIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3 px-1 text-center lg:text-left">
          <p className="text-[10px] sm:text-xs font-black text-sky-600/40 uppercase tracking-[0.4em] font-inter">
            {product.categories?.[0]?.category?.name || 'Exclusive'}
          </p>
          <h4 className="text-lg sm:text-xl font-bold text-blue-950 tracking-tight group-hover:text-sky-600 transition-colors duration-300 h-14 sm:h-16 overflow-hidden leading-tight font-display uppercase">
            {product.name}
          </h4>
          <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 font-sans">
            <span className="text-lg sm:text-xl font-black text-blue-950">₦{finalMinPrice.toLocaleString()}</span>
            {minPromoPrice !== Infinity && minPromoPrice < minPrice && (
              <span className="text-[10px] sm:text-xs text-slate-300 line-through font-bold">₦{minPrice.toLocaleString()}</span>
            )}
          </div>

          {/* Reveal Link */}
          <div className="overflow-hidden pt-1">
            <motion.div
              animate={{ y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-sky-600 tracking-widest uppercase cursor-pointer justify-center lg:justify-start font-sans"
            >
              View Essence <ArrowRight className="w-3 h-3" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
