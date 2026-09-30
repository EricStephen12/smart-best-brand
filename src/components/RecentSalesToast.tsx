'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'
import { getRecentSalesProducts } from '@/actions/products'

interface SaleNotification {
  id: string
  customerLocation: string
  productName: string
  productVariant: string
  timeAgo: string
  image: string
  productHref: string
}

const CITIES = [
  'Someone in Abuja',
  'Customer in Lagos',
  'Customer in Benin City',
  'Customer in Port Harcourt',
  'Someone in Ibadan',
  'Customer in Asaba',
  'Customer in Warri',
  'Customer in Enugu',
]

const TIME_AGOS = [
  '8 minutes ago',
  '14 minutes ago',
  '23 minutes ago',
  '37 minutes ago',
  '45 minutes ago',
  '1 hour ago',
]

export default function RecentSalesToast() {
  const [notifications, setNotifications] = useState<SaleNotification[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissedPermanently, setIsDismissedPermanently] = useState(false)

  // Fetch real products from database
  useEffect(() => {
    let isMounted = true

    async function loadRealProducts() {
      try {
        const res = await getRecentSalesProducts()
        if (res.success && res.data && res.data.length > 0 && isMounted) {
          const validProducts = res.data.filter((p: any) => p.images && p.images.length > 0)
          if (validProducts.length === 0) return

          const built: SaleNotification[] = validProducts.map((p: any, idx: number) => ({
            id: p.id,
            customerLocation: CITIES[idx % CITIES.length],
            productName: p.name,
            productVariant: p.variants?.[0]?.size?.label || p.brand?.name || 'Verified',
            timeAgo: TIME_AGOS[idx % TIME_AGOS.length],
            image: p.images[0],
            productHref: `/products/${p.slug}`,
          }))

          setNotifications(built)
        }
      } catch (err) {
        console.error('Failed to load recent sales products:', err)
      }
    }

    loadRealProducts()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    // Check if dismissed in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('sbb_dismiss_sales_toast')) {
      setIsDismissedPermanently(true)
      return
    }

    if (notifications.length === 0) return

    // Initial delay before first toast (6 seconds)
    const initialTimer = setTimeout(() => {
      setIsVisible(true)
    }, 6000)

    return () => clearTimeout(initialTimer)
  }, [notifications.length])

  useEffect(() => {
    if (isDismissedPermanently || notifications.length === 0) return

    if (isVisible) {
      // Keep visible for 6 seconds, then hide
      const hideTimer = setTimeout(() => {
        setIsVisible(false)
      }, 6000)
      return () => clearTimeout(hideTimer)
    } else {
      // Wait 18 seconds before showing next notification
      const showTimer = setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % notifications.length)
        setIsVisible(true)
      }, 18000)
      return () => clearTimeout(showTimer)
    }
  }, [isVisible, isDismissedPermanently, notifications.length])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissedPermanently(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sbb_dismiss_sales_toast', 'true')
    }
  }

  // If dismissed or no real products in database, DO NOT show any mock data
  if (isDismissedPermanently || notifications.length === 0) return null

  const current = notifications[currentIdx]
  if (!current) return null

  return (
    <div className="fixed bottom-5 left-4 sm:left-6 z-40 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="pointer-events-auto bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-2xl rounded-2xl p-3 sm:p-3.5 max-w-[340px] sm:max-w-[360px] flex items-center gap-3.5 style-card"
          >
            {/* Thumbnail */}
            <Link
              href={current.productHref}
              className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60 group"
            >
              <Image
                src={current.image}
                alt={current.productName}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="56px"
              />
            </Link>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-1">
              <span className="text-[10px] text-stone-400 font-semibold block truncate">
                {current.customerLocation}
              </span>
              <Link
                href={current.productHref}
                className="text-xs font-bold text-blue-950 hover:text-sky-700 transition-colors block truncate"
              >
                {current.productName}
              </Link>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-stone-400 font-medium">{current.timeAgo}</span>
                <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                  Verified
                </span>
              </div>
            </div>

            {/* Dismiss X Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
