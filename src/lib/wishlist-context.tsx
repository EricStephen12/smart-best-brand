'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export interface WishlistItem {
  id: string
  name: string
  slug: string
  price: number
  promoPrice?: number | null
  image?: string
  brandName?: string
  categoryName?: string
  variants?: any[]
  addedAt: string
}

interface WishlistContextType {
  items: WishlistItem[]
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: any) => void
  removeItem: (productId: string) => void
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const WISHLIST_STORAGE_KEY = 'sbb-wishlist-v1'

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY)
      if (saved) {
        setItems(JSON.parse(saved))
      }
    } catch (err) {
      console.error('Failed to parse wishlist from storage:', err)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Sync back to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
      } catch (err) {
        console.error('Failed to persist wishlist to storage:', err)
      }
    }
  }, [items, isLoaded])

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId)
  }

  const toggleWishlist = (product: any) => {
    if (!product || !product.id) return

    setItems((prev) => {
      const exists = prev.some((i) => i.id === product.id)
      if (exists) {
        toast('Removed from your saved wishlist', { icon: '🤍' })
        return prev.filter((i) => i.id !== product.id)
      } else {
        const firstVariant = product.variants?.[0]
        const price = firstVariant?.price || 0
        const promoPrice = firstVariant?.promoPrice || null
        const image = product.images?.[0] || ''
        const brandName = product.brand?.name || undefined
        const categoryName = product.categories?.[0]?.category?.name || undefined

        const newItem: WishlistItem = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price,
          promoPrice,
          image,
          brandName,
          categoryName,
          variants: product.variants,
          addedAt: new Date().toISOString(),
        }

        toast.success('Saved to your wishlist', { icon: '❤️' })
        return [newItem, ...prev]
      }
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== productId))
    toast('Removed from your saved wishlist', { icon: '🤍' })
  }

  const clearWishlist = () => {
    setItems([])
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        isInWishlist,
        toggleWishlist,
        removeItem,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
