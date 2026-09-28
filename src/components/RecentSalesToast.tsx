'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'

interface SaleNotification {
  id: string
  customerLocation: string
  productName: string
  productVariant: string
  timeAgo: string
  image: string
  productHref: string
}

const NOTIFICATIONS: SaleNotification[] = [
  {
    id: '1',
    customerLocation: 'Someone in Abuja',
    productName: 'Mouka Regal Orthopedic',
    productVariant: '6x6 King (10-Inch)',
    timeAgo: '12 minutes ago',
    image: '/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg',
    productHref: '/products',
  },
  {
    id: '2',
    customerLocation: 'Customer in Benin City',
    productName: 'Vitafoam Grandeur Mattress',
    productVariant: '6x6 Semi-Orthopedic',
    timeAgo: '24 minutes ago',
    image: '/images/hero/jason-wang-8J49mtYWu7E-unsplash.jpg',
    productHref: '/products',
  },
  {
    id: '3',
    customerLocation: 'Customer in Port Harcourt',
    productName: 'Royal Foam High-Density',
    productVariant: '4.5x6 Double Comfort',
    timeAgo: '38 minutes ago',
    image: '/images/hero/Luxury MasterBedroom - Nesreen Maher.jpeg',
    productHref: '/products',
  },
  {
    id: '4',
    customerLocation: 'Customer in Lagos Island',
    productName: 'Luxury Fiber Contour Pillow Set',
    productVariant: 'Pair of 2',
    timeAgo: '47 minutes ago',
    image: '/images/hero/mahmoud-azmy-MPd1Vcdvg1w-unsplash.jpg',
    productHref: '/products',
  },
]

export default function RecentSalesToast() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissedPermanently, setIsDismissedPermanently] = useState(false)

  useEffect(() => {
    // Check if dismissed in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('sbb_dismiss_sales_toast')) {
      setIsDismissedPermanently(true)
      return
    }

    // Initial delay before first toast (5 seconds)
    const initialTimer = setTimeout(() => {
      setIsVisible(true)
    }, 5000)

    return () => clearTimeout(initialTimer)
  }, [])

  useEffect(() => {
    if (isDismissedPermanently) return

    if (isVisible) {
      // Keep visible for 6 seconds, then hide
      const hideTimer = setTimeout(() => {
        setIsVisible(false)
      }, 6000)
      return () => clearTimeout(hideTimer)
    } else {
      // Wait 16 seconds before showing next notification
      const showTimer = setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % NOTIFICATIONS.length)
        setIsVisible(true)
      }, 16000)
      return () => clearTimeout(showTimer)
    }
  }, [isVisible, isDismissedPermanently])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissedPermanently(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sbb_dismiss_sales_toast', 'true')
    }
  }

  if (isDismissedPermanently) return null

  const current = NOTIFICATIONS[currentIdx]

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
