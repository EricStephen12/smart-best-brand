'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import CartDrawer from './CartDrawer'
import { useCart } from '@/lib/cart-context'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state, toggleCart } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm'
        : 'bg-white border-b border-slate-50'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">

          {/* Left Navigation: Power Group */}
          <nav className="hidden md:flex items-center space-x-10 flex-1">
            <Link href="/products" className="text-blue-950 font-black hover:text-sky-600 transition-colors text-[10px] uppercase tracking-[0.3em]">
              Shop
            </Link>
            <Link href="/about" className="text-blue-950 font-black hover:text-sky-600 transition-colors text-[10px] uppercase tracking-[0.3em]">
              Legacy
            </Link>
          </nav>

          {/* Mobile Menu Trigger - Left (Mobile Only) */}
          <div className="md:hidden flex-1 flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-blue-950"
            >
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo: Centered Masthead (Reference Style) */}
          <Link href="/" className="flex items-center flex-shrink-0 px-2 sm:px-8 group">
            <div
              className={`tracking-widest transition-all duration-500 leading-none text-blue-950 font-black ${isScrolled ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`}
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              SMARTBEST<span className="text-sky-600">BRANDS</span>
            </div>
          </Link>

          {/* Right Navigation: Action Group */}
          <div className="flex items-center justify-end gap-4 sm:gap-10 flex-1">
            <nav className="hidden md:flex items-center space-x-10">
              <Link href="/contact" className="text-blue-950 font-black hover:text-sky-600 transition-colors text-[10px] uppercase tracking-[0.3em]">
                Contact
              </Link>
              <Link href="/account" className="text-blue-950 font-black hover:text-sky-600 transition-colors text-[10px] uppercase tracking-[0.3em]">
                Account
              </Link>
            </nav>

            {/* Cart Button: Integrated */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className="p-2 transition-colors relative text-blue-950 hover:text-sky-600"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {state.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-lg">
                  {state.items.length}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation: Simplified */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMenuOpen ? 1 : 0,
            height: isMenuOpen ? 'auto' : 0
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-8 space-y-6 border-t border-slate-100 bg-white">
            {['Shop', 'Legacy', 'Contact', 'Account'].map((item) => (
              <Link
                key={item}
                href={item === 'Shop' ? '/products' : item === 'Legacy' ? '/about' : `/${item.toLowerCase()}`}
                className="block transition-colors uppercase text-[10px] font-black tracking-[0.3em] text-blue-950 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      <CartDrawer isOpen={state.isOpen} onClose={toggleCart} />
    </motion.header>
  )
}
