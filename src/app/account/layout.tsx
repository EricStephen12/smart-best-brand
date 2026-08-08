'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  Package,
  Grid,
  Ruler,
  Settings,
  LogOut,
  Home,
  History,
  Percent,
  MapPin,
  Menu,
  X,
  Image as ImageIcon,
  Star,
  Palette,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f7f6f3]">
        <div className="w-7 h-7 border-2 border-blue-950/20 border-t-blue-950 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#f7f6f3] gap-3 px-6 text-center">
        <p className="text-blue-950 font-semibold">Couldn’t load your account</p>
        <p className="text-slate-500 text-sm max-w-sm">
          You’re signed in, but your profile didn’t sync. Refresh once, or sign out and try again.
        </p>
        <button
          onClick={() => logout()}
          className="mt-2 px-5 py-2.5 bg-blue-950 text-white rounded-lg text-sm font-medium"
        >
          Sign out
        </button>
      </div>
    );
  }

  const isAdmin = user.role === 'ADMIN';
  const isManagementRoute =
    pathname.startsWith('/account/products') ||
    pathname.startsWith('/account/brands') ||
    pathname.startsWith('/account/promotions') ||
    pathname.startsWith('/account/delivery-locations') ||
    pathname.startsWith('/account/categories') ||
    pathname.startsWith('/account/sizes') ||
    pathname.startsWith('/account/banners') ||
    pathname.startsWith('/account/reviews') ||
    pathname.startsWith('/account/site');

  if (!isAdmin && isManagementRoute) {
    router.push('/account');
    return null;
  }

  const closeSidebar = () => setIsSidebarOpen(false);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-stone-200">
      <div className="px-5 py-5 border-b border-stone-200 flex items-center justify-between">
        <Link href="/" className="min-w-0" onClick={closeSidebar}>
          <p className="text-base font-semibold text-blue-950 truncate">Smart Best Brands</p>
          <p className="text-xs text-stone-500">{isAdmin ? 'Admin' : 'My account'}</p>
        </Link>
        <button className="md:hidden p-2 text-stone-400" onClick={closeSidebar} aria-label="Close menu">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {isAdmin ? (
          <>
            <NavItem href="/account" icon={LayoutDashboard} active={pathname === '/account'} onClick={closeSidebar}>Dashboard</NavItem>
            <NavItem href="/account/orders" icon={Package} active={pathname.startsWith('/account/orders')} onClick={closeSidebar}>Orders</NavItem>
            <NavItem href="/account/products" icon={ShoppingBag} active={pathname.startsWith('/account/products')} onClick={closeSidebar}>Products</NavItem>
            <NavItem href="/account/brands" icon={Tags} active={pathname.startsWith('/account/brands')} onClick={closeSidebar}>Brands</NavItem>
            <NavItem href="/account/categories" icon={Grid} active={pathname.startsWith('/account/categories')} onClick={closeSidebar}>Categories</NavItem>
            <NavItem href="/account/sizes" icon={Ruler} active={pathname.startsWith('/account/sizes')} onClick={closeSidebar}>Sizes</NavItem>
            <NavItem href="/account/delivery-locations" icon={MapPin} active={pathname.startsWith('/account/delivery-locations')} onClick={closeSidebar}>Delivery</NavItem>
            <NavItem href="/account/promotions" icon={Percent} active={pathname.startsWith('/account/promotions')} onClick={closeSidebar}>Promotions</NavItem>
            <NavItem href="/account/banners" icon={ImageIcon} active={pathname.startsWith('/account/banners')} onClick={closeSidebar}>Banners</NavItem>
            <NavItem href="/account/reviews" icon={Star} active={pathname.startsWith('/account/reviews')} onClick={closeSidebar}>Reviews</NavItem>
            <NavItem href="/account/site" icon={Palette} active={pathname.startsWith('/account/site')} onClick={closeSidebar}>Site</NavItem>
          </>
        ) : (
          <>
            <NavItem href="/account" icon={Home} active={pathname === '/account'} onClick={closeSidebar}>Home</NavItem>
            <NavItem href="/account/orders" icon={History} active={pathname.startsWith('/account/orders')} onClick={closeSidebar}>Orders</NavItem>
          </>
        )}

        <div className="pt-3 mt-3 border-t border-stone-100">
          <NavItem href="/account/settings" icon={Settings} active={pathname.startsWith('/account/settings')} onClick={closeSidebar}>Settings</NavItem>
        </div>
      </nav>

      <div className="p-4 border-t border-stone-200 space-y-3">
        <div>
          <p className="text-xs text-stone-500">Signed in</p>
          <p className="text-sm font-medium text-blue-950 truncate">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f7f6f3] text-blue-950">
      <aside className="w-60 hidden md:flex flex-col flex-shrink-0">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 left-0 w-72 z-50 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-semibold text-blue-950">
            Smart Best Brands
          </Link>
          <button className="p-2" onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({
  href,
  icon: Icon,
  children,
  active,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg transition-colors ${
        active
          ? 'bg-blue-950 text-white font-medium'
          : 'text-stone-600 hover:bg-stone-100 hover:text-blue-950'
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {children}
    </Link>
  );
}
