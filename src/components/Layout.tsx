'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const isAccountRow = pathname?.startsWith('/account')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {!isAccountRow && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {!isAccountRow && <Footer />}
    </div>
  )
}

