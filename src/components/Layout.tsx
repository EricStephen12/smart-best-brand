'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import { useAuth } from '@/hooks/use-auth'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const { user } = useAuth()
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
    </div>
  )
}

