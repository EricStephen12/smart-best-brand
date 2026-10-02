'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import RecentSalesToast from './RecentSalesToast'
import ScrollToTop from './ScrollToTop'
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
  const isManagementRoute = Boolean(
    pathname?.startsWith('/account/products') ||
    pathname?.startsWith('/account/categories') ||
    pathname?.startsWith('/account/brands') ||
    pathname?.startsWith('/account/sizes') ||
    pathname?.startsWith('/account/banners') ||
    pathname?.startsWith('/account/promotions') ||
    pathname?.startsWith('/account/reviews') ||
    pathname?.startsWith('/account/blog') ||
    pathname?.startsWith('/account/delivery-locations') ||
    pathname?.startsWith('/account/customers') ||
    pathname?.startsWith('/account/contact-inquiries') ||
    pathname?.startsWith('/account/site') ||
    pathname?.startsWith('/account/settings')
  )

  // Hide store chrome for admin backoffice and the checkout flow
  const hideHeaderFooter = isCheckout || isManagementRoute || (isAccount && isAdmin)

  return (
    <div className="min-h-screen bg-[var(--brand-bg)] flex flex-col">
      {!hideHeaderFooter && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {!hideHeaderFooter && <Footer />}
      {/* CartDrawer lives here — outside <header> — so it can portal over everything */}
      {!isCheckout && <CartDrawer isOpen={state.isOpen} onClose={toggleCart} />}
      {!hideHeaderFooter && <RecentSalesToast />}
      {!hideHeaderFooter && <ScrollToTop />}
    </div>
  )
}

