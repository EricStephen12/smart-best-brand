'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Menu, X, Search } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { useSiteSettings } from '@/components/site-settings-context'
import { brandNameParts } from '@/lib/site-settings'
import { NAV_LEFT, NAV_RIGHT, NAV_MOBILE, ANIMATION } from '@/lib/constants'

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state, toggleCart } = useCart()
  const { items: wishlistItems } = useWishlist()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const settings = useSiteSettings()
  const brand = brandNameParts(settings.siteName)
  const isHome = pathname === '/'
  const overHero = isHome && !isScrolled

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsMenuOpen(false) }, [pathname])

  let customNav: any = null
  try {
    if (settings.navLinksJson) {
      customNav = JSON.parse(settings.navLinksJson)
    }
  } catch {}

  const navLeft = (Array.isArray(customNav?.left) && customNav.left.length > 0)
    ? customNav.left
    : NAV_LEFT

  const navRight = (Array.isArray(customNav?.right) && customNav.right.length > 0)
    ? customNav.right
    : NAV_RIGHT

  const navMobile = (Array.isArray(customNav?.mobile) && customNav.mobile.length > 0)
    ? customNav.mobile
    : NAV_MOBILE

  const navLinkClass = overHero
    ? 'text-white/90 hover:text-white transition-colors text-[13px] font-medium'
    : 'text-neutral-700 hover:text-neutral-950 transition-colors text-[13px] font-medium'

  return (
    <header
      id="header"
      className={`${isHome ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 print:hidden transition-all duration-500 will-change-transform ${
        overHero
          ? 'bg-transparent border-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
      }`}
    >
      {/* Announcement bar */}
      {settings.announcementEnabled && settings.announcementText && (
        <div id="announcement" className="bg-brand-primary text-white text-center py-2 px-4 text-[11px] font-medium tracking-wide">
          {settings.announcementLink ? (
            <Link
              href={settings.announcementLink}
              className="inline-flex items-center justify-center gap-2 hover:text-neutral-300 transition-colors"
            >
              <span>{settings.announcementText}</span>
              <span className="text-[10px] opacity-60 underline font-normal">Learn more →</span>
            </Link>
          ) : (
            <span>{settings.announcementText}</span>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-[68px] sm:h-[80px]">

          {/* Left nav — desktop */}
          <nav className="hidden md:flex items-center space-x-8 flex-1">
            {navLeft.map((item: any) => (
              <Link key={item.href} href={item.href} className={navLinkClass}>{item.label}</Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden flex-1 flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 -ml-2 ${overHero ? 'text-white' : 'text-neutral-900'}`}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo — center */}
          <Link href="/" className="flex items-center flex-shrink-0 px-1 sm:px-8 group">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.siteName}
                className={`w-auto object-contain transition-all duration-500 ${
                  isScrolled ? 'h-7 sm:h-8' : 'h-8 sm:h-10'
                }`}
              />
            ) : (
              <span
                className={`tracking-widest transition-all duration-500 leading-none font-black whitespace-nowrap ${
                  overHero ? 'text-white' : 'text-neutral-900'
                } ${isScrolled ? 'text-sm sm:text-lg' : 'text-base sm:text-xl'}`}
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {brand.lead}
                <span className={overHero ? 'text-white/70' : 'text-brand-accent'}>{brand.accent}</span>
              </span>
            )}
          </Link>

          {/* Right nav + icon actions */}
          <div className="flex items-center justify-end gap-3 sm:gap-8 flex-1">
            <nav className="hidden md:flex items-center space-x-8">
              {navRight.map((item: any) => (
                <Link key={item.href} href={item.href} className={navLinkClass}>{item.label}</Link>
              ))}
            </nav>

            {/* Search icon (visual) */}
            <button
              className={`p-2 hidden md:flex transition-colors ${
                overHero ? 'text-white/80 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className={`p-2 transition-colors relative ${
                overHero ? 'text-white/80 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              aria-label="Wishlist"
              title="Saved items"
            >
              <Heart className="h-[18px] w-[18px]" />
              {mounted && wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-primary text-white text-[9px] font-bold rounded-full h-[14px] w-[14px] flex items-center justify-center">
                  {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className={`p-2 transition-colors relative ${
                overHero ? 'text-white/80 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              {mounted && state.items.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-primary text-white text-[9px] font-bold rounded-full h-[14px] w-[14px] flex items-center justify-center">
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
          <nav className="py-5 space-y-4 border-t border-neutral-100">
            {navMobile.map((item: any) => (
              <Link
                key={item.label}
                href={item.href}
                className="block text-sm font-medium text-neutral-700 px-1 hover:text-neutral-950 transition-colors"
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
