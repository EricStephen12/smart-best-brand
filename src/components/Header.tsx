'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Menu, X } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { useSiteSettings } from '@/components/site-settings-context'
import { brandNameParts } from '@/lib/site-settings'

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state, toggleCart } = useCart()
  const { items: wishlistItems } = useWishlist()
  const [isScrolled, setIsScrolled] = useState(false)
  const settings = useSiteSettings()
  const brand = brandNameParts(settings.siteName)
  const isHome = pathname === '/'
  const overHero = isHome && !isScrolled

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setIsMenuOpen(false) }, [pathname])

  const linkClass = overHero
    ? 'text-white/90 hover:text-white transition-colors text-[10px] uppercase tracking-[0.3em] font-black'
    : 'text-blue-950 font-black hover:text-[var(--brand-accent)] transition-colors text-[10px] uppercase tracking-[0.3em]'

  return (
    <header
      id="header"
      className={`${isHome ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 print:hidden transition-all duration-500 will-change-transform ${
        overHero
          ? 'bg-transparent border-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-sm'
      }`}
    >
      {/* Announcement bar */}
      {settings.announcementEnabled && settings.announcementText && (
        <div id="announcement" className="bg-[var(--brand-primary)] text-white text-center py-2 px-4 text-xs font-semibold tracking-wide border-b border-white/10">
          {settings.announcementLink ? (
            <Link
              href={settings.announcementLink}
              className="inline-flex items-center justify-center gap-2 hover:text-sky-300 transition-colors"
            >
              <span>{settings.announcementText}</span>
              <span className="text-[10px] opacity-75 underline font-normal">Learn more →</span>
            </Link>
          ) : (
            <span>{settings.announcementText}</span>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">

          {/* Left nav — desktop */}
          <nav className="hidden md:flex items-center space-x-10 flex-1">
            <Link href="/products" className={linkClass}>Shop</Link>
            <Link href="/about" className={linkClass}>About</Link>
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden flex-1 flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 ${overHero ? 'text-white' : 'text-blue-950'}`}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo — center */}
          <Link href="/" className="flex items-center flex-shrink-0 px-1 sm:px-8 group overflow-hidden">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.siteName}
                className={`w-auto object-contain transition-all duration-500 ${
                  isScrolled ? 'h-7 sm:h-8' : 'h-9 sm:h-11'
                }`}
              />
            ) : (
              <span
                className={`tracking-widest transition-all duration-500 leading-none font-black whitespace-nowrap ${
                  overHero ? 'text-white' : 'text-blue-950'
                } ${isScrolled ? 'text-sm sm:text-xl' : 'text-base sm:text-2xl'}`}
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {brand.lead}
                <span className={overHero ? 'text-white/80' : 'text-brand-accent'}>{brand.accent}</span>
              </span>
            )}
          </Link>

          {/* Right nav — desktop + icon actions */}
          <div className="flex items-center justify-end gap-4 sm:gap-10 flex-1">
            <nav className="hidden md:flex items-center space-x-10">
              <Link href="/contact" className={linkClass}>Contact</Link>
              <Link href="/account" className={linkClass}>Account</Link>
            </nav>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className={`p-2 transition-colors relative ${
                overHero ? 'text-white hover:text-white/80' : 'text-blue-950 hover:text-[var(--brand-accent)]'
              }`}
              aria-label="Wishlist"
              title="Saved items"
            >
              <Heart className="h-6 w-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className={`p-2 transition-colors relative ${
                overHero ? 'text-white hover:text-white/80' : 'text-blue-950 hover:text-[var(--brand-accent)]'
              }`}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {state.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center">
                  {state.items.length > 9 ? '9+' : state.items.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={false}
          animate={{ opacity: isMenuOpen ? 1 : 0, height: isMenuOpen ? 'auto' : 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden overflow-hidden"
        >
          <nav className="py-6 space-y-5 border-t border-stone-100">
            {[
              { label: 'Shop', href: '/products' },
              { label: 'Wishlist', href: '/account/wishlist' },
              { label: 'About', href: '/about' },
              { label: 'FAQs', href: '/faqs' },
              { label: 'Contact', href: '/contact' },
              { label: 'Account', href: '/account' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block uppercase text-[10px] font-black tracking-[0.3em] text-blue-950 px-2 hover:text-sky-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      </div>
    </header>
  )
}
