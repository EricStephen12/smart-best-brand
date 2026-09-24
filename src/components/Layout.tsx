'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/lib/cart-context'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const { state, toggleCart } = useCart()
  const isAccount = pathname?.startsWith('/account')
  const isAdmin = user?.role === 'ADMIN'
  const isCheckout = pathname?.startsWith('/checkout')

  // Hide store chrome for admin backoffice and the checkout flow
  const hideHeaderFooter = (isAccount && isAdmin) || isCheckout

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!hideHeaderFooter && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {!hideHeaderFooter && <Footer />}
      {/* CartDrawer lives here — outside <header> — so it can portal over everything */}
      {!isCheckout && <CartDrawer isOpen={state.isOpen} onClose={toggleCart} />}
    </div>
  )
}

