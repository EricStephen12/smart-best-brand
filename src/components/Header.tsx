'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import CartDrawer from './CartDrawer'
import { useCart } from '@/lib/cart-context'
import { useSiteSettings } from '@/components/site-settings-context'
import { brandNameParts } from '@/lib/site-settings'

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state, toggleCart } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const settings = useSiteSettings()
  const brand = brandNameParts(settings.siteName)
  const isHome = pathname === '/'
  const overHero = isHome && !isScrolled

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const linkClass = overHero
    ? 'text-white/90 hover:text-white transition-colors text-[10px] uppercase tracking-[0.3em] font-black'
    : 'text-blue-950 font-black hover:text-[var(--brand-accent)] transition-colors text-[10px] uppercase tracking-[0.3em]'

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`${isHome ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 transition-all duration-500 will-change-transform ${
        overHero
          ? 'bg-transparent border-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm'
      }`}
    >
      {/* Top Announcement Bar */}
      {settings.announcementEnabled && settings.announcementText && (
        <div className="bg-[var(--brand-primary)] text-white text-center py-2 px-4 text-xs font-semibold tracking-wide border-b border-white/10 transition-colors">
          {settings.announcementLink ? (
            <Link
              href={settings.announcementLink}
              className="inline-flex items-center justify-center gap-2 hover:text-sky-300 transition-colors"
            >
              <span>{settings.announcementText}</span>
              <span className="text-[10px] opacity-75 underline font-normal">Learn more &rarr;</span>
            </Link>
          ) : (
            <span>{settings.announcementText}</span>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">
          <nav className="hidden md:flex items-center space-x-10 flex-1">
            <Link href="/products" className={linkClass}>
              Shop
            </Link>
            <Link href="/about" className={linkClass}>
              About
            </Link>
          </nav>

          <div className="md:hidden flex-1 flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 ${overHero ? 'text-white' : 'text-blue-950'}`}
              aria-label="Menu"
            >
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>

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
              <div
                className={`tracking-widest transition-all duration-500 leading-none font-black whitespace-nowrap ${
                  overHero ? 'text-white' : 'text-blue-950'
                } ${isScrolled ? 'text-sm sm:text-xl' : 'text-base sm:text-2xl'}`}
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {brand.lead}
                <span className={overHero ? 'text-white/80' : 'text-brand-accent'}>{brand.accent}</span>
              </div>
            )}
          </Link>

          <div className="flex items-center justify-end gap-4 sm:gap-10 flex-1">
            <nav className="hidden md:flex items-center space-x-10">
              <Link href="/contact" className={linkClass}>
                Contact
              </Link>
              <Link href="/account" className={linkClass}>
                Account
              </Link>
            </nav>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className={`p-2 transition-colors relative ${
                overHero ? 'text-white hover:text-white/80' : 'text-blue-950 hover:text-[var(--brand-accent)]'
              }`}
              aria-label="Cart"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {state.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--brand-accent)] text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-lg">
                  {state.items.length}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMenuOpen ? 1 : 0,
            height: isMenuOpen ? 'auto' : 0,
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-8 space-y-6 border-t border-white/10 bg-white">
            {[
              { label: 'Shop', href: '/products' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
              { label: 'Account', href: '/account' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block transition-colors uppercase text-[10px] font-black tracking-[0.3em] text-blue-950 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      <CartDrawer isOpen={state.isOpen} onClose={toggleCart} />
    </motion.header>
  )
}
