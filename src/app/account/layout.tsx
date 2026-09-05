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
  Percent,
  MapPin,
  Menu,
  X,
  Image as ImageIcon,
  Star,
  Palette,
  ArrowLeft,
  ChevronRight,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isSignedIn, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (!isLoading && !isSignedIn) {
      router.replace('/login');
    }
  }, [isLoading, isSignedIn, router]);

  if (isLoading || !isSignedIn) {
    return (
      <div className="h-[60vh] flex items-center justify-center bg-[#f7f6f3]">
        <div className="w-8 h-8 border-2 border-blue-950/20 border-t-blue-950 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#f7f6f3] gap-3 px-6 text-center">
        <p className="text-blue-950 font-bold text-lg">Unable to load account</p>
        <p className="text-slate-500 text-sm max-w-sm">
          Could not retrieve your user profile. Please try refreshing or signing in again.
        </p>
        <button
          onClick={() => logout()}
          className="mt-2 px-5 py-2.5 bg-blue-950 text-white rounded-xl text-sm font-semibold hover:bg-sky-800 transition-colors"
        >
          Sign Out
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

  const userInitial = (user.name || user.email || 'U')[0].toUpperCase();

  // ─────────────────────────────────────────────────────────────
  // 1. CUSTOMER ACCOUNT VIEW (Normal Storefront E-Commerce Portal)
  // ─────────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="bg-[#f7f6f3] min-h-[85vh] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Customer Profile Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-950 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                {userInitial}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-blue-950 tracking-tight">
                    {user.name || 'Valued Customer'}
                  </h1>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                    Customer Account
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">{user.email}</p>
              </div>
            </div>

            {/* Customer Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/account"
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  pathname === '/account'
                    ? 'bg-blue-950 text-white shadow-sm'
                    : 'bg-stone-100 text-slate-600 hover:bg-stone-200/80 hover:text-blue-950'
                }`}
              >
                Overview
              </Link>
              <Link
                href="/account/orders"
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  pathname.startsWith('/account/orders')
                    ? 'bg-blue-950 text-white shadow-sm'
                    : 'bg-stone-100 text-slate-600 hover:bg-stone-200/80 hover:text-blue-950'
                }`}
              >
                My Orders
              </Link>
              <Link
                href="/account/settings"
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  pathname.startsWith('/account/settings')
                    ? 'bg-blue-950 text-white shadow-sm'
                    : 'bg-stone-100 text-slate-600 hover:bg-stone-200/80 hover:text-blue-950'
                }`}
              >
                Settings
              </Link>
              <button
                onClick={() => logout()}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Customer Content Area */}
          <div>{children}</div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. ADMIN BACKOFFICE VIEW (Dedicated Management Sidebar)
  // ─────────────────────────────────────────────────────────────
  const closeSidebar = () => setIsSidebarOpen(false);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-stone-200/80 font-sans">
      <div className="p-6 border-b border-stone-100 flex items-center justify-between">
        <Link href="/" className="min-w-0 group" onClick={closeSidebar}>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-playfair text-lg font-black text-blue-950 tracking-tight">
              Smart Best Brands
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider">
            <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded">Store Admin</span>
          </div>
        </Link>
        <button
          className="md:hidden p-2 text-stone-400 hover:text-blue-950 transition-colors"
          onClick={closeSidebar}
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <NavItem href="/account" icon={LayoutDashboard} active={pathname === '/account'} onClick={closeSidebar}>Dashboard</NavItem>
        <NavItem href="/account/orders" icon={Package} active={pathname.startsWith('/account/orders')} onClick={closeSidebar}>Orders</NavItem>
        <NavItem href="/account/products" icon={ShoppingBag} active={pathname.startsWith('/account/products')} onClick={closeSidebar}>Products</NavItem>
        <NavItem href="/account/brands" icon={Tags} active={pathname.startsWith('/account/brands')} onClick={closeSidebar}>Brands</NavItem>
        <NavItem href="/account/categories" icon={Grid} active={pathname.startsWith('/account/categories')} onClick={closeSidebar}>Categories</NavItem>
        <NavItem href="/account/sizes" icon={Ruler} active={pathname.startsWith('/account/sizes')} onClick={closeSidebar}>Sizes</NavItem>
        <NavItem href="/account/delivery-locations" icon={MapPin} active={pathname.startsWith('/account/delivery-locations')} onClick={closeSidebar}>Delivery Regions</NavItem>
        <NavItem href="/account/promotions" icon={Percent} active={pathname.startsWith('/account/promotions')} onClick={closeSidebar}>Promotions</NavItem>
        <NavItem href="/account/banners" icon={ImageIcon} active={pathname.startsWith('/account/banners')} onClick={closeSidebar}>Banners</NavItem>
        <NavItem href="/account/reviews" icon={Star} active={pathname.startsWith('/account/reviews')} onClick={closeSidebar}>Reviews</NavItem>
        <NavItem href="/account/site" icon={Palette} active={pathname.startsWith('/account/site')} onClick={closeSidebar}>Site Appearance</NavItem>

        <div className="pt-4 mt-4 border-t border-stone-100 space-y-1">
          <NavItem href="/account/settings" icon={Settings} active={pathname.startsWith('/account/settings')} onClick={closeSidebar}>Settings</NavItem>
          <Link
            href="/products"
            onClick={closeSidebar}
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-stone-50 hover:text-blue-950 rounded-xl transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-slate-400" />
            <span>Back to Store</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-stone-200/80 bg-stone-50/50 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-950 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm">
            {userInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-blue-950 truncate">
              {user.name || 'Admin'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f7f6f3] text-blue-950 font-sans">
      <aside className="w-64 hidden md:flex flex-col flex-shrink-0 shadow-sm">
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
              className="fixed inset-0 bg-blue-950/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed inset-y-0 left-0 w-72 z-50 md:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden bg-white border-b border-stone-200/80 px-5 py-3.5 flex items-center justify-between">
          <Link href="/" className="font-playfair font-black text-base text-blue-950">
            Smart Best Brands
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/products"
              className="px-3 py-1.5 text-xs font-semibold text-blue-950 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors"
            >
              Store
            </Link>
            <button
              className="p-2 text-slate-600 hover:text-blue-950"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
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
      className={`flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-xl font-medium transition-all ${
        active
          ? 'bg-blue-950 text-white shadow-sm font-semibold'
          : 'text-slate-600 hover:bg-stone-100 hover:text-blue-950'
      }`}
    >
      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
      <span>{children}</span>
    </Link>
  );
}
